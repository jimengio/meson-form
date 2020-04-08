import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm } from "../../src/form";
import { IMesonFieldItem, IMesonSelectItem, FuncMesonModifyForm } from "../../src/model/types";
import { row, xHiddenYAuto } from "@jimengio/flex-styles";
import DataPreview from "kits/data-preview";
import { DocDemo, DocSnippet, DocBlock } from "@jimengio/doc-frame";
import { getLink } from "util/link";

let code = `
let candidates: IMesonSelectItem[] = [
  { value: "local", display: "本市" },
  { value: "strange", display: "外地" },
];

let formItems: IMesonFieldItem[] = [
  {
    type: 'select',
    name: "kind",
    label: "种类",
    options: candidates,
    required: true,
    onChange: (v: string, modifyForm: FuncMesonModifyForm<IHome>) => {
      if (v === "local") {
        modifyForm((form) => {
          form.place = "上海市";
        });
      } else {
        modifyForm((form) => {
          form.place = "";
        });
      }
    },
  },
  {
    type: 'input',
    name: "place",
    label: "籍贯",
    required: true,
  },
  {
    type: 'input',
    name: "note",
    label: "备注",
    required: false,
  },
];
`;

let content = `
如果要监听具体某个表单项的修改, 可以使用 \`onChange\` 属性, 使用监听器函数或者修改之后的新的值.
发生修改时, 可以访问到 \`modifyForm\` 函数, 强行对表单项的其他字段进行修改. 一般用在字段之间相互有关联的情况当中.
`;

let candidates: IMesonSelectItem[] = [
  { value: "local", display: "本市" },
  { value: "strange", display: "外地" },
];

enum EHomeKind {
  Local = "local",
  Strange = "strange",
}

interface IHome {
  kind: EHomeKind;
  place: string;
  note?: string;
}

let formItems: IMesonFieldItem[] = [
  {
    type: "select",
    name: "kind",
    label: "种类",
    options: candidates,
    required: true,
    onChange: (v: string, modifyForm: FuncMesonModifyForm<IHome>) => {
      if (v === "local") {
        modifyForm((form) => {
          form.place = "上海市";
        });
      } else {
        modifyForm((form) => {
          form.place = "";
        });
      }
    },
  },
  {
    type: "input",
    name: "place",
    label: "籍贯",
    required: true,
  },
  {
    type: "input",
    name: "note",
    label: "备注",
    required: false,
  },
];

let ModifyOnChange: FC<{}> = (props) => {
  let [form, setForm] = useState({});

  return (
    <div className={cx(row, styleContainer)}>
      <DocDemo title={"Demo of on change hooks and extra modify API"} link={getLink("modify-on-change.tsx")}>
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

        <DocBlock content={content} />

        <DocSnippet code={code} />
      </DocDemo>
    </div>
  );
};

export default ModifyOnChange;

let styleContainer = css``;
