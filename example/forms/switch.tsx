import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm } from "../../src/form";
import { IMesonFieldItem, EMesonFieldType } from "../../src/model/types";
import { row } from "@jimengio/shared-utils";
import DataPreview from "kits/data-preview";
import SourceLink from "kits/source-link";

let formItems: IMesonFieldItem[] = [
  {
    type: EMesonFieldType.Switch,
    name: "checked",
    label: "Checked",
  },
  {
    type: EMesonFieldType.Switch,
    name: "checked",
    label: "Check disabled",
    disabled: true,
  },
];

let SwitchPage: FC<{}> = (props) => {
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
        <SourceLink fileName={"switch.tsx"} />
        <DataPreview data={form} />
      </div>
    </div>
  );
};

export default SwitchPage;

let styleContainer = css``;
