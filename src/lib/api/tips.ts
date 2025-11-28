import api from './client';

export interface Tip {
  id: string;
  partner_id?: string;
  partner_name?: string;
  title: string;
  category: string;
  content: string;
  target_audience?: string;
  priority?: string;
  estimated_impact?: string;
  tags?: string[];
  status?: string;
  views_count?: number;
  likes_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface TipFilters {
  category?: string;
  status?: string;
  partner_id?: string;
  limit?: number;
  offset?: number;
}

export const tipsApi = {
  // Get all tips
  getAll: async (filters?: TipFilters): Promise<Tip[]> => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.partner_id) params.append('partner_id', filters.partner_id);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const query = params.toString();
    return api.get<Tip[]>(`/tips${query ? `?${query}` : ''}`);
  },

  // Get tip by ID
  getById: async (id: string): Promise<Tip> => {
    return api.get<Tip>(`/tips/${id}`);
  },

  // Create new tip
  create: async (data: Omit<Tip, 'id' | 'created_at' | 'updated_at'>): Promise<Tip> => {
    return api.post<Tip>('/tips', data);
  },

  // Update tip
  update: async (id: string, data: Partial<Tip>): Promise<Tip> => {
    return api.put<Tip>(`/tips/${id}`, data);
  },

  // Like a tip
  like: async (id: string): Promise<{ likes_count: number }> => {
    return api.post<{ likes_count: number }>(`/tips/${id}/like`);
  },

  // Delete tip
  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/tips/${id}`);
  },
};

