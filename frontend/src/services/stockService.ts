import api from './api';
import { Stock, StockMovement, ApiResponse } from '../types';

export const stockService = {
  async getAllStocks(page: number = 1, limit: number = 10): Promise<ApiResponse<Stock[]>> {
    const response = await api.get<ApiResponse<Stock[]>>('/stock', {
      params: { page, limit }
    });
    return response.data;
  },

  async getStockByReference(referenceId: string): Promise<Stock> {
    const response = await api.get<ApiResponse<Stock>>(`/stock/reference/${referenceId}`);
    return response.data.data!;
  },

  async initializeStock(data: {
    reference: string;
    quantity: number;
  }): Promise<Stock> {
    const response = await api.post<ApiResponse<Stock>>('/stock/init', data);
    return response.data.data!;
  },

  async addStock(data: {
    reference: string;
    quantity: number;
    reason?: string;
  }): Promise<Stock> {
    const response = await api.post<ApiResponse<Stock>>('/stock/add', data);
    return response.data.data!;
  },

  async removeStock(data: {
    reference: string;
    quantity: number;
    reason?: string;
  }): Promise<Stock> {
    const response = await api.post<ApiResponse<Stock>>('/stock/remove', data);
    return response.data.data!;
  },

  async getStockMovements(referenceId: string, page: number = 1, limit: number = 20): Promise<ApiResponse<StockMovement[]>> {
    const response = await api.get<ApiResponse<StockMovement[]>>(`/stock/movements/${referenceId}`, {
      params: { page, limit }
    });
    return response.data;
  }
};
