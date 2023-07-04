/** @format */

import ReactDOM from "react-dom";
import classes from "./loading-spinner.module.css";

const LoadingSpinner = () => {
  const spinner = (
    <div className={classes.spinner_dialog_overlay}>
      <div className={classes.spinner_container}>
        <div className={classes.loading_spinner}></div>
      </div>
    </div>
  );
  return ReactDOM.createPortal(spinner, document.getElementById("portal")!);
};

export default LoadingSpinner;
