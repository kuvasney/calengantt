export interface ProductStep {
  name: string;
  days: number;
  order?: number;
}

export interface Product {
  id: number;
  userId: number;
  description: string;
  value: string;
  steps: ProductStep[];
  idPosition?: number;
  createdAt?: string;
  updatedAt?: string;
}
