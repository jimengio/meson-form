import React, { FC } from "react";
import { css } from "emotion";
import FooterButtons, { IFooterButtonOptions } from "../../src/component/footer-buttons";
import { DocDemo, DocSnippet } from "@jimengio/doc-frame";

let PageFooterButtons: FC<{}> = React.memo((props) => {
  let items: IFooterButtonOptions[] = [
    {
      text: "Cancel",
      canceling: true,
      onClick: () => {
        console.log("cancel");
      },
    },

    {
      text: "Confirm",
      filled: true,
      disabled: false,
      onClick: async () => {
        console.log("confirm");
      },
    },
  ];

  /** Plugins */
  /** Methods */
  /** Effects */
  /** Renderers */
  return (
    <div>
      <DocDemo title="Footer buttons">
        <FooterButtons items={items} />
        <DocSnippet code={code} />
      </DocDemo>
    </div>
  );
});

export default PageFooterButtons;

let code = `
let items: IFooterButtonOptions[] = [
  {
    text: "Cancel",
    canceling: true,
    onClick: () => {
      console.log("cancel");
    },
  },

  {
    text: "Confirm",
    filled: true,
    disabled: false,
    onClick: async () => {
      console.log("confirm");
    },
  },
];

<FooterButtons items={items} />
`;
