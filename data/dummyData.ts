import { Account, DashboardItem, SQLFile, TopQuery, OptimizationOpportunity, Warehouse, User, Widget, SimilarQuery, QueryListItem, QueryStatus, QueryType, StorageBreakdownItem, TopStorageConsumer, StorageGrowthPoint, UnusedTable, StorageActivityLogItem, StorageByTeamItem, DuplicateDataPattern, StorageOptimizationOpportunity, DataAgeDistributionItem, StorageTierItem, TieringOpportunityItem, CostForecastPoint, TierForecastPoint, AnomalyAlertItem, SavingsProjection } from '../types';

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

export const queryListData: QueryListItem[] = [
    { id: '01b3a8c1-04a9-1cde-0000-4b8d00045e32', status: 'Success', costUSD: 1.25, costCredits: 0.5, duration: '00:01:32', warehouse: 'BI_WH', estSavingsUSD: 0.30, estSavingsPercent: 24, queryText: "SELECT\n  c.c_name AS customer_name,\n  COUNT(o.o_orderkey) AS order_count,\n  SUM(o.o_totalprice) AS total_spent\nFROM\n  SNOWFLAKE_SAMPLE_DATA.TPCH_SF1.CUSTOMER c\nJOIN\n  SNOWFLAKE_SAMPLE_DATA.TPCH_SF1.ORDERS o\nON\n  c.c_custkey = o.o_custkey\nWHERE\n  c.c_mktsegment = 'BUILDING'\nGROUP BY\n  c.c_name\nORDER BY\n  total_spent DESC\nLIMIT 100;", timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), type: ['SELECT', 'WHERE', 'Aggregation', 'JOIN'], user: 'Alice Johnson' },
    { id: '01b3a8c2-04a9-1cde-0000-4b8d00045e33', status: 'Failed', costUSD: 0.05, costCredits: 0.02, duration: '00:00:10', warehouse: 'ETL_WH', estSavingsUSD: 0, estSavingsPercent: 0, queryText: "INSERT INTO new_users SELECT * FROM staging_users;", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), type: ['INSERT', 'SELECT'], user: 'Bob Williams' },
    { id: '01b3a8c3-04a9-1cde-0000-4b8d00045e34', status: 'Success', costUSD: 5.60, costCredits: 2.24, duration: '00:15:45', warehouse: 'DATA_SCIENCE_WH', estSavingsUSD: 1.50, estSavingsPercent: 27, queryText: "SELECT\n  p.p_name AS product_name,\n  s.s_name AS supplier_name,\n  ps.ps_availqty AS available_quantity\nFROM\n  SNOWFLAKE_SAMPLE_DATA.TPCH_SF1.PARTSUPP ps\nJOIN\n  SNOWFLAKE_SAMPLE_DATA.TPCH_SF1.PART p ON ps.ps_partkey = p.p_partkey\nJOIN\n  SNOWFLAKE_SAMPLE_DATA.TPCH_SF1.SUPPLIER s ON ps.ps_suppkey = s.s_suppkey\nWHERE\n  p.p_type LIKE '%BRASS'\n  AND ps.ps_supplycost < 500;", timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), type: ['SELECT', 'JOIN', 'WHERE'], user: 'Charlie Brown' },
    { id: '01b3a8c4-04a9-1cde-0000-4b8d00045e35', status: 'Success', costUSD: 0.80, costCredits: 0.32, duration: '00:00:45', warehouse: 'BI_WH', estSavingsUSD: 0, estSavingsPercent: 0, queryText: "SELECT DISTINCT l_returnflag, l_linestatus FROM SNOWFLAKE_SAMPLE_DATA.TPCH_SF1.LINEITEM;", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), type: ['SELECT'], user: 'Diana Miller' },
    { id: '01b3a8c5-04a9-1cde-0000-4b8d00045e36', status: 'Failed', costUSD: 0.10, costCredits: 0.04, duration: '00:00:15', warehouse: 'DEV_WH', estSavingsUSD: 0, estSavingsPercent: 0, queryText: "ALTER TABLE non_existent_table ADD COLUMN new_col VARCHAR(50);", timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), type: [], user: 'Ethan Hunt' },
    { id: '01b3a8c6-04a9-1cde-0000-4b8d00045e37', status: 'Success', costUSD: 2.10, costCredits: 0.84, duration: '00:05:10', warehouse: 'ETL_WH', estSavingsUSD: 0.50, estSavingsPercent: 24, queryText: "UPDATE product_inventory SET stock = stock - 1 WHERE product_id = 'XYZ-123';", timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), type: ['UPDATE', 'WHERE'], user: 'Fiona Glenanne' },
    ...Array.from({ length: 15 }, (_, i) => ({
      id: `01b3a8d${i}-04a9-1cde-0000-4b8d00045e${40 + i}`,
      status: (Math.random() > 0.1 ? 'Success' : 'Failed') as QueryStatus,
      costUSD: parseFloat((Math.random() * 5).toFixed(2)),
      costCredits: parseFloat((Math.random() * 2).toFixed(2)),
      duration: `00:${String(Math.floor(Math.random() * 59)).padStart(2, '0')}:${String(Math.floor(Math.random() * 59)).padStart(2, '0')}`,
      warehouse: ['BI_WH', 'ETL_WH', 'DATA_SCIENCE_WH'][Math.floor(Math.random() * 3)],
      estSavingsUSD: Math.random() > 0.5 ? parseFloat((Math.random() * 1).toFixed(2)) : 0,
      estSavingsPercent: Math.random() > 0.5 ? Math.floor(Math.random() * 30) : 0,
      queryText: `SELECT column_${i} FROM table_${i} WHERE condition='true';`,
      timestamp: new Date(Date.now() - (10 + i) * 24 * 60 * 60 * 1000).toISOString(),
      type: ['SELECT', 'WHERE'] as QueryType[],
      user: ['George Mason', 'Hannah Abbott', 'Ian Gallagher'][Math.floor(Math.random() * 3)]
    }))
];

