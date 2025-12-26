import { LucideIcon } from 'lucide-react';

export type NavId = 'dashboard' | 'leads' | 'pipeline' | 'follow_up';

export interface NavItem {
  id: NavId;
  label: string;
  iconName: string;
  priority: 'primary' | 'secondary';
  path: string;
}

export interface MetricCardProps {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
}

export type LeadTemp = 'Hot' | 'Warm' | 'Cold';

export interface LeadHistoryItem {
  id: string;
  type: 'Call' | 'Email' | 'Meeting' | 'Note' | 'WhatsApp' | 'System';
  date: string;
  summary: string;
  user?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost' | 'Waiting';
  source: 'Zillow' | 'Facebook' | 'Referral' | 'Website' | 'Direct';
  lastActive: string;
  budget: string;
  interest: 'Buying' | 'Selling' | 'Renting';
  temperature: LeadTemp;
  nextAction?: {
    date: string;
    task: string;
    isOverdue?: boolean;
  };
  tags: string[];
  notes?: string;
  history?: LeadHistoryItem[];
}

export interface FollowUpTask {
  id: string;
  leadId: string;
  leadName: string;
  leadTemp: LeadTemp;
  leadPhone: string;
  taskType: 'Call' | 'Meeting' | 'Email' | 'Task';
  description: string;
  dueDate: Date; // Object for easier sorting
  displayTime: string; // "2:00 PM"
  isOverdue: boolean;
  status: 'pending' | 'completed';
}

export type StageId = 'negotiation' | 'documentation' | 'payment' | 'closed';

export type LeadSource = 'Web' | 'Referral' | 'Zillow' | 'Ads';

export interface Deal {
  id: string;
  title: string; // Lead Name
  value: string; // Formatted string
  numericValue: number; // For sorting/summing
  stage: StageId;
  source: LeadSource;
  lastTouch: string;
  daysInStage: number; // New field for workflow optimization

  // Transaction Management Fields
  completion: number; // 0-100
  tasks: { id: string; label: string; done: boolean }[];
  isUrgent?: boolean;

  // Legacy/Optional fields
  hotScore?: 1 | 2 | 3;
  client?: string;
  propertyAddress?: string;
  imageUrl?: string;
  probability?: number;
  agent?: {
    name: string;
    avatarUrl: string;
  };
  priority?: 'High' | 'Medium' | 'Low';
}