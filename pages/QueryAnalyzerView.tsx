import React, { useState, useEffect } from 'react';
import { QueryListItem } from '../types';
import { IconChevronLeft, IconSave, IconClipboardCopy, IconRefresh, IconKey, IconSearch, IconDatabase, IconCheck, IconFilter, IconLayers, IconBeaker, IconTrendingUp, IconWand } from '../constants';

interface AnalysisResult {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    category: 'core' | 'performance';
}

const realWorldQuery = `
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

  regional_analysis AS (
    SELECT
      c.region,
      p.category,
      DATE_TRUNC('month', o.order_date) AS sales_month,
      SUM(oi.quantity * p.price) AS monthly_regional_revenue
    FROM customers c
    JOIN orders o ON c.customer_id = o.customer_id
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.product_id
    GROUP BY 1, 2, 3
  )

-- Final selection from the comprehensive report
SELECT 
    clv.first_name || ' ' || clv.last_name AS full_name,
    clv.total_spent,
    ra.region,
    ra.sales_month,
    ra.monthly_regional_revenue
FROM customer_lifetime_value clv
JOIN regional_analysis ra ON clv.customer_id = ra.customer_id -- Simplified join
WHERE
  clv.total_spent > 500
  AND ra.region = 'North America'
  AND ra.sales_month >= '2023-01-01'
ORDER BY
  ra.sales_month DESC,
  clv.total_spent DESC
LIMIT 500;
`;

const mockAnalysisResults: AnalysisResult[] = [
    {
        id: 'rec1',
        title: 'Filter Pushdown Opportunity',
        description: "The filter `region = 'North America'` is applied in the final SELECT. Pushing this filter into the `regional_analysis` CTE would significantly reduce data processed by subsequent joins.",
        icon: IconFilter,
        category: 'core',
    },
    {
        id: 'rec2',
        title: 'Clustering Key Recommendation',
        description: 'Query plan shows a full table scan on `orders`. Clustering the `orders` table by `order_date` would improve performance of date-range filters and the `daily_sales` CTE.',
        icon: IconKey,
        category: 'core',
    },
    {
        id: 'rec3',
        title: 'CTE Optimization',
        description: 'The `customer_lifetime_value` CTE processes entire tables. Consider creating a materialized view or an aggregated summary table for this foundational business metric.',
        icon: IconLayers,
        category: 'core',
    },
    {
        id: 'rec4',
        title: 'Expensive Function Usage',
        description: "`COUNT(DISTINCT ...)` in `daily_sales` is computationally expensive. If an approximation is acceptable, consider using `APPROX_COUNT_DISTINCT` for faster results.",
        icon: IconBeaker,
        category: 'performance',
    },
    {
        id: 'rec5',
        title: 'Warehouse Sizing',
        description: 'This query\'s complexity and data volume may benefit from a larger warehouse. The current plan shows some local disk spilling. Try running on a MEDIUM warehouse.',
        icon: IconDatabase,
        category: 'performance',
    },
    {
        id: 'rec6',
        title: 'Cost Impact Projection',
        description: 'Applying core recommendations could reduce query execution time by an estimated 40-60% and lower credit consumption by approximately 0.4 credits per run.',
        icon: IconTrendingUp,
        category: 'performance',
    },
];

const AnalysisResultCard: React.FC<{ result: AnalysisResult }> = ({ result }) => {
    const Icon = result.icon;
    return (
        <div className="bg-surface p-4 rounded-xl flex items-start gap-4 border border-border-color">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
                <h4 className="font-semibold text-text-primary">{result.title}</h4>
                <p className="text-sm text-text-secondary mt-1">{result.description}</p>
            </div>
        </div>
    );
};

