"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import { NotificationProvider } from "@/hooks/useNotification";
import { IAMProvider } from "@/lib/iamContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <IAMProvider>
        <NotificationProvider>{children}</NotificationProvider>
      </IAMProvider>
    </Provider>
  );
}
