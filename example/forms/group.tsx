import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm } from "meson-form";
import { EMesonFooterLayout } from "../../src/component/form-footer";
import { IMesonSelectItem, IMesonFieldItem, EMesonFieldType, EMesonValidate } from "../../src/model/types";
import Input from "antd/lib/input";
import { row } from "@jimengio/shared-utils";
import DataPreview from "kits/data-preview";
import SourceLink from "kits/source-link";

interface IDemo {
  visibility: boolean;
  a: string;
  b: string;
  c: string;
  d: string;
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
    type: EMesonFieldType.Switch,
    label: "Show/hide",
    name: "visibility",
  },
  {
    type: EMesonFieldType.Group,
    shouldHide: (form) => form.visibility,
    children: [
      {
        type: EMesonFieldType.Input,
        label: "a",
        name: "a",
        required: true,
      },
      {
        type: EMesonFieldType.Input,
        textarea: true,
        label: "b",
        name: "b",
        required: true,
      },
    ],
  },
  {
    type: EMesonFieldType.Nested,
    label: "Nested",
    children: [
      { type: EMesonFieldType.Select, label: "物料", name: "c", required: true, options: options },
      { type: EMesonFieldType.Input, label: "d", name: "d" },
    ],
  },
];

let GroupPage: FC<{}> = (props) => {
  let [form, setForm] = useState({} as IDemo);

  return (
    <div className={cx(row, styleContainer)}>
      <div className={styleFormArea}>
        <MesonForm<IDemo>
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
        <SourceLink fileName={"draft.tsx"} />
        <DataPreview data={form} />
      </div>
    </div>
  );
};

export default GroupPage;

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
