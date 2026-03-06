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
      },
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
      },
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
      },
    );

    if (!response.ok) {
      throw new Error("Erro ao criar o projeto");
    }

    return await response.json();
  }, []);

  const deleteProject = useCallback(async (projectId: number) => {
    const response = await fetchWithAuth(
      `${API_CONFIG.baseURL}${API_ENDPOINTS.projects}/${projectId}`,
      {
        method: "DELETE",
        headers: getAuthHeaders(),
      },
    );

    if (!response.ok) {
      throw new Error("Erro ao deletar o projeto");
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
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar o projeto");
      }

      return await response.json();
    },
    [],
  );

  const updateStepStatus = useCallback(
    async (
      projectId: number,
      scheduleId: number,
      status: "pending" | "in_progress" | "completed",
      actualDate?: string,
      actualStartDate?: string,
      actualEndDate?: string,
    ) => {
      const response = await fetchWithAuth(
        `${API_CONFIG.baseURL}${API_ENDPOINTS.projects}/${projectId}/schedules/${scheduleId}/status`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            status,
            actualDate,
            actualStartDate,
            actualEndDate,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar status da etapa");
      }

      return await response.json();
    },
    [],
  );

  const updateScheduleDates = useCallback(
    async (
      projectId: number,
      scheduleId: number,
      plannedStartDate?: string,
      plannedEndDate?: string,
    ) => {
      const response = await fetchWithAuth(
        `${API_CONFIG.baseURL}${API_ENDPOINTS.projects}/${projectId}/schedules/${scheduleId}/dates`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({ plannedStartDate, plannedEndDate }),
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar datas da etapa");
      }

      return await response.json();
    },
    [],
  );

  const finishStep = useCallback(
    async (
      projectId: number,
      scheduleId: number,
      isFinish: boolean,
      actualStartDate?: string,
      actualEndDate?: string,
    ) => {
      const nowIso = new Date().toISOString();
      const newStatus = isFinish ? "completed" : "in_progress";

      const response = await fetchWithAuth(
        `${API_CONFIG.baseURL}${API_ENDPOINTS.projects}/${projectId}/schedules/${scheduleId}/status`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            status: newStatus,
            actualDate: nowIso,
            actualStartDate: actualStartDate ?? nowIso,
            actualEndDate: isFinish ? (actualEndDate ?? nowIso) : undefined,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Erro ao finalizar/reabrir etapa");
      }

      return await response.json();
    },
    [],
  );

  return {
    getProjects,
    getProject,
    deleteProject,
    postProject,
    updateProject,
    updateStepStatus,
    updateScheduleDates,
    finishStep,
  };
};
