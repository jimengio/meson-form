import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm } from "meson-form";
import { EMesonFooterLayout } from "../../src/component/form-footer";
import { IMesonSelectItem, IMesonFieldItem, EMesonValidate } from "../../src/model/types";
import Input from "antd/lib/input";
import { row } from "@jimengio/shared-utils";
import DataPreview from "kits/data-preview";
import { DocDemo } from "@jimengio/doc-frame";
import { getLink } from "util/link";

interface IDemo {
  material: string;
  amount: number;
  count: string;
  price: string;
  name: string;
  size: number;
  description: string;
  materialInside: string;
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
    type: "select",
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
    type: "number",
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
    type: "number",
    label: "计数",
    name: "count",
    required: true,
    validateMethods: [EMesonValidate.Number],
  },
  {
    type: "input",
    shouldHide: (form) => {
      return form.amount && form.amount > 6;
    },
    label: "单价",
    name: "price",
    required: true,
  },
  {
    type: "textarea",
    label: "描述",
    name: "description",
    required: true,
  },
  {
    type: "group",
    shouldHide: () => true,
    children: [
      {
        type: "textarea",
        label: "描述",
        name: "description",
        required: true,
      },
    ],
  },
  {
    type: "custom",
    name: null,
    label: "Width test",
    render: (value) => {
      return <div className={styleWideColor} />;
    },
  },
  {
    type: "nested",
    label: "Nested",
    children: [{ type: "select", label: "物料", name: "materialInside", required: true, options: options }],
  },
  {
    type: "custom",
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

let DraftForm: FC<{}> = (props) => {
  let [form, setForm] = useState({} as IDemo);

  return (
    <div className={cx(row, styleContainer)}>
      <DocDemo title={"Demo containing multiple features"} link={getLink("draft.tsx")}>
        <div className={styleFormArea}>
          <MesonForm
            initialValue={form}
            items={formItems}
            onSubmit={(form) => {
              setForm(form);
            }}
            onCancel={() => {
              setForm({} as IDemo);
            }}
            footerLayout={EMesonFooterLayout.Center}
            submitOnEdit={false}
          />
        </div>
        <div>
          <DataPreview data={form} />
        </div>
      </DocDemo>
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
  /* height: 660px; */
`;
