export interface ProductStep {
  id: number;
  name: string;
  days: number;
  order: number;
}

export interface Product {
  id: number;
  value: string;
  label: string;
  steps: ProductStep[];
  idPosition?: number;
}
