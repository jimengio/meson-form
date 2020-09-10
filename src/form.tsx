import React, { ReactNode, CSSProperties, ReactText } from "react";
import { column, expand, flexWrap, displayFlex } from "@jimengio/flex-styles";
import { css, cx } from "emotion";
import { IMesonFieldItem, FuncMesonModifyForm, IMesonErrors, FieldValues, FieldName, IMesonFieldBaseProps } from "./model/types";
import { DropdownArea } from "@jimengio/dropdown";

import { FormFooter, EMesonFooterLayout } from "./component/form-footer";
import { MesonModal, MesonDrawer } from "@jimengio/meson-modal";
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
  renderRadioItem,
  renderDatePickerItem,
  renderTreeSelectItem,
  renderDropdownSelectItem,
  renderDropdownTreeItem,
} from "./renderer";
import { lingual } from "./lingual";
import Button from "antd/lib/button";
import { createItemKey } from "./util/string";
import { getFormRenderer } from "./registered-renderer";
import { isFunction } from "lodash-es";

export interface MesonFormProps<T extends FieldValues, TD = any> {
  initialValue: T;
  items: IMesonFieldItem<T>[];
  /** when set onSubmit:null on useFormItems, make sure {onSubmit: f} is passed to onCheckSubmit */
  onSubmit: (form: T, onServerErrors?: (x: IMesonErrors<T>) => void, transferData?: TD) => void;
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
  onFieldChange?: (name: FieldName<T>, v: any, prevForm?: T, modifyFormObject?: FuncMesonModifyForm) => void;
  submitOnEdit?: boolean;
}

/** Hooks API for customizing UIs */
export function useMesonFields<T = FieldValues, TD = any>(props: MesonFormProps<T, TD>) {
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
  } = useMesonCore<T, TD>({
    initialValue: props.initialValue,
    items: props.items,
    submitOnEdit: props.submitOnEdit,
    onSubmit: props.onSubmit,
    onFieldChange: props.onFieldChange,
  });

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
      case "dropdown-select":
        return renderDropdownSelectItem(form, item, updateItem, checkItem, checkItemWithValue);
      case "radio":
        return renderRadioItem(form, item, updateItem, checkItemWithValue);
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
        return false;
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

      let name: FieldName<T> = (item as any).name;
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

      if (item.type === "registered") {
        let onChange = (value: any) => {
          updateItem(value, item);
        };

        let onCheck = (value: any) => {
          checkItemWithValue(value, item);
        };

        let renderFn = getFormRenderer(item.renderType);
        let valueNode: ReactNode;
        if (isFunction(renderFn)) {
          valueNode = renderFn(form[item.name], onChange, onCheck, form as any, item.renderOptions || {}, item);
        } else {
          valueNode = (
            <div className={styleRenderPlaceholder}>
              failed to find renderer for {JSON.stringify(item.renderType)} {JSON.stringify(item.renderOptions)}
            </div>
          );
        }

        return renderItemLayout(key, item, error, valueNode, props.labelClassName, props.errorClassName, hideLabel, itemWidth);
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

  let ui = (
    <div className={cx(expand, styleItemsContainer, props.itemsClassName)} data-area="meson-form">
      {renderItems(props.items)}
    </div>
  );

  return {
    ui,
    checkAndSubmit: onCheckSubmit,
    formData: form,
    /** Reset all form state */
    resetForm: (newForm: T) => {
      updateForm((d) => {
        return newForm;
      });
      updateErrors(() => {
        return {};
      });
    },
    updateInternalForm: updateForm,
    updateInternalErrors: updateErrors,
  };
}

/** Deprecating, better use `useMesonFields` */
export function useMesonItems<T = FieldValues>(props: MesonFormProps<T>) {
  let fieldsPlugin = useMesonFields(props);

  let formInternals = {
    formData: fieldsPlugin.formData,
    updateForm: fieldsPlugin.updateInternalForm,
    updateErrors: fieldsPlugin.updateInternalErrors,

    /** start new form lifecycle with given data. a business API */
    resetForm: fieldsPlugin.resetForm,
  };

  return [fieldsPlugin.ui, fieldsPlugin.checkAndSubmit, formInternals] as [ReactNode, typeof fieldsPlugin.checkAndSubmit, typeof formInternals];
}

/** Main form component for Meson
 * Pick changes to MesonFormForwarded after changes in this component
 */
export function MesonForm<T = FieldValues>(props: MesonFormProps<T>) {
  let fieldsPlugin = useMesonFields(props);

  return (
    <div className={cx(column, expand, props.className)} style={props.style}>
      <div className={cx(expand, styleItemsContainer, props.itemsClassName)}>{fieldsPlugin.ui}</div>
      {props.hideFooter ? null : props.renderFooter ? (
        props.renderFooter(props.isLoading, fieldsPlugin.checkAndSubmit, props.onCancel, fieldsPlugin.formData)
      ) : (
        <FormFooter isLoading={props.isLoading} layout={props.footerLayout} onSubmit={fieldsPlugin.checkAndSubmit} onCancel={props.onCancel} />
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
  disableBackdropClose?: boolean;
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
      disableBackdropClose={props.disableBackdropClose}
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
          <Button type="primary" children={lingual.confirm} className={styleFooterButton} onClick={onSubmit} data-action="submit" />
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
  padding: 10px 16px 0 16px;
`;

let styleFooterButton = css`
  width: 100%;
`;

let styleFooterContainer = css`
  padding: 0px 12px 10px 12px;
`;

let styleRenderPlaceholder = css`
  background-color: hsla(357, 91%, 55%, 1);
  color: white;
  padding: 0 6px;
`;
