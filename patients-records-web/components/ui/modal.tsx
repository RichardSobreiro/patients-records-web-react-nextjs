/** @format */

import React from "react";
import ReactDOM from "react-dom";

type Props = {
  onClose: () => void;
  children: string | JSX.Element | JSX.Element[];
  title: string;
};

const Modal = ({ onClose, children, title }: Props) => {
  const handleCloseClick = (e: any) => {
    e.preventDefault();
    onClose();
  };

  const modalContent = (
    <div className="modal-overlay">
      <div className="modal-wrapper">
        <div className="modal">
          <div className="modal-header">
            {title && <h1 className="modal-title">{title}</h1>}
            <a href="#" onClick={handleCloseClick} className="modal-close">
              x
            </a>
          </div>
          <div className="modal-body">{children}</div>
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
