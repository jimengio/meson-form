import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm } from "../../src/form";
import { IMesonFieldItem } from "../../src/model/types";
import { row } from "@jimengio/shared-utils";
import DataPreview from "kits/data-preview";
import { DocDemo, DocSnippet, DocBlock } from "@jimengio/doc-frame";
import { getLink } from "util/link";

let formItems: IMesonFieldItem[] = [
  {
    type: "input",
    name: "name",
    label: "Name",
  },
  {
    type: "input",
    name: "address",
    label: "Address",
  },
  {
    type: "input",
    name: "hideLabel1",
    label: "hideLabel(false)",
    hideLabel: false,
  },
  {
    type: "input",
    name: "hideLabel2",
    label: "hideLabel(true)",
    hideLabel: true,
  },
];

let formItems2: IMesonFieldItem[] = [
  {
    type: "input",
    name: "username",
    placeholder: "* username",
    label: "username",
    required: true,
  },
  {
    type: "input",
    name: "password",
    label: "password",
    placeholder: "* password",
    required: true,
  },
];

let NoLabelPage: FC<{}> = (props) => {
  let [form, setForm] = useState({});
  let [form2, setForm2] = useState({});
  let [showLabel, setShowLabel] = useState<boolean>();

  return (
    <div className={cx(styleContainer)}>
      <DocDemo title="Form layout with no table" link={getLink("no-label.tsx")}>
        <DocBlock content={contentHideLabel} />
        <DocSnippet code={codeHideLabel} />
        <label>
          noLabel: <input type="checkbox" checked={showLabel} onChange={(e) => setShowLabel(e.target.checked)} />
        </label>
        <MesonForm
          noLabel={showLabel}
          initialValue={form}
          items={formItems}
          onSubmit={(form) => {
            setForm(form);
          }}
        />
        <DataPreview data={form} />
      </DocDemo>

      <DocDemo title="No label and full width" link={getLink("no-label.tsx")}>
        <DocBlock content={contentFullWidth} />
        <DocSnippet code={codeFullWidth} />
        <MesonForm
          noLabel
          fullWidth
          initialValue={form2}
          items={formItems2}
          onSubmit={(form) => {
            setForm2(form);
          }}
        />
        <div>
          <DataPreview data={form2} />
        </div>
      </DocDemo>
    </div>
  );
};

export default NoLabelPage;

let styleContainer = css``;

let codeHideLabel = `
{
  type: 'input',
  name: "hideLabel1",
  label: "hideLabel(false)",
  hideLabel: false,
},
`;

let contentHideLabel = `
控制 \`hideLabel\` 可以隐藏 Label 所占用的区域.
`;

let codeFullWidth = `
<MesonForm
  noLabel
  fullWidth
  initialValue={form2}
  items={formItems2}
  onSubmit={(form) => {
    setForm2(form);
  }}
/>
`;
let contentFullWidth = `
默认情况下 field 当中的输入框不会沾满整行.
需要时通过 \`fullWidth\` 配合 \`hideLabel\` 可以实现整行占满的效果.
`;