const QueryAnalyzerView: React.FC<{
    query: QueryListItem | null;
    onBack: () => void;
    onSaveClick: (tag: string) => void;
    onBrowseQueries: () => void;
    onOptimizeQuery: (query: QueryListItem) => void;
}> = ({ query, onBack, onSaveClick, onBrowseQueries, onOptimizeQuery }) => {
    const originalQuery = query ? realWorldQuery : '';
    const [editedQuery, setEditedQuery] = useState(originalQuery);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResults, setAnalysisResults] = useState<AnalysisResult[]>([]);
    const [isCopied, setIsCopied] = useState(false);
    
    const isDirty = editedQuery !== originalQuery;

    useEffect(() => {
        setEditedQuery(query ? realWorldQuery : '');
        setAnalysisResults([]);
    }, [query]);

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        setAnalysisResults([]);
        setTimeout(() => {
            setAnalysisResults(mockAnalysisResults);
            setIsAnalyzing(false);
        }, 2500);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(editedQuery);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleReset = () => {
        setEditedQuery(originalQuery);
    };
    
    const coreResults = analysisResults.filter(r => r.category === 'core');
    const performanceResults = analysisResults.filter(r => r.category === 'performance');
    
    const EmptyState = () => (
        <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 bg-surface-nested rounded-full flex items-center justify-center mb-4 border border-border-color">
                <IconSearch className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary">Analyze your Snowflake queries</h3>
            <p className="text-text-secondary mt-1 max-w-md">Select a query from the "All Queries" list to begin analysis, or paste your query directly into the editor to get started.</p>
        </div>
    );

    return (
        <div className="p-4 space-y-4 h-full flex flex-col">
            <header className="flex-shrink-0">
                {query && (
                    <button onClick={onBack} className="flex items-center gap-1 text-sm font-semibold text-link hover:underline mb-2">
                        <IconChevronLeft className="h-4 w-4" /> Back to All Queries
                    </button>
                )}
                <h1 className="text-2xl font-bold text-text-primary">Query Analyzer</h1>
            </header>

            <main className="flex-grow flex flex-col md:flex-row gap-4 overflow-hidden">
                {/* Editor Panel */}
                <div className="w-full md:w-3/5 flex flex-col">
                     <div className="flex-grow bg-surface p-4 rounded-xl border border-border-color flex flex-col">
                        <h3 className="text-base font-semibold text-text-strong mb-2">Query to be Analyzed</h3>
                        <textarea
                            value={editedQuery}
                            onChange={(e) => setEditedQuery(e.target.value)}
                            className="w-full flex-grow bg-input-bg font-mono text-sm p-4 rounded-lg border border-border-color focus:ring-primary focus:border-primary resize-none"
                            aria-label="SQL Query Editor"
                            placeholder="Paste or write a query to start analysis."
                        />
                        <div className="flex items-center gap-2 pt-4 mt-auto">
                            <button
                                onClick={handleAnalyze}
                                disabled={!editedQuery.trim()}
                                className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-full shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Analyze
                            </button>
                            <button
                                onClick={() => query && onOptimizeQuery(query)}
                                disabled={analysisResults.length === 0}
                                className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color bg-surface hover:bg-surface-hover text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Optimize
                            </button>
                            <button
                                onClick={() => onSaveClick('Analyzed')}
                                disabled={analysisResults.length === 0}
                                className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color bg-surface hover:bg-surface-hover text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Save
                            </button>
                            <button
                                onClick={handleCopy}
                                className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color bg-surface hover:bg-surface-hover text-text-primary"
                            >
                                {isCopied ? 'Copied!' : 'Copy'}
                            </button>
                            {isDirty && (
                                <button
                                    onClick={handleReset}
                                    disabled={!isDirty}
                                    className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color bg-surface hover:bg-surface-hover text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Analysis Panel */}
                <div className="w-full md:w-2/5 flex flex-col">
                    {isAnalyzing ? (
                        <div className="bg-surface rounded-xl border border-border-color h-full flex flex-col items-center justify-center text-center p-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            <p className="mt-4 text-sm text-text-secondary max-w-md">
                                 <b>What’s happening:</b> Analyzing your query execution plan, identifying performance bottlenecks, scanning table statistics, and generating optimization recommendations. Complex queries may require additional processing time.
                            </p>
                        </div>
                    ) : analysisResults.length > 0 ? (
                        <div className="bg-surface rounded-xl border border-border-color h-full flex flex-col">
                            <h3 className="text-base font-semibold text-text-strong p-4 border-b border-border-color flex-shrink-0">Analysis Results</h3>
                            <div className="overflow-y-auto p-4">
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-semibold text-text-secondary">Core Optimization</h4>
                                        {coreResults.map(result => <AnalysisResultCard key={result.id} result={result} />)}
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-sm font-semibold text-text-secondary">Performance Insights</h4>
                                        {performanceResults.map(result => <AnalysisResultCard key={result.id} result={result} />)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-surface rounded-xl border border-border-color h-full flex flex-col items-center justify-center text-center p-8">
                            <div className="w-16 h-16 bg-surface-nested rounded-full flex items-center justify-center mb-4 border border-border-color">
                                <IconBeaker className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary">Ready for Analysis</h3>
                            <p className="text-text-secondary mt-1">Click "Analyze" to see optimization recommendations.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default QueryAnalyzerView;