import React, { FC, useState } from "react";
import { css } from "emotion";
import { DocDemo, DocSnippet } from "@jimengio/doc-frame";
import { MesonForm } from "../../src/form";
import { IMesonFieldItem } from "../../src/model/types";
import DataPreview from "kits/data-preview";

let formItems: IMesonFieldItem[] = [
  {
    type: "date-picker",
    name: "date",
    label: "选择日期",

    disabled: false,
    allowClear: true,
    className: undefined,
    style: undefined,
    transformSelectedValue: (obj, dateString) => dateString,
    datePickerProps: undefined,
  },
];

let ExampleDatePicker: FC<{}> = React.memo((props) => {
  let [form, setForm] = useState({});

  /** Plugins */
  /** Methods */
  /** Effects */
  /** Renderers */
  return (
    <div>
      <DocDemo title={"Date picker demo"} className={styleDemo}>
        <MesonForm
          initialValue={form}
          items={formItems}
          onSubmit={(form) => {
            setForm(form);
          }}
        />
        <DataPreview data={form} />
        <DocSnippet code={code} />
      </DocDemo>
    </div>
  );
});

export default ExampleDatePicker;

let styleDemo = css``;

let code = `
let formItems: IMesonFieldItem[] = [
  {
    type: "date-picker",
    name: "date",
    label: "选择日期",

    // default options
    disabled: false,
    allowClear: true,
    className: undefined,
    style: undefined,
    transformSelectedValue: (obj, dateString) => dateString,
    datePickerProps: undefined
  },
];
`;
