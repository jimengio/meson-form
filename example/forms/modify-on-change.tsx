import React, { FC, useState } from "react";
import { css, cx } from "emotion";
import { MesonForm } from "../../src/form";
import { IMesonFieldItem, EMesonFieldType, IMesonSelectItem, FuncMesonModifyForm } from "../../src/model/types";
import { row, xHiddenYAuto } from "@jimengio/shared-utils";
import DataPreview from "kits/data-preview";
import { DocDemo } from "@jimengio/doc-frame";
import { getLink } from "util/link";

let candidates: IMesonSelectItem[] = [{ value: "local", display: "本市" }, { value: "strange", display: "外地" }];

enum EHomeKind {
  Local = "local",
  Strange = "strange",
}

interface IHome {
  kind: EHomeKind;
  place: string;
  note?: string;
}

let formItems: IMesonFieldItem[] = [
  {
    type: EMesonFieldType.Select,
    name: "kind",
    label: "种类",
    options: candidates,
    required: true,
    onChange: (v: string, modifyForm: FuncMesonModifyForm<IHome>) => {
      if (v === "local") {
        modifyForm((form) => {
          form.place = "上海市";
        });
      } else {
        modifyForm((form) => {
          form.place = "";
        });
      }
    },
  },
  {
    type: EMesonFieldType.Input,
    name: "place",
    label: "籍贯",
    required: true,
  },
  {
    type: EMesonFieldType.Input,
    name: "note",
    label: "备注",
    required: false,
  },
];

let ModifyOnChange: FC<{}> = (props) => {
  let [form, setForm] = useState({});

  return (
    <div className={cx(row, styleContainer)}>
      <DocDemo title={"Demo of on change hooks and extra modify API"} link={getLink("modify-on-change.tsx")}>
        <MesonForm
          initialValue={form}
          items={formItems}
          onSubmit={(form) => {
            setForm(form);
          }}
        />
        <div>
          <DataPreview data={form} />
        </div>
      </DocDemo>
    </div>
  );
};

export default ModifyOnChange;

let styleContainer = css``;
