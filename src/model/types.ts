import { ReactNode, ReactText, CSSProperties } from "react";
import { InputProps, TextAreaProps } from "antd/lib/input";
import { InputNumberProps } from "antd/lib/input-number";
import { SelectProps } from "antd/lib/select";

import { IDropdownTreeProps } from "@jimengio/dropdown";
import { Draft } from "immer";
import { Moment } from "moment";
import { TreeSelectProps } from "antd/lib/tree-select";
import { DefaultValueType } from "rc-tree-select/lib/interface";
import { DatePickerProps } from "antd/lib/date-picker";
import { RuledRuleEntry } from "@jimengio/ruled-validator";

export type FieldValues = Record<string, any>;
export type IMesonFormBase = FieldValues;
export type FieldName<F extends FieldValues> = keyof F & string;
export type IMesonErrors<T> = Partial<Record<FieldName<T>, string>>;

export type FuncMesonValidator<T> = (x: any, item?: IMesonFieldItemHasValue<T>, formValue?: T) => string;
export type FuncMesonAsyncValidator<T> = (x: any, item?: IMesonFieldItemHasValue<T>, formValue?: T) => Promise<string>;

/** expose a function to modify form values directly, FR-97
 * Caution, it does not trigger field validation! So don't use it to mofidy fields before current one.
 */
export type FuncMesonModifyForm<T = any> = (modifter: (form: Draft<T>) => void) => void;

export type FuncMesonModifyErrors<T = any> = (modifter: (messages: Draft<IMesonErrors<T>>) => void) => void;

export enum EMesonFieldType {
  Input = "input",
  Textarea = "textarea",
  Number = "number",
  Select = "select",
  DropdownSelect = "dropdown-select",
  Custom = "custom",
  CustomMultiple = "custom-multiple",
  Decorative = "decorative",
  Nested = "nested",
  Switch = "switch",
  Radio = "radio",
  DatePicker = "date-picker",
  TreeSelect = "tree-select",
  DropdownTree = "dropdown-tree",
  // like React fragment
  Group = "group",
}

export interface IMesonFieldBaseProps<T> {
  label?: string;
  required?: boolean;
  shouldHide?: (form: T) => boolean;
  onlyShow?: (form: T) => boolean;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  hideLabel?: boolean;
  fullWidth?: boolean;
}

export interface IMesonDecorativeField<T extends FieldValues> {
  type: "decorative";
  render: (form: T) => ReactNode;
  className?: string;
  style?: React.CSSProperties;
  shouldHide?: (form: T) => boolean;
  onlyShow?: (form: T) => boolean;
}

export interface IMesonInputField<T extends FieldValues, K extends FieldName<T> = FieldName<T>> extends IMesonFieldBaseProps<T> {
  name: K;
  type: "input";
  /** real type property on <input/> */
  inputType?: string;
  inputProps?: InputProps;
  placeholder?: string;
  /** false by default, "" and " " will emit value `undefined` */
  useBlank?: boolean;
  onChange?: (x: any, modifyFormObject?: FuncMesonModifyForm<T>, internals?: IChangeInternals<T>) => void;
  validateRules?: RuledRuleEntry;
  /** validate immediately after content change,
   * by default validation performs after each blur event
   */
  validator?: FuncMesonValidator<T>;
  /** async validation, it only works during single item check, and it's inactive during submit */
  asyncValidator?: FuncMesonAsyncValidator<T>;
  checkOnChange?: boolean;
  /** add styles to container of value, which is inside each field and around the value */
  valueContainerClassName?: string;
  /** append icon/text after input box as suffix,
   * since antd input use width:100%, a suffix node is actually placed out of base box
   */
  suffixNode?: ReactNode;
}

