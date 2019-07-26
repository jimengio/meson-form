import React, { ReactNode } from "react";
import { formatString, lingual } from "./lingual";
import TextArea from "antd/lib/input/TextArea";
import { IMesonFieldItem, IMesonInputField, IMesonFieldItemHasValue, IMesonNumberField, IMesonSelectField, IMesonSwitchField } from "./model/types";
import { css, cx } from "emotion";
import Input from "antd/lib/input";
import InputNumber from "antd/lib/input-number";
import Select from "antd/lib/select";
import Switch from "antd/lib/switch";
import { flex, column, row } from "@jimengio/shared-utils";
import { RequiredMark } from "./component/misc";

type FuncUpdateItem<T> = (x: any, item: IMesonFieldItemHasValue<T>) => void;
type FuncCheckItem<T> = (item: IMesonFieldItemHasValue<T>) => void;
type FuncCheckItemWithValue<T> = (x: any, item: IMesonFieldItemHasValue<T>) => void;

export function renderTextAreaItem<T>(form: T, item: IMesonInputField<T>, updateItem: FuncUpdateItem<T>, checkItem: FuncCheckItem<T>) {
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

export function renderInputItem<T>(form: T, item: IMesonInputField<T>, updateItem: FuncUpdateItem<T>, checkItem: FuncCheckItem<T>) {
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
}

export function renderNumberItem<T>(form: T, item: IMesonNumberField<T>, updateItem: FuncUpdateItem<T>, checkItem: FuncCheckItem<T>) {
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
}

export function renderSwitchItem<T>(form: T, item: IMesonSwitchField<T>, updateItem: FuncUpdateItem<T>, checkItem: FuncCheckItem<T>) {
  return (
    <div>
      <Switch
        checked={form[item.name]}
        className={styleSwitch}
        disabled={item.disabled}
        onChange={(value) => {
          updateItem(value, item);
        }}
      />
    </div>
  );
}

export function renderSelectItem<T>(
  form: T,
  item: IMesonSelectField<T>,
  updateItem: FuncUpdateItem<T>,
  checkItem: FuncCheckItem<T>,
  checkItemWithValue: FuncCheckItemWithValue<T>
) {
  let currentValue = form[item.name];
  if (item.translateNonStringvalue && currentValue != null) {
    currentValue = `${currentValue}`;
  }
  return (
    <Select
      value={currentValue}
      disabled={item.disabled}
      className={styleControlBase}
      placeholder={item.placeholder || formatString(lingual.pleaseSelectLabel, { label: item.label })}
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
}

/** Common layout for form items,
 * @param key string | number
 * @param item an item with values or labels
 * @param error in string
 * @param field rendered node
 */
export function renderItemLayout(key: string | number, item: IMesonFieldItemHasValue, error: string, field: ReactNode) {
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

  return (
    <div key={key} className={cx(row, styleItemRow)}>
      {labelNode}
      <div className={cx(flex, column, styleValueArea, item.className)} style={item.style}>
        {field}
        <div className={styleErrorWrapper}>{errorNode}</div>
      </div>
    </div>
  );
}

let styleControlBase = css`
  min-width: 180px;
  width: 180px;
`;

let styleTextareaBase = css`
  width: 240px;
  min-width: 240px;
`;

let styleSwitch = css`
  &.ant-switch {
    margin: 4px 0;
  }
`;

let styleError = css`
  word-break: break-all;
  line-height: 1.5;
  color: red;
  padding: 4px 0px;
`;

let styleItemRow = css`
  line-height: 32px;
  margin-bottom: 16px;
  font-size: 14px;
`;

/** 添加 wrapper 避免 error text flow 自动撑开到很大 */
let styleErrorWrapper = css`
  overflow: auto;
`;

let styleValueArea = css`
  overflow: auto;
`;

let styleLabel = css`
  color: hsla(0, 0%, 20%, 1);
  min-width: 120px;
  width: max-content;
  text-align: right;
  margin-right: 8px;
`;
