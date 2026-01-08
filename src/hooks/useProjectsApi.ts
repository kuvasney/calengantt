import { useCallback } from "react";
import { API_CONFIG, API_ENDPOINTS } from "@/config/api";
import type { ProjectData } from "@/types/project";

export const useProjectsApi = () => {
  const getProjects = useCallback(async () => {
    const response = await fetch(
      `${API_CONFIG.baseURL}${API_ENDPOINTS.projects}`,
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

  const getProject = useCallback(async (projectId: number) => {
    const response = await fetch(
      `${API_CONFIG.baseURL}${API_ENDPOINTS.project}/${projectId}`,
      {
        method: "GET",
        headers: API_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar o projeto ${response.statusText}`);
    }

    return await response.json();
  }, []);

  const postProject = useCallback(async (projectData: ProjectData) => {
    const response = await fetch(
      `${API_CONFIG.baseURL}${API_ENDPOINTS.projects}`,
      {
        method: "POST",
        headers: API_CONFIG.headers,
        body: JSON.stringify(projectData),
      }
    );

    if (!response.ok) {
      throw new Error("Erro ao criar o projeto");
    }

    return await response.json();
  }, []);

  const getProjectComments = useCallback(async (projectId: number) => {
    const response = await fetch(
      `${API_CONFIG.baseURL}${API_ENDPOINTS.project}/${projectId}/comments`,
      {
        method: "GET",
        headers: API_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar os comentários: ${response.statusText}`);
    }

    return await response.json();
  }, []);

  return { getProjects, getProject, postProject, getProjectComments };
};
