import React, { FC, useState } from "react";
import { css } from "emotion";
import { useMesonCore } from "../../src/hook/meson-core";
import { IMesonCustomField, EMesonFieldType, IMesonFieldItem, EMesonValidate } from "../../src/model/types";
import { column } from "@jimengio/shared-utils";

interface ILoginForm {
  username: string;
  password: string;
}

let formItems: IMesonFieldItem<ILoginForm>[] = [
  {
    type: EMesonFieldType.Input,
    name: "username",
    label: null,
    placeholder: "Username",
    required: true,
  },
  {
    type: EMesonFieldType.Input,
    name: "password",
    inputType: "password",
    placeholder: "Password",
    label: null,
    required: true,
  },
];

let WrapMesonCore: FC<{}> = (props) => {
  let [submittedForm, setSubmittedForm] = useState({} as any);
  let [turn, setTurn] = useState(0);

  let onSubmit = (form: ILoginForm) => {
    setSubmittedForm(form);
  };

  let { formAny, errors, onCheckSubmit, checkItem, updateItem, updateForm, updateErrors } = useMesonCore({
    initialValue: submittedForm,
    items: formItems,
    onSubmit: onSubmit,
  });

  let form = formAny as ILoginForm;

  return (
    <div className={styleContainer}>
      <div>
        This page demonstrates a form using hooks and renders by user.{" "}
        <a href="https://github.com/jimengio/meson-form/tree/master/example/forms/wrap-meson-core.tsx">Source code</a>
      </div>
      <div>
        Data:
        <code>{JSON.stringify(submittedForm)}</code>
        <button
          onClick={() => {
            setSubmittedForm({});
            updateForm((draft) => {
              return {};
            });
            updateErrors((draft) => {
              return {};
            });
          }}
        >
          Reset
        </button>
      </div>

      <div className={styleFormArea}>
        {formItems.map((item) => {
          switch (item.type) {
            case EMesonFieldType.Input:
              return (
                <div className={column} key={item.name}>
                  <input
                    value={form[item.name] || ""}
                    type={item.inputType}
                    placeholder={item.placeholder}
                    onChange={(event) => {
                      let text = event.target.value;
                      updateItem(text, item);
                    }}
                    onBlur={() => {
                      checkItem(item);
                    }}
                  />
                  {errors[item.name] != null ? <div className={styleError}>{errors[item.name]}</div> : null}
                </div>
              );
          }
        })}
        <div>
          <button onClick={onCheckSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default WrapMesonCore;

let styleContainer = css``;

let styleError = css`
  color: red;
`;

let styleFormArea = css`
  width: 200px;
  padding: 16px;
`;
