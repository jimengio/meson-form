import React, { ReactText, ReactNode } from "react";
import { row, column, expand, displayFlex, flexWrap } from "@jimengio/flex-styles";
import { css, cx } from "emotion";
import { IMesonFieldItem, FuncMesonModifyForm, IMesonErrors, FieldValues, IMesonFieldBaseProps } from "./model/types";

import { useMesonCore } from "./hook/meson-core";
import { showErrorByNames } from "./util/validation";
import {
  renderTextAreaItem,
  renderInputItem,
  renderNumberItem,
  renderSelectItem,
  renderSwitchItem,
  renderDecorativeItem,
  renderItemLayout,
  ValueFieldContainer,
  renderDatePickerItem,
  renderTreeSelectItem,
  renderDropdownTreeItem,
} from "./renderer";
import { MesonFormProps } from "./form";
import { Draft } from "immer";
import { createItemKey } from "./util/string";

/**
 * 清空draft对象的value值
 * @param draft immer的draft对象
 */
function clearDraftValue<T>(draft: Draft<T>) {
  Object.keys(draft).forEach((key) => {
    if (key in draft) {
      draft[key as keyof Draft<T>] = undefined;
    }
  });
}

export interface MesonFormHandler {
  onSubmit(): void;
  onReset(): void;
}

export function ForwardForm<T extends FieldValues = FieldValues>(props: MesonFormProps<T>, ref: React.Ref<MesonFormHandler>) {
  let {
    formAny: form,
    updateForm,
    errors,
    updateErrors,
    onCheckSubmit,
    checkItem,
    onCheckSubmitWithValue,
    updateItem,
    checkItemWithValue,
    checkItemCustomMultiple,
    resetModified,
  } = useMesonCore<T, any>({
    initialValue: props.initialValue,
    items: props.items,
    submitOnEdit: props.submitOnEdit,
    onSubmit: props.onSubmit,
    onFieldChange: props.onFieldChange,
  });

  /**
   * 父组件可以通过ref调用onSubmit、onReset
   */
  React.useImperativeHandle(ref, () => ({
    onSubmit: () => {
      onCheckSubmit();
    },
    onReset: () => {
      updateForm(clearDraftValue);
      updateErrors(clearDraftValue);
      resetModified();

      if (props.onReset != null) {
        props.onReset();
      }
    },
  }));

  let renderValueItem = (item: IMesonFieldItem<T>) => {
    switch (item.type) {
      case "input":
        return renderInputItem(form, item, updateItem, checkItem, checkItemWithValue);
      case "textarea":
        return renderTextAreaItem(form, item, updateItem, checkItem);
      case "number":
        return renderNumberItem(form, item, updateItem, checkItem);
      case "switch":
        return renderSwitchItem(form, item, updateItem, checkItemWithValue);
      case "select":
        return renderSelectItem(form, item, updateItem, checkItem, checkItemWithValue);
      case "date-picker":
        return renderDatePickerItem(form, item, updateItem, checkItem, checkItemWithValue);
      case "tree-select":
        return renderTreeSelectItem(form, item, updateItem, checkItem, checkItemWithValue);
      case "dropdown-tree":
        return renderDropdownTreeItem(form, item, updateItem, checkItem, checkItemWithValue);
      case "custom":
      // already handled outside
    }
    return <div>Unknown type: {(item as any).type}</div>;
  };

  let renderItems = (items: IMesonFieldItem<T>[], itemWidth?: ReactText, prefixKey?: string): ReactNode => {
    return items.map((item, idx) => {
      const basePropsItem = item as IMesonFieldBaseProps<T>;
      const hideLabel = basePropsItem.hideLabel === false ? false : basePropsItem.hideLabel || props.noLabel;
      const fullWidth = basePropsItem.fullWidth === false ? false : basePropsItem.fullWidth || props.fullWidth;

      const key = createItemKey(item.type, idx, (item as any).name, prefixKey);

      if (item.shouldHide != null && item.shouldHide(form)) {
        return null;
      }
      if (item.onlyShow != null && !item.onlyShow(form)) {
        return null;
      }

      if (item.type === "group") {
        const nextItemWidth = item.itemWidth != null ? item.itemWidth : itemWidth;
        const mergeClassName = item.horizontal ? cx(displayFlex, flexWrap) : undefined;

        return (
          <div key={key} className={mergeClassName}>
            {renderItems(item.children, nextItemWidth, key)}
          </div>
        );
      }

      let name: string = (item as any).name;
      let error = name != null ? errors[name] : null;

      if (item.type === "custom") {
        let onChange = (value: any) => {
          updateItem(value, item);
        };

        let onCheck = (value: any) => {
          checkItemWithValue(value, item);
        };

        return renderItemLayout(
          key,
          item,
          error,
          item.render(form[item.name], onChange, form, onCheck),
          props.labelClassName,
          props.errorClassName,
          hideLabel,
          itemWidth
        );
      }

      if (item.type === "custom-multiple") {
        let modifidForm: FuncMesonModifyForm = (f) => {
          updateForm(f);
        };

        let checkForm = (xs: any) => {
          checkItemCustomMultiple(xs, item);
        };

        // errors related to multiple fields, need to extract
        let error = showErrorByNames(errors, item.names as string[]);

        // notice, item CustomMultiple not handled well in layout
        return renderItemLayout(
          key,
          item as any,
          error,
          item.renderMultiple(form, modifidForm, checkForm),
          props.labelClassName,
          props.errorClassName,
          hideLabel,
          itemWidth
        );
      }

      if (item.type === "nested") {
        return renderItemLayout(
          key,
          item as any,
          error,
          renderItems(item.children, undefined, key),
          props.labelClassName,
          props.errorClassName,
          hideLabel,
          itemWidth
        );
      }

      if (item.type === "decorative") {
        return renderDecorativeItem(key, form, item);
      }

      return renderItemLayout(
        key,
        item as any,
        error,
        <ValueFieldContainer fullWidth={fullWidth}>{renderValueItem(item)}</ValueFieldContainer>,
        props.labelClassName,
        props.errorClassName,
        hideLabel,
        itemWidth
      );
    });
  };

  return (
    <div className={cx(column, expand, props.className)} style={props.style}>
      <div className={cx(expand, styleItemsContainer)}>{renderItems(props.items)}</div>
    </div>
  );
}

export interface MesonFormForwardedProps<T> extends MesonFormProps<T> {
  formRef: React.Ref<MesonFormHandler>;
}

/** MesonFormForwarded is implemented based on MesonForm, edit in MesonForm first */
export function MesonFormForwarded<T>(props: MesonFormForwardedProps<T>) {
  const { formRef, ...otherProps } = props;
  const ForwardFormComponent = React.forwardRef<MesonFormHandler, MesonFormProps<T>>(ForwardForm);
  return <ForwardFormComponent {...otherProps} ref={formRef} />;
}

let styleItemsContainer = css`
  overflow: auto;
  padding: 24px 16px 24px;
`;
