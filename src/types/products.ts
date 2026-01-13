export interface ProductStep {
  name: string;
  days: number;
  order: number;
}

export interface Product {
  id: number;
  userId: string;
  description: string;
  value: string;
  steps: ProductStep[];
  idPosition?: number;
}
