import api from './client';

export interface Question {
  id: string;
  session_id: string;
  user_id?: string;
  question_text: string;
  status?: string;
  upvotes?: number;
  answer_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface QuestionFilters {
  session_id?: string;
  status?: string;
  limit?: number;
  offset?: number;
}

export const questionsApi = {
  // Get all questions
  getAll: async (filters?: QuestionFilters): Promise<Question[]> => {
    const params = new URLSearchParams();
    if (filters?.session_id) params.append('session_id', filters.session_id);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const query = params.toString();
    return api.get<Question[]>(`/questions${query ? `?${query}` : ''}`);
  },

  // Get question by ID
  getById: async (id: string): Promise<Question> => {
    return api.get<Question>(`/questions/${id}`);
  },

  // Create new question
  create: async (data: Omit<Question, 'id' | 'created_at' | 'updated_at'>): Promise<Question> => {
    return api.post<Question>('/questions', data);
  },

  // Upvote question
  upvote: async (id: string): Promise<{ upvotes: number }> => {
    return api.post<{ upvotes: number }>(`/questions/${id}/upvote`);
  },

  // Update question status
  updateStatus: async (id: string, status: string): Promise<Question> => {
    return api.patch<Question>(`/questions/${id}/status`, { status });
  },

  // Delete question
  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/questions/${id}`);
  },
};

