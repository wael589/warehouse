import api from './api';
import { Component, ApiResponse } from '../types';

export const componentService = {
  async getComponentsByReference(referenceId: string): Promise<Component[]> {
    const response = await api.get<ApiResponse<Component[]>>(`/components/reference/${referenceId}`);
    return response.data.data!;
  },

  async getComponent(id: string): Promise<Component> {
    const response = await api.get<ApiResponse<Component>>(`/components/${id}`);
    return response.data.data!;
  },

  async createComponent(data: {
    reference: string;
    indice: string;
    name: string;
    description?: string;
    specifications?: string;
  }): Promise<Component> {
    const response = await api.post<ApiResponse<Component>>('/components', data);
    return response.data.data!;
  },

  async updateComponent(id: string, data: {
    name?: string;
    description?: string;
    specifications?: string;
  }): Promise<Component> {
    const response = await api.put<ApiResponse<Component>>(`/components/${id}`, data);
    return response.data.data!;
  },

  async deleteComponent(id: string): Promise<void> {
    await api.delete(`/components/${id}`);
  }
};
