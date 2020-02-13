import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { row } from "@jimengio/shared-utils";
import { MesonForm } from "meson-form";
import { IMesonFieldItem, EMesonFieldType } from "../../src/model/types";
import DataPreview from "kits/data-preview";
import { DocDemo, DocSnippet, DocBlock } from "@jimengio/doc-frame";
import { getLink } from "util/link";

let formItems: IMesonFieldItem[] = [
  {
    type: EMesonFieldType.Input,
    name: "name",
    label: "名字",
  },
  {
    type: EMesonFieldType.Switch,
    name: "switch",
    label: "开关",
  },
  {
    type: EMesonFieldType.Select,
    name: "select",
    label: "选择",
    options: [
      {
        value: 1,
        display: "1",
      },
      {
        value: 2,
        display: "2",
      },
    ],
  },
];

let AutoSavePage: FC<{}> = (props) => {
  let [form, setForm] = useState({});

  return (
    <div className={cx(row, styleContainer)}>
      <DocDemo title="Auto save" link={getLink("auto-save.tsx")}>
        <DocBlock content={contentAutoSave} />

        <MesonForm
          items={formItems}
          initialValue={form}
          onSubmit={(form) => {
            setForm(form);
          }}
          submitOnEdit
          renderFooter={() => null}
        />

        <div>
          <DataPreview data={form} />
        </div>

        <DocSnippet code={codeAutoSave} />
      </DocDemo>
    </div>
  );
};

export default AutoSavePage;

let styleContainer = css``;

let codeAutoSave = `
<MesonForm
  items={formItems}
  initialValue={form}
  onSubmit={(form) => {
    setForm(form);
  }}
  submitOnEdit
  renderFooter={() => null}
/>
`;

let contentAutoSave = `
通过 \`submitOnEdit\` 开启自动触发保存, 失焦的时候出发 submit 行为.
注意 Custom 模式也需要妥善处理 onBlur 行为避免遗漏 submit 行为.
`;
