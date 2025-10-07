import React from 'react';
import { QueryListItem } from '../types';
import { IconChevronLeft, IconClipboardCopy, IconCheck } from '../constants';

const MetricCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-surface-nested p-4 rounded-2xl ${className}`}>
        <h4 className="text-sm font-medium text-text-secondary">{title}</h4>
        <div className="text-lg font-semibold text-text-primary mt-1 truncate">{children}</div>
    </div>
);

const QueryDetailView: React.FC<{ query: QueryListItem; onBack: () => void; }> = ({ query, onBack }) => {
    const [isCopied, setIsCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(query.id);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };
    
    // Helper to format bytes
    const formatBytes = (bytes: number, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const startTime = new Date(query.timestamp).toLocaleString();
    const durationParts = query.duration.split(':').map(Number);
    const durationMs = (durationParts[0] * 3600 + durationParts[1] * 60 + durationParts[2]) * 1000;
    const endTime = new Date(new Date(query.timestamp).getTime() + durationMs).toLocaleString();

    // A long, realistic-looking SQL query for demonstration.
    const longQueryText = `
WITH
  daily_sales AS (
    SELECT
      DATE(order_date) AS sale_date,
      SUM(oi.quantity * p.price) AS daily_revenue,
      COUNT(DISTINCT o.order_id) AS daily_orders
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    WHERE o.status NOT IN ('cancelled', 'returned')
    GROUP BY 1
  ),

  customer_lifetime_value AS (
    SELECT
      c.customer_id,
      c.first_name,
      c.last_name,
      MIN(o.order_date) AS first_order_date,
      MAX(o.order_date) AS last_order_date,
      COUNT(o.order_id) AS number_of_orders,
      SUM(oi.quantity * p.price) AS total_spent
    FROM customers c
    JOIN orders o ON c.customer_id = o.customer_id
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    GROUP BY 1, 2, 3
  ),

  product_performance AS (
    SELECT
      p.product_id,
      p.name AS product_name,
      p.category,
      SUM(oi.quantity) AS units_sold,
      SUM(oi.quantity * p.price) AS product_revenue,
      AVG(oi.quantity * p.price) AS avg_order_value
    FROM products p
    JOIN order_items oi ON p.product_id = oi.product_id
    GROUP BY 1, 2, 3
  ),

  regional_analysis AS (
    SELECT
      c.region,
      p.category,
      DATE_TRUNC('month', o.order_date) AS sales_month,
      SUM(oi.quantity * p.price) AS monthly_regional_revenue,
      COUNT(DISTINCT o.customer_id) AS unique_customers
    FROM customers c
    JOIN orders o ON c.customer_id = o.customer_id
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    GROUP BY 1, 2, 3
  ),

  user_sessions AS (
    SELECT
      user_id,
      session_id,
      MIN(event_timestamp) AS session_start,
      MAX(event_timestamp) AS session_end,
      COUNT(*) AS events_in_session
    FROM web_events
    WHERE event_timestamp >= DATEADD(day, -30, CURRENT_DATE())
    GROUP BY 1, 2
  ),
  
  marketing_attribution AS (
    SELECT
      o.order_id,
      c.customer_id,
      w.source AS first_touch_source,
      w_last.source AS last_touch_source
    FROM orders o
    JOIN customers c ON o.customer_id = c.customer_id
    JOIN (
      SELECT
        user_id,
        source,
        ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY event_timestamp ASC) as rn
      FROM web_events
      WHERE source IS NOT NULL
    ) w ON c.customer_id = w.user_id AND w.rn = 1
    JOIN (
      SELECT
        user_id,
        source,
        ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY event_timestamp DESC) as rn
      FROM web_events
      WHERE source IS NOT NULL
    ) w_last ON c.customer_id = w_last.user_id AND w_last.rn = 1
  ),

  final_report AS (
    SELECT
      clv.customer_id,
      clv.first_name || ' ' || clv.last_name AS full_name,
      clv.total_spent,
      clv.number_of_orders,
      ra.region,
      ra.sales_month,
      ra.monthly_regional_revenue,
      pp.product_name,
      pp.units_sold,
      ma.first_touch_source,
      ma.last_touch_source,
      (clv.total_spent / clv.number_of_orders) AS avg_customer_order_value,
      LAG(ra.monthly_regional_revenue, 1, 0) OVER (PARTITION BY ra.region, pp.category ORDER BY ra.sales_month) AS prev_month_revenue,
      c.country,
      c.postal_code,
      p.supplier,
      oi.discount_amount,
      o.shipping_method,
      DATEDIFF(day, clv.first_order_date, clv.last_order_date) AS customer_lifespan_days
    FROM customer_lifetime_value clv
    JOIN regional_analysis ra ON clv.customer_id = ra.customer_id -- Simplified join for demo
    JOIN product_performance pp ON ra.product_category = pp.category -- Simplified join for demo
    LEFT JOIN marketing_attribution ma ON clv.customer_id = ma.customer_id
    LEFT JOIN customers c ON clv.customer_id = c.customer_id
    LEFT JOIN orders o ON ma.order_id = o.order_id
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.product_id
  )

