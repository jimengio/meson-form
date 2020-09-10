import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { useMesonFields } from "../../src/form";
import { IMesonFieldItem, IMesonSelectItem } from "../../src/model/types";
import { row, Space } from "@jimengio/flex-styles";
import DataPreview from "kits/data-preview";
import { DocDemo, DocBlock, DocSnippet } from "@jimengio/doc-frame";
import { getLink } from "util/link";
import Button from "antd/lib/button";

let selectItems: IMesonSelectItem[] = [
  { value: "shanghai", display: "上海" },
  { value: "hangzhou", display: "杭州" },
];

let formItems: IMesonFieldItem[] = [
  { type: "input", name: "name", label: "名字", required: true },
  { type: "select", name: "city", options: selectItems, label: "城市", allowClear: true },
];

let FormUseItems: FC<{}> = (props) => {
  let [form, setForm] = useState({});

  let fieldsPlugin = useMesonFields({
    initialValue: form,
    items: formItems,
    onSubmit: (form) => {
      setForm(form);
    },
  });

  let transferPlugin = useMesonFields<any, string>({
    initialValue: form,
    items: formItems,
    onSubmit: (form, _, transferData) => {
      console.log(form, transferData);
    },
  });

  return (
    <div className={cx(styleContainer)}>
      <DocBlock content={intro}></DocBlock>
      <DocDemo title={"Hooks API for items"} link={getLink("use-items.tsx")} className={styleDemo}>
        <div>{fieldsPlugin.ui}</div>
        <div style={{ padding: 16 }}>
          Custom UI
          <Space width={16} />
          <Button
            onClick={() => {
              fieldsPlugin.updateInternalForm((draft) => {
                draft.city = undefined;
                draft.name = "JIMENGIO";
              });
            }}
            children="Reset name"
          />
          <Space width={16} />
          <Button
            type="primary"
            onClick={() => {
              fieldsPlugin.checkAndSubmit({
                onSubmit: (form) => {
                  console.log("when valid", form);
                },
              });
            }}
            children="onSubmit"
          />
        </div>

        <div className={styleData}>
          <code>formInternals.formData</code>: <pre className={styleCode}>{JSON.stringify(fieldsPlugin.formData, null, 2)}</pre>
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

      <DocDemo title={"transferData"} link={getLink("use-items.tsx")} className={styleDemo}>
        <DocBlock content={transferContent} />
        <div>{transferPlugin.ui}</div>
        <div className={row}>
          <Space width={240} />
          <Button
            type="primary"
            children="Submit"
            onClick={() => {
              transferPlugin.checkAndSubmit({
                transferData: "data passed",
              });
            }}
          />
        </div>
        <DocSnippet code={transferCode} />
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

let intro = `
使用 \`useMesonFields\` 可以得到 items 的 UI 再自由进行组合, 没有内置组件 Footer 的局限.
`;

let contentInternals = `
\`formElements\` 是渲染完成的 Virtual DOM, 需要加入到父组件的 DOM 树当中. \`onCheckSubmit\` 是触发表单进行校验和提交的方法, 需要绑定到外部的按钮上.

\`initialValue\` 传入以后就是组件维护的内部状态, 通过 \`fieldsPlugin.formData\` 来获取实时的数据, 通过 \`fieldsPlugin.updateInternalForm\` 来倾向修改内部状态.
`;

let contentResetForm = `业务当中开始编辑表单使用 \`formInternals.resetForm(data)\` API, 除了重置数据, 同时清空的报错信息. 对应 \`updateInternalForm\` \`updateInternalErrors\` 的功能.`;

let code = `
import { useMesonFields } from "@jimengio/meson-form";

let formItems: IMesonFieldItem[] = [
  { type: 'input', name: "name", label: "名字", required: true },
  { type: 'select', name: "city", options: selectItems, label: "城市" },
];

let fieldsPlugin = useMesonFields({
  initialValue: {},
  items: formItems,
  onSubmit: (form) => {
    console.log('After validation:', form);
  },
});
`;

let codeUse = `
<div>
  <div>{fieldsPlugin.ui}</div>

  <div style={{ padding: 16 }}>
    Custom UI

    <Button
      onClick={() => {
        fieldsPlugin.updateInternalForm((draft) => {
          draft.name = "JIMENGIO";
        });
      }}
      children="Reset name"
    />

    <button onClick={fieldsPlugin.checkAndSubmit}>onSubmit</button>
  </div>
</div>
`;

let codeCallback = `
let fieldsPlugin = useMesonFields({
  initialValue: {},
  items: formItems,
  onSubmit: null,
});

fieldsPlugin.checkAndSubmit({
  onSubmit: (form) => {
    console.log("submit when valid", form);
  },
});
`;

let contentCallback = `
\`fieldsPlugin.checkAndSubmit\` 有一个比较特殊的用法, 可以在参数当中传入 \`onSubmit\`, 校验通过时会调用这个 \`onSubmit\`.
这样也就可以替代 props 当中的 \`onSubmit\` 使用, 而 props 当中就需要强行把 \`onSubmit\` 设置为 null 了.
`;

let transferCode = `
let transferPlugin = useMesonFields<any, string>({
  initialValue: form,
  items: formItems,
  onSubmit: (form, _, transferData) => {
    console.log(form, transferData);
  },
});

transferPlugin.checkAndSubmit({
  transferData: "data passed",
});
`;

let transferContent = `
需要传递上下文的时候, 可以用 \`transferData\` 强行传递数据, 可以在定义的时候声明类型.
`;
