import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm } from "../../src/form";
import { IMesonFieldItem, EMesonFieldType } from "../../src/model/types";
import { row } from "@jimengio/shared-utils";
import DataPreview from "kits/data-preview";
import { DocDemo } from "@jimengio/doc-frame";
import { getLink } from "util/link";

let formItems: IMesonFieldItem[] = [
  {
    type: EMesonFieldType.Switch,
    name: "checked",
    label: "Checked",
  },
  {
    type: EMesonFieldType.Switch,
    name: "checked",
    label: "Check disabled",
    disabled: true,
  },
];

let SwitchPage: FC<{}> = (props) => {
  let [form, setForm] = useState({});

  return (
    <div className={cx(row, styleContainer)}>
      <DocDemo title="Demo of switch type" link={getLink("switch.tsx")}>
        <MesonForm
          initialValue={form}
          items={formItems}
          onSubmit={(form) => {
            setForm(form);
          }}
        />
        <div>
          <DataPreview data={form} />
        </div>
      </DocDemo>
    </div>
  );
};

export default SwitchPage;

let styleContainer = css``;
