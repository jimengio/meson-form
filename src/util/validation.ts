import { IMesonFieldItem, IMesonFieldItemHasValue, EMesonValidate, FuncMesonValidator, IMesonErrors } from "../model/types";
import { formatString, lingual } from "../lingual";
import is from "is";

export let validateValueRequired = <T>(x: any, item: IMesonFieldItemHasValue<T>) => {
  if (x == null || x === "") {
    return formatString(lingual.labelIsRequired, {
      label: item.label,
    });
  }
};

export let validateByMethods = async <T>(x: any, methods: (EMesonValidate | FuncMesonValidator<T>)[], item: IMesonFieldItemHasValue<T>): Promise<string> => {
  for (let idx in methods) {
    let method = methods[idx];
    if (method === EMesonValidate.Number) {
      if (!is.number(x)) {
        return formatString(lingual.labelShouldBeNumber, { label: item.label });
      }
    } else if (method === EMesonValidate.String) {
      if (!is.string) {
        return formatString(lingual.labelShouldBeString, { label: item.label });
      }
    } else if (method === EMesonValidate.Boolean) {
      if (!is.boolean(x)) {
        return formatString(lingual.labelShouldBeBoolean, { label: item.label });
      }
    } else if (is.function(x)) {
      return await method(x, item);
    } else {
      console.warn("Unknown method", method);
    }
  }
  return null;
};

export let validateItem = async <T>(x: any, item: IMesonFieldItemHasValue<T>, formValue: T): Promise<string> => {
  if (item.validator != null) {
    let ret = await item.validator(x, item, formValue);
    if (ret != null) {
      return ret;
    }
  }
  if (is.array(item.validateMethods)) {
    let ret = await validateByMethods(x, item.validateMethods, item);
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
