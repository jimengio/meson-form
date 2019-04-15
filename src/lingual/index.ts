import { zhCN } from "./zh-cn";
import { ILang } from "./interface";
import { enUS } from "./en-us";

// default locale is Chinese
export let lingual = zhCN;

export function mesonUseZh() {
  lingual = zhCN;
}

export function mesonUseEn() {
  lingual = enUS;
}

export function formatString(template: string, data: { [k: string]: string }) {
  for (var key in data) {
    template = template.split(`{${key}}`).join(data[key]);
  }

  return template;
}
