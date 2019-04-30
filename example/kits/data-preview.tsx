import React, { SFC } from "react";
import { css, cx } from "emotion";
import { row } from "@jimengio/shared-utils";

let DataPreview: SFC<{
  data: any;
}> = (props) => {
  return (
    <div className={cx(row, styleContainer)}>
      <div className={styleLabel}>Submitted</div>
      <pre>{JSON.stringify(props.data, null, 2)}</pre>
    </div>
  );
};

export default DataPreview;

let styleContainer = css`
  padding: 16px;
`;

let styleLabel = css`
  margin-right: 16px;
`;
