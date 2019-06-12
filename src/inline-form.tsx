import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { useMesonCore } from "./hook/meson-core";
import { IMesonCustomField, EMesonFieldType, IMesonFieldItem, EMesonValidate, ISimpleObject, FuncMesonModifyForm } from "./model/types";
import { column, row } from "@jimengio/shared-utils";
import { CSSProperties } from "@emotion/serialize";
import Input from "antd/lib/input";
import TextArea from "antd/lib/input/TextArea";
import { formatString, lingual } from "./lingual";
import Select from "antd/lib/select";
import { RequiredMark } from "./component/misc";

let MesonInlineForm: FC<{
  initialValue: any;
  items: IMesonFieldItem[];
  onSubmit: (form: { [k: string]: any }, onServerErrors?: (x: ISimpleObject) => void) => void;
  onReset?: () => void;
  onCancel?: () => void;
  className?: string;
  style?: CSSProperties;
  onFieldChange?: (name: string, v: any, prevForm?: { [k: string]: any }, modifyFormObject?: FuncMesonModifyForm) => void;
  submitOnEdit?: boolean;
}> = (props) => {
  let onSubmit = (form: any) => {
    props.onSubmit(form);
  };

  let { formAny, errors, onCheckSubmit, checkItem, updateItem, forcelyResetForm, checkItemWithValue } = useMesonCore({
    initialValue: props.initialValue,
    items: props.items,
    onSubmit: onSubmit,
    submitOnEdit: props.submitOnEdit,
  });

  let renderItem = (item: IMesonFieldItem) => {
    switch (item.type) {
      case EMesonFieldType.Input:
        return (
          <Input
            value={formAny[item.name]}
            type={item.inputType || "text"}
            placeholder={item.placeholder || formatString(lingual.pleaseInputLabel, { label: item.label })}
            className={styleControlBase}
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

      case EMesonFieldType.Select:
        let currentValue = formAny[item.name];
        if (item.translateNonStringvalue && currentValue != null) {
          currentValue = `${currentValue}`;
        }
        return (
          <Select
            value={currentValue}
            placeholder={item.placeholder || formatString(lingual.pleaseInputLabel, { label: item.label })}
            className={styleControlBase}
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
        return <span>Not supported {item.type}</span>;
    }
  };

  return (
    <div className={cx(row, styleContainer)}>
      {props.items.map((item) => {
        if (item.type === EMesonFieldType.Fragment) {
          return <>{item.children.map(renderItem)}</>;
        }

        if (item.type === EMesonFieldType.Group) {
          return `Not supported type: ${item.type}`;
        }

        let name: string = item.name;
        let error = name != null ? errors[name] : null;
        let errorNode = error != null ? <span className={styleError}>{error}</span> : null;

        let labelNode = (
          <div className={styleLabel}>
            {item.required ? <RequiredMark /> : null}
            {item.label}
            {errorNode}
          </div>
        );

        return (
          <div className={styleItem}>
            {labelNode}
            <div>{renderItem(item)}</div>
          </div>
        );
      })}
    </div>
  );
};

export default MesonInlineForm;

let styleContainer = css``;

let styleError = css`
  color: red;
  margin-left: 8px;
`;

let styleControlBase = css``;

let styleLabel = css`
  font-size: 12px;
  color: hsla(0, 0%, 0%, 0.65);
`;

let styleItem = css`
  margin: 0 4px;
`;
