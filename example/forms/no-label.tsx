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

let NoLabelPage: FC<{}> = (props) => {
  let [form, setForm] = useState({});
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
      </div>
      <div>
        <SourceLink fileName={"basic.tsx"} />
        <DataPreview data={form} />
      </div>
    </div>
  );
};

export default NoLabelPage;

let styleContainer = css``;
