import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import Router from "./router";
import { SocketProvider } from "./shared/contexts/socket/SocketProvider";
import { ToastProvider } from "./shared/contexts/toast/ToastProvider";

createRoot(document.getElementById("root")!).render(
  <SocketProvider>
    <ToastProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </ToastProvider>
  </SocketProvider>,
);
