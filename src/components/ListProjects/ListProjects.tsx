import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import {
  setHighlightedProject,
  clearHighlightedProject,
} from "../../stores/projectsSlice";
import SideWindow from "@components/SideWindow/SideWindow";
import type { Project } from "../../types/project";
import { formatDate } from "@/utils/dateFormatter";

import "./listProjects.scss";

export default function ListProjects() {
  const dispatch = useAppDispatch();
  const highlightedProject: Project | null = useAppSelector(
    (state) => state.projects.highlightedProject
  );
  const [projects, setProjects] = useState<Project[]>([]);
  const [showProjects, setShowProjects] = useState(false);

  const highlightProject = (project: Project) => {
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

  useEffect(() => {
    const loadProjects = async () => {
      const url = "https://calengantt.com/api/projects";
      const data = await fetch(url).then((response) => response.json());
      setProjects(data);
    };

    loadProjects();
  }, []);

  return (
    <div className="list-projects">
      <div className="projects-header">
        <button
          className="btn-default btn-show-projects"
          onClick={() => setShowProjects(!showProjects)}
        >
          <span className="btn-icon">📋</span>
          <span className="btn-text">
            {showProjects ? "Ocultar Projetos" : "Todos os Projetos"}
          </span>
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
                  <h3 className="project-name">{project.clientName}</h3>
                  <span className="project-id">#{project.id}</span>
                </div>

                <div className="project-card-body">
                  <div className="project-info">
                    <span className="info-label">📍 Endereço</span>
                    <span className="info-value">{project.projectAddress}</span>
                  </div>

                  <div className="project-info">
                    <span className="info-label">📅 Data de Início</span>
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
                      <span>👁</span> Destacar no Calendário
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
