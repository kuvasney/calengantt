import { useState } from "react";
import Projects from "./mocks/Projects.json";
import Products from "./mocks/Products.json";
import Comments from "./mocks/Comments.json";
import ListProjects from "./components/ListProjects/ListProjects";
import Calengantt from "./components/Calengantt/Calengantt";
import "./App.css";

function App() {
  return (
    <>
      <h1>Calengantt</h1>
      <ListProjects />

      {/* <section>
        <p>Criar Projeto</p>
        <form>
          <div>Dados base do Cliente</div>
          <div>
            <label htmlFor="clientName">Nome do cliente</label>
            <input type="text" id="clientName" />
          </div>
          <div>
          
            <label htmlFor="clientAddress">Endereço do cliente</label>
            <input type="text" id="clientAddress" />
          </div>
          <div>Dados base do Projeto</div>
          <div>
            <label htmlFor="projectAddress">
              Endereço da Obra <button>Usar endereço do cliente</button>
            </label>
            <input type="text" id="projectAddress" />
          </div>
          <div>
            <label htmlFor="projectProduct">Produto</label>
            <select id="projectProduct">
              {Products.map((product) => (
                <option key={product.value} value={product.value}>
                  {product.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="startDate">Data de Início</label>
            <input type="date" id="startDate" />
          </div>
        </form>
      </section>
      */}
      <Calengantt />
    </>
  );
}

export default App;
