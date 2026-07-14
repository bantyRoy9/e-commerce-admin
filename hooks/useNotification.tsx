"use client";

import {
  createContext,
  useContext,
  useState,
  type FC,
  type ReactNode,
} from "react";

interface NotificationContextValue {
  orderNotificationCount: number;
  addOrderNotification: () => void;
  clearOrderNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export const NotificationProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [orderNotificationCount, setOrderNotificationCount] =
    useState(0);

  const addOrderNotification = () => {
    setOrderNotificationCount((count) => count + 1);
  };

  const clearOrderNotifications = () => {
    setOrderNotificationCount(0);
  };

  return (
    <NotificationContext.Provider
      value={{
        orderNotificationCount,
        addOrderNotification,
        clearOrderNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotification must be used within NotificationProvider"
    );
  }

  return context;
}