-- Final selection from the comprehensive report
SELECT 
    full_name,
    total_spent,
    number_of_orders,
    avg_customer_order_value,
    customer_lifespan_days,
    region,
    sales_month,
    monthly_regional_revenue,
    (monthly_regional_revenue - prev_month_revenue) AS month_over_month_growth,
    product_name,
    units_sold,
    first_touch_source,
    last_touch_source,
    country,
    postal_code,
    supplier,
    discount_amount,
    shipping_method
FROM final_report
WHERE
  total_spent > 500
  AND region = 'North America'
  AND sales_month >= '2023-01-01'
  AND first_touch_source IN ('google', 'facebook', 'organic', 'email')
  AND last_touch_source NOT IN ('direct', 'internal')
  AND customer_lifespan_days > 15
ORDER BY
  sales_month DESC,
  total_spent DESC
LIMIT 500;

-- Note: This is a complex, long-form query created for demonstration purposes.
-- It is designed to test the UI's ability to display large blocks of code cleanly.
-- The logic and joins are illustrative and may not represent a perfectly optimized or runnable query without a corresponding schema.
-- The query showcases multiple Common Table Expressions (CTEs), window functions (LAG, ROW_NUMBER),
-- various JOIN types, and complex filtering to simulate a real-world analytical workload.
-- This level of complexity is common in data warehousing and business intelligence tasks.
-- The comments are also added to increase line count and mimic real developer code.
-- ...
-- ... further comments to extend the query length ...
-- ...
-- ...
-- ...
-- ...
-- ...
-- ...
-- ...
-- ...
-- ...
-- ...
-- ...
-- ...
-- ...
-- ...
-- End of demonstrative query.
`;

    return (
        <div className="max-w-7xl mx-auto p-4 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-2">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-surface-hover text-text-secondary flex-shrink-0">
                        <IconChevronLeft className="h-5 w-5" />
                        <span className="sr-only">Back</span>
                    </button>
                    <div className="flex items-center gap-2 overflow-hidden">
                        <h1 className="text-xl font-bold text-text-primary truncate font-mono" title={query.id}>{query.id}</h1>
                        <button onClick={handleCopy} className="text-text-secondary hover:text-text-primary flex-shrink-0">
                            {isCopied ? <IconCheck className="h-5 w-5 text-status-success" /> : <IconClipboardCopy className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
                <div className="flex items-center justify-end gap-3 flex-shrink-0">
                    <button className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color hover:bg-surface-hover">Analyze</button>
                    <button className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color hover:bg-surface-hover">Optimize</button>
                    <button className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-full">Simulate</button>
                </div>
            </div>
            
            <div className="bg-surface p-4 rounded-3xl">
                <h3 className="text-base font-semibold text-text-strong mb-4 px-2">Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MetricCard title="Duration">{query.duration}</MetricCard>
                    <MetricCard title="Credits">{query.costCredits.toFixed(2)}</MetricCard>
                    <MetricCard title="Bytes Scanned">{formatBytes(query.bytesScanned)}</MetricCard>
                    <MetricCard title="Bytes Written">{formatBytes(query.bytesWritten)}</MetricCard>
                    <MetricCard title="Warehouse">{query.warehouse}</MetricCard>
                    <MetricCard title="Start Time">{startTime}</MetricCard>
                    <MetricCard title="End Time">{endTime}</MetricCard>
                    <MetricCard title="Query Tag">{query.queryTag || 'N/A'}</MetricCard>
                </div>
            </div>

            <div className="bg-surface p-4 rounded-3xl">
                <h3 className="text-base font-semibold text-text-strong mb-4 px-2">Executed Query</h3>
                <pre className="bg-input-bg p-4 rounded-xl border border-border-color text-sm text-text-primary overflow-auto max-h-[60vh]">
                    <code>{longQueryText}</code>
                </pre>
            </div>
        </div>
    );
};

export default QueryDetailView;