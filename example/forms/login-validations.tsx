import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm } from "../../src/form";
import { IMesonFieldItem } from "../../src/model/types";

import DataPreview from "kits/data-preview";
import { DocDemo, DocBlock, DocSnippet } from "@jimengio/doc-frame";

interface IGuest {
  phone: string;
  password: string;
  confirmPassword: string;
}

let formItems: IMesonFieldItem<IGuest>[] = [
  {
    type: "input",
    name: "phone",
    label: "手机号",
    fullWidth: true,
    checkOnChange: true,
    validator: (x: string, item, form) => {
      if (x == null) {
        return "empty";
      }
      if (x.length < 5) {
        return "Phone number too short, at least 5";
      }

      return null;
    },
  },
  {
    type: "input",
    name: "password",
    label: "密码",
    fullWidth: true,
    inputProps: {
      type: "text",
    },
  },
  {
    type: "input",
    name: "confirmPassword",
    label: "重复密码",
    fullWidth: true,
    checkOnChange: true,
    validator: (confirmPassword: string, item, form) => {
      if (confirmPassword !== form.password) {
        return "passwords mismatch";
      }
      return null;
    },
    inputProps: {
      type: "text",
    },
  },
];

let LoginValidations: FC<{}> = (props) => {
  let [form, setForm] = useState({} as IGuest);

  return (
    <div className={cx(styleContainer)}>
      <DocBlock content={contentCheckChange} />
      <DocSnippet code={codeCheckChange} />

      <DocDemo title="Login UI" link={"login-validations.tsx"}>
        <MesonForm<IGuest>
          noLabel
          className={styleForm}
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

export default LoginValidations;

let styleContainer = css``;

let styleForm = css`
  width: 300px;
`;

let codeCheckChange = `
{
  type: 'input',
  name: "phone",
  label: "手机号",
  fullWidth: true,
  checkOnChange: true,
  validator: (x: string, item, form) => {
    if (x == null) {
      return "empty";
    }
    if (x.length < 5) {
      return "Phone number too short, at least 5";
    }

    return null;
  },
}
`;

let contentCheckChange = `
\`checkOnChange\` 属性可以用来快速触发校验, 用在输入框失焦时立即校验的情况.
`;
