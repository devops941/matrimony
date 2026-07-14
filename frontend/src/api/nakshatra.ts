import api from '@/lib/api';

export async function getNakshatraMatrix(): Promise<{ matrix: number[][]; isCustomized: boolean }> {
  return api.get('/api/nakshatra-matrix');
}

export async function updateNakshatraMatrix(matrix: number[][]): Promise<{ matrix: number[][]; isCustomized: boolean }> {
  return api.put('/api/nakshatra-matrix', { matrix });
}

export async function resetNakshatraMatrix(): Promise<{ matrix: number[][]; isCustomized: boolean; message: string }> {
  return api.post('/api/nakshatra-matrix/reset');
}
