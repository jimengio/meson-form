import React, { SFC, useState } from "react";
import { css, cx } from "emotion";
import { row } from "@jimengio/shared-utils";
import { MesonForm } from "meson-form";
import { IMesonFieldItem, EMesonFieldType } from "../../src/model/types";
import DataPreview from "kits/data-preview";

let formItems: IMesonFieldItem[] = [
  {
    type: EMesonFieldType.Input,
    name: "name",
    label: "名字",
    required: true,
  },
];

let AutoSavePage: SFC<{}> = (props) => {
  let [form, setForm] = useState({});

  return (
    <div className={cx(row, styleContainer)}>
      <MesonForm
        items={formItems}
        initialValue={form}
        onSubmit={(form) => {
          setForm(form);
        }}
        submitOnEdit
        renderFooter={() => null}
      />

      <DataPreview data={form} />
    </div>
  );
};

export default AutoSavePage;

let styleContainer = css``;
