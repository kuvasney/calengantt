export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || "10000"),
  headers: {
    "Content-Type": "application/json",
  },
};

interface ApiEndpoints {
  projects: string;
  project: string;
  products: string;
}

// Endpoints da API
export const API_ENDPOINTS: ApiEndpoints = {
  projects: "/api/projects",
  project: "/api/project",
  products: "/api/products",
};
