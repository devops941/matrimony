import api from '@/lib/api';
import { Profile } from '../types';

export async function getProfiles(): Promise<Profile[]> {
  return api.get('/api/profiles');
}

export async function createProfile(payload: Omit<Profile, 'id'>): Promise<Profile> {
  return api.post('/api/profiles', payload);
}

export async function updateProfile(
  id: string,
  payload: Partial<Profile>
): Promise<Profile> {
  return api.put(`/api/profiles/${id}`, payload);
}

export async function deleteProfile(id: string): Promise<{ message: string; id: string }> {
  return api.delete(`/api/profiles/${id}`);
}
