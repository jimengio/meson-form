import React, { FC, useState } from "react";
import { css } from "emotion";
import { lingual } from "../../src/lingual";
import { MesonFormModal } from "meson-form";
import MesonModal from "../../src/component/modal";
import { IMesonFieldItem, EMesonFieldType } from "../../src/model/types";
import Button from "antd/lib/button";
import DataPreview from "kits/data-preview";
import SourceLink from "kits/source-link";

let ModalPage: FC<{}> = (props) => {
  let [visible, setVisible] = useState(false);
  let [noMovingVisible, setNoMovingVisible] = useState(false);
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
            Try Modal
          </Button>{" "}
          <Button
            onClick={() => {
              setNoMovingVisible(true);
            }}
          >
            Modal no moving
          </Button>{" "}
          <Button
            onClick={() => {
              setFormVisible(true);
            }}
          >
            Open Form Modal
          </Button>
        </div>
      </div>

      <MesonModal
        title={"DEMO modal"}
        visible={visible}
        onClose={() => {
          setVisible(false);
        }}
        renderContent={() => {
          return (
            <div>
              SOMETHING....
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

      <MesonModal
        title={"DEMO modal"}
        visible={noMovingVisible}
        onClose={() => {
          setNoMovingVisible(false);
        }}
        disableMoving
        renderContent={() => {
          return (
            <div>
              <span
                onClick={() => {
                  setNoMovingVisible(false);
                }}
              >
                Close
              </span>
            </div>
          );
        }}
      />
      <MesonFormModal
        title={"DEMO form in modal"}
        visible={formVisible}
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
        <SourceLink fileName={"modal.tsx"} />
        <DataPreview data={form} />
      </div>
    </div>
  );
};

export default ModalPage;

let styleContainer = css``;

let styleBoxArea = css`
  padding: 20px;
`;
