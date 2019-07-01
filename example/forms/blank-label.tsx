import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm } from "../../src/form";
import { IMesonFieldItem, EMesonFieldType } from "../../src/model/types";
import { row } from "@jimengio/shared-utils";
import DataPreview from "kits/data-preview";
import SourceLink from "kits/source-link";

let formItems: IMesonFieldItem[] = [
  {
    type: EMesonFieldType.Input,
    name: "name",
    placeholder: "Add name",
    label: null,
  },
  {
    type: EMesonFieldType.Input,
    name: "address",
    placeholder: "Add address",
    label: null,
  },
  {
    type: EMesonFieldType.Input,
    name: "note",
    placeholder: "Add note",
    label: "Some note",
  },
];

let FormBlankLabel: FC<{}> = (props) => {
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
        <SourceLink fileName={"blank-label.tsx"} />
        <DataPreview data={form} />
      </div>
    </div>
  );
};

export default FormBlankLabel;

let styleContainer = css``;
