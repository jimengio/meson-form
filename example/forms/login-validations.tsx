import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm } from "../../src/form";
import { IMesonFieldItem, EMesonFieldType } from "../../src/model/types";
import { row } from "@jimengio/shared-utils";
import DataPreview from "kits/data-preview";
import SourceLink from "kits/source-link";

interface IGuest {
  phone: string;
  password: string;
  confirmPassword: string;
}

let formItems: IMesonFieldItem<IGuest>[] = [
  {
    type: EMesonFieldType.Input,
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
    type: EMesonFieldType.Input,
    name: "password",
    label: "密码",
    fullWidth: true,
    inputProps: {
      type: "text",
    },
  },
  {
    type: EMesonFieldType.Input,
    name: "confirm",
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
    <div className={cx(row, styleContainer)}>
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
        <SourceLink fileName={"login-validations.tsx"} />
        <DataPreview data={form} />
      </div>
    </div>
  );
};

export default LoginValidations;

let styleContainer = css``;

let styleForm = css`
  width: 300px;
`;
