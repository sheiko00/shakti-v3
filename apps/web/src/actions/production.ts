'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('shakti_access_token')?.value;
}

export async function getProductionBatches(status?: string) {
  const token = await getAuthToken();
  if (!token) return { error: 'Unauthorized' };

  try {
    const query = new URLSearchParams();
    if (status && status !== 'ALL') query.append('status', status);

    const res = await fetch(`${API_URL}/production?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch production batches');
    return await res.json();
  } catch (error) {
    return { error: 'Could not fetch production batches' };
  }
}

export async function createProductionBatch(data: any) {
  const token = await getAuthToken();
  if (!token) return { error: 'Unauthorized' };

  try {
    const res = await fetch(`${API_URL}/production`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Failed to create batch');
    
    revalidatePath(`/dashboard/production`);
    revalidatePath(`/dashboard/orders`); // Because orders move to IN_PRODUCTION
    return { success: true };
  } catch (error) {
    return { error: 'Failed to create production batch' };
  }
}

export async function updateProductionStatus(batchId: string, status: string) {
  const token = await getAuthToken();
  if (!token) return { error: 'Unauthorized' };

  try {
    const res = await fetch(`${API_URL}/production/${batchId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) throw new Error('Failed to update status');
    
    revalidatePath(`/dashboard/production/${batchId}`);
    revalidatePath(`/dashboard/production`);
    if (status === 'COMPLETED') revalidatePath(`/dashboard/orders`);
    return { success: true };
  } catch (error) {
    return { error: 'Failed to update production batch status' };
  }
}
