import React, { ReactNode } from "react";
import { cx, css } from "emotion";

import { DropdownMenu } from "@jimengio/dropdown";
import DatePicker from "antd/lib/date-picker";
import dataPickerLocale from "antd/es/date-picker/locale/zh_CN";
import { Select } from "antd";

import { formatString, lingual } from "../lingual";
import moment from "moment";

import { IFilterDropdownSelectField, IFilterDatePickerField, IFilterSelectField, FuncUpdateItem } from "./types";
import { GlobalThemeVariables } from "../theme";

export function renderDropdownSelectItem<T>(form: T, item: IFilterDropdownSelectField<T>, updateItem: FuncUpdateItem<T>) {
  let currentValue: ReactNode = form[item.name] as any;
  if (item.translateNonStringvalue && currentValue != null) {
    currentValue = `${currentValue}`;
  }

  let { selectProps } = item;

  return (
    <DropdownMenu
      value={currentValue as string}
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
      }}
      className={cx(styleDropdown, GlobalThemeVariables.dropdownSelect, item.className)}
      menuClassName={selectProps?.menuClassName}
      itemClassName={selectProps?.itemClassName}
      placeholder={item.placeholder || formatString(lingual.pleaseSelectLabel, { label: item.label })}
      emptyLocale={selectProps?.emptyLocale}
      placeholderClassName={selectProps?.placeholderClassName}
      menuWidth={selectProps?.menuWidth}
      disabled={item.disabled}
      allowClear={item.allowClear}
      renderValue={selectProps?.renderValue}
      followWheel={selectProps?.followWheel}
    />
  );
}

export function renderSelectItem<T>(form: T, item: IFilterSelectField<T>, updateItem: FuncUpdateItem<T>) {
  let currentValue: any = form[item.name];
  if (item.translateNonStringvalue && currentValue != null) {
    currentValue = `${currentValue}`;
  }

  let multiple: boolean = item.selectProps?.mode && item.selectProps?.mode === "multiple";

  return (
    <Select
      value={currentValue}
      className={cx(styleSelect, GlobalThemeVariables.select, item.className)}
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
      }}
      allowClear={item.allowClear}
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

export function renderDatePickerItem<T>(form: T, item: IFilterDatePickerField<T>, updateItem: FuncUpdateItem<T>) {
  return (
    <DatePicker
      locale={dataPickerLocale}
      value={form[item.name] && moment(form[item.name])}
      allowClear={item.allowClear}
      disabled={item.disabled}
      placeholder={item.placeholder || formatString(lingual.pleaseSelectLabel, { label: item.label })}
      className={cx(styleDatePicker, GlobalThemeVariables.datePicker, item.className)}
      style={item.style}
      onChange={(dateObj, dateString) => {
        if (dateString == null || dateString === "") {
          updateItem(undefined, item);
        } else {
          updateItem(dateString, item);
        }
      }}
      {...item.datePickerProps}
    />
  );
}

let styleDropdown = css`
  min-width: 220px;
  width: 100%;
`;

let styleSelect = css`
  min-width: 220px;
`;

let styleDatePicker = css`
  min-width: 220px;
`;
