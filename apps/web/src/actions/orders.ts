'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('shakti_access_token')?.value;
}

export async function getOrders(status?: string, page = 1) {
  const token = await getAuthToken();
  if (!token) return { error: 'Unauthorized' };

  try {
    const query = new URLSearchParams();
    if (status && status !== 'ALL') query.append('status', status);
    query.append('page', page.toString());

    const res = await fetch(`${API_URL}/orders?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    
    // Controller returns { data, meta }
    const result = await res.json();
    return result;
  } catch (error) {
    return { error: 'Could not fetch orders' };
  }
}

export async function getOrder(id: string) {
  const token = await getAuthToken();
  if (!token) return { error: 'Unauthorized' };

  try {
    const res = await fetch(`${API_URL}/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch order details');
    return await res.json();
  } catch (error) {
    return { error: 'Could not fetch order' };
  }
}

export async function updateOrderStatus(orderId: string, status: string, notes: string) {
  const token = await getAuthToken();
  if (!token) return { error: 'Unauthorized' };

  try {
    const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status, notes }),
    });

    if (!res.ok) throw new Error('Failed to update status');
    
    revalidatePath(`/dashboard/orders/${orderId}`);
    revalidatePath(`/dashboard/orders`);
    return { success: true };
  } catch (error) {
    return { error: 'Failed to update order status' };
  }
}
