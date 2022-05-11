import React, { ReactNode, FC, ReactText, CSSProperties, useState } from "react";
import { formatString, lingual } from "./lingual";
import moment from "moment";
import TextArea from "antd/lib/input/TextArea";
import DatePicker from "antd/lib/date-picker";
import dataPickerLocale from "antd/es/date-picker/locale/zh_CN";
import { rowMiddle, Space } from "@jimengio/flex-styles";

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
  FieldValues,
  IMesonDropdownTreeField,
} from "./model/types";
import { css, cx } from "emotion";
import Input from "antd/lib/input";
import InputNumber from "antd/lib/input-number";
import Select from "antd/lib/select";
import TreeSelect from "antd/lib/tree-select";
import { DropdownTree } from "@jimengio/dropdown";
import Switch from "antd/lib/switch";
import Radio from "antd/lib/radio";
import { DropdownMenu } from "@jimengio/dropdown";
import { expand, column, row, relative } from "@jimengio/flex-styles";
import { RequiredMark } from "./component/misc";
import { isArray, isString, isNumber } from "lodash-es";
import { GlobalThemeVariables } from "./theme";

type FuncUpdateItem<T> = (x: any, item: IMesonFieldItemHasValue<T>) => void;
type FuncCheckItem<T> = (item: IMesonFieldItemHasValue<T>) => void;
type FuncCheckItemWithValue<T> = (x: any, item: IMesonFieldItemHasValue<T>) => void;

export function renderTextAreaItem<T extends FieldValues>(form: T, item: IMesonTexareaField<T>, updateItem: FuncUpdateItem<T>, checkItem: FuncCheckItem<T>) {
  const textLength = isString(form[item.name]) ? form[item.name].length : 0;

  const { className, ...textareaRestProps } = item.textareaProps || {};

  const textAreaElement = (
    <TextArea
      className={cx(GlobalThemeVariables.textarea, className)}
      value={form[item.name] as any}
      disabled={item.disabled}
      placeholder={item.placeholder || formatString(lingual.pleaseInputLabel, { label: item.label })}
      onChange={(event) => {
        let newValue = event.target.value;
        updateItem(newValue, item);
      }}
      onBlur={(event: any) => {
        checkItem(item);
      }}
      {...textareaRestProps}
    ></TextArea>
  );

  if (item.enableCounter) {
    return (
      <div className={relative}>
        {textAreaElement}
        <div className={styleTextareaCount}>
          {textLength}/{item.textareaProps?.maxLength}
        </div>
      </div>
    );
  } else {
    return textAreaElement;
  }
}

export function renderInputItem<T extends FieldValues>(
  form: T,
  item: IMesonInputField<T>,
  updateItem: FuncUpdateItem<T>,
  checkItem: FuncCheckItem<T>,
  checkItemWithValue: FuncCheckItemWithValue<T>
) {
  const { className, ...inputRestProps } = item.inputProps || {};

  return (
    <div className={rowMiddle}>
      <Input
        className={cx(GlobalThemeVariables.input, className)}
        value={form[item.name] as any}
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
        {...inputRestProps}
      />
      {item.suffixNode != null ? (
        <>
          <Space width={8} />
          {item.suffixNode}
        </>
      ) : null}
    </div>
  );
}

export function renderNumberItem<T extends FieldValues>(form: T, item: IMesonNumberField<T>, updateItem: FuncUpdateItem<T>, checkItem: FuncCheckItem<T>) {
  const { className, ...inputRestProps } = item.inputProps || {};

  return (
    <>
      <InputNumber
        className={cx(GlobalThemeVariables.number, className)}
        value={form[item.name] as any}
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
        {...inputRestProps}
      />
      {item.suffixNode != null ? (
        <>
          <Space width={8} />
          {item.suffixNode}
        </>
      ) : null}
    </>
  );
}

export function renderSwitchItem<T extends FieldValues>(
  form: T,
  item: IMesonSwitchField<T>,
  updateItem: FuncUpdateItem<T>,
  checkItemWithValue: FuncCheckItemWithValue<T>
) {
  const checked = form[item.name] ? true : false;

  return (
    <div>
      <Switch
        checked={checked}
        disabled={item.disabled}
        onChange={(value) => {
          updateItem(value, item);
          checkItemWithValue(value, item);
        }}
      />
    </div>
  );
}

