import React, { SFC, ReactNode, CSSProperties, useState, useEffect } from "react";
import { row, column, flex } from "@jimengio/shared-utils";
import { css, cx } from "emotion";
import Input from "antd/lib/input";
import Switch from "antd/lib/switch";
import Select from "antd/lib/select";
import InputNumber from "antd/lib/input-number";
import { useImmer } from "use-immer";
import { lingual, formatString } from "./lingual";
import { IMesonFieldItem, EMesonFieldType, IMesonFieldItemHasValue, FuncMesonModifyForm, IStringObject } from "./model/types";
import { validateValueRequired, validateByMethods, validateItem } from "./util/validation";
import { traverseItems } from "./util/render";
import { RequiredMark } from "./component/misc";
import { FormFooter, EMesonFooterLayout } from "./component/form-footer";
import MesonModal from "./component/modal";
import TextArea from "antd/lib/input/TextArea";
import produce, { Draft } from "immer";
import MesonDrawer from "./component/drawer";

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

export interface MesonFormProps<T> {
  initialValue: T;
  items: IMesonFieldItem<T>[];
  onSubmit: (form: T, onServerErrors?: (x: IStringObject<T>) => void) => void;
  onReset?: () => void;
  onCancel?: () => void;
  className?: string;
  style?: CSSProperties;
  footerLayout?: EMesonFooterLayout;
  hideFooter?: boolean;
  renderFooter?: (isLoading: boolean, onSubmit: () => void, onCancel: () => void, form?: T) => ReactNode;
  isLoading?: boolean;
  onFieldChange?: (name: string, v: any, prevForm?: T, modifyFormObject?: FuncMesonModifyForm) => void;
  submitOnEdit?: boolean;
}

export function ForwardForm<T>(props: MesonFormProps<T>, ref: React.Ref<MesonFormHandler>) {
  let [form, updateForm] = useImmer(props.initialValue);
  let [errors, updateErrors] = useImmer({});
  let [modified, setModified] = useState<boolean>(false);

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
      setModified(false);

      if (props.onReset != null) {
        props.onReset();
      }
    },
  }));

  let onCheckSubmitWithValue = (specifiedForm?: T) => {
    let latestForm = specifiedForm;
    let currentErrors: IStringObject<T> = {};
    let hasErrors = false;
    traverseItems(props.items, (item: IMesonFieldItemHasValue<T>) => {
      if (item.shouldHide != null && item.shouldHide(latestForm)) {
        return null;
      }

      let result = validateItem(latestForm[item.name], item);

      if (result != null) {
        currentErrors[item.name] = result;
        hasErrors = true;
      }
    });

    updateErrors((draft: IStringObject<T>) => {
      return currentErrors;
    });

    if (!hasErrors) {
      props.onSubmit(latestForm, (serverErrors) => {
        updateErrors((draft: IStringObject<T>) => {
          return serverErrors;
        });
      });
      setModified(false);
    }
  };

  let onCheckSubmit = () => {
    onCheckSubmitWithValue(form);
  };

  let checkItem = (item: IMesonFieldItemHasValue<T>) => {
    if (props.submitOnEdit) {
      onCheckSubmitWithValue(form);
      return;
    }

    let result = validateItem(form[item.name], item);
    updateErrors((draft) => {
      draft[item.name] = result;
    });
  };

  let checkItemWithValue = (x: any, item: IMesonFieldItemHasValue<T>) => {
    if (props.submitOnEdit) {
      let newForm = produce(form, (draft) => {
        draft[item.name] = x;
      });
      onCheckSubmitWithValue(newForm);
      return;
    }

    let result = validateItem(x, item);
    updateErrors((draft) => {
      draft[item.name] = result;
    });
  };

  let updateItem = (x: any, item: IMesonFieldItemHasValue<T>) => {
    updateForm((draft: Draft<T>) => {
      draft[item.name] = x;
    });
    setModified(true);
    if (item.onChange != null) {
      item.onChange(x, updateForm);
    }
    if (props.onFieldChange != null) {
      props.onFieldChange(item.name, x, form, updateForm);
    }
  };

  let renderValueItem = (item: IMesonFieldItem<T>) => {
    switch (item.type) {
      case EMesonFieldType.Input:
        if (item.textarea) {
          return (
            <div className={cx(styleControlBase, styleTextareaBase)}>
              <TextArea
                value={form[item.name]}
                disabled={item.disabled}
                placeholder={item.placeholder || formatString(lingual.pleaseInputLabel, { label: item.label })}
                onChange={(event) => {
                  let newValue = event.target.value;
                  updateItem(newValue, item);
                }}
                onBlur={(event: any) => {
                  checkItem(item);
                }}
                // should use TextareaProps, but for convenience
                {...item.inputProps as any}
              />
            </div>
          );
        }
        return (
          <div className={styleControlBase}>
            <Input
              value={form[item.name]}
              disabled={item.disabled}
              type={item.inputType || "text"}
              placeholder={item.placeholder || formatString(lingual.pleaseInputLabel, { label: item.label })}
              onChange={(event) => {
                let newValue = event.target.value;

                // reset empty string to undefined by default, FR-96
                if (newValue.trim() === "") {
                  if (!item.useBlank) {
                    newValue = undefined;
                  }
                }

                updateItem(newValue, item);
              }}
              onBlur={() => {
                checkItem(item);
              }}
              {...item.inputProps}
            />
          </div>
        );
      case EMesonFieldType.Number:
        return (
          <div className={styleControlBase}>
            <InputNumber
              value={form[item.name]}
              disabled={item.disabled}
              placeholder={item.placeholder || formatString(lingual.pleaseInputLabel, { label: item.label })}
              onChange={(newValue) => {
                updateItem(newValue, item);
              }}
              onBlur={() => {
                checkItem(item);
              }}
              min={item.min}
              max={item.max}
            />
          </div>
        );
      case EMesonFieldType.Switch:
        return (
          <Switch
            checked={form[item.name]}
            className={styleSwitch}
            disabled={item.disabled}
            onChange={(value) => {
              updateItem(value, item);
            }}
          />
        );
      case EMesonFieldType.Select:
        let currentValue = form[item.name];
        if (item.translateNonStringvalue && currentValue != null) {
          currentValue = `${currentValue}`;
        }
        return (
          <Select
            value={currentValue}
            disabled={item.disabled}
            className={styleControlBase}
            placeholder={item.placeholder || formatString(lingual.pleaseInputLabel, { label: item.label })}
            onChange={(newValue) => {
              if (item.translateNonStringvalue && newValue != null) {
                let target = item.options.find((x) => `${x.value}` === newValue);
                newValue = target.value;
              }
              updateItem(newValue, item);
              checkItemWithValue(newValue, item);
            }}
            allowClear={item.allowClear}
            onBlur={() => {
              checkItem(item);
            }}
            {...item.selectProps}
          >
            {item.options.map((option) => {
              let value = option.value;
              if (item.translateNonStringvalue) {
                value = `${value}`;
              }
              return (
                <Select.Option value={value} key={option.key || value}>
                  {option.display}
                </Select.Option>
              );
            })}
          </Select>
        );
      case EMesonFieldType.Group:
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

      if (item.type === EMesonFieldType.Fragment) {
        return <>{renderItems(item.children)}</>;
      }

      let name: string = (item as any).name;
      let error = name != null ? errors[name] : null;

      let labelNode = (
        <div className={styleLabel}>
          {item.required ? <RequiredMark /> : null}
          {item.label}:
        </div>
      );

      if (item.label == null) {
        labelNode = <div className={styleLabel} />;
      }

      let errorNode = error != null ? <div className={styleError}>{error}</div> : null;

      if (item.type === EMesonFieldType.Custom) {
        let onChange = (value: any) => {
          updateItem(value, item);
        };

        let onCheck = (value: any) => {
          checkItemWithValue(value, item);
        };

        return (
          <div key={idx} className={cx(row, styleItemRow)}>
            {labelNode}
            <div className={cx(flex, column, styleValueArea, item.className)} style={item.style}>
              {item.render(form[item.name], onChange, form, onCheck)}
              <div className={styleErrorWrapper}>{errorNode}</div>
            </div>
          </div>
        );
      }

      return (
        <div key={idx} className={cx(row, styleItemRow)}>
          {labelNode}
          <div className={cx(flex, column, styleValueArea, item.className)} style={item.style}>
            {renderValueItem(item)}
            {errorNode}
          </div>
        </div>
      );
    });
  };

  return (
    <div className={cx(column, flex, props.className)} style={props.style}>
      <div className={cx(flex, styleItemsContainer)}>{renderItems(props.items)}</div>
      {!props.hideFooter && (
        <>
          {props.renderFooter ? (
            props.renderFooter(props.isLoading, onCheckSubmit, props.onCancel, form)
          ) : (
            <FormFooter isLoading={props.isLoading} layout={props.footerLayout} onSubmit={onCheckSubmit} onCancel={props.onCancel} />
          )}
        </>
      )}
    </div>
  );
}

