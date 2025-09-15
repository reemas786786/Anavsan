import { Account, DashboardItem, SQLFile, TopQuery, OptimizationOpportunity, Warehouse, User, Widget, SimilarQuery } from '../types';

export const availableWidgetsData: Omit<Widget, 'id' | 'dataSource'>[] = [
    { 
      widgetId: 'w1', 
      title: 'Total Monthly Spend', 
      type: 'StatCard', 
      description: 'Displays the total credit spend for the current month.',
      imageUrl: 'https://placehold.co/300x150/F8F8FC/1E1E2D?text=Stat+Card',
      tags: ['Cost', 'Overall', 'Account Specific'],
      layout: { w: 4, h: 2 }
    },
    { 
      widgetId: 'w2', 
      title: 'Forecasted Spend', 
      type: 'StatCard', 
      description: 'AI-based forecast of this month\'s total spend.',
      imageUrl: 'https://placehold.co/300x150/F8F8FC/1E1E2D?text=Stat+Card',
      tags: ['Cost', 'Forecast', 'Overall'],
      layout: { w: 4, h: 2 }
    },
    { 
      widgetId: 'w3', 
      title: 'Top Queries by Cost', 
      type: 'Table', 
      description: 'A table of the most expensive queries.',
      imageUrl: 'https://placehold.co/300x150/F8F8FC/1E1E2D?text=Table',
      tags: ['Performance', 'Cost', 'Account Specific'],
      layout: { w: 6, h: 2 }
    },
    { 
      widgetId: 'w4', 
      title: 'Warehouse Utilization', 
      type: 'BarChart', 
      description: 'Shows average and peak utilization for warehouses.',
      imageUrl: 'https://placehold.co/300x150/F8F8FC/1E1E2D?text=Bar+Chart',
      tags: ['Performance', 'Account Specific'],
      layout: { w: 6, h: 2 }
    },
    { 
      widgetId: 'w5', 
      title: 'Cost Breakdown', 
      type: 'DonutChart', 
      description: 'A donut chart showing spend by category.',
      imageUrl: 'https://placehold.co/300x150/F8F8FC/1E1E2D?text=Donut+Chart',
      tags: ['Cost', 'Overall', 'Account Specific'],
      layout: { w: 4, h: 2 }
    },
    { 
      widgetId: 'w6', 
      title: 'Spend Over Time', 
      type: 'LineChart', 
      description: 'A line chart of daily spend over the last 30 days.',
      imageUrl: 'https://placehold.co/300x150/F8F8FC/1E1E2D?text=Line+Chart',
      tags: ['Cost', 'Trend', 'Overall', 'Account Specific'],
      layout: { w: 8, h: 2 }
    }
];

export const connectionsData: Account[] = [
  { id: '1', name: 'Snowflake Prod', identifier: 'axb123.us-east-1', role: 'SYSADMIN', status: 'Connected', lastSynced: '2 mins ago', cost: 260, credits: 104 },
  { id: '2', name: 'Marketing Analytics', identifier: 'yza456.us-west-2', role: 'MARKETING_OPS', status: 'Connected', lastSynced: '5 mins ago', cost: 190, credits: 76 },
  { id: '3', name: 'Development Sandbox', identifier: 'dev789.eu-central-1', role: 'DEVELOPER', status: 'Syncing', lastSynced: '1 hour ago', cost: 80, credits: 32 },
  { id: '4', name: 'Financial Reporting', identifier: 'fin012.us-east-1', role: 'FINANCE_ADMIN', status: 'Disconnected', lastSynced: '2 days ago', cost: 60, credits: 24 },
  { id: '5', name: 'Data Science Cluster', identifier: 'ds345.ap-southeast-2', role: 'DATA_SCIENTIST', status: 'Error', lastSynced: '1 day ago', cost: 40, credits: 16 },
];

