import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm } from "../../src/form";
import { IMesonFieldItem, EMesonFieldType } from "../../src/model/types";
import { row } from "@jimengio/shared-utils";
import DataPreview from "kits/data-preview";
import SourceLink from "kits/source-link";

let formItems: IMesonFieldItem[] = [
  {
    type: EMesonFieldType.Decorative,
    render: () => <h1>From</h1>,
  },
  {
    type: EMesonFieldType.Input,
    name: "name",
    label: "名字",
  },
  {
    type: EMesonFieldType.Decorative,
    render: (form) => <span>hello {form.name}</span>,
  },
  {
    type: EMesonFieldType.Input,
    name: "address",
    label: "地址",
  },
  {
    type: EMesonFieldType.Switch,
    name: "switch",
    label: "switch",
  },
  {
    type: EMesonFieldType.Decorative,
    render: (form) => <span>shouldHide</span>,
    shouldHide: (form) => form.switch,
  },
];

let DecorativePage: FC<{}> = (props) => {
  let [form, setForm] = useState({});

  return (
    <div className={cx(row, styleContainer)}>
      <MesonForm
        initialValue={form}
        items={formItems}
        onSubmit={(form) => {
          setForm(form);
        }}
      />
      <div>
        <SourceLink fileName={"decorative.tsx"} />
        <DataPreview data={form} />
      </div>
    </div>
  );
};

export default DecorativePage;

let styleContainer = css``;
