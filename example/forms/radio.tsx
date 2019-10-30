import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm } from "../../src/form";
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

let FormBasic: FC<{}> = (props) => {
  let [form, setForm] = useState({});

  return (
    <div className={cx(styleContainer)}>
      <DocBlock content={require("docs/basic.md").default}></DocBlock>
      <DocDemo title={"A basic form"} link={getLink("basic.tsx")} className={styleDemo}>
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

export default FormBasic;

let styleContainer = css``;

let styleDemo = css`
  min-width: 400px;
`;
