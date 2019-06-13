import React, { SFC, ReactNode, CSSProperties, useState, useEffect } from "react";
import { row, column, flex } from "@jimengio/shared-utils";
import { css, cx } from "emotion";
import Input from "antd/lib/input";
import Switch from "antd/lib/switch";
import Select from "antd/lib/select";
import InputNumber from "antd/lib/input-number";
import { useImmer } from "use-immer";
import { lingual, formatString } from "./lingual";
import { IMesonFieldItem, EMesonFieldType, IMesonFieldItemHasValue, ISimpleObject, FuncMesonModifyForm } from "./model/types";
import { validateValueRequired, validateByMethods, validateItem } from "./util/validation";
import { traverseItems } from "./util/render";
import { RequiredMark } from "./component/misc";
import { FormFooter, EMesonFooterLayout } from "./component/form-footer";
import MesonModal from "./component/modal";
import TextArea from "antd/lib/input/TextArea";
import produce, { Draft } from "immer";

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

export interface MesonFormProps {
  initialValue: any;
  items: IMesonFieldItem[];
  onSubmit: (form: { [k: string]: any }, onServerErrors?: (x: ISimpleObject) => void) => void;
  onReset?: () => void;
  onCancel?: () => void;
  className?: string;
  style?: CSSProperties;
  footerLayout?: EMesonFooterLayout;
  hideFooter?: boolean;
  renderFooter?: (isLoading: boolean, onSubmit: () => void, onCancel: () => void, from?: any) => ReactNode;
  isLoading?: boolean;
  onFieldChange?: (name: string, v: any, prevForm?: { [k: string]: any }, modifyFormObject?: FuncMesonModifyForm) => void;
  submitOnEdit?: boolean;
}

export let ForwardForm: React.RefForwardingComponent<MesonFormHandler, MesonFormProps> = (props, ref) => {
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

  let onCheckSubmitWithValue = (specifiedForm?: { [k: string]: any }) => {
    let latestForm = specifiedForm;
    let currentErrors: ISimpleObject = {};
    let hasErrors = false;
    traverseItems(props.items, (item: IMesonFieldItemHasValue) => {
      if (item.shouldHide != null && item.shouldHide(latestForm)) {
        return null;
      }

      let result = validateItem(latestForm[item.name], item);

      if (result != null) {
        currentErrors[item.name] = result;
        hasErrors = true;
      }
    });

    updateErrors((draft: ISimpleObject) => {
      return currentErrors;
    });

    if (!hasErrors) {
      props.onSubmit(latestForm, (serverErrors) => {
        updateErrors((draft: ISimpleObject) => {
          return serverErrors;
        });
      });
      setModified(false);
    }
  };

  let onCheckSubmit = () => {
    onCheckSubmitWithValue(form);
  };

  let checkItem = (item: IMesonFieldItemHasValue) => {
    if (props.submitOnEdit) {
      onCheckSubmitWithValue(form);
      return;
    }

    let result = validateItem(form[item.name], item);
    updateErrors((draft) => {
      draft[item.name] = result;
    });
  };

  let checkItemWithValue = (x: any, item: IMesonFieldItemHasValue) => {
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

  let updateItem = (x: any, item: IMesonFieldItemHasValue) => {
    updateForm((draft: { [k: string]: any }) => {
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

  let renderValueItem = (item: IMesonFieldItem) => {
    switch (item.type) {
      case EMesonFieldType.Input:
        if (item.textarea) {
          return (
            <TextArea
              value={form[item.name]}
              placeholder={item.placeholder || formatString(lingual.pleaseInputLabel, { label: item.label })}
              className={styleFullWidth}
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
          );
        }
        return (
          <Input
            value={form[item.name]}
            type={item.inputType || "text"}
            placeholder={item.placeholder || formatString(lingual.pleaseInputLabel, { label: item.label })}
            className={styleFullWidth}
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
        );
      case EMesonFieldType.Number:
        return (
          <InputNumber
            value={form[item.name]}
            placeholder={item.placeholder || formatString(lingual.pleaseInputLabel, { label: item.label })}
            className={styleFullWidth}
            onChange={(newValue) => {
              updateItem(newValue, item);
            }}
            onBlur={() => {
              checkItem(item);
            }}
            min={item.min}
            max={item.max}
          />
        );
      case EMesonFieldType.Switch:
        return (
          <Switch
            checked={form[item.name]}
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
            placeholder={item.placeholder || formatString(lingual.pleaseInputLabel, { label: item.label })}
            className={styleFullWidth}
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

  let renderItems = (items: IMesonFieldItem[]) => {
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
            <div className={cx(flex, styleMinWidth0, styleValueArea)}>
              <div className={cx(styleControlBase, column, item.className)} style={item.style}>
                {item.render(form[item.name], onChange, form, onCheck)}
                {errorNode}
              </div>
            </div>
          </div>
        );
      }

      return (
        <div key={idx} className={cx(row, styleItemRow)}>
          {labelNode}
          <div className={cx(flex, styleMinWidth0, styleValueArea)}>
            <div className={cx(styleControlBase, column, item.className)} style={item.style}>
              {renderValueItem(item)}
              {errorNode}
            </div>
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
};

export let MesonForm = React.forwardRef(ForwardForm);

export let MesonFormModal: SFC<{
  title: string;
  visible: boolean;
  initialValue: { [k: string]: any };
  items: IMesonFieldItem[];
  onSubmit: (form: { [k: string]: any }, onServerErrors?: (x: ISimpleObject) => void) => void;
  onClose: () => void;
  isLoading?: boolean;
  hideClose?: boolean;
  renderFooter?: (isLoading: boolean, onSubmit: () => void, onCancel: () => void, from?: any) => ReactNode;
}> = (props) => {
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
            onSubmit={(form: { [k: string]: any }, onServerErrors: (x: { [k: string]: any }) => void) => {
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
};

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
`;

let styleItemsContainer = css`
  overflow: auto;
  padding: 24px 16px 24px;
`;

let styleTextareaBase = css`
  width: 240px;
  min-width: 240px;
`;

const styleMinWidth0 = css`
  min-width: 0;
`;

const styleFullWidth = css`
  width: 100%;
`;
