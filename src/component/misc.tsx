import React, { FC } from "react";
import { css } from "emotion";

export let RequiredMark: FC<{}> = (props) => {
  return <span className={styleRequired}>*</span>;
};

let styleRequired = css`
  color: hsla(0, 100%, 50%, 1);
  margin-right: 4px;
`;
