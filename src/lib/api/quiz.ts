import api from './client';

export interface QuizResult {
  id: string;
  user_id?: string;
  quiz_id: string;
  quiz_title?: string;
  score: number;
  total_points: number;
  correct_answers: number;
  total_questions: number;
  completion_time?: number;
  answers?: unknown;
  created_at?: string;
}

export interface QuizStats {
  overall: {
    total_quizzes: number;
    total_points: number;
    total_correct: number;
    total_questions: number;
    average_score_percentage: number;
  };
  by_quiz: Array<{
    quiz_id: string;
    quiz_title: string;
    attempts: number;
    best_score: number;
    max_points: number;
    average_percentage: number;
  }>;
}

export interface QuizFilters {
  user_id?: string;
  quiz_id?: string;
  limit?: number;
  offset?: number;
}

export const quizApi = {
  // Get all quiz results
  getResults: async (filters?: QuizFilters): Promise<QuizResult[]> => {
    const params = new URLSearchParams();
    if (filters?.user_id) params.append('user_id', filters.user_id);
    if (filters?.quiz_id) params.append('quiz_id', filters.quiz_id);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const query = params.toString();
    return api.get<QuizResult[]>(`/quiz/results${query ? `?${query}` : ''}`);
  },

  // Get quiz result by ID
  getResultById: async (id: string): Promise<QuizResult> => {
    return api.get<QuizResult>(`/quiz/results/${id}`);
  },

  // Submit quiz result
  submitResult: async (data: Omit<QuizResult, 'id' | 'created_at'>): Promise<QuizResult> => {
    return api.post<QuizResult>('/quiz/results', data);
  },

  // Get user statistics
  getStats: async (userId: string): Promise<QuizStats> => {
    return api.get<QuizStats>(`/quiz/stats/${userId}`);
  },
};