export const dashboardsData: DashboardItem[] = [
    {
      id: '1',
      title: 'Cost Dashboard',
      description: 'Get a consolidated view of current spend, forecast, and trends across all accounts.',
      createdOn: 'January 14, 2024, 4:45 PM',
      widgets: [
        { id: 'inst-1', widgetId: 'w1', title: 'Total Monthly Spend', type: 'StatCard', description: 'Displays the total credit spend for the current month.', dataSource: { type: 'overall' }, imageUrl: 'https://placehold.co/300x150/F8F8FC/1E1E2D?text=Stat+Card', tags: ['Cost', 'Overall', 'Account Specific'], layout: { w: 4, h: 2 } },
        { id: 'inst-2', widgetId: 'w2', title: 'Forecasted Spend', type: 'StatCard', description: 'AI-based forecast of this month\'s total spend.', dataSource: { type: 'overall' }, imageUrl: 'https://placehold.co/300x150/F8F8FC/1E1E2D?text=Stat+Card', tags: ['Cost', 'Forecast', 'Overall'], layout: { w: 4, h: 2 } },
        { id: 'inst-3', widgetId: 'w5', title: 'Cost Breakdown', type: 'DonutChart', description: 'A donut chart showing spend by category.', dataSource: { type: 'account', accountId: '1' }, imageUrl: 'https://placehold.co/300x150/F8F8FC/1E1E2D?text=Donut+Chart', tags: ['Cost', 'Overall', 'Account Specific'], layout: { w: 4, h: 2 } },
      ]
    },
    {
      id: '2',
      title: 'Account Performance',
      description: 'Track credit usage, query performance, and resource efficiency for a specific Snowflake account.',
      createdOn: 'January 14, 2024, 4:45 PM',
      widgets: [
        { id: 'inst-4', widgetId: 'w3', title: 'Top Queries by Cost', type: 'Table', description: 'A table of the most expensive queries.', dataSource: { type: 'account', accountId: '2' }, imageUrl: 'https://placehold.co/300x150/F8F8FC/1E1E2D?text=Table', tags: ['Performance', 'Cost', 'Account Specific'], layout: { w: 12, h: 2 } },
        { id: 'inst-5', widgetId: 'w4', title: 'Warehouse Utilization', type: 'BarChart', description: 'Shows average and peak utilization for warehouses.', dataSource: { type: 'account', accountId: '2' }, imageUrl: 'https://placehold.co/300x150/F8F8FC/1E1E2D?text=Bar+Chart', tags: ['Performance', 'Account Specific'], layout: { w: 12, h: 2 } },
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

export const overviewMetrics = {
    cost: {
        current: 22453,
        forecasted: 42883,
    },
    credits: {
        current: 8981,
        forecasted: 17153,
    }
};

export const resourceSummaryData = [
    { title: 'Warehouses Monitored', value: '12' },
    { title: 'Executed Queries (Month)', value: '2,847' },
    { title: 'Storage Used (GB, Month)', value: '2,085' },
];

export const topSpendData = [
    { id: '1', name: 'Snowflake Prod', cost: 260, credits: 104 },
    { id: '2', name: 'Marketing Analytics', cost: 190, credits: 76 },
    { id: '3', name: 'Development Sandbox', cost: 80, credits: 32 },
    { id: '4', name: 'Financial Reporting', cost: 60, credits: 24 },
    { id: '5', name: 'Data Science Cluster', cost: 40, credits: 16 },
    { id: '6', name: 'ETL Processing', cost: 220, credits: 88 },
    { id: '7', name: 'BI Warehouse', cost: 150, credits: 60 },
    { id: '8', name: 'Ad-hoc Analysis', cost: 110, credits: 44 },
    { id: '9', name: 'Customer 360', cost: 95, credits: 38 },
    { id: '10', name: 'Logistics & Supply', cost: 75, credits: 30 },
    { id: '11', name: 'Archival Storage', cost: 25, credits: 10 },
    { id: '12', name: 'HR Analytics', cost: 50, credits: 20 },
];

export const costBreakdownData = [
    { name: 'Warehouse', cost: 35000, credits: 1200, color: '#6932D5', percentage: 55 },
    { name: 'Storage', cost: 12000, credits: 400, color: '#A78BFA', percentage: 38 },
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
    cost: {
        monthly: 31125,
        forecasted: 53750,
    },
    credits: {
        monthly: 12450,
        forecasted: 21500,
    }
};

export const topQueriesData: TopQuery[] = [
    { id: 'q1', queryText: 'SELECT * FROM sales_q3_2023...', credits: 120.5, cost: 301.25, user: 'ALICE', duration: '2h 15m' },
    { id: 'q2', queryText: 'JOIN large_customer_table...', credits: 98.2, cost: 245.50, user: 'BOB', duration: '1h 45m' },
    { id: 'q3', queryText: 'AGGREGATE daily_metrics...', credits: 75.1, cost: 187.75, user: 'ALICE', duration: '55m' },
    { id: 'q4', queryText: 'WINDOW function over user_sessions...', credits: 50.8, cost: 127.00, user: 'CHARLIE', duration: '32m' },
];

export const optimizationOpportunitiesData: OptimizationOpportunity[] = [
    { id: 'opt1', queryText: 'SELECT DISTINCT user_id FROM events...', potentialSavings: 45.0, potentialSavingsCost: 112.5, recommendation: 'Use APPROX_COUNT_DISTINCT' },
    { id: 'opt2', queryText: 'CROSS JOIN customer_regions...', potentialSavings: 25.5, potentialSavingsCost: 63.75, recommendation: 'Add explicit JOIN condition' },
];

export const warehousesData: Warehouse[] = [
    { id: 'wh1', name: 'ETL_WH', avgUtilization: 85, peakUtilization: 98, status: 'Active', cost: 12000, credits: 4800 },
    { id: 'wh2', name: 'BI_WH', avgUtilization: 45, peakUtilization: 75, status: 'Active', cost: 8500, credits: 3400 },
    { id: 'wh3', name: 'DATA_SCIENCE_WH', avgUtilization: 5, peakUtilization: 20, status: 'Idle', cost: 2500, credits: 1000 },
    { id: 'wh4', name: 'DEV_WH', avgUtilization: 0, peakUtilization: 0, status: 'Suspended', cost: 500, credits: 200 },
];

export const accountCostBreakdown = [
    { name: 'Warehouse', cost: 24125, credits: 9711, color: '#6932D5', percentage: 78 },
    { name: 'Storage', cost: 7000, credits: 2739, color: '#A78BFA', percentage: 22 },
];

export const usersData: User[] = [
    { id: 'user1', name: 'Alice Johnson', email: 'alice.j@example.com', role: 'Admin', roleTitle: 'Lead Data Analyst', status: 'Active', dateAdded: '2024-05-10', cost: 1250.75, credits: 500.30 },
    { id: 'user2', name: 'Bob Williams', email: 'bob.w@example.com', role: 'Analyst', roleTitle: 'Marketing Analyst', status: 'Active', dateAdded: '2024-05-12', cost: 980.50, credits: 392.20 },
    { id: 'user3', name: 'Charlie Brown', email: 'charlie.b@example.com', role: 'Viewer', roleTitle: 'Sales Associate', status: 'Active', dateAdded: '2024-06-01', cost: 760.00, credits: 304.00 },
    { id: 'user4', name: 'Diana Miller', email: 'diana.m@example.com', role: 'Analyst', roleTitle: 'BI Developer', status: 'Suspended', dateAdded: '2024-04-20', cost: 450.25, credits: 180.10 },
    { id: 'user5', name: 'Ethan Hunt', email: 'ethan.h@example.com', role: 'Analyst', roleTitle: 'Data Engineer', status: 'Active', dateAdded: '2024-05-15', cost: 1120.00, credits: 448.00 },
    { id: 'user6', name: 'Fiona Glenanne', email: 'fiona.g@example.com', role: 'Analyst', roleTitle: 'Data Scientist', status: 'Active', dateAdded: '2024-05-18', cost: 850.50, credits: 340.20 },
    { id: 'user7', name: 'George Mason', email: 'george.m@example.com', role: 'Viewer', roleTitle: 'Product Manager', status: 'Active', dateAdded: '2024-05-20', cost: 680.00, credits: 272.00 },
    { id: 'user8', name: 'Hannah Abbott', email: 'hannah.a@example.com', role: 'Admin', roleTitle: 'IT Administrator', status: 'Invited', dateAdded: '2024-06-02', cost: 510.75, credits: 204.30 },
    { id: 'user9', name: 'Ian Gallagher', email: 'ian.g@example.com', role: 'Viewer', roleTitle: 'Executive Assistant', status: 'Active', dateAdded: '2024-04-25', cost: 390.00, credits: 156.00 },
    { id: 'user10', name: 'Jane Smith', email: 'jane.s@example.com', role: 'Analyst', roleTitle: 'FinOps Analyst', status: 'Active', dateAdded: '2024-04-28', cost: 320.50, credits: 128.20 },
    { id: 'user11', name: 'Kevin Ball', email: 'kevin.b@example.com', role: 'Analyst', roleTitle: 'DevOps Engineer', status: 'Active', dateAdded: '2024-05-01', cost: 250.00, credits: 100.00 },
];

export const similarQueriesData: SimilarQuery[] = [
  { id: 'sq1', name: 'SELECT c.name, COUNT(o.id) FROM customers c JOIN orders o ON c.id = o.customer_id...', similarity: 95, executionTime: 1250, warehouse: 'BI_WH', cost: 1.2, credits: 0.5, pattern: 'Join-heavy' },
  { id: 'sq2', name: 'SELECT c.name, COUNT(o.id) FROM customers_v2 c JOIN orders_v2 o ON c.id = o.customer_id...', similarity: 94, executionTime: 1300, warehouse: 'BI_WH', cost: 1.3, credits: 0.52, pattern: 'Join-heavy' },
  { id: 'sq3', name: 'AGGREGATE daily_metrics by date, region...', similarity: 89, executionTime: 800, warehouse: 'ETL_WH', cost: 0.8, credits: 0.32, pattern: 'Aggregation-heavy' },
  { id: 'sq4', name: 'AGGREGATE daily_metrics_backup by date, region...', similarity: 88, executionTime: 820, warehouse: 'ETL_WH', cost: 0.82, credits: 0.33, pattern: 'Aggregation-heavy' },
  { id: 'sq5', name: 'SELECT * FROM huge_log_table WHERE timestamp > ...', similarity: 82, executionTime: 2500, warehouse: 'DATA_SCIENCE_WH', cost: 2.5, credits: 1.0, pattern: 'Scan-heavy' },
  { id: 'sq6', name: 'SELECT * FROM huge_log_table_archive WHERE timestamp > ...', similarity: 81, executionTime: 2600, warehouse: 'DATA_SCIENCE_WH', cost: 2.6, credits: 1.04, pattern: 'Scan-heavy' },
];