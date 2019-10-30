import React, { ReactNode, FC, ReactText, CSSProperties } from "react";
import { formatString, lingual } from "./lingual";
import TextArea from "antd/lib/input/TextArea";
import {
  IMesonInputField,
  IMesonFieldItemHasValue,
  IMesonNumberField,
  IMesonSelectField,
  IMesonSwitchField,
  IMesonDecorativeField,
  IMesonRadioFields,
} from "./model/types";
import { css, cx } from "emotion";
import Input from "antd/lib/input";
import InputNumber from "antd/lib/input-number";
import Select from "antd/lib/select";
import Switch from "antd/lib/switch";
import Radio from "antd/lib/radio";
import { flex, column, row, relative } from "@jimengio/shared-utils";
import { RequiredMark } from "./component/misc";

type FuncUpdateItem<T> = (x: any, item: IMesonFieldItemHasValue<T>) => void;
type FuncCheckItem<T> = (item: IMesonFieldItemHasValue<T>) => void;
type FuncCheckItemWithValue<T> = (x: any, item: IMesonFieldItemHasValue<T>) => void;

export function renderTextAreaItem<T>(form: T, item: IMesonInputField<T>, updateItem: FuncUpdateItem<T>, checkItem: FuncCheckItem<T>) {
  return (
    <>
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
        {...(item.inputProps as any)}
      />
    </>
  );
}

export function renderInputItem<T>(
  form: T,
  item: IMesonInputField<T>,
  updateItem: FuncUpdateItem<T>,
  checkItem: FuncCheckItem<T>,
  checkItemWithValue: FuncCheckItemWithValue<T>
) {
  return (
    <>
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

          if (item.checkOnChange) {
            checkItemWithValue(newValue, item);
          }
        }}
        onBlur={() => {
          checkItem(item);
        }}
        {...item.inputProps}
      />
    </>
  );
}

export function renderNumberItem<T>(form: T, item: IMesonNumberField<T>, updateItem: FuncUpdateItem<T>, checkItem: FuncCheckItem<T>) {
  return (
    <>
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
        {...item.inputProps}
      />
    </>
  );
}

export function renderSwitchItem<T>(form: T, item: IMesonSwitchField<T>, updateItem: FuncUpdateItem<T>, checkItemWithValue: FuncCheckItemWithValue<T>) {
  return (
    <div>
      <Switch
        checked={form[item.name]}
        className={styleSwitch}
        disabled={item.disabled}
        onChange={(value) => {
          updateItem(value, item);
          checkItemWithValue(value, item);
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
      className={width100}
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

export function renderRadioItem<T>(form: T, item: IMesonRadioFields<T>, updateItem: FuncUpdateItem<T>, checkItemWithValue: FuncCheckItemWithValue<T>) {
  const renderRadios = (item: IMesonRadioFields<T>) => {
    const radios = item.options;
    return radios.map((radio) => {
      return (
        <Radio value={radio.value} disabled={radio.disabled} key={radio.key || radio.value}>
          {radio.display}
        </Radio>
      );
    });
  };
  return (
    <Radio.Group
      value={form[item.name]}
      onChange={(e) => {
        const newValue = e.target.value;
        updateItem(newValue, item);
        checkItemWithValue(newValue, item);
      }}
    >
      {renderRadios(item)}
    </Radio.Group>
  );
}

export function renderDecorativeItem<T>(key: ReactText, form: T, item: IMesonDecorativeField<T>) {
  return (
    <div key={key} className={cx(styleItemRow, item.className)} style={item.style}>
      {item.render(form)}
    </div>
  );
}

export const ValueFieldContainer: FC<{ fullWidth?: boolean; className?: string }> = (props) => {
  const { className, fullWidth, children } = props;
  const mergeClassName = cx(fullWidth ? width100 : styleControlBase, className);

  return <div className={mergeClassName}>{children}</div>;
};

/** Common layout for form items,
 * @param key string | number
 * @param item an item with values or labels
 * @param error in string
 * @param field rendered node
 * @param labelClassName label className
 * @param errorClassName error className
 * @param hideLabel
 */
export function renderItemLayout(
  key: string | number,
  item: IMesonFieldItemHasValue,
  error: string,
  field: ReactNode,
  labelClassName: string,
  errorClassName: string,
  hideLabel?: boolean,
  width?: ReactText
) {
  let labelNode = hideLabel ? null : item.label == null ? (
    <div className={cx(styleLabel, labelClassName)} />
  ) : (
    <div className={cx(styleLabel, labelClassName)}>
      {item.required ? <RequiredMark /> : null}
      {item.label}:
    </div>
  );

  let isError = error != null;
  let mergeItemClassNamae = isError ? cx(row, relative, styleItemRow, styleItemRowWithError) : cx(row, relative, styleItemRow);
  let mergeErrorClassName = isError ? cx(styleErrorWrapper, styleError, errorClassName) : undefined;
  let styleObj: CSSProperties = width == null ? undefined : { width };

  return (
    <div key={key} className={mergeItemClassNamae} style={styleObj}>
      {labelNode}
      <div className={cx(flex, column, styleValueArea, item.className)} style={item.style} data-field={item.name}>
        {field}
        {mergeErrorClassName && <div className={mergeErrorClassName}>{error}</div>}
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

let styleItemRowWithError = css`
  margin-bottom: 0;
`;

/** 添加 wrapper 避免 error text flow 自动撑开到很大 */
let styleErrorWrapper = css`
  overflow: auto;
  /* [TODO] 兼容老样式 */
  margin-bottom: 16px;
`;

let styleValueArea = css`
  overflow: auto;
`;

let styleLabel = css`
  color: hsla(0, 0%, 20%, 1);
  min-width: 80px;
  width: max-content;
  text-align: right;
  margin-right: 8px;
`;

let width100 = css`
  width: 100%;
`;
