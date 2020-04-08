import React, { FC, useState } from "react";
import { css } from "emotion";
import { DocDemo, DocSnippet } from "@jimengio/doc-frame";
import { MesonForm } from "../../src/form";
import { IMesonFieldItem } from "../../src/model/types";
import DataPreview from "kits/data-preview";
import { DataNode } from "rc-tree-select/lib/interface";

let treeData: DataNode[] = [
  { id: "a", title: "data A", value: "a" },
  { id: "b", title: "data B", value: "b", children: [{ id: "ba", title: "data B A", value: "b-a" }] },
  { id: "c", title: "data C", value: "c" },
];

let formItems: IMesonFieldItem[] = [
  {
    type: "tree-select",
    name: "selected",
    label: "选中项",
    allowClear: true,
    treeSelectProps: {
      multiple: false,
      treeData: treeData,
    },
  },
  {
    type: "tree-select",
    name: "multipleSelected",
    label: "多个选中项",
    allowClear: true,
    treeSelectProps: {
      style: { width: 300 },
      multiple: true,
      treeData: treeData,
    },
  },
];

let ExampleTreeSelect: FC<{}> = React.memo((props) => {
  let [form, setForm] = useState({});

  /** Plugins */
  /** Methods */
  /** Effects */
  /** Renderers */
  return (
    <div>
      <DocDemo title={"Date picker demo"}>
        <MesonForm
          initialValue={form}
          items={formItems}
          onSubmit={(form) => {
            setForm(form);
          }}
        />
        <DataPreview data={form} />
        <DocSnippet code={code} />
      </DocDemo>
    </div>
  );
});

export default ExampleTreeSelect;

let code = `
let treeData: TreeNode[] = [
  { id: "a", title: "data A", value: "a" },
  { id: "b", title: "data B", value: "b", children:
    [
      { id: "ba", title: "data B A", value: "b-a" }
    ]
  },
  { id: "c", title: "data C", value: "c" },
];

let formItems: IMesonFieldItem[] = [
  {
    type: "tree-select",
    name: "selected",
    label: "选中项",
    allowClear: true,
    treeSelectProps: {
      multiple: false,
      treeData: treeData,
    },
  },
  {
    type: "tree-select",
    name: "multipleSelected",
    label: "多个选中项",
    allowClear: true,
    treeSelectProps: {
      style: { width: 300 },
      multiple: true,
      treeData: treeData,
    },
  },
];
`;
