import { Navigate, Outlet, useLocation } from "react-router";
import { useSocket } from "../hooks/useSocket";
import storage from "../lib/storage/Storage";
import { CONNECTION_STORAGE_KEY } from "../constants/storage";
import { useEffect, useState } from "react";

type Status = "checking" | "success" | "failed";

export default function ProtectedRoutes() {
  const [status, setStatus] = useState<Status>("checking");
  const { isSocketConnected, reconnect } = useSocket();
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    const checkConnection = async () => {
      // If there is a socket connection, render Outlet
      if (isSocketConnected()) {
        if (!cancelled) setStatus("success");
        return;
      }

      const connectionId = storage.getLocalStorage(CONNECTION_STORAGE_KEY);

      // If there is neither a socket connection and connectionId, render Navigate
      if (!connectionId) {
        if (!cancelled) setStatus("failed");
        return;
      }

      // If reconnect goes well, render Outlet otherwise render Navigate
      try {
        const res = await reconnect(connectionId);

        if (res) {
          if (!cancelled) setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch (e) {
        console.log("RECONNECT ERROR: ", e);
        if (!cancelled) setStatus("failed");
      }
    };

    checkConnection();

    return () => {
      cancelled = true;
    };
  }, [isSocketConnected, reconnect]);

  if (status === "checking") {
    return <p>Loading...</p>;
  }

  if (status === "failed") {
    return (
      <Navigate
        to="/"
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
}
