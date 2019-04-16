import React, { SFC, ReactNode, CSSProperties } from "react";
import { row, column, flex } from "@jimengio/shared-utils";
import { css, cx } from "emotion";
import { Input, InputNumber, Select, Button } from "antd";
import { useImmer } from "use-immer";
import { lingual, formatString } from "./lingual";
import { IMesonFieldItem, EMesonFieldType, IMesonFieldItemHasValue, ISimpleObject } from "./model/types";
import { validateValueRequired, validateByMethods, validateItem } from "./util/validation";
import { traverseItems } from "./util/render";
import { RequiredMark } from "./component/misc";
import is from "is";
import { FormFooter } from "./component/form-footer";
import MesonModal from "./component/modal";

export let MesonForm: SFC<{
  initialValue: any;
  items: IMesonFieldItem[];
  onSubmit: (form: { string: any }, onServerErrors?: (x: ISimpleObject) => void) => void;
  onCancel: () => void;
  className?: string;
  style?: CSSProperties;
}> = (props) => {
  let [form, updateForm] = useImmer(props.initialValue);
  let [errors, updateErrors] = useImmer({} as ISimpleObject);

  let checkItem = (item: IMesonFieldItemHasValue) => {
    let result = validateItem(form[item.name], item);
    updateErrors((draft) => {
      draft[item.name] = result;
    });
  };

  let checkItemWithValue = (x: any, item: IMesonFieldItemHasValue) => {
    let result = validateItem(x, item);
    updateErrors((draft) => {
      draft[item.name] = result;
    });
  };

  let updateItem = (x: any, item: IMesonFieldItemHasValue) => {
    updateForm((draft: any) => {
      draft[item.name] = x;
    });
    if (item.onChange != null) {
      item.onChange(x);
    }
  };

  let renderValueItem = (item: IMesonFieldItem) => {
    switch (item.type) {
      case EMesonFieldType.Input:
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
        let onChange = (value: any) => {
          updateItem(value, item);
        };
        return item.render(form[item.name], onChange);
    }
    return <div>Unknown type: {(item as any).type}</div>;
  };

  let renderItems = (items: IMesonFieldItem[]) => {
    return items.map((item, idx) => {
      if (item.shouldHide != null && item.shouldHide(form)) {
        return null;
      }

      let name: string = (item as any).name;
      let error = name != null ? errors[name] : null;

      return (
        <div key={idx} className={cx(row, styleItemRow)}>
          <div className={styleLabel}>
            {item.required ? <RequiredMark /> : null}
            {item.label}:
          </div>
          <div className={cx(column, styleValueArea)}>
            {renderValueItem(item)}
            {error != null ? <div className={styleError}>{error}</div> : null}
          </div>
        </div>
      );
    });
  };

  return (
    <div className={cx(column, props.className)} style={props.style}>
      <div className={cx(flex, styleItemsContainer)}>{renderItems(props.items)}</div>
      <FormFooter
        onSubmit={() => {
          let currentErrors: ISimpleObject = {};
          let hasErrors = false;
          traverseItems(props.items, (item: IMesonFieldItemHasValue) => {
            let result = validateItem(form[item.name], item);

            if (result != null) {
              currentErrors[item.name] = result;
              hasErrors = true;
            }
          });

          updateErrors((draft: ISimpleObject) => {
            return currentErrors;
          });

          if (!hasErrors) {
            props.onSubmit(form, (serverErrors) => {
              updateErrors((draft: ISimpleObject) => {
                return serverErrors;
              });
            });
          }
        }}
        onCancel={props.onCancel}
      />
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

let styleValueArea = css``;

let styleItemRow = css`
  line-height: 32px;
  margin-bottom: 24px;
  font-size: 14px;
`;

let styleControlBase = css`
  min-width: 180px;
`;

let styleError = css`
  color: red;
`;

let styleItemsContainer = css`
  overflow: auto;
  padding-top: 24px;
`;
