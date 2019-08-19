import { IMesonFieldItem, EMesonFieldType, ISimpleObject } from "../model/types";

export let traverseItems = (xs: IMesonFieldItem[], form: ISimpleObject, method: (x: IMesonFieldItem) => void) => {
  xs.forEach((x) => {
    if (x.shouldHide != null && x.shouldHide(form)) {
      return null;
    }

    switch (x.type) {
      case EMesonFieldType.CustomMultiple:
      case EMesonFieldType.Decorative:
        return;
      case EMesonFieldType.Nested:
      case EMesonFieldType.Group:
        traverseItems(x.children, form, method);
      default:
        method(x);
    }
  });
};

export let traverseItemsReachCustomMultiple = (xs: IMesonFieldItem[], form: ISimpleObject, method: (x: IMesonFieldItem) => void) => {
  xs.forEach((x) => {
    if (x.shouldHide != null && x.shouldHide(form)) {
      return null;
    }
    switch (x.type) {
      case EMesonFieldType.CustomMultiple:
        method(x);
        return;
      case EMesonFieldType.Nested:
      case EMesonFieldType.Group:
        traverseItemsReachCustomMultiple(x.children, form, method);
      default:
        return;
    }
  });
};
