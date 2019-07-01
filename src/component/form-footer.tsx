import { css, cx } from "emotion";
import React, { FC } from "react";
import Button from "antd/lib/button";
import { row, rowMiddle, rowParted, rowCenter } from "@jimengio/shared-utils";
import { lingual } from "../lingual";

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
        <Button type={"primary"} loading={props.isLoading} onClick={props.onSubmit}>
          {lingual.confirm}
        </Button>
        <div style={{ width: 12 }} />
        <Button onClick={props.onCancel}>{lingual.cancel}</Button>
      </div>
    );
  }

  if (props.layout === EMesonFooterLayout.Center) {
    return (
      <div className={cx(rowCenter, styleFooter, props.hideSeparator ? null : styleBorder)}>
        <Button onClick={props.onCancel}>{lingual.cancel}</Button>
        <div style={{ width: 12 }} />
        <Button type={"primary"} loading={props.isLoading} onClick={props.onSubmit}>
          {lingual.confirm}
        </Button>
      </div>
    );
  }

  // right
  return (
    <div className={cx(rowParted, styleFooter, props.hideSeparator ? null : styleBorder)}>
      <span />
      <div className={cx(rowMiddle)}>
        <Button onClick={props.onCancel}>{lingual.cancel}</Button>
        <div style={{ width: 12 }} />
        <Button type={"primary"} loading={props.isLoading} onClick={props.onSubmit}>
          {lingual.confirm}
        </Button>
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
