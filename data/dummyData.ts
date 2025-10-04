
import { Account, DashboardItem, SQLFile, TopQuery, OptimizationOpportunity, Warehouse, User, Widget, SimilarQuery, QueryListItem, QueryStatus, QueryType, StorageBreakdownItem, TopStorageConsumer, StorageGrowthPoint, UnusedTable, StorageActivityLogItem, StorageByTeamItem, DuplicateDataPattern, StorageOptimizationOpportunity, DataAgeDistributionItem, StorageTierItem, TieringOpportunityItem, CostForecastPoint, TierForecastPoint, AnomalyAlertItem, SavingsProjection, Database, DatabaseTable, StorageByTypeItem, AssignedQuery } from '../types';

export const availableWidgetsData: Omit<Widget, 'id' | 'dataSource' | 'imageUrl'>[] = [
    { 
      widgetId: 'airflow-dag-durations', 
      title: 'Airflow DAG durations', 
      type: 'LineChart', 
      description: 'Shows the most frequent Airflow DAGs and their duration.',
      tags: ['Performance', 'Account Specific'],
      layout: { w: 6, h: 2 }
    },
    { 
      widgetId: 'airflow-dag-runs', 
      title: 'Airflow DAG runs', 
      type: 'Table', 
      description: 'A list of recent Airflow DAG runs.',
      tags: ['Performance', 'Account Specific'],
      layout: { w: 6, h: 2 }
    },
    { 
      widgetId: 'avg-time-to-run', 
      title: 'Avg time to run', 
      type: 'StatCard', 
      description: 'Average runtime for tasks.',
      tags: ['Performance'],
      layout: { w: 3, h: 1 }
    },
     { 
      widgetId: 'cost-by-warehouse', 
      title: 'Cost by Warehouse', 
      type: 'BarChart', 
      description: 'Breakdown of cost per warehouse.',
      tags: ['Cost', 'Account Specific'],
      layout: { w: 6, h: 2 }
    },
    { 
      widgetId: 'total-spend', 
      title: 'Total Spend', 
      type: 'StatCard', 
      description: 'Total spend over a period.',
      tags: ['Cost'],
      layout: { w: 3, h: 1 }
    },
    { 
      widgetId: 'spend-breakdown', 
      title: 'Spend Breakdown', 
      type: 'DonutChart', 
      description: 'Spend breakdown by compute and storage.',
      tags: ['Cost'],
      layout: { w: 4, h: 2 }
    },
];

export const connectionsData: Account[] = [
  { id: '1', name: 'Snowflake Prod', identifier: 'acme.eu-west-1', role: 'SYSADMIN', status: 'Connected', lastSynced: '5 mins ago', cost: 1250, credits: 500 },
  { id: '2', name: 'Marketing Dev', identifier: 'acme.us-east-1', role: 'ACCOUNTADMIN', status: 'Connected', lastSynced: '15 mins ago', cost: 345, credits: 138 },
  { id: '3', name: 'BI Snowflake', identifier: 'acme-bi.eu-central-1', role: 'SYSADMIN', status: 'Syncing', lastSynced: 'Just now', cost: 890, credits: 356 },
  { id: '4', name: 'Archived Data', identifier: 'legacy.us-west-2', role: 'SECURITYADMIN', status: 'Error', lastSynced: '2 days ago', cost: 50, credits: 20 },
  { id: '5', name: 'Data Science WH', identifier: 'ds.eu-west-1', role: 'SYSADMIN', status: 'Disconnected', lastSynced: '1 week ago', cost: 2300, credits: 920 },
];

