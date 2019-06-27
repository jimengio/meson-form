import { IMesonFieldItem, EMesonFieldType } from "../model/types";

export let traverseItems = (xs: IMesonFieldItem[], method: (x: IMesonFieldItem) => void) => {
  xs.forEach((x) => {
    switch (x.type) {
      case EMesonFieldType.HighlyCustomized:
        return;
      case EMesonFieldType.Group:
      case EMesonFieldType.Fragment:
        traverseItems(x.children, method);
      default:
        method(x);
    }
  });
};

export let traverseItemsReachHighlyCustomized = (xs: IMesonFieldItem[], method: (x: IMesonFieldItem) => void) => {
  xs.forEach((x) => {
    switch (x.type) {
      case EMesonFieldType.HighlyCustomized:
        method(x);
        return;
      case EMesonFieldType.Group:
      case EMesonFieldType.Fragment:
        traverseItems(x.children, method);
      default:
        return;
    }
  });
};
