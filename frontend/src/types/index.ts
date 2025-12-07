export interface User {
  id: string;
  username: string;
  email: string;
  role: 'administrateur' | 'gestionnaire' | 'magasinier' | 'consultant';
  isActive?: boolean;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface Reference {
  _id: string;
  referenceNumber: string;
  name: string;
  description?: string;
  category?: string;
  createdBy: {
    _id: string;
    username: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Component {
  _id: string;
  reference: {
    _id: string;
    referenceNumber: string;
    name: string;
  };
  indice: string;
  name: string;
  description?: string;
  specifications?: string;
  createdBy: {
    _id: string;
    username: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Stock {
  _id: string;
  reference: {
    _id: string;
    referenceNumber: string;
    name: string;
    category?: string;
  };
  quantity: number;
  lastUpdatedBy?: {
    _id: string;
    username: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  _id: string;
  reference: {
    _id: string;
    referenceNumber: string;
    name: string;
  };
  type: 'IN' | 'OUT' | 'INIT';
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason?: string;
  createdBy: {
    _id: string;
    username: string;
  };
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
  pagination?: Pagination;
  count?: number;
}