export const dashboardsData: DashboardItem[] = [
    {
        id: 'dash-1',
        title: 'Airflow Monitoring',
        createdOn: 'November 16, 2023, 8:45 AM',
        description: 'Dashboard to monitor Airflow performance and status.',
        widgets: [
             { 
              id: 'w1-1', widgetId: 'airflow-dag-durations', title: 'Airflow DAG durations', type: 'LineChart', description: 'Shows the most frequent Airflow DAGs and their duration.',
              dataSource: { type: 'account', accountId: '1' }, layout: { w: 6, h: 2 }
            },
            { 
              id: 'w1-2', widgetId: 'airflow-dag-runs', title: 'Airflow DAG runs', type: 'Table', description: 'A list of recent Airflow DAG runs.',
              dataSource: { type: 'account', accountId: '1' }, layout: { w: 6, h: 2 }
            },
        ],
        dataSourceContext: { type: 'account', accountId: '1' },
    },
    {
        id: 'dash-2',
        title: 'Overall Spend Analytics',
        createdOn: 'October 28, 2023, 2:15 PM',
        description: 'High-level overview of spend across all connected accounts.',
        widgets: [
             { 
              id: 'w2-1', widgetId: 'total-spend', title: 'Total Spend', type: 'StatCard', description: 'Total spend over a period.',
              dataSource: { type: 'overall' }, layout: { w: 3, h: 1 }
            },
            { 
              id: 'w2-2', widgetId: 'spend-breakdown', title: 'Spend Breakdown', type: 'DonutChart', description: 'Spend breakdown by compute and storage.',
              dataSource: { type: 'overall' }, layout: { w: 4, h: 2 }
            },
        ],
        dataSourceContext: { type: 'overall' },
    }
];

export const sqlFilesData: SQLFile[] = [
    {
        id: 'file-1',
        name: 'daily_metrics.sql',
        versions: [
            { id: 'v1-1', version: 2, date: '2023-11-15', tag: 'Production', description: 'Optimized join condition.' },
            { id: 'v1-2', version: 1, date: '2023-11-12', tag: 'Archived', description: 'Initial commit.' },
        ]
    },
    {
        id: 'file-2',
        name: 'user_segmentation_query.sql',
        versions: [
            { id: 'v2-1', version: 1, date: '2023-11-10', tag: 'Staging', description: 'First draft of segmentation logic.' },
        ]
    }
];

export const overviewMetrics = {
    cost: {
        current: 4835,
        forecasted: 9200,
    },
    credits: {
        current: 1934,
        forecasted: 3680,
    }
};

export const ytdOverviewMetrics = {
    cost: {
        current: 58020,
        forecasted: 62500,
    },
    credits: {
        current: 23208,
        forecasted: 25000,
    }
};

export const resourceSummaryData = [
    { title: 'Warehouses', value: '12' },
    { title: 'Databases', value: '34' },
    { title: 'Active users', value: '87' },
    { title: 'Avg. daily queries', value: '14.2k' },
    { title: 'Avg. query cost', value: '$0.03' },
];

export const costBreakdownData = [
    { name: 'Warehouse', percentage: 85, cost: 4110, credits: 1644, color: '#6932D5' },
    { name: 'Storage', percentage: 15, cost: 725, credits: 290, color: '#A78BFA' },
];

export const accountSpend = {
    cost: { monthly: 1250, forecasted: 2400 },
    credits: { monthly: 500, forecasted: 960 },
};

export const topQueriesData: TopQuery[] = [
  { id: 'q1', queryText: 'SELECT * FROM sales_fact WHERE date > ...', credits: 120, cost: 300, user: 'Alice', duration: '00:02:15' },
  { id: 'q2', queryText: 'INSERT INTO marketing_agg SELECT ...', credits: 95, cost: 237.5, user: 'Bob', duration: '00:01:30' },
  { id: 'q3', queryText: 'SELECT c.name, SUM(s.amount) FROM ...', credits: 82, cost: 205, user: 'Alice', duration: '00:05:02' },
  { id: 'q4', queryText: 'CREATE TABLE temp_users AS SELECT ...', credits: 71, cost: 177.5, user: 'Charlie', duration: '00:00:45' },
  { id: 'q5', queryText: 'SELECT DISTINCT user_id FROM events ...', credits: 65, cost: 162.5, user: 'David', duration: '00:03:10' },
];

export const accountCostBreakdown = [
  { name: 'Warehouse', percentage: 78, cost: 975, credits: 390, color: '#6932D5' },
  { name: 'Storage', percentage: 22, cost: 275, credits: 110, color: '#A78BFA' },
];

export const warehousesData: Warehouse[] = [
    { id: 'w1', name: 'COMPUTE_WH', avgUtilization: 75, peakUtilization: 92, status: 'Active', cost: 850, credits: 340 },
    { id: 'w2', name: 'TRANSFORM_WH', avgUtilization: 40, peakUtilization: 65, status: 'Active', cost: 250, credits: 100 },
    { id: 'w3', name: 'BI_WH', avgUtilization: 60, peakUtilization: 88, status: 'Active', cost: 125, credits: 50 },
    { id: 'w4', name: 'IDLE_WH', avgUtilization: 5, peakUtilization: 10, status: 'Idle', cost: 25, credits: 10 },
];

