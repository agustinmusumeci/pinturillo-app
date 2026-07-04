import { Navigate, Outlet, useLocation } from "react-router";
import { useSocket } from "../hooks/useSocket";

export default function ProtectedRoutes() {
  const { isSocketConnected } = useSocket();
  const location = useLocation();

  if (!isSocketConnected()) {
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
