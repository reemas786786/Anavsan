import React from 'react';

export type Page = 
  | 'Data Cloud Overview'
  | 'Dashboards'
  | 'Snowflake Accounts' 
  | 'AI Agent' 
  | 'Query Library'
  | 'Reports' 
  | 'Assigned Queries'
  | 'Notifications'
  | 'Book a Demo'
  | 'Docs'
  | 'Settings' 
  | 'Support'
  | 'Profile Settings';

export interface NavSubItem {
    name: string;
}

export interface NavItem {
    name: Page;
    icon: React.ComponentType<{ className?: string }>;
    subItems?: NavSubItem[];
}

export interface BreadcrumbItem {
    label: string;
    onClick?: () => void;
}

export type ConnectionStatus = 'Connected' | 'Disconnected' | 'Syncing' | 'Error';

export interface Account {
  id: string;
  name: string;
  identifier: string;
  role: string;
  status: ConnectionStatus;
  lastSynced: string;
  cost: number;
  credits: number;
}

export type WidgetType = 'StatCard' | 'LineChart' | 'BarChart' | 'Table' | 'DonutChart';

export interface Widget {
  id: string; // Unique ID for the instance on the dashboard
  widgetId: string; // ID of the widget from the library
  title: string;
  type: WidgetType;
  description: string;
  dataSource: { type: 'overall' } | { type: 'account', accountId: string };
  imageUrl?: string;
  tags?: string[];
  layout: { w: number; h: number }; // w in columns (1-12), h in units (1 unit = 100px)
}

export interface DashboardItem {
  id:string;
  title: string;
  createdOn: string;
  description?: string;
  widgets: Widget[];
  dataSourceContext?: { type: 'overall' } | { type: 'account', accountId: string };
}

export interface SQLVersion {
  id: string;
  version: number;
  date: string;
  tag?: string;
  description: string;
  sql?: string;
  user: string;
}

export interface SQLFile {
  id: string;
  name: string;
  versions: SQLVersion[];
  createdDate: string;
  accountId: string;
  accountName: string;
}

export interface TopQuery {
    id: string;
    queryText: string;
    credits: number;
    cost: number;
    user: string;
    duration: string;
}

export interface OptimizationOpportunity {
    id: string;
    queryText: string;
    potentialSavings: number; // in credits
    potentialSavingsCost: number; // in cost
    recommendation: string;
}

export interface Warehouse {
    id: string;
    name: string;
    size: 'X-Small' | 'Small' | 'Medium' | 'Large' | 'X-Large';
    avgUtilization: number;
    peakUtilization: number;
    status: 'Active' | 'Idle' | 'Suspended' | 'Running';
    cost: number;
    credits: number;
    queriesExecuted: number;
    lastActive: string;
}

export type UserRole = 'Admin' | 'Analyst' | 'Viewer';
export type UserStatus = 'Active' | 'Invited' | 'Suspended';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    roleTitle?: string;
    status: UserStatus;
    dateAdded: string;
    avatarUrl?: string;
    message?: string;
    cost: number;
    credits: number;
}

export type BigScreenWidgetType = 'account' | 'user' | 'spend_breakdown' | 'top_spend_by_db' | 'storage_by_type' | 'storage_growth_trend';

export interface BigScreenWidget {
  type: BigScreenWidgetType;
  title: string;
}

export interface SimilarQuery {
  id: string;
  name: string; // or query text snippet
  similarity: number; // percentage
  executionTime: number; // in ms
  warehouse: string;
  cost: number;
  credits: number;
  pattern?: 'Join-heavy' | 'Aggregation-heavy' | 'Scan-heavy';
}

export type QueryStatus = 'Success' | 'Failed';
export type QueryType = 'SELECT' | 'WHERE' | 'JOIN' | 'Aggregation' | 'INSERT' | 'UPDATE' | 'DELETE';
export type QuerySeverity = 'Low' | 'Medium' | 'High';


export interface QueryListItem {
  id: string;
  status: QueryStatus;
  costUSD: number;
  costCredits: number;
  duration: string; // "hh:mm:ss"
  warehouse: string;
  estSavingsUSD: number;
  estSavingsPercent: number;
  queryText: string;
  timestamp: string; // ISO string
  type: QueryType[];
  user: string;
  bytesScanned: number;
  bytesWritten: number;
  queryTag?: string;
  severity: QuerySeverity;
}

export interface QueryListFilters {
    search: string;
    dateFilter: string | { start: string; end: string };
    userFilter: string[];
    statusFilter: string[];
    warehouseFilter: string[];
    queryTypeFilter: string[];
    durationFilter: { min: number | null; max: number | null };
    currentPage: number;
    itemsPerPage: number;
    visibleColumns: string[];
}

