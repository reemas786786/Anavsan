
import React from 'react';

export type Page = 
  | 'Dashboard' 
  | 'Connections' 
  | 'AI Agent' 
  | 'Reports' 
  | 'Book a Demo'
  | 'Docs'
  | 'Settings' 
  | 'Support';

export interface NavSubItem {
    name: string;
}

export interface NavItem {
    name: Page;
    icon: React.ComponentType<{ className?: string }>;
    subItems?: NavSubItem[];
}

export type ConnectionStatus = 'Connected' | 'Disconnected' | 'Syncing' | 'Error';

export interface Account {
  id: string;
  name: string;
  identifier: string;
  role: string;
  status: ConnectionStatus;
  lastSynced: string;
}

export interface DashboardItem {
  id:string;
  title: string;
  createdOn: string;
  description?: string;
}

export interface SQLVersion {
  id: string;
  version: number;
  date: string;
  tag?: string;
  description: string;
}

export interface SQLFile {
  id: string;
  name: string;
  versions: SQLVersion[];
}

export interface TopQuery {
    id: string;
    queryText: string;
    credits: number;
    user: string;
    duration: string;
}

export interface OptimizationOpportunity {
    id: string;
    queryText: string;
    potentialSavings: number;
    recommendation: string;
}

export interface Warehouse {
    id: string;
    name: string;
    avgUtilization: number;
    peakUtilization: number;
    status: 'Active' | 'Idle' | 'Suspended';
}

export type UserRole = 'Admin' | 'Analyst' | 'Viewer';
export type UserStatus = 'Active' | 'Invited' | 'Suspended';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    dateAdded: string;
    avatarUrl?: string;
    message?: string;
}
