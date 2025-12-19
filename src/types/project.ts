export interface StepProgress {
  stepId: number;
  status: "completed" | "in_progress" | "pending";
  actualStartDate?: string;
  actualEndDate?: string;
  plannedStartDate: string;
  plannedEndDate: string;
}

export interface Project {
  id: number;
  clientName: string;
  projectAddress: string;
  productId: number;
  startDate: string;
  stepsProgress: StepProgress[];
}

export type Projects = Project[];
