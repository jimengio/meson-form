import { ReactNode, ReactText } from "react";
import { InputProps, TextAreaProps } from "antd/lib/input";
import { InputNumberProps } from "antd/lib/input-number";
import { DatePickerProps } from "antd/lib/date-picker/interface";
import { SelectProps } from "antd/lib/select";
import { TreeSelectProps, TreeNodeValue } from "antd/lib/tree-select/interface";
import { Draft } from "immer";
import { Moment } from "moment";

export interface ISimpleObject<T = any> {
  [k: string]: T;
}

export type IMesonErrors<T> = { [K in keyof T]?: string };
export type IMesonFormBase = { [k: string]: any };

export enum EMesonValidate {
  Number = "number",
  String = "string",
  Boolean = "boolean",
}

export type FuncMesonValidator<T> = (x: any, item?: IMesonFieldItemHasValue<T>, formValue?: T) => string;

/** expose a function to modify form values directly, FR-97
 * Caution, it does not trigger field validation! So don't use it to mofidy fields before current one.
 */
export type FuncMesonModifyForm<T = any> = (modifter: (form: Draft<T>) => void) => void;

export enum EMesonFieldType {
  Input = "input",
  Textarea = "textarea",
  Number = "number",
  Select = "select",
  Custom = "custom",
  CustomMultiple = "custom-multiple",
  Decorative = "decorative",
  Nested = "nested",
  Switch = "switch",
  Radio = "radio",
  DatePicker = "date-picker",
  TreeSelect = "tree-select",
  // like React fragment
  Group = "group",
}

export interface IMesonFieldBaseProps<T> {
  label?: string;
  required?: boolean;
  shouldHide?: (form: T) => boolean;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  hideLabel?: boolean;
  fullWidth?: boolean;
}

export interface IMesonDecorativeField<T> {
  type: "decorative";
  render: (form: T) => ReactNode;
  className?: string;
  style?: React.CSSProperties;
  shouldHide?: (form: T) => boolean;
}

export interface IMesonInputField<T> extends IMesonFieldBaseProps<T> {
  name: string;
  type: "input";
  /** real type property on <input/> */
  inputType?: string;
  inputProps?: InputProps;
  placeholder?: string;
  /** false by default, "" and " " will emit value `undefined` */
  useBlank?: boolean;
  onChange?: (x: any, modifyFormObject?: FuncMesonModifyForm<T>) => void;
  validateMethods?: (EMesonValidate | FuncMesonValidator<T>)[];
  validator?: FuncMesonValidator<T>;
  /** validate immediately after content change,
   * by default validation performs after each blur event
   */
  checkOnChange?: boolean;
  /** add styles to container of value, which is inside each field and around the value */
  valueContainerClassName?: string;
}

export interface IMesonTexareaField<T> extends IMesonFieldBaseProps<T> {
  name: string;
  type: "textarea";
  textareaProps?: TextAreaProps;
  placeholder?: string;
  /** false by default, "" and " " will emit value `undefined` */
  useBlank?: boolean;
  onChange?: (x: any, modifyFormObject?: FuncMesonModifyForm<T>) => void;
  validateMethods?: (EMesonValidate | FuncMesonValidator<T>)[];
  validator?: FuncMesonValidator<T>;
  /** validate immediately after content change,
   * by default validation performs after each blur event
   */
  checkOnChange?: boolean;
  /** add styles to container of value, which is inside each field and around the value */
  valueContainerClassName?: string;
}

export interface IMesonNumberField<T> extends IMesonFieldBaseProps<T> {
  name: string;
  type: "number";
  placeholder?: string;
  onChange?: (x: any, modifyFormObject?: FuncMesonModifyForm<T>) => void;
  validateMethods?: (EMesonValidate | FuncMesonValidator<T>)[];
  validator?: FuncMesonValidator<T>;
  min?: number;
  max?: number;
  inputProps?: InputNumberProps;
  valueContainerClassName?: string;
}

export interface IMesonDatePickerField<T> extends IMesonFieldBaseProps<T> {
  name: string;
  type: "date-picker";
  placeholder?: string;
  allowClear?: boolean;
  disabled?: boolean;
  /** 组件选中的值, 设置到 form object 之前如果需要进行转换 */
  transformSelectedValue?: (clonedDateObj: Moment, dateString: string) => string;
  onChange?: (x: any, modifyFormObject?: FuncMesonModifyForm<T>) => void;
  validateMethods?: (EMesonValidate | FuncMesonValidator<T>)[];
  validator?: FuncMesonValidator<T>;
  datePickerProps?: DatePickerProps;
  valueContainerClassName?: string;
}

