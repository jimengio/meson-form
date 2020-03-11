import { css, cx } from "emotion";
import React, { FC } from "react";
import { JimoButton } from "@jimengio/jimo-basics";
import { row, rowMiddle, rowParted, rowCenter } from "@jimengio/shared-utils";
import { lingual } from "../lingual";
import Icon from "antd/lib/icon";

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
        <JimoButton text={lingual.confirm} prepend={props.isLoading ? <Icon type="loading" /> : null} onClick={props.onSubmit} fillColor />
        <div style={{ width: 12 }} />
        <JimoButton text={lingual.cancel} onClick={props.onCancel} canceling />
      </div>
    );
  }

  if (props.layout === EMesonFooterLayout.Center) {
    return (
      <div className={cx(rowCenter, styleFooter, props.hideSeparator ? null : styleBorder)}>
        <JimoButton text={lingual.cancel} onClick={props.onCancel} canceling />
        <div style={{ width: 12 }} />
        <JimoButton text={lingual.confirm} prepend={props.isLoading ? <Icon type="loading" /> : null} onClick={props.onSubmit} fillColor />
      </div>
    );
  }

  // right
  return (
    <div className={cx(rowParted, styleFooter, props.hideSeparator ? null : styleBorder)}>
      <span />
      <div className={cx(rowMiddle)}>
        <JimoButton text={lingual.cancel} onClick={props.onCancel} canceling />
        <div style={{ width: 12 }} />
        <JimoButton text={lingual.confirm} prepend={props.isLoading ? <Icon type="loading" /> : null} onClick={props.onSubmit} fillColor />
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
