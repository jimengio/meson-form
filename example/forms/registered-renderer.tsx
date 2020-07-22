import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm } from "../../src/form";
import { IMesonFieldItem, IMesonSelectItem, IMesonRegisteredField } from "../../src/model/types";

import DataPreview from "kits/data-preview";
import { DocDemo, DocBlock, DocSnippet } from "@jimengio/doc-frame";
import { getLink } from "util/link";
import { registerMesonFormRenderer } from "../../src/registered-renderer";
import Input from "antd/lib/input";
import { rowMiddle, Space } from "@jimengio/flex-styles";

registerMesonFormRenderer("my-input", (value, onChange, onCheck, form, options: { placeholder: string }, fieldItem) => {
  return (
    <div className={rowMiddle}>
      my global input
      <Space width={8} />
      <Input
        value={value}
        style={{ width: 200 }}
        placeholder={options.placeholder}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        onBlur={() => {
          onCheck(value);
        }}
      />
      <Space width={8} />
      with texts
    </div>
  );
});

let formItems: IMesonFieldItem[] = [
  {
    type: "registered",
    name: "name",
    label: "名字",
    required: true,
    renderType: "my-input",
    renderOptions: {
      placeholder: "name field",
    },
  },
];

let FormRegisteredRenderer: FC<{}> = (props) => {
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

export default FormRegisteredRenderer;

let styleContainer = css``;

let styleDemo = css`
  min-width: 400px;
`;

let content = `
`;

let code = `

`;
