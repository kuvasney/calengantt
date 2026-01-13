import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useUserApi } from "@/hooks/useUserApi";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { getUserProfile } = useUserApi();
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateAuth = async () => {
      const accessToken = sessionStorage.getItem("accessToken");

      // 1. Verificar se token existe
      if (!accessToken) {
        setIsAuthenticated(false);
        setIsValidating(false);
        return;
      }

      // 2. Verificar se token não expirou
      try {
        const parts = accessToken.split(".");

        // JWT deve ter 3 partes (header.payload.signature)
        if (parts.length !== 3) {
          throw new Error("Token JWT inválido");
        }

        // Decodificar payload (segunda parte do JWT)
        const payload = JSON.parse(atob(parts[1]));
        const isExpired = payload.exp * 1000 <= Date.now();

        if (isExpired) {
          sessionStorage.clear();
          setIsAuthenticated(false);
          setIsValidating(false);
          return;
        }
      } catch (error: any) {
        // Token malformado
        console.error("Token malformado ou inválido:", error);
        sessionStorage.clear();
        setIsAuthenticated(false);
        setIsValidating(false);
        return;
      }

      // 3. Validar com backend
      try {
        await getUserProfile();
        setIsAuthenticated(true);
      } catch (error: any) {
        // Token inválido no backend
        console.error("Erro ao validar token:", error);
        sessionStorage.clear();
        setIsAuthenticated(false);
      } finally {
        setIsValidating(false);
      }
    };

    validateAuth();
  }, [getUserProfile]);

  // Mostrar loading enquanto valida
  if (isValidating) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <p>Validando autenticação...</p>
      </div>
    );
  }

  // Se não autenticado, redireciona para login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Se autenticado, renderiza children
  return <>{children}</>;
}
