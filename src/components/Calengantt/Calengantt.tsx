import { useState, useEffect, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/stores/hooks";
import { setHighlightedProject } from "@/stores/projectsSlice";

import type { Project } from "@/types/project";
import type { Product } from "@/types/products";

import SideWindow from "@components/SideWindow/SideWindow";
import ProjectDetails from "../ProjectDetails/ProjectDetails";

import "./calengantt.scss";

export default function Calengantt() {
  const productsList: Product[] = useAppSelector(
    (state) => state.products.productsList || []
  );
  const projectsList: Project[] = useAppSelector(
    (state) => state.projects.projectsList || []
  );

  const dispatch = useAppDispatch();
  const highlightedProject = useAppSelector(
    (state) => state.projects.highlightedProject
  );
  const [daysToShow, setDaysToShow] = useState(5);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const today = new Date();

  // Calcular o domingo anterior (ou o próprio dia se for domingo)
  const startDate = new Date(today);
  const dayOfWeek = today.getDay(); // 0 = domingo, 1 = segunda, etc.
  startDate.setDate(today.getDate() - dayOfWeek);

  // Calcular total de dias a exibir (do domingo até daysToShow a partir de hoje)
  const totalDays = dayOfWeek + daysToShow;

  // Criar mapeamento fixo de projeto -> posição baseado nos projetos visíveis no período
  const projectPositions = useMemo(() => {
    const positions = new Map<number, number>();
    const visibleProjects = new Set<number>();

    // Calcular data final do período
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + totalDays - 1);

    // Identificar todos os projetos que aparecem no período visível
    projectsList.forEach((project) => {
      const projectStart = new Date(project.startDate);
      const product = productsList.find((p) => p.id === project.productId);
      if (!product) return;

      const projectEnd = new Date(projectStart);
      const productTotalDays = product.steps.reduce(
        (sum, step) => sum + step.days,
        0
      );
      projectEnd.setDate(projectStart.getDate() + productTotalDays - 1);

      // Verifica se o projeto aparece no período visível
      if (projectEnd >= startDate && projectStart <= endDate) {
        visibleProjects.add(project.id);
      }
    });

    // Ordenar projetos visíveis por ID e atribuir posições
    const sortedVisibleProjects = Array.from(visibleProjects).sort(
      (a, b) => a - b
    );
    sortedVisibleProjects.forEach((projectId, index) => {
      positions.set(projectId, index);
    });

    return positions;
  }, [projectsList, productsList, startDate, totalDays]);

  const lastDay = today.getDate() + daysToShow;
  const maxDate = new Date(today.getFullYear(), today.getMonth(), lastDay)
    .toISOString()
    .split("T")[0];

  const showProject = (projectId: number) => () => {
    console.log("show project", projectId);
    const _project: Project | undefined = projectsList.find(
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
      const project = projectsList.find((p) => p.id === projectId);
      if (project) {
        dispatch(setHighlightedProject(project));
      }
    }
  }, [dispatch]);

  return (
    <section>
      <form className="form-regular calengantt__days-to-show">
        <div className="form-field form-inline">
          <label htmlFor="daysToShow">Mostrar quantos dias: </label>
          <input
            type="number"
            id="daysToShow"
            value={daysToShow}
            onChange={(e) => setDaysToShow(Number(e.target.value))}
          />
        </div>
      </form>
      <section className="calendar">
        <div className="calengantt">
          <div
            className={`calendar-header ${dayOfWeek === 0 ? "activeday" : ""}`}
          >
            Dom
          </div>
          <div
            className={`calendar-header ${dayOfWeek === 1 ? "activeday" : ""}`}
          >
            Seg
          </div>
          <div
            className={`calendar-header ${dayOfWeek === 2 ? "activeday" : ""}`}
          >
            Ter
          </div>
          <div
            className={`calendar-header ${dayOfWeek === 3 ? "activeday" : ""}`}
          >
            Qua
          </div>
          <div
            className={`calendar-header ${dayOfWeek === 4 ? "activeday" : ""}`}
          >
            Qui
          </div>
          <div
            className={`calendar-header ${dayOfWeek === 5 ? "activeday" : ""}`}
          >
            Sex
          </div>
          <div
            className={`calendar-header ${dayOfWeek === 6 ? "activeday" : ""}`}
          >
            Sáb
          </div>

          {Array.from({ length: totalDays }, (_, i) => {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            const dayOfMonth = currentDate.getDate();
            const month = currentDate.toLocaleDateString("pt-BR", {
              month: "short",
            });
            const isToday = currentDate.toDateString() === today.toDateString();

            // Verificar quais projetos ocupam este dia
            let projectsInThisDay = projectsList.filter((project) => {
              const projectStart = new Date(project.startDate);
              const product = productsList.find(
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
                    const product = productsList.find(
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

                    const position = projectPositions.get(project.id) ?? 0;
                    const topOffset = position * 28; // 24px height + 4px gap

                    return (
                      <div
                        key={project.id}
                        className={`project-bar ${
                          currentStepId ? `step_${currentStepId}` : ""
                        }`}
                        title={`${project.clientName} - ${
                          productsList.find((p) => p.id === project.productId)
                            ?.label
                        }`}
                        style={{
                          backgroundColor: `hsla(${
                            project.id * 70
                          }, 80%, 70%, 0.8)`,
                          top: `${topOffset}px`,
                        }}
                        onClick={showProject(project.id)}
                      >
                        {project.projectName} -{" "}
                        {project.clientName.split(" ")[0]}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        {selectedProject && (
          <SideWindow
            isOpen={selectedProject !== null}
            onClose={() => setSelectedProject(null)}
            title={
              selectedProject ? `Projeto ${selectedProject.projectName}` : ""
            }
          >
            <ProjectDetails selectedProject={selectedProject} />
          </SideWindow>
        )}
      </section>
    </section>
  );
}
