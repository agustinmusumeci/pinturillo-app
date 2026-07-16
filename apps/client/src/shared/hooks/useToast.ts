import { useContext } from "react";
import { ToastContext } from "../contexts/toast/ToastContext";

export function useToast() {
  const values = useContext(ToastContext);

  return values;
}
