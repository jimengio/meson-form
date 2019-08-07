import React, { ReactNode, CSSProperties } from "react";
import { row, column, flex } from "@jimengio/shared-utils";
import { css, cx } from "emotion";
import { IMesonFieldItem, EMesonFieldType, IMesonFieldItemHasValue, FuncMesonModifyForm, IMesonErrors, IMesonFormBase } from "./model/types";
import { DropdownArea } from "@jimengio/meson-display";

import { FormFooter, EMesonFooterLayout } from "./component/form-footer";
import MesonModal from "./component/modal";
import produce, { Draft } from "immer";
import MesonDrawer from "./component/drawer";
import { useMesonCore } from "./hook/meson-core";
import { showErrorByNames } from "./util/validation";
import { renderTextAreaItem, renderInputItem, renderNumberItem, renderSelectItem, renderSwitchItem, renderItemLayout } from "./renderer";
import { lingual } from "./lingual";
import Button from "antd/lib/button";

export interface MesonFormProps<T> {
  initialValue: T;
  items: IMesonFieldItem<T>[];
  onSubmit: (form: T, onServerErrors?: (x: IMesonErrors<T>) => void) => void;
  onReset?: () => void;
  onCancel?: () => void;
  className?: string;
  itemsClassName?: string /** items 所在区域容器的样式 */;
  labelClassName?: string;
  style?: CSSProperties;
  footerLayout?: EMesonFooterLayout;
  hideFooter?: boolean;
  renderFooter?: (isLoading: boolean, onSubmit: () => void, onCancel: () => void, form?: T) => ReactNode;
  isLoading?: boolean;
  onFieldChange?: (name: string, v: any, prevForm?: T, modifyFormObject?: FuncMesonModifyForm) => void;
  submitOnEdit?: boolean;
}

/** Main form component for Meson
 * Pick changes to MesonFormForwarded after changes in this component
 */
export function MesonForm<T = IMesonFormBase>(props: MesonFormProps<T>) {
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
  } = useMesonCore({
    initialValue: props.initialValue,
    items: props.items,
    submitOnEdit: props.submitOnEdit,
    onSubmit: props.onSubmit,
  });

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

        return renderItemLayout(idx, item, error, item.render(form[item.name], onChange, form, onCheck), props.labelClassName);
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
        return renderItemLayout(idx, item as any, error, item.renderMultiple(form, modifidForm, checkForm), props.labelClassName);
      }

      return renderItemLayout(idx, item as any, error, renderValueItem(item), props.labelClassName);
    });
  };

  return (
    <div className={cx(column, flex, props.className)} style={props.style}>
      <div className={cx(flex, styleItemsContainer, props.itemsClassName)}>{renderItems(props.items)}</div>
      {props.hideFooter ? null : props.renderFooter ? (
        props.renderFooter(props.isLoading, onCheckSubmit, props.onCancel, form)
      ) : (
        <FormFooter isLoading={props.isLoading} layout={props.footerLayout} onSubmit={onCheckSubmit} onCancel={props.onCancel} />
      )}
    </div>
  );
}

/** Modal binding for meson form */
export function MesonFormModal<T>(props: {
  title: string;
  visible: boolean;
  initialValue: T;
  items: IMesonFieldItem<T>[];
  onSubmit: (form: T, onServerErrors?: (x: Partial<IMesonErrors<T>>) => void) => void;
  onClose: () => void;
  isLoading?: boolean;
  hideClose?: boolean;
  renderFooter?: (isLoading: boolean, onSubmit: () => void, onCancel: () => void, form?: T) => ReactNode;
}) {
  return (
    <MesonModal
      title={props.title}
      visible={props.visible}
      onClose={props.onClose}
      hideClose={props.hideClose}
      renderContent={() => {
        return (
          <MesonForm
            initialValue={props.initialValue}
            items={props.items}
            isLoading={props.isLoading}
            onSubmit={(form: T, onServerErrors: (x: IMesonErrors<T>) => void) => {
              props.onSubmit(form, onServerErrors);
            }}
            onCancel={props.onClose}
            className={styleForm}
            renderFooter={props.renderFooter}
          />
        );
      }}
    />
  );
}

/** Drawer binding for meson form */
export function MesonFormDrawer<T>(props: {
  title: string;
  visible: boolean;
  width?: number;
  initialValue: T;
  items: IMesonFieldItem<T>[];
  onSubmit: (form: T, onServerErrors?: (x: Partial<IMesonErrors<T>>) => void) => void;
  onClose: () => void;
  isLoading?: boolean;
  hideClose?: boolean;
  headerClassName?: string;
  renderFooter?: (isLoading: boolean, onSubmit: () => void, onCancel: () => void, form?: T) => ReactNode;
}) {
  return (
    <MesonDrawer
      title={props.title}
      visible={props.visible}
      width={props.width}
      onClose={props.onClose}
      hideClose={props.hideClose}
      headerClassName={props.headerClassName}
      renderContent={() => {
        return (
          <MesonForm
            initialValue={props.initialValue}
            items={props.items as IMesonFieldItem<any>[]}
            isLoading={props.isLoading}
            onSubmit={(form: T, onServerErrors: (x: IMesonErrors<T>) => void) => {
              props.onSubmit(form, onServerErrors);
            }}
            onCancel={props.onClose}
            className={styleForm}
            renderFooter={props.renderFooter}
          />
        );
      }}
    />
  );
}

/** Dropdown binding for meson form */
export function MesonFormDropdown<T>(props: {
  title: string;
  width?: number;
  initialValue: T;
  items: IMesonFieldItem<T>[];
  onSubmit: (form: T, onServerErrors?: (x: Partial<IMesonErrors<T>>) => void) => void;
  isLoading?: boolean;
  hideClose?: boolean;
  /** TODO, need better algorithm in dropdown area */
  alignToRight?: boolean;
  /** not implemented yet */
  headerClassName?: string;
  labelClassName?: string;
  itemsClassName?: string;
  renderFooter?: (isLoading: boolean, onSubmit: () => void, onCancel: () => void, form?: T) => ReactNode;
  children?: ReactNode;
}) {
  let footerRenderer = props.renderFooter;
  if (footerRenderer == null) {
    footerRenderer = (isLoading, onSubmit, onCancel, form) => {
      return (
        <div className={styleFooterContainer}>
          <Button className={styleFooterButton} type="primary" onClick={onSubmit}>
            {lingual.confirm}
          </Button>
        </div>
      );
    };
  }
  return (
    <DropdownArea
      title={props.title}
      width={props.width}
      hideClose={props.hideClose}
      alignToRight={props.alignToRight}
      renderContent={(onClose) => {
        return (
          <MesonForm
            initialValue={props.initialValue}
            items={props.items as IMesonFieldItem<any>[]}
            itemsClassName={props.itemsClassName}
            labelClassName={props.labelClassName}
            isLoading={props.isLoading}
            onSubmit={(form: T, onServerErrors: (x: IMesonErrors<T>) => void) => {
              props.onSubmit(form, onServerErrors);
              onClose();
            }}
            className={styleForm}
            renderFooter={footerRenderer}
          />
        );
      }}
    >
      {props.children}
    </DropdownArea>
  );
}

export { MesonFormForwarded } from "./form-forwarded";

let styleForm = css`
  flex: 1;
`;

let styleItemsContainer = css`
  overflow: auto;
  padding: 10px 10px 0 10px;
`;

let styleFooterButton = css`
  width: 100%;
`;

let styleFooterContainer = css`
  padding: 0px 12px 10px 12px;
`;
