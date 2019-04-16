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

export interface IMesonFieldBaseProps {
  label: string;
  required?: boolean;
  shouldHide?: (form: any) => boolean;
  disabled?: boolean;
}

export interface IMesonInputField extends IMesonFieldBaseProps {
  name: string;
  type: EMesonFieldType.Input;
  placeholder?: string;
  onChange?: (text: string) => void;
  textarea?: boolean;
  validateMethods?: (EMesonValidate | FuncMesonValidator)[];
  validator?: FuncMesonValidator;
}

export interface IMesonNumberField extends IMesonFieldBaseProps {
  name: string;
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

export interface IMesonSelectField extends IMesonFieldBaseProps {
  name: string;
  type: EMesonFieldType.Select;
  placeholder?: string;
  options: IMesonSelectItem[];
  onChange?: (x: string) => void;
  validateMethods?: (EMesonValidate | FuncMesonValidator)[];
  validator?: FuncMesonValidator;
}

export interface IMesonCustomField extends IMesonFieldBaseProps {
  name: string;
  type: EMesonFieldType.Custom;
  render: (value: any, onChange: (x: any) => void) => ReactNode;
  onChange?: (x: any) => void;
  validateMethods?: (EMesonValidate | FuncMesonValidator)[];
  validator?: FuncMesonValidator;
}

export interface IMesonGroupField extends IMesonFieldBaseProps {
  type: EMesonFieldType.Group;
  children: IMesonFieldItem[];
}

export type IMesonFieldItemHasValue = IMesonInputField | IMesonNumberField | IMesonSelectField | IMesonCustomField;
export type IMesonFieldItem = IMesonInputField | IMesonNumberField | IMesonSelectField | IMesonCustomField | IMesonGroupField;
