import React, { SFC, useEffect, useState, ReactNode } from "react";
import ReactDOM from "react-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { css, cx } from "emotion";
import { rowParted, column } from "@jimengio/shared-utils";
import JimoIcon, { EJimoIcon } from "@jimengio/jimo-icons";

let transitionDuration = 160;
let containerName = "meson-modal-container";

interface IProps {
  title: string;
  visible: boolean;
  onClose: () => void;
  renderContent: () => ReactNode;
  hideClose?: boolean;
}

export default class MesonModal extends React.Component<IProps, any> {
  el: HTMLDivElement;
  constructor(props: IProps) {
    super(props);

    this.el = document.createElement("div");
  }

  componentDidMount() {
    let root = document.querySelector(`.${containerName}`);

    if (root == null) {
      throw new Error(`Required a container element in body: <div class="${containerName}" />`);
    }

    root.appendChild(this.el);
  }

  componentWillUnmount() {
    let root = document.querySelector(`.${containerName}`);
    root.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      <div onClick={this.onContainerClick} className={styleAnimations}>
        <CSSTransition in={this.props.visible} unmountOnExit={true} classNames="backdrop" timeout={transitionDuration}>
          <div className={styleBackdrop} onClick={this.props.onClose}>
            <div className={cx(column, stylePopPage, "modal-card")} style={{ maxHeight: window.innerHeight - 80 }} onClick={this.onContainerClick}>
              <div className={cx(rowParted, styleHeader)}>
                {this.props.title}

                {this.props.hideClose ? null : <JimoIcon name={EJimoIcon.slimCross} className={styleIcon} onClick={this.props.onClose} />}
              </div>
              {this.props.renderContent()}
            </div>
          </div>
        </CSSTransition>
      </div>,
      this.el
    );
  }

  onContainerClick(event) {
    event.stopPropagation();
  }
}

let styleAnimations = css`
  .backdrop-enter {
    opacity: 0;

    .modal-card {
      transform: scale(0.9);
    }
  }
  .backdrop-enter.backdrop-enter-active {
    opacity: 1;
    transition-duration: ${transitionDuration}ms;
    .modal-card {
      transform: scale(1);
      transition-duration: ${transitionDuration}ms;
    }
  }
  .backdrop-exit {
    opacity: 1;

    .modal-card {
      transform: scale(1);
    }
  }
  .backdrop-exit.backdrop-exit-active {
    opacity: 0;
    transition-duration: ${transitionDuration}ms;

    .modal-card {
      transform: scale(0.9);
      transition: ${transitionDuration}ms;
    }
  }
`;

let stylePopPage = css`
  margin: auto;

  background-color: white;
  min-width: 520px;
  min-height: 160px;
  border-radius: 4px;

  transform-origin: 50% -50%;

  transition-timing-function: linear;
`;

let styleBackdrop = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: hsla(0, 0%, 0%, 0.65);
  transition-timing-function: linear;

  display: flex;
`;

let styleHeader = css`
  padding: 12px;
  font-weight: bold;
  border-bottom: 1px solid hsl(0, 0%, 91%);
`;

let styleIcon = css`
  color: #aaa;
  cursor: pointer;
`;
