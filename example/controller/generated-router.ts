import queryString from "query-string";

type Id = string;

function switchPath(x: string) {
  location.hash = `#${x}`;
}

function qsStringify(queries: { [k: string]: string }) {
  return queryString.stringify(queries);
}

// generated

// Generated with router-code-generator@0.2.7

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
  dropdown: {
    name: "dropdown",
    raw: "dropdown",
    path: () => `/dropdown`,
    go: () => switchPath(`/dropdown`),
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
  loginValidations: {
    name: "login-validations",
    raw: "login-validations",
    path: () => `/login-validations`,
    go: () => switchPath(`/login-validations`),
  },
  custom: {
    name: "custom",
    raw: "custom",
    path: () => `/custom`,
    go: () => switchPath(`/custom`),
  },
  customMultiple: {
    name: "custom-multiple",
    raw: "custom-multiple",
    path: () => `/custom-multiple`,
    go: () => switchPath(`/custom-multiple`),
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
  inlineForm: {
    name: "inline-form",
    raw: "inline-form",
    path: () => `/inline-form`,
    go: () => switchPath(`/inline-form`),
  },
  blankLabel: {
    name: "blank-label",
    raw: "blank-label",
    path: () => `/blank-label`,
    go: () => switchPath(`/blank-label`),
  },
  group: {
    name: "group",
    raw: "group",
    path: () => `/group`,
    go: () => switchPath(`/group`),
  },
  decorative: {
    name: "decorative",
    raw: "decorative",
    path: () => `/decorative`,
    go: () => switchPath(`/decorative`),
  },
  noLabel: {
    name: "no-label",
    raw: "no-label",
    path: () => `/no-label`,
    go: () => switchPath(`/no-label`),
  },
  useItems: {
    name: "use-items",
    raw: "use-items",
    path: () => `/use-items`,
    go: () => switchPath(`/use-items`),
  },
  radio: {
    name: "radio",
    raw: "radio",
    path: () => `/radio`,
    go: () => switchPath(`/radio`),
  },
  footerButtons: {
    name: "footer-buttons",
    raw: "footer-buttons",
    path: () => `/footer-buttons`,
    go: () => switchPath(`/footer-buttons`),
  },
  datePicker: {
    name: "date-picker",
    raw: "date-picker",
    path: () => `/date-picker`,
    go: () => switchPath(`/date-picker`),
  },
  treeSelect: {
    name: "tree-select",
    raw: "tree-select",
    path: () => `/tree-select`,
    go: () => switchPath(`/tree-select`),
  },
  filterForm: {
    name: "filter-form",
    raw: "filter-form",
    path: () => `/filter-form`,
    go: () => switchPath(`/filter-form`),
  },
  inputSuffix: {
    name: "input-suffix",
    raw: "input-suffix",
    path: () => `/input-suffix`,
    go: () => switchPath(`/input-suffix`),
  },
  customTheme: {
    name: "custom-theme",
    raw: "custom-theme",
    path: () => `/custom-theme`,
    go: () => switchPath(`/custom-theme`),
  },
  asyncValidation: {
    name: "async-validation",
    raw: "async-validation",
    path: () => `/async-validation`,
    go: () => switchPath(`/async-validation`),
  },
  $: {
    name: "home",
    raw: "",
    path: () => `/`,
    go: () => switchPath(`/`),
  },
};

/** Deprecating, use GenRouterTypeTree["next"] instead */
export type GenRouterTypeMain = GenRouterTypeTree["next"];

export interface GenRouterTypeTree {
  next:
    | GenRouterTypeTree["home"]
    | GenRouterTypeTree["autoSave"]
    | GenRouterTypeTree["modal"]
    | GenRouterTypeTree["draft"]
    | GenRouterTypeTree["drawer"]
    | GenRouterTypeTree["dropdown"]
    | GenRouterTypeTree["select"]
    | GenRouterTypeTree["validation"]
    | GenRouterTypeTree["loginValidations"]
    | GenRouterTypeTree["custom"]
    | GenRouterTypeTree["customMultiple"]
    | GenRouterTypeTree["wrapMesonCore"]
    | GenRouterTypeTree["forwardForm"]
    | GenRouterTypeTree["modifyOnChange"]
    | GenRouterTypeTree["switch"]
    | GenRouterTypeTree["inlineForm"]
    | GenRouterTypeTree["blankLabel"]
    | GenRouterTypeTree["group"]
    | GenRouterTypeTree["decorative"]
    | GenRouterTypeTree["noLabel"]
    | GenRouterTypeTree["useItems"]
    | GenRouterTypeTree["radio"]
    | GenRouterTypeTree["footerButtons"]
    | GenRouterTypeTree["datePicker"]
    | GenRouterTypeTree["treeSelect"]
    | GenRouterTypeTree["filterForm"]
    | GenRouterTypeTree["inputSuffix"]
    | GenRouterTypeTree["customTheme"]
    | GenRouterTypeTree["asyncValidation"]
    | GenRouterTypeTree["$"];
  home: {
    name: "home";
    params: {};
    query: {};
    next: null;
  };
  autoSave: {
    name: "auto-save";
    params: {};
    query: {};
    next: null;
  };
  modal: {
    name: "modal";
    params: {};
    query: {};
    next: null;
  };
  draft: {
    name: "draft";
    params: {};
    query: {};
    next: null;
  };
  drawer: {
    name: "drawer";
    params: {};
    query: {};
    next: null;
  };
  dropdown: {
    name: "dropdown";
    params: {};
    query: {};
    next: null;
  };
  select: {
    name: "select";
    params: {};
    query: {};
    next: null;
  };
  validation: {
    name: "validation";
    params: {};
    query: {};
    next: null;
  };
  loginValidations: {
    name: "login-validations";
    params: {};
    query: {};
    next: null;
  };
  custom: {
    name: "custom";
    params: {};
    query: {};
    next: null;
  };
  customMultiple: {
    name: "custom-multiple";
    params: {};
    query: {};
    next: null;
  };
  wrapMesonCore: {
    name: "wrap-meson-core";
    params: {};
    query: {};
    next: null;
  };
  forwardForm: {
    name: "forward-form";
    params: {};
    query: {};
    next: null;
  };
  modifyOnChange: {
    name: "modify-on-change";
    params: {};
    query: {};
    next: null;
  };
  switch: {
    name: "switch";
    params: {};
    query: {};
    next: null;
  };
  inlineForm: {
    name: "inline-form";
    params: {};
    query: {};
    next: null;
  };
  blankLabel: {
    name: "blank-label";
    params: {};
    query: {};
    next: null;
  };
  group: {
    name: "group";
    params: {};
    query: {};
    next: null;
  };
  decorative: {
    name: "decorative";
    params: {};
    query: {};
    next: null;
  };
  noLabel: {
    name: "no-label";
    params: {};
    query: {};
    next: null;
  };
  useItems: {
    name: "use-items";
    params: {};
    query: {};
    next: null;
  };
  radio: {
    name: "radio";
    params: {};
    query: {};
    next: null;
  };
  footerButtons: {
    name: "footer-buttons";
    params: {};
    query: {};
    next: null;
  };
  datePicker: {
    name: "date-picker";
    params: {};
    query: {};
    next: null;
  };
  treeSelect: {
    name: "tree-select";
    params: {};
    query: {};
    next: null;
  };
  filterForm: {
    name: "filter-form";
    params: {};
    query: {};
    next: null;
  };
  inputSuffix: {
    name: "input-suffix";
    params: {};
    query: {};
    next: null;
  };
  customTheme: {
    name: "custom-theme";
    params: {};
    query: {};
    next: null;
  };
  asyncValidation: {
    name: "async-validation";
    params: {};
    query: {};
    next: null;
  };
  $: {
    name: "home";
    params: {};
    query: {};
    next: null;
  };
}
