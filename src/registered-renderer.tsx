import { ReactNode } from "react";
import { isFunction } from "lodash-es";
import { IMesonRegisteredField } from "./model/types";

type FuncValueRenderer = (
  value: any,
  onChange: (value: any) => void,
  onCheck: (value: any) => void,
  form?: object,
  options?: object,
  field?: IMesonRegisteredField<any>
) => ReactNode;

let fieldValueRenderers: { [k: string]: FuncValueRenderer } = {};

export let registerMesonFormRenderer = (type: string, f: FuncValueRenderer) => {
  if (fieldValueRenderers[type] != null) {
    console.warn("[MesonForm] overwriting render type", type, fieldValueRenderers[type], f);
  }
  fieldValueRenderers[type] = f;
};

export let getFormRenderer = (type: string): FuncValueRenderer => {
  if (isFunction(fieldValueRenderers[type])) {
    return fieldValueRenderers[type];
  }
  console.warn("[MesonForm] unknown render type", JSON.stringify(type), "among", Object.keys(fieldValueRenderers), "resolved to", fieldValueRenderers[type]);
  return null;
};
