
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import StatCard from '../components/StatCard';
import RecentQueries from '../components/RecentQueries';
import AIActions from '../components/AIActions';
import ChartCard from '../components/ChartCard';
import { overviewStats, costData, warehouseData, recentQueries, aiRecommendations } from '../data/dummyData';
import { IconLink, IconChartBar, IconDocumentReport, IconSparkles } from '../constants';

const Overview: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Overview</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard title="Connections" value={overviewStats.connections.toString()} icon={<IconLink className="w-8 h-8 text-blue-400" />} />
        <StatCard title="Warehouses" value={overviewStats.warehouses.toString()} icon={<IconChartBar className="w-8 h-8 text-green-400" />} />
        <StatCard title="Total Queries (24h)" value={overviewStats.queries.toLocaleString()} icon={<IconDocumentReport className="w-8 h-8 text-yellow-400" />} />
        <StatCard title="Anomalies Detected" value={overviewStats.anomalies.toString()} icon={<IconSparkles className="w-8 h-8 text-red-400" />} />
        <StatCard title="Potential Savings" value={overviewStats.savings} icon={<div className="text-3xl font-bold text-violet-400">$</div>} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Compute Cost (Last 7 Days)">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={costData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}/>
                <Area type="monotone" dataKey="cost" stroke="#8884d8" fillOpacity={1} fill="url(#colorCost)" />
              </AreaChart>
            </ResponsiveContainer>
        </ChartCard>
         <ChartCard title="Queries by Warehouse">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={warehouseData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)"/>
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} cursor={{fill: 'rgba(136, 132, 216, 0.2)'}}/>
                <Legend />
                <Bar dataKey="queries" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
        </ChartCard>
      </div>
      
      {/* Lower Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <RecentQueries queries={recentQueries} />
        </div>
        <div>
            <AIActions recommendations={aiRecommendations} />
        </div>
      </div>

    </div>
  );
};

export default Overview;
