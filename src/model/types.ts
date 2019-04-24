import { ReactNode } from "react";

export interface ISimpleObject {
  [k: string]: string;
}

export enum EMesonValidate {
  Number = "number",
  String = "string",
  Boolean = "boolean",
}

export type FuncMesonValidator = (x: any, item?: IMesonFieldItemHasValue) => string;

export enum EMesonFieldType {
  Input = "input",
  Number = "number",
  Select = "select",
  Custom = "custom",
  Group = "group",
}

export interface IMesonFieldBaseProps<K = string> {
  label: string;
  required?: boolean;
  shouldHide?: (form: any) => boolean;
  disabled?: boolean;
}

export interface IMesonInputField<K = string> extends IMesonFieldBaseProps {
  name: K;
  type: EMesonFieldType.Input;
  placeholder?: string;
  onChange?: (text: string) => void;
  textarea?: boolean;
  validateMethods?: (EMesonValidate | FuncMesonValidator)[];
  validator?: FuncMesonValidator;
}

export interface IMesonNumberField<K = string> extends IMesonFieldBaseProps {
  name: K;
  type: EMesonFieldType.Number;
  placeholder?: string;
  onChange?: (text: string) => void;
  validateMethods?: (EMesonValidate | FuncMesonValidator)[];
  validator?: FuncMesonValidator;
}

export interface IMesonSelectItem {
  value: any;
  key?: string;
  display?: string;
}

export interface IMesonSelectField<K> extends IMesonFieldBaseProps {
  name: K;
  type: EMesonFieldType.Select;
  placeholder?: string;
  options: IMesonSelectItem[];
  onChange?: (x: string) => void;
  validateMethods?: (EMesonValidate | FuncMesonValidator)[];
  validator?: FuncMesonValidator;
}

export interface IMesonCustomField<K> extends IMesonFieldBaseProps {
  name: K;
  type: EMesonFieldType.Custom;
  render: (value: any, onChange: (x: any) => void, form: any) => ReactNode;
  onChange?: (x: any) => void;
  validateMethods?: (EMesonValidate | FuncMesonValidator)[];
  validator?: FuncMesonValidator;
}

export interface IMesonGroupField extends IMesonFieldBaseProps {
  type: EMesonFieldType.Group;
  children: IMesonFieldItem[];
}

export type IMesonFieldItemHasValue<K = string> = IMesonInputField<K> | IMesonNumberField<K> | IMesonSelectField<K> | IMesonCustomField<K>;
export type IMesonFieldItem<K = string> = IMesonInputField<K> | IMesonNumberField<K> | IMesonSelectField<K> | IMesonCustomField<K> | IMesonGroupField;
