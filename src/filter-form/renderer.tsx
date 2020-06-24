import React, { ReactNode } from "react";
import { cx, css } from "emotion";

import { DropdownMenu } from "@jimengio/dropdown";
import DatePicker from "antd/lib/date-picker";
import dataPickerLocale from "antd/es/date-picker/locale/zh_CN";

import { formatString, lingual } from "../lingual";
import moment from "moment";

import { IFilterDropdownSelectField, IFilterDatePickerField, FuncUpdateItem } from "./types";
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

let styleDatePicker = css`
  min-width: 220px;
  input {
    color: #323232 !important;
    border-color: #e8e8e8 !important;
    border-radius: 2px !important;
    &:focus,
    &:hover {
      border-color: #3674ff !important;
      box-shadow: 0px 0px 2px 0px rgba(6, 53, 171, 0.3) !important;
    }

    ::-webkit-input-placeholder {
      color: #979797 !important;
    }

    ::-moz-placeholder {
      color: #979797 !important;
    }

    :-ms-input-placeholder {
      color: #979797 !important;
    }
  }
`;
