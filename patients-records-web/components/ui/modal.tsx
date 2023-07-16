/** @format */

import classes from "./modal.module.css";

import React, { CSSProperties } from "react";
import ReactDOM from "react-dom";

export enum ModalTheme {
  STANDARD = 1,
  SECONDARY = 2,
}

type Props = {
  onClose: () => void;
  children: string | JSX.Element | JSX.Element[];
  title: string;
  bodyStyle?: CSSProperties;
  titleStyle?: CSSProperties;
  theme?: ModalTheme;
};

const Modal = ({
  onClose,
  children,
  title,
  bodyStyle,
  titleStyle,
  theme,
}: Props) => {
  let modalWrapperCssClass = classes.modal_wrapper;
  if (theme) {
    switch (theme) {
      case ModalTheme.STANDARD:
        modalWrapperCssClass = classes.modal_wrapper;
        break;
      case ModalTheme.SECONDARY:
        modalWrapperCssClass = classes.modal_wrapper_sec;
        break;
    }
  }

  const handleCloseClick = (e: any) => {
    e.preventDefault();
    onClose();
  };

  const modalContent = (
    <div className={classes.modal_overlay}>
      <div className={modalWrapperCssClass}>
        <div className={classes.modal}>
          <div className={classes.modal_header}>
            {title && (
              <h1 style={titleStyle} className={classes.modal_title}>
                {title}
              </h1>
            )}
            <a
              href="#"
              onClick={handleCloseClick}
              className={classes.modal_close}
            >
              x
            </a>
          </div>
          <div style={bodyStyle} className={classes.modal_body}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(
    modalContent,
    document.getElementById("portal")!
  );
};

export default Modal;