// --- Data for Storage Optimization View ---
export const storageBreakdownData: StorageBreakdownItem[] = [
    { name: 'PROD_DB', value: 1200, color: '#6932D5' },
    { name: 'STAGING_DB', value: 500, color: '#A78BFA' },
    { name: 'ANALYTICS_DB', value: 350, color: '#C4B5FD' },
    { name: 'LOGS_DB', value: 250, color: '#E0E7FF' },
];

export const topStorageConsumersData: TopStorageConsumer[] = [
    { name: 'EVENTS_RAW', size: 450, monthlyGrowth: 15.2 },
    { name: 'CUSTOMER_SESSIONS', size: 320, monthlyGrowth: 8.5 },
    { name: 'TRANSACTIONS_Q3', size: 210, monthlyGrowth: 5.0 },
    { name: 'USER_PROFILES_BACKUP', size: 180, monthlyGrowth: 1.2 },
    { name: 'API_LOGS_2023', size: 150, monthlyGrowth: 22.1 },
    { name: 'FINANCIAL_REPORTS', size: 120, monthlyGrowth: 2.5 },
    { name: 'MARKETING_CAMPAIGNS', size: 90, monthlyGrowth: 7.8 },
    { name: 'PRODUCT_CATALOG', size: 75, monthlyGrowth: 0.5 },
    { name: 'HR_RECORDS', size: 50, monthlyGrowth: 1.0 },
    { name: 'ARCHIVED_ORDERS', size: 40, monthlyGrowth: 0.1 },
];

export const storageGrowthData: StorageGrowthPoint[] = [
    { date: 'Jan', 'Active Storage (GB)': 1200, 'Time Travel (GB)': 200 },
    { date: 'Feb', 'Active Storage (GB)': 1250, 'Time Travel (GB)': 210 },
    { date: 'Mar', 'Active Storage (GB)': 1350, 'Time Travel (GB)': 220 },
    { date: 'Apr', 'Active Storage (GB)': 1400, 'Time Travel (GB)': 230 },
    { date: 'May', 'Active Storage (GB)': 1550, 'Time Travel (GB)': 250 },
    { date: 'Jun', 'Active Storage (GB)': 1600, 'Time Travel (GB)': 260 },
];

export const unusedTablesData: UnusedTable[] = [
    { name: 'TEMP_USERS_IMPORT_2022', size: '15.2 GB', lastAccessed: '14 months ago', potentialSavings: 120 },
    { name: 'Q2_2021_SALES_BACKUP', size: '8.1 GB', lastAccessed: '2 years ago', potentialSavings: 65 },
    { name: 'DEV_TEST_FEATURE_X', size: '2.5 GB', lastAccessed: '9 months ago', potentialSavings: 20 },
];

export const duplicateDataPatternsData: DuplicateDataPattern[] = [
    { id: 'dup1', datasets: ['USER_PROFILES_BACKUP', 'PROFILES_USER_ARCHIVE_2023'], size: '180 GB', potentialSavings: 150 },
    { id: 'dup2', datasets: ['SALES_Q1_FINAL', 'Q1_SALES_REPORT_FINAL_V2'], size: '55 GB', potentialSavings: 45 },
];

