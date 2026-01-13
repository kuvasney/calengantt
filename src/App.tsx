import { Route, Routes } from "react-router-dom";
import Login from "@/pages/Login";
import Calendar from "@/pages/Calendar";
import Products from "@/pages/Products";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import AuthCallBack from "@/pages/AuthCallBack";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppHeader from "@/components/AppHeader/AppHeader";

import "./App.scss";

function App() {
  return (
    <div className="app-wrapper">
      <AppHeader />
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
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
