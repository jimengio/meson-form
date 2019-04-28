import React, { useState } from "react";
import { parseRoutePath, IRouteParseResult } from "@jimengio/ruled-router";
import { css, cx } from "emotion";
import { MesonForm, MesonFormModal } from "meson-form";
import { Input, Button } from "antd";
import { EMesonValidate, IMesonSelectItem, IMesonFieldItem, EMesonFieldType } from "../../src/model/types";
import MesonModal from "../../src/component/modal";
import { lingual } from "../../src/lingual";
import { EMesonFooterLayout } from "../../src/component/form-footer";
import { column, row } from "@jimengio/shared-utils";

interface IDemo {
  material: string;
  amount: string;
  count: string;
  price: string;
  name: string;
  size: number;
  description: string;
}

export default (props) => {
  let [visible, setVisible] = useState(false);
  let [formVisible, setFormVisible] = useState(false);

  let options: IMesonSelectItem[] = [
    {
      value: "1",
      display: "one",
    },
    {
      value: "2",
      display: "two",
    },
  ];

  let formItems: IMesonFieldItem<keyof IDemo>[] = [
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
      type: EMesonFieldType.Input,
      textarea: true,
      label: "描述",
      name: "description",
      required: true,
    },
    {
      type: EMesonFieldType.Fragment,
      shouldHide: () => true,
      children: [
        {
          type: EMesonFieldType.Input,
          textarea: true,
          label: "描述",
          name: "description",
          required: true,
        },
      ],
    },
    {
      type: EMesonFieldType.Custom,
      name: null,
      label: "Width test",
      render: (value) => {
        return <div className={styleWideColor} />;
      },
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
          <div className={row}>
            <div>
              <Input
                value={value}
                onChange={(event) => {
                  let newValue = event.target.value;
                  onChange(newValue);
                }}
              />
            </div>
          </div>
        );
      },
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
              setFormVisible(true);
            }}
          >
            Open Form Modal
          </Button>
        </div>
      </div>

      <div className={cx(column, styleFormArea)}>
        <MesonForm
          initialValue={{}}
          items={formItems}
          onSubmit={(form) => {
            console.log("submit data", form);
          }}
          onCancel={() => {
            console.log("cancel");
          }}
          footerLayout={EMesonFooterLayout.Center}
          onFormChange={(form, onSubmit) => {
            console.log("form", form);
          }}
        />
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
        initialValue={{}}
        onSubmit={(form) => {
          console.log("form", form);
          setFormVisible(false);
        }}
      />
    </div>
  );
};

const styleContainer = css`
  font-family: "Helvetica";
  padding: 16px;
`;

let styleBoxArea = css`
  padding: 20px;
`;

let styleFormArea = css`
  width: 480px;
  height: 660px;
  border: 1px solid #ccc;
`;

let styleWideColor = css`
  background-color: #eee;
  height: 40px;
  width: 600px;
  max-width: 100%;
`;
