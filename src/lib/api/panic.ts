import api from './client';

export interface PanicInfo {
  id: string;
  user_id: string;
  full_name?: string;
  id_number?: string;
  blood_type?: string;
  medical_conditions?: string;
  emergency_hotline?: string;
  trusted_friend?: string;
  legal_support?: string;
  digital_violence_helpline?: string;
  emergency_contact_name?: string;
  emergency_contact_relation?: string;
  emergency_contact_phone?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const panicApi = {
  // Get panic info for authenticated user
  get: async (): Promise<PanicInfo> => {
    return api.get<PanicInfo>('/panic');
  },

  // Create or update panic info
  upsert: async (data: Omit<PanicInfo, 'id' | 'created_at' | 'updated_at'>): Promise<PanicInfo> => {
    return api.post<PanicInfo>('/panic', data);
  },

  // Update panic info
  update: async (data: Partial<PanicInfo>): Promise<PanicInfo> => {
    return api.put<PanicInfo>('/panic', data);
  },

  // Deactivate panic info
  deactivate: async (): Promise<void> => {
    return api.delete<void>('/panic');
  },
};

