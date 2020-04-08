import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm } from "../../src/form";
import { IMesonFieldItem } from "../../src/model/types";
import { row } from "@jimengio/flex-styles";
import DataPreview from "kits/data-preview";
import { DocDemo, DocBlock } from "@jimengio/doc-frame";
import { getLink } from "util/link";

let formItems: IMesonFieldItem[] = [
  {
    type: "input",
    name: "name",
    placeholder: "Add name",
    label: null,
  },
  {
    type: "input",
    name: "address",
    placeholder: "Add address",
    label: null,
  },
  {
    type: "input",
    name: "note",
    placeholder: "Add note",
    label: "Some note",
  },
];

let FormBlankLabel: FC<{}> = (props) => {
  let [form, setForm] = useState({});

  return (
    <div className={cx(row, styleContainer)}>
      <DocDemo title="fields with blank label" link={getLink("blank-label.tsx")}>
        <DocBlock content={contentBlankLabel} />
        <MesonForm
          initialValue={form}
          items={formItems}
          onSubmit={(form) => {
            setForm(form);
          }}
        />
        <div>
          <DataPreview data={form} />
        </div>
      </DocDemo>
    </div>
  );
};

export default FormBlankLabel;

let styleContainer = css``;

let contentBlankLabel = `如果需要空的 label 文案, 目前需要设置成 null`;