export interface IMesonTreeSelectField<T> extends IMesonFieldBaseProps<T> {
  name: string;
  type: "tree-select";
  placeholder?: string;
  allowClear?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  onChange?: (x: any, modifyFormObject?: FuncMesonModifyForm<T>) => void;
  validateMethods?: (EMesonValidate | FuncMesonValidator<T>)[];
  validator?: FuncMesonValidator<T>;
  treeSelectProps?: TreeSelectProps<TreeNodeValue>;
  valueContainerClassName?: string;
}

export interface IMesonSwitchField<T> extends IMesonFieldBaseProps<T> {
  name: string;
  type: "switch";
  onChange?: (x: any, modifyFormObject?: FuncMesonModifyForm<T>) => void;
  validateMethods?: (EMesonValidate | FuncMesonValidator<T>)[];
  validator?: FuncMesonValidator<T>;
  valueContainerClassName?: string;
}

export interface IMesonSelectItem {
  value: any;
  key?: string;
  display?: string;
}

export interface IMesonRadioItem {
  value: any;
  key?: string;
  display?: string;
  disabled?: boolean;
}

export interface IMesonSelectField<T> extends IMesonFieldBaseProps<T> {
  name: string;
  type: "select";
  placeholder?: string;
  options: IMesonSelectItem[];
  onChange?: (x: any, modifyFormObject?: FuncMesonModifyForm<T>) => void;
  validateMethods?: (EMesonValidate | FuncMesonValidator<T>)[];
  validator?: FuncMesonValidator<T>;
  translateNonStringvalue?: boolean;
  allowClear?: boolean;
  selectProps?: SelectProps;
  valueContainerClassName?: string;
}

export interface IMesonCustomField<T> extends IMesonFieldBaseProps<T> {
  name: string;
  type: "custom";
  /** parent container is using column,
   * for antd inputs with default with 100%, you need to take care of that by yourself
   * @param current value in this field
   * @param onChange update value in this field
   * @param form the form
   * @param onCheck pass in latest value and it will be validated based on rules. mostly called after blurred or selected.
   */
  render: (value: any, onChange: (x: any) => void, form: T, onCheck: (x: any) => void) => ReactNode;
  onChange?: (x: any, modifyFormObject?: FuncMesonModifyForm<T>) => void;
  validateMethods?: (EMesonValidate | FuncMesonValidator<T>)[];
  validator?: FuncMesonValidator<T>;
}

export interface IMesonCustomMultipleField<T> extends IMesonFieldBaseProps<T> {
  type: "custom-multiple";
  /** multiple fields to edit and to check
   * @param modifyForm accepts a function to modify the form
   * @param checkForm accepts an object of new values
   */
  names: (keyof T)[];
  /** get form and render into form item */
  renderMultiple: (form: T, modifyForm: FuncMesonModifyForm<T>, checkForm: (changedValues: Partial<T>) => void) => ReactNode;
  /** get form and return errors of related fields in object */
  validateMultiple?: (form: T, item: IMesonCustomMultipleField<T>) => IMesonErrors<T>;
}

export interface IMesonNestedFields<T> extends IMesonFieldBaseProps<T> {
  type: "nested";
  children: IMesonFieldItem<T>[];
}

export interface IMesonGroupFields<T> {
  type: "group";
  children: IMesonFieldItem<T>[];
  shouldHide?: (form: T) => boolean;
  /**
   * Group(flexWrap) 内元素水平布局
   */
  horizontal?: boolean;
  /**
   * 单个 Item 所占宽度
   */
  itemWidth?: ReactText;
}

export interface IMesonRadioField<T> extends IMesonFieldBaseProps<T> {
  type: "radio";
  name: string;
  label: string;
  options: IMesonRadioItem[];
  onChange?: (x: any, modifyFormObject?: FuncMesonModifyForm<T>) => void;
  validateMethods?: (EMesonValidate | FuncMesonValidator<T>)[];
  validator?: FuncMesonValidator<T>;
  valueContainerClassName?: string;
}

// 默认any过渡
export type IMesonFieldItemHasValue<T = any> =
  | IMesonInputField<T>
  | IMesonTexareaField<T>
  | IMesonNumberField<T>
  | IMesonSelectField<T>
  | IMesonCustomField<T>
  | IMesonRadioField<T>
  | IMesonDatePickerField<T>
  | IMesonTreeSelectField<T>
  | IMesonSwitchField<T>;

// 默认any过渡
export type IMesonFieldItem<T = any> =
  | IMesonInputField<T>
  | IMesonTexareaField<T>
  | IMesonNumberField<T>
  | IMesonSelectField<T>
  | IMesonCustomField<T>
  | IMesonDecorativeField<T>
  | IMesonSwitchField<T>
  | IMesonNestedFields<T>
  | IMesonGroupFields<T>
  | IMesonRadioField<T>
  | IMesonDatePickerField<T>
  | IMesonTreeSelectField<T>
  | IMesonCustomMultipleField<T>;
