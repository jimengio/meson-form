import React, { SFC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm } from "../../src/form";
import { IMesonFieldItem, EMesonFieldType, FuncMesonModifyForm } from "../../src/model/types";
import { row } from "@jimengio/shared-utils";
import DataPreview from "kits/data-preview";
import SourceLink from "kits/source-link";
import Input from "antd/lib/input";
import { Draft } from "immer";

interface IDemo {
  a: string;
  b: string;
}

let formItems: IMesonFieldItem<keyof IDemo>[] = [
  {
    type: EMesonFieldType.CustomMultiple,
    names: ["a", "b"],
    label: "自定义",
    required: true,
    validateMultiple: (form) => {
      return {
        a: form.a ? null : "a is required",
        b: form.b ? null : "b is required",
      };
    },
    renderMultiple: (form: IDemo, modifyForm: FuncMesonModifyForm<IDemo>, checkForm) => {
      return (
        <div className={row}>
          <div>
            Custome input
            <Input
              value={form.a}
              onChange={(event) => {
                let text = event.target.value;
                modifyForm((draft) => {
                  draft.a = text;
                });
              }}
              placeholder={"Custom field a"}
              onBlur={() => {
                checkForm(form);
              }}
            />
            <Input
              value={form.b}
              onChange={(event) => {
                let text = event.target.value;
                modifyForm((draft) => {
                  draft.b = text;
                });
              }}
              placeholder={"Custom field b"}
              onBlur={() => {
                checkForm(form);
              }}
            />
          </div>
        </div>
      );
    },
  },
];

let CustomMultiplePage: SFC<{}> = (props) => {
  let [form, setForm] = useState({});

  return (
    <div className={cx(row, styleContainer)}>
      <MesonForm
        initialValue={form}
        items={formItems}
        onSubmit={(form) => {
          setForm(form);
        }}
      />
      <div>
        <SourceLink fileName={"custom.tsx"} />
        <DataPreview data={form} />
      </div>
    </div>
  );
};

export default CustomMultiplePage;

let styleContainer = css``;
