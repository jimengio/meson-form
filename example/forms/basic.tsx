import React, { SFC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm } from "../../lib/form";
import { IMesonFieldItem, EMesonFieldType } from "../../src/model/types";
import { row } from "@jimengio/shared-utils";
import DataPreview from "kits/data-preview";

let formItems: IMesonFieldItem[] = [
  {
    type: EMesonFieldType.Input,
    name: "name",
    label: "名字",
  },
];

let FormBasic: SFC<{}> = (props) => {
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
      <DataPreview data={form} />
    </div>
  );
};

export default FormBasic;

let styleContainer = css``;
