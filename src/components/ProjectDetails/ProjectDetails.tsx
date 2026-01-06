import ProductsMock from "@/mocks/Products.json";
import { formatDate } from "@/utils/dateFormatter";
import type { Project } from "@/types/project";
import type { Product } from "@/types/products";

import Comments from "../Comments/Comments";

import "./ProjectDetails.scss";

export default function ProjectDetails({
  selectedProject,
}: {
  selectedProject: Project;
}) {
  const productsList: Product[] = ProductsMock;

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

  const product = productsList.find((p) => p.id === selectedProject.productId);

  return (
    <section className="project-details">
      <header className="project-header">
        <div className="project-title">
          <h2>{selectedProject.clientName}</h2>
          <span className="project-id">#{selectedProject.id}</span>
        </div>
        <div className="project-meta">
          <div className="meta-item">
            <span className="meta-label">Produto</span>
            <span className="meta-value">{product?.label}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Início</span>
            <span className="meta-value">
              {formatDate(selectedProject.startDate)}
            </span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Endereço</span>
            <span className="meta-value">{selectedProject.projectAddress}</span>
          </div>
        </div>
      </header>

      <div className="steps-section">
        <h3 className="section-title">Etapas do Projeto</h3>
        <div className="steps-timeline">
          {selectedProject.stepsProgress.map((stepProgress, index) => {
            const step = product?.steps.find(
              (s) => s.id === stepProgress.stepId
            );
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
                      <span>{formatDate(stepProgress.plannedStartDate)}</span>
                      <span className="date-separator">→</span>
                      <span>{formatDate(stepProgress.plannedEndDate)}</span>
                    </div>
                  </div>

                  {stepProgress.actualStartDate && (
                    <div className="date-group">
                      <span className="date-label">Real</span>
                      <div className="date-range">
                        <span>{formatDate(stepProgress.actualStartDate)}</span>
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
                  <span className="step-duration">
                    📅 {step?.days} {step?.days === 1 ? "dia" : "dias"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Comments selectedProject={selectedProject} />
    </section>
  );
}
