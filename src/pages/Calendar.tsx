import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APP_CONFIG } from "@/config/app";
import { useProjectsApi } from "@/hooks/useProjectsApi";
import { useProductsApi } from "@/hooks/useProductsApi";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { setProjectsList } from "@/stores/projectsSlice";
import { setProductsList } from "@/stores/productsSlice";
import Calengantt from "@/components/Calengantt/Calengantt";
import CreateNewProject from "@/components/Projects/CreateNewProject/CreateNewProject";
import ListProjects from "@/components/Projects/ListProjects/ListProjects";
import SideWindow from "@/components/SideWindow/SideWindow";
import { HiBriefcase } from "react-icons/hi";

export default function Calendar() {
  const { getProjects } = useProjectsApi();
  const { getProducts } = useProductsApi();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Usar estado do Redux
  const projectsList = useAppSelector(
    (state) => state.projects.projectsList || [],
  );
  const productsList = useAppSelector(
    (state) => state.products.productsList || [],
  );

  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [projectStartDate, setProjectStartDate] = useState<Date | string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [productSideWindow, setProductSideWindow] = useState<boolean>(false);

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

  function openCreateProject() {
    setIsCreateProjectOpen(true);
  }

  function handleOnCreateNewProject(data: Date) {
    setProjectStartDate(data);
    setIsCreateProjectOpen(true);
  }

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchProjects(), fetchProducts()]);
      setIsLoading(false);
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Carrega apenas no mount

  if (isLoading) {
    return <p>Carregando...</p>;
  }

  if (productsList.length === 0) {
    return (
      <div>
        <p>
          Você não tem nenhum produto cadastrado. <br />
          Para começar a utilizar o {APP_CONFIG.appName}, crie um novo produto.
        </p>
        <p>
          <a
            onClick={() => setProductSideWindow(true)}
            className="link-default"
          >
            O que é um produto?
          </a>
        </p>
        <button className="btn-default" onClick={() => navigate("/products")}>
          <span className="icon">
            <HiBriefcase />
          </span>
          Criar Produto
        </button>
        <SideWindow
          isOpen={productSideWindow}
          onClose={() => setProductSideWindow(false)}
          position="left"
          title="O que é um produto?"
        />
      </div>
    );
  }

  return (
    <>
      <ListProjects />
      {projectsList.length === 0 && (
        <p>
          Você não tem nenhum projeto cadastrado.{" "}
          <button className="btn-small--flat" onClick={openCreateProject}>
            Crie seu primeiro projeto!
          </button>
        </p>
      )}
      {/* <button className="btn-default" onClick={() => navigate("/products")}>
        <span className="icon">
          <HiFolder />
        </span>
        Ver produtos
      </button> */}
      <CreateNewProject
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        startingDate={projectStartDate}
        onSuccess={() => {
          setIsCreateProjectOpen(false);
          fetchProjects();
        }}
      />
      <Calengantt
        onRefresh={fetchProjects}
        newProjectDate={(data: Date) => handleOnCreateNewProject(data)}
      />
    </>
  );
}
