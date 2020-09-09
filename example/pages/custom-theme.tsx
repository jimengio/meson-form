import React, { FC } from "react";
import { css } from "emotion";
import { Button } from "antd";
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
        <Button
          children="Change theme styles for input"
          onClick={() => {
            attachMesonFormThemeVariables({
              input: styleInput,
              select: styleSelect,
              dropdownSelect: styleDropdownSelect,
              datePicker: styleDatePicker,
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

参考 https://github.com/jimengio/meson-form/blob/master/src/style.ts .

对于 antd 的组件, 由于本身已经包含了 \`!important\` 设定的样式, 需要再增加样式把 input 重置掉.
`;

let styleInput = css`
  border-radius: 2px !important;
  border-color: hsl(0, 0%, 50%) !important;
  color: hsl(0, 0%, 50%) !important;

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
    border-color: hsl(0, 0%, 50%) !important;

    .ant-select-selection__placeholder {
      color: hsl(0, 0%, 50%) !important;
    }

    .ant-select-selection-selected-value {
      color: hsl(0, 0%, 50%) !important;
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
  input: styleInput, // 输入框样式
  select: styleSelect, // antd 选择菜单样式
  number: null, // 数字输入框样式
  textArea: null, // 多行文本框样式
  treeSelect: null, // 属性选择器样式
  datePicker: styleDatePicker, // 日期选择器样式
  dropdownSelect: styleDropdownSelect, // 自己开发的选择器样式
  dropdownTree: null, // 自己开发的树形选择器样式
  fieldValueArea: null, // 表单值的区域
});
`;

let codeStyles = `
let styleInput = css\`

border-radius: 2px !important;
border-color: hsl(0,0%,50%) !important;
color: hsl(0,0%,50%) !important;

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
  border-color: hsl(0,0%,50%) !important;

  .ant-select-selection__placeholder {
    color: hsl(0,0%,50%) !important;
  }

  .ant-select-selection-selected-value {
    color: hsl(0,0%,50%) !important;
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

let styleDropdownSelect = css`
  border-color: hsl(0, 0%, 60%);

  &:hover {
    border-color: hsl(0, 0%, 65%);
  }
`;

let styleDatePicker = css`
  .ant-input {
    border-color: hsl(0, 0%, 60%) !important;

    &:hover {
      border-color: hsl(0, 0%, 65%) !important;
    }
  }
`;
