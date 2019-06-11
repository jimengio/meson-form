import queryString from "query-string";

type Id = string;

function switchPath(x: string) {
  location.hash = `#${x}`;
}

function qsStringify(queries: { [k: string]: string }) {
  return queryString.stringify(queries);
}

// generated

export let genRouter = {
  home: {
    name: "home",
    raw: "home",
    path: () => `/home`,
    go: () => switchPath(`/home`),
  },
  autoSave: {
    name: "auto-save",
    raw: "auto-save",
    path: () => `/auto-save`,
    go: () => switchPath(`/auto-save`),
  },
  modal: {
    name: "modal",
    raw: "modal",
    path: () => `/modal`,
    go: () => switchPath(`/modal`),
  },
  draft: {
    name: "draft",
    raw: "draft",
    path: () => `/draft`,
    go: () => switchPath(`/draft`),
  },
  drawer: {
    name: "drawer",
    raw: "drawer",
    path: () => `/drawer`,
    go: () => switchPath(`/drawer`),
  },
  select: {
    name: "select",
    raw: "select",
    path: () => `/select`,
    go: () => switchPath(`/select`),
  },
  validation: {
    name: "validation",
    raw: "validation",
    path: () => `/validation`,
    go: () => switchPath(`/validation`),
  },
  custom: {
    name: "custom",
    raw: "custom",
    path: () => `/custom`,
    go: () => switchPath(`/custom`),
  },
  wrapMesonCore: {
    name: "wrap-meson-core",
    raw: "wrap-meson-core",
    path: () => `/wrap-meson-core`,
    go: () => switchPath(`/wrap-meson-core`),
  },
  forwardForm: {
    name: "forward-form",
    raw: "forward-form",
    path: () => `/forward-form`,
    go: () => switchPath(`/forward-form`),
  },
  modifyOnChange: {
    name: "modify-on-change",
    raw: "modify-on-change",
    path: () => `/modify-on-change`,
    go: () => switchPath(`/modify-on-change`),
  },
  switch: {
    name: "switch",
    raw: "switch",
    path: () => `/switch`,
    go: () => switchPath(`/switch`),
  },
  _: {
    name: "home",
    raw: "",
    path: () => `/`,
    go: () => switchPath(`/`),
  },
};
