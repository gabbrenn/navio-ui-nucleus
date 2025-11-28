import api from './client';

export interface Campaign {
  id: string;
  partner_id?: string;
  partner_name?: string;
  title: string;
  description: string;
  campaign_type?: string;
  target_audience?: string;
  start_date?: string;
  end_date?: string;
  platforms?: string[];
  budget?: string;
  goals?: string;
  kpis?: string[];
  keywords?: string[];
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CampaignFilters {
  status?: string;
  partner_id?: string;
  limit?: number;
  offset?: number;
}

export const campaignsApi = {
  // Get all campaigns
  getAll: async (filters?: CampaignFilters): Promise<Campaign[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.partner_id) params.append('partner_id', filters.partner_id);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const query = params.toString();
    return api.get<Campaign[]>(`/campaigns${query ? `?${query}` : ''}`);
  },

  // Get campaign by ID
  getById: async (id: string): Promise<Campaign> => {
    return api.get<Campaign>(`/campaigns/${id}`);
  },

  // Create new campaign
  create: async (data: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>): Promise<Campaign> => {
    return api.post<Campaign>('/campaigns', data);
  },

  // Update campaign
  update: async (id: string, data: Partial<Campaign>): Promise<Campaign> => {
    return api.put<Campaign>(`/campaigns/${id}`, data);
  },

  // Delete campaign
  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/campaigns/${id}`);
  },
};

