function translateProjectStatus(status: string): string {
  switch (status) {
    case "planned":
      return "Em progresso";
    case "completed":
      return "Concluído";
    default:
      return status;
  }
}

export { translateProjectStatus };
