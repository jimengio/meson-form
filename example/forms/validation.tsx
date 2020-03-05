import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm } from "meson-form";
import { IMesonFieldItem } from "../../src/model/types";
import DataPreview from "kits/data-preview";
import { row } from "@jimengio/shared-utils";
import Select from "antd/lib/select";
import TextArea from "antd/lib/input/TextArea";
import { lingual, formatString } from "../../src/lingual";
import { DocDemo } from "@jimengio/doc-frame";
import { getLink } from "util/link";

let formItems: IMesonFieldItem[] = [
  {
    type: "input",
    required: true,
    label: "名称",
    name: "name",
    validator: () => {
      return undefined;
    },
  },
  {
    type: "input",
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
    type: "custom",
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
    type: "custom",
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
        return "这个错误信息是测试错误信息过长时，是否会换行显示；这个错误信息是测试错误信息过长时，是否会换行显示；这个错误信息是测试错误信息过长时，是否会换行显示";
      }
    },
  },
  {
    type: "textarea",
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

let formItems2: IMesonFieldItem[] = [
  {
    type: "decorative",
    render: () => "Custom errorClassName",
  },
  {
    type: "input",
    label: "username",
    name: "username",
    required: true,
  },
  {
    type: "input",
    label: "password",
    name: "password",
    required: true,
  },
  {
    type: "input",
    label: "lang text",
    name: "lang-text",
    required: true,
    validator: (value) => {
      if (!value) {
        return "lang text lang text lang text lang text lang text lang text lang text lang text lang text lang text lang text lang text lang text lang text lang text lang text lang text lang text lang text lang text lang text";
      }
    },
  },
];

let ValidationPage: FC<{}> = (props) => {
  let [form, setForm] = useState({});
  let [form2, setForm2] = useState({});

  return (
    <div className={cx(row)}>
      <div className={styleContainer}>
        <DocDemo title="Demo form validations" link={getLink("validation.tsx")}>
          <MesonForm
            initialValue={{}}
            items={formItems}
            onSubmit={(form) => {
              setForm(form);
            }}
          />
          <DataPreview data={form} />
        </DocDemo>

        <DocDemo title="Demo custom error styles" link={getLink("validation.tsx")}>
          <MesonForm
            initialValue={form2}
            items={formItems2}
            errorClassName={styleError}
            onSubmit={(form) => {
              setForm2(form);
            }}
          />
          <DataPreview data={form2} />
        </DocDemo>
      </div>
    </div>
  );
};

export default ValidationPage;

let styleContainer = css`
  width: 500px;
`;

let styleMediumItem = css`
  width: 240px;
`;

const styleError = css`
  padding: 2px 0;
  font-size: 12px;
  line-height: 12px;
  margin-bottom: 0;
`;
