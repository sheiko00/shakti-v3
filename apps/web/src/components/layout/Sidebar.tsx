'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navigationConfig, Role } from '@/config/navigation';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface SidebarProps {
  userRole: Role;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ userRole, isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  const filteredNav = navigationConfig.filter(
    (item) => item.allowedRoles === 'ALL' || item.allowedRoles.includes(userRole)
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 start-0 z-50 w-64 bg-neutral-950 border-e border-neutral-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto",
          isOpen ? "translate-x-0" : "-translate-x-full rtl:translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-neutral-900">
          <Link href="/dashboard" className="text-xl font-light tracking-widest text-white">
            SHAKTI <span className="text-[#D4AF37] text-sm">OS</span>
          </Link>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-neutral-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {filteredNav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                  isActive 
                    ? "bg-[#D4AF37]/10 text-[#D4AF37]" 
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-100"
                )}
              >
                <item.icon 
                  size={18} 
                  className={cn(
                    "transition-colors",
                    isActive ? "text-[#D4AF37]" : "text-neutral-500 group-hover:text-neutral-300"
                  )} 
                />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
