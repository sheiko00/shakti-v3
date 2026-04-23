'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('shakti_access_token')?.value;
}

export async function getCampaigns(status?: string, channel?: string) {
  const token = await getAuthToken();
  if (!token) return { error: 'Unauthorized' };

  try {
    const query = new URLSearchParams();
    if (status && status !== 'ALL') query.append('status', status);
    if (channel && channel !== 'ALL') query.append('channel', channel);

    const res = await fetch(`${API_URL}/marketing/campaigns?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch campaigns');
    return await res.json();
  } catch (error) {
    return { error: 'Could not fetch campaigns' };
  }
}

export async function createCampaign(data: any) {
  const token = await getAuthToken();
  if (!token) return { error: 'Unauthorized' };

  try {
    const res = await fetch(`${API_URL}/marketing/campaigns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Failed to create campaign');
    
    revalidatePath(`/dashboard/marketing`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getPromoCodes(campaignId?: string) {
  const token = await getAuthToken();
  if (!token) return { error: 'Unauthorized' };

  try {
    const query = new URLSearchParams();
    if (campaignId) query.append('campaignId', campaignId);

    const res = await fetch(`${API_URL}/marketing/promo-codes?${query.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch promo codes');
    return await res.json();
  } catch (error) {
    return { error: 'Could not fetch promo codes' };
  }
}

export async function createPromoCode(data: any) {
  const token = await getAuthToken();
  if (!token) return { error: 'Unauthorized' };

  try {
    const res = await fetch(`${API_URL}/marketing/promo-codes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Failed to create promo code');
    
    revalidatePath(`/dashboard/marketing`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
