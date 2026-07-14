import { Category } from "./category";

export interface Product {
  _id: string;

  name: string;

  description?: string;

  category: string | Category;

  price: number;

  stock: number;

  unit: string;

  image: string;

  isActive: boolean;

  createdAt: string;

  updatedAt: string;
}