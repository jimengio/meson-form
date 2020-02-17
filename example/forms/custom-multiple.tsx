import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm } from "../../src/form";
import { IMesonFieldItem, FuncMesonModifyForm, IMesonErrors } from "../../src/model/types";
import { row } from "@jimengio/shared-utils";
import DataPreview from "kits/data-preview";
import Input from "antd/lib/input";
import { DocDemo, DocSnippet } from "@jimengio/doc-frame";
import { getLink } from "util/link";

interface IDemo {
  a0: string;
  a: string;
  b: string;
}

let formItems: IMesonFieldItem<IDemo>[] = [
  {
    type: "input",
    label: "simple",
    name: "a0",
    required: true,
  },
  {
    type: "custom-multiple",
    names: ["a", "b"],
    label: "自定义",
    required: true,
    validateMultiple: (form) => {
      return {
        a: form.a ? null : "a is required",
        b: form.b ? null : "b is required",
      };
    },
    renderMultiple: (form, modifyForm, checkForm) => {
      return (
        <div className={row}>
          <div>
            Custome input
            <Input
              value={form.a}
              onChange={(event) => {
                let text = event.target.value;

                // modify value on form
                modifyForm((draft) => {
                  draft.a = text;
                });
              }}
              placeholder={"Custom field a"}
              onBlur={() => {
                // trigger validation, which is validationMultiple
                checkForm(form);
              }}
            />
            <Input
              value={form.b}
              onChange={(event) => {
                let text = event.target.value;

                // modify another value on form
                modifyForm((draft) => {
                  draft.b = text;
                });
              }}
              placeholder={"Custom field b"}
              onBlur={() => {
                // trigger same validation
                checkForm(form);
              }}
            />
          </div>
        </div>
      );
    },
  },
];

let CustomMultiplePage: FC<{}> = (props) => {
  let [form, setForm] = useState({} as IDemo);

  return (
    <div className={cx(row, styleContainer)}>
      <DocDemo title="Custom multiple fields in piece of config" link={getLink("custom-multiple.tsx")}>
        <DocSnippet code={contentMultiple} />

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
        <DocSnippet code={codeCustomMultiple} lang={"jsx"} />
      </DocDemo>
    </div>
  );
};

export default CustomMultiplePage;

let styleContainer = css``;

let codeCustomMultiple = `

let formItems: IMesonFieldItem<IDemo>[] = [
  {
    type: 'input',
    label: "simple",
    name: "a0",
    required: true,
  },
  {
    type: 'custom-multiple',
    names: ["a", "b"],
    label: "自定义",
    required: true,
    validateMultiple: (form) => {
      return {
        a: form.a ? null : "a is required",
        b: form.b ? null : "b is required",
      };
    },
    renderMultiple: (form, modifyForm, checkForm) => {
      return (
        <div className={row}>
          <div>
            Custome input
            <Input
              value={form.a}
              onChange={(event) => {
                let text = event.target.value;

                // modify value on form
                modifyForm((draft) => {
                  draft.a = text;
                });
              }}
              placeholder={"Custom field a"}
              onBlur={() => {
                // trigger validation, which is validationMultiple
                checkForm(form);
              }}
            />
            <Input
              value={form.b}
              onChange={(event) => {
                let text = event.target.value;

                // modify another value on form
                modifyForm((draft) => {
                  draft.b = text;
                });
              }}
              placeholder={"Custom field b"}
              onBlur={() => {
                // trigger same validation
                checkForm(form);
              }}
            />
          </div>
        </div>
      );
    },
  },
];
`;

let contentMultiple = `
CustomMultiple 用来处理一个界面上的 field 当中修改多项数据 field 的情况.
注意 \`name\` 自动需要使用 \`names\`. 而 \`validate\` 要用 \`validateMultiple\` 且返回结构也要随着改变.
`;
