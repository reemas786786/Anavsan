
import { Account, DashboardItem, SQLFile } from '../types';

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
      createdOn: 'January 14, 2024, 4:45 PM'
    },
    {
      id: '2',
      title: 'Account Performance',
      description: 'Track credit usage, query performance, and resource efficiency for a specific Snowflake account.',
      createdOn: 'January 14, 2024, 4:45 PM'
    },
    {
      id: '3',
      title: 'Engineering Dashboard',
      description: 'Analyze query performance, resource bottlenecks, and warehouse workload distribution.',
      createdOn: 'January 14, 2024, 4:45 PM'
    }
];

export const topSpendData = [
    { name: 'Finance Prod', totalSpend: 260 },
    { name: 'Account B', totalSpend: 40 },
    { name: 'Account C', totalSpend: 190 },
    { name: 'Account D', totalSpend: 60 },
    { name: 'Account E', totalSpend: 80 },
];

export const costBreakdownData = [
    { name: 'Warehouse Costs', value: 35000, percentage: 55, color: '#8884d8' },
    { name: 'Storage Costs', value: 12000, percentage: 38, color: '#8884d8' },
    { name: 'Data Transfer Cost', value: 3000, percentage: 12, color: '#8884d8' },
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
