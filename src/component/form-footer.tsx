import React, { FC } from "react";

import { lingual } from "../lingual";
import { css, cx } from "emotion";
import { rowMiddle, rowParted, rowCenter } from "@jimengio/flex-styles";

import { Button } from "antd";
import LoadingOutlined from "@ant-design/icons/LoadingOutlined";

export enum EMesonFooterLayout {
  Center = "center",
  Right = "right",
  Aligned = "aligned",
}

export let FormFooter: FC<{
  onSubmit: () => void;
  onCancel: () => void;
  layout?: EMesonFooterLayout;
  hideSeparator?: boolean;
  isLoading?: boolean;
}> = (props) => {
  if (props.layout === EMesonFooterLayout.Aligned) {
    return (
      <div className={cx(rowMiddle, styleFooter, props.hideSeparator ? null : styleBorder)}>
        <Button type="primary" children={lingual.confirm} icon={props.isLoading ? <LoadingOutlined /> : null} onClick={props.onSubmit} data-action="submit" />
        <div style={{ width: 12 }} />
        <Button children={lingual.cancel} onClick={props.onCancel} data-action="cancel" />
      </div>
    );
  }

  if (props.layout === EMesonFooterLayout.Center) {
    return (
      <div className={cx(rowCenter, styleFooter, props.hideSeparator ? null : styleBorder)}>
        <Button children={lingual.cancel} onClick={props.onCancel} data-action="cancel" />
        <div style={{ width: 12 }} />
        <Button type="primary" children={lingual.confirm} icon={props.isLoading ? <LoadingOutlined /> : null} onClick={props.onSubmit} data-action="submit" />
      </div>
    );
  }

  // right
  return (
    <div className={cx(rowParted, styleFooter, props.hideSeparator ? null : styleBorder)}>
      <span />
      <div className={cx(rowMiddle)}>
        <Button children={lingual.cancel} onClick={props.onCancel} data-action="cancel" />
        <div style={{ width: 12 }} />
        <Button type="primary" children={lingual.confirm} icon={props.isLoading ? <LoadingOutlined /> : null} onClick={props.onSubmit} data-action="submit" />
      </div>
    </div>
  );
};

let styleFooter = css`
  padding: 12px 12px;
`;

let styleBorder = css`
  border-top: 1px solid hsl(0, 0%, 91%);
`;
