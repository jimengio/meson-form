import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm } from "../../src/form";
import { IMesonFieldItem, EMesonFieldType } from "../../src/model/types";
import { row } from "@jimengio/shared-utils";
import DataPreview from "kits/data-preview";
import { DocDemo } from "@jimengio/doc-frame";
import { getLink } from "util/link";

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
    <div className={cx(styleContainer)}>
      <DocDemo title="Form layout with no table" link={getLink("no-label.tsx")}>
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
        <DataPreview data={form} />
      </DocDemo>

      <DocDemo title="No label and full width" link={getLink("no-label.tsx")}>
        <MesonForm
          noLabel
          fullWidth
          initialValue={form2}
          items={formItems2}
          onSubmit={(form) => {
            setForm2(form);
          }}
        />
        <div>
          <DataPreview data={form2} />
        </div>
      </DocDemo>
    </div>
  );
};

export default NoLabelPage;

let styleContainer = css``;
