import { css } from "emotion";

let emptyStyle = css``;

/** 全局主题配置入口, 通过 emotion 方式修改, 基于 mutable reference */
export let GlobalThemeVariables = {
  // elements
  input: emptyStyle,
  select: emptyStyle,
  textarea: emptyStyle,
  number: emptyStyle,
  treeSelect: emptyStyle,
  datePicker: emptyStyle,
  dropdownSelect: emptyStyle,
  dropdownTree: emptyStyle,
};

export let attachMesonFormThemeVariables = (customVariables: Partial<typeof GlobalThemeVariables>): void => {
  Object.assign(GlobalThemeVariables, customVariables);
};
