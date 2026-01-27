import { useState, useEffect, useRef } from "react";
import { useCepApi } from "@/hooks/useCepApi";
import { useProjectsApi } from "@/hooks/useProjectsApi";
import { useAppSelector } from "@/stores/hooks";
import SideWindow from "../SideWindow/SideWindow";
import StatesCombo from "../StatesCombo";
import FormMessages from "../FormMessages/FormMessages";
import Loader from "../Loader/Loader";

import type { ProjectData } from "@/types/project";
import { HiPlus, HiSearch, HiFolderAdd } from "react-icons/hi";

import "./createNewProject.scss";
import type { Product } from "@/types/products";

interface NewProjectInterface {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  startingDate?: Date | string;
}

export default function NewProject({
  isOpen,
  onClose,
  onSuccess,
  startingDate,
}: NewProjectInterface) {
  const productsList = useAppSelector((state) => state.products.productsList);
  const { postProject } = useProjectsApi();
  const { fetchAddressByCep } = useCepApi();

  const [showProjectsForm, setShowProjectsForm] = useState(false);
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
  const [startDate, setStartDate] = useState<string>(
    startingDate ? new Date(startingDate).toISOString().split("T")[0] : ""
  );

  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  // Sincronizar startDate com startingDate quando mudar
  useEffect(() => {
    if (startingDate) {
      setStartDate(new Date(startingDate).toISOString().split("T")[0]);
    }
  }, [startingDate]);

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

      if (startDate === "") {
        setFormErrors((prev) => [...prev, "A data de início é obrigatória."]);
        setIsLoading(false);
        isError = true;
      }

      if (isError) {
        setIsLoading(false);
        // Rolar para o final do formulário para ver os erros
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
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

      // Limpar mensagem após 3 segundos e fechar
      setTimeout(() => {
        setSuccessMessage("");
        onSuccess(); // Notifica pai e fecha
      }, 3000);
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
        className="btn-default btn-new-project"
        onClick={() => setShowProjectsForm(true)}
      >
        <span className="icon">
          <HiPlus />
        </span>
        Criar Novo Projeto
      </button>
      <SideWindow
        isOpen={isOpen || showProjectsForm}
        onClose={() => {
          setShowProjectsForm(false);
          clearForm();
          onClose();
        }}
        position="left"
        title="Criar novo projeto"
      >
        <section>
          {isLoading && <Loader />}
          {/* <h2 className="project-title">Criar Projeto</h2> */}
          <form className="form-regular form-add_project" ref={formRef}>
            <fieldset className="fieldset-regular">
              <legend>Dados de identificação</legend>
              <div className="input-field--pretty">
                <label htmlFor="clientName">Nome do cliente</label>
                <input
                  type="text"
                  id="clientName"
                  className="input-regular"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
              <div className="input-field--pretty">
                <label htmlFor="projectName">Nome do projeto</label>
                <input
                  type="text"
                  id="projectName"
                  className="input-regular"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              <div className="form-field form-inline">
                <div className="input-field--pretty">
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
                <div className="input-field--pretty">
                  <label htmlFor="startDate">Data de Início</label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
              </div>
            </fieldset>
            <fieldset className="fieldset-regular">
              <legend>Endereço do cliente</legend>
              <div className="form-field form-inline">
                <div className="input-field--pretty size2-field">
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
                  disabled={clientCEP === ""}
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
                  <HiSearch /> Buscar pelo CEP
                </button>
              </div>
              {clientCEPError.length > 0 && (
                <FormMessages type="error">
                  {clientCEPError.map((error, index) => (
                    <p key={index} className="error-text">
                      {error}
                    </p>
                  ))}
                </FormMessages>
              )}

              <div className="input-field--pretty">
                <label htmlFor="logradouro">Logradouro</label>
                <input
                  type="text"
                  id="logradouro"
                  value={clientLogradouro}
                  onChange={(e) => setClientLogradouro(e.target.value)}
                  placeholder="Avenida Exemplo"
                />
              </div>
              <div className="form-field form-inline">
                <div className="input-field--pretty">
                  <label htmlFor="numero">Número</label>
                  <input
                    type="text"
                    id="numero"
                    value={clientNumero}
                    onChange={(e) => setClientNumero(e.target.value)}
                  />
                </div>

                <div className="input-field--pretty">
                  <label htmlFor="bairro">Bairro</label>
                  <input
                    type="text"
                    id="bairro"
                    value={clientBairro}
                    onChange={(e) => setClientBairro(e.target.value)}
                  />
                </div>
                <div className="input-field--pretty">
                  <label htmlFor="complemento">Complemento</label>
                  <input
                    type="text"
                    id="complemento"
                    value={clientComplemento}
                    onChange={(e) => setClientComplemento(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-field form-inline">
                <div className="input-field--pretty">
                  <label htmlFor="cidade">Cidade</label>
                  <input
                    type="text"
                    id="cidade"
                    value={clientCidade}
                    onChange={(e) => setClientCidade(e.target.value)}
                  />
                </div>
                <div className="input-field--pretty">
                  <StatesCombo
                    value={clientEstado}
                    onStateChange={setClientEstado}
                  />
                </div>
              </div>
            </fieldset>
            <fieldset className="fieldset-regular">
              <legend>Dados base do Projeto</legend>
              <div className="input-field">
                <label htmlFor="projectAddress">
                  Endereço da Obra{" "}
                  <button
                    type="button"
                    className="btn-small"
                    onClick={() => setSameClientAddress(!sameClientAddress)}
                  >
                    {sameClientAddress && (
                      <i className="check-icon">&#10003;</i>
                    )}{" "}
                    Clique aqui para repetir o endereço do cliente
                  </button>
                </label>
              </div>
              {!sameClientAddress && (
                <>
                  <div className="form-field form-inline">
                    <div className="input-field--pretty">
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
                      disabled={obraCEP === ""}
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
                      <HiSearch /> Buscar pelo CEP
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
                  <div className="input-field--pretty">
                    <label htmlFor="obra-logradouro">Logradouro da obra</label>
                    <input
                      type="text"
                      id="obra-logradouro"
                      value={obraLogradouro}
                      onChange={(e) => setObraLogradouro(e.target.value)}
                    />
                  </div>
                  <div className="form-field form-inline">
                    <div className="input-field--pretty">
                      <label htmlFor="obra-numero">Número da obra</label>
                      <input
                        type="text"
                        id="obra-numero"
                        value={obraNumero}
                        onChange={(e) => setObraNumero(e.target.value)}
                      />
                    </div>
                    <div className="input-field--pretty">
                      <label htmlFor="obra-bairro">Bairro da obra</label>
                      <input
                        type="text"
                        id="obra-bairro"
                        value={obraBairro}
                        onChange={(e) => setObraBairro(e.target.value)}
                      />
                    </div>
                    <div className="input-field--pretty">
                      <label htmlFor="obra-complemento">Complemento</label>
                      <input
                        type="text"
                        id="obra-complemento"
                        value={obraComplemento}
                        onChange={(e) => setObraComplemento(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-field form-inline">
                    <div className="input-field--pretty">
                      <label htmlFor="obra-cidade">Cidade da obra</label>
                      <input
                        type="text"
                        id="obra-cidade"
                        value={obraCidade}
                        onChange={(e) => setObraCidade(e.target.value)}
                      />
                    </div>
                    <div className="input-field--pretty">
                      <StatesCombo
                        value={obraEstado}
                        onStateChange={setObraEstado}
                      />
                    </div>
                  </div>
                </>
              )}

              <button
                className="btn-default btn-submit"
                type="submit"
                onClick={handleProjectSubmit}
              >
                <HiFolderAdd /> Criar Projeto
              </button>
            </fieldset>
            {successMessage && (
              <FormMessages type="success">
                <p>{successMessage}</p>
              </FormMessages>
            )}
            {formErrors.length > 0 && (
              <div className="error-messages">
                {formErrors.map((error, index) => (
                  <FormMessages type="error">
                    <p key={index} className="error-text">
                      {error}
                    </p>
                  </FormMessages>
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
