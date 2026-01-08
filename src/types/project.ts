type projectStatus = "planned" | "in_progress" | "completed";

export interface ProjectData {
  projectName: string;
  clientName: string;
  clientAddress: {
    zipCode: string;
    street: string;
    number: string;
    neighborhood: string;
    complement?: string;
    city: string;
    state: string;
  };
  obraAddress: {
    zipCode: string;
    street: string;
    number: string;
    neighborhood: string;
    complement?: string;
    city: string;
    state: string;
  };
  product: string;
  startDate: string;
  status?: projectStatus;
}

export interface StepProgress {
  stepId: number;
  status: "completed" | "in_progress" | "pending";
  actualStartDate?: string;
  actualEndDate?: string;
  plannedStartDate: string;
  plannedEndDate: string;
}

export interface Address {
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  number: string;
  complement?: string;
}

export interface Project {
  id: number;
  clientName: string;
  projectAddress: Address;
  projectName: string;
  productId: number;
  startDate: string;
  stepsProgress: StepProgress[];
}

export interface Comments {
  id: number;
  projectId: number;
  stepId: number;
  userId: number;
  userName: string;
  createdAt: string;
  text: string[];
}

export type Projects = Project[];