export interface SlowQueryFilters {
    search: string;
    dateFilter: string | { start: string; end: string };
    warehouseFilter: string[];
    severityFilter: string[];
}


export interface StorageBreakdownItem {
  name: string;
  value: number; // in GB
  color: string;
}

export interface TopStorageConsumer {
  name: string;
  size: number; // in GB
  monthlyGrowth: number; // percentage
  rows?: number;
  lastUpdated?: string;
}

export interface StorageGrowthPoint {
  date: string;
  'Active Storage (GB)': number;
  'Time Travel (GB)': number;
}

export interface UnusedTable {
    name: string;
    size: string;
    lastAccessed: string;
    potentialSavings: number; // USD
}

export interface DuplicateDataPattern {
    id: string;
    datasets: string[]; // List of table/file names that are duplicates
    size: string;
    potentialSavings: number; // USD
}

export interface StorageOptimizationOpportunity {
    id: string;
    type: 'Compression' | 'Partitioning';
    tableName: string;
    recommendation: string;
    potentialSavings: number; // USD
}

export interface StorageActivityLogItem {
    id: string;
    timestamp: string;
    user: string;
    action: string;
    details: string;
}

export interface StorageByTeamItem {
    team: string;
    storageGB: number;
}

export interface DataAgeDistributionItem {
    ageBucket: string;
    sizeGB: number;
}

export interface StorageTierItem {
    name: string;
    value: number; // in TB
    color: string;
}

export interface TieringOpportunityItem {
    id: string;
    tableName: string;
    size: string;
    currentTier: 'Hot' | 'Warm' | 'Cold';
    recommendedTier: 'Hot' | 'Warm' | 'Cold';
    potentialSavings: number; // USD per month
}

export interface CostForecastPoint {
    day: number;
    actual: number | null;
    forecast: number;
}

export interface TierForecastPoint {
    month: string;
    Hot: number;
    Warm: number;
    Cold: number;
}

export interface AnomalyAlertItem {
    id: string;
    tableName: string;
    projection: string;
}

export interface SavingsProjection {
    message: string;
    savingsPercentage: number;
}

export interface DatabaseTable {
    id: string;
    name: string;
    sizeGB: number;
    rows: number;
    monthlyGrowth: number; // percentage
}

export interface Database {
    id: string;
    name: string;
    sizeGB: number;
    cost: number;
    tableCount: number;
    userCount: number;
    users: { id: string, name: string }[];
}

export interface StorageByTypeItem {
  type: string;
  storageGB: number;
  cost: number;
  color: string;
}

export type AssignmentPriority = 'Low' | 'Medium' | 'High';
export type AssignmentStatus = 'Pending' | 'In Progress' | 'Optimized' | 'Needs Info';

export interface AssignedQuery {
    id: string;
    queryId: string;
    queryText: string;
    assignedBy: string; // User name
    assignedTo: string; // User name
    priority: AssignmentPriority;
    status: AssignmentStatus;
    message: string;
    assignedOn: string; // ISO string
    cost: number;
    credits: number;
    warehouse: string;
}

// --- Pull Request Types ---
export type PullRequestStatus = 'Open' | 'Merged' | 'Closed' | 'Draft';
export type AutomatedCheckStatus = 'Passed' | 'Failed' | 'Pending';

export interface PerformanceMetric {
    metric: string;
    before: string;
    after: string;
    delta: string;
}

export interface AutomatedCheck {
    name: string;
    status: AutomatedCheckStatus;
    description: string;
}

export interface Reviewer {
    id: string;
    name: string;
    role: string;
    approved: boolean;
}

export interface PullRequest {
    id: number;
    title: string;
    author: string;
    status: PullRequestStatus;
    sourceBranch: string;
    targetBranch: string;
    createdAt: string; // ISO string
    performanceMetrics: PerformanceMetric[];
    automatedChecks: AutomatedCheck[];
    reviewers: Reviewer[];
    oldCode: string;
    newCode: string;
}

export type NotificationType = 'performance' | 'latency' | 'storage' | 'query' | 'load' | 'TABLE_SCAN' | 'JOIN_INEFFICIENCY' | 'WAREHOUSE_IDLE' | 'COST_SPIKE';
export type NotificationSeverity = 'Info' | 'Warning' | 'Critical';

export interface Notification {
    id: string;
    insightTypeId: string;
    insightTopic: NotificationType;
    message: string;
    suggestions: string;
    timestamp: string; // ISO string
    warehouseName: string;
    queryId?: string;
    isRead: boolean;
    severity: NotificationSeverity;
}

export type ActivityLogStatus = 'Success' | 'Failed' | 'In Progress';

export interface ActivityLog {
  id: string;
  user: string; // User name
  action: string;
  timestamp: string; // ISO string
  details?: string;
  module?: string;
  status?: ActivityLogStatus;
}