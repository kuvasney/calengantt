import { useState, useEffect, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/stores/hooks";
import { setHighlightedProject } from "@/stores/projectsSlice";

import type { ProjectItem } from "@/types/project";

import SideWindow from "@components/SideWindow/SideWindow";
import ProjectDetails from "@/components/Projects/ProjectDetails/ProjectDetails";
import RefreshButton from "@/components/RefreshButton/RefreshButton";

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
    (state) => state.projects.projectsList || [],
  );

  const dispatch = useAppDispatch();
  const highlightedProject = useAppSelector(
    (state) => state.projects.highlightedProject,
  );
  const [daysToShow, setDaysToShow] = useState(30);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null,
  );

  // Filtrar projetos abertos (status !== "completed")
  const openedProjectsList: ProjectItem[] = useMemo(
    () => projectsList.filter((project) => project.status !== "completed"),
    [projectsList],
  );

  // Ordenar projetos abertos por data de início
  const projectsListSortedByDate: ProjectItem[] = useMemo(
    () =>
      [...openedProjectsList].sort(
        (a, b) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      ),
    [openedProjectsList],
  );

  // Pega a data de início do projeto mais antigo aberto
  const firstProjectStartDate =
    projectsListSortedByDate.length > 0
      ? new Date(projectsListSortedByDate[0].startDate)
      : new Date();

  firstProjectStartDate.setHours(0, 0, 0, 0);

  const today = useMemo(() => new Date(), []);
  const dayOfWeek = today.getDay(); // 0 = domingo, 1 = segunda, etc.

  // calcular daysToShow automatico baseado no projeto mais antigo ainda nao completed
  const _diffDaysToShowTodayMs =
    today.getTime() - firstProjectStartDate.getTime();

  const diffDaysToShowToday = useMemo(() => {
    const days = Math.ceil(_diffDaysToShowTodayMs / (1000 * 60 * 60 * 24)) + 7;
    return days < 1 ? 7 : days;
  }, [_diffDaysToShowTodayMs]);

  // Criar mapeamento fixo de projeto -> posição baseado nos projetos visíveis no período
  const projectPositions = useMemo(() => {
    const positions = new Map<number, number>();
    const visibleProjects = new Set<number>();

    // Calcular o domingo anterior (ou o próprio dia se for domingo)
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - dayOfWeek);
    startDate.setHours(0, 0, 0, 0); // Normalize para meia-noite local

    // Calcular total de dias a exibir (do domingo até daysToShow a partir de hoje)
    const totalDays = dayOfWeek + diffDaysToShowToday;

    // Calcular data final do período
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + totalDays - 1);
    endDate.setHours(23, 59, 59, 999); // Normalize para fim do dia

    // Identificar todos os projetos abertos que aparecem no período visível
    openedProjectsList.forEach((project) => {
      if (!project.schedules || project.schedules.length === 0) return;

      // Pegar primeira e última data dos schedules
      const firstSchedule = project.schedules[0];
      const lastSchedule = project.schedules[project.schedules.length - 1];

      const projectStart = new Date(firstSchedule.plannedStartDate);
      const projectEnd = new Date(lastSchedule.plannedEndDate);

      // Normalize para evitar bugs de fuso horário
      projectStart.setHours(0, 0, 0, 0);
      projectEnd.setHours(23, 59, 59, 999);

      // Verifica se o projeto aparece no período visível
      if (projectEnd >= startDate && projectStart <= endDate) {
        visibleProjects.add(project.id);
      }
    });

    // Ordenar projetos visíveis por ID e atribuir posições
    const sortedVisibleProjects = Array.from(visibleProjects).sort(
      (a, b) => a - b,
    );
    sortedVisibleProjects.forEach((projectId, index) => {
      positions.set(projectId, index);
    });

    return positions;
  }, [openedProjectsList, today, dayOfWeek, diffDaysToShowToday]);

  const showProject = (projectId: number) => (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede o bubble
    const _project: ProjectItem | undefined = projectsList.find(
      (p) => p.id === projectId,
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

  // Atualize diffDaysToShowToday sempre que os projetos mudarem
  useEffect(() => {
    setDaysToShow(diffDaysToShowToday);
  }, [diffDaysToShowToday]);

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
            const startDate = new Date(firstProjectStartDate);
            startDate.setDate(startDate.getDate() - dayOfWeek);
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            const dayOfMonth = currentDate.getDate();
            const month = currentDate.toLocaleDateString("pt-BR", {
              month: "short",
            });
            const isToday = currentDate.toDateString() === today.toDateString();

            // Verificar quais projetos abertos ocupam este dia
            let projectsInThisDay = openedProjectsList.filter((project) => {
              if (!project.schedules || project.schedules.length === 0)
                return false;

              const firstSchedule = project.schedules[0];
              const lastSchedule =
                project.schedules[project.schedules.length - 1];

              const projectStart = new Date(firstSchedule.plannedStartDate);
              const projectEnd = new Date(lastSchedule.plannedEndDate);

              // Normalize para meia-noite local (ignora horas para evitar bugs de fuso)
              projectStart.setHours(0, 0, 0, 0);
              projectEnd.setHours(23, 59, 59, 999);

              return currentDate >= projectStart && currentDate <= projectEnd;
            });

            // Se houver um projeto destacado, mostrar apenas ele
            if (highlightedProject !== null) {
              projectsInThisDay = projectsInThisDay.filter(
                (project) => project.id === highlightedProject.id,
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
                    let currentStepIndex = 0;
                    if (project.schedules) {
                      currentSchedule = project.schedules.find(
                        (schedule, index) => {
                          currentStepIndex = index;
                          const scheduleStart = new Date(
                            schedule.plannedStartDate,
                          );
                          const scheduleEnd = new Date(schedule.plannedEndDate);
                          scheduleStart.setHours(0, 0, 0, 0);
                          scheduleEnd.setHours(23, 59, 59, 999);

                          return (
                            currentDate >= scheduleStart &&
                            currentDate <= scheduleEnd
                          );
                        },
                      );

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
                          borderColor: `hsla(${
                            currentStepIndex * 90
                          }, 80%, 70%, 1)`,
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
