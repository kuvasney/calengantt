import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Login from "@/pages/Login";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppHeader from "@/components/AppHeader/AppHeader";
import Loader from "@/components/Loader/Loader";

// stylesheet será resolvido no Vite para melhorar o pagespeed
const Calendar = lazy(() => import("@/pages/Calendar"));
const Products = lazy(() => import("@/pages/Products"));
const Projects = lazy(() => import("@/pages/Projects"));
const Register = lazy(() => import("@/pages/Register"));
const PasswordForgot = lazy(() => import("@/pages/PasswordForgot"));
const PasswordReset = lazy(() => import("@/pages/PasswordReset"));
const TermsAndPrivacy = lazy(() => import("@/pages/TermsAndPrivacy"));
const AuthCallBack = lazy(() => import("@/pages/AuthCallBack"));

function App() {
  const location = useLocation();
  const hideHeaderPaths = [
    "/",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/auth/callback",
    "/terms-and-privacy",
  ];
  const shouldShowHeader = !hideHeaderPaths.includes(location.pathname);

  return (
    <div className="app-wrapper">
      {shouldShowHeader && <AppHeader />}
      <div className="content-wrapper">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<PasswordForgot />} />
            <Route path="/reset-password" element={<PasswordReset />} />
            <Route path="/terms-and-privacy" element={<TermsAndPrivacy />} />
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
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              }
            />
            <Route path="/auth/callback" element={<AuthCallBack />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default App;
