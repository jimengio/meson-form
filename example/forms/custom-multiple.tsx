import React, { SFC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm } from "../../src/form";
import { IMesonFieldItem, EMesonFieldType } from "../../src/model/types";
import { row } from "@jimengio/shared-utils";
import DataPreview from "kits/data-preview";
import SourceLink from "kits/source-link";
import Input from "antd/lib/input";

interface IDemo {
  a: string;
  b: string;
}

let formItems: IMesonFieldItem[] = [
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
    renderFormWithModifiers: (form: IDemo, onChange, onCheck) => {
      return (
        <div className={row}>
          <div>
            Custome input
            <Input
              value={form.a}
              onChange={(event) => {
                let text = event.target.value;
                onChange((draft) => {
                  draft.a = text;
                });
              }}
              placeholder={"Custom field a"}
              onBlur={() => {
                onCheck(form);
              }}
            />
            <Input
              value={form.b}
              onChange={(event) => {
                let text = event.target.value;
                onChange((draft) => {
                  draft.b = text;
                });
              }}
              placeholder={"Custom field b"}
              onBlur={() => {
                onCheck(form);
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
