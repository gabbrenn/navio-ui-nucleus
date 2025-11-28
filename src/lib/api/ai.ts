import api from './client';

export interface AIAnalysis {
  id: string;
  user_id?: string;
  input_text: string;
  analysis_result?: string;
  risk_level?: string;
  confidence_score?: number;
  created_at?: string;
}

export interface AIFilters {
  user_id?: string;
  limit?: number;
  offset?: number;
}

export const aiApi = {
  // Get all AI analyses
  getAll: async (filters?: AIFilters): Promise<AIAnalysis[]> => {
    const params = new URLSearchParams();
    if (filters?.user_id) params.append('user_id', filters.user_id);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const query = params.toString();
    return api.get<AIAnalysis[]>(`/ai${query ? `?${query}` : ''}`);
  },

  // Get AI analysis by ID
  getById: async (id: string): Promise<AIAnalysis> => {
    return api.get<AIAnalysis>(`/ai/${id}`);
  },

  // Analyze text and save result
  analyze: async (inputText: string, userId?: string): Promise<AIAnalysis> => {
    return api.post<AIAnalysis>('/ai/analyze', {
      input_text: inputText,
      user_id: userId,
    });
  },
};

