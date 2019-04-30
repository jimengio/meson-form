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
  _: {
    name: "home",
    raw: "",
    path: () => `/`,
    go: () => switchPath(`/`),
  },
};
