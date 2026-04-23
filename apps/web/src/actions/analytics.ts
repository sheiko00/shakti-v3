'use server';

import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('shakti_access_token')?.value;
}

export async function getPerformanceMetrics() {
  const token = await getAuthToken();
  if (!token) return { error: 'Unauthorized' };

  try {
    const res = await fetch(`${API_URL}/analytics/performance`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 60 * 5 } // Cache for 5 minutes
    });
    if (!res.ok) throw new Error('Failed to fetch performance metrics');
    return await res.json();
  } catch (error) {
    return { error: 'Could not fetch performance metrics' };
  }
}