export const storageOptimizationOpportunitiesData: StorageOptimizationOpportunity[] = [
    { id: 'so1', type: 'Compression', tableName: 'API_LOGS_2023', recommendation: 'Table could be compressed 30%, saving storage costs.', potentialSavings: 88 },
    { id: 'so2', type: 'Partitioning', tableName: 'EVENTS_RAW', recommendation: 'Partition by `event_date` to improve query performance and reduce scan sizes.', potentialSavings: 125 },
    { id: 'so3', type: 'Compression', tableName: 'CUSTOMER_SESSIONS', recommendation: 'ZSTD compression can reduce size by an estimated 45%.', potentialSavings: 210 },
];

export const storageActivityLogData: StorageActivityLogItem[] = Array.from({ length: 20 }, (_, i) => ({
    id: `log${i}`,
    timestamp: new Date(Date.now() - i * 3 * 60 * 60 * 1000).toLocaleString(),
    user: ['ALICE_J', 'BOB_W', 'SYS_ADMIN'][i % 3],
    action: ['CREATE TABLE', 'DROP TABLE', 'LOAD DATA'][i % 3],
    details: `Details for action ${i}`
}));

export const storageByTeamData: StorageByTeamItem[] = [
    { team: 'Engineering', storageGB: 850 },
    { team: 'Analytics', storageGB: 620 },
    { team: 'Marketing', storageGB: 310 },
    { team: 'Finance', storageGB: 180 },
    { team: 'Data Science', storageGB: 450 },
];

// --- Data for Data Tiering View ---
export const dataAgeDistributionData: DataAgeDistributionItem[] = [
    { ageBucket: '0-30 days', sizeGB: 1200 },
    { ageBucket: '30-90 days', sizeGB: 850 },
    { ageBucket: '90-180 days', sizeGB: 500 },
    { ageBucket: '180-365 days', sizeGB: 320 },
    { ageBucket: '> 1 year', sizeGB: 780 },
];

export const storageByTierData: { current: StorageTierItem[], recommended: StorageTierItem[] } = {
    current: [
        { name: 'Hot', value: 2.5, color: '#DC2626' },
        { name: 'Warm', value: 1.0, color: '#F59E0B' },
        { name: 'Cold', value: 0.5, color: '#2563EB' },
    ],
    recommended: [
        { name: 'Hot', value: 1.5, color: '#DC2626' },
        { name: 'Warm', value: 1.2, color: '#F59E0B' },
        { name: 'Cold', value: 1.3, color: '#2563EB' },
    ],
};

export const tieringOpportunitiesData: TieringOpportunityItem[] = [
    { id: 'to1', tableName: 'LOGS_ARCHIVE_2022', size: '750 GB', currentTier: 'Warm', recommendedTier: 'Cold', potentialSavings: 250 },
    { id: 'to2', tableName: 'USER_SESSIONS_RAW', size: '1.2 TB', currentTier: 'Hot', recommendedTier: 'Warm', potentialSavings: 400 },
    { id: 'to3', tableName: 'FINANCIAL_REPORTS_Q1_2023', size: '300 GB', currentTier: 'Hot', recommendedTier: 'Warm', potentialSavings: 150 },
    { id: 'to4', tableName: 'MARKETING_LEADS_HISTORICAL', size: '500 GB', currentTier: 'Warm', recommendedTier: 'Cold', potentialSavings: 180 },
];

export const policyComplianceData = {
    compliancePercentage: 92,
};

// --- Data for Cost Forecasting View ---
export const costSpendForecastData: CostForecastPoint[] = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const base = day * 100;
    const actual = day <= 20 ? base + Math.sin(day) * 200 + Math.random() * 100 : null;
    const forecast = (base + Math.sin(day) * 200) * 1.05;
    return { day, actual, forecast };
});

export const costForecastByTierData: TierForecastPoint[] = [
    { month: 'Jul', Hot: 1200, Warm: 500, Cold: 200 },
    { month: 'Aug', Hot: 1300, Warm: 550, Cold: 220 },
    { month: 'Sep', Hot: 1400, Warm: 600, Cold: 250 },
    { month: 'Oct', Hot: 1550, Warm: 650, Cold: 280 },
    { month: 'Nov', Hot: 1650, Warm: 700, Cold: 300 },
    { month: 'Dec', Hot: 1800, Warm: 750, Cold: 320 },
];

export const costAnomalyAlertsData: AnomalyAlertItem[] = [
    { id: 'ca1', tableName: 'API_LOGS_2023', projection: 'Projected to increase 50% above trend next month.' },
    { id: 'ca2', tableName: 'STG_USER_UPLOADS', projection: 'Unusual spike detected; forecasting 2x cost increase.' },
    { id: 'ca3', tableName: 'ML_TRAINING_DATA_V3', projection: 'Growth accelerating, potential budget overrun in 6 weeks.' },
];

export const costSavingsProjectionData: SavingsProjection = {
    message: 'If you archive unused tables and implement tiering recommendations, your storage spend will drop by an estimated',
    savingsPercentage: 25,
};