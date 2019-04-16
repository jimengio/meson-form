import React, { SFC } from "react";
import { css } from "emotion";

export let RequiredMark: SFC<{}> = (props) => {
  return <span className={styleRequired}>*</span>;
};

let styleRequired = css`
  color: hsla(0, 100%, 50%, 1);
  margin-right: 4px;
`;
