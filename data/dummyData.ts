
import { Account, DashboardItem, SQLFile, TopQuery, OptimizationOpportunity, Warehouse, User, Widget } from '../types';

export const availableWidgetsData: Omit<Widget, 'id' | 'dataSource'>[] = [
    { widgetId: 'w1', title: 'Total Monthly Spend', type: 'StatCard', description: 'Displays the total credit spend for the current month.' },
    { widgetId: 'w2', title: 'Forecasted Spend', type: 'StatCard', description: 'AI-based forecast of this month\'s total spend.' },
    { widgetId: 'w3', title: 'Top Queries by Cost', type: 'Table', description: 'A table of the most expensive queries.' },
    { widgetId: 'w4', title: 'Warehouse Utilization', type: 'BarChart', description: 'Shows average and peak utilization for warehouses.' },
    { widgetId: 'w5', title: 'Cost Breakdown', type: 'DonutChart', description: 'A donut chart showing spend by category.' },
    { widgetId: 'w6', title: 'Spend Over Time', type: 'LineChart', description: 'A line chart of daily spend over the last 30 days.' }
];

export const connectionsData: Account[] = [
  { id: '1', name: 'Snowflake Prod', identifier: 'axb123.us-east-1', role: 'SYSADMIN', status: 'Connected', lastSynced: '2 mins ago' },
  { id: '2', name: 'Marketing Analytics', identifier: 'yza456.us-west-2', role: 'MARKETING_OPS', status: 'Connected', lastSynced: '5 mins ago' },
  { id: '3', name: 'Development Sandbox', identifier: 'dev789.eu-central-1', role: 'DEVELOPER', status: 'Syncing', lastSynced: '1 hour ago' },
  { id: '4', name: 'Financial Reporting', identifier: 'fin012.us-east-1', role: 'FINANCE_ADMIN', status: 'Disconnected', lastSynced: '2 days ago' },
  { id: '5', name: 'Data Science Cluster', identifier: 'ds345.ap-southeast-2', role: 'DATA_SCIENTIST', status: 'Error', lastSynced: '1 day ago' },
];

export const dashboardsData: DashboardItem[] = [
    {
      id: '1',
      title: 'Cost Dashboard',
      description: 'Get a consolidated view of current spend, forecast, and trends across all accounts.',
      createdOn: 'January 14, 2024, 4:45 PM',
      widgets: [
        { id: 'inst-1', widgetId: 'w1', title: 'Total Monthly Spend', type: 'StatCard', description: 'Displays the total credit spend for the current month.', dataSource: { type: 'overall' } },
        { id: 'inst-2', widgetId: 'w2', title: 'Forecasted Spend', type: 'StatCard', description: 'AI-based forecast of this month\'s total spend.', dataSource: { type: 'overall' } },
        { id: 'inst-3', widgetId: 'w5', title: 'Cost Breakdown', type: 'DonutChart', description: 'A donut chart showing spend by category.', dataSource: { type: 'account', accountId: '1' } },
      ]
    },
    {
      id: '2',
      title: 'Account Performance',
      description: 'Track credit usage, query performance, and resource efficiency for a specific Snowflake account.',
      createdOn: 'January 14, 2024, 4:45 PM',
      widgets: [
        { id: 'inst-4', widgetId: 'w3', title: 'Top Queries by Cost', type: 'Table', description: 'A table of the most expensive queries.', dataSource: { type: 'account', accountId: '2' } },
        { id: 'inst-5', widgetId: 'w4', title: 'Warehouse Utilization', type: 'BarChart', description: 'Shows average and peak utilization for warehouses.', dataSource: { type: 'account', accountId: '2' } },
      ]
    },
    {
      id: '3',
      title: 'Engineering Dashboard',
      description: 'Analyze query performance, resource bottlenecks, and warehouse workload distribution.',
      createdOn: 'January 14, 2024, 4:45 PM',
      widgets: []
    }
];

export const topSpendData = [
    { id: '1', name: 'Snowflake Prod', totalSpend: 260 },
    { id: '2', name: 'Marketing Analytics', totalSpend: 190 },
    { id: '3', name: 'Development Sandbox', totalSpend: 80 },
    { id: '4', name: 'Financial Reporting', totalSpend: 60 },
    { id: '5', name: 'Data Science Cluster', totalSpend: 40 },
];

