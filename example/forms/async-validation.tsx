import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm } from "../../src/form";
import { IMesonFieldItem, IMesonSelectItem } from "../../src/model/types";
import DataPreview from "kits/data-preview";
import { DocDemo, DocBlock, DocSnippet } from "@jimengio/doc-frame";
import { getLink } from "util/link";
import Input from "antd/lib/input";

let formItems: IMesonFieldItem[] = [
  {
    type: "input",
    name: "familyName",
    label: "姓",
    required: true,
    placeholder: "不能有数字",
    asyncValidator: async (x, item, form) => {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
      if (x?.match(/\d/)) {
        return "should not have digits in name";
      }
    },
  },
  {
    type: "input",
    name: "givenName",
    label: "名",
    required: true,
    placeholder: "不能有数字(异步), 标点(本地)",
    validator: (x: string) => {
      if (x?.match(/[\+\-\*\.\>\<\?]/)) {
        return "should not contain punctuations";
      }
    },
    asyncValidator: async (x: string) => {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });

      if (x?.match(/\d/)) {
        return "should not have digits in name";
      }
    },
  },

  {
    type: "custom-multiple",
    names: ["province", "city"],
    label: "地区",
    renderMultiple: (form, updateForm, checkForm) => {
      return (
        <div className={styleRow}>
          Provice:{" "}
          <Input
            value={form.province}
            style={{ width: 100 }}
            placeholder={"不能有数字"}
            onChange={(e) => {
              let text = e.target.value;
              updateForm((draft) => {
                draft.province = text;
              });
            }}
            onBlur={() => {
              checkForm(form);
            }}
          />
          City:
          <Input
            value={form.city}
            style={{ width: 100 }}
            placeholder={"不能有数字"}
            onChange={(e) => {
              let text = e.target.value;
              updateForm((draft) => {
                draft.city = text;
              });
            }}
            onBlur={() => {
              checkForm(form);
            }}
          />
        </div>
      );
    },
    validateMultiple: (form) => {
      return {};
    },
    asyncValidateMultiple: async (form) => {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });
      let ret = {
        province: undefined as string,
        city: undefined as string,
      };
      if (form.province?.match(/\d/)) {
        ret.province = "should not contain digits";
      }
      if (form.city?.match(/\d/)) {
        ret.city = "should not contain digits";
      }
      return ret;
    },
  },
];

let FormAsyncValidation: FC<{}> = (props) => {
  let [form, setForm] = useState({});

  return (
    <div className={cx(styleContainer)}>
      <DocBlock content={content}></DocBlock>
      <DocDemo title={"A basic form"} link={getLink("basic.tsx")} className={styleDemo}>
        <MesonForm
          initialValue={form}
          items={formItems}
          onSubmit={(form) => {
            setForm(form);
          }}
        />
        <DataPreview data={form} />
        <DocSnippet code={code} />

        <DocBlock content={contentOfMultiple} />
        <DocSnippet code={codeOfMultiple} />
      </DocDemo>
    </div>
  );
};

export default FormAsyncValidation;

let styleContainer = css``;

let styleDemo = css`
  min-width: 400px;
`;

let content = `
\`asyncValidator\` 是一个用于异步校验的方法, 如果本地没有发现错误且该方法存在, 则会发起校验.
`;

let code = `
import { MesonForm, IMesonFieldItem } from "@jimengio/meson-form";

{
  type: "input",
  name: "familyName",
  label: "姓",
  required: true,
  asyncValidator: async (x, item, form) => {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
    if (x?.match(/\d/)) {
      return "should not have digits in name";
    }
  },
},
{
  type: "input",
  name: "givenName",
  label: "名",
  required: true,
  validator: (x: string) => {
    if (x?.match(/[\\+\\-\\*\\.\\>\\<\\?]/)) {
      return "should not contain punctuations";
    }
  },
  asyncValidator: async (x: string) => {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });

    if (x?.match(/\d/)) {
      return "should not have digits in name";
    }
  },
},
`;

let contentOfMultiple = `
\`asyncValidateMultiple\` 对应到 custom-multiple 类型当中的异步校验.
`;

let codeOfMultiple = `
{
  type: "custom-multiple",
  names: ["province", "city"],
  label: "地区",
  renderMultiple: (form, updateForm, checkForm) => {
    return (
      <div className={styleRow}>
        Provice:{" "}
        <Input
          value={form.province}
          style={{ width: 100 }}
          onChange={(e) => {
            let text = e.target.value;
            updateForm((draft) => {
              draft.province = text;
            });
          }}
          onBlur={() => {
            checkForm(form);
          }}
        />
        City:
        <Input
          value={form.city}
          style={{ width: 100 }}
          onChange={(e) => {
            let text = e.target.value;
            updateForm((draft) => {
              draft.city = text;
            });
          }}
          onBlur={() => {
            checkForm(form);
          }}
        />
      </div>
    );
  },
  validateMultiple: (form) => {
    return {};
  },
  asyncValidateMultiple: async (form) => {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
    let ret = {
      province: undefined,
      city: undefined,
    };
    if (form.province?.match(/\d/)) {
      ret.province = "should not contain digits";
    }
    if (form.city?.match(/\d/)) {
      ret.city = "should not contain digits";
    }
    return ret;
  },
},
`;

let styleRow = css`
  display: flex;
`;
