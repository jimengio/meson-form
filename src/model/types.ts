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

export interface IMesonInputField<T, K extends keyof T = keyof T> extends IMesonFieldBaseProps<T> {
  name: K;
  type: "input";
  /** real type property on <input/> */
  inputType?: string;
  inputProps?: InputProps;
  placeholder?: string;
  /** false by default, "" and " " will emit value `undefined` */
  useBlank?: boolean;
  onChange?: (x: T[K], modifyFormObject?: FuncMesonModifyForm<T>) => void;
  validateMethods?: (EMesonValidate | FuncMesonValidator<T>)[];
  validator?: FuncMesonValidator<T>;
  /** validate immediately after content change,
   * by default validation performs after each blur event
   */
  checkOnChange?: boolean;
  /** add styles to container of value, which is inside each field and around the value */
  valueContainerClassName?: string;
}

export interface IMesonTexareaField<T, K extends keyof T = keyof T> extends IMesonFieldBaseProps<T> {
  name: K;
  type: "textarea";
  textareaProps?: TextAreaProps;
  placeholder?: string;
  /** false by default, "" and " " will emit value `undefined` */
  useBlank?: boolean;
  onChange?: (x: T[K], modifyFormObject?: FuncMesonModifyForm<T>) => void;
  validateMethods?: (EMesonValidate | FuncMesonValidator<T>)[];
  validator?: FuncMesonValidator<T>;
  /** validate immediately after content change,
   * by default validation performs after each blur event
   */
  enableCounter?: boolean;
  checkOnChange?: boolean;
  /** add styles to container of value, which is inside each field and around the value */
  valueContainerClassName?: string;
}

export interface IMesonNumberField<T, K extends keyof T = keyof T> extends IMesonFieldBaseProps<T> {
  name: K;
  type: "number";
  placeholder?: string;
  onChange?: (x: T[K], modifyFormObject?: FuncMesonModifyForm<T>) => void;
  validateMethods?: (EMesonValidate | FuncMesonValidator<T>)[];
  validator?: FuncMesonValidator<T>;
  min?: number;
  max?: number;
  inputProps?: InputNumberProps;
  valueContainerClassName?: string;
}

export interface IMesonDatePickerField<T, K extends keyof T = keyof T> extends IMesonFieldBaseProps<T> {
  name: K;
  type: "date-picker";
  placeholder?: string;
  allowClear?: boolean;
  disabled?: boolean;
  /** 组件选中的值, 设置到 form object 之前如果需要进行转换 */
  transformSelectedValue?: (clonedDateObj: Moment, dateString: string) => string;
  onChange?: (x: T[K], modifyFormObject?: FuncMesonModifyForm<T>) => void;
  validateMethods?: (EMesonValidate | FuncMesonValidator<T>)[];
  validator?: FuncMesonValidator<T>;
  datePickerProps?: DatePickerProps;
  valueContainerClassName?: string;
}

export interface IMesonTreeSelectField<T, K extends keyof T = keyof T> extends IMesonFieldBaseProps<T> {
  name: K;
  type: "tree-select";
  placeholder?: string;
  allowClear?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  onChange?: (x: T[K], modifyFormObject?: FuncMesonModifyForm<T>) => void;
  validateMethods?: (EMesonValidate | FuncMesonValidator<T>)[];
  validator?: FuncMesonValidator<T>;
  treeSelectProps?: TreeSelectProps<TreeNodeValue>;
  valueContainerClassName?: string;
}

