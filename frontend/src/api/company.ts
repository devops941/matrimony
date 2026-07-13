import api from '@/lib/api';
import type { CompanyProfile } from '@/types';

export async function getCompanyProfile(): Promise<CompanyProfile> {
  return api.get('/api/company');
}

export async function createCompanyProfile(data: CompanyProfile): Promise<CompanyProfile> {
  return api.post('/api/company', data);
}

export async function updateCompanyProfile(data: Partial<CompanyProfile>): Promise<CompanyProfile> {
  return api.put('/api/company', data);
}
