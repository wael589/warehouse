import api from './api';
import { Reference, ApiResponse } from '../types';

export const referenceService = {
  async getReferences(page: number = 1, limit: number = 10, search?: string, category?: string): Promise<ApiResponse<Reference[]>> {
    const params: any = { page, limit };
    if (search) params.search = search;
    if (category) params.category = category;

    const response = await api.get<ApiResponse<Reference[]>>('/references', { params });
    return response.data;
  },

  async getReference(id: string): Promise<Reference> {
    const response = await api.get<ApiResponse<Reference>>(`/references/${id}`);
    return response.data.data!;
  },

  async createReference(data: {
    name: string;
    description?: string;
    category?: string;
  }): Promise<Reference> {
    const response = await api.post<ApiResponse<Reference>>('/references', data);
    return response.data.data!;
  },

  async updateReference(id: string, data: {
    name?: string;
    description?: string;
    category?: string;
  }): Promise<Reference> {
    const response = await api.put<ApiResponse<Reference>>(`/references/${id}`, data);
    return response.data.data!;
  },

  async deleteReference(id: string): Promise<void> {
    await api.delete(`/references/${id}`);
  }
};
