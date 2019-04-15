import React from "react";
import { parseRoutePath, IRouteParseResult } from "@jimengio/ruled-router";
import { css } from "emotion";
import { MesonForm, IMesonFieldItem, EMesonFieldType } from "meson-form";
import { Input } from "antd";
import { EMesonValidate, IMesonSelectitem } from "../../src/model/types";

export default (props) => {
  let options: IMesonSelectitem[] = [
    {
      value: "1",
      display: "one",
    },
    {
      value: "2",
      display: "two",
    },
  ];

  let formItems: IMesonFieldItem[] = [
    {
      type: EMesonFieldType.Select,
      label: "物料",
      initialValue: null,
      name: "material",
      required: true,
      options: options,
      validator: (x) => {
        if (x == null) {
          return "material is required";
        }
        if (x.length > 10) {
          return "string too long";
        }
      },
    },
    {
      type: EMesonFieldType.Number,
      label: "数量",
      initialValue: 1,
      name: "amount",
      required: true,
      validator: (x) => {
        if (x == null) {
          return "amount is required";
        }
        if (x > 10) {
          return "too marge";
        }
      },
    },
    {
      type: EMesonFieldType.Number,
      label: "计数",
      initialValue: 1,
      name: "count",
      required: true,
      validateMethods: [EMesonValidate.Number],
    },
    {
      type: EMesonFieldType.Input,
      shouldHide: (form) => {
        return form.amount && form.amount > 6;
      },
      label: "单价",
      initialValue: "x",
      name: "price",
      required: true,
    },
    {
      type: EMesonFieldType.Group,
      label: "group",
      children: [{ type: EMesonFieldType.Select, label: "物料", initialValue: null, name: "materialInside", required: true, options: options }],
    },
    {
      type: EMesonFieldType.Custom,
      name: "size",
      label: "自定义",
      render: (value, onChange) => {
        return (
          <Input
            value={value}
            onChange={(event) => {
              let newValue = event.target.value;
              onChange(newValue);
            }}
          />
        );
      },
    },
  ];

  return (
    <div className={styleContainer}>
      <div className={styleTitle}>Form example</div>

      <MesonForm
        initialValue={{}}
        items={formItems}
        onFieldChange={(k, v) => {
          console.log("edited", k, v);
        }}
        onSubmit={(form) => {
          console.log("submit data", form);
        }}
        onCancel={() => {
          console.log("cancel");
        }}
      />
    </div>
  );
};

const styleContainer = css`
  font-family: "Helvetica";
`;

const styleTitle = css`
  margin-bottom: 16px;
`;
