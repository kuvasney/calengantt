import { API_CONFIG } from "@/config/api";

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

// Adiciona callbacks para serem chamados quando o token for renovado
function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

// Notifica todos os callbacks com o novo token
function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

// Renova o access token usando o refresh token
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = sessionStorage.getItem("refreshToken");

  if (!refreshToken) {
    return null;
  }

  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}/api/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();
    const newAccessToken = data.accessToken;

    // Salvar novo token
    sessionStorage.setItem("accessToken", newAccessToken);

    return newAccessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    // Limpar tokens e redirecionar para login
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("user");
    window.location.href = "/login";
    return null;
  }
}

// Wrapper para fetch com refresh automático
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Primeira tentativa
  let response = await fetch(url, options);

  // Se retornar 401, tentar renovar token
  if (response.status === 401) {
    if (!isRefreshing) {
      isRefreshing = true;

      const newToken = await refreshAccessToken();

      if (newToken) {
        isRefreshing = false;
        onTokenRefreshed(newToken);

        // Atualizar header com novo token
        const newOptions = {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newToken}`,
          },
        };

        // Tentar novamente com novo token
        response = await fetch(url, newOptions);
      } else {
        isRefreshing = false;
      }
    } else {
      // Se já está renovando, aguardar o novo token
      const newToken = await new Promise<string>((resolve) => {
        subscribeTokenRefresh((token) => {
          resolve(token);
        });
      });

      // Tentar novamente com novo token
      const newOptions = {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newToken}`,
        },
      };

      response = await fetch(url, newOptions);
    }
  }

  return response;
}
