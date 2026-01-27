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
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao fazer login do usuário");
      }

      const data: LoginResponse = await response.json();
      return data;
    },
    [],
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
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao registrar o usuário");
      }

      const data: LoginResponse = await response.json();
      return data;
    },
    [],
  );

  const passwordEmailRecovery = useCallback(
    async (email: string): Promise<void> => {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_ENDPOINTS.user}/reset-password-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao enviar o e-mail de recuperação de senha");
      }
    },
    [],
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

  const updateUserPassword = useCallback(
    async (token: string, password: string) => {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_ENDPOINTS.user}/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password, token }),
        },
      );

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error("Token inválido ou usuário não encontrado");
        } else {
          throw new Error("Erro ao atualizar a senha");
        }
      }

      return await response.json();
    },
    [],
  );

  return {
    userLogin,
    registerUser,
    passwordEmailRecovery,
    getUserProfile,
    updateUserPassword,
  };
};
