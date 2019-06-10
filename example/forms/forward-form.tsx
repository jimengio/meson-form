import React, { SFC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm, MesonFormHandler } from "../../src/form";
import { IMesonFieldItem, EMesonFieldType } from "../../src/model/types";
import { row } from "@jimengio/shared-utils";
import DataPreview from "kits/data-preview";
import SourceLink from "kits/source-link";
import Button from "antd/lib/button";

let formItems: IMesonFieldItem[] = [
  {
    type: EMesonFieldType.Input,
    name: "name",
    label: "名字",
  },
];

let FormBasic: SFC<{}> = (props) => {
  let [form, setForm] = useState({});
  const formRef = React.useRef<MesonFormHandler>(null);

  return (
    <div className={cx(row, styleContainer)}>
      <MesonForm
        ref={formRef}
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
        <SourceLink fileName={"forward-form.tsx"} />
        <DataPreview data={form} />
        <div className={styleActions}>
          <Button
            type="primary"
            onClick={() => {
              formRef.current.onSubmit();
            }}
          >
            提交
          </Button>
          <Button
            type="ghost"
            onClick={() => {
              formRef.current.onReset();
            }}
          >
            重置
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FormBasic;

let styleContainer = css``;

const styleActions = css`
  margin-top: 16px;

  .ant-btn:not(:last-child) {
    margin-right: 16px;
  }
`;
