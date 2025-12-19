import { useState, useEffect } from "react";
import ProjectsMock from "../../mocks/Projects.json";
import ProductsMock from "../../mocks/Products.json";
import CommentsMock from "../../mocks/Comments.json";
import { useAppSelector, useAppDispatch } from "../../stores/hooks";
import { setHighlightedProject } from "../../stores/projectsSlice";

import type { Project, Projects } from "../../types/project";

import "./calengantt.scss";

export default function Calengantt() {
  const dispatch = useAppDispatch();
  const highlightedProject = useAppSelector(
    (state) => state.projects.highlightedProject
  );
  const [daysToShow, setDaysToShow] = useState(30);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const today = new Date();

  // Calcular o domingo anterior (ou o próprio dia se for domingo)
  const startDate = new Date(today);
  const dayOfWeek = today.getDay(); // 0 = domingo, 1 = segunda, etc.
  startDate.setDate(today.getDate() - dayOfWeek);

  // Calcular total de dias a exibir (do domingo até daysToShow a partir de hoje)
  const totalDays = dayOfWeek + daysToShow;

  const lastDay = today.getDate() + daysToShow;
  const maxDate = new Date(today.getFullYear(), today.getMonth(), lastDay)
    .toISOString()
    .split("T")[0];

  const showProject = (projectId: number) => () => {
    console.log("show project", projectId);
    const _project: Project | undefined = ProjectsMock.find(
      (p) => p.id === projectId
    );
    if (_project) {
      setSelectedProject(_project);
    }
  };

  // Ler URL apenas no carregamento inicial da página
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const projectIdParam = urlParams.get("projectId");
    if (projectIdParam) {
      const projectId = parseInt(projectIdParam, 10);
      const project = ProjectsMock.find((p) => p.id === projectId);
      if (project) {
        dispatch(setHighlightedProject(project));
      }
      console.log("Highlighting project ID from URL:", projectId);
    }
  }, [dispatch]);

  return (
    <section>
      <p>
        Mostrar quantos dias:{" "}
        <input
          type="number"
          value={daysToShow}
          onChange={(e) => setDaysToShow(Number(e.target.value))}
        />
      </p>
      <section className="calendar">
        <div className="calengantt">
          <div className="calendar-header">Dom</div>
          <div className="calendar-header">Seg</div>
          <div className="calendar-header">Ter</div>
          <div className="calendar-header">Qua</div>
          <div className="calendar-header">Qui</div>
          <div className="calendar-header">Sex</div>
          <div className="calendar-header">Sáb</div>

          {Array.from({ length: totalDays }, (_, i) => {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            const dayOfMonth = currentDate.getDate();
            const month = currentDate.toLocaleDateString("pt-BR", {
              month: "short",
            });
            const isToday = currentDate.toDateString() === today.toDateString();

            // Verificar quais projetos ocupam este dia
            let projectsInThisDay = ProjectsMock.filter((project) => {
              const projectStart = new Date(project.startDate);
              const product = ProductsMock.find(
                (p) => p.id === project.productId
              );
              if (!product) return false;

              const projectEnd = new Date(projectStart);
              const productTotalDays = product.steps.reduce(
                (sum, step) => sum + step.days,
                0
              );
              projectEnd.setDate(projectStart.getDate() + productTotalDays - 1);

              return currentDate >= projectStart && currentDate <= projectEnd;
            });

            // Se houver um projeto destacado, mostrar apenas ele
            if (highlightedProject !== null) {
              projectsInThisDay = projectsInThisDay.filter(
                (project) => project.id === highlightedProject.id
              );
            }

            return (
              <div key={i} className={`calendar-day ${isToday ? "today" : ""}`}>
                <div className={`day-info ${isToday ? "today" : ""}`}>
                  {dayOfMonth}/{month}
                </div>
                <div className="project-bars">
                  {projectsInThisDay.map((project) => {
                    const product = ProductsMock.find(
                      (p) => p.id === project.productId
                    );

                    // Identificar qual step está ativo neste dia
                    let currentStepId = null;
                    if (product) {
                      const projectStart = new Date(project.startDate);
                      projectStart.setHours(0, 0, 0, 0);
                      let accumulatedDays = 0;

                      for (const step of product.steps) {
                        const stepStart = new Date(projectStart);
                        stepStart.setDate(
                          projectStart.getDate() + accumulatedDays
                        );
                        stepStart.setHours(0, 0, 0, 0);

                        const stepEnd = new Date(stepStart);
                        stepEnd.setDate(stepStart.getDate() + step.days - 1);
                        stepEnd.setHours(23, 59, 59, 999);

                        if (
                          currentDate >= stepStart &&
                          currentDate <= stepEnd
                        ) {
                          currentStepId = step.id;
                          break;
                        }

                        accumulatedDays += step.days;
                      }
                    }

                    return (
                      <div
                        key={project.id}
                        className={`project-bar ${
                          currentStepId ? `step_${currentStepId}` : ""
                        }`}
                        title={`${project.clientName} - ${
                          ProductsMock.find((p) => p.id === project.productId)
                            ?.label
                        }`}
                        style={{
                          backgroundColor: `hsla(${
                            project.id * 70
                          }, 80%, 70%, 0.8)`,
                        }}
                        onClick={showProject(project.id)}
                      >
                        {project.clientName.split(" ")[0]}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        {selectedProject !== null && (
          <section className="project-details">
            <button
              className="project-details__close"
              onClick={() => setSelectedProject(null)}
            >
              Fechar
            </button>
            <h2>Detalhes do Projeto {selectedProject.id}</h2>
            {/* Aqui você pode adicionar mais detalhes do projeto selecionado */}
            <p>Cliente: {selectedProject.clientName}</p>
            <p>
              Produto:{" "}
              {
                ProductsMock.find((p) => p.id === selectedProject.productId)
                  ?.label
              }
            </p>
            <p>Data de Início: {selectedProject.startDate}</p>
            <p>Progresso dos Passos:</p>
            {/** INCLUIR DATA DE CADA ETAPA COM A POSSIBILIDADE DE ALTERAR */}
            <ul>
              {selectedProject.stepsProgress.map((stepProgress) => {
                const step = ProductsMock.find(
                  (p) => p.id === selectedProject.productId
                )?.steps.find((s) => s.id === stepProgress.stepId);
                return (
                  <li key={stepProgress.stepId}>
                    <p>{step?.name}:</p>
                    <p>Status atual: {stepProgress.status}</p>
                    <p>
                      Data de Início Planejada: {stepProgress.plannedStartDate}
                    </p>
                    <p>
                      Data de Término Planejada: {stepProgress.plannedEndDate}
                    </p>
                  </li>
                );
              })}
            </ul>
            <p>Comentários:</p>
            <ul>
              {CommentsMock.filter(
                (comment) => comment.projectId === selectedProject.id
              ).map((comment) => (
                <li key={comment.id}>
                  <strong>{comment.userName}</strong> (
                  {new Date(comment.createdAt).toLocaleDateString("pt-BR")}):{" "}
                  {comment.text}
                </li>
              ))}
            </ul>
          </section>
        )}
      </section>
    </section>
  );
}
