import React, { SFC, ReactNode } from "react";
import { row } from "@jimengio/shared-utils";
import { css, cx } from "emotion";
import { Input, InputNumber, Select, Button } from "antd";

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
  hidden?: boolean;
  disabled?: boolean;
}

export interface IMesonInputField extends IMesonFieldBaseProps {
  name: string;
  type: EMesonFieldType.Input;
  value: string;
  onChange?: (text: string) => void;
}

export interface IMesonNumberField extends IMesonFieldBaseProps {
  name: string;
  type: EMesonFieldType.Number;
  value: number;
  onChange?: (text: string) => void;
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
}

export interface IMesonCustomField extends IMesonFieldBaseProps {
  type: EMesonFieldType.Custom;
  render: () => ReactNode;
}

export interface IMesonGroupField extends IMesonFieldBaseProps {
  type: EMesonFieldType.Group;
  children: IMesonFieldItem[];
}

export type IMesonFieldItem = IMesonInputField | IMesonNumberField | IMesonSelectField | IMesonCustomField | IMesonGroupField;

let RequiredMark: SFC<{}> = (props) => {
  return <span className={styleRequired}>*</span>;
};

let renderValueItem = (item: IMesonFieldItem) => {
  switch (item.type) {
    case EMesonFieldType.Input:
      return (
        <Input
          value={item.value}
          className={styleControlBase}
          onChange={(event) => {
            console.log("changed", event);
          }}
        />
      );
    case EMesonFieldType.Number:
      return (
        <InputNumber
          value={item.value}
          className={styleControlBase}
          onChange={(x) => {
            console.log("changed", event);
          }}
        />
      );
    case EMesonFieldType.Select:
      return (
        <Select value={item.value} className={styleControlBase}>
          {item.options.map((option) => {
            return (
              <Select.Option value={option.value} key={option.key || option.value}>
                {option.display}
              </Select.Option>
            );
          })}
        </Select>
      );
  }
};

export let MesonForm: SFC<{
  items: (IMesonFieldItem)[];
  onFieldChange: (k: string, v: any) => void;
  onSubmit: (form: { string: any }) => void;
}> = (props) => {
  return (
    <div>
      {props.items.map((item, idx) => {
        return (
          <div key={idx} className={cx(row, styleItemRow)}>
            <div className={styleLabel}>
              {item.required ? <RequiredMark /> : null}
              {item.label}:
            </div>
            <div className={styleValueArea}>{renderValueItem(item)}</div>
          </div>
        );
      })}
      <div className={cx(row, styleItemRow)}>
        <div className={styleLabel} />
        <div className={cx(row, styleValueArea)}>
          <Button type={"primary"}>{"确认"}</Button>
          <div style={{ width: 12 }} />
          <Button>{"取消"}</Button>
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
