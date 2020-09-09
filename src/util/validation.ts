import { IMesonFieldItemHasValue, EMesonValidate, FuncMesonValidator, IMesonErrors } from "../model/types";
import { formatString, lingual } from "../lingual";
import { isNumber, isString, isBoolean, isFunction, isArray } from "lodash-es";

export let validateValueRequired = <T>(x: any, item: IMesonFieldItemHasValue<T>) => {
  if (x == null || x === "") {
    return formatString(lingual.labelIsRequired, {
      label: item.label,
    });
  }
};

export let validateByMethods = <T>(x: any, methods: (EMesonValidate | FuncMesonValidator<T>)[], item: IMesonFieldItemHasValue<T>): string => {
  for (let idx in methods) {
    let method = methods[idx];
    if (method === EMesonValidate.Number) {
      if (!isNumber(x)) {
        return formatString(lingual.labelShouldBeNumber, { label: item.label });
      }
    } else if (method === EMesonValidate.String) {
      if (!isString(x)) {
        return formatString(lingual.labelShouldBeString, { label: item.label });
      }
    } else if (method === EMesonValidate.Boolean) {
      if (!isBoolean(x)) {
        return formatString(lingual.labelShouldBeBoolean, { label: item.label });
      }
    } else if (isFunction(x)) {
      return method(x, item);
    } else {
      console.warn("Unknown method", method);
    }
  }
  return null;
};

export let validateItem = <T>(x: any, item: IMesonFieldItemHasValue<T>, formValue: T): string => {
  if (item.validator != null) {
    let ret = item.validator(x, item, formValue);
    if (ret != null) {
      return ret;
    }
  }
  if (isArray(item.validateMethods)) {
    let ret = validateByMethods(x, item.validateMethods, item);
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
