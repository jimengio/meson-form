import { ReactNode } from "react";
import { InputProps } from "antd/lib/input";
import { SelectProps } from "antd/lib/select";
import { Draft } from "immer";

export interface ISimpleObject<T = any> {
  [k: string]: T;
}

export type IMesonErrors<T = any> = { [K in keyof T]: string };
export type IMesonFormBase = { [k: string]: any };

export enum EMesonValidate {
  Number = "number",
  String = "string",
  Boolean = "boolean",
}

export type FuncMesonValidator<T> = (x: any, item?: IMesonFieldItemHasValue<T>) => string;

/** expose a function to modify form values directly, FR-97
 * Caution, it does not trigger field validation! So don't use it to mofidy fields before current one.
 */
export type FuncMesonModifyForm<T = any> = (modifter: (form: Draft<T>) => void) => void;

export enum EMesonFieldType {
  Input = "input",
  Number = "number",
  Select = "select",
  Custom = "custom",
  CustomMultiple = "custom-multiple",
  Nested = "nested",
  Switch = "switch",
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
}

export interface IMesonInputField<T> extends IMesonFieldBaseProps<T> {
  name: string;
  type: EMesonFieldType.Input;
  /** real type property on <input/> */
  inputType?: string;
  /** other props for input and textarea, actially need TextareaProps */
  inputProps?: InputProps;
  placeholder?: string;
  /** false by default, "" and " " will emit value `undefined` */
  useBlank?: boolean;
  onChange?: (x: any, modifyFormObject?: FuncMesonModifyForm<T>) => void;
  textarea?: boolean;
  validateMethods?: (EMesonValidate | FuncMesonValidator<T>)[];
  validator?: FuncMesonValidator<T>;
}

export interface IMesonNumberField<T> extends IMesonFieldBaseProps<T> {
  name: string;
  type: EMesonFieldType.Number;
  placeholder?: string;
  onChange?: (x: any, modifyFormObject?: FuncMesonModifyForm<T>) => void;
  validateMethods?: (EMesonValidate | FuncMesonValidator<T>)[];
  validator?: FuncMesonValidator<T>;
  min?: number;
  max?: number;
}

export interface IMesonSwitchField<T> extends IMesonFieldBaseProps<T> {
  name: string;
  type: EMesonFieldType.Switch;
  onChange?: (x: any, modifyFormObject?: FuncMesonModifyForm<T>) => void;
  validateMethods?: (EMesonValidate | FuncMesonValidator<T>)[];
  validator?: FuncMesonValidator<T>;
}

export interface IMesonSelectItem {
  value: any;
  key?: string;
  display?: string;
}

export interface IMesonSelectField<T> extends IMesonFieldBaseProps<T> {
  name: string;
  type: EMesonFieldType.Select;
  placeholder?: string;
  options: IMesonSelectItem[];
  onChange?: (x: any, modifyFormObject?: FuncMesonModifyForm<T>) => void;
  validateMethods?: (EMesonValidate | FuncMesonValidator<T>)[];
  validator?: FuncMesonValidator<T>;
  translateNonStringvalue?: boolean;
  allowClear?: boolean;
  selectProps?: SelectProps;
}

export interface IMesonCustomField<T> extends IMesonFieldBaseProps<T> {
  name: string;
  type: EMesonFieldType.Custom;
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

export interface IMesonFieldCustomMultiple<T> extends IMesonFieldBaseProps<T> {
  type: EMesonFieldType.CustomMultiple;
  /** multiple fields to edit and to check
   * @param modifyForm accepts a function to modify the form
   * @param checkForm accepts an object of new values
   */
  names: (keyof T)[];
  /** get form and render into form item */
  renderMultiple: (form: any, modifyForm: FuncMesonModifyForm, checkForm: (changedValues: any) => void) => ReactNode;
  /** get form and return errors of related fields in object */
  validateMultiple: (form: any, item: IMesonFieldCustomMultiple<T>) => IMesonErrors;
}

export interface IMesonFieldNested<T> extends IMesonFieldBaseProps<T> {
  type: EMesonFieldType.Nested;
  children: IMesonFieldItem<T>[];
}

export interface IMesonFieldsGroup<T> {
  type: EMesonFieldType.Group;
  shouldHide?: (form: any) => boolean;
  children: IMesonFieldItem<T>[];
}

export type IMesonFieldItemHasValue<T = any> = IMesonInputField<T> | IMesonNumberField<T> | IMesonSelectField<T> | IMesonCustomField<T> | IMesonSwitchField<T>;

export type IMesonFieldItem<T = any> =
  | IMesonInputField<T>
  | IMesonNumberField<T>
  | IMesonSelectField<T>
  | IMesonCustomField<T>
  | IMesonSwitchField<T>
  | IMesonFieldNested<T>
  | IMesonFieldsGroup<T>
  | IMesonFieldCustomMultiple<T>;
