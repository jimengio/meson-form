import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { MesonFormHandler, MesonFormForwarded } from "../../src/form-forwarded";
import { IMesonFieldItem } from "../../src/model/types";
import { row, column } from "@jimengio/flex-styles";
import DataPreview from "kits/data-preview";
import { DocDemo, DocBlock } from "@jimengio/doc-frame";
import { getLink } from "util/link";
import { JimoButton } from "@jimengio/jimo-basics";

let formItems: IMesonFieldItem<{ name?: string }>[] = [
  {
    type: "input",
    name: "name",
    label: "名字",
  },
];

let FormBasic: FC<{}> = (props) => {
  let [form, setForm] = useState({});
  const formRef = React.useRef<MesonFormHandler>(null);

  return (
    <div className={cx(column, styleContainer)}>
      <DocBlock content={contentSuggest}></DocBlock>
      <DocDemo title="Pass control to forward to another component" link={getLink("forward-form.tsx")}>
        <MesonFormForwarded<{ name?: string }>
          formRef={formRef}
          initialValue={form}
          items={formItems}
          hideFooter
          onSubmit={(form) => {
            setForm(form);
          }}
          onReset={() => {
            setForm({});
          }}
        />
        <div>
          <DataPreview data={form} />
          <div className={styleActions}>
            <JimoButton text="提交" fillColor onClick={() => formRef.current.onSubmit()} />
            <div style={{ width: "12px" }} />
            <JimoButton text="重置" canceling onClick={() => formRef.current.onReset()} />
          </div>
        </div>
      </DocDemo>
    </div>
  );
};

export default FormBasic;

let styleContainer = css``;

const styleActions = css`
  margin-top: 16px;
  display: flex;

  .ant-btn:not(:last-child) {
    margin-right: 16px;
  }
`;

let contentSuggest = `
Ref forwarding 的写法是为了解决自定义 Footer 的问题. 但是传递 Ref 的代码结构不那么清晰, 现在推荐用 [useMesonItems API](#/use-items) 来实现.
`;
