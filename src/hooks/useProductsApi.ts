import { useCallback } from "react";
import { API_CONFIG, API_ENDPOINTS } from "@/config/api";
import type { Product } from "@/types/products";

export const useProductsApi = () => {
  const getProducts = useCallback(async () => {
    const response = await fetch(
      `${API_CONFIG.baseURL}${API_ENDPOINTS.products}`,
      {
        method: "GET",
        headers: API_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar os projetos");
    }

    return await response.json();
  }, []);

  const postProduct = useCallback(async (productData: Product) => {
    const response = await fetch(
      `${API_CONFIG.baseURL}${API_ENDPOINTS.products}`,
      {
        method: "POST",
        headers: API_CONFIG.headers,
        body: JSON.stringify(productData),
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao criar o produto");
    }

    return await response.json();
  }, []);

  return { getProducts, postProduct };
};
