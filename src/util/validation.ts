import { IMesonFieldItemHasValue, FuncMesonValidator, IMesonErrors } from "../model/types";
import { formatString, lingual } from "../lingual";
import { isNumber, isString, isBoolean, isFunction, isArray } from "lodash-es";
import { ruledValidate } from "@jimengio/ruled-validator";

export let validateValueRequired = <T>(x: any, item: IMesonFieldItemHasValue<T>) => {
  if (x == null || x === "") {
    return formatString(lingual.labelIsRequired, {
      label: item.label,
    });
  }
};

export let validateItem = <T>(x: any, item: IMesonFieldItemHasValue<T>, formValue: T): string => {
  if (item.validator != null) {
    let ret = item.validator(x, item, formValue);
    if (ret != null) {
      return ret;
    }
  }
  if (item.validateRules != null) {
    let ret = ruledValidate(x, item.validateRules);
    if (ret != null) {
      return ret;
    }
  }
  if (item.required) {
    let ret = validateValueRequired(x, item);
    if (ret != null) {
      return ret;
    }
  }
  return undefined;
};

export let hasErrorInObject = (x: IMesonErrors<any>): boolean => {
  for (let k in x) {
    if (x[k] != null) {
      return true;
    }
  }
  return false;
};

export let showErrorByNames = (x: IMesonErrors<any>, names: string[]): string => {
  for (let k in names) {
    let name = names[k];
    if (x[name] != null) {
      return x[name];
    }
  }
  return null;
};
