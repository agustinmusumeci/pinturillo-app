import { createContext } from "react";

export enum ToastType {
  ERROR = "Cancel",
  SUCCESS = "Success",
  INFO = "Info",
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void;
}

export const ToastContext = createContext({} as ToastContextType);
