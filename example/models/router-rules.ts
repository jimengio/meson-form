import { IRouteRule } from "@jimengio/ruled-router";

export const routerRules: IRouteRule[] = [
  {
    path: "home",
  },
  { path: "auto-save" },
  { path: "draft" },
  { path: "drawer" },
  { path: "", name: "home" },
];
