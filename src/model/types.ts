import { ReactNode } from "react";
import { InputProps } from "antd/lib/input";
import { SelectProps } from "antd/lib/select";
import { Draft } from "immer";

export interface ISimpleObject {
  [k: string]: string;
}

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
  Group = "group",
  Switch = "switch",
  // like React fragment
  Fragment = "fragment",
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

export interface IMesonGroupField<T> extends IMesonFieldBaseProps<T> {
  type: EMesonFieldType.Group;
  children: IMesonFieldItem<T>[];
}

export interface IMesonFieldsFragment<T> {
  type: EMesonFieldType.Fragment;
  shouldHide?: (form: T) => boolean;
  children: IMesonFieldItem<T>[];
}

export type IMesonFieldItemHasValue<T = any> = IMesonInputField<T> | IMesonNumberField<T> | IMesonSelectField<T> | IMesonCustomField<T> | IMesonSwitchField<T>;

export type IMesonFieldItem<T = any> =
  | IMesonInputField<T>
  | IMesonNumberField<T>
  | IMesonSelectField<T>
  | IMesonCustomField<T>
  | IMesonSwitchField<T>
  | IMesonGroupField<T>
  | IMesonFieldsFragment<T>;
