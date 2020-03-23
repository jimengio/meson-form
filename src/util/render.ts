import { IMesonFieldItem } from "../model/types";

export function traverseItems<T>(xs: IMesonFieldItem<T>[], form: T, method: (x: IMesonFieldItem<T>) => void) {
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
}

export function traverseItemsReachCustomMultiple<T>(xs: IMesonFieldItem<T>[], form: T, method: (x: IMesonFieldItem<T>) => void) {
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
}