export interface IMesonSwitchField<T, K extends keyof T = keyof T> extends IMesonFieldBaseProps<T> {
  name: K;
  type: "switch";
  onChange?: (x: T[K], modifyFormObject?: FuncMesonModifyForm<T>) => void;
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

export interface IMesonSelectField<T, K extends keyof T = keyof T> extends IMesonFieldBaseProps<T> {
  name: K;
  type: "select";
  placeholder?: string;
  options: IMesonSelectItem[];
  onChange?: (x: T[K], modifyFormObject?: FuncMesonModifyForm<T>) => void;
  validateMethods?: (EMesonValidate | FuncMesonValidator<T>)[];
  validator?: FuncMesonValidator<T>;
  translateNonStringvalue?: boolean;
  allowClear?: boolean;
  selectProps?: SelectProps;
  valueContainerClassName?: string;
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

export interface IMesonDropdownSelectField<T, K extends keyof T = keyof T> extends IMesonFieldBaseProps<T> {
  name: K;
  type: "dropdown-select";
  options: IMesonSelectItem[];
  placeholder?: string;
  onChange?: (x: T[K], modifyFormObject?: FuncMesonModifyForm<T>) => void;
  validateMethods?: (EMesonValidate | FuncMesonValidator<T>)[];
  validator?: FuncMesonValidator<T>;
  translateNonStringvalue?: boolean;
  allowClear?: boolean;
  selectProps?: IDropdownSelectProps;
  valueContainerClassName?: string;
}

export interface IMesonCustomField<T, K extends keyof T = keyof T> extends IMesonFieldBaseProps<T> {
  name: K;
  type: "custom";
  /** parent container is using column,
   * for antd inputs with default with 100%, you need to take care of that by yourself
   * @param current value in this field
   * @param onChange update value in this field
   * @param form the form
   * @param onCheck pass in latest value and it will be validated based on rules. mostly called after blurred or selected.
   */
  render: (value: T[K], onChange: (x: T[K]) => void, form: T, onCheck: (x: T[K]) => void) => ReactNode;
  onChange?: (x: T[K], modifyFormObject?: FuncMesonModifyForm<T>) => void;
  validateMethods?: (EMesonValidate | FuncMesonValidator<T>)[];
  validator?: FuncMesonValidator<T>;
}

export interface IMesonCustomMultipleField<T, K1 extends keyof T = keyof T, K2 extends keyof T = keyof T> extends IMesonFieldBaseProps<T> {
  type: "custom-multiple";
  /** multiple fields to edit and to check
   * @param modifyForm accepts a function to modify the form
   * @param checkForm accepts an object of new values
   */
  names: [K1, K2];
  /** get form and render into form item */
  renderMultiple: (form: T, modifyForm: FuncMesonModifyForm<T>, checkForm: (changedValues: Partial<T>) => void) => ReactNode;
  /** get form and return errors of related fields in object */
  validateMultiple?: (form: T, item: IMesonCustomMultipleField<T, K1, K2>) => IMesonErrors<T>;
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

export interface IMesonRadioField<T, K extends keyof T = keyof T> extends IMesonFieldBaseProps<T> {
  type: "radio";
  name: K;
  label: string;
  options: IMesonRadioItem[];
  onChange?: (x: T[K], modifyFormObject?: FuncMesonModifyForm<T>) => void;
  validateMethods?: (EMesonValidate | FuncMesonValidator<T>)[];
  validator?: FuncMesonValidator<T>;
  valueContainerClassName?: string;
}

// 默认any过渡
export type IMesonFieldItemHasValue<T = IMesonFormBase, K extends keyof T = keyof T> =
  | IMesonInputField<T, K>
  | IMesonTexareaField<T, K>
  | IMesonNumberField<T, K>
  | IMesonSelectField<T, K>
  | IMesonDropdownSelectField<T, K>
  | IMesonCustomField<T, K>
  | IMesonRadioField<T, K>
  | IMesonDatePickerField<T, K>
  | IMesonTreeSelectField<T, K>
  | IMesonSwitchField<T, K>;

// 默认any过渡
export type IMesonFieldItem<T = IMesonFormBase, K extends keyof T = keyof T, K2 extends keyof T = keyof T> =
  | IMesonInputField<T, K>
  | IMesonTexareaField<T, K>
  | IMesonNumberField<T, K>
  | IMesonSelectField<T, K>
  | IMesonDropdownSelectField<T, K>
  | IMesonCustomField<T, K>
  | IMesonDecorativeField<T>
  | IMesonSwitchField<T>
  | IMesonNestedFields<T>
  | IMesonGroupFields<T>
  | IMesonRadioField<T, K>
  | IMesonDatePickerField<T, K>
  | IMesonTreeSelectField<T, K>
  | IMesonCustomMultipleField<T, K, K2>;
