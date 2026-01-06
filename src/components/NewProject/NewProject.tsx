import { useState } from "react";
import ProductsMock from "../../mocks/Products.json";
import SideWindow from "../SideWindow/SideWindow";
import StatesCombo from "../StatesCombo";

import "./newProject.scss";

export default function NewProject() {
  const Products = ProductsMock;
  const [showProjects, setShowProjects] = useState(false);
  const [sameClientAddress, setSameClientAddress] = useState(false);

  return (
    <>
      <button
        className="btn-default btn-new-project"
        onClick={() => setShowProjects(true)}
      >
        Criar Novo Projeto
      </button>
      <SideWindow
        isOpen={showProjects}
        onClose={() => setShowProjects(false)}
        position="left"
        title="Lista de Projetos"
      >
        <section>
          <h2 className="project-title">Criar Projeto</h2>
          <form className="form-regular form-add_project">
            <fieldset>
              <legend>Dados de identificação</legend>
              <div className="form-field">
                <label htmlFor="clientName">Nome do cliente</label>
                <input type="text" id="clientName" className="input-regular" />
              </div>
              <div className="form-field">
                <label htmlFor="projectName">Nome do projeto</label>
                <input type="text" id="projectName" className="input-regular" />
              </div>
            </fieldset>
            <fieldset>
              <legend>Endereço do cliente</legend>
              <div className="form-field size2-field">
                <label htmlFor="cep">CEP do cliente</label>
                <input type="text" id="cep" />
                <button className="btn-default">Buscar pelo CEP</button>
              </div>
              <div className="form-field">
                <label htmlFor="logradouro">Logradouro</label>
                <input type="text" id="logradouro" />
              </div>
              <div className="form-field size2-field">
                <label htmlFor="numero">Número</label>
                <input type="text" id="numero" />
              </div>
              <div className="form-field size3-field">
                <label htmlFor="bairro">Bairro</label>
                <input type="text" id="bairro" />
              </div>
              <div className="form-field size3-field">
                <label htmlFor="complemento">Complemento</label>
                <input type="text" id="complemento" />
              </div>
              <div className="form-field size3-field">
                <label htmlFor="cidade">Cidade</label>
                <input type="text" id="cidade" />
              </div>
              <div className="form-field size2-field">
                <StatesCombo />
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
                {!sameClientAddress && (
                  <>
                    <div className="form-field size2-field">
                      <label htmlFor="obra-cep">CEP da obra</label>
                      <input type="text" id="obra-cep" />
                      <button className="btn-default">Buscar pelo CEP</button>
                    </div>
                    <div className="form-field">
                      <label htmlFor="obra-logradouro">
                        Logradouro da obra
                      </label>
                      <input type="text" id="obra-logradouro" />
                    </div>
                    <div className="form-field size2-field">
                      <label htmlFor="obra-numero">Número da obra</label>
                      <input type="text" id="obra-numero" />
                    </div>
                    <div className="form-field size3-field">
                      <label htmlFor="obra-bairro">Bairro da obra</label>
                      <input type="text" id="obra-bairro" />
                    </div>
                    <div className="form-field size3-field">
                      <label htmlFor="obra-complemento">Complemento</label>
                      <input type="text" id="obra-complemento" />
                    </div>
                    <div className="form-field size3-field">
                      <label htmlFor="obra-cidade">Cidade da obra</label>
                      <input type="text" id="obra-cidade" />
                    </div>
                    <div className="form-field size2-field">
                      <StatesCombo />
                    </div>
                  </>
                )}
              </div>
              <div className="form-field size2-field">
                <label htmlFor="projectProduct">Produto</label>
                <select id="projectProduct">
                  {Products.map((product) => (
                    <option key={product.value} value={product.value}>
                      {product.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field size2-field">
                <label htmlFor="startDate">Data de Início</label>
                <input type="date" id="startDate" />
              </div>
              <button className="btn-default btn-submit" type="submit">
                Criar Projeto
              </button>
            </fieldset>
          </form>
        </section>
      </SideWindow>
    </>
  );
}
