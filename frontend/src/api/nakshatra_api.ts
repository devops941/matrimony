import api from '@/lib/api';

export interface CustomNakshatra {
  id: string;
  name: string;
  isActive: boolean;
}

export async function getCustomNakshatras(): Promise<CustomNakshatra[]> {
  return api.get('/api/nakshatras');
}

export async function createCustomNakshatra(payload: {
  name: string;
}): Promise<CustomNakshatra> {
  return api.post('/api/nakshatras', payload);
}

export async function updateCustomNakshatra(
  id: string,
  payload: { name?: string; isActive?: boolean }
): Promise<CustomNakshatra> {
  return api.put(`/api/nakshatras/${id}`, payload);
}

export async function deleteCustomNakshatra(id: string): Promise<{ message: string; id: string }> {
  return api.delete(`/api/nakshatras/${id}`);
}
