import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm, useMesonItems } from "../../src/form";
import { IMesonFieldItem, EMesonFieldType } from "../../src/model/types";
import { row } from "@jimengio/shared-utils";
import DataPreview from "kits/data-preview";
import { DocDemo, DocBlock } from "@jimengio/doc-frame";
import { getLink } from "util/link";

let formItems: IMesonFieldItem[] = [
  {
    type: EMesonFieldType.Input,
    name: "name",
    label: "名字",
  },
  {
    type: EMesonFieldType.Input,
    name: "name",
    label: "名字禁用",
    disabled: true,
  },
];

let FormUseItems: FC<{}> = (props) => {
  let [form, setForm] = useState({});

  let [formElements, onCheckSubmit, formInternals] = useMesonItems({
    initialValue: form,
    items: formItems,
    onSubmit: (form) => {
      setForm(form);
    },
  });

  return (
    <div className={cx(styleContainer)}>
      <DocBlock content={require("docs/basic.md").default}></DocBlock>
      <DocDemo title={"A basic form"} link={getLink("basic.tsx")} className={styleDemo}>
        <div>{formElements}</div>

        <div>
          Form data:
          <pre>{JSON.stringify(formInternals.formData, null, 2)}</pre>
        </div>

        <div>
          Custom UI
          <button onClick={onCheckSubmit}>SUBMIT</button>
        </div>
        <DataPreview data={form} />
      </DocDemo>
    </div>
  );
};

export default FormUseItems;

let styleContainer = css``;

let styleDemo = css`
  min-width: 400px;
`;
