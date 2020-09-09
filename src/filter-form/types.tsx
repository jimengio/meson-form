import { ReactNode, ReactText } from "react";

import { Moment } from "moment";
import { DatePickerProps } from "antd/lib/date-picker";
import { SelectProps } from "antd/lib/select";
import { DefaultValueType } from "rc-tree-select/lib/interface";

export interface IFilterFieldBaseProps<T> {
  label?: string;
  shouldHide?: (form: T) => boolean;
  onlyShow?: (form: T) => boolean;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface IFilterSelectItem {
  value: any;
  key?: string;
  display?: string;
}

export interface IDropdownSelectProps {
  value?: string | number;
  className?: string;
  menuClassName?: string;
  itemClassName?: string;
  emptyLocale?: string;
  placeholderClassName?: string;
  menuWidth?: number;
  disabled?: boolean;
  renderValue?: (x: any) => ReactNode;
  followWheel?: boolean;
}

export interface IFilterDropdownSelectField<T, K extends keyof T = keyof T> extends IFilterFieldBaseProps<T> {
  name: K;
  type: "dropdown-select";
  options: IFilterSelectItem[];
  placeholder?: string;
  allowClear?: boolean;
  selectProps?: IDropdownSelectProps;
  translateNonStringvalue?: boolean;
  valueClassName?: string;
}

export interface IFilterSelectField<T, K extends keyof T = keyof T> extends IFilterFieldBaseProps<T> {
  name: K;
  type: "select";
  options: IFilterSelectItem[];
  placeholder?: string;
  allowClear?: boolean;
  selectProps?: SelectProps<DefaultValueType>;
  translateNonStringvalue?: boolean;
  valueClassName?: string;
}

export interface IFilterDatePickerField<T, K extends keyof T = keyof T> extends IFilterFieldBaseProps<T> {
  name: K;
  type: "date-picker";
  placeholder?: string;
  allowClear?: boolean;
  disabled?: boolean;
  /** 组件选中的值, 设置到 form object 之前如果需要进行转换 */
  transformSelectedValue?: (clonedDateObj: Moment, dateString: string) => string;
  datePickerProps?: DatePickerProps;
  valueClassName?: string;
}

export interface IFilterCustomField<T, K extends keyof T = keyof T> extends IFilterFieldBaseProps<T> {
  name: K;
  type: "custom";
  /** parent container is using column,
   * for antd inputs with default with 100%, you need to take care of that by yourself
   * @param current value in this field
   * @param onChange update value in this field
   * @param form the form
   */
  render: (value: any, onChange: (x: any) => void, form: T) => ReactNode;
  valueClassName?: string;
}

export type IFilterFieldItem<T = any> = IFilterDropdownSelectField<T> | IFilterSelectField<T> | IFilterDatePickerField<T> | IFilterCustomField<T>;

export type FuncUpdateItem<T> = (x: any, item: IFilterFieldItem<T>) => void;
