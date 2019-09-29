import React, { FC, useState } from "react";
import { css } from "emotion";
import { lingual } from "../../src/lingual";
import { MesonFormModal } from "meson-form";
import { IMesonFieldItem, EMesonFieldType } from "../../src/model/types";
import Button from "antd/lib/button";
import DataPreview from "kits/data-preview";
import { DocDemo } from "@jimengio/doc-frame";
import { getLink } from "util/link";

let ModalPage: FC<{}> = (props) => {
  let [formVisible, setFormVisible] = useState(false);

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
    {
      type: EMesonFieldType.Input,
      name: "demo",
      label: "DEMO----------------------test length",
    },
    {
      type: EMesonFieldType.Number,
      name: "numberdemo",
      label: "number DEMO",
      inputProps: {
        style: { width: 180 },
      },
    },
  ];

  return (
    <div className={styleContainer}>
      <DocDemo title="Modal" link={getLink("modal.tsx")}>
        <div className={styleBoxArea}>
          <div>
            <Button
              onClick={() => {
                setFormVisible(true);
              }}
            >
              Open Form Modal
            </Button>
          </div>
        </div>

        <div>
          <DataPreview data={form} />
        </div>
      </DocDemo>

      <MesonFormModal
        title={"DEMO form in modal"}
        visible={formVisible}
        onClose={() => {
          setFormVisible(false);
        }}
        items={formItems}
        initialValue={form}
        labelClassName={styleLabel}
        onSubmit={(form) => {
          setFormVisible(false);
          setForm(form);
        }}
      />
    </div>
  );
};

export default ModalPage;

let styleContainer = css``;

let styleBoxArea = css`
  padding: 20px;
`;

const styleLabel = css`
  width: 200px;
`;
