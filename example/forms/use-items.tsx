import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm, useMesonItems } from "../../src/form";
import { IMesonFieldItem, EMesonFieldType, IMesonSelectItem } from "../../src/model/types";
import { row, Space } from "@jimengio/shared-utils";
import DataPreview from "kits/data-preview";
import { DocDemo, DocBlock, DocSnippet } from "@jimengio/doc-frame";
import { getLink } from "util/link";
import { JimoButton } from "@jimengio/jimo-basics";

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

let intro = `
使用 \`useMesonItems\` 可以得到 items 的 UI 再自由进行组合, 没有内置组件 Footer 的局限.
`;

let code = `
import { useMesonItems } from "@jimengio/meson-form";

let [form, setForm] = useState({});

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
    disabled: true,
  },
];

let [formElements, onCheckSubmit, formInternals] = useMesonItems({
  initialValue: form,
  items: formItems,
  onSubmit: (form) => {
    setForm(form);
  },
});

<div>
  <div>{formElements}</div>
  <div style={{ padding: 16 }}>
    Custom UI
    <Space width={16} />
    <button onClick={onCheckSubmit}>onSubmit</button>
  </div>
</div>
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

  let { updateForm } = formInternals;

  return (
    <div className={cx(styleContainer)}>
      <DocBlock content={intro}></DocBlock>
      <DocDemo title={"Hooks API for items"} link={getLink("use-items.tsx")} className={styleDemo}>
        <div>{formElements}</div>
        <div style={{ padding: 16 }}>
          Custom UI
          <Space width={16} />
          <JimoButton
            onClick={() => {
              updateForm((draft) => {
                draft.name = "JIMENGIO";
              });
            }}
            text="Reset name"
          />
          <Space width={16} />
          <JimoButton fillColor onClick={onCheckSubmit} text="onSubmit" />
        </div>

        <div className={styleData}>
          Form data:
          <pre className={styleCode}>{JSON.stringify(formInternals.formData, null, 2)}</pre>
        </div>

        <DataPreview data={form} />

        <DocSnippet code={code} />
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
