import React, { FC } from "react";
import { css } from "emotion";
import { DocSnippet, DocDemo } from "@jimengio/doc-frame";
import { MesonForm } from "../../src/form";
import { IMesonFieldItem } from "../../src/model/types";
import { getLink } from "util/link";

let formItems: IMesonFieldItem[] = [
  {
    type: "input",
    name: "name",
    label: "名字",
    required: true,
    suffixNode: <span>TODO</span>,
  },
  {
    type: "number",
    name: "count",
    label: "数量",
    required: true,
    suffixNode: <span>TODO</span>,
  },
];

let FormInputSuffix: FC<{ className?: string }> = React.memo((props) => {
  /** Plugins */
  /** Methods */
  /** Effects */
  /** Renderers */
  return (
    <div className={props.className}>
      <DocDemo title={"A basic form"} link={getLink("input-suffix.tsx")} className={styleDemo}>
        <MesonForm
          initialValue={{}}
          items={formItems}
          onSubmit={(form) => {
            console.log("form", form);
          }}
        />
        <DocSnippet code={code} />
      </DocDemo>
    </div>
  );
});

export default FormInputSuffix;

let styleDemo = css`
  min-width: 400px;
`;

let code = `
let formItems: IMesonFieldItem[] = [
  {
    type: "input",
    name: "name",
    label: "名字",
    required: true,
    suffixNode: <span>TODO</span>,
  },
  {
    type: "number",
    name: "count",
    label: "数量",
    required: true,
    suffixNode: <span>TODO</span>,
  },
];
`;
