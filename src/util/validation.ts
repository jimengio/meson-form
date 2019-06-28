import { EMesonFieldType, IMesonFieldItem, IMesonFieldItemHasValue, EMesonValidate, FuncMesonValidator, IMesonErrors } from "../model/types";
import { formatString, lingual } from "../lingual";
import is from "is";

export let validateValueRequired = (x: any, item: IMesonFieldItemHasValue) => {
  if (x == null || x === "") {
    return formatString(lingual.labelIsRequired, {
      label: item.label,
    });
  }
};

export let validateByMethods = (x: any, methods: (EMesonValidate | FuncMesonValidator)[], item: IMesonFieldItemHasValue): string => {
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
      return method(x, item);
    } else {
      console.warn("Unknown method", method);
    }
  }
  return null;
};

export let validateItem = (x: any, item: IMesonFieldItemHasValue): string => {
  if (item.validator != null) {
    return item.validator(x);
  } else if (is.array(item.validateMethods)) {
    return validateByMethods(x, item.validateMethods, item);
  } else if (item.required) {
    return validateValueRequired(x, item);
  }
  return undefined;
};

export let hasErrorInObject = (x: IMesonErrors): boolean => {
  for (let k in x) {
    if (x[k] != null) {
      return true;
    }
  }
  return false;
};

export let showErrorByNames = (x: IMesonErrors, names: string[]): string => {
  for (let k in x) {
    if (x[k] != null) {
      return x[k];
    }
  }
  return null;
};
