import React, { useState, SFC } from "react";
import { css, cx } from "emotion";
import { column, row, fullscreen } from "@jimengio/shared-utils";
import { IRouteParseResult } from "@jimengio/ruled-router";
import { HashLink } from "@jimengio/ruled-router/lib/dom";
import { genRouter } from "controller/generated-router";
import FormBasic from "forms/basic";
import DraftForm from "forms/draft";
import ModalPage from "forms/modal";
import SelectPage from "forms/select-page";
import ValidationPage from "forms/validation";
import CustomPage from "forms/custom";
import AutoSavePage from "forms/auto-save";
import WrapMesonCore from "forms/wrap-meson-core";
import ForwardForm from "forms/forward-form";
import ModifyOnChange from "forms/modify-on-change";
import SwitchPage from "forms/switch";
import InlineFormPage from "forms/inline-form";
import FormBlankLabel from "forms/blank-label";
import DrawerPage from "forms/drawer";
import CustomMultiplePage from "forms/custom-multiple";

let pages: { title: string; path: string }[] = [
  {
    title: "Basic",
    path: genRouter.home.name,
  },
  {
    title: "Modal",
    path: genRouter.modal.name,
  },
  {
    title: "Select",
    path: genRouter.select.name,
  },
  {
    title: "Draft",
    path: genRouter.draft.name,
  },
  {
    title: "Drawer",
    path: genRouter.drawer.name,
  },
  {
    title: "Validation",
    path: genRouter.validation.name,
  },
  {
    title: "Custom",
    path: genRouter.custom.name,
  },
  {
    title: "Custom multiple",
    path: genRouter.customMultiple.name,
  },
  {
    title: "Auto save",
    path: genRouter.autoSave.name,
  },
  {
    title: "Use meson core",
    path: genRouter.wrapMesonCore.name,
  },
  {
    title: "Forwarded form",
    path: genRouter.forwardForm.name,
  },
  {
    title: "Modify on change",
    path: genRouter.modifyOnChange.name,
  },
  {
    title: "Switch",
    path: genRouter.switch.name,
  },
  {
    title: "Inline form",
    path: genRouter.inlineForm.name,
  },
  {
    title: "Blank label",
    path: genRouter.blankLabel.name,
  },
];

let Container: SFC<{ router: IRouteParseResult }> = (props) => {
  let renderChild = (x) => {
    switch (props.router.name) {
      case genRouter.home.name:
        return <FormBasic />;
      case genRouter.draft.name:
        return <DraftForm />;
      case genRouter.modal.name:
        return <ModalPage />;
      case genRouter.drawer.name:
        return <DrawerPage />;
      case genRouter.select.name:
        return <SelectPage />;
      case genRouter.validation.name:
        return <ValidationPage />;
      case genRouter.custom.name:
        return <CustomPage />;
      case genRouter.customMultiple.name:
        return <CustomMultiplePage />;
      case genRouter.autoSave.name:
        return <AutoSavePage />;
      case genRouter.wrapMesonCore.name:
        return <WrapMesonCore />;
      case genRouter.forwardForm.name:
        return <ForwardForm />;
      case genRouter.modifyOnChange.name:
        return <ModifyOnChange />;
      case genRouter.switch.name:
        return <SwitchPage />;
      case genRouter.inlineForm.name:
        return <InlineFormPage />;
      case genRouter.blankLabel.name:
        return <FormBlankLabel />;
      default:
        return <FormBasic />;
    }
  };

  return (
    <div className={cx(fullscreen, row, styleContainer)}>
      <div className={cx(column, styleSidebar)}>
        {pages.map((page) => {
          let isActive = page.path === props.router.name;

          return <HashLink key={page.path} to={page.path} text={page.title} className={cx(styleEntry, isActive ? styleActiveEntry : null)} />;
        })}
      </div>
      <div>{renderChild(props.router)}</div>
    </div>
  );
};

export default Container;

const styleContainer = css`
  font-family: "Helvetica";
`;

let styleSidebar = css`
  margin-right: 16px;
  width: 200px;
  border-right: 1px solid #ddd;
`;

let styleEntry = css`
  line-height: 40px;
  padding: 0 16px;
`;

let styleActiveEntry = css`
  background-color: #aaf;
  color: white;

  &:hover {
    color: white;
  }
`;
