import React, { ReactNode, FC, ReactText, CSSProperties, useState } from "react";
import { formatString, lingual } from "./lingual";
import moment from "moment";
import TextArea from "antd/lib/input/TextArea";
import DatePicker from "antd/lib/date-picker";
import dataPickerLocale from "antd/es/date-picker/locale/zh_CN";

import {
  IMesonInputField,
  IMesonFieldItemHasValue,
  IMesonNumberField,
  IMesonSelectField,
  IMesonDropdownSelectField,
  IMesonSwitchField,
  IMesonDecorativeField,
  IMesonRadioField,
  IMesonTexareaField,
  IMesonDatePickerField,
  IMesonTreeSelectField,
} from "./model/types";
import { css, cx } from "emotion";
import Input from "antd/lib/input";
import InputNumber from "antd/lib/input-number";
import Select from "antd/lib/select";
import TreeSelect from "antd/lib/tree-select";
import Switch from "antd/lib/switch";
import Radio from "antd/lib/radio";
import { DropdownMenu } from "@jimengio/dropdown";
import { flex, column, row, relative } from "@jimengio/flex-styles";
import { RequiredMark } from "./component/misc";
import { isArray, isString, isNumber } from "lodash-es";
import { styleInput, styleSelect, styleTextArea, styleInputNumber, styleSwitch, styleRadio, styleDatePicker, styleTree } from "./style";

type FuncUpdateItem<T> = (x: any, item: IMesonFieldItemHasValue<T>) => void;
type FuncCheckItem<T> = (item: IMesonFieldItemHasValue<T>) => void;
type FuncCheckItemWithValue<T> = (x: any, item: IMesonFieldItemHasValue<T>) => void;

