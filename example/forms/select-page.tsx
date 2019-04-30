import { css, cx } from "emotion";
import React, { SFC, useState } from "react";
import { IMesonCustomField, IMesonFieldItem, IMesonSelectItem, EMesonFieldType } from "../../src/model/types";
import { MesonForm } from "../../src/form";
import { row } from "@jimengio/shared-utils";
import DataPreview from "kits/data-preview";

let booleanOptions: IMesonSelectItem[] = [{ value: true, display: "True" }, { value: false, display: "False" }];

let items: IMesonFieldItem[] = [
  {
    type: EMesonFieldType.Select,
    label: "BOOLEAN",
    name: "status",
    options: booleanOptions,
    translateNonStringvalue: true,
    allowClear: true,
  },
];

let SelectPage: SFC<{}> = (props) => {
  let [form, setForm] = useState({});

  return (
    <div className={cx(row, styleContainer)}>
      <MesonForm
        initialValue={form}
        items={items}
        onSubmit={(form) => {
          setForm(form);
        }}
      />
      <DataPreview data={form} />
    </div>
  );
};

export default SelectPage;

let styleContainer = css``;
