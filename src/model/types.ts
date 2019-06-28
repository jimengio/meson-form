import { ReactNode } from "react";
import { InputProps } from "antd/lib/input";
import { SelectProps } from "antd/lib/select";

export interface ISimpleObject<T = any> {
  [k: string]: T;
}

export interface IMesonErrors {
  [k: string]: string;
}

export enum EMesonValidate {
  Number = "number",
  String = "string",
  Boolean = "boolean",
}

export type FuncMesonValidator = (x: any, item?: IMesonFieldItemHasValue) => string;

/** expose a function to modify form values directly, FR-97
 * Caution, it does not trigger field validation! So don't use it to mofidy fields before current one.
 */
export type FuncMesonModifyForm<T = any> = (modifter: (form: T) => void) => void;

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

export interface IMesonFieldBaseProps<K = string> {
  label?: string;
  required?: boolean;
  shouldHide?: (form: any) => boolean;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export interface IMesonInputField<K = string> extends IMesonFieldBaseProps {
  name: K;
  type: EMesonFieldType.Input;
  /** real type property on <input/> */
  inputType?: string;
  /** other props for input and textarea, actially need TextareaProps */
  inputProps?: InputProps;
  placeholder?: string;
  /** false by default, "" and " " will emit value `undefined` */
  useBlank?: boolean;
  onChange?: (x: any, modifyFormObject?: FuncMesonModifyForm) => void;
  textarea?: boolean;
  validateMethods?: (EMesonValidate | FuncMesonValidator)[];
  validator?: FuncMesonValidator;
}

export interface IMesonNumberField<K = string> extends IMesonFieldBaseProps {
  name: K;
  type: EMesonFieldType.Number;
  placeholder?: string;
  onChange?: (x: any, modifyFormObject?: FuncMesonModifyForm) => void;
  validateMethods?: (EMesonValidate | FuncMesonValidator)[];
  validator?: FuncMesonValidator;
  min?: number;
  max?: number;
}

export interface IMesonSwitchField<K = string> extends IMesonFieldBaseProps {
  name: K;
  type: EMesonFieldType.Switch;
  onChange?: (x: any, modifyFormObject?: FuncMesonModifyForm) => void;
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
  onChange?: (x: any, modifyFormObject?: FuncMesonModifyForm) => void;
  validateMethods?: (EMesonValidate | FuncMesonValidator)[];
  validator?: FuncMesonValidator;
  translateNonStringvalue?: boolean;
  allowClear?: boolean;
  selectProps?: SelectProps;
}

export interface IMesonCustomField<K> extends IMesonFieldBaseProps {
  name: K;
  type: EMesonFieldType.Custom;
  /** parent container is using column,
   * for antd inputs with default with 100%, you need to take care of that by yourself
   * @param current value in this field
   * @param onChange update value in this field
   * @param form the form
   * @param onCheck pass in latest value and it will be validated based on rules. mostly called after blurred or selected.
   */
  render: (value: any, onChange: (x: any) => void, form: any, onCheck: (x: any) => void) => ReactNode;
  onChange?: (x: any, modifyFormObject?: FuncMesonModifyForm) => void;
  validateMethods?: (EMesonValidate | FuncMesonValidator)[];
  validator?: FuncMesonValidator;
}

export interface IMesonFieldCustomMultiple<K = string> extends IMesonFieldBaseProps {
  type: EMesonFieldType.CustomMultiple;
  /** multiple fields to edit and to check
   * @param modifyForm accepts a function to modify the form
   * @param checkForm accepts an object of new values
   */
  names: K[];
  /** get form and render into form item */
  renderMultiple: (form: any, modifyForm: FuncMesonModifyForm, checkForm: (changedValues: any) => void) => ReactNode;
  /** get form and return errors of related fields in object */
  validateMultiple: (form: any, item: IMesonFieldCustomMultiple<K>) => IMesonErrors;
}

export interface IMesonFieldNested<K> extends IMesonFieldBaseProps {
  type: EMesonFieldType.Nested;
  children: IMesonFieldItem<K>[];
}

export interface IMesonFieldsGroup<K> {
  type: EMesonFieldType.Group;
  shouldHide?: (form: any) => boolean;
  children: IMesonFieldItem<K>[];
}

export type IMesonFieldItemHasValue<K = string> =
  | IMesonInputField<K>
  | IMesonNumberField<K>
  | IMesonSelectField<K>
  | IMesonCustomField<K>
  | IMesonSwitchField<K>;

export type IMesonFieldItem<K = string> =
  | IMesonInputField<K>
  | IMesonNumberField<K>
  | IMesonSelectField<K>
  | IMesonCustomField<K>
  | IMesonSwitchField<K>
  | IMesonFieldNested<K>
  | IMesonFieldsGroup<K>
  | IMesonFieldCustomMultiple<K>;
