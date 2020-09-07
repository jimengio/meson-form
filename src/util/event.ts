export function addEventHandler(element: HTMLElement | Document, type: string, func: (event: any) => void) {
  if (element.addEventListener) {
    element.addEventListener(type, func, false);
  } else if ((element as any).attachEvent) {
    (element as any).attachEvent("on" + type, func);
  } else {
    (element as any)["on" + type] = func;
  }
}

export function removeEventHandler(element: HTMLElement | Document, type: string, func: (event: any) => void) {
  if (element.removeEventListener) {
    element.removeEventListener(type, func, false);
  } else if ((element as any).detachEvent) {
    (element as any).detachEvent("on" + type, func);
  } else {
    delete (element as any)["on" + type];
  }
}
