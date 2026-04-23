'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('shakti_access_token')?.value;
}

export async function getFinanceDashboard() {
  const token = await getAuthToken();
  if (!token) return { error: 'Unauthorized' };

  try {
    const res = await fetch(`${API_URL}/finance/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard summary');
    return await res.json();
  } catch (error) {
    return { error: 'Could not fetch dashboard summary' };
  }
}

export async function getExpenses(category?: string, status?: string) {
  const token = await getAuthToken();
  if (!token) return { error: 'Unauthorized' };

  try {
    const query = new URLSearchParams();
    if (category && category !== 'ALL') query.append('category', category);
    if (status && status !== 'ALL') query.append('status', status);

    const res = await fetch(`${API_URL}/finance/expenses?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch expenses');
    return await res.json();
  } catch (error) {
    return { error: 'Could not fetch expenses' };
  }
}

export async function createExpense(data: any) {
  const token = await getAuthToken();
  if (!token) return { error: 'Unauthorized' };

  try {
    const res = await fetch(`${API_URL}/finance/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Failed to create expense');
    
    revalidatePath(`/dashboard/finance`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getPayouts(status?: string) {
  const token = await getAuthToken();
  if (!token) return { error: 'Unauthorized' };

  try {
    const query = new URLSearchParams();
    if (status && status !== 'ALL') query.append('status', status);

    const res = await fetch(`${API_URL}/finance/payouts?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch payouts');
    return await res.json();
  } catch (error) {
    return { error: 'Could not fetch payouts' };
  }
}
