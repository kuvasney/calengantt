import { useCallback } from "react";
import { API_CONFIG, API_ENDPOINTS } from "@/config/api";
import type {
  User,
  SingleUserRegistrationData,
  UserCredentials,
  LoginResponse,
} from "@/types/user";

export const useUserApi = () => {
  const userLogin = useCallback(
    async (userData: UserCredentials): Promise<LoginResponse> => {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_ENDPOINTS.user}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao fazer login do usuário");
      }

      const data: LoginResponse = await response.json();
      return data;
    },
    []
  );

  const registerUser = useCallback(
    async (userData: SingleUserRegistrationData): Promise<LoginResponse> => {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_ENDPOINTS.user}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao registrar o usuário");
      }

      const data: LoginResponse = await response.json();
      return data;
    },
    []
  );

  const passwordEmailRecovery = useCallback(
    async (email: string): Promise<void> => {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_ENDPOINTS.user}/password-recovery`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao enviar o e-mail de recuperação de senha");
      }
    },
    []
  );

  const getUserProfile = useCallback(async (): Promise<User> => {
    const token = sessionStorage.getItem("accessToken");

    if (!token) {
      throw new Error("Token não encontrado");
    }

    const response = await fetch(`${API_CONFIG.baseURL}/api/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar dados do usuário");
    }

    const data = await response.json();
    return data.user;
  }, []);

  return { userLogin, registerUser, passwordEmailRecovery, getUserProfile };
};
