// src/api.ts
import {
  Student,
  Transaction,
  Product,
  CreateStudentData,
  AssignCoinsData,
  CreateProductData,
  PurchaseData,
} from "@/types";

const API_BASE_URL = "http://localhost:5000/api";

// Helper for API requests
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    console.error("API ERROR:", error); // 👈 log útil
    throw new Error(error.message || "Error en la solicitud");
  }

  return response.json();
}

// Students API
export const studentsApi = {
  getAll: (): Promise<Student[]> => apiRequest("/students"),

  getById: (id: string): Promise<Student> => apiRequest(`/students/${id}`),

  create: (data: CreateStudentData): Promise<Student> =>
    apiRequest("/students", {
      method: "POST",
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
      }),
    }),

  assignCoins: (data: AssignCoinsData): Promise<Student> =>
    apiRequest("/students/assign-coins", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getTransactions: (id: string): Promise<Transaction[]> =>
    apiRequest(`/students/${id}/transactions`),
};

// Store API
export const storeApi = {
  getProducts: (): Promise<Product[]> => apiRequest("/store/products"),

  createProduct: (data: CreateProductData): Promise<Product> =>
    apiRequest("/store/products", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  deleteProduct: (id: string): Promise<{ message: string }> =>
    apiRequest(`/store/products/${id}`, {
      method: "DELETE",
    }),

  purchase: (data: PurchaseData): Promise<{ message: string }> =>
    apiRequest("/store/purchase", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
