import { useState } from "react";
import { useCepApi } from "@/hooks/useCepApi";
import { useProjectsApi } from "@/hooks/useProjectsApi";
import { useAppSelector } from "@/stores/hooks";
import SideWindow from "../SideWindow/SideWindow";
import StatesCombo from "../StatesCombo";
import Loader from "../Loader/Loader";

import type { ProjectData } from "@/types/project";
import { CgMathPlus } from "react-icons/cg";

import "./createNewProject.scss";
import type { Product } from "@/types/products";

export default function NewProject() {
  const productsList = useAppSelector((state) => state.products.productsList);
  const { postProject } = useProjectsApi();
  const { fetchAddressByCep } = useCepApi();

  const [showProjects, setShowProjects] = useState(false);
  const [sameClientAddress, setSameClientAddress] = useState(false);
  // PROJETO
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");

  // CLIENTE
  const [clientCEP, setClientCEP] = useState("");
  const [clientLogradouro, setClientLogradouro] = useState("");
  const [clientNumero, setClientNumero] = useState("");
  const [clientBairro, setClientBairro] = useState("");
  const [clientComplemento, setClientComplemento] = useState("");
  const [clientCidade, setClientCidade] = useState("");
  const [clientEstado, setClientEstado] = useState("");
  const [clientCEPError, setClientCEPError] = useState<string[]>([]);

  //OBRA
  const [obraCEP, setObraCEP] = useState("");
  const [obraLogradouro, setObraLogradouro] = useState("");
  const [obraNumero, setObraNumero] = useState("");
  const [obraBairro, setObraBairro] = useState("");
  const [obraComplemento, setObraComplemento] = useState("");
  const [obraCidade, setObraCidade] = useState("");
  const [obraEstado, setObraEstado] = useState("");
  const [obraCEPError, setObraCEPError] = useState<string[]>([]);

  // DADOS BASE DO PROJETO
  const [projectProduct, setProjectProduct] = useState("");
  const [startDate, setStartDate] = useState("");

  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  function clearForm() {
    setProjectName("");
    setClientName("");
    setClientCEP("");
    setClientLogradouro("");
    setClientNumero("");
    setClientBairro("");
    setClientComplemento("");
    setClientCidade("");
    setClientEstado("");
    setObraCEP("");
    setObraLogradouro("");
    setObraNumero("");
    setObraBairro("");
    setObraComplemento("");
    setObraCidade("");
    setObraEstado("");
    setProjectProduct("");
    setStartDate("");
    setSameClientAddress(false);
    setFormErrors([]);
  }

  function handleCepSearch(
    cep: string,
    setters: {
      setLogradouro: (value: string) => void;
      setBairro: (value: string) => void;
      setCidade: (value: string) => void;
      setEstado: (value: string) => void;
    },
    setErrors: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    if (cep.trim() === "") {
      setErrors(["Por favor, insira um CEP válido."]);
      return;
    }
    setErrors([]);
    fetchAddressByCep(cep)
      .then((address) => {
        setters.setLogradouro(address.logradouro);
        setters.setBairro(address.bairro);
        setters.setCidade(address.localidade);
        setters.setEstado(address.uf);
      })
      .catch(() => {
        setErrors((prev) => [...prev, "Erro ao buscar o endereço pelo CEP."]);
      });
  }

  async function handleProjectSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setFormErrors([]);

    let isError: boolean = false;

    try {
      if (projectName.trim() === "") {
        setFormErrors((prev) => [...prev, "O nome do projeto é obrigatório."]);
        setIsLoading(false);
        isError = true;
      }

      if (clientName.trim() === "") {
        setFormErrors((prev) => [...prev, "O nome do cliente é obrigatório."]);
        setIsLoading(false);
        isError = true;
      }

      if (clientLogradouro.trim() === "") {
        setFormErrors((prev) => [
          ...prev,
          "O logradouro do cliente é obrigatório.",
        ]);
        setIsLoading(false);
        isError = true;
      }

      if (clientCidade.trim() === "") {
        setFormErrors((prev) => [
          ...prev,
          "A cidade do cliente é obrigatória.",
        ]);
        setIsLoading(false);
        isError = true;
      }

      if (clientEstado.trim() === "") {
        setFormErrors((prev) => [
          ...prev,
          "O estado do cliente é obrigatório.",
        ]);
        setIsLoading(false);
        isError = true;
      }

      if (!sameClientAddress) {
        if (obraLogradouro.trim() === "") {
          setFormErrors((prev) => [
            ...prev,
            "O logradouro da obra é obrigatório.",
          ]);
          setIsLoading(false);
        }

        if (obraCidade.trim() === "") {
          setFormErrors((prev) => [...prev, "A cidade da obra é obrigatória."]);
          setIsLoading(false);
          isError = true;
        }

        if (obraEstado.trim() === "") {
          setFormErrors((prev) => [...prev, "O estado da obra é obrigatório."]);
          setIsLoading(false);
          isError = true;
        }
      }

      if (startDate.trim() === "") {
        setFormErrors((prev) => [...prev, "A data de início é obrigatória."]);
        setIsLoading(false);
        isError = true;
      }

      if (isError) {
        setIsLoading(false);
        return;
      }

      const projectData: ProjectData = {
        projectName,
        clientName,
        clientAddress: {
          zipCode: clientCEP,
          street: clientLogradouro,
          number: clientNumero,
          neighborhood: clientBairro,
          complement: clientComplemento,
          city: clientCidade,
          state: clientEstado,
        },
        obraAddress: sameClientAddress
          ? {
              zipCode: clientCEP,
              street: clientLogradouro,
              number: clientNumero,
              neighborhood: clientBairro,
              complement: clientComplemento,
              city: clientCidade,
              state: clientEstado,
            }
          : {
              zipCode: obraCEP,
              street: obraLogradouro,
              number: obraNumero,
              neighborhood: obraBairro,
              complement: obraComplemento,
              city: obraCidade,
              state: obraEstado,
            },
        productId: Number(projectProduct),
        startDate,
      };

      await postProject(projectData as ProjectData);

      // Sucesso: mostrar mensagem e limpar formulário
      setSuccessMessage("✅ Projeto criado com sucesso!");
      clearForm();

      // Limpar mensagem após 5 segundos
      setTimeout(() => {
        setSuccessMessage("");
        setShowProjects(false); // Fechar o side window
      }, 5000);
    } catch (error) {
      console.error(error);
      setFormErrors((prev) => [
        ...prev,
        "Erro ao criar o projeto. Tente novamente.",
      ]);
      setIsLoading(false);
      return;
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <button
        className="btn-default btn-new-project iconic"
        onClick={() => setShowProjects(true)}
      >
        <span className="icon">
          <CgMathPlus />
        </span>
        Criar Novo Projeto
      </button>
      <SideWindow
        isOpen={showProjects}
        onClose={() => setShowProjects(false)}
        position="left"
        title="Criar novo projeto"
      >
        <section>
          {isLoading && <Loader />}
          {/* <h2 className="project-title">Criar Projeto</h2> */}
          <form className="form-regular form-add_project">
            <fieldset>
              <legend>Dados de identificação</legend>
              <div className="form-field">
                <label htmlFor="clientName">Nome do cliente</label>
                <input
                  type="text"
                  id="clientName"
                  className="input-regular"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label htmlFor="projectName">Nome do projeto</label>
                <input
                  type="text"
                  id="projectName"
                  className="input-regular"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
            </fieldset>
            <fieldset>
              <legend>Endereço do cliente</legend>
              <div className="form-inline">
                <div className="form-field size2-field">
                  <label htmlFor="cep">CEP do cliente</label>
                  <input
                    type="text"
                    id="cep"
                    value={clientCEP}
                    onChange={(e) => setClientCEP(e.target.value)}
                  />
                </div>
                <button
                  className="btn-default"
                  type="button"
                  onClick={() =>
                    handleCepSearch(
                      clientCEP,
                      {
                        setLogradouro: setClientLogradouro,
                        setBairro: setClientBairro,
                        setCidade: setClientCidade,
                        setEstado: setClientEstado,
                      },
                      setClientCEPError
                    )
                  }
                >
                  Buscar pelo CEP
                </button>
              </div>
              {clientCEPError.length > 0 && (
                <div className="error-messages">
                  {clientCEPError.map((error, index) => (
                    <p key={index} className="error-text">
                      {error}
                    </p>
                  ))}
                </div>
              )}
              <div className="form-inline">
                <div className="form-field">
                  <label htmlFor="logradouro">Logradouro</label>
                  <input
                    type="text"
                    id="logradouro"
                    value={clientLogradouro}
                    onChange={(e) => setClientLogradouro(e.target.value)}
                    placeholder="Avenida Exemplo"
                  />
                </div>
                <div className="form-field size2-field">
                  <label htmlFor="numero">Número</label>
                  <input
                    type="text"
                    id="numero"
                    value={clientNumero}
                    onChange={(e) => setClientNumero(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-field size3-field">
                <label htmlFor="bairro">Bairro</label>
                <input
                  type="text"
                  id="bairro"
                  value={clientBairro}
                  onChange={(e) => setClientBairro(e.target.value)}
                />
              </div>
              <div className="form-field size3-field">
                <label htmlFor="complemento">Complemento</label>
                <input
                  type="text"
                  id="complemento"
                  value={clientComplemento}
                  onChange={(e) => setClientComplemento(e.target.value)}
                />
              </div>
              <div className="form-inline">
                <div className="form-field size3-field">
                  <label htmlFor="cidade">Cidade</label>
                  <input
                    type="text"
                    id="cidade"
                    value={clientCidade}
                    onChange={(e) => setClientCidade(e.target.value)}
                  />
                </div>
                <div className="form-field size2-field">
                  <StatesCombo
                    value={clientEstado}
                    onStateChange={setClientEstado}
                  />
                </div>
              </div>
            </fieldset>
            <fieldset>
              <legend>Dados base do Projeto</legend>
              <div className="form-field">
                <label htmlFor="projectAddress">
                  Endereço da Obra{" "}
                  <button
                    type="button"
                    onClick={() => setSameClientAddress(!sameClientAddress)}
                  >
                    {sameClientAddress && (
                      <i className="check-icon">&#10003;</i>
                    )}{" "}
                    Usar endereço do cliente
                  </button>
                </label>
              </div>
              {!sameClientAddress && (
                <>
                  <div className="form-inline">
                    <div className="form-field size2-field">
                      <label htmlFor="obra-cep">CEP da obra</label>
                      <input
                        type="text"
                        id="obra-cep"
                        value={obraCEP}
                        onChange={(e) => setObraCEP(e.target.value)}
                      />
                    </div>
                    <button
                      className="btn-default"
                      type="button"
                      onClick={() =>
                        handleCepSearch(
                          obraCEP,
                          {
                            setLogradouro: setObraLogradouro,
                            setBairro: setObraBairro,
                            setCidade: setObraCidade,
                            setEstado: setObraEstado,
                          },
                          setObraCEPError
                        )
                      }
                    >
                      Buscar pelo CEP
                    </button>
                  </div>
                  {obraCEPError.length > 0 && (
                    <div className="error-messages">
                      {obraCEPError.map((error, index) => (
                        <p key={index} className="error-text">
                          {error}
                        </p>
                      ))}
                    </div>
                  )}
                  <div className="form-inline">
                    <div className="form-field">
                      <label htmlFor="obra-logradouro">
                        Logradouro da obra
                      </label>
                      <input
                        type="text"
                        id="obra-logradouro"
                        value={obraLogradouro}
                        onChange={(e) => setObraLogradouro(e.target.value)}
                      />
                    </div>
                    <div className="form-field size2-field">
                      <label htmlFor="obra-numero">Número da obra</label>
                      <input
                        type="text"
                        id="obra-numero"
                        value={obraNumero}
                        onChange={(e) => setObraNumero(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-field size3-field">
                    <label htmlFor="obra-bairro">Bairro da obra</label>
                    <input
                      type="text"
                      id="obra-bairro"
                      value={obraBairro}
                      onChange={(e) => setObraBairro(e.target.value)}
                    />
                  </div>
                  <div className="form-field size3-field">
                    <label htmlFor="obra-complemento">Complemento</label>
                    <input
                      type="text"
                      id="obra-complemento"
                      value={obraComplemento}
                      onChange={(e) => setObraComplemento(e.target.value)}
                    />
                  </div>
                  <div className="form-inline">
                    <div className="form-field size3-field">
                      <label htmlFor="obra-cidade">Cidade da obra</label>
                      <input
                        type="text"
                        id="obra-cidade"
                        value={obraCidade}
                        onChange={(e) => setObraCidade(e.target.value)}
                      />
                    </div>
                    <div className="form-field size2-field">
                      <StatesCombo
                        value={obraEstado}
                        onStateChange={setObraEstado}
                      />
                    </div>
                  </div>
                </>
              )}
              <div className="form-inline">
                <div className="form-field size2-field">
                  <label htmlFor="projectProduct">Produto</label>
                  <select
                    id="projectProduct"
                    value={projectProduct}
                    onChange={(e) => setProjectProduct(e.target.value)}
                  >
                    <option value="">Selecione um produto</option>
                    {Array.isArray(productsList) &&
                      productsList.map((product: Product) => (
                        <option key={product.id} value={product.id}>
                          {product.value}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="form-field size2-field">
                  <label htmlFor="startDate">Data de Início</label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>
              <button
                className="btn-default btn-submit"
                type="submit"
                onClick={handleProjectSubmit}
              >
                Criar Projeto
              </button>
            </fieldset>
            {successMessage && (
              <div className="success-message">
                <p>{successMessage}</p>
              </div>
            )}
            {formErrors.length > 0 && (
              <div className="error-messages">
                {formErrors.map((error, index) => (
                  <p key={index} className="error-text">
                    {error}
                  </p>
                ))}
              </div>
            )}
            {isLoading && <p>Carregando...</p>}
          </form>
        </section>
      </SideWindow>
    </>
  );
}
