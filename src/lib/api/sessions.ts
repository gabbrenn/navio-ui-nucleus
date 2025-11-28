import api from './client';

export interface Session {
  id: string;
  partner_id?: string;
  partner_name?: string;
  title: string;
  description: string;
  session_type?: string;
  topic?: string;
  max_participants?: number;
  duration?: string;
  scheduled_date?: string;
  scheduled_time?: string;
  facilitator?: string;
  target_audience?: string;
  expected_outcomes?: string;
  engagement_metrics?: string[];
  resources?: string[];
  tags?: string[];
  status?: string;
  participant_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SessionFilters {
  status?: string;
  partner_id?: string;
  limit?: number;
  offset?: number;
}

export const sessionsApi = {
  // Get all sessions
  getAll: async (filters?: SessionFilters): Promise<Session[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.partner_id) params.append('partner_id', filters.partner_id);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const query = params.toString();
    return api.get<Session[]>(`/sessions${query ? `?${query}` : ''}`);
  },

  // Get session by ID
  getById: async (id: string): Promise<Session> => {
    return api.get<Session>(`/sessions/${id}`);
  },

  // Create new session
  create: async (data: Omit<Session, 'id' | 'created_at' | 'updated_at'>): Promise<Session> => {
    return api.post<Session>('/sessions', data);
  },

  // Update session
  update: async (id: string, data: Partial<Session>): Promise<Session> => {
    return api.put<Session>(`/sessions/${id}`, data);
  },

  // Join session
  join: async (id: string): Promise<{ participant_count: number }> => {
    return api.post<{ participant_count: number }>(`/sessions/${id}/join`);
  },

  // Delete session
  delete: async (id: string): Promise<void> => {
    return api.delete<void>(`/sessions/${id}`);
  },
};

