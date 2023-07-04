/** @format */

import { ErrorDetails } from "@/models/Api/ErrorDetails";
import classes from "./error-dialog.module.css";

import React from "react";
import ReactDOM from "react-dom";
import Image from "next/image";

type Props = {
  onClose: () => void;
  error: ErrorDetails;
  title: string;
};

const ErrorDialog = ({ onClose, error, title }: Props) => {
  const handleCloseClick = (e: any) => {
    e.preventDefault();
    onClose();
  };

  const modalContent = (
    <div className={classes.error_dialog_overlay} onClick={handleCloseClick}>
      <div
        className={classes.error_dialog_wrapper}
        onClick={(e: any) => {
          e.stopPropagation();
        }}
      >
        <div className={classes.error_dialog}>
          <div className={classes.error_dialog_header}>
            {title && (
              <div>
                <p className={classes.header_title}>{title}</p>
                {error.httpStatusCode !== 422 && (
                  <p className={classes.header_subtitle}>Tente novamente!</p>
                )}
              </div>
            )}
            <button className={classes.close_button} onClick={handleCloseClick}>
              <Image
                src={`/images/close.svg`}
                alt="close"
                width={30}
                height={30}
              />
            </button>
          </div>
          <div className={classes.error_dialog_body}>
            <div className={classes.error_row}>
              <p className={classes.error_row_title}>HTTP Status Code: </p>
              <p className={classes.error_row_description}>
                {error.httpStatusCode}
              </p>
            </div>
            <div className={classes.error_row}>
              <p className={classes.error_row_title}>Mensagem: </p>
              <p className={classes.error_row_description}>{error.message}</p>
            </div>
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

export default ErrorDialog;
