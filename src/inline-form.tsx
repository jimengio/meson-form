import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { useMesonCore } from "./hook/meson-core";
import { IMesonFieldItem, FuncMesonModifyForm, IMesonErrors, FieldValues, FieldName } from "./model/types";
import { column, row } from "@jimengio/flex-styles";
import { CSSProperties } from "@emotion/serialize";
import Input from "antd/lib/input";
import { formatString, lingual } from "./lingual";
import Select from "antd/lib/select";
import { RequiredMark } from "./component/misc";
import { styleInput, styleSelect } from "./style";

export function MesonInlineForm<T extends FieldValues>(props: {
  initialValue: T;
  items: IMesonFieldItem<T>[];
  onSubmit: (form: T, onServerErrors?: (x: IMesonErrors<T>) => void) => void;
  onReset?: () => void;
  onCancel?: () => void;
  className?: string;
  style?: CSSProperties;
  onFieldChange?: (name: FieldName<T>, v: any, prevForm?: T, modifyFormObject?: FuncMesonModifyForm<T>) => void;
  submitOnEdit?: boolean;
}) {
  let onSubmit = (form: T) => {
    props.onSubmit(form);
  };

  let { formAny, errors, onCheckSubmit, checkItem, updateItem, checkItemWithValue } = useMesonCore<T, any>({
    initialValue: props.initialValue,
    items: props.items,
    onSubmit: onSubmit,
    submitOnEdit: props.submitOnEdit,
    onFieldChange: props.onFieldChange,
  });

  let renderItem = (item: IMesonFieldItem<T>, idx: number) => {
    switch (item.type) {
      case "custom":
        let onChange = (value: any) => {
          updateItem(value, item);
        };

        let onCheck = (value: any) => {
          checkItemWithValue(value, item);
        };
        return item.render(formAny[item.name], onChange, formAny, onCheck);
      case "input":
        return (
          <Input
            value={formAny[item.name] as any}
            key={`${item.name}+${idx}`}
            disabled={item.disabled}
            type={item.inputType || "text"}
            style={item.style}
            placeholder={item.placeholder || formatString(lingual.pleaseInputLabel, { label: item.label })}
            className={cx(styleInput, styleControlBase)}
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
        );

      case "select":
        let currentValue: any = formAny[item.name];
        if (item.translateNonStringvalue && currentValue != null) {
          currentValue = `${currentValue}`;
        }
        return (
          <Select
            value={currentValue}
            key={`${item.name}+${idx}`}
            placeholder={item.placeholder || formatString(lingual.pleaseSelectLabel, { label: item.label })}
            className={cx(styleSelect, styleControlBase)}
            style={item.style}
            onChange={(newValue: string) => {
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
      default:
        return <span key={`_+${idx}`}>Not supported {item.type}</span>;
    }
  };

  return (
    <div className={cx(row, styleContainer)}>
      {props.items.map((item, idx) => {
        if (item.type === "group") {
          return <>{item.children.map(renderItem)}</>;
        }

        if (item.type === "nested") {
          return `Not supported type: ${item.type}`;
        }

        if (item.type === "custom-multiple") {
          return `Not supported type: ${item.type}`;
        }

        if (item.type === "decorative") {
          return `Not supported type: ${item.type}`;
        }

        let name = item.name;
        let error = name != null ? errors[name] : null;
        let errorNode = error != null ? <span className={styleError}>{error}</span> : null;

        let labelNode = item.hideLabel ? null : (
          <div className={styleLabel}>
            {item.required ? <RequiredMark /> : null}
            {item.label}
            {errorNode}
          </div>
        );

        return (
          <div className={styleItem} key={`${item.name}+${idx}`}>
            {labelNode}
            <div>{renderItem(item, idx)}</div>
          </div>
        );
      })}
    </div>
  );
}

export default MesonInlineForm;

let styleItem = css`
  margin-right: 12px;

  &:last-of-type {
    margin-right: 0;
  }
`;

let styleContainer: string = null;

let styleError = css`
  color: red;
  margin-left: 8px;
`;

let styleControlBase = css`
  min-width: 120px;
`;

let styleLabel = css`
  font-size: 14px;
  line-height: 32px;
  color: hsla(0, 0%, 0%, 0.65);
`;
