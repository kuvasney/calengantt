import { Route, Routes, useLocation } from "react-router-dom";
import Login from "@/pages/Login";
import Calendar from "@/pages/Calendar";
import Products from "@/pages/Products";
import Register from "@/pages/Register";
import PasswordForgot from "@/pages/PasswordForgot";
import PasswordReset from "@/pages/PasswordReset";
import AuthCallBack from "@/pages/AuthCallBack";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppHeader from "@/components/AppHeader/AppHeader";

import "./App.scss";

function App() {
  const location = useLocation();
  const hideHeaderPaths = [
    "/",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/auth/callback",
  ];
  const shouldShowHeader = !hideHeaderPaths.includes(location.pathname);

  return (
    <div className="app-wrapper">
      {shouldShowHeader && <AppHeader />}
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<PasswordForgot />} />
          <Route path="/reset-password" element={<PasswordReset />} />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route path="/auth/callback" element={<AuthCallBack />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
