import { useEffect, useCallback, useState } from "react";

import Calengantt from "@/components/Calengantt/Calengantt";
import CreateNewProject from "@/components/CreateNewProject/CreateNewProject";
import ListProjects from "@/components/ListProjects/ListProjects";
import { useNavigate } from "react-router-dom";

import { APP_CONFIG } from "@/config/app";

import { useProjectsApi } from "@/hooks/useProjectsApi";
import { useProductsApi } from "@/hooks/useProductsApi";
import { useAppDispatch } from "@/stores/hooks";
import { setProjectsList } from "@/stores/projectsSlice";
import { setProductsList } from "@/stores/productsSlice";
import { CgFolder } from "react-icons/cg";

export default function Calendar() {
  const { getProjects } = useProjectsApi();
  const { getProducts } = useProductsApi();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [projectsList, setProjectsListState] = useState([]);
  const [productsList, setProductsListState] = useState([]);

  const fetchProjects = useCallback(async () => {
    try {
      const data = await getProjects();
      if (data) {
        setProjectsListState(data);
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
        setProductsListState(data);
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

  if (productsList.length === 0) {
    return (
      <div>
        <p>
          Você não tem nenhum produto cadastrado. <br />
          Para começar a utilizar o {APP_CONFIG.appName}, crie um novo produto.
          <button className="btn-default" onClick={() => navigate("/products")}>
            Criar Produto
          </button>
        </p>
      </div>
    );
  }

  if (projectsList.length === 0) {
    return (
      <div>
        <p>
          Você não tem nenhum projeto cadastrado. <br />
          Para começar a utilizar o {APP_CONFIG.appName}, crie um novo projeto.
        </p>
      </div>
    );
  }

  return (
    <>
      <ListProjects />
      <button
        className="btn-default iconic"
        onClick={() => navigate("/products")}
      >
        <span className="icon">
          <CgFolder />
        </span>
        Ver produtos
      </button>
      <CreateNewProject />
      <Calengantt onRefresh={fetchProjects} />
    </>
  );
}
