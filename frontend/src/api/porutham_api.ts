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

export async function getMatchCandidates(profileId: string): Promise<any[]> {
  return api.get(`/api/poruthams/match-candidates?profile_id=${profileId}`);
}

export async function calculateTwoStars(brideStar: string, groomStar: string): Promise<any> {
  return api.get(`/api/poruthams/calculate?bride_star=${encodeURIComponent(brideStar)}&groom_star=${encodeURIComponent(groomStar)}`);
}
