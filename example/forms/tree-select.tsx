import React, { FC, useState } from "react";
import { css } from "emotion";
import { DocDemo, DocSnippet, DocBlock } from "@jimengio/doc-frame";
import { MesonForm } from "../../src/form";
import { IMesonFieldItem } from "../../src/model/types";
import DataPreview from "kits/data-preview";
import { IDropdownTreeProps } from "@jimengio/dropdown";

import { DataNode } from "rc-tree-select/lib/interface";

let treeData: DataNode[] = [
  { id: "a", title: "data A", value: "a" },
  { id: "b", title: "data B", value: "b", children: [{ id: "ba", title: "data B A", value: "b-a" }] },
  { id: "c", title: "data C", value: "c" },
];

let dropdownTreeData: IDropdownTreeProps["items"] = [
  { key: "a", display: "data A", value: "a" },
  { key: "b", display: "data B", value: "b", children: [{ key: "ba", display: "data B A", value: "b-a" }] },
  { key: "c", display: "data C", value: "c" },
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
  {
    type: "dropdown-tree",
    name: "selected",
    label: "选中项",
    allowClear: true,
    options: dropdownTreeData,
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
        <DocBlock content={content} />
        <DocSnippet code={code} />

        <DocSnippet code={antdTreeSelectCode} />
      </DocDemo>
    </div>
  );
});

export default ExampleTreeSelect;

let code = `
let treeData: IDropdownTreeProps["items"] = [
  { key: "a", display: "data A", value: "a" },
  { key: "b", display: "data B", value: "b", children: [{ key: "ba", display: "data B A", value: "b-a" }] },
  { key: "c", display: "data C", value: "c" },
];

let formItems: IMesonFieldItem[] = [
  {
    type: "dropdown-tree",
    name: "selected",
    label: "选中项",
    allowClear: true,
    options: dropdownTreeData,
  },
];
`;

let antdTreeSelectCode = `
let treeData: TreeNode[] = [
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
`;

let content = "目前提供 `dropdown-tree` 和 `tree-select`(antd) 两种类型, 注意类型和样式上区分";
