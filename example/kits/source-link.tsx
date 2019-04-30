import React, { SFC } from "react";
import { css } from "emotion";

let SourceLink: SFC<{
  fileName: string;
}> = (props) => {
  return (
    <div className={styleContainer}>
      {"Source Code url: "}
      <a target="_blank" className={styleLink} href={`https://github.com/jimengio/meson-form/tree/master/example/forms/${props.fileName}`}>
        {props.fileName}
      </a>
    </div>
  );
};

export default SourceLink;

let styleContainer = css`
  padding: 16px;
`;

let styleLink = css`
  font-family: Menlo, monospace;
`;
