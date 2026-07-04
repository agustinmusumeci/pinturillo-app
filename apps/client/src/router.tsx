import { Route, Routes } from "react-router";
import LoginPage from "./features/onboarding/LoginPage";
import ProtectedRoutes from "./shared/middlewares/ProtectedRoutes";
import RoomsPage from "./features/rooms/RoomsPage";

export default function Router() {
  return (
    <Routes>
      <Route
        path="/"
        element={<LoginPage />}
      />
      <Route element={<ProtectedRoutes />}>
        <Route
          path="/rooms"
          element={<RoomsPage />}
        />
      </Route>
    </Routes>
  );
}
