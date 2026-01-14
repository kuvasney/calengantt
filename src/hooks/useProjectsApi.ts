import { useCallback } from "react";
import { API_CONFIG, API_ENDPOINTS, getAuthHeaders } from "@/config/api";
import { fetchWithAuth } from "@/utils/apiInterceptor";
import type { ProjectData } from "@/types/project";

export const useProjectsApi = () => {
  const getProjects = useCallback(async () => {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}${API_ENDPOINTS.projects}`,
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

  const getProject = useCallback(async (projectId: number) => {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}${API_ENDPOINTS.projects}/${projectId}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar o projeto ${response.statusText}`);
    }

    return await response.json();
  }, []);

  const postProject = useCallback(async (projectData: ProjectData) => {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}${API_ENDPOINTS.projects}`,
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(projectData),
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao criar o projeto");
    }

    return await response.json();
  }, []);

  const updateProject = useCallback(
    async (projectId: number, projectData: Partial<ProjectData>) => {
      const response = await fetchWithAuth(
        `${API_CONFIG.baseURL}${API_ENDPOINTS.projects}/${projectId}`,
        {
          method: "PUT",
          headers: getAuthHeaders(),
          body: JSON.stringify(projectData),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar o projeto");
      }

      return await response.json();
    },
    []
  );

  const updateStepStatus = useCallback(
    async (
      projectId: number,
      scheduleId: number,
      status: "in_progress" | "completed",
      actualDate?: string
    ) => {
      const response = await fetchWithAuth(
        `${API_CONFIG.baseURL}${API_ENDPOINTS.projects}/${projectId}/schedules/${scheduleId}/status`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ status, actualDate }),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar status da etapa");
      }

      return await response.json();
    },
    []
  );

  // const getProjectComments = useCallback(async (projectId: number) => {
  //   const response = await fetchWithAuth(
  //     `${API_CONFIG.baseURL}${API_ENDPOINTS.project}/${projectId}/comments`,
  //     {
  //       method: "GET",
  //       headers: getAuthHeaders(),
  //     }
  //   );

  //   if (!response.ok) {
  //     throw new Error(`Erro ao buscar os comentários: ${response.statusText}`);
  //   }

  //   return await response.json();
  // }, []);

  return {
    getProjects,
    getProject,
    postProject,
    updateProject,
    updateStepStatus,
  };
};
