import { useEffect, useState } from "react";
import { useProjectsApi } from "@/hooks/useProjectsApi";
import { formatDate } from "@/utils/dateFormatter";
import { useAppSelector } from "@/stores/hooks";
import Skeleton from "./Skeleton";
import type { Project, Comments as CommentsType } from "@/types/project";
import type { Product } from "@/types/products";

import { CgCalendarDates, CgCheckR } from "react-icons/cg";

import Comments from "../Comments/Comments";

import "./ProjectDetails.scss";

export default function ProjectDetails({
  selectedProject,
}: {
  selectedProject: Project;
}) {
  const { getProject, getProjectComments } = useProjectsApi();
  const productsList: Product[] = useAppSelector(
    (state) => state.products.productsList || []
  );
  const [project, setProject] = useState<Project | null>(null);
  const [comments, setComments] = useState<CommentsType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  function translateStatus(status: string): string {
    switch (status) {
      case "not_started":
        return "Não Iniciado";
      case "pending":
        return "Pendente";
      case "in_progress":
        return "Em Progresso";
      case "completed":
        return "Concluído";
      default:
        return status;
    }
  }

  useEffect(() => {
    async function fetchProject() {
      setLoading(true);
      try {
        const [projectData, commentsData] = await Promise.all([
          getProject(selectedProject.id),
          getProjectComments(selectedProject.id),
        ]);
        setProject(projectData);
        setComments(commentsData);
      } catch (error) {
        console.error("Erro ao carregar o projeto:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [selectedProject, getProject, getProjectComments]);

  if (!selectedProject) {
    return <div>Nenhum projeto selecionado.</div>;
  }

  if (loading) {
    return <Skeleton />;
  }

  return (
    <>
      {project && (
        <section className="project-details">
          <header className="project-header">
            <div className="project-title">
              <h2>{project.projectName}</h2>
              <span className="project-id">#{project.id}</span>
            </div>
            <div className="project-meta">
              <div className="meta-item">
                <span className="meta-label">Cliente</span>
                <span className="meta-value">{project.clientName}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Produto</span>
                <span className="meta-value">
                  {
                    productsList.find(
                      (product) => product.id === project.productId
                    )?.label
                  }
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Início</span>
                <span className="meta-value">
                  {formatDate(project.startDate)}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Endereço</span>
                <span className="meta-value">
                  {project.projectAddress.street}
                </span>
              </div>
            </div>
            <Comments selectedProject={project} comments={comments} />
          </header>

          <div className="steps-section">
            <h3 className="section-title">Etapas do Projeto</h3>
            <div className="steps-timeline">
              {project.stepsProgress.map((stepProgress, index) => {
                const step = productsList
                  .find((product) => product.id === project.productId)
                  ?.steps.find((s) => s.id === stepProgress.stepId);
                const statusClass = stepProgress.status.replace("_", "-");

                return (
                  <div
                    key={stepProgress.stepId}
                    className={`step-card status-${statusClass}`}
                  >
                    <div className="step-header">
                      <div className="step-number">{index + 1}</div>
                      <div className="step-info">
                        <h4 className="step-name">{step?.name}</h4>
                        <span className={`step-status ${statusClass}`}>
                          {translateStatus(stepProgress.status)}
                        </span>
                      </div>
                    </div>

                    <div className="step-dates">
                      <div className="date-group">
                        <span className="date-label">Planejado</span>
                        <div className="date-range">
                          <span>
                            {formatDate(stepProgress.plannedStartDate)}
                          </span>
                          <span className="date-separator">→</span>
                          <span>{formatDate(stepProgress.plannedEndDate)}</span>
                        </div>
                      </div>

                      {stepProgress.actualStartDate && (
                        <div className="date-group">
                          <span className="date-label">Real</span>
                          <div className="date-range">
                            <span>
                              {formatDate(stepProgress.actualStartDate)}
                            </span>
                            {stepProgress.actualEndDate && (
                              <>
                                <span className="date-separator">→</span>
                                <span>
                                  {formatDate(stepProgress.actualEndDate)}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="step-footer">
                      <span className="step-duration iconic">
                        <span className="icon">
                          <CgCalendarDates />
                        </span>{" "}
                        {step?.days} {step?.days === 1 ? "dia" : "dias"}
                      </span>
                    </div>
                    <Comments
                      selectedProject={project}
                      stepId={stepProgress.stepId}
                      comments={comments}
                    />
                    {stepProgress.status !== "completed" && (
                      <button
                        className="btn-default step-action-button iconic"
                        type="button"
                      >
                        <span className="icon">
                          <CgCheckR />
                        </span>
                        Finalizar Etapa
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
