import type { ProductStep } from "./products";

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
  productId: number;
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
  clientAddress: Address;
  obraAddress: Address;
  projectName: string;
  productId: number;
  product?: {
    id: number;
    value: string;
    description: string;
    steps: ProductStep[];
  };
  startDate: string;
  status: projectStatus;
  schedules: Schedules[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Schedules {
  id: number;
  plannedStartDate: string;
  plannedEndDate: string;
  actualStartDate: string | null;
  actualEndDate: string | null;
  status: "pending" | "in_progress" | "completed";
  productStep: ProductStep;
}

export interface ProjectItem {
  id: number;
  projectName: string;
  clientName: string;
  startDate: string;
  status: projectStatus;
  productId: number;
  schedules: Schedules[];
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
