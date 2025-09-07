
import { OverviewStats, CostDataPoint, WarehouseDataPoint, Query, Recommendation } from '../types';

export const overviewStats: OverviewStats = {
  connections: 3,
  warehouses: 12,
  queries: 1540,
  anomalies: 4,
  savings: '$12,430',
};

export const costData: CostDataPoint[] = [
  { name: 'Mon', cost: 400 },
  { name: 'Tue', cost: 300 },
  { name: 'Wed', cost: 500 },
  { name: 'Thu', cost: 280 },
  { name: 'Fri', cost: 450 },
  { name: 'Sat', cost: 320 },
  { name: 'Sun', cost: 210 },
];

export const warehouseData: WarehouseDataPoint[] = [
    { name: 'WH_PROD', queries: 2400, cost: 5600 },
    { name: 'WH_DEV', queries: 1200, cost: 2100 },
    { name: 'WH_STAGING', queries: 800, cost: 1500 },
    { name: 'WH_BI', queries: 1800, cost: 3200 },
    { name: 'WH_ETL', queries: 3200, cost: 7800 },
];

export const recentQueries: Query[] = [
  { id: 'q1', user: 'alice@company.com', sql: 'SELECT * FROM sales_data LIMIT 10;', status: 'Success', duration: '2.1s', cost: '$0.02', timestamp: '2m ago' },
  { id: 'q2', user: 'bob@company.com', sql: 'SELECT COUNT(*) FROM user_activity WHERE...', status: 'Failed', duration: '30.5s', cost: '$0.15', timestamp: '5m ago' },
  { id: 'q3', user: 'data_loader', sql: 'COPY INTO raw_logs FROM @s3_stage/...', status: 'Running', duration: '5m 12s', cost: '$1.20', timestamp: '10m ago' },
  { id: 'q4', user: 'charlie@company.com', sql: 'WITH complex_cte AS (...) SELECT ...', status: 'Success', duration: '15.2s', cost: '$0.08', timestamp: '12m ago' },
  { id: 'q5', user: 'alice@company.com', sql: 'SELECT * FROM marketing_campaigns;', status: 'Success', duration: '1.5s', cost: '$0.01', timestamp: '15m ago' },
];

export const aiRecommendations: Recommendation[] = [
  { id: 'rec1', title: 'Optimize Query #4521', description: 'This query can be optimized by adding a clustering key on the `event_timestamp` column, potentially reducing scan size by 80%.', category: 'Performance', impact: 'High' },
  { id: 'rec2', title: 'Resize WH_DEV Warehouse', description: 'The development warehouse is oversized for its current workload. Consider resizing from M to S to save an estimated $400/month.', category: 'Cost', impact: 'Medium' },
  { id: 'rec3', title: 'Archive Unused Tables', description: 'Tables `log_archive_2021` and `temp_user_data` have not been accessed in over 180 days. Consider archiving to reduce storage costs.', category: 'Storage', impact: 'Low' },
];
