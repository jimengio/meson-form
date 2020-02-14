import { IMesonFieldItem, ISimpleObject } from "../model/types";

export let traverseItems = (xs: IMesonFieldItem[], form: ISimpleObject, method: (x: IMesonFieldItem) => void) => {
  xs.forEach((x) => {
    if (x.shouldHide != null && x.shouldHide(form)) {
      return null;
    }

    switch (x.type) {
      case "custom-multiple":
      case "decorative":
        return;
      case "nested":
      case "group":
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
      case "custom-multiple":
        method(x);
        return;
      case "nested":
      case "group":
        traverseItemsReachCustomMultiple(x.children, form, method);
      default:
        return;
    }
  });
};
