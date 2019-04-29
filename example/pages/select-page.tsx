import { css } from "emotion";
import React, { SFC } from "react";
import { IMesonCustomField, IMesonFieldItem, IMesonSelectItem, EMesonFieldType } from "../../src/model/types";
import { MesonForm } from "../../src/form";

let booleanOptions: IMesonSelectItem[] = [{ value: true, display: "True" }, { value: false, display: "False" }];

let SelectPage: SFC<{}> = (props) => {
  let items: IMesonFieldItem[] = [
    {
      type: EMesonFieldType.Select,
      label: "BOOLEAN",
      name: "status",
      options: booleanOptions,
      translateNonStringvalue: true,
      allowClear: true,
    },
  ];

  return (
    <div className={styleContainer}>
      <MesonForm
        initialValue={{}}
        items={items}
        onSubmit={(form) => {
          console.log("form", form);
        }}
      />
    </div>
  );
};

export default SelectPage;

let styleContainer = css``;
