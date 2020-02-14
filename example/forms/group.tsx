import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm } from "meson-form";
import { EMesonFooterLayout } from "../../src/component/form-footer";
import { IMesonSelectItem, IMesonFieldItem, EMesonValidate } from "../../src/model/types";
import Input from "antd/lib/input";
import { row, expand } from "@jimengio/shared-utils";
import DataPreview from "kits/data-preview";
import SourceLink from "kits/source-link";
import { DocDemo } from "@jimengio/doc-frame";
import { getLink } from "util/link";

interface IDemo {
  visibility: boolean;
  a: string;
  b: string;
  c: string;
  d: string;
  e: string;
  f: string;
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
    type: "switch",
    label: "Show/hide",
    name: "visibility",
  },
  {
    type: "group",
    shouldHide: (form) => form.visibility,
    children: [
      {
        type: "input",
        label: "a",
        name: "a",
        required: true,
      },
      {
        type: "textarea",
        label: "b",
        name: "b",
        required: true,
        fullWidth: true,
      },
    ],
  },
  {
    type: "nested",
    label: "Nested",
    children: [
      { type: "select", label: "物料", name: "c", required: true, options: options },
      { type: "input", label: "d", name: "d" },
    ],
  },
  {
    type: "group",
    horizontal: true,
    children: [
      {
        type: "input",
        label: "e",
        name: "e",
      },
      {
        type: "textarea",
        label: "f",
        name: "f",
      },
    ],
  },
];

let formItems2: IMesonFieldItem[] = [
  {
    type: "decorative",
    render: () => <h2>Group 01 (width: 200px)</h2>,
  },
  {
    type: "group",
    horizontal: true,
    itemWidth: 200,
    children: [
      {
        type: "input",
        label: "1-1",
        name: "1-1",
      },
      {
        type: "input",
        label: "1-2",
        name: "1-2",
      },
      {
        type: "input",
        label: "1-3",
        name: "1-3",
      },
      {
        type: "input",
        label: "1-4",
        name: "1-4",
      },
    ],
  },
  {
    type: "decorative",
    render: () => <h2>Group 02 (width: 50%)</h2>,
  },
  {
    type: "group",
    horizontal: true,
    itemWidth: "50%",
    children: [
      {
        type: "input",
        label: "2-1",
        name: "2-1",
      },
      {
        type: "input",
        label: "2-2",
        name: "2-2",
      },
    ],
  },
];

let GroupPage: FC<{}> = (props) => {
  let [form, setForm] = useState({} as IDemo);
  let [form2, setForm2] = useState({});

  return (
    <div className={expand}>
      <DocDemo title="Control show/hide by group" link={getLink("group.tsx")}>
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
        <DataPreview data={form} />
      </DocDemo>

      <DocDemo title="Horizontal group" link={getLink("group.tsx")}>
        <MesonForm
          fullWidth
          initialValue={form2}
          items={formItems2}
          onSubmit={(form) => {
            setForm2(form);
          }}
          footerLayout={EMesonFooterLayout.Center}
          submitOnEdit={false}
        />
        <div>
          <SourceLink fileName={"group.tsx"} />
          <DataPreview data={form2} />
        </div>
      </DocDemo>
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