export let MesonForm = React.forwardRef(ForwardForm);

export function MesonFormModal<T>(props: {
  title: string;
  visible: boolean;
  initialValue: T;
  items: IMesonFieldItem<T>[];
  onSubmit: (form: T, onServerErrors?: (x: IStringObject<T>) => void) => void;
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
            onSubmit={(form: T, onServerErrors: (x: IStringObject<T>) => void) => {
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

export function MesonFormDrawer<T>(props: {
  title: string;
  visible: boolean;
  width?: number;
  initialValue: T;
  items: IMesonFieldItem<T>[];
  onSubmit: (form: { [k: string]: any }, onServerErrors?: (x: IStringObject<T>) => void) => void;
  onClose: () => void;
  isLoading?: boolean;
  hideClose?: boolean;
  renderFooter?: (isLoading: boolean, onSubmit: () => void, onCancel: () => void, form?: T) => ReactNode;
}) {
  return (
    <MesonDrawer
      title={props.title}
      visible={props.visible}
      width={props.width}
      onClose={props.onClose}
      hideClose={props.hideClose}
      renderContent={() => {
        return (
          <MesonForm
            initialValue={props.initialValue}
            items={props.items}
            isLoading={props.isLoading}
            onSubmit={(form: T, onServerErrors: (x: IStringObject<T>) => void) => {
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

let styleForm = css`
  flex: 1;
`;

let styleLabel = css`
  color: hsla(0, 0%, 20%, 1);
  min-width: 120px;
  width: max-content;
  text-align: right;
  margin-right: 8px;
`;

let styleValueArea = css`
  overflow: auto;
`;

let styleItemRow = css`
  line-height: 32px;
  margin-bottom: 16px;
  font-size: 14px;
`;

let styleControlBase = css`
  min-width: 180px;
  width: 180px;
`;

let styleError = css`
  word-break: break-all;
  line-height: 1.5;
  color: red;
  padding: 4px 0px;
`;

let styleItemsContainer = css`
  overflow: auto;
  padding: 24px 16px 24px;
`;

let styleTextareaBase = css`
  width: 240px;
  min-width: 240px;
`;

/** 添加 wrapper 避免 error text flow 自动撑开到很大 */
let styleErrorWrapper = css`
  overflow: auto;
`;

let styleSwitch = css`
  &.ant-switch {
    margin: 4px 0;
  }
`;
