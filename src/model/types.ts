import { ReactNode } from "react";

export interface ISimpleObject {
  [k: string]: string;
}

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
  value: string;
  onChange?: (text: string) => void;
  validator?: (value: string) => string;
}

export interface IMesonNumberField extends IMesonFieldBaseProps {
  name: string;
  type: EMesonFieldType.Number;
  value: number;
  onChange?: (text: string) => void;
  validator?: (value: number) => string;
}

export interface IMesonSelectitem {
  value: string;
  key?: string;
  display?: string;
}

export interface IMesonSelectField extends IMesonFieldBaseProps {
  name: string;
  type: EMesonFieldType.Select;
  value: string;
  options: IMesonSelectitem[];
  onChange?: (x: string) => void;
  validator?: (value: string) => string;
}

export interface IMesonCustomField extends IMesonFieldBaseProps {
  name: string;
  type: EMesonFieldType.Custom;
  render: (value: any, onChange: (x: any) => void) => ReactNode;
  validator?: (value: any) => string;
}

export interface IMesonGroupField extends IMesonFieldBaseProps {
  type: EMesonFieldType.Group;
  children: IMesonFieldItem[];
}

export type IMesonFieldItemHasValue = IMesonInputField | IMesonNumberField | IMesonSelectField | IMesonCustomField;
export type IMesonFieldItem = IMesonInputField | IMesonNumberField | IMesonSelectField | IMesonCustomField | IMesonGroupField;
