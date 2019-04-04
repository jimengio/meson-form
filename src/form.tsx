import React, { SFC, ReactNode } from "react";

export enum EMesonFieldType {
  Input = "input",
  Select = "select",
  Custom = "custom",
  Group = "group",
}

export interface IMesonFieldBaseProps {
  name: string;
  label: string;
  required?: boolean;
  hidden?: boolean;
  disabled?: boolean;
}

export interface IMesonInputField extends IMesonFieldBaseProps {
  type: EMesonFieldType.Input;
  value: string;
  onChange?: (text: string) => void;
}

export interface IMesonSelectitem {
  value: string;
  id?: string;
  display?: string;
}

export interface IMesonSelectField extends IMesonFieldBaseProps {
  type: EMesonFieldType.Select;
  value: string;
  options: (IMesonSelectitem)[];
  onChange?: (x: string) => void;
}

export interface IMesonCustomField extends IMesonFieldBaseProps {
  type: EMesonFieldType.Custom;
  render: () => ReactNode;
}

export interface IMesonGroupField extends IMesonFieldBaseProps {
  type: EMesonFieldType.Group;
  children: IMesonFieldItem[];
}

export type IMesonFieldItem = IMesonInputField | IMesonSelectField | IMesonCustomField | IMesonGroupField;

export let MesonForm: SFC<{
  items: (IMesonFieldItem)[];
  onSubmit: (form: { string: any }) => void;
}> = (props) => {
  return <div>TODO</div>;
};