export const usersData: User[] = [
    { id: 'user-1', name: 'Alice Johnson', email: 'alice.j@example.com', role: 'Admin', status: 'Active', dateAdded: '2023-01-15', cost: 1200, credits: 480, roleTitle: 'Lead Data Analyst', avatarUrl: '...' },
    { id: 'user-2', name: 'Bob Williams', email: 'bob.w@example.com', role: 'Analyst', status: 'Active', dateAdded: '2023-02-20', cost: 850, credits: 340 },
    { id: 'user-3', name: 'Charlie Brown', email: 'charlie.b@example.com', role: 'Viewer', status: 'Active', dateAdded: '2023-03-10', cost: 150, credits: 60 },
    { id: 'user-4', name: 'David Miller', email: 'david.m@example.com', role: 'Analyst', status: 'Suspended', dateAdded: '2023-04-05', cost: 400, credits: 160 },
    { id: 'user-5', name: 'Eve Davis', email: 'eve.d@example.com', role: 'Admin', status: 'Invited', dateAdded: '2023-05-22', cost: 0, credits: 0, message: 'Invitation pending' },
    { id: 'user-6', name: 'Frank White', email: 'frank.w@example.com', role: 'Analyst', status: 'Active', dateAdded: '2023-06-18', cost: 980, credits: 392 },
    { id: 'user-7', name: 'Grace Hall', email: 'grace.h@example.com', role: 'Viewer', status: 'Active', dateAdded: '2023-07-01', cost: 90, credits: 36 },
];

export const similarQueriesData: SimilarQuery[] = [
  { id: 'sq1', name: 'SELECT a.col1, b.col2 FROM table1 a JOIN table2 b ON a.id = b.id WHERE a.date > ?', similarity: 98, executionTime: 1200, warehouse: 'COMPUTE_WH', cost: 0.12, credits: 0.048, pattern: 'Join-heavy' },
  { id: 'sq2', name: 'SELECT a.col1, b.col2 FROM table1 a JOIN table2 b ON a.id = b.id WHERE a.date > ?', similarity: 98, executionTime: 1250, warehouse: 'COMPUTE_WH', cost: 0.13, credits: 0.052, pattern: 'Join-heavy' },
  { id: 'sq3', name: 'SELECT user_id, COUNT(DISTINCT session_id) FROM events GROUP BY 1', similarity: 95, executionTime: 800, warehouse: 'BI_WH', cost: 0.08, credits: 0.032, pattern: 'Aggregation-heavy' },
  { id: 'sq4', name: 'SELECT user_id, COUNT(DISTINCT session_id) FROM events GROUP BY 1', similarity: 95, executionTime: 820, warehouse: 'BI_WH', cost: 0.09, credits: 0.036, pattern: 'Aggregation-heavy' },
  { id: 'sq5', name: 'SELECT * FROM large_raw_table WHERE ingestion_time > ?', similarity: 99, executionTime: 3500, warehouse: 'TRANSFORM_WH', cost: 0.35, credits: 0.14, pattern: 'Scan-heavy' },
];

export const queryListData: QueryListItem[] = Array.from({ length: 500 }, (_, i) => {
    const cost = parseFloat((Math.random() * 2 + 0.01).toFixed(2));
    const durationMins = Math.floor(Math.random() * 5);
    const durationSecs = Math.floor(Math.random() * 60);
    const estSavings = cost * (Math.random() * 0.5);
    return {
        id: `q-list-${i}-${Date.now()}`,
        status: Math.random() > 0.1 ? 'Success' : 'Failed',
        costUSD: cost,
        costCredits: parseFloat((cost * 0.4).toFixed(2)),
        duration: `00:${durationMins.toString().padStart(2, '0')}:${durationSecs.toString().padStart(2, '0')}`,
        warehouse: warehousesData[Math.floor(Math.random() * warehousesData.length)].name,
        estSavingsUSD: parseFloat(estSavings.toFixed(2)),
        estSavingsPercent: parseFloat(((estSavings / cost) * 100).toFixed(1)),
        queryText: `SELECT col_${i} FROM table_${i % 10} JOIN other_table ON ... WHERE condition = true;`,
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        type: ['SELECT', (['JOIN', 'WHERE', 'Aggregation'] as QueryType[])[i % 3]],
        user: usersData[Math.floor(Math.random() * usersData.length)].name,
    };
});


