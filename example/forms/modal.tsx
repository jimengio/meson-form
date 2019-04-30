import React, { SFC, useState } from "react";
import { css } from "emotion";
import { lingual } from "../../src/lingual";
import { MesonFormModal } from "meson-form";
import MesonModal from "../../src/component/modal";
import { IMesonFieldItem } from "../../src/model/types";
import { Button } from "antd";
import DataPreview from "kits/data-preview";
import SourceLink from "kits/source-link";

let ModalPage: SFC<{}> = (props) => {
  let [visible, setVisible] = useState(false);
  let [formVisible, setFormVisible] = useState(false);

  let [form, setForm] = useState({});

  let formItems: IMesonFieldItem[] = [];

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
              setFormVisible(true);
            }}
          >
            Open Form Modal
          </Button>
        </div>
      </div>

      <MesonModal
        title={lingual.labelShouldBeString}
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
      <MesonFormModal
        title={lingual.labelShouldBeBoolean}
        visible={formVisible}
        onClose={() => {
          setFormVisible(false);
        }}
        items={formItems}
        initialValue={form}
        onSubmit={(form) => {
          console.log("form", form);
          setFormVisible(false);
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
