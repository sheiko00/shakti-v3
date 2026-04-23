'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('shakti_access_token')?.value;
}

export async function getShipments(status?: string) {
  const token = await getAuthToken();
  if (!token) return { error: 'Unauthorized' };

  try {
    const query = new URLSearchParams();
    if (status && status !== 'ALL') query.append('status', status);

    const res = await fetch(`${API_URL}/shipping?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch shipments');
    return await res.json();
  } catch (error) {
    return { error: 'Could not fetch shipments' };
  }
}

export async function createShipment(data: any) {
  const token = await getAuthToken();
  if (!token) return { error: 'Unauthorized' };

  try {
    const res = await fetch(`${API_URL}/shipping`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Failed to create shipment');
    }
    
    revalidatePath(`/dashboard/shipping`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateShipmentStatus(shipmentId: string, status: string) {
  const token = await getAuthToken();
  if (!token) return { error: 'Unauthorized' };

  try {
    const res = await fetch(`${API_URL}/shipping/${shipmentId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) throw new Error('Failed to update status');
    
    revalidatePath(`/dashboard/shipping`);
    revalidatePath(`/dashboard/orders`); // Due to sync
    return { success: true };
  } catch (error) {
    return { error: 'Failed to update shipment status' };
  }
}
