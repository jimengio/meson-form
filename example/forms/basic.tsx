import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm } from "../../src/form";
import { IMesonFieldItem, EMesonFieldType, IMesonSelectItem } from "../../src/model/types";
import { row } from "@jimengio/shared-utils";
import DataPreview from "kits/data-preview";
import { DocDemo, DocBlock, DocSnippet } from "@jimengio/doc-frame";
import { getLink } from "util/link";

let content = `
Meson Form 基本的用法是用 JSON 结构的数据定义规则, 然后交给 \`<MesonForm/>\` 组件渲染.

仓库 https://github.com/jimengio/meson-form
`;

let code = `
import { MesonForm, IMesonFieldItem, EMesonFieldType } from "@jimengio/meson-form";

let selectItems: IMesonSelectItem[] = [
  {
    value: "shanghai",
    display: "上海",
  },
  {
    value: "hangzhou",
    display: "杭州",
  },
];

let formItems: IMesonFieldItem[] = [
  {
    type: EMesonFieldType.Input,
    name: "name",
    label: "名字",
    required: true,
  },
  {
    type: EMesonFieldType.Select,
    name: "city",
    options: selectItems,
    label: "城市",
  },
];


let [form, setForm] = useState({});

<MesonForm
  initialValue={form}
  items={formItems}
  onSubmit={(form) => {
    setForm(form);
  }}
/>;
`;

let selectItems: IMesonSelectItem[] = [
  {
    value: "shanghai",
    display: "上海",
  },
  {
    value: "hangzhou",
    display: "杭州",
  },
];

let formItems: IMesonFieldItem[] = [
  {
    type: EMesonFieldType.Input,
    name: "name",
    label: "名字",
    required: true,
  },
  {
    type: EMesonFieldType.Select,
    name: "city",
    options: selectItems,
    label: "城市",
  },
];

let FormBasic: FC<{}> = (props) => {
  let [form, setForm] = useState({});

  return (
    <div className={cx(styleContainer)}>
      <DocBlock content={content}></DocBlock>
      <DocDemo title={"A basic form"} link={getLink("basic.tsx")} className={styleDemo}>
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
};

export default FormBasic;

let styleContainer = css``;

let styleDemo = css`
  min-width: 400px;
`;
