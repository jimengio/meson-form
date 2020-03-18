import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm, useMesonItems } from "../../src/form";
import { IMesonFieldItem, IMesonSelectItem } from "../../src/model/types";
import { row, Space } from "@jimengio/shared-utils";
import DataPreview from "kits/data-preview";
import { DocDemo, DocBlock, DocSnippet } from "@jimengio/doc-frame";
import { getLink } from "util/link";
import { JimoButton } from "@jimengio/jimo-basics";

let selectItems: IMesonSelectItem[] = [
  { value: "shanghai", display: "上海" },
  { value: "hangzhou", display: "杭州" },
];

let formItems: IMesonFieldItem[] = [
  { type: "input", name: "name", label: "名字", required: true },
  { type: "select", name: "city", options: selectItems, label: "城市", allowClear: true },
];

let intro = `
使用 \`useMesonItems\` 可以得到 items 的 UI 再自由进行组合, 没有内置组件 Footer 的局限.
`;

let contentInternals = `
\`formElements\` 是渲染完成的 Virtual DOM, 需要加入到父组件的 DOM 树当中. \`onCheckSubmit\` 是触发表单进行校验和提交的方法, 需要绑定到外部的按钮上.

\`initialValue\` 传入以后就是组件维护的内部状态, 通过 \`formInternals.formData\` 来获取实时的数据, 通过 \`formInternals.updateForm\` 可以通过 immer 更新.
类似还有 \`formInternals.updateErrors\` 用于修改报错信息.
`;

let contentResetForm = `业务当中开始编辑表单使用 \`formInternals.resetForm(data)\` API, 除了重置数据, 同时清空的报错信息. 对应 updateForm updateErrors 的功能.`;

let code = `
import { useMesonItems } from "@jimengio/meson-form";

let formItems: IMesonFieldItem[] = [
  { type: 'input', name: "name", label: "名字", required: true },
  { type: 'select', name: "city", options: selectItems, label: "城市" },
];

let [formElements, onCheckSubmit, formInternals] = useMesonItems({
  initialValue: {},
  items: formItems,
  onSubmit: (form) => {
    console.log('After validation:', form);
  },
});
`;

let codeUse = `
<div>
  <div>{formElements}</div>

  <div style={{ padding: 16 }}>
    Custom UI

    <JimoButton
      onClick={() => {
        formInternals.updateForm((draft) => {
          draft.name = "JIMENGIO";
        });
      }}
      text="Reset name"
    />

    <button onClick={onCheckSubmit}>onSubmit</button>
  </div>
</div>
`;

let codeCallback = `
let [formElements, onCheckSubmit, formInternals] = useMesonItems({
  initialValue: {},
  items: formItems,
  onSubmit: null,
});

onCheckSubmit({
  onSubmit: (form) => {
    console.log("submit when valid", form);
  },
});
`;

let contentCallback = `
\`onCheckSubmit\` 有一个比较特殊的用法, 可以在参数当中传入 \`onSubmit\`, 校验通过时会调用这个 \`onSubmit\`.
这样也就可以替代 props 当中的 \`onSubmit\` 使用, 而 props 当中就需要强行把 \`onSubmit\` 设置为 null 了.
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
        <div style={{ padding: 16 }}>
          Custom UI
          <Space width={16} />
          <JimoButton
            onClick={() => {
              formInternals.updateForm((draft) => {
                draft.name = "JIMENGIO";
              });
            }}
            text="Reset name"
          />
          <Space width={16} />
          <JimoButton
            fillColor
            onClick={() => {
              onCheckSubmit({
                onSubmit: (form) => {
                  console.log("when valid", form);
                },
              });
            }}
            text="onSubmit"
          />
        </div>

        <div className={styleData}>
          <code>formInternals.formData</code>: <pre className={styleCode}>{JSON.stringify(formInternals.formData, null, 2)}</pre>
        </div>

        <DataPreview data={form} />

        <DocSnippet code={code} />

        <DocBlock content={contentInternals} />

        <DocSnippet code={codeUse} />

        <DocBlock content={contentResetForm} />
      </DocDemo>

      <DocDemo title="Callback syntax">
        <DocBlock content={contentCallback} />
        <DocSnippet code={codeCallback} />
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
