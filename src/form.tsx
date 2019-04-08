import React, { SFC, ReactNode } from "react";
import { row, column } from "@jimengio/shared-utils";
import { css, cx } from "emotion";
import { Input, InputNumber, Select, Button } from "antd";
import { useImmer } from "use-immer";

interface ISimpleObject {
  [k: string]: string;
}

export enum EMesonFieldType {
  Input = "input",
  Number = "number",
  Select = "select",
  Custom = "custom",
  Group = "group",
}

export interface IMesonFieldBaseProps {
  label: string;
  required?: boolean;
  shouldHide?: (form: any) => boolean;
  disabled?: boolean;
}

export interface IMesonInputField extends IMesonFieldBaseProps {
  name: string;
  type: EMesonFieldType.Input;
  value: string;
  onChange?: (text: string) => void;
  validator?: (value: string) => string;
}

export interface IMesonNumberField extends IMesonFieldBaseProps {
  name: string;
  type: EMesonFieldType.Number;
  value: number;
  onChange?: (text: string) => void;
  validator?: (value: number) => string;
}

export interface IMesonSelectitem {
  value: string;
  key?: string;
  display?: string;
}

export interface IMesonSelectField extends IMesonFieldBaseProps {
  name: string;
  type: EMesonFieldType.Select;
  value: string;
  options: (IMesonSelectitem)[];
  onChange?: (x: string) => void;
  validator?: (value: string) => string;
}

export interface IMesonCustomField extends IMesonFieldBaseProps {
  name: string;
  type: EMesonFieldType.Custom;
  render: (value: any, onChange: (x: any) => void) => ReactNode;
  validator?: (value: any) => string;
}

export interface IMesonGroupField extends IMesonFieldBaseProps {
  type: EMesonFieldType.Group;
  children: IMesonFieldItem[];
}

export type IMesonFieldItem = IMesonInputField | IMesonNumberField | IMesonSelectField | IMesonCustomField | IMesonGroupField;

let RequiredMark: SFC<{}> = (props) => {
  return <span className={styleRequired}>*</span>;
};

let traverseItems = (xs: IMesonFieldItem[], method: (x: IMesonFieldItem) => void) => {
  xs.forEach((x) => {
    if (x.type === EMesonFieldType.Group) {
      traverseItems(x.children, method);
    } else {
      method(x);
    }
  });
};

export let MesonForm: SFC<{
  initialValue: any;
  items: IMesonFieldItem[];
  onFieldChange: (k: string, v: any) => void;
  onSubmit: (form: { string: any }) => void;
  onCancel: () => void;
}> = (props) => {
  let [form, updateForm] = useImmer(props.initialValue);
  let [errors, updateErrors] = useImmer({} as ISimpleObject);

  console.log("rendering form", form);

  let renderValueItem = (item: IMesonFieldItem) => {
    switch (item.type) {
      case EMesonFieldType.Input:
        return (
          <Input
            value={form[item.name]}
            className={styleControlBase}
            onChange={(event) => {
              let newValue = event.target.value;
              updateForm((draft) => {
                draft[item.name] = newValue;
              });
              props.onFieldChange(item.name, newValue);
            }}
            onBlur={() => {
              if (item.validator != null) {
                updateErrors((draft) => {
                  draft[item.name] = item.validator(form[item.name]);
                });
              }
            }}
          />
        );
      case EMesonFieldType.Number:
        return (
          <InputNumber
            value={form[item.name]}
            className={styleControlBase}
            onChange={(newValue) => {
              updateForm((draft) => {
                draft[item.name] = newValue;
              });
              props.onFieldChange(item.name, newValue);
            }}
            onBlur={() => {
              if (item.validator != null) {
                updateErrors((draft) => {
                  draft[item.name] = item.validator(form[item.name]);
                });
              }
            }}
          />
        );
      case EMesonFieldType.Select:
        return (
          <Select
            value={form[item.name]}
            className={styleControlBase}
            onChange={(newValue) => {
              updateForm((draft) => {
                draft[item.name] = newValue;
              });
              props.onFieldChange(item.name, newValue);
            }}
            onBlur={() => {
              if (item.validator != null) {
                updateErrors((draft) => {
                  draft[item.name] = item.validator(form[item.name]);
                });
              }
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
          updateForm((draft) => {
            draft[item.name] = value;
          });
          props.onFieldChange(item.name, value);
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
    <div>
      {renderItems(props.items)}
      <div className={cx(row, styleItemRow)}>
        <div className={styleLabel} />
        <div className={cx(row, styleValueArea)}>
          <Button
            type={"primary"}
            onClick={() => {
              let currentErrors: ISimpleObject = {};
              traverseItems(props.items, (item) => {
                let { name, validator } = item as any;

                if (name && validator) {
                  currentErrors[name] = validator(form[name]);
                }
              });
              updateErrors((draft) => {
                return currentErrors;
              });
              console.warn("submit form", form);
            }}
          >
            {"确认"}
          </Button>
          <div style={{ width: 12 }} />
          <Button onClick={props.onCancel}>{"取消"}</Button>
        </div>
      </div>
    </div>
  );
};

let styleLabel = css`
  color: hsla(0, 0%, 20%, 1);
  min-width: 120px;
  width: max-content;
  text-align: right;
  margin-right: 8px;
`;

let styleRequired = css`
  color: hsla(0, 100%, 50%, 1);
  margin-right: 4px;
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
