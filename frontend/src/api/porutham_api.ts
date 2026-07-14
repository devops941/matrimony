import api from '@/lib/api';

export interface PoruthamConfig {
  id: string;
  key: string;
  label: string;
  description: string;
  orderIndex: number;
  isEnabled: boolean;
}

export async function getPoruthams(): Promise<PoruthamConfig[]> {
  return api.get('/api/poruthams');
}

export async function updatePorutham(
  id: string,
  payload: { isEnabled: boolean }
): Promise<PoruthamConfig> {
  return api.put(`/api/poruthams/${id}`, payload);
}
