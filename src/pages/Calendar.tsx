import { useEffect, useCallback } from "react";

import Calengantt from "@/components/Calengantt/Calengantt";
import CreateNewProject from "@/components/CreateNewProject/CreateNewProject";
import ListProjects from "@/components/ListProjects/ListProjects";

import { useProjectsApi } from "@/hooks/useProjectsApi";
import { useProductsApi } from "@/hooks/useProductsApi";
import { useAppDispatch } from "@/stores/hooks";
import { setProjectsList } from "@/stores/projectsSlice";
import { setProductsList } from "@/stores/productsSlice";
import { CgRedo } from "react-icons/cg";

export default function Calendar() {
  const { getProjects } = useProjectsApi();
  const { getProducts } = useProductsApi();
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

  const fetchProducts = useCallback(async () => {
    try {
      const data = await getProducts();
      if (data) {
        dispatch(setProductsList(data));
      }
    } catch (error) {
      console.error("Erro ao buscar os produtos:", error);
    }
  }, [getProducts, dispatch]);

  useEffect(() => {
    fetchProjects();
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Carrega apenas no mount

  return (
    <>
      <button
        className="btn-default iconic"
        type="button"
        onClick={fetchProjects}
      >
        <span className="icon">
          <CgRedo />
        </span>
        Atualizar Projetos
      </button>
      <ListProjects />
      <CreateNewProject />
      <Calengantt />
    </>
  );
}
