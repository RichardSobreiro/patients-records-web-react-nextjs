/** @format */

import NotificationBottom from "@/components/ui/notification";
import { createContext, useState } from "react";

export type Notification = {
  title?: string | null | undefined;
  message?: string | null | undefined;
  status?: string | null | undefined;
};

export type NotificationState = {
  showNotification: (notification: Notification) => void;
  hideNotification: () => void;
};

const initialState: NotificationState = {
  showNotification: (notification: Notification) => {},
  hideNotification: () => {},
};

export const NotificationContext = createContext(initialState);

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const NotificationBottomProvider = ({ children }: Props) => {
  const [show, setShow] = useState<boolean>(false);
  const [notification, setNotification] = useState<Notification>({});

  const showNotification = (state: Notification) => {
    setShow(true);
    setNotification(state);
  };

  const hideNotification = () => {
    setShow(false);
    setNotification({});
  };

  const value = {
    showNotification,
    hideNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {show && (
        <NotificationBottom
          status={notification.status}
          title={notification.title}
          message={notification.message}
          hideNotification={hideNotification}
        />
      )}
    </NotificationContext.Provider>
  );
};

export default NotificationBottomProvider;
