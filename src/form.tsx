import React, { ReactNode, CSSProperties, ReactText } from "react";
import { row, column, flex, flexWrap, displayFlex } from "@jimengio/shared-utils";
import { css, cx } from "emotion";
import { IMesonFieldItem, EMesonFieldType, FuncMesonModifyForm, IMesonErrors, IMesonFormBase, IMesonFieldBaseProps } from "./model/types";
import { DropdownArea } from "@jimengio/meson-display";

import { FormFooter, EMesonFooterLayout } from "./component/form-footer";
import MesonModal from "./component/modal";
import produce, { Draft } from "immer";
import MesonDrawer from "./component/drawer";
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

export interface MesonFormProps<T> {
  initialValue: T;
  items: IMesonFieldItem<T>[];
  onSubmit: (form: T, onServerErrors?: (x: Partial<IMesonErrors<T>>) => void) => void;
  onReset?: () => void;
  onCancel?: () => void;
  className?: string;
  itemsClassName?: string /** items 所在区域容器的样式 */;
  labelClassName?: string;
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

        if (item.horizontal) {
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
        <ValueFieldContainer fullWidth={fullWidth}>{renderValueItem(item)}</ValueFieldContainer>,
        props.labelClassName,
        hideLabel,
        itemWidth
      );
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

export interface IMesonFormModalProps<T> extends MesonFormProps<T> {
  title: string;
  visible: boolean;
  onClose: () => void;
  hideClose?: boolean;
}

/** Modal binding for meson form */
export function MesonFormModal<T>(props: IMesonFormModalProps<T>) {
  const { title, visible, onClose, hideClose, className, onCancel, ...rest } = props;

  return (
    <MesonModal
      title={title}
      visible={visible}
      onClose={onClose}
      hideClose={hideClose}
      renderContent={() => {
        return (
          <MesonForm
            className={cx(styleForm, className)}
            onCancel={() => {
              onClose();
              onCancel && onCancel();
            }}
            {...rest}
          />
        );
      }}
    />
  );
}

export interface IMesonFormDrawerPorps<T> extends MesonFormProps<T> {
  title: string;
  visible: boolean;
  onClose: () => void;
  width?: number;
  hideClose?: boolean;
  headerClassName?: string;
}

/** Drawer binding for meson form */
export function MesonFormDrawer<T>(props: IMesonFormDrawerPorps<T>) {
  const { title, visible, onCancel, onClose, width, hideClose, headerClassName, className, ...rest } = props;

  return (
    <MesonDrawer
      title={title}
      visible={visible}
      width={width}
      onClose={onClose}
      hideClose={hideClose}
      headerClassName={headerClassName}
      renderContent={() => {
        return (
          <MesonForm
            className={cx(styleForm, className)}
            onCancel={() => {
              onClose();
              onCancel && onCancel();
            }}
            {...rest}
          />
        );
      }}
    />
  );
}

export interface IMesonFormDropdownProps<T> extends MesonFormProps<T> {
  title: string;
  width?: number;
  formClassNamae?: string;
  hideClose?: boolean;
  /** TODO, need better algorithm in dropdown area */
  alignToRight?: boolean;
  children?: ReactNode;
}

/** Dropdown binding for meson form */
export function MesonFormDropdown<T>(props: IMesonFormDropdownProps<T>) {
  const { title, width, hideClose, alignToRight, className, formClassNamae, children, renderFooter, onSubmit, ...rest } = props;
  let footerRenderer = renderFooter;
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
      title={title}
      width={width}
      className={className}
      hideClose={hideClose}
      alignToRight={alignToRight}
      renderContent={(onClose) => {
        return (
          <MesonForm
            onSubmit={(form: T, onServerErrors: (x: IMesonErrors<T>) => void) => {
              onSubmit(form, onServerErrors);
              onClose();
            }}
            className={cx(styleForm, formClassNamae)}
            renderFooter={footerRenderer}
            {...rest}
          />
        );
      }}
    >
      {children}
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