// --- Storage-related Dummy Data ---

export const totalStorageMetrics = {
    totalSizeGB: 12400,
    totalCost: 28520,
    activeTables: 450,
};

export const storageGrowthForecast = {
    nextMonthSizeGB: 13200,
    nextMonthCost: 30360,
};

export const storageBreakdownData: StorageBreakdownItem[] = [
    { name: "PROD_ANALYTICS", value: 4500, color: "#6932D5" },
    { name: "RAW_DATA_LAKE", value: 6200, color: "#A78BFA" },
    { name: "STAGING_DB", value: 1500, color: "#D8B4FE" },
    { name: "OTHER", value: 200, color: "#E9D5FF" },
];

export const topStorageConsumersData: TopStorageConsumer[] = [
    { name: "EVENTS_LOG_2023_Q4", size: 1200, monthlyGrowth: 15, rows: 2500000000 },
    { name: "USER_SESSIONS_RAW", size: 850, monthlyGrowth: 8, rows: 12000000000 },
    { name: "PRODUCT_CATALOG_HISTORY", size: 420, monthlyGrowth: 2, rows: 50000000 },
    { name: "FINANCIAL_TXNS_ARCHIVE", size: 380, monthlyGrowth: 0.5, rows: 950000000 },
    { name: "MARKETING_CAMPAIGN_RESULTS", size: 210, monthlyGrowth: 25, rows: 80000000 },
];

export const storageGrowthData: StorageGrowthPoint[] = [
  { date: 'Jan', 'Active Storage (GB)': 8200, 'Time Travel (GB)': 1200 },
  { date: 'Feb', 'Active Storage (GB)': 8500, 'Time Travel (GB)': 1250 },
  { date: 'Mar', 'Active Storage (GB)': 9100, 'Time Travel (GB)': 1300 },
  { date: 'Apr', 'Active Storage (GB)': 9400, 'Time Travel (GB)': 1350 },
  { date: 'May', 'Active Storage (GB)': 10200, 'Time Travel (GB)': 1400 },
  { date: 'Jun', 'Active Storage (GB)': 11500, 'Time Travel (GB)': 1500 },
  { date: 'Jul', 'Active Storage (GB)': 12400, 'Time Travel (GB)': 1600 },
];

// --- Data Tiering ---
export const dataAgeDistributionData: DataAgeDistributionItem[] = [
    { ageBucket: '> 1 year', sizeGB: 5200 },
    { ageBucket: '6-12 months', sizeGB: 3100 },
    { ageBucket: '3-6 months', sizeGB: 1800 },
    { ageBucket: '1-3 months', sizeGB: 1500 },
    { ageBucket: '< 1 month', sizeGB: 800 },
];

export const storageByTierData: { current: StorageTierItem[], recommended: StorageTierItem[] } = {
    current: [
        { name: 'Hot', value: 8.5, color: '#DC2626' },
        { name: 'Warm', value: 3.0, color: '#F59E0B' },
        { name: 'Cold', value: 0.9, color: '#2563EB' },
    ],
    recommended: [
        { name: 'Hot', value: 4.2, color: '#DC2626' },
        { name: 'Warm', value: 5.1, color: '#F59E0B' },
        { name: 'Cold', value: 3.1, color: '#2563EB' },
    ]
};

export const tieringOpportunitiesData: TieringOpportunityItem[] = [
    { id: 'to1', tableName: 'LOGS_ARCHIVE_2022', size: '1.2 TB', currentTier: 'Hot', recommendedTier: 'Cold', potentialSavings: 1500 },
    { id: 'to2', tableName: 'CUSTOMER_REVIEWS_TEXT', size: '450 GB', currentTier: 'Hot', recommendedTier: 'Warm', potentialSavings: 350 },
    { id: 'to3', tableName: 'SENSOR_DATA_Q1_2023', size: '800 GB', currentTier: 'Warm', recommendedTier: 'Cold', potentialSavings: 420 },
    { id: 'to4', tableName: 'OLD_PRODUCT_IMAGES', size: '300 GB', currentTier: 'Hot', recommendedTier: 'Cold', potentialSavings: 280 },
];

export const policyComplianceData = {
    compliancePercentage: 82,
};


