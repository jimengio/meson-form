import React, { FC, useState } from "react";
import { css } from "emotion";
import { lingual } from "../../src/lingual";
import { MesonFormDrawer } from "meson-form";
import { IMesonFieldItem, EMesonFieldType } from "../../src/model/types";
import Button from "antd/lib/button";
import DataPreview from "kits/data-preview";
import SourceLink from "kits/source-link";
import MesonDrawer from "../../src/component/drawer";

let DrawerPage: FC<{}> = (props) => {
  let [visible, setVisible] = useState(false);
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
      <div className={styleBoxArea}>
        <div>
          <Button
            onClick={() => {
              setVisible(true);
            }}
          >
            Try Drawer
          </Button>{" "}
          <Button
            onClick={() => {
              setFormVisible(true);
            }}
          >
            Open Form Drawer
          </Button>
        </div>
      </div>

      <MesonDrawer
        title={"DEMO drawer"}
        width={400}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        renderContent={() => {
          return (
            <div>
              SOMETHING
              <span
                onClick={() => {
                  setVisible(false);
                }}
              >
                Close
              </span>
            </div>
          );
        }}
      />
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
      <div>
        <SourceLink fileName={"drawer.tsx"} />
        <DataPreview data={form} />
      </div>
    </div>
  );
};

export default DrawerPage;

let styleContainer = css``;

let styleBoxArea = css`
  padding: 20px;
`;
