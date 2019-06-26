import React, { SFC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm } from "meson-form";
import { EMesonFooterLayout } from "../../src/component/form-footer";
import { IMesonSelectItem, IMesonFieldItem, EMesonFieldType, EMesonValidate } from "../../src/model/types";
import Input from "antd/lib/input";
import { row } from "@jimengio/shared-utils";
import DataPreview from "kits/data-preview";
import SourceLink from "kits/source-link";

interface IDemo {
  material: string;
  amount: number;
  count: string;
  price: string;
  name: string;
  size: number;
  description: string;
}

let options: IMesonSelectItem[] = [
  {
    value: "1",
    display: "one",
  },
  {
    value: "2",
    display: "two",
  },
];

let formItems: IMesonFieldItem<IDemo>[] = [
  {
    type: EMesonFieldType.Select,
    label: "物料",
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
    name: "amount",
    required: true,
    validator: (x) => {
      if (x == null) {
        return "amount is required";
      }
      if (x > 10) {
        return "too large";
      }
    },
  },
  {
    type: EMesonFieldType.Number,
    label: "计数",
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
    name: "price",
    required: true,
  },
  {
    type: EMesonFieldType.Input,
    textarea: true,
    label: "描述",
    name: "description",
    required: true,
  },
  {
    type: EMesonFieldType.Fragment,
    shouldHide: () => true,
    children: [
      {
        type: EMesonFieldType.Input,
        textarea: true,
        label: "描述",
        name: "description",
        required: true,
      },
    ],
  },
  {
    type: EMesonFieldType.Custom,
    name: null,
    label: "Width test",
    render: (value) => {
      return <div className={styleWideColor} />;
    },
  },
  {
    type: EMesonFieldType.Group,
    label: "group",
    children: [{ type: EMesonFieldType.Select, label: "物料", name: "materialInside", required: true, options: options }],
  },
  {
    type: EMesonFieldType.Custom,
    name: "size",
    label: "自定义",
    render: (value, onChange, form, onCheck) => {
      return (
        <div className={row}>
          <div>
            <Input
              value={value}
              onChange={(event) => {
                let newValue = event.target.value;
                onChange(newValue);
              }}
              onBlur={() => {
                onCheck(value);
              }}
            />
          </div>
        </div>
      );
    },
  },
];

let DraftForm: SFC<{}> = (props) => {
  let [form, setForm] = useState({});

  return (
    <div className={cx(row, styleContainer)}>
      <div className={styleFormArea}>
        <MesonForm
          initialValue={form}
          items={formItems}
          onSubmit={(form) => {
            setForm(form);
          }}
          onCancel={() => {
            setForm({});
          }}
          footerLayout={EMesonFooterLayout.Center}
          submitOnEdit={false}
        />
      </div>
      <div>
        <SourceLink fileName={"draft.tsx"} />
        <DataPreview data={form} />
      </div>
    </div>
  );
};

export default DraftForm;

let styleContainer = css``;

let styleWideColor = css`
  background-color: #eee;
  height: 40px;
  width: 600px;
  max-width: 100%;
`;

let styleFormArea = css`
  width: 480px;
  height: 660px;
  border: 1px solid #ccc;
`;
