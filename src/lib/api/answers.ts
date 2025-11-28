import api from './client';

export interface Answer {
  id: string;
  question_id: string;
  session_id?: string;
  partner_id?: string;
  partner_name?: string;
  answer_text: string;
  is_verified?: boolean;
  helpful_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface AnswerFilters {
  question_id?: string;
  session_id?: string;
  limit?: number;
  offset?: number;
}

export const answersApi = {
  // Get all answers
  getAll: async (filters?: AnswerFilters): Promise<Answer[]> => {
    const params = new URLSearchParams();
    if (filters?.question_id) params.append('question_id', filters.question_id);
    if (filters?.session_id) params.append('session_id', filters.session_id);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const query = params.toString();
    return api.get<Answer[]>(`/answers${query ? `?${query}` : ''}`);
  },

  // Get answer by ID
  getById: async (id: string): Promise<Answer> => {
    return api.get<Answer>(`/answers/${id}`);
  },

  // Create new answer
  create: async (data: Omit<Answer, 'id' | 'created_at' | 'updated_at'>): Promise<Answer> => {
    return api.post<Answer>('/answers', data);
  },

  // Mark answer as helpful
  markHelpful: async (id: string): Promise<{ helpful_count: number }> => {
    return api.post<{ helpful_count: number }>(`/answers/${id}/helpful`);
  },

  // Verify answer
  verify: async (id: string, isVerified: boolean): Promise<Answer> => {
    return api.patch<Answer>(`/answers/${id}/verify`, { is_verified: isVerified });
  },

  // Update answer
  update: async (id: string, data: Partial<Answer>): Promise<Answer> => {
    return api.put<Answer>(`/answers/${id}`, data);
  },

  // Delete answer
  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/answers/${id}`);
  },
};