export const costBreakdownData = [
    { name: 'Warehouse Costs', value: 35000, percentage: 55, color: '#6932D5' },
    { name: 'Storage Costs', value: 12000, percentage: 38, color: '#D6BCFA' },
    { name: 'Data Transfer Cost', value: 3000, percentage: 12, color: '#D6BCFA' },
];

export const sqlFilesData: SQLFile[] = [
  {
    id: 'file1',
    name: 'monthly_financial_report.sql',
    versions: [
      { id: 'v1', version: 3, date: '2023-10-28', tag: 'Production', description: 'Final version for Q3 reporting.' },
      { id: 'v2', version: 2, date: '2023-10-25', tag: 'Staging', description: 'Added new logic for tax calculation.' },
      { id: 'v3', version: 1, date: '2023-10-22', tag: 'Archived', description: 'Initial draft.' },
    ]
  },
  {
    id: 'file2',
    name: 'user_engagement_weekly.sql',
    versions: [
      { id: 'v4', version: 5, date: '2023-11-01', tag: 'Production', description: 'Optimized query for faster execution.' },
      { id: 'v5', version: 4, date: '2023-10-30', tag: 'Archived', description: 'Previous production version.' },
    ]
  }
];

// --- Data for Account Overview Dashboard ---
export const accountSpend = {
    monthly: 12450,
    forecasted: 21500,
    ytd: 145800,
};

export const topQueriesData: TopQuery[] = [
    { id: 'q1', queryText: 'SELECT * FROM sales_q3_2023...', credits: 120.5, user: 'ALICE', duration: '2h 15m' },
    { id: 'q2', queryText: 'JOIN large_customer_table...', credits: 98.2, user: 'BOB', duration: '1h 45m' },
    { id: 'q3', queryText: 'AGGREGATE daily_metrics...', credits: 75.1, user: 'ALICE', duration: '55m' },
    { id: 'q4', queryText: 'WINDOW function over user_sessions...', credits: 50.8, user: 'CHARLIE', duration: '32m' },
];

export const optimizationOpportunitiesData: OptimizationOpportunity[] = [
    { id: 'opt1', queryText: 'SELECT DISTINCT user_id FROM events...', potentialSavings: 45.0, recommendation: 'Use APPROX_COUNT_DISTINCT' },
    { id: 'opt2', queryText: 'CROSS JOIN customer_regions...', potentialSavings: 25.5, recommendation: 'Add explicit JOIN condition' },
];

export const warehousesData: Warehouse[] = [
    { id: 'wh1', name: 'ETL_WH', avgUtilization: 85, peakUtilization: 98, status: 'Active' },
    { id: 'wh2', name: 'BI_WH', avgUtilization: 45, peakUtilization: 75, status: 'Active' },
    { id: 'wh3', name: 'DATA_SCIENCE_WH', avgUtilization: 5, peakUtilization: 20, status: 'Idle' },
    { id: 'wh4', name: 'DEV_WH', avgUtilization: 0, peakUtilization: 0, status: 'Suspended' },
];

export const accountCostBreakdown = [
    { name: 'Compute', value: 8500, color: '#6932D5' },
    { name: 'Storage', value: 3500, color: '#A78BFA' },
    { name: 'Data Transfer', value: 450, color: '#D6BCFA' },
];

export const usersData: User[] = [
    { id: 'user1', name: 'Alice Johnson', email: 'alice.j@example.com', role: 'Admin', status: 'Active', dateAdded: '2024-05-10' },
    { id: 'user2', name: 'Bob Williams', email: 'bob.w@example.com', role: 'Analyst', status: 'Active', dateAdded: '2024-05-12' },
    { id: 'user3', name: 'Charlie Brown', email: 'charlie.b@example.com', role: 'Viewer', status: 'Invited', dateAdded: '2024-06-01' },
    { id: 'user4', name: 'Diana Miller', email: 'diana.m@example.com', role: 'Analyst', status: 'Suspended', dateAdded: '2024-04-20' },
];