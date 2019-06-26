import { EMesonFieldType, IMesonFieldItem, IMesonFieldItemHasValue, EMesonValidate, FuncMesonValidator } from "../model/types";
import { formatString, lingual } from "../lingual";
import is from "is";

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

export let validateItem = <T>(x: any, item: IMesonFieldItemHasValue<T>): string => {
  if (item.validator != null) {
    return item.validator(x);
  } else if (is.array(item.validateMethods)) {
    return validateByMethods(x, item.validateMethods, item);
  } else if (item.required) {
    return validateValueRequired(x, item);
  }
  return undefined;
};