export function renderTextAreaItem<T>(form: T, item: IMesonTexareaField<T>, updateItem: FuncUpdateItem<T>, checkItem: FuncCheckItem<T>) {
  const [count, setCount] = useState(0);

  const textAreaElement = (
    <TextArea
      className={styleTextArea}
      value={form[item.name]}
      disabled={item.disabled}
      placeholder={item.placeholder || formatString(lingual.pleaseInputLabel, { label: item.label })}
      onChange={(event) => {
        let newValue = event.target.value;
        updateItem(newValue, item);
        if (item.enableCounter) {
          setCount(newValue.length);
        }
      }}
      onBlur={(event: any) => {
        checkItem(item);
      }}
      {...item.textareaProps}
    ></TextArea>
  );

  if (item.enableCounter) {
    return (
      <div className={relative}>
        {textAreaElement}
        <div className={styleTextareaCount}>
          {count}/{item.textareaProps?.maxLength}
        </div>
      </div>
    );
  } else {
    return textAreaElement;
  }
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
        className={styleInput}
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
        className={styleInputNumber}
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
    <div className={styleSwitch}>
      <Switch
        checked={form[item.name]}
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
      className={cx(styleSelect, width100)}
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

export function renderDropdownSelectItem<T>(
  form: T,
  item: IMesonDropdownSelectField<T>,
  updateItem: FuncUpdateItem<T>,
  checkItem: FuncCheckItem<T>,
  checkItemWithValue: FuncCheckItemWithValue<T>
) {
  let currentValue = form[item.name];
  if (item.translateNonStringvalue && currentValue != null) {
    currentValue = `${currentValue}`;
  }
  return (
    <DropdownMenu
      value={currentValue}
      items={item.options.map((option) => {
        let value = option.value;
        if (item.translateNonStringvalue) {
          value = `${value}`;
        }
        return { title: option.display, value: option.value };
      })}
      onSelect={(newValue) => {
        if (item.translateNonStringvalue && newValue != null) {
          let target = item.options.find((x) => `${x.value}` === newValue);
          newValue = target.value;
        }
        updateItem(newValue, item);
        checkItemWithValue(newValue, item);
      }}
      className={cx(
        item.className,
        width100,
        css`
          min-width: 220px;
        `
      )}
      menuClassName={item.selectProps?.menuClassName}
      itemClassName={item.selectProps?.itemClassName}
      placeholder={item.placeholder || formatString(lingual.pleaseSelectLabel, { label: item.label })}
      emptyLocale={item.selectProps?.emptyLocale}
      placeholderClassName={item.selectProps?.placeholderClassName}
      menuWidth={item.selectProps?.menuWidth}
      disabled={item.disabled}
      allowClear={item.allowClear}
      renderValue={item.selectProps?.renderValue}
      followWheel={item.selectProps?.followWheel}
    />
  );
}

export function renderTreeSelectItem<T>(
  form: T,
  item: IMesonTreeSelectField<T>,
  updateItem: FuncUpdateItem<T>,
  checkItem: FuncCheckItem<T>,
  checkItemWithValue: FuncCheckItemWithValue<T>
) {
  let currentValue = form[item.name];

  return (
    <TreeSelect
      value={currentValue}
      multiple={item.multiple}
      disabled={item.disabled}
      className={cx(styleTree, width100)}
      allowClear={item.allowClear}
      placeholder={item.placeholder || lingual.pleaseSelect}
      onChange={(newValue) => {
        let multiple = item.multiple || item.treeSelectProps.multiple;

        if (multiple) {
          if (isString(newValue) || isNumber(newValue)) {
            console.warn("tree-select: got literal value in multiple mode", newValue, item);
          }
        } else {
          if (isArray(newValue)) {
            console.warn("tree-select: got array value in single mode", newValue, item);
          }
        }
        checkItemWithValue(newValue, item);
        updateItem(newValue, item);
      }}
      {...item.treeSelectProps}
    ></TreeSelect>
  );
}

export function renderRadioItem<T>(form: T, item: IMesonRadioField<T>, updateItem: FuncUpdateItem<T>, checkItemWithValue: FuncCheckItemWithValue<T>) {
  const renderRadios = (item: IMesonRadioField<T>) => {
    const radios = item.options;
    return radios.map((radio) => {
      return (
        <Radio className={styleRadio} value={radio.value} disabled={radio.disabled} key={radio.key || radio.value}>
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

export function renderDatePickerItem<T>(
  form: T,
  item: IMesonDatePickerField<T>,
  updateItem: FuncUpdateItem<T>,
  checkItem: FuncCheckItem<T>,
  checkItemWithValue: FuncCheckItemWithValue<T>
) {
  return (
    <DatePicker
      locale={dataPickerLocale}
      value={form[item.name] && moment(form[item.name])}
      allowClear={item.allowClear}
      disabled={item.disabled}
      placeholder={item.placeholder || lingual.pleaseSelect}
      className={cx(styleDatePicker, item.className)}
      style={item.style}
      onChange={(dateObj, dateString) => {
        if (dateString == null || dateString === "") {
          updateItem(undefined, item);
        } else {
          if (item.transformSelectedValue != null) {
            // TODO, 可能存在场景需要处理 utcOffset(480)
            dateString = item.transformSelectedValue(dateObj.clone(), dateString);
          }
          checkItemWithValue(dateString, item);
          updateItem(dateString, item);
        }
      }}
      {...item.datePickerProps}
    />
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
  let mergeItemClassName = isError ? cx(row, relative, styleItemRow, styleItemRowWithError) : cx(row, relative, styleItemRow);
  let mergeErrorClassName = isError ? cx(styleErrorWrapper, styleError, errorClassName) : undefined;
  let styleObj: CSSProperties = width == null ? undefined : { width };

  return (
    <div key={key} className={mergeItemClassName} style={styleObj}>
      {labelNode}
      <div className={cx(flex, column, styleValueArea, item.className)} style={item.style} data-field={item.name}>
        {field}
        {mergeErrorClassName && <div className={mergeErrorClassName}>{error}</div>}
      </div>
    </div>
  );
}

let styleControlBase = css`
  min-width: 220px;
  width: 220px;
`;

let styleTextareaBase = css`
  width: 240px;
  min-width: 240px;
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
  color: #6f6f6f;
  font-weight: 400;
  min-width: 80px;
  width: max-content;
  text-align: right;
  margin-right: 8px;
`;

let width100 = css`
  width: 100%;
`;

let styleTextareaCount = css`
  position: absolute;
  right: 15px;
  bottom: 1px;
  font-size: 12px;
  width: calc(100% - 20px);
  height: 18px;
  line-height: 18px;
  text-align: right;
  background: #fff;
  z-index: 1;
`;
