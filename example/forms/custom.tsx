import React, { SFC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm } from "../../src/form";
import { IMesonFieldItem, EMesonFieldType } from "../../src/model/types";
import { row } from "@jimengio/shared-utils";
import DataPreview from "kits/data-preview";
import SourceLink from "kits/source-link";
import Input from "antd/lib/input";

let formItems: IMesonFieldItem[] = [
  {
    type: EMesonFieldType.Custom,
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

let CustomPage: SFC<{}> = (props) => {
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

export default CustomPage;

let styleContainer = css``;
