import { useCallback } from "react";
import { API_CONFIG, API_ENDPOINTS } from "@/config/api";

interface UpdateProjectData {
  clientName?: string;
  projectName?: string;
  projectAddress?: {
    zipCode?: string;
    street?: string;
    number?: string;
    neighborhood?: string;
    complement?: string;
    city?: string;
    state?: string;
  };
  stepsProgress?: Array<{
    stepId: number;
    actualStartDate?: string;
    actualEndDate?: string;
  }>;
}

export const useProjectUpdate = () => {
  const updateProject = useCallback(
    async (projectId: number, data: UpdateProjectData) => {
      const response = await fetch(
        `${API_CONFIG.baseURL}${API_ENDPOINTS.project}/${projectId}`,
        {
          method: "PATCH",
          headers: API_CONFIG.headers,
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar o projeto");
      }

      return await response.json();
    },
    []
  );

  return { updateProject };
};
