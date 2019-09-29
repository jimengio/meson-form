import React, { FC, useState } from "react";
import { css } from "emotion";
import { lingual } from "../../src/lingual";
import { MesonFormDropdown } from "meson-form";
import { IMesonFieldItem, EMesonFieldType } from "../../src/model/types";
import DataPreview from "kits/data-preview";
import { DocDemo } from "@jimengio/doc-frame";
import { getLink } from "util/link";

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
      <DocDemo title="Demo of form in dropdown area" link={getLink("modal.tsx")}>
        <div className={styleArea}>
          <MesonFormDropdown
            title={"Settings"}
            hideClose
            items={formItems}
            initialValue={form}
            labelClassName={styleLabel}
            onSubmit={(form) => {
              setForm(form);
            }}
            width={200}
          >
            Dropdown area
          </MesonFormDropdown>
        </div>
        <div>
          <DataPreview data={form} />
        </div>
      </DocDemo>
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
