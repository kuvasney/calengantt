import { useEffect, useState } from "react";
import { useProjectsApi } from "@/hooks/useProjectsApi";
import { formatDate } from "@/utils/dateFormatter";
import Skeleton from "./Skeleton";
import type { Project, ProjectItem, Address, Schedules } from "@/types/project";

import { CgCalendarDates, CgCheckR, CgPen } from "react-icons/cg";

import EditFieldModal from "../EditFieldModal/EditFieldModal";
import EditAddressModal from "../EditAddressModal/EditAddressModal";

import "./ProjectDetails.scss";
import "../EditFieldModal/EditFieldModal.scss";

export default function ProjectDetails({
  selectedProject,
}: {
  selectedProject: ProjectItem;
}) {
  const { getProject, updateProject, updateStepStatus } = useProjectsApi();
  const [project, setProject] = useState<Project | null>(null);
  // const [comments, setComments] = useState<CommentsType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [editClientName, setEditClientName] = useState(false);
  const [editProjectName, setEditProjectName] = useState(false);
  const [editAddress, setEditAddress] = useState(false);

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

  const handleSaveClientName = async (value: string) => {
    if (!project) return;
    await updateProject(project.id, { clientName: value });
    setProject({ ...project, clientName: value });
  };

  const handleSaveProjectName = async (value: string) => {
    if (!project) return;
    await updateProject(project.id, { projectName: value });
    setProject({ ...project, projectName: value });
  };

  const handleSaveAddress = async (address: Address) => {
    if (!project) return;
    await updateProject(project.id, { obraAddress: address });
    setProject({ ...project, obraAddress: address });
  };

  const handleFinishStep = async (schedule: Schedules) => {
    if (!project) return;

    try {
      // Atualiza o status da etapa no backend (recalcula automaticamente as próximas)
      await updateStepStatus(
        project.id,
        schedule.id,
        "completed",
        new Date().toISOString()
      );

      // Recarrega o projeto completo para mostrar as datas recalculadas
      const updatedProject = await getProject(project.id);
      setProject(updatedProject);
    } catch (error) {
      console.error("Erro ao finalizar etapa:", error);
    }
  };

  useEffect(() => {
    async function fetchProject() {
      setLoading(true);
      try {
        const projectData = await getProject(selectedProject.id);
        setProject(projectData);
      } catch (error) {
        console.error("Erro ao carregar o projeto:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [selectedProject, getProject]);

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
              <h2>
                {project.projectName}{" "}
                <button
                  className="btn-edit"
                  onClick={() => setEditProjectName(true)}
                  type="button"
                >
                  <CgPen />
                </button>
              </h2>
              <span className="project-id">#{project.id}</span>
            </div>
            <div className="project-meta">
              <div className="meta-item">
                <span className="meta-label">Cliente</span>
                <span className="meta-value editable-field">
                  {project.clientName}{" "}
                  <button
                    className="btn-edit"
                    onClick={() => setEditClientName(true)}
                    type="button"
                  >
                    <CgPen />
                  </button>
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Produto</span>
                <span className="meta-value editable-field">
                  {project.product?.value}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Início</span>
                <span className="meta-value">
                  {formatDate(project.startDate)}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Endereço da Obra</span>
                <span className="meta-value editable-field">
                  {project.obraAddress.street}, {project.obraAddress.number} -{" "}
                  {project.obraAddress.city}, {project.obraAddress.state}{" "}
                  {project.obraAddress.zipCode}{" "}
                  <button
                    className="btn-edit"
                    onClick={() => setEditAddress(true)}
                    type="button"
                  >
                    <CgPen />
                  </button>
                </span>
              </div>
            </div>
          </header>

          <div className="steps-section">
            <h3 className="section-title">Etapas do Projeto</h3>
            <div className="steps-timeline">
              {project.schedules?.map((schedule, index) => {
                const step = schedule.productStep;
                const statusClass = schedule.status.replace("_", "-");

                return (
                  <div
                    key={schedule.id}
                    className={`step-card status-${statusClass}`}
                  >
                    <div className="step-header">
                      <div className="step-number">{index + 1}</div>
                      <div className="step-info">
                        <h4 className="step-name">{step.name}</h4>
                        <span className={`step-status ${statusClass}`}>
                          {translateStatus(schedule.status)}
                        </span>
                      </div>
                    </div>

                    <div className="step-dates">
                      <div className="date-group">
                        <span className="date-label">Planejado</span>
                        <div className="date-range">
                          <span>{formatDate(schedule.plannedStartDate)}</span>
                          <span className="date-separator">→</span>
                          <span>{formatDate(schedule.plannedEndDate)}</span>
                        </div>
                      </div>

                      {schedule.actualStartDate && (
                        <div className="date-group">
                          <span className="date-label">Real</span>
                          <div className="date-range">
                            <span>{formatDate(schedule.actualStartDate)}</span>
                            {schedule.actualEndDate && (
                              <>
                                <span className="date-separator">→</span>
                                <span>
                                  {formatDate(schedule.actualEndDate)}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="step-footer">
                      <span className="step-duration">
                        <span className="icon">
                          <CgCalendarDates />
                        </span>{" "}
                        {step.days} {step.days === 1 ? "dia" : "dias"}
                      </span>
                    </div>
                    {schedule.status !== "completed" && (
                      <button
                        className="btn-default step-action-button"
                        type="button"
                        onClick={() => handleFinishStep(schedule)}
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

      {project && (
        <>
          <EditFieldModal
            isOpen={editClientName}
            onClose={() => setEditClientName(false)}
            onSave={handleSaveClientName}
            title="Editar Nome do Cliente"
            fieldLabel="Nome"
            currentValue={project.clientName}
          />

          <EditFieldModal
            isOpen={editProjectName}
            onClose={() => setEditProjectName(false)}
            onSave={handleSaveProjectName}
            title="Editar Nome do Projeto"
            fieldLabel="Nome do Projeto"
            currentValue={project.projectName}
          />

          <EditAddressModal
            isOpen={editAddress}
            onClose={() => setEditAddress(false)}
            onSave={handleSaveAddress}
            currentAddress={project.obraAddress}
          />
        </>
      )}
    </>
  );
}
