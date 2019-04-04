import React from "react";
import { css } from "emotion";

export default class Home extends React.Component {
  render() {
    return (
      <div>
        Content Page
        <a
          onClick={() => {
            window.location.hash = "#/home";
          }}
          className={styleButton}
        >
          Back to home
        </a>
      </div>
    );
  }
}

const styleButton = css`
  margin: 8px;
  cursor: pointer;
  color: blue;
`;
