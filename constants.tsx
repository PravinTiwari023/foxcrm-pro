import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Kanban, 
  PhoneCall 
} from 'lucide-react';
import { NavItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    iconName: 'LayoutDashboard',
    priority: 'primary',
    path: '/'
  },
  {
    id: 'leads',
    label: 'Leads',
    iconName: 'Users',
    priority: 'primary',
    path: '/leads'
  },
  {
    id: 'pipeline',
    label: 'Pipeline',
    iconName: 'Kanban',
    priority: 'primary',
    path: '/pipeline'
  },
  {
    id: 'follow_up',
    label: 'Follow Up',
    iconName: 'PhoneCall',
    priority: 'secondary',
    path: '/follow-up'
  }
];

export const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  Users,
  Kanban,
  PhoneCall
};