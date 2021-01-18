import { IMesonFieldItem, FieldValues } from "../model/types";

export function traverseItems<T extends FieldValues>(xs: IMesonFieldItem<T>[], form: T, method: (x: IMesonFieldItem<T>) => void) {
  xs.forEach((x) => {
    if (x.shouldHide != null && x.shouldHide(form)) {
      return null;
    }
    if (x.onlyShow != null && !x.onlyShow(form)) {
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

export function traverseItemsReachCustomMultiple<T extends FieldValues>(xs: IMesonFieldItem<T>[], form: T, method: (x: IMesonFieldItem<T>) => void) {
  xs.forEach((x) => {
    if (x.shouldHide != null && x.shouldHide(form)) {
      return null;
    }
    if (x.onlyShow != null && !x.onlyShow(form)) {
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

export async function asyncCustomeValidateItems<T extends FieldValues>(xs: IMesonFieldItem<T>[], form: T, method: (x: IMesonFieldItem<T>) => void) {
  const xsPromises = xs.map(async (x) => {
    if (x.shouldHide != null && x.shouldHide(form)) {
      return null;
    }
    if (x.onlyShow != null && !x.onlyShow(form)) {
      return null;
    }

    switch (x.type) {
      case "decorative":
        return;
      case "nested":
      case "group":
        await asyncCustomeValidateItems(x.children, form, method);
      default:
        await method(x);
    }
  });

  await Promise.all(xsPromises);
}
