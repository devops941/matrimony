import api from '@/lib/api';

export interface JobCategory {
  id: string;
  name: string;
  isActive: boolean;
}

export async function getJobCategories(): Promise<JobCategory[]> {
  return api.get('/api/job-categories');
}

export async function createJobCategory(payload: { name: string }): Promise<JobCategory> {
  return api.post('/api/job-categories', payload);
}

export async function updateJobCategory(
  id: string,
  payload: { name?: string; isActive?: boolean }
): Promise<JobCategory> {
  return api.put(`/api/job-categories/${id}`, payload);
}

export async function deleteJobCategory(id: string): Promise<{ message: string; id: string }> {
  return api.delete(`/api/job-categories/${id}`);
}
