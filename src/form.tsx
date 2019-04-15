import React, { SFC, ReactNode } from "react";
import { row, column } from "@jimengio/shared-utils";
import { css, cx } from "emotion";
import { Input, InputNumber, Select, Button } from "antd";
import { useImmer } from "use-immer";
import { lingual, formatString } from "./lingual";
import { IMesonFieldItem, EMesonFieldType, IMesonFieldItemHasValue, ISimpleObject } from "./model/types";
import { validateValueRequired, validateByMethods, validateItem } from "./util/validation";
import { traverseItems } from "./util/render";
import { RequiredMark } from "./component/misc";
import is from "is";

export { IMesonFieldItem, EMesonFieldType } from "./model/types";

export let MesonForm: SFC<{
  initialValue: any;
  items: IMesonFieldItem[];
  onFieldChange: (k: string, v: any) => void;
  onSubmit: (form: { string: any }) => void;
  onCancel: () => void;
}> = (props) => {
  let [form, updateForm] = useImmer(props.initialValue);
  let [errors, updateErrors] = useImmer({} as ISimpleObject);

  let checkItem = (item: IMesonFieldItemHasValue) => {
    let result = validateItem(form[item.name], item);
    updateErrors((draft) => {
      draft[item.name] = result;
    });
  };

  let updateItem = (x: any, item: IMesonFieldItemHasValue) => {
    updateForm((draft) => {
      draft[item.name] = x;
    });
    props.onFieldChange(item.name, x);
  };

  let renderValueItem = (item: IMesonFieldItem) => {
    switch (item.type) {
      case EMesonFieldType.Input:
        return (
          <Input
            value={form[item.name]}
            className={styleControlBase}
            onChange={(event) => {
              let newValue = event.target.value;
              updateItem(newValue, item);
            }}
            onBlur={() => {
              checkItem(item);
            }}
          />
        );
      case EMesonFieldType.Number:
        return (
          <InputNumber
            value={form[item.name]}
            className={styleControlBase}
            onChange={(newValue) => {
              updateItem(newValue, item);
            }}
            onBlur={() => {
              checkItem(item);
            }}
          />
        );
      case EMesonFieldType.Select:
        return (
          <Select
            value={form[item.name]}
            className={styleControlBase}
            onChange={(newValue) => {
              updateItem(newValue, item);
            }}
            onBlur={() => {
              checkItem(item);
            }}
          >
            {item.options.map((option) => {
              return (
                <Select.Option value={option.value} key={option.key || option.value}>
                  {option.display}
                </Select.Option>
              );
            })}
          </Select>
        );
      case EMesonFieldType.Group:
        return renderItems(item.children);
      case EMesonFieldType.Custom:
        let onChange = (value: any) => {
          updateItem(value, item);
        };
        return item.render(form[item.name], onChange);
    }
    return <div>Unknown type: {(item as any).type}</div>;
  };

  let renderItems = (items: IMesonFieldItem[]) => {
    return items.map((item, idx) => {
      if (item.shouldHide != null && item.shouldHide(form)) {
        return null;
      }

      let name: string = (item as any).name;
      let error = name != null ? errors[name] : null;

      return (
        <div key={idx} className={cx(row, styleItemRow)}>
          <div className={styleLabel}>
            {item.required ? <RequiredMark /> : null}
            {item.label}:
          </div>
          <div className={cx(column, styleValueArea)}>
            {renderValueItem(item)}
            {error != null ? <div className={styleError}>{error}</div> : null}
          </div>
        </div>
      );
    });
  };

  return (
    <div>
      {renderItems(props.items)}
      <div className={cx(row, styleItemRow)}>
        <div className={styleLabel} />
        <div className={cx(row, styleValueArea)}>
          <Button
            type={"primary"}
            onClick={() => {
              let currentErrors: ISimpleObject = {};
              traverseItems(props.items, (item: IMesonFieldItemHasValue) => {
                let result = validateItem(form[item.name], item);

                console.log("validates", item.name, result);

                if (result != null) {
                  currentErrors[item.name] = result;
                }
              });

              console.log("currentErrors", currentErrors);
              updateErrors((draft) => {
                return currentErrors;
              });
              console.warn("submit form", form);
            }}
          >
            {lingual.confirm}
          </Button>
          <div style={{ width: 12 }} />
          <Button onClick={props.onCancel}>{lingual.cancel}</Button>
        </div>
      </div>
    </div>
  );
};

let styleLabel = css`
  color: hsla(0, 0%, 20%, 1);
  min-width: 120px;
  width: max-content;
  text-align: right;
  margin-right: 8px;
`;

let styleValueArea = css``;

let styleItemRow = css`
  line-height: 32px;
  margin-bottom: 24px;
  font-size: 14px;
`;

let styleControlBase = css`
  min-width: 180px;
`;

let styleError = css`
  color: red;
`;
