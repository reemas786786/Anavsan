
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

export interface OverviewStats {
  connections: number;
  warehouses: number;
  queries: number;
  anomalies: number;
  savings: string;
}

export interface CostDataPoint {
  name: string;
  cost: number;
}

export interface WarehouseDataPoint {
    name: string;
    queries: number;
    cost: number;
}

export type QueryStatus = 'Success' | 'Failed' | 'Running';

export interface Query {
  id: string;
  user: string;
  sql: string;
  status: QueryStatus;
  duration: string;
  cost: string;
  timestamp: string;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'Performance' | 'Cost' | 'Storage';
  impact: 'High' | 'Medium' | 'Low';
}

export interface NavItem {
    name: Page;
    icon: React.ComponentType<{ className?: string }>;
}
