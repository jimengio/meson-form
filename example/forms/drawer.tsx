import React, { FC, useState } from "react";
import { css } from "emotion";
import { lingual } from "../../src/lingual";
import { MesonFormDrawer } from "meson-form";
import { IMesonFieldItem, EMesonFieldType } from "../../src/model/types";
import Button from "antd/lib/button";
import DataPreview from "kits/data-preview";
import { DocDemo } from "@jimengio/doc-frame";
import { getLink } from "util/link";

let DrawerPage: FC<{}> = (props) => {
  let [formVisible, setFormVisible] = useState(false);

  let [form, setForm] = useState({});

  let formItems: IMesonFieldItem[] = [
    {
      type: EMesonFieldType.Input,
      name: "demo",
      label: "DEMO",
    },
  ];

  return (
    <div className={styleContainer}>
      <DocDemo title="Demo for drawer" link={getLink("drawer.tsx")}>
        <div className={styleBoxArea}>
          <div>
            <Button
              onClick={() => {
                setFormVisible(true);
              }}
            >
              Open Form Drawer
            </Button>
          </div>
        </div>

        <div>
          <DataPreview data={form} />
        </div>
      </DocDemo>
      <MesonFormDrawer
        title={"DEMO form in drawer"}
        visible={formVisible}
        width={480}
        onClose={() => {
          setFormVisible(false);
        }}
        items={formItems}
        initialValue={form}
        onSubmit={(form) => {
          setFormVisible(false);
          setForm(form);
        }}
      />
    </div>
  );
};

export default DrawerPage;

let styleContainer = css``;

let styleBoxArea = css`
  padding: 20px;
`;

let styleHeader = css`
  background-color: rgb(28, 63, 118);
  color: white;
  height: 120px;
`;
