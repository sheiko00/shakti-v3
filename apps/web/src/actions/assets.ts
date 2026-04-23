'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get('shakti_access_token')?.value;
}

export async function getFolders(parentId?: string) {
  const token = await getAuthToken();
  if (!token) return { error: 'Unauthorized' };

  try {
    const url = parentId ? `${API_URL}/assets/folders?parentId=${parentId}` : `${API_URL}/assets/folders`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch folders');
    return await res.json();
  } catch (error) {
    return { error: 'Could not fetch folders' };
  }
}

export async function getAssets(folderId?: string) {
  const token = await getAuthToken();
  if (!token) return { error: 'Unauthorized' };

  try {
    const url = folderId ? `${API_URL}/assets?folderId=${folderId}` : `${API_URL}/assets`;
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Failed to fetch assets');
    return await res.json();
  } catch (error) {
    return { error: 'Could not fetch assets' };
  }
}

export async function createFolder(name: string, parentId?: string) {
  const token = await getAuthToken();
  if (!token) return { error: 'Unauthorized' };

  try {
    const res = await fetch(`${API_URL}/assets/folders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, parentId }),
    });

    if (!res.ok) throw new Error('Failed to create folder');
    
    revalidatePath(`/dashboard/assets`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function uploadAsset(data: any) {
  const token = await getAuthToken();
  if (!token) return { error: 'Unauthorized' };

  try {
    const res = await fetch(`${API_URL}/assets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Failed to upload asset');
    
    revalidatePath(`/dashboard/assets`);
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
