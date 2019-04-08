import React from "react";
import { css } from "emotion";
import { MesonForm, EMesonFieldType, IMesonFieldItem } from "meson-form";

export default class Home extends React.Component {
  render() {
    let formItems: IMesonFieldItem[] = [
      { type: EMesonFieldType.Input, label: "", value: "", name: "b", required: false },
      { type: EMesonFieldType.Input, label: "", value: "", name: "a", required: false },
    ];

    return (
      <div>
        Home Page
        <a
          onClick={() => {
            window.location.hash = "#/content";
          }}
          className={styleButton}
        >
          Open content
        </a>
        <a
          onClick={async () => {
            let { showTime } = await import("../util/time" /* webpackChunkName:"time" */);
            showTime();
          }}
        >
          Use
        </a>
        <MesonForm
          items={formItems}
          onSubmit={(form) => {
            console.log("submit data", form);
          }}
        />
      </div>
    );
  }
}

const styleButton = css`
  margin: 8px;
  cursor: pointer;
  color: blue;
`;
