import type { ReactNode } from "react";
import { ToastContext, ToastType } from "./ToastContext";

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const showToast = (message: string, type: ToastType) => {
    console.log(message, type);
  };

  return <ToastContext.Provider value={{ showToast }}>{children}</ToastContext.Provider>;
};
