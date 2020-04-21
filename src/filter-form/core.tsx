import React, { ReactText, ReactNode, CSSProperties } from "react";
import { cx, css } from "emotion";
import { flexWrap, row, expand } from "@jimengio/flex-styles";

import { useImmer } from "use-immer";
import { renderDropdownSelectItem, renderDatePickerItem } from "./renderder";
import { forIn } from "lodash-es";

import { IFilterFieldItem } from "./types";

interface IProps<T> {
  items: IFilterFieldItem<T>[];
  onItemChange: (filterResult: T) => void;
  initialValue?: T;
  className?: string;
  labelClassName?: string;
}

function useFilterForm<T = { [k: string]: any }>(props: IProps<T>) {
  let [form, updateForm] = useImmer<T>(props.initialValue || ({} as T));

  let updateItem = (x: any, item: IFilterFieldItem<T>) => {
    updateForm((draft) => {
      draft[item.name as string] = x;
    });

    let newForm = {} as T;

    forIn({ ...form, [item.name]: x }, (value, key) => {
      if (value != null) {
        newForm[key] = value;
      }
    });

    props.onItemChange(newForm);
  };

  let renderValueItem = (item: IFilterFieldItem<T>) => {
    switch (item.type) {
      case "dropdown-select":
        return renderDropdownSelectItem(form, item, updateItem);
      case "date-picker":
        return renderDatePickerItem(form, item, updateItem);
      case "custom":
        let onChange = (value: any) => {
          updateItem(value, item);
        };
        return item.render(form[item.name], onChange, form);
      default:
        return <div>Unknown type: {(item as any).type}</div>;
    }
  };

  let renderItems = (items: IFilterFieldItem<T>[], itemWidth?: ReactText, prefixKey?: string) => {
    return items.map((item, index) => {
      const key = createItemKey(item.type, index, (item as any).name, prefixKey);

      if (item.shouldHide != null && item.shouldHide(form)) {
        return null;
      }

      let styleObj: CSSProperties = itemWidth == null ? undefined : { width: itemWidth };

      return (
        <div key={key} className={cx(row, styleItemRow)} style={styleObj}>
          <div className={cx(styleLabel, props.labelClassName)}>{item.label}:</div>
          <div className={cx(expand, styleValueArea, item.valueClassName, item.className)} style={item.style}>
            {renderValueItem(item)}
          </div>
        </div>
      );
    });
  };

  let ui = <div className={cx(row, flexWrap, styleItemsContainer, props.className)}>{renderItems(props.items)}</div>;

  return { ui, formData: form, updateForm };
}

export { useFilterForm, IFilterFieldItem };

let createItemKey = (type: string, index: number, extra?: string, prefix?: string) => {
  return `${prefix || ""}${type}-${extra || ""}${index}`;
};

let styleItemsContainer = css`
  overflow: auto;
  padding: 16px 12px 0 12px;
  background: #f7f7f7;
  border-radius: 2px;
`;

let styleValueArea = css`
  min-width: 220px;
  width: 220px;
  overflow: auto;
`;

let styleLabel = css`
  color: #6f6f6f;
  font-weight: 400;
  min-width: 92px;
  width: max-content;
  text-align: right;
  margin-right: 8px;
`;

let styleItemRow = css`
  min-width: 33%;
  line-height: 32px;
  margin-bottom: 16px;
  font-size: 14px;
  padding: 0 8px;
`;
