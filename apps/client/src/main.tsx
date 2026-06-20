import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router";
import Router from "./router";
import { SocketProvider } from "./shared/contexts/socket/SocketProvider";

createRoot(document.getElementById("root")!).render(
  <SocketProvider>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </SocketProvider>,
);
