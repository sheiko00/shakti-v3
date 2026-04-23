'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { Role } from '@/config/navigation';

export default function DashboardLayoutClient({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { email: string; role: Role };
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 flex" dir="auto">
      <Sidebar 
        userRole={user.role} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar 
          setSidebarOpen={setIsSidebarOpen} 
          user={user} 
        />
        
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
