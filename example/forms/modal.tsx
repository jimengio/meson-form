import React, { FC, useState } from "react";
import { css } from "emotion";
import { lingual } from "../../src/lingual";
import { MesonFormModal } from "meson-form";
import { IMesonFieldItem } from "../../src/model/types";
import { Button } from "antd";
import DataPreview from "kits/data-preview";
import { DocDemo, DocSnippet, DocBlock } from "@jimengio/doc-frame";
import { getLink } from "util/link";

let content = `
很多情况下表单是通过 Modal 的形式展现的, 所以提供了一个组件, 直接以 Modal 的形式渲染表单.

Modal 用是 [meson-modal](http://fe.jimu.io/meson-modal/#/modal) 的实现
`;

let code = `
import { MesonFormModal } from "@jimengio/meson-form";

let [formVisible, setFormVisible] = useState(false);

// let [form, setForm] ...
// let formItems = ...

<MesonFormModal
  centerTitle
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
`;

let ModalPage: FC<{}> = (props) => {
  let [formVisible, setFormVisible] = useState(false);

  let [form, setForm] = useState({});

  let formItems: IMesonFieldItem[] = [
    {
      type: "input",
      name: "demo",
      label: "DEMO",
    },
    {
      type: "input",
      name: "demo",
      label: "DEMO",
    },
    {
      type: "input",
      name: "demo",
      label: "DEMO",
    },
    {
      type: "input",
      name: "demo",
      label: "DEMO",
    },
    {
      type: "input",
      name: "demo",
      label: "DEMO----------------------test length",
    },
    {
      type: "number",
      name: "numberdemo",
      label: "number DEMO",
      inputProps: {
        style: { width: 180 },
      },
    },
  ];

  return (
    <div className={styleContainer}>
      <DocBlock content={content} />
      <DocDemo title="Modal" link={getLink("modal.tsx")}>
        <div className={styleBoxArea}>
          <div>
            <Button
              type="primary"
              children={"Open Form Modal"}
              onClick={() => {
                setFormVisible(true);
              }}
            />
          </div>
        </div>

        <div>
          <DataPreview data={form} />
        </div>

        <DocSnippet code={code} />
      </DocDemo>

      <MesonFormModal
        centerTitle
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
