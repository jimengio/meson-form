import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm } from "../../src/form";
import { IMesonFieldItem } from "../../src/model/types";
import { row } from "@jimengio/flex-styles";
import DataPreview from "kits/data-preview";
import Input from "antd/lib/input";
import { DocDemo, DocSnippet } from "@jimengio/doc-frame";
import { getLink } from "util/link";

let formItems: IMesonFieldItem[] = [
  {
    type: "custom",
    name: "x",
    label: "自定义",
    render: (value, onChange, form, onCheck) => {
      return (
        <div className={row}>
          <div>
            Custome input
            <Input
              onChange={(event) => {
                onChange(event.target.value);
              }}
              placeholder={"Custom field"}
              onBlur={() => {
                onCheck(value);
              }}
            />
          </div>
        </div>
      );
    },
  },
];

let CustomPage: FC<{}> = (props) => {
  let [form, setForm] = useState({});

  return (
    <div className={cx(row, styleContainer)}>
      <DocDemo title={"Custom rendering"} link={getLink("custom.tsx")}>
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

        <DocSnippet code={codeCustom} />
      </DocDemo>
    </div>
  );
};

export default CustomPage;

let styleContainer = css``;

let codeCustom = `
let formItems: IMesonFieldItem[] = [
  {
    type: 'custom',
    name: "x",
    label: "自定义",
    render: (value, onChange, form, onCheck) => {
      return (
        <div className={row}>
          <div>
            Custome input
            <Input
              onChange={(event) => {
                onChange(event.target.value);
              }}
              placeholder={"Custom field"}
              onBlur={() => {
                onCheck(value);
              }}
            />
          </div>
        </div>
      );
    },
  },
];
`;
