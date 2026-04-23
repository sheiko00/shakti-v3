import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import DashboardLayoutClient from '@/components/layout/DashboardLayoutClient';

async function getUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('shakti_access_token')?.value;

  if (!token) return null;

  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  // user.role from JWT is like "FOUNDER". We pass it as-is.
  return (
    <DashboardLayoutClient user={{ email: user.email, role: user.role }}>
      {children}
    </DashboardLayoutClient>
  );
}
