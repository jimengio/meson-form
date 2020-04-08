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
    type: "switch",
    name: "checked",
    label: "Checked",
  },
  {
    type: "switch",
    name: "checked",
    label: "Check disabled",
    disabled: true,
  },
];

let SwitchPage: FC<{}> = (props) => {
  let [form, setForm] = useState({});

  return (
    <div className={cx(row, styleContainer)}>
      <DocDemo title="Demo of switch type" link={getLink("switch.tsx")}>
        <DocBlock content={contentSwitch} />
        <DocSnippet code={codeSwitch} />
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

export default SwitchPage;

let styleContainer = css``;

let codeSwitch = `
let formItems: IMesonFieldItem[] = [
  {
    type: 'switch',
    name: "checked",
    label: "Checked",
  },
  {
    type: 'switch',
    name: "checked",
    label: "Check disabled",
    disabled: true,
  },
];
`;

let contentSwitch = `
支持简单的 Switch 组件.
`;
