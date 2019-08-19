import React from "react";
import { row, column, flex } from "@jimengio/shared-utils";
import { css, cx } from "emotion";
import { IMesonFieldItem, EMesonFieldType, FuncMesonModifyForm, IMesonErrors, IMesonFormBase, IMesonFieldBaseProps } from "./model/types";

import { useMesonCore } from "./hook/meson-core";
import { showErrorByNames } from "./util/validation";
import { renderTextAreaItem, renderInputItem, renderNumberItem, renderSelectItem, renderSwitchItem, renderItemLayout } from "./renderer";
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
        return renderSwitchItem(form, item, updateItem, checkItem);
      case EMesonFieldType.Select:
        return renderSelectItem(form, item, updateItem, checkItem, checkItemWithValue);
      case EMesonFieldType.Nested:
        return renderItems(item.children);
      case EMesonFieldType.Custom:
      // already handled outside
    }
    return <div>Unknown type: {(item as any).type}</div>;
  };

  let renderItems = (items: IMesonFieldItem<T>[]) => {
    return items.map((item, idx) => {
      const hideLabel = (item as IMesonFieldBaseProps<T>).hideLabel === false ? false : (item as IMesonFieldBaseProps<T>).hideLabel || props.hideLabel;

      if (item.shouldHide != null && item.shouldHide(form)) {
        return null;
      }

      if (item.type === EMesonFieldType.Group) {
        return <>{renderItems(item.children)}</>;
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

      return renderItemLayout(idx, item as any, error, renderValueItem(item), props.labelClassName, hideLabel);
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
