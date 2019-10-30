import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm } from "../../src/form";
import { IMesonFieldItem, EMesonFieldType, IMesonRadioItem } from "../../src/model/types";
import DataPreview from "kits/data-preview";
import { DocDemo } from "@jimengio/doc-frame";
import { getLink } from "util/link";

const options: IMesonRadioItem[] = [{ value: "a", display: "A" }, { value: "b", display: "B" }];

let formItems: IMesonFieldItem[] = [
  {
    type: EMesonFieldType.Radio,
    name: "name",
    label: "name",
    options: options,
  },
  {
    type: EMesonFieldType.Radio,
    name: "secondName",
    label: "name 2",
    options: options,
    required: true,
  },
];

let FormRadio: FC<{}> = (props) => {
  let [form, setForm] = useState({});

  return (
    <div className={cx(styleContainer)}>
      <DocDemo title={"Radio button group"} link={getLink("radio.tsx")} className={styleDemo}>
        <MesonForm
          initialValue={form}
          items={formItems}
          onSubmit={(form) => {
            setForm(form);
          }}
        />
        <DataPreview data={form} />
      </DocDemo>
    </div>
  );
};

export default FormRadio;

let styleContainer = css``;

let styleDemo = css`
  min-width: 400px;
`;
