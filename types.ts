import React from 'react';

export type Page = 
  | 'Overview' 
  | 'Dashboard' 
  | 'Connections' 
  | 'AI Agent' 
  | 'Reports' 
  | 'Book a Demo' 
  | 'Settings' 
  | 'Support';

export interface NavItem {
    name: Page;
    icon: React.ComponentType<{ className?: string }>;
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
  tag: string;
  description: string;
}

export interface SQLFile {
  id: string;
  name: string;
  versions: SQLVersion[];
}
