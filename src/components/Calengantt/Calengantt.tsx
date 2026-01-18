import { useState, useEffect, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/stores/hooks";
import { setHighlightedProject } from "@/stores/projectsSlice";

import type { ProjectItem } from "@/types/project";

import SideWindow from "@components/SideWindow/SideWindow";
import ProjectDetails from "../ProjectDetails/ProjectDetails";
import RefreshButton from "../RefreshButton/RefreshButton";

import "./calengantt.scss";

interface CalenganttProps {
  onRefresh: () => void;
  newProjectDate?: (date: Date) => void;
}

export default function Calengantt({
  onRefresh,
  newProjectDate,
}: CalenganttProps) {
  const projectsList: ProjectItem[] = useAppSelector(
    (state) => state.projects.projectsList || []
  );

  const dispatch = useAppDispatch();
  const highlightedProject = useAppSelector(
    (state) => state.projects.highlightedProject
  );
  const [daysToShow, setDaysToShow] = useState(5);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null
  );
  const today = useMemo(() => new Date(), []);
  const dayOfWeek = today.getDay(); // 0 = domingo, 1 = segunda, etc.

  // Criar mapeamento fixo de projeto -> posição baseado nos projetos visíveis no período
  const projectPositions = useMemo(() => {
    const positions = new Map<number, number>();
    const visibleProjects = new Set<number>();

    // Calcular o domingo anterior (ou o próprio dia se for domingo)
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - dayOfWeek);

    // Calcular total de dias a exibir (do domingo até daysToShow a partir de hoje)
    const totalDays = dayOfWeek + daysToShow;

    // Calcular data final do período
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + totalDays - 1);

    // Identificar todos os projetos que aparecem no período visível
    projectsList.forEach((project) => {
      if (!project.schedules || project.schedules.length === 0) return;

      // Pegar primeira e última data dos schedules
      const firstSchedule = project.schedules[0];
      const lastSchedule = project.schedules[project.schedules.length - 1];

      const projectStart = new Date(firstSchedule.plannedStartDate);
      const projectEnd = new Date(lastSchedule.plannedEndDate);

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
  }, [projectsList, today, dayOfWeek, daysToShow]);

  // const lastDay = today.getDate() + daysToShow;
  // const maxDate = new Date(today.getFullYear(), today.getMonth(), lastDay)
  //   .toISOString()
  //   .split("T")[0];

  const showProject = (projectId: number) => (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede o bubble
    const _project: ProjectItem | undefined = projectsList.find(
      (p) => p.id === projectId
    );
    if (_project) {
      setSelectedProject(_project);
    }
  };

  function handleCreateNewProject(date: Date) {
    newProjectDate?.(date);
  }

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
  }, [dispatch, projectsList]);

  return (
    <section>
      <div className="calengantt__controls">
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
        <div className="refresh-button-wrapper">
          <RefreshButton onClick={onRefresh} />
        </div>
      </div>
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

          {Array.from({ length: dayOfWeek + daysToShow }, (_, i) => {
            const startDate = new Date(today);
            startDate.setDate(today.getDate() - dayOfWeek);
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            const dayOfMonth = currentDate.getDate();
            const month = currentDate.toLocaleDateString("pt-BR", {
              month: "short",
            });
            const isToday = currentDate.toDateString() === today.toDateString();

            // Verificar quais projetos ocupam este dia
            let projectsInThisDay = projectsList.filter((project) => {
              if (!project.schedules || project.schedules.length === 0)
                return false;

              const firstSchedule = project.schedules[0];
              const lastSchedule =
                project.schedules[project.schedules.length - 1];

              const projectStart = new Date(firstSchedule.plannedStartDate);
              const projectEnd = new Date(lastSchedule.plannedEndDate);

              return currentDate >= projectStart && currentDate <= projectEnd;
            });

            // Se houver um projeto destacado, mostrar apenas ele
            if (highlightedProject !== null) {
              projectsInThisDay = projectsInThisDay.filter(
                (project) => project.id === highlightedProject.id
              );
            }

            return (
              <div
                key={i}
                className={`calendar-day ${isToday ? "today" : ""}`}
                onClick={() => handleCreateNewProject(currentDate)}
              >
                <div className={`day-info ${isToday ? "today" : ""}`}>
                  {dayOfMonth}/{month}
                </div>
                <div className="project-bars">
                  {projectsInThisDay.map((project) => {
                    // Identificar qual schedule está ativo neste dia
                    let currentSchedule = null;
                    let currentStepName = "";

                    if (project.schedules) {
                      currentSchedule = project.schedules.find((schedule) => {
                        const scheduleStart = new Date(
                          schedule.plannedStartDate
                        );
                        const scheduleEnd = new Date(schedule.plannedEndDate);
                        scheduleStart.setHours(0, 0, 0, 0);
                        scheduleEnd.setHours(23, 59, 59, 999);

                        return (
                          currentDate >= scheduleStart &&
                          currentDate <= scheduleEnd
                        );
                      });

                      if (currentSchedule) {
                        currentStepName = currentSchedule.productStep.name;
                      }
                    }

                    const position = projectPositions.get(project.id) ?? 0;
                    const topOffset = position * 28; // 24px height + 4px gap

                    return (
                      <div
                        key={project.id}
                        className={`project-bar ${
                          currentSchedule ? `step_${currentSchedule.id}` : ""
                        }`}
                        title={`${project.clientName} - ${project.projectName}${
                          currentStepName ? ` - ${currentStepName}` : ""
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
