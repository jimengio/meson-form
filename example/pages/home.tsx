import React from "react";
import { css } from "emotion";
import { MesonForm } from "meson-form";

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
        <MesonForm />
      </div>
    );
  }
}

const styleButton = css`
  margin: 8px;
  cursor: pointer;
  color: blue;
`;
