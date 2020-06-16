import React, { FC } from "react";
import { css } from "emotion";
import { JimoButton } from "@jimengio/jimo-basics";
import { attachMesonFormThemeVariables } from "../../src/theme";
import { DocBlock, DocDemo, DocSnippet } from "@jimengio/doc-frame";

let CustomThemePage: FC<{ className?: string }> = React.memo((props) => {
  /** Plugins */
  /** Methods */
  /** Effects */
  /** Renderers */
  return (
    <div className={props.className}>
      <DocDemo title={"Custom Theme"}>
        <JimoButton
          text="Change theme styles for input"
          onClick={() => {
            attachMesonFormThemeVariables({
              input: styleInput,
              select: styleSelect,
            });

            alert("切换到其他页面查看");
          }}
        />

        <DocBlock content={content} />

        <DocSnippet code={code} />
        <DocSnippet code={codeStyles} />
      </DocDemo>
    </div>
  );
});

export default CustomThemePage;

let content = `
目前支持基础元素的样式定义, 注意要使用 Emotion 定义样式.
`;

let styleInput = css`
  border-radius: 2px !important;
  border-color: pink !important;
  color: pink !important;

  &:not(.ant-input-disabled) {
    &:focus,
    &:hover {
      border-color: red !important;
      box-shadow: 0px 0px 2px 0px red !important;
    }
  }
`;

export const styleSelect = css`
  .ant-select-selection {
    border-radius: 2px;
    border-color: pink !important;

    .ant-select-selection__placeholder {
      color: pink !important;
    }

    .ant-select-selection-selected-value {
      color: pink !important;
    }
  }

  &.ant-select-enabled {
    .ant-select-selection:focus,
    .ant-select-selection:hover {
      border-color: red !important;
      box-shadow: 0px 0px 2px 0px red !important;
    }
  }
`;

let code = `
attachMesonFormThemeVariables({
  input: styleInput,
  select: styleSelect,
  // 其他属性...
});
`;

let codeStyles = `
let styleInput = css\`

border-radius: 2px !important;
border-color: pink !important;
color: pink !important;

&:not(.ant-input-disabled) {
  &:focus,
  &:hover {
    border-color: red !important;
    box-shadow: 0px 0px 2px 0px red !important;
  }
}
\`;

let styleSelect = css\`
.ant-select-selection {
  border-radius: 2px;
  border-color: pink !important;

  .ant-select-selection__placeholder {
    color: pink !important;
  }

  .ant-select-selection-selected-value {
    color: pink !important;
  }
}

&.ant-select-enabled {
  .ant-select-selection:focus,
  .ant-select-selection:hover {
    border-color: red !important;
    box-shadow: 0px 0px 2px 0px red !important;
  }
}
\`;
`;
