import api from './client';

export interface RiskAssessment {
  id: string;
  user_id?: string;
  digital_harm?: string;
  platform?: string;
  frequency?: string;
  safety_feeling?: number;
  escalating_risk?: string;
  can_block_report?: boolean;
  risk_level?: string;
  created_at?: string;
}

export interface RiskFilters {
  user_id?: string;
  limit?: number;
  offset?: number;
}

export const riskApi = {
  // Get all risk assessments
  getAll: async (filters?: RiskFilters): Promise<RiskAssessment[]> => {
    const params = new URLSearchParams();
    if (filters?.user_id) params.append('user_id', filters.user_id);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const query = params.toString();
    return api.get<RiskAssessment[]>(`/risk${query ? `?${query}` : ''}`);
  },

  // Get risk assessment by ID
  getById: async (id: string): Promise<RiskAssessment> => {
    return api.get<RiskAssessment>(`/risk/${id}`);
  },

  // Submit risk assessment
  submit: async (data: Omit<RiskAssessment, 'id' | 'risk_level' | 'created_at'>): Promise<RiskAssessment> => {
    return api.post<RiskAssessment>('/risk', data);
  },
};

