import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { IMesonFieldItem } from "../../src/model/types";
import { row } from "@jimengio/flex-styles";
import DataPreview from "kits/data-preview";
import MesonInlineForm from "../../src/inline-form";
import { DocDemo } from "@jimengio/doc-frame";
import { getLink } from "util/link";

let formItems: IMesonFieldItem[] = [
  {
    type: "input",
    name: "name",
    label: "Name",
    required: true,
  },
  {
    type: "input",
    name: "address",
    label: "Address",
  },
  {
    type: "select",
    name: "area",
    label: "Area",
    options: [],
  },
  {
    type: "custom",
    name: "description",
    label: "Description",
    render: (x, onChange) => {
      return (
        <div className={row}>
          <input
            value={x}
            onChange={(event) => {
              onChange(event.target.value);
            }}
          />
          {JSON.stringify(x)}
        </div>
      );
    },
  },
];

let InlineFormPage: FC<{}> = (props) => {
  let [form, setForm] = useState({});

  return (
    <div className={cx(row, styleContainer)}>
      <DocDemo title="Inline form component, and submits by default" link={getLink("inline-form.tsx")}>
        <MesonInlineForm
          initialValue={form}
          items={formItems}
          onSubmit={(form) => {
            setForm(form);
          }}
          submitOnEdit={true}
        />
        <div>
          <DataPreview data={form} />
        </div>
      </DocDemo>
    </div>
  );
};

export default InlineFormPage;

let styleContainer = css``;
