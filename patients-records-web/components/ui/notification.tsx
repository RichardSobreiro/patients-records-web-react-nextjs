/** @format */

import ReactDOM from "react-dom";
import classes from "./notification.module.css";
import { useEffect, useState } from "react";

type Props = {
  title?: string | null | undefined;
  message?: string | null | undefined;
  status?: string | null | undefined;
  hideNotification?: () => void;
};

const NotificationBottom = ({
  title,
  message,
  status,
  hideNotification,
}: Props) => {
  const [requestStatus, setRequestStatus] = useState<string | null>(); // 'pending', 'success', 'error'

  useEffect(() => {
    if (status === "success" || status === "error") {
      const timer = setTimeout(() => {
        hideNotification && hideNotification();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [status]);

  let statusClasses = "";

  if (status === "success") {
    statusClasses = classes.success;
  }

  if (status === "error") {
    statusClasses = classes.error;
  }

  const cssClasses = `${classes.notification} ${statusClasses}`;

  return ReactDOM.createPortal(
    <div className={cssClasses}>
      <h2>{title}</h2>
      <p>{message}</p>
    </div>,
    document.getElementById("notifications")!
  );
};

export default NotificationBottom;
