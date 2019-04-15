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
