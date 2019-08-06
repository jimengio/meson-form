import React, { FC, useState } from "react";
import { css } from "emotion";
import { lingual } from "../../src/lingual";
import { MesonFormDropdown } from "meson-form";
import { IMesonFieldItem, EMesonFieldType } from "../../src/model/types";
import DataPreview from "kits/data-preview";
import SourceLink from "kits/source-link";

let DropdownPage: FC<{}> = (props) => {
  let [form, setForm] = useState({});

  let formItems: IMesonFieldItem[] = [
    {
      type: EMesonFieldType.Input,
      name: "demo",
      label: "DEMO",
    },
    {
      type: EMesonFieldType.Input,
      name: "demo",
      label: "DEMO",
    },
  ];

  return (
    <div className={styleContainer}>
      <div className={styleArea}>
        <MesonFormDropdown
          title={"Settings"}
          hideClose
          items={formItems}
          initialValue={form}
          labelClassName={styleLabel}
          itemsClassName={styleItems}
          onSubmit={(form) => {
            setForm(form);
          }}
          width={200}
        >
          Dropdown area
        </MesonFormDropdown>
      </div>
      <div>
        <SourceLink fileName={"modal.tsx"} />
        <DataPreview data={form} />
      </div>
    </div>
  );
};

export default DropdownPage;

let styleContainer = css``;

let styleLabel = css`
  min-width: 60px;
`;

let styleArea = css`
  padding: 20px;
`;

let styleItems = css`
  padding: 12px 10px 0 10px;
`;
