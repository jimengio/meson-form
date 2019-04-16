import React, { useState } from "react";
import { parseRoutePath, IRouteParseResult } from "@jimengio/ruled-router";
import { css } from "emotion";
import { MesonForm, MesonFormModal } from "meson-form";
import { Input, Button } from "antd";
import { EMesonValidate, IMesonSelectitem, IMesonFieldItem, EMesonFieldType } from "../../src/model/types";
import MesonModal from "../../src/component/modal";
import { lingual } from "../../src/lingual";

export default (props) => {
  let [visible, setVisible] = useState(false);
  let [formVisible, setFormVisible] = useState(false);

  let options: IMesonSelectitem[] = [
    {
      value: "1",
      display: "one",
    },
    {
      value: "2",
      display: "two",
    },
  ];

  let formItems: IMesonFieldItem[] = [
    {
      type: EMesonFieldType.Select,
      label: "物料",
      name: "material",
      required: true,
      options: options,
      validator: (x) => {
        if (x == null) {
          return "material is required";
        }
        if (x.length > 10) {
          return "string too long";
        }
      },
    },
    {
      type: EMesonFieldType.Number,
      label: "数量",
      name: "amount",
      required: true,
      validator: (x) => {
        if (x == null) {
          return "amount is required";
        }
        if (x > 10) {
          return "too large";
        }
      },
    },
    {
      type: EMesonFieldType.Number,
      label: "计数",
      name: "count",
      required: true,
      validateMethods: [EMesonValidate.Number],
    },
    {
      type: EMesonFieldType.Input,
      shouldHide: (form) => {
        return form.amount && form.amount > 6;
      },
      label: "单价",
      name: "price",
      required: true,
    },
    {
      type: EMesonFieldType.Group,
      label: "group",
      children: [{ type: EMesonFieldType.Select, label: "物料", name: "materialInside", required: true, options: options }],
    },
    {
      type: EMesonFieldType.Custom,
      name: "size",
      label: "自定义",
      render: (value, onChange) => {
        return (
          <Input
            value={value}
            onChange={(event) => {
              let newValue = event.target.value;
              onChange(newValue);
            }}
          />
        );
      },
    },
  ];

  return (
    <div className={styleContainer}>
      <div className={styleTitle}>Form example</div>

      <div className={styleBoxArea}>
        <div>
          <Button
            onClick={() => {
              setVisible(true);
            }}
          >
            Try Modal
          </Button>
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
      </div>
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
        <MesonFormModal
          title={lingual.labelShouldBeBoolean}
          visible={formVisible}
          onClose={() => {
            setFormVisible(false);
          }}
          items={formItems}
          initialValue={{}}
          onSubmit={(form) => {
            console.log("form", form);
            setFormVisible(false);
          }}
        />
      </div>

      <MesonForm
        initialValue={{}}
        items={formItems}
        onSubmit={(form) => {
          console.log("submit data", form);
        }}
        onCancel={() => {
          console.log("cancel");
        }}
      />
    </div>
  );
};

const styleContainer = css`
  font-family: "Helvetica";
`;

const styleTitle = css`
  margin-bottom: 16px;
`;

let styleBoxArea = css`
  padding: 20px;
`;
