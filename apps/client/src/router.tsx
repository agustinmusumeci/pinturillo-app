import { Route, Routes } from "react-router";
import LoginPage from "./features/onboarding/LoginPage";

export default function Router() {
  return (
    <Routes>
      <Route
        path="/"
        element={<LoginPage />}
      />
    </Routes>
  );
}
