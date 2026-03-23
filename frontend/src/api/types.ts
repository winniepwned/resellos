export interface User {
  id: string;
  email: string;
  displayName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  barcode: string;
  name: string;
  brands: string;
  imageUrl?: string;
}

export interface PaginatedResponse<T> {
  results: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail: string;
}
