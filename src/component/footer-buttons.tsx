import React, { FC } from "react";
import { css, cx } from "emotion";
import { rowCenter } from "@jimengio/flex-styles";
import { JimoButton } from "@jimengio/jimo-basics";

export interface IFooterButtonOptions {
  text: string;
  onClick: () => void;
  filled?: boolean;
  canceling?: boolean;
  disabled?: boolean;
  className?: string;
}

let FooterButtons: FC<{
  items: IFooterButtonOptions[];
  className?: string;
}> = React.memo((props) => {
  /** Methods */
  /** Effects */
  /** Renderers */
  return (
    <div className={cx(rowCenter, styleContainer, props.className)}>
      {props.items.map((item, idx) => {
        return (
          <JimoButton
            key={idx}
            text={item.text}
            disabled={item.disabled}
            onClick={item.onClick}
            fillColor={item.filled}
            canceling={item.canceling}
            data-action={item.canceling ? "cancel" : "submit"}
            className={cx(styleButton, item.className)}
          />
        );
      })}
    </div>
  );
});

export default FooterButtons;

let styleButton = css`
  margin: 0 8px;
`;

let styleContainer = css`
  padding: 16px;
`;
