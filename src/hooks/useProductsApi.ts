import { useCallback } from "react";
import { API_CONFIG, API_ENDPOINTS, getAuthHeaders } from "@/config/api";
import { fetchWithAuth } from "@/utils/apiInterceptor";
import type { Product } from "@/types/products";

export const useProductsApi = () => {
  const getProducts = useCallback(async () => {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}${API_ENDPOINTS.products}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao buscar os projetos");
    }

    return await response.json();
  }, []);

  const postProduct = useCallback(async (productData: Product) => {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}${API_ENDPOINTS.products}`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(productData),
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao criar o produto");
    }

    return await response.json();
  }, []);

  const updateProduct = useCallback(
    async (id: number, productData: Product) => {
      const response = await fetchWithAuth(
        `${API_CONFIG.baseURL}${API_ENDPOINTS.products}/${id}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(productData),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar o produto");
      }

      return await response.json();
    },
    []
  );

  const deleteProduct = useCallback(async (id: number) => {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}${API_ENDPOINTS.products}/${id}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao deletar o produto");
    }

    return await response.json();
  }, []);

  return { getProducts, postProduct, updateProduct, deleteProduct };
};
