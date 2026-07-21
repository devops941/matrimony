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

export const deleteProfile = async (id: string) => {
  return api.delete(`/api/profiles/${id}`);
};

export const confirmMatchAPI = async (profileId1: string, profileId2: string) => {
  return api.post('/api/profiles/confirm-match', { profileId1, profileId2 });
};

export const undoMatchAPI = async (profileId1: string, profileId2: string) => {
  return api.post('/api/profiles/undo-match', { profileId1, profileId2 });
};