export interface IMesonTexareaField<T extends FieldValues, K extends FieldName<T> = FieldName<T>> extends IMesonFieldBaseProps<T> {
  name: K;
  type: "textarea";
  textareaProps?: TextAreaProps;
  placeholder?: string;
  /** false by default, "" and " " will emit value `undefined` */
  useBlank?: boolean;
  onChange?: (x: any, modifyFormObject?: FuncMesonModifyForm<T>, internals?: IChangeInternals<T>) => void;
  validateRules?: RuledRuleEntry;
  /** validate immediately after content change,
   * by default validation performs after each blur event
   */
  validator?: FuncMesonValidator<T>;
  /** async validation, it only works during single item check, and it's inactive during submit */
  asyncValidator?: FuncMesonAsyncValidator<T>;
  enableCounter?: boolean;
  checkOnChange?: boolean;
  /** add styles to container of value, which is inside each field and around the value */
  valueContainerClassName?: string;
}

export interface IMesonNumberField<T extends FieldValues, K extends FieldName<T> = FieldName<T>> extends IMesonFieldBaseProps<T> {
  name: K;
  type: "number";
  placeholder?: string;
  onChange?: (x: any, modifyFormObject?: FuncMesonModifyForm<T>, internals?: IChangeInternals<T>) => void;
  validateRules?: RuledRuleEntry;
  /** append icon/text after input box as suffix,
   * since antd input use width:100%, a suffix node is actually placed out of base box
   */
  validator?: FuncMesonValidator<T>;
  /** async validation, it only works during single item check, and it's inactive during submit */
  asyncValidator?: FuncMesonAsyncValidator<T>;
  min?: number;
  max?: number;
  inputProps?: InputNumberProps;
  valueContainerClassName?: string;
  suffixNode?: ReactNode;
}

export interface IMesonDatePickerField<T extends FieldValues, K extends FieldName<T> = FieldName<T>> extends IMesonFieldBaseProps<T> {
  name: K;
  type: "date-picker";
  placeholder?: string;
  allowClear?: boolean;
  disabled?: boolean;
  /** 组件选中的值, 设置到 form object 之前如果需要进行转换 */
  transformSelectedValue?: (clonedDateObj: Moment, dateString: string) => string;
  onChange?: (x: any, modifyFormObject?: FuncMesonModifyForm<T>, internals?: IChangeInternals<T>) => void;
  validateRules?: RuledRuleEntry;
  validator?: FuncMesonValidator<T>;
  /** async validation, it only works during single item check, and it's inactive during submit */
  asyncValidator?: FuncMesonAsyncValidator<T>;
  datePickerProps?: DatePickerProps;
  valueContainerClassName?: string;
}

export interface IMesonTreeSelectField<T extends FieldValues, K extends FieldName<T> = FieldName<T>> extends IMesonFieldBaseProps<T> {
  name: K;
  type: "tree-select";
  placeholder?: string;
  allowClear?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  onChange?: (x: any, modifyFormObject?: FuncMesonModifyForm<T>, internals?: IChangeInternals<T>) => void;
  validateRules?: RuledRuleEntry;
  validator?: FuncMesonValidator<T>;
  /** async validation, it only works during single item check, and it's inactive during submit */
  asyncValidator?: FuncMesonAsyncValidator<T>;
  treeSelectProps?: TreeSelectProps<DefaultValueType>;
  valueContainerClassName?: string;
}

export interface IFormDropdownTreeProps {
  className?: string;
  menuClassName?: string;
  cardClassName?: string;
  itemClassName?: string;
  placeholder?: string;
  emptyLocale?: string;
  placeholderClassName?: string;
  menuWidth?: number;
  style?: CSSProperties;
  disabled?: boolean;
  allowClear?: boolean;
  renderValue?: (x: any) => ReactNode;
  followWheel?: boolean;
}

export interface IMesonDropdownTreeField<T extends FieldValues, K extends FieldName<T> = FieldName<T>> extends IMesonFieldBaseProps<T> {
  name: K;
  type: "dropdown-tree";
  placeholder?: string;
  allowClear?: boolean;
  disabled?: boolean;
  options?: IDropdownTreeProps["items"];
  onChange?: (x: any, modifyFormObject?: FuncMesonModifyForm<T>, internals?: IChangeInternals<T>) => void;
  validateRules?: RuledRuleEntry;
  validator?: FuncMesonValidator<T>;
  /** async validation, it only works during single item check, and it's inactive during submit */
  asyncValidator?: FuncMesonAsyncValidator<T>;
  treeSelectProps?: IFormDropdownTreeProps;
  valueContainerClassName?: string;
}

