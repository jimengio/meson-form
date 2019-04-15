import { EMesonFieldType, IMesonFieldItem, IMesonFieldItemHasValue } from "../model/types";
import { formatString, lingual } from "../lingual";

export let validateValueRequired = (x: any, item: IMesonFieldItemHasValue) => {
  if (x == null) {
    return formatString(lingual.labelIsRequired, {
      label: item.label,
    });
  }
};
