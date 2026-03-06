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
import SideWindow from "@/components/SideWindow/SideWindow";
import { HiOutlineBriefcase } from "react-icons/hi";

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
      await Promise.all([fetchProducts()]);
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
            <HiOutlineBriefcase />
          </span>
          Criar Produto
        </button>
        <SideWindow
          isOpen={productSideWindow}
          onClose={() => setProductSideWindow(false)}
          position="left"
          title="O que é um produto?"
        >
          <p>
            <strong>Tudo que você vende é um produto. </strong>
          </p>
          <p>
            Se você é um <strong>prestador de serviços</strong>, o{" "}
            <strong>produto</strong> é o seu <strong>serviço prestado</strong>.
          </p>
          <p>
            <strong>Quer um exemplo prático?</strong> Vamos pegar o caso de uma
            pessoa que trabalhe com faxina de locais.
          </p>
          <p>
            Essa pessoa faz limpeza de locais (residências, escritórios ou até
            firmas). Porém nem todos os locais são iguais. Então, para um
            residência familiar pequena, ela levará 1 dia. Mas para uma pequena
            empresa ela pode levar 3 dias. Então, ao cadastrar um produto, ela
            cadastraria: <br />
            Nome do produto: Faxina residência pequena. <br />
            E nas etapas: <br />
            Etapa 1: Limpeza completa <br />
            Duração: 1 dia.
          </p>
          <p>
            Porém, para uma casa maior ou uma pequena empresa, ela cadastraria:{" "}
            <br />
            Nome do produto: Faxina residência grande. <br />
            E nas etapas: <br />
            Etapa 1: Limpeza de quartos, banheiros e salas <br />
            Duração: 1 dia. <br />
            Etapa 2: Limpeza de cozinha, outros cômodos internos <br />
            Duração: 1 dia. <br />
            Etapa 3: Limpeza área externa <br />
            Duração: 1 dia.
          </p>
          <p>
            Com isso, essa pessoa tem 2 produtos cadastrados e pode controlar
            seu calendário apenas criando o projeto e adicionando o produto
            correspondente!
          </p>
        </SideWindow>
      </div>
    );
  }

  return (
    <>
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
