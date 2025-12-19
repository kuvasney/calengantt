import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import {
  setHighlightedProject,
  clearHighlightedProject,
} from "../../stores/projectsSlice";
import type { Project, Projects } from "../../types/project";

export default function ListProjects() {
  const dispatch = useAppDispatch();
  const highlightedProject: Project | null = useAppSelector(
    (state) => state.projects.highlightedProject
  );
  const [projects, setProjects] = useState<Project[]>([]);
  const [showProjects, setShowProjects] = useState(false);

  async function fetchProjects() {
    const url = "https://calengantt.com/api/projects";
    setProjects(await fetch(url).then((response) => response.json()));
  }

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
    fetchProjects().then((data) => {
      console.log("Fetched projects:", data);
    });
  }, []);

  return (
    <div className="list-projects">
      Lista de Projetos
      <button onClick={() => setShowProjects(!showProjects)}>
        {showProjects ? "Hide Projects" : "Show Projects"}
      </button>
      {highlightedProject !== null && (
        <p>
          Vendo apenas {highlightedProject.clientName}{" "}
          <button onClick={() => clearFilters()}>Limpar filtros</button>
        </p>
      )}
      {showProjects && (
        <div className="projects-container">
          {projects.map((project) => (
            <div key={project.id} className="project-item">
              <h3>{project.clientName}</h3>
              <p>{project.startDate}</p>
              <button onClick={() => highlightProject(project)}>
                Destacar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
