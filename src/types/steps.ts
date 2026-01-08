export type StepStatus = "completed" | "in_progress" | "pending";

export interface StepProgress {
  stepId: number;
  status: StepStatus;
  actualStartDate?: string;
  actualEndDate?: string;
  plannedStartDate: string;
  plannedEndDate: string;
}

export interface StepsProgressResponse {
  id: number;
  clientId: number;
  stepsProgress: StepProgress[];
}
