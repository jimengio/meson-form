import React, { FC, useEffect, useState, ReactNode, useRef } from "react";
import ReactDOM from "react-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { css, cx } from "emotion";
import { rowParted, column } from "@jimengio/shared-utils";
import JimoIcon, { EJimoIcon } from "@jimengio/jimo-icons";

let transitionDuration = 160;
let containerName = "meson-modal-container";

let MesonModal: FC<{
  title: string;
  visible: boolean;
  width?: number | string;
  onClose: () => void;
  renderContent: () => ReactNode;
  hideClose?: boolean;
}> = (props) => {
  let el = useRef<HTMLDivElement>();
  let [noop, forceUpdate] = useState(null);

  /** Methods */

  let onContainerClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
  };

  /** Effects */

  useEffect(() => {
    if (el.current == null) {
      let div = document.createElement("div");
      el.current = div;
      forceUpdate(Math.random());
    }
  }, []);

  useEffect(() => {
    let root = document.querySelector(`.${containerName}`);

    if (root == null) {
      console.error(`Required a container element in body: <div class="${containerName}" />`);
      return;
    }

    root.appendChild(el.current);
    return () => {
      root.removeChild(el.current);
    };
  }, []);

  /** Renderers */

  if (el.current == null) {
    return <span />;
  }

  return ReactDOM.createPortal(
    <div onClick={onContainerClick} className={styleAnimations}>
      <CSSTransition in={props.visible} unmountOnExit={true} classNames="backdrop" timeout={transitionDuration}>
        <div className={styleBackdrop} onClick={props.onClose}>
          <div className={cx(column, stylePopPage, "modal-card")} style={{ maxHeight: window.innerHeight - 80, width: props.width }} onClick={onContainerClick}>
            <div className={cx(rowParted, styleHeader)}>
              {props.title}

              {props.hideClose ? null : <JimoIcon name={EJimoIcon.slimCross} className={styleIcon} onClick={props.onClose} />}
            </div>
            {props.renderContent()}
          </div>
        </div>
      </CSSTransition>
    </div>,
    el.current
  );
};

export default MesonModal;

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

  transform-origin: 50% -50%;

  transition-timing-function: linear;
`;

// z-index = 1000 to simulate an antd modal
let styleBackdrop = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: hsla(0, 0%, 0%, 0.65);
  transition-timing-function: linear;
  z-index: 1000;

  display: flex;
`;

let styleHeader = css`
  padding: 0 24px;
  height: 56px;
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid hsl(0, 0%, 91%);
`;

let styleIcon = css`
  color: #aaa;
  cursor: pointer;
  font-size: 12px;
`;
