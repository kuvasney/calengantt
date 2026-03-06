import { useEffect, useCallback } from "react";
import { useProjectsApi } from "@/hooks/useProjectsApi";
import { useAppDispatch } from "@/stores/hooks";
import { setProjectsList } from "@/stores/projectsSlice";
import ListProjects from "@/components/Projects/ListProjects/ListProjects";

export default function Projects() {
  const { getProjects } = useProjectsApi();
  const dispatch = useAppDispatch();

  const fetchProjects = useCallback(async () => {
    try {
      const data = await getProjects();
      if (data) {
        dispatch(setProjectsList(data));
      }
    } catch (error) {
      console.error("Erro ao buscar os projetos:", error);
    }
  }, [getProjects, dispatch]);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchProjects()]);
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Carrega apenas no mount

  return <ListProjects />;
}
