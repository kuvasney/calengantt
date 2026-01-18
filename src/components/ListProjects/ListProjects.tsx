import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import {
  setHighlightedProject,
  clearHighlightedProject,
} from "../../stores/projectsSlice";
import SideWindow from "@components/SideWindow/SideWindow";
import type { ProjectItem } from "../../types/project";
import { formatDate } from "@/utils/dateFormatter";

import { HiEye, HiCalendar, HiUser, HiBriefcase } from "react-icons/hi";
import "./listProjects.scss";

export default function ListProjects() {
  const dispatch = useAppDispatch();
  const highlightedProject: ProjectItem | null = useAppSelector(
    (state) => state.projects.highlightedProject
  );
  const projects: ProjectItem[] = useAppSelector(
    (state) => state.projects.projectsList || []
  );
  const [showProjects, setShowProjects] = useState(false);

  const highlightProject = (project: ProjectItem) => {
    dispatch(setHighlightedProject(project));
    // Atualizar URL para deep linking
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("projectId", project.id.toString());
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.pushState(null, "", newUrl);
    setShowProjects(false);
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
          className="btn-default btn-show-projects"
          onClick={() => setShowProjects(!showProjects)}
        >
          <span className="icon">
            <HiBriefcase />
          </span>
          {showProjects ? "Ocultar Projetos" : "Todos os Projetos"}
        </button>

        {highlightedProject !== null && (
          <div className="filter-badge">
            <span className="filter-icon">🔍</span>
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

      <SideWindow
        isOpen={showProjects}
        onClose={() => setShowProjects(false)}
        position="left"
        title="Lista de Projetos"
      >
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
                }`}
              >
                <div className="project-card-header">
                  <h3 className="project-name">{project.projectName}</h3>
                  <span className="project-id">#{project.id}</span>
                </div>

                <div className="project-card-body">
                  <div className="project-info">
                    <span className="info-label">
                      <span className="icon">
                        <HiUser />
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
                        <HiCalendar />
                      </span>{" "}
                      Início
                    </span>
                    <span className="info-value">
                      {formatDate(project.startDate)}
                    </span>
                  </div>
                </div>

                <button
                  className="btn-highlight"
                  onClick={() => highlightProject(project)}
                >
                  {highlightedProject?.id === project.id ? (
                    <>
                      <span>✓</span> Selecionado
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
              </div>
            ))
          )}
        </div>
      </SideWindow>
    </div>
  );
}
