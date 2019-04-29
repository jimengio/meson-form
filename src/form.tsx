import React, { SFC, ReactNode, CSSProperties, useState, useEffect } from "react";
import { row, column, flex } from "@jimengio/shared-utils";
import { css, cx } from "emotion";
import { Input, InputNumber, Select, Button } from "antd";
import { useImmer } from "use-immer";
import { lingual, formatString } from "./lingual";
import { IMesonFieldItem, EMesonFieldType, IMesonFieldItemHasValue, ISimpleObject } from "./model/types";
import { validateValueRequired, validateByMethods, validateItem } from "./util/validation";
import { traverseItems } from "./util/render";
import { RequiredMark } from "./component/misc";
import { FormFooter, EMesonFooterLayout } from "./component/form-footer";
import MesonModal from "./component/modal";
import TextArea from "antd/lib/input/TextArea";
import produce from "immer";

export let MesonForm: SFC<{
  initialValue: any;
  items: IMesonFieldItem[];
  onSubmit: (form: { [k: string]: any }, onServerErrors?: (x: ISimpleObject) => void) => void;
  onCancel?: () => void;
  className?: string;
  style?: CSSProperties;
  footerLayout?: EMesonFooterLayout;
  renderFooter?: (isLoading: boolean, onSubmit: () => void, onCancel: () => void) => ReactNode;
  isLoading?: boolean;
  onFieldChange?: (name: string, v: any, prevForm?: any) => void;
  submitOnEdit?: boolean;
}> = (props) => {
  let [form, updateForm] = useImmer(props.initialValue);
  let [errors, updateErrors] = useImmer({});
  let [modified, setModified] = useState<boolean>(false);

  let onCheckSubmit = (specifiedForm?: any) => {
    let latestForm = specifiedForm || form;
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

  let checkItem = (item: IMesonFieldItemHasValue) => {
    if (props.submitOnEdit) {
      onCheckSubmit(form);
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
      onCheckSubmit(newForm);
      return;
    }

    let result = validateItem(x, item);
    updateErrors((draft) => {
      draft[item.name] = result;
    });
  };

  let updateItem = (x: any, item: IMesonFieldItemHasValue) => {
    updateForm((draft: any) => {
      draft[item.name] = x;
    });
    setModified(true);
    if (item.onChange != null) {
      item.onChange(x);
    }
    if (props.onFieldChange != null) {
      props.onFieldChange(item.name, x, form);
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
              className={cx(styleControlBase, styleTextareaBase)}
              onChange={(event) => {
                let newValue = event.target.value;
                updateItem(newValue, item);
              }}
              onBlur={() => {
                checkItem(item);
              }}
            />
          );
        }
        return (
          <Input
            value={form[item.name]}
            placeholder={item.placeholder || formatString(lingual.pleaseInputLabel, { label: item.label })}
            className={styleControlBase}
            onChange={(event) => {
              let newValue = event.target.value;
              updateItem(newValue, item);
            }}
            onBlur={() => {
              checkItem(item);
            }}
          />
        );
      case EMesonFieldType.Number:
        return (
          <InputNumber
            value={form[item.name]}
            placeholder={item.placeholder || formatString(lingual.pleaseInputLabel, { label: item.label })}
            className={styleControlBase}
            onChange={(newValue) => {
              updateItem(newValue, item);
            }}
            onBlur={() => {
              checkItem(item);
            }}
          />
        );
      case EMesonFieldType.Select:
        return (
          <Select
            value={form[item.name]}
            placeholder={item.placeholder || formatString(lingual.pleaseInputLabel, { label: item.label })}
            className={styleControlBase}
            onChange={(newValue) => {
              updateItem(newValue, item);
              checkItemWithValue(newValue, item);
            }}
            onBlur={() => {
              checkItem(item);
            }}
          >
            {item.options.map((option) => {
              return (
                <Select.Option value={option.value} key={option.key || option.value}>
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
            <div className={cx(flex, column, styleValueArea)}>
              {item.render(form[item.name], onChange, form, onCheck)}
              {errorNode}
            </div>
          </div>
        );
      }

      return (
        <div key={idx} className={cx(row, styleItemRow)}>
          {labelNode}
          <div className={cx(styleValueArea)}>
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
      {props.renderFooter ? (
        props.renderFooter(props.isLoading, onCheckSubmit, props.onCancel)
      ) : (
        <FormFooter isLoading={props.isLoading} layout={props.footerLayout} onSubmit={onCheckSubmit} onCancel={props.onCancel} />
      )}
    </div>
  );
};

export let MesonFormModal: SFC<{
  title: string;
  visible: boolean;
  initialValue: any;
  items: IMesonFieldItem[];
  onSubmit: (form: { string: any }, onServerErrors?: (x: ISimpleObject) => void) => void;
  onClose: () => void;
  isLoading?: boolean;
}> = (props) => {
  return (
    <MesonModal
      title={props.title}
      visible={props.visible}
      onClose={props.onClose}
      hideClose
      renderContent={() => {
        return (
          <MesonForm
            initialValue={props.initialValue}
            items={props.items}
            isLoading={props.isLoading}
            onSubmit={(form: any, onServerErrors: (x: any) => void) => {
              props.onSubmit(form, onServerErrors);
            }}
            onCancel={props.onClose}
            className={styleForm}
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
