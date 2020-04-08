import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm } from "../../src/form";
import { IMesonFieldItem } from "../../src/model/types";
import { row } from "@jimengio/flex-styles";
import DataPreview from "kits/data-preview";
import { DocDemo, DocSnippet, DocBlock } from "@jimengio/doc-frame";
import { getLink } from "util/link";

let formItems: IMesonFieldItem[] = [
  {
    type: "decorative",
    render: () => <h1>From</h1>,
  },
  {
    type: "input",
    name: "name",
    label: "名字",
  },
  {
    type: "decorative",
    render: (form) => <span>hello {form.name}</span>,
  },
  {
    type: "input",
    name: "address",
    label: "地址",
  },
  {
    type: "switch",
    name: "switch",
    label: "switch",
  },
  {
    type: "decorative",
    render: (form) => <span>shouldHide</span>,
    shouldHide: (form) => form.switch,
  },
];

let DecorativePage: FC<{}> = (props) => {
  let [form, setForm] = useState({});

  return (
    <div className={cx(row, styleContainer)}>
      <DocDemo title="Decorative" link={getLink("decorative.tsx")}>
        <DocBlock content={contentDecorative} />
        <DocSnippet code={codeDecorative} />

        <MesonForm
          initialValue={form}
          items={formItems}
          onSubmit={(form) => {
            setForm(form);
          }}
        />
        <div>
          <DataPreview data={form} />
        </div>
      </DocDemo>
    </div>
  );
};

export default DecorativePage;

let styleContainer = css``;

let codeDecorative = `
{
  type: 'decorative',
  render: (form) => <span>hello {form.name}</span>,
},

{
  type: 'decorative',
  render: (form) => <span>shouldHide</span>,
  shouldHide: (form) => form.switch,
},

`;

let contentDecorative = `
Decorative 类型的 field 通过 render 方法来渲染节点, 跟数据无关, 一般用来插入章节标题.
也支持 \`shouldHide\` 属性用于控制隐藏节点.
`;
