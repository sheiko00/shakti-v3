'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function login(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return { error: 'Invalid credentials' };
    }

    const data = await response.json();
    
    // Store tokens securely in HTTP-only cookies
    const cookieStore = await cookies();
    cookieStore.set('shakti_access_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60, // 15 minutes
    });

    cookieStore.set('shakti_refresh_token', data.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

  } catch (error) {
    return { error: 'Something went wrong. Please try again.' };
  }

  redirect('/dashboard');
}

export async function logout() {
  const cookieStore = await cookies();
  const token = cookieStore.get('shakti_access_token')?.value;

  if (token) {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (e) {
      // Ignore errors on logout
    }
  }

  cookieStore.delete('shakti_access_token');
  cookieStore.delete('shakti_refresh_token');
  redirect('/login');
}
