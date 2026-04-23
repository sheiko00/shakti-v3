'use client';

import { Menu, Bell, Search } from 'lucide-react';
import { logout } from '@/actions/auth';
import { Role } from '@/config/navigation';

interface TopbarProps {
  setSidebarOpen: (isOpen: boolean) => void;
  user: {
    email: string;
    role: Role;
  };
}

export function Topbar({ setSidebarOpen, user }: TopbarProps) {
  return (
    <header className="h-16 border-b border-neutral-200 bg-white px-4 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 -ms-2 text-neutral-600 hover:bg-neutral-100 rounded-lg"
        >
          <Menu size={20} />
        </button>
        
        {/* Search - Hidden on small mobile */}
        <div className="hidden md:flex items-center gap-2 bg-neutral-100 px-3 py-1.5 rounded-full text-neutral-500 focus-within:ring-2 focus-within:ring-[#D4AF37]/50 focus-within:bg-white transition-all">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="bg-transparent border-none outline-none text-sm w-64 placeholder:text-neutral-400 text-neutral-900"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 text-neutral-600 hover:bg-neutral-100 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* User Menu Placeholder (To be expanded to a Dropdown) */}
        <div className="flex items-center gap-3 ms-2 ps-4 border-s border-neutral-200">
          <div className="hidden sm:block text-end">
            <p className="text-sm font-medium text-neutral-900 leading-none mb-1">{user.email.split('@')[0]}</p>
            <p className="text-[10px] text-neutral-500 uppercase tracking-wider">{user.role.replace('_', ' ')}</p>
          </div>
          <div className="w-9 h-9 bg-neutral-900 text-[#D4AF37] rounded-full flex items-center justify-center font-bold shadow-sm cursor-pointer" onClick={() => logout()}>
            {user.email.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