// --- Cost Forecasting ---
export const costSpendForecastData: CostForecastPoint[] = Array.from({length: 30}, (_, i) => ({
    day: i + 1,
    actual: i < 15 ? 1000 + (i * 50) + (Math.random() * 200) : null,
    forecast: 1000 + (i * 55),
}));

export const costForecastByTierData: TierForecastPoint[] = [
    { month: 'Jul', Hot: 12000, Warm: 5000, Cold: 1200 },
    { month: 'Aug', Hot: 12500, Warm: 5200, Cold: 1300 },
    { month: 'Sep', Hot: 13000, Warm: 5500, Cold: 1400 },
    { month: 'Oct', Hot: 13200, Warm: 5800, Cold: 1500 },
    { month: 'Nov', Hot: 13800, Warm: 6200, Cold: 1600 },
    { month: 'Dec', Hot: 14500, Warm: 6500, Cold: 1800 },
];

export const costAnomalyAlertsData: AnomalyAlertItem[] = [
    { id: 'an1', tableName: 'ETL_TEMP_TABLES', projection: 'Storage cost projected to increase by 250% this month.' },
    { id: 'an2', tableName: 'API_USAGE_LOGS', projection: 'Data ingestion volume is 3x higher than the 30-day average.' },
];

export const costSavingsProjectionData: SavingsProjection = {
    message: 'Based on AI analysis of your data access patterns and tiering opportunities, you could save up to:',
    savingsPercentage: 18,
};

export const storageSummaryData = {
    totalStorageGB: 2655.5,
    totalSpend: 3983.53,
};

export const databasesData: Database[] = [
    { id: 'db-1', name: 'PROD_ANALYTICS', sizeGB: 4500, cost: 11250, tableCount: 120, userCount: 45, users: usersData.slice(0, 5).map(u => ({ id: u.id, name: u.name })) },
    { id: 'db-2', name: 'RAW_DATA_LAKE', sizeGB: 6200, cost: 14880, tableCount: 45, userCount: 12, users: usersData.slice(2, 4).map(u => ({ id: u.id, name: u.name })) },
    { id: 'db-3', name: 'STAGING_DB', sizeGB: 1500, cost: 2100, tableCount: 250, userCount: 22, users: usersData.slice(4, 7).map(u => ({ id: u.id, name: u.name })) },
    { id: 'db-4', name: 'MARKETING_DB', sizeGB: 200, cost: 290, tableCount: 30, userCount: 8, users: usersData.slice(1, 3).map(u => ({ id: u.id, name: u.name })) },
];

export const databaseTablesData: DatabaseTable[] = Array.from({ length: 20 }, (_, i) => ({
    id: `tbl-${i + 1}`,
    name: `EVENTS_LOG_PART_${i + 1}`,
    sizeGB: parseFloat((Math.random() * 50 + 5).toFixed(2)),
    rows: Math.floor(Math.random() * 10000000) + 500000,
    monthlyGrowth: parseFloat((Math.random() * 5 - 1).toFixed(1)), // Can be negative
}));

export const storageByTypeData: StorageByTypeItem[] = [
  { type: 'Active Tables', storageGB: 1847.2, cost: 2771.08, color: '#6932D5' },
  { type: 'Time Travel', storageGB: 456.8, cost: 685.20, color: '#A78BFA' },
  { type: 'Failsafe', storageGB: 231.5, cost: 347.25, color: '#C4B5FD' },
  { type: 'Staging', storageGB: 120.0, cost: 180.00, color: '#E9D5FF' },
];

export const assignedQueriesData: AssignedQuery[] = [
    {
        id: 'aq-1',
        queryId: queryListData[0].id,
        queryText: queryListData[0].queryText,
        assignedBy: 'Alice Johnson',
        assignedTo: 'Bob Williams',
        priority: 'High',
        status: 'Pending',
        message: 'This query is consuming 12k credits, check for joins. It runs every hour and is blocking other processes.',
        assignedOn: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        cost: queryListData[0].costUSD,
        credits: queryListData[0].costCredits,
    },
    {
        id: 'aq-2',
        queryId: queryListData[5].id,
        queryText: queryListData[5].queryText,
        assignedBy: 'Alice Johnson',
        assignedTo: 'Frank White',
        priority: 'Medium',
        status: 'In Progress',
        message: 'Seeing high execution time on this one. Can we optimize the WHERE clause?',
        assignedOn: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        cost: queryListData[5].costUSD,
        credits: queryListData[5].costCredits,
    },
];