export interface IMesonSwitchField<T extends FieldValues, K extends FieldName<T> = FieldName<T>> extends IMesonFieldBaseProps<T> {
  name: K;
  type: "switch";
  onChange?: (x: any, modifyFormObject?: FuncMesonModifyForm<T>, internals?: IChangeInternals<T>) => void;
  validateRules?: RuledRuleEntry;
  validator?: FuncMesonValidator<T>;
  /** async validation, it only works during single item check, and it's inactive during submit */
  asyncValidator?: FuncMesonAsyncValidator<T>;
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

export interface IMesonSelectField<T extends FieldValues, K extends FieldName<T> = FieldName<T>> extends IMesonFieldBaseProps<T> {
  name: K;
  type: "select";
  placeholder?: string;
  options: IMesonSelectItem[];
  onChange?: (x: any, modifyFormObject?: FuncMesonModifyForm<T>, internals?: IChangeInternals<T>) => void;
  validateRules?: RuledRuleEntry;
  validator?: FuncMesonValidator<T>;
  /** async validation, it only works during single item check, and it's inactive during submit */
  asyncValidator?: FuncMesonAsyncValidator<T>;
  translateNonStringvalue?: boolean;
  allowClear?: boolean;
  selectProps?: SelectProps<DefaultValueType>;
  valueContainerClassName?: string;
}

// TODO, reuse props from dropdown package
export interface IFormDropdownSelectProps {
  className?: string;
  menuClassName?: string;
  itemClassName?: string;
  emptyLocale?: string;
  placeholderClassName?: string;
  menuWidth?: number;
  disabled?: boolean;
  renderValue?: (x: any) => ReactNode;
  followWheel?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
}

export interface IMesonDropdownSelectField<T extends FieldValues, K extends FieldName<T> = FieldName<T>> extends IMesonFieldBaseProps<T> {
  name: K;
  type: "dropdown-select";
  options: IMesonSelectItem[];
  placeholder?: string;
  onChange?: (x: any, modifyFormObject?: FuncMesonModifyForm<T>, internals?: IChangeInternals<T>) => void;
  validateRules?: RuledRuleEntry;
  validator?: FuncMesonValidator<T>;
  /** async validation, it only works during single item check, and it's inactive during submit */
  asyncValidator?: FuncMesonAsyncValidator<T>;
  translateNonStringvalue?: boolean;
  allowClear?: boolean;
  selectProps?: IFormDropdownSelectProps;
  valueContainerClassName?: string;
}

export interface IMesonCustomField<T extends FieldValues, K extends FieldName<T> = FieldName<T>> extends IMesonFieldBaseProps<T> {
  name: K;
  type: "custom";
  /** parent container is using column,
   * for antd inputs with default with 100%, you need to take care of that by yourself
   * @param current value in this field
   * @param onChange update value in this field
   * @param form the form
   * @param onCheck pass in latest value and it will be validated based on rules. mostly called after blurred or selected.
   */
  render: (value: any, onChange: (x: any) => void, form: T, onCheck: (x: any) => void) => ReactNode;
  onChange?: (x: any, modifyFormObject?: FuncMesonModifyForm<T>, internals?: IChangeInternals<T>) => void;
  validateRules?: RuledRuleEntry;
  validator?: FuncMesonValidator<T>;
  /** async validation, it only works during single item check, and it's inactive during submit */
  asyncValidator?: FuncMesonAsyncValidator<T>;
}

export interface IMesonRegisteredField<T extends FieldValues, K extends FieldName<T> = FieldName<T>> extends IMesonFieldBaseProps<T> {
  name: K;
  type: "registered";
  /** parent container is using column,
   * for antd inputs with default with 100%, you need to take care of that by yourself
   * @param current value in this field
   * @param onChange update value in this field
   * @param form the form
   * @param onCheck pass in latest value and it will be validated based on rules. mostly called after blurred or selected.
   */
  onChange?: (x: any, modifyFormObject?: FuncMesonModifyForm<T>, internals?: IChangeInternals<T>) => void;
  validateRules?: RuledRuleEntry;
  validator?: FuncMesonValidator<T>;
  /** async validation, it only works during single item check, and it's inactive during submit */
  asyncValidator?: FuncMesonAsyncValidator<T>;
  /** choose a globally registered renderer */
  renderType: string;
  renderOptions?: object;
}

export interface IMesonCustomMultipleField<T extends FieldValues, K1 extends FieldName<T> = FieldName<T>> extends IMesonFieldBaseProps<T> {
  type: "custom-multiple";
  /** multiple fields to edit and to check
   * @param modifyForm accepts a function to modify the form
   * @param checkForm accepts an object of new values
   */
  names: K1[];
  /** get form and render into form item */
  renderMultiple: (form: T, modifyForm: FuncMesonModifyForm<T>, checkForm: (changedValues: Partial<T>) => void) => ReactNode;
  /** get form and return errors of related fields in object */
  validateMultiple?: (form: T, item: IMesonCustomMultipleField<T, K1>) => IMesonErrors<T>;
  asyncValidateMultiple?: (form: T, item: IMesonCustomMultipleField<T, K1>) => Promise<IMesonErrors<T>>;
}

export interface IMesonNestedFields<T> extends IMesonFieldBaseProps<T> {
  type: "nested";
  children: IMesonFieldItem<T>[];
}

export interface IMesonGroupFields<T> {
  type: "group";
  children: IMesonFieldItem<T>[];
  shouldHide?: (form: T) => boolean;
  onlyShow?: (form: T) => boolean;
  /**
   * Group(flexWrap) 内元素水平布局
   */
  horizontal?: boolean;
  /**
   * 单个 Item 所占宽度
   */
  itemWidth?: ReactText;
  className?: string;
}

type IChangeInternals<T> = {
  formData: T;
  updateForm: FuncMesonModifyForm<T>;
  updateErrors: FuncMesonModifyErrors<T>;
};

export interface IMesonRadioField<T extends FieldValues, K extends FieldName<T> = FieldName<T>> extends IMesonFieldBaseProps<T> {
  type: "radio";
  name: K;
  label: string;
  options: IMesonRadioItem[];
  onChange?: (x: any, modifyFormObject?: FuncMesonModifyForm<T>, internals?: IChangeInternals<T>) => void;
  validateRules?: RuledRuleEntry;
  validator?: FuncMesonValidator<T>;
  /** async validation, it only works during single item check, and it's inactive during submit */
  asyncValidator?: FuncMesonAsyncValidator<T>;
  valueContainerClassName?: string;
}

// 默认any过渡
export type IMesonFieldItemHasValue<T extends FieldValues = FieldValues, K extends FieldName<T> = FieldName<T>> =
  | IMesonInputField<T, K>
  | IMesonTexareaField<T, K>
  | IMesonNumberField<T, K>
  | IMesonSelectField<T, K>
  | IMesonDropdownSelectField<T, K>
  | IMesonCustomField<T, K>
  | IMesonRadioField<T, K>
  | IMesonDatePickerField<T, K>
  | IMesonTreeSelectField<T, K>
  | IMesonDropdownTreeField<T, K>
  | IMesonRegisteredField<T, K>
  | IMesonSwitchField<T, K>;

// 默认any过渡
export type IMesonFieldItem<T extends FieldValues = FieldValues, K extends FieldName<T> = FieldName<T>, K2 extends FieldName<T> = FieldName<T>> =
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
  | IMesonDropdownTreeField<T, K>
  | IMesonRegisteredField<T, K>
  | IMesonCustomMultipleField<T, K>;
