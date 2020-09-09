import React, { FC } from "react";
import { css, cx } from "emotion";
import { rowCenter } from "@jimengio/flex-styles";

import Button, { ButtonProps } from "antd/lib/button";

export interface IFooterButtonOptions extends ButtonProps {
  text?: string;
  key?: string;
  filled?: boolean;
  canceling?: boolean;
}

const FooterButtons: FC<{
  items: IFooterButtonOptions[];
  className?: string;
}> = React.memo((props) => {
  return (
    <div className={cx(rowCenter, styleContainer, props.className)}>
      {props.items.map((item, idx) => {
        const { text, children, filled, canceling, className, ...rest } = item;

        const type: ButtonProps["type"] = filled ? "primary" : "default";
        const remarks = canceling ? "cancel" : filled ? "submit" : text || undefined;

        return <Button key={idx} type={type} children={text || children} className={cx(styleButton, className)} data-action={remarks} {...rest} />;
      })}
    </div>
  );
});

export default FooterButtons;

const styleContainer = css`
  padding: 16px;
`;

const styleButton = css`
  margin: 0 8px;
`;
