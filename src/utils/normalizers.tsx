function translateProjectStatus(status: string): string {
  switch (status) {
    case "planned":
      return "Não iniciado";
    case "in_progress":
      return "Em progresso";
    case "completed":
      return "Concluído";
    default:
      return status;
  }
}

export { translateProjectStatus };