export function renderSelectItem<T extends FieldValues>(
  form: T,
  item: IMesonSelectField<T>,
  updateItem: FuncUpdateItem<T>,
  checkItem: FuncCheckItem<T>,
  checkItemWithValue: FuncCheckItemWithValue<T>
) {
  let currentValue: any = form[item.name];
  let multiple: boolean = item.selectProps?.mode && item.selectProps?.mode === "multiple";

  if (item.translateNonStringvalue && currentValue != null) {
    if (multiple && currentValue.length) {
      currentValue = (currentValue as string[]).map((c) => `${c}`);
    } else {
      currentValue = `${currentValue}`;
    }
  }

  const { className, ...selectRestProps } = item.selectProps || {};

  return (
    <Select
      value={currentValue}
      disabled={item.disabled}
      className={cx(GlobalThemeVariables.select, width100, className)}
      placeholder={item.placeholder || formatString(lingual.pleaseSelectLabel, { label: item.label })}
      onChange={(newValue: string[] | string) => {
        if (item.translateNonStringvalue && newValue != null) {
          let target = null;
          if (multiple) {
            let process = (newValue as string[]).map((n) => {
              return item.options.find((x) => `${x.value}` === n).value;
            });
            newValue = process.length > 0 ? process : undefined;
          } else {
            target = item.options.find((x) => `${x.value}` === newValue);
            newValue = target.value;
          }
        }

        updateItem(newValue, item);
        checkItemWithValue(newValue, item);
      }}
      allowClear={item.allowClear}
      onBlur={(event) => {
        if (multiple) {
          checkItemWithValue(currentValue.length > 0 ? currentValue : undefined, item);
        } else {
          checkItem(item);
        }
      }}
      {...selectRestProps}
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

export function renderDropdownSelectItem<T extends FieldValues>(
  form: T,
  item: IMesonDropdownSelectField<T>,
  updateItem: FuncUpdateItem<T>,
  checkItem: FuncCheckItem<T>,
  checkItemWithValue: FuncCheckItemWithValue<T>
) {
  let currentValue: any = form[item.name];
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
      className={cx(GlobalThemeVariables.dropdownSelect, item.className, width100, styleSelectSize)}
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
      showSearch={item.selectProps?.showSearch}
      searchPlaceholder={item.selectProps?.searchPlaceholder}
    />
  );
}

export function renderTreeSelectItem<T extends FieldValues>(
  form: T,
  item: IMesonTreeSelectField<T>,
  updateItem: FuncUpdateItem<T>,
  checkItem: FuncCheckItem<T>,
  checkItemWithValue: FuncCheckItemWithValue<T>
) {
  let currentValue = form[item.name];
  const { className, ...treeRestProps } = item.treeSelectProps || {};

  return (
    <TreeSelect
      value={currentValue as any}
      multiple={item.multiple}
      disabled={item.disabled}
      className={cx(GlobalThemeVariables.treeSelect, width100, className)}
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
      {...treeRestProps}
    ></TreeSelect>
  );
}

export function renderDropdownTreeItem<T extends FieldValues>(
  form: T,
  item: IMesonDropdownTreeField<T>,
  updateItem: FuncUpdateItem<T>,
  checkItem: FuncCheckItem<T>,
  checkItemWithValue: FuncCheckItemWithValue<T>
) {
  let currentValue = form[item.name];

  return (
    <DropdownTree
      value={currentValue}
      disabled={item.disabled}
      className={cx(GlobalThemeVariables.dropdownTree, width100, styleSelectSize)}
      allowClear={item.allowClear}
      placeholder={item.placeholder || lingual.pleaseSelect}
      items={item.options}
      onSelect={(newValue) => {
        checkItemWithValue(newValue, item);
        updateItem(newValue, item);
      }}
      {...item.treeSelectProps}
    ></DropdownTree>
  );
}

export function renderRadioItem<T extends FieldValues>(
  form: T,
  item: IMesonRadioField<T>,
  updateItem: FuncUpdateItem<T>,
  checkItemWithValue: FuncCheckItemWithValue<T>
) {
  const renderRadios = (item: IMesonRadioField<T>) => {
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

export function renderDatePickerItem<T extends FieldValues>(
  form: T,
  item: IMesonDatePickerField<T>,
  updateItem: FuncUpdateItem<T>,
  checkItem: FuncCheckItem<T>,
  checkItemWithValue: FuncCheckItemWithValue<T>
) {
  const { className, ...restProps } = item.datePickerProps || {};

  return (
    <DatePicker
      locale={dataPickerLocale}
      value={form[item.name] && moment(form[item.name])}
      allowClear={item.allowClear}
      disabled={item.disabled}
      placeholder={item.placeholder || lingual.pleaseSelect}
      className={cx(GlobalThemeVariables.datePicker, item.className, className)}
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
      {...restProps}
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
export function renderItemLayout<T>(
  key: string | number,
  item: IMesonFieldItemHasValue<T>,
  error: string,
  field: ReactNode,
  labelClassName: string,
  errorClassName: string,
  hideLabel?: boolean,
  width?: ReactText
) {
  let labelNode = hideLabel ? null : item.label == null ? (
    <div className={cx(styleLabel, labelClassName, item.labelClassName)} />
  ) : (
    <div className={cx(styleLabel, labelClassName, item.labelClassName)}>
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
      <div className={cx(expand, column, styleValueArea, GlobalThemeVariables.fieldValueArea, item.className)} style={item.style} data-field={item.name || key}>
        {field}
        {mergeErrorClassName && (
          <div className={mergeErrorClassName} data-error-field={item.name}>
            {error}
          </div>
        )}
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
  overflow: unset;
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

let styleSelectSize = css`
  min-width: 220px;
`;
