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
    label: "Name",
  },
  {
    type: EMesonFieldType.Input,
    name: "address",
    label: "Address",
  },
  {
    type: EMesonFieldType.Input,
    name: "hideLabel1",
    label: "hideLabel(false)",
    hideLabel: false,
  },
  {
    type: EMesonFieldType.Input,
    name: "hideLabel2",
    label: "hideLabel(true)",
    hideLabel: true,
  },
];

let formItems2: IMesonFieldItem[] = [
  {
    type: EMesonFieldType.Decorative,
    render: () => <p>noLabel and fullWidth</p>,
  },
  {
    type: EMesonFieldType.Input,
    name: "username",
    placeholder: "* username",
    label: "username",
    required: true,
  },
  {
    type: EMesonFieldType.Input,
    name: "password",
    label: "password",
    placeholder: "* password",
    required: true,
  },
];

let NoLabelPage: FC<{}> = (props) => {
  let [form, setForm] = useState({});
  let [form2, setForm2] = useState({});
  let [showLabel, setShowLabel] = useState<boolean>();

  return (
    <div className={cx(row, styleContainer)}>
      <div>
        <label>
          noLabel: <input type="checkbox" checked={showLabel} onChange={(e) => setShowLabel(e.target.checked)} />
        </label>
        <MesonForm
          noLabel={showLabel}
          initialValue={form}
          items={formItems}
          onSubmit={(form) => {
            setForm(form);
          }}
        />
        <MesonForm
          noLabel
          fullWidth
          initialValue={form2}
          items={formItems2}
          onSubmit={(form) => {
            setForm2(form);
          }}
        />
      </div>
      <div>
        <SourceLink fileName={"no-label.tsx"} />
        <DataPreview data={form} />
        <DataPreview data={form2} />
      </div>
    </div>
  );
};

export default NoLabelPage;

let styleContainer = css``;
