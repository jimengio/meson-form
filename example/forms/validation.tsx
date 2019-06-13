import React, { SFC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm } from "meson-form";
import { IMesonFieldItem, EMesonFieldType } from "../../src/model/types";
import DataPreview from "kits/data-preview";
import { row } from "@jimengio/shared-utils";
import SourceLink from "kits/source-link";
import Select from "antd/lib/select";
import TextArea from "antd/lib/input/TextArea";
import { lingual, formatString } from "../../src/lingual";

let formItems: IMesonFieldItem[] = [
  {
    type: EMesonFieldType.Input,
    required: true,
    label: "名称",
    name: "name",
  },

  {
    type: EMesonFieldType.Input,
    required: true,
    label: "名称",
    name: "longName",
    validator: (value) => {
      if (!value) {
        return "这个错误信息是测试错误信息过长时，是否会换行显示";
      }
    },
  },
  {
    type: EMesonFieldType.Custom,
    label: "性别",
    name: "sex",
    /** 测试自定义layout样式 */
    style: {
      width: "100%",
      minWidth: 200,
    },
    render: (value, onChange, form, onCheck) => {
      return (
        <Select
          allowClear
          className={styleMediumItem}
          value={value}
          placeholder={formatString(lingual.pleaseSelectLabel, { label: "性别" })}
          onChange={onChange}
        >
          <Select.Option key="male" value="male">
            男
          </Select.Option>
          <Select.Option key="female" value="female">
            女
          </Select.Option>
        </Select>
      );
    },
  },
  {
    type: EMesonFieldType.Custom,
    label: "自定义描述",
    name: "customDescription",
    required: true,
    render: (value, onChange, form, onCheck) => {
      return (
        <div className={styleMediumItem}>
          <TextArea
            value={value}
            placeholder={formatString(lingual.pleaseInputLabel, { label: "自定义描述" })}
            onChange={(e) => {
              onChange(e.target.value);
            }}
            onBlur={() => {
              onCheck(value);
            }}
          />
        </div>
      );
    },
    validator: (value) => {
      if (!value) {
        return "这个错误信息是测试错误信息过长时，是否会换行显示";
      }
    },
  },
  {
    type: EMesonFieldType.Input,
    textarea: true,
    label: "描述",
    name: "description",
    required: true,
    placeholder: formatString(lingual.pleaseInputLabel, { label: "描述" }),
    validator: (value) => {
      if (!value) {
        return "这个错误信息是测试错误信息过长时，是否会换行显示";
      }
    },
  },
];

let ValidationPage: SFC<{}> = (props) => {
  let [form, setForm] = useState({});

  return (
    <div className={cx(row, styleContainer)}>
      <MesonForm
        initialValue={{}}
        items={formItems}
        onSubmit={(form) => {
          setForm(form);
        }}
      />

      <div>
        <SourceLink fileName={"validation.tsx"} />
        <DataPreview data={form} />
      </div>
    </div>
  );
};

export default ValidationPage;

let styleContainer = css``;

let styleMediumItem = css`
  width: 240px;
`;
