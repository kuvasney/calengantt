import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { useNavigate } from "react-router-dom";
import {
  clearHighlightedProject,
  setProjectsList,
} from "@/stores/projectsSlice";
import { translateProjectStatus } from "@/utils/normalizers";
import { useProjectsApi } from "@/hooks/useProjectsApi";
import SideWindow from "@components/SideWindow/SideWindow";
import ProjectDetails from "../ProjectDetails/ProjectDetails";
import { formatDate } from "@/utils/dateFormatter";
import type { ProjectItem } from "@/types/project";

import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineUser,
  HiFilter,
  HiTrash,
  HiOutlinePuzzle,
} from "react-icons/hi";
import "./listProjects.scss";

export default function ListProjects() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { deleteProject, getProjects } = useProjectsApi();
  const highlightedProject: ProjectItem | null = useAppSelector(
    (state) => state.projects.highlightedProject,
  );
  const projects: ProjectItem[] = useAppSelector(
    (state) => state.projects.projectsList || [],
  );

  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null,
  );
  // @Todo: essa feature precisa ser repensada para exibir o projeto destacado no calendario
  //
  // const highlightProject = (event: React.MouseEvent, project: ProjectItem) => {
  //   event.stopPropagation();
  //   dispatch(setHighlightedProject(project));
  //   // Atualizar URL para deep linking
  //   const urlParams = new URLSearchParams(window.location.search);
  //   urlParams.set("projectId", project.id.toString());
  //   const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
  //   window.history.pushState(null, "", newUrl);
  //   navigate("/calendar");
  // };

  const handleDeleteProject = async (project: ProjectItem) => {
    if (!project) {
      return;
    }
    confirm(`Tem certeza que deseja apagar o projeto ${project.projectName}?`);
    await deleteProject(project.id);
    const projects = await getProjects();
    dispatch(setProjectsList(projects));
  };

  const clearFilters = () => {
    dispatch(clearHighlightedProject());
    // Limpar URL
    const newUrl = window.location.pathname;
    window.history.pushState(null, "", newUrl);
  };

  return (
    <div className="list-projects">
      <div className="projects-header">
        <button
          className="btn-default"
          onClick={() => {
            navigate("/calendar");
          }}
        >
          <span className="icon">
            <HiOutlineCalendar />
          </span>
          Ir para o calendário
        </button>

        {highlightedProject !== null && (
          <div className="filter-badge">
            <span className="filter-icon">
              <HiFilter />
            </span>
            <span className="filter-text">{highlightedProject.clientName}</span>
            <button
              className="btn-clear-filter"
              onClick={() => clearFilters()}
              title="Limpar filtro"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div className="projects-container">
        {projects.length === 0 ? (
          <div className="empty-state">
            <p>Nenhum projeto encontrado</p>
          </div>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              className={`project-card ${
                highlightedProject?.id === project.id ? "active" : ""
              } ${project.status === "completed" ? "completed" : ""}`}
              onClick={() => setSelectedProject(project)}
            >
              <div className="project-card-header">
                <h3 className="project-name">{project.projectName}</h3>
                <span className="project-id">#{project.id}</span>
                <button
                  onClick={() => handleDeleteProject(project)}
                  className="btn-danger--alt"
                >
                  <span className="icon">
                    <HiTrash />
                  </span>
                  Apagar este projeto
                </button>
              </div>

              <div className="project-card-body">
                <div className="project-info">
                  <span className="info-label">
                    <span className="icon">
                      <HiOutlineUser />
                    </span>{" "}
                    Cliente
                  </span>
                  <span className="info-value">{project.clientName}</span>
                </div>
                {/* <div className="project-info">
                    <span className="info-label">
                      <span className="icon">
                        <HiPinAlt />
                      </span>{" "}
                      Endereço
                    </span>
                    <span className="info-value">
                      {project.projectAddress.street},{" "}
                      {project.projectAddress.number} -{" "}
                      {project.projectAddress.city}
                    </span>
                  </div> */}

                <div className="project-info">
                  <span className="info-label">
                    <span className="icon">
                      <HiOutlineCalendar />
                    </span>{" "}
                    Início planejado
                  </span>
                  <span className="info-value">
                    {formatDate(project.startDate)}
                  </span>
                </div>
                <div className="project-info">
                  <span className="info-label">
                    <span className="icon">
                      <HiOutlineCalendar />
                    </span>{" "}
                    Etapas
                  </span>
                  <dl className="info-dl">
                    {project.schedules.map((schedule) => (
                      <>
                        <dt className="info-value">
                          <HiOutlinePuzzle /> Etapa: {schedule.productStep.name}{" "}
                          <br />
                        </dt>
                        {schedule.actualStartDate && (
                          <dd>
                            <span className="info-value">
                              Início: {formatDate(schedule.actualStartDate)}
                            </span>
                          </dd>
                        )}
                        {schedule.actualEndDate && (
                          <dd>
                            <span className="info-value">
                              Término: {formatDate(schedule.actualEndDate)}
                            </span>
                          </dd>
                        )}
                      </>
                    ))}
                  </dl>
                </div>
                <div className="project-info">
                  <span className="info-label">
                    <span className="icon">
                      <HiOutlineClock />
                    </span>{" "}
                    Status
                  </span>
                  <span className="info-value">
                    {translateProjectStatus(project.status)}
                  </span>
                </div>
                {project.status === "completed" &&
                  (() => {
                    const lastSchedule =
                      project.schedules[project.schedules.length - 1];
                    return (
                      <div className="project-info">
                        <span className="info-label">
                          <span className="icon">
                            <HiOutlineCalendar />
                          </span>{" "}
                          Término:
                        </span>
                        <span className="info-value">
                          {lastSchedule?.actualEndDate &&
                            formatDate(lastSchedule.actualEndDate)}
                        </span>
                      </div>
                    );
                  })()}
              </div>
              {/* {project.status !== "completed" && (
                <button
                  className="btn-highlight"
                  onClick={(e) => highlightProject(e, project)}
                >
                  {highlightedProject?.id === project.id ? (
                    <>
                      <span className="icon">
                        <HiCheck />
                      </span>{" "}
                      Selecionado
                    </>
                  ) : (
                    <>
                      <span className="icon">
                        <HiEye />
                      </span>{" "}
                      Destacar no Calendário
                    </>
                  )}
                </button>
              )} */}
            </div>
          ))
        )}
      </div>

      {selectedProject && (
        <SideWindow
          isOpen={selectedProject !== null}
          onClose={() => setSelectedProject(null)}
          title={
            selectedProject ? `Projeto ${selectedProject.projectName}` : ""
          }
          position="left"
        >
          <ProjectDetails selectedProject={selectedProject} />
        </SideWindow>
      )}
    </div>
  );
}
