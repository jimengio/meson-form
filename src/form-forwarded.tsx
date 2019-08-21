import React, { ReactText } from "react";
import { row, column, flex, displayFlex, flexWrap } from "@jimengio/shared-utils";
import { css, cx } from "emotion";
import { IMesonFieldItem, EMesonFieldType, FuncMesonModifyForm, IMesonErrors, IMesonFormBase, IMesonFieldBaseProps } from "./model/types";

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
  ItemStyleBox,
} from "./renderer";
import { MesonFormProps } from "./form";
import { Draft } from "immer";

/**
 * 清空draft对象的value值
 * @param draft immer的draft对象
 */
function clearDraftValue<T>(draft: Draft<T>) {
  Object.keys(draft).forEach((key) => {
    if (key in draft) {
      draft[key] = undefined;
    }
  });
}

export interface MesonFormHandler {
  onSubmit(): void;
  onReset(): void;
}

export function ForwardForm<T = IMesonFormBase>(props: MesonFormProps<T>, ref: React.Ref<MesonFormHandler>) {
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
  } = useMesonCore<T>({
    initialValue: props.initialValue,
    items: props.items,
    submitOnEdit: props.submitOnEdit,
    onSubmit: props.onSubmit,
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
      case EMesonFieldType.Input:
        if (item.textarea) {
          return renderTextAreaItem(form, item, updateItem, checkItem);
        }
        return renderInputItem(form, item, updateItem, checkItem);

      case EMesonFieldType.Number:
        return renderNumberItem(form, item, updateItem, checkItem);
      case EMesonFieldType.Switch:
        return renderSwitchItem(form, item, updateItem, checkItemWithValue);
      case EMesonFieldType.Select:
        return renderSelectItem(form, item, updateItem, checkItem, checkItemWithValue);
      case EMesonFieldType.Custom:
      // already handled outside
    }
    return <div>Unknown type: {(item as any).type}</div>;
  };

  let renderItems = (items: IMesonFieldItem<T>[], itemWidth?: ReactText) => {
    return items.map((item, idx) => {
      const basePropsItem = item as IMesonFieldBaseProps<T>;
      const hideLabel = basePropsItem.hideLabel === false ? false : basePropsItem.hideLabel || props.noLabel;
      const fullWidth = basePropsItem.fullWidth === false ? false : basePropsItem.fullWidth || props.fullWidth;

      if (item.shouldHide != null && item.shouldHide(form)) {
        return null;
      }

      if (item.type === EMesonFieldType.Group) {
        const nextItemWidth = item.itemWidth != null ? item.itemWidth : itemWidth;

        if (item.contentInline) {
          return <div className={cx(displayFlex, flexWrap)}>{renderItems(item.children, nextItemWidth)}</div>;
        }

        return <>{renderItems(item.children, nextItemWidth)}</>;
      }

      let name: string = (item as any).name;
      let error = name != null ? errors[name] : null;

      if (item.type === EMesonFieldType.Custom) {
        let onChange = (value: any) => {
          updateItem(value, item);
        };

        let onCheck = (value: any) => {
          checkItemWithValue(value, item);
        };

        return renderItemLayout(idx, item, error, item.render(form[item.name], onChange, form, onCheck), props.labelClassName, hideLabel);
      }

      if (item.type === EMesonFieldType.CustomMultiple) {
        let modifidForm: FuncMesonModifyForm = (f) => {
          updateForm(f);
        };

        let checkForm = (xs: any) => {
          checkItemCustomMultiple(xs, item);
        };

        // errors related to multiple fields, need to extract
        let error = showErrorByNames(errors, item.names as string[]);

        // notice, item CustomMultiple not handled well in layout
        return renderItemLayout(idx, item as any, error, item.renderMultiple(form, modifidForm, checkForm), props.labelClassName, hideLabel);
      }

      if (item.type === EMesonFieldType.Nested) {
        return renderItemLayout(idx, item as any, error, renderItems(item.children), props.labelClassName, hideLabel);
      }

      if (item.type === EMesonFieldType.Decorative) {
        return renderDecorativeItem(form, item);
      }

      return renderItemLayout(
        idx,
        item as any,
        error,
        <ItemStyleBox fullWidth={fullWidth}>{renderValueItem(item)}</ItemStyleBox>,
        props.labelClassName,
        hideLabel,
        itemWidth
      );
    });
  };

  return (
    <div className={cx(column, flex, props.className)} style={props.style}>
      <div className={cx(flex, styleItemsContainer)}>{renderItems(props.items)}</div>
    </div>
  );
}

/** MesonFormForwarded is implemented based on MesonForm, edit in MesonForm first */
export let MesonFormForwarded = React.forwardRef(ForwardForm);

let styleItemsContainer = css`
  overflow: auto;
  padding: 24px 16px 24px;
`;
