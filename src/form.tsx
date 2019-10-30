import React, { ReactNode, CSSProperties, ReactText } from "react";
import { row, column, flex, flexWrap, displayFlex } from "@jimengio/shared-utils";
import { css, cx } from "emotion";
import { IMesonFieldItem, EMesonFieldType, FuncMesonModifyForm, IMesonErrors, IMesonFormBase, IMesonFieldBaseProps } from "./model/types";
import { DropdownArea } from "@jimengio/dropdown";

import { FormFooter, EMesonFooterLayout } from "./component/form-footer";
import { MesonModal, MesonDrawer } from "@jimengio/meson-modal";
import produce, { Draft } from "immer";
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
} from "./renderer";
import { lingual } from "./lingual";
import Button from "antd/lib/button";
import { createItemKey } from "./util/string";

export interface MesonFormProps<T> {
  initialValue: T;
  items: IMesonFieldItem<T>[];
  onSubmit: (form: T, onServerErrors?: (x: IMesonErrors<T>) => void) => void;
  onReset?: () => void;
  onCancel?: () => void;
  className?: string;
  itemsClassName?: string /** items 所在区域容器的样式 */;
  labelClassName?: string;
  errorClassName?: string;
  style?: CSSProperties;
  footerLayout?: EMesonFooterLayout;
  hideFooter?: boolean;
  noLabel?: boolean;
  fullWidth?: boolean;
  renderFooter?: (isLoading: boolean, onSubmit: () => void, onCancel: () => void, form?: T) => ReactNode;
  isLoading?: boolean;
  onFieldChange?: (name: string, v: any, prevForm?: T, modifyFormObject?: FuncMesonModifyForm) => void;
  submitOnEdit?: boolean;
}

/** Hooks API for customizing UIs */
export function useMesonItems<T = IMesonFormBase>(props: MesonFormProps<T>): [ReactNode, () => void, { formData: T }] {
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
        return renderInputItem(form, item, updateItem, checkItem, checkItemWithValue);

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

  let renderItems = (items: IMesonFieldItem<T>[], itemWidth?: ReactText, prefixKey?: string) => {
    return items.map((item, idx) => {
      const basePropsItem = item as IMesonFieldBaseProps<T>;
      const hideLabel = basePropsItem.hideLabel === false ? false : basePropsItem.hideLabel || props.noLabel;
      const fullWidth = basePropsItem.fullWidth === false ? false : basePropsItem.fullWidth || props.fullWidth;

      const key = createItemKey(item.type, idx, (item as any).name, prefixKey);

      if (item.shouldHide != null && item.shouldHide(form)) {
        return null;
      }

      if (item.type === EMesonFieldType.Group) {
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

      if (item.type === EMesonFieldType.Custom) {
        let onChange = (value: any) => {
          updateItem(value, item);
        };

        let onCheck = (value: any) => {
          checkItemWithValue(value, item);
        };

        return renderItemLayout(key, item, error, item.render(form[item.name], onChange, form, onCheck), props.labelClassName, props.errorClassName, hideLabel);
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
        return renderItemLayout(
          key,
          item as any,
          error,
          item.renderMultiple(form, modifidForm, checkForm),
          props.labelClassName,
          props.errorClassName,
          hideLabel
        );
      }

      if (item.type === EMesonFieldType.Nested) {
        return renderItemLayout(key, item as any, error, renderItems(item.children, undefined, key), props.labelClassName, props.errorClassName, hideLabel);
      }

      if (item.type === EMesonFieldType.Decorative) {
        return renderDecorativeItem(key, form, item);
      }

      return renderItemLayout(
        key,
        item as any,
        error,
        <ValueFieldContainer fullWidth={fullWidth} className={item.valueContainerClassName}>
          {renderValueItem(item)}
        </ValueFieldContainer>,
        props.labelClassName,
        props.errorClassName,
        hideLabel,
        itemWidth
      );
    });
  };

  return [<div className={cx(flex, styleItemsContainer, props.itemsClassName)}>{renderItems(props.items)}</div>, onCheckSubmit, { formData: form }];
}

/** Main form component for Meson
 * Pick changes to MesonFormForwarded after changes in this component
 */
export function MesonForm<T = IMesonFormBase>(props: MesonFormProps<T>) {
  let [formItems, onCheckSubmit, formInternals] = useMesonItems(props);

  return (
    <div className={cx(column, flex, props.className)} style={props.style}>
      <div className={cx(flex, styleItemsContainer, props.itemsClassName)}>{formItems}</div>
      {props.hideFooter ? null : props.renderFooter ? (
        props.renderFooter(props.isLoading, onCheckSubmit, props.onCancel, formInternals.formData)
      ) : (
        <FormFooter isLoading={props.isLoading} layout={props.footerLayout} onSubmit={onCheckSubmit} onCancel={props.onCancel} />
      )}
    </div>
  );
}

/** Modal binding for meson form */
export function MesonFormModal<T>(props: {
  initialValue: T;
  items: IMesonFieldItem<T>[];
  onSubmit: (form: T, onServerErrors?: (x: Partial<IMesonErrors<T>>) => void) => void;
  isLoading?: boolean;
  noLabel?: boolean;
  className?: string /** form className */;
  itemsClassName?: string /** items 所在区域容器的样式 */;
  labelClassName?: string;
  errorClassName?: string;
  style?: CSSProperties;
  renderFooter?: (isLoading: boolean, onSubmit: () => void, onCancel: () => void, form?: T) => ReactNode;

  // modal props
  title: string;
  visible: boolean;
  onClose: () => void;
  disableMoving?: boolean;
  width?: number;
  hideClose?: boolean;
  centerTitle?: boolean;
}) {
  return (
    <MesonModal
      title={props.title}
      visible={props.visible}
      onClose={props.onClose}
      hideClose={props.hideClose}
      disableMoving={props.disableMoving}
      width={props.width}
      centerTitle={props.centerTitle}
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
            className={cx(styleForm, props.className)}
            itemsClassName={props.itemsClassName}
            labelClassName={props.labelClassName}
            errorClassName={props.errorClassName}
            style={props.style}
            noLabel={props.noLabel}
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
  noLabel?: boolean;
  headerClassName?: string;
  className?: string;
  itemsClassName?: string /** items 所在区域容器的样式 */;
  labelClassName?: string;
  errorClassName?: string;
  style?: CSSProperties;
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
            className={cx(styleForm, props.className)}
            itemsClassName={props.itemsClassName}
            labelClassName={props.labelClassName}
            errorClassName={props.errorClassName}
            style={props.style}
            noLabel={props.noLabel}
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
