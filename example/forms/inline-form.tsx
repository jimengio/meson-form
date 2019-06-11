import React, { SFC, useState } from "react";
import { css, cx } from "emotion";
import { IMesonFieldItem, EMesonFieldType } from "../../src/model/types";
import { row } from "@jimengio/shared-utils";
import DataPreview from "kits/data-preview";
import SourceLink from "kits/source-link";
import MesonInlineForm from "../../src/inline-form";

let formItems: IMesonFieldItem[] = [
  {
    type: EMesonFieldType.Input,
    name: "name",
    label: "Name",
    required: true,
  },
  {
    type: EMesonFieldType.Input,
    name: "address",
    label: "Address",
  },
];

let InlineFormPage: SFC<{}> = (props) => {
  let [form, setForm] = useState({});

  return (
    <div className={cx(row, styleContainer)}>
      <MesonInlineForm
        initialValue={form}
        items={formItems}
        onSubmit={(form) => {
          setForm(form);
        }}
        submitOnEdit={true}
      />
      <div>
        <SourceLink fileName={"switch.tsx"} />
        <DataPreview data={form} />
      </div>
    </div>
  );
};

export default InlineFormPage;

let styleContainer = css``;
