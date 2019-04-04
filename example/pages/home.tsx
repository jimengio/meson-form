import React from "react";
import { css } from "emotion";
import { MesonForm, EMesonFieldType } from "meson-form";

export default class Home extends React.Component {
  render() {
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
          items={[
            { type: EMesonFieldType.Input, label: "", value: "", name: "a", required: false },
            { type: EMesonFieldType.Input, label: "", value: "", name: "b", required: false },
          ]}
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
