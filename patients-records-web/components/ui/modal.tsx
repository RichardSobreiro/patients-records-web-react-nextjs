/** @format */

import classes from "./modal.module.css";

import React, { CSSProperties } from "react";
import ReactDOM from "react-dom";

export enum ModalTheme {
  STANDARD = 1,
  SECONDARY = 2,
  PHOTO_VIEWWER = 3,
  LIGHT_BLUE = 4,
  SMALL = 5,
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
  let modalOverlayCssClass = classes.modal_overlay;
  let modalCssClass = classes.modal;
  let modalHeaderCssClass = classes.modal_header;
  let modalBodyCssClass = classes.modal_body;
  if (theme) {
    switch (theme) {
      case ModalTheme.STANDARD:
        modalWrapperCssClass = classes.modal_wrapper;
        break;
      case ModalTheme.SECONDARY:
        modalWrapperCssClass = classes.modal_wrapper_sec;
        break;
      case ModalTheme.PHOTO_VIEWWER:
        modalWrapperCssClass = classes.photo_viewer_modal_wrapper;
        modalOverlayCssClass = classes.photo_viewer_modal_overlay;
        modalCssClass = classes.photo_viewer_modal;
        modalHeaderCssClass = classes.photo_viewer_modal_header;
        modalBodyCssClass = classes.photo_viewer_modal_body;
        break;
      case ModalTheme.LIGHT_BLUE:
        modalWrapperCssClass = classes.light_blue_modal_wrapper;
        modalOverlayCssClass = classes.photo_viewer_modal_overlay;
        modalCssClass = classes.photo_viewer_modal;
        modalHeaderCssClass = classes.light_blue_modal_header;
        modalBodyCssClass = classes.photo_viewer_modal_body;
        break;
      case ModalTheme.SMALL:
        modalWrapperCssClass = classes.small_modal_wrapper;
        modalOverlayCssClass = classes.small_modal_overlay;
        modalCssClass = classes.small_modal;
        modalHeaderCssClass = classes.small_modal_header;
        modalBodyCssClass = classes.small_modal_body;
        break;
    }
  }

  const handleCloseClick = (e: any) => {
    e.preventDefault();
    onClose();
  };

  const modalContent = (
    <div className={modalOverlayCssClass}>
      <div className={modalWrapperCssClass}>
        <div className={modalCssClass}>
          <div className={modalHeaderCssClass}>
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
          <div style={bodyStyle} className={modalBodyCssClass}>
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
