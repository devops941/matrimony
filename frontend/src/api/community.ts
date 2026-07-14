// frontend/src/api/community.ts
import api from '@/lib/api';
import { CommunityInfo } from '@/types';

export async function getCommunities(): Promise<CommunityInfo[]> {
  return api.get('/api/communities');
}

export async function createCommunity(payload: { name: string }): Promise<CommunityInfo> {
  return api.post('/api/communities', payload);
}

export async function updateCommunity(id: string, payload: { name?: string; isActive?: boolean }): Promise<CommunityInfo> {
  return api.put(`/api/communities/${id}`, payload);
}

export async function deleteCommunity(id: string): Promise<{ message: string; id: string }> {
  return api.delete(`/api/communities/${id}`);
}
