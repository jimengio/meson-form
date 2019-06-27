import { IMesonFieldItem, EMesonFieldType } from "../model/types";

export let traverseItems = (xs: IMesonFieldItem[], method: (x: IMesonFieldItem) => void) => {
  xs.forEach((x) => {
    if (x.type === EMesonFieldType.Group) {
      traverseItems(x.children, method);
    } else if (x.type === EMesonFieldType.Fragment) {
      traverseItems(x.children, method);
    } else {
      method(x);
    }
  });
};
