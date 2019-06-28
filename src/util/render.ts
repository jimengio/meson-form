import { IMesonFieldItem, EMesonFieldType, ISimpleObject } from "../model/types";

export let traverseItems = (xs: IMesonFieldItem[], form: ISimpleObject, method: (x: IMesonFieldItem) => void) => {
  xs.forEach((x) => {
    if (x.shouldHide != null && x.shouldHide(form)) {
      return null;
    }

    switch (x.type) {
      case EMesonFieldType.CustomMultiple:
        return;
      case EMesonFieldType.Group:
      case EMesonFieldType.Fragment:
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
      case EMesonFieldType.Group:
      case EMesonFieldType.Fragment:
        traverseItemsReachCustomMultiple(x.children, form, method);
      default:
        return;
    }
  });
};
