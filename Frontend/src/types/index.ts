export interface Student {
  _id: string;
  firstName: string;
  lastName: string;
  coins: number;
  transactions?: Transaction[];
}

export interface Transaction {
  type: "compra" | "notas" | "manual";
  amount: number;
  description: string;
  date: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  stock?: number;
}

export interface CreateStudentData {
  firstName: string;
  lastName: string;
}

export interface AssignCoinsData {
  studentId: string;
  grade: number;
}

export interface CreateProductData {
  name: string;
  price: number;
  description?: string;
  stock?: number;
}

export interface PurchaseData {
  studentId: string;
  productId: string;
}
