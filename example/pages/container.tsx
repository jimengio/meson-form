import React, { useState, FC } from "react";
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
import GroupPage from "forms/group";
import DecorativePage from "forms/decorative";
import { DocSidebar, ISidebarEntry } from "@jimengio/doc-frame";
import { findRouteTarget } from "@jimengio/ruled-router/lib/dom";
import DropdownPage from "forms/dropdown";

let items: ISidebarEntry[] = [
  {
    title: "Basic",
    cnTitle: "基础",
    path: genRouter.home.name,
  },
  {
    title: "Modal",
    cnTitle: "弹出层",
    path: genRouter.modal.name,
  },
  {
    title: "Select",
    cnTitle: "下拉选择",
    path: genRouter.select.name,
  },
  {
    title: "Draft",
    cnTitle: "混合",
    path: genRouter.draft.name,
  },
  {
    title: "Drawer",
    cnTitle: "抽屉",
    path: genRouter.drawer.name,
  },
  {
    title: "Dropdown",
    cnTitle: "下拉菜单",
    path: genRouter.dropdown.name,
  },
  {
    title: "Validation",
    cnTitle: "校验",
    path: genRouter.validation.name,
  },
  {
    title: "Custom",
    cnTitle: "自定义",
    path: genRouter.custom.name,
  },
  {
    title: "Custom multiple",
    cnTitle: "多项自定义",
    path: genRouter.customMultiple.name,
  },
  {
    title: "Auto save",
    cnTitle: "自动保存",
    path: genRouter.autoSave.name,
  },
  {
    title: "Use meson core",
    cnTitle: "使用 Meson code",
    path: genRouter.wrapMesonCore.name,
  },
  {
    title: "Forwarded form",
    cnTitle: "引用传递写法",
    path: genRouter.forwardForm.name,
  },
  {
    title: "Modify on change",
    cnTitle: "修改的钩子",
    path: genRouter.modifyOnChange.name,
  },
  {
    title: "Switch",
    cnTitle: "开关",
    path: genRouter.switch.name,
  },
  {
    title: "Inline form",
    cnTitle: "行内模式",
    path: genRouter.inlineForm.name,
  },
  {
    title: "Blank label",
    cnTitle: "空白标签",
    path: genRouter.blankLabel.name,
  },
  {
    title: "Group",
    cnTitle: "分组",
    path: genRouter.group.name,
  },
  {
    title: "Decorative",
    cnTitle: "自定义穿插 Node",
    path: genRouter.decorative.name,
  },
];

let onSwitchPage = (path: string) => {
  let target = findRouteTarget(genRouter, path);
  if (target != null) {
    target.go();
  }
};

let Container: FC<{ router: IRouteParseResult }> = (props) => {
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
      case genRouter.group.name:
        return <GroupPage />;
      case genRouter.dropdown.name:
        return <DropdownPage />;
      case genRouter.decorative.name:
        return <DecorativePage />;
      default:
        return <FormBasic />;
    }
  };

  return (
    <div className={cx(fullscreen, row, styleContainer)}>
      <DocSidebar
        currentPath={props.router.name}
        onSwitch={(item) => {
          onSwitchPage(item.path);
        }}
        items={items}
      />

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
