import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm, useMesonItems } from "../../src/form";
import { IMesonFieldItem, EMesonFieldType } from "../../src/model/types";
import { row, Space } from "@jimengio/shared-utils";
import DataPreview from "kits/data-preview";
import { DocDemo, DocBlock } from "@jimengio/doc-frame";
import { getLink } from "util/link";

let formItems: IMesonFieldItem[] = [
  {
    type: EMesonFieldType.Input,
    name: "name",
    label: "名字",
  },
  {
    type: EMesonFieldType.Input,
    name: "name",
    label: "名字禁用",
    disabled: true,
  },
];

let intro = `
使用 \`useMesonItems\` 可以自由渲染提交按钮:

\`\`\`ts
let [formElements, onCheckSubmit, formInternals] = useMesonItems({
  initialValue: form,
  items: formItems,
  onSubmit: (form) => {
    setForm(form);
  },
});

return <div>
  {formElements}
  <button onClick={onCheckSubmit}>提交</button>
</div>
\`\`\`
`;

let FormUseItems: FC<{}> = (props) => {
  let [form, setForm] = useState({});

  let [formElements, onCheckSubmit, formInternals] = useMesonItems({
    initialValue: form,
    items: formItems,
    onSubmit: (form) => {
      setForm(form);
    },
  });

  return (
    <div className={cx(styleContainer)}>
      <DocBlock content={intro}></DocBlock>
      <DocDemo title={"Hooks API for items"} link={getLink("use-items.tsx")} className={styleDemo}>
        <div>{formElements}</div>

        <div className={styleData}>
          Form data:
          <pre className={styleCode}>{JSON.stringify(formInternals.formData, null, 2)}</pre>
        </div>

        <div style={{ padding: 16 }}>
          Custom UI
          <Space width={16} />
          <button onClick={onCheckSubmit}>onSubmit</button>
        </div>
        <DataPreview data={form} />
      </DocDemo>
    </div>
  );
};

export default FormUseItems;

let styleContainer = css``;

let styleDemo = css`
  min-width: 400px;
`;

let styleData = css`
  padding: 16px;
`;

let styleCode = css`
  padding: 16px;
  background-color: hsl(0, 0%, 97%);
`;
