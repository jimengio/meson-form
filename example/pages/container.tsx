import React from "react";
import { parseRoutePath, IRouteParseResult } from "@jimengio/ruled-router";
import { css } from "emotion";
import { MesonForm, IMesonFieldItem, EMesonFieldType } from "meson-form";

export default (props) => {
  let formItems: IMesonFieldItem[] = [
    { type: EMesonFieldType.Select, label: "物料", value: null, name: "material", required: true, options: [] },
    { type: EMesonFieldType.Number, label: "数量", value: 1, name: "amount", required: true },
    { type: EMesonFieldType.Input, label: "单价", value: "x", name: "amount", required: true },
    { type: EMesonFieldType.Group, label: "group", children: [] },
  ];

  return (
    <div className={styleContainer}>
      <div className={styleTitle}>Form example</div>

      <MesonForm
        items={formItems}
        onFieldChange={(k, v) => {
          console.log("edited", k, v);
        }}
        onSubmit={(form) => {
          console.log("submit data", form);
        }}
      />
    </div>
  );
};

const styleContainer = css`
  font-family: "Helvetica";
`;

const styleTitle = css`
  margin-bottom: 16px;
`;
