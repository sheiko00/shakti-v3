import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Wrench, 
  Truck, 
  Megaphone, 
  Image as ImageIcon, 
  Settings 
} from 'lucide-react';

export type Role = 'FOUNDER' | 'OPERATIONS_MANAGER' | 'MARKETING_MANAGER' | 'SUPPLIER' | 'MEDIA_BUYER' | 'TEAM_MEMBER';

export interface NavItem {
  title: string;
  href: string;
  icon: any;
  allowedRoles: Role[] | 'ALL';
}

export const navigationConfig: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    allowedRoles: 'ALL',
  },
  {
    title: 'Products',
    href: '/dashboard/products',
    icon: Package,
    allowedRoles: ['FOUNDER', 'OPERATIONS_MANAGER', 'MARKETING_MANAGER'],
  },
  {
    title: 'Orders',
    href: '/dashboard/orders',
    icon: ShoppingCart,
    allowedRoles: ['FOUNDER', 'OPERATIONS_MANAGER', 'SUPPLIER'],
  },
  {
    title: 'Production',
    href: '/dashboard/production',
    icon: Wrench,
    allowedRoles: ['FOUNDER', 'OPERATIONS_MANAGER'],
  },
  {
    title: 'Suppliers',
    href: '/dashboard/suppliers',
    icon: Truck,
    allowedRoles: ['FOUNDER', 'OPERATIONS_MANAGER'],
  },
  {
    title: 'Marketing',
    href: '/dashboard/marketing',
    icon: Megaphone,
    allowedRoles: ['FOUNDER', 'MARKETING_MANAGER', 'MEDIA_BUYER'],
  },
  {
    title: 'Assets',
    href: '/dashboard/assets',
    icon: ImageIcon,
    allowedRoles: ['FOUNDER', 'MARKETING_MANAGER', 'MEDIA_BUYER', 'TEAM_MEMBER'],
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    allowedRoles: ['FOUNDER'],
  },
];
