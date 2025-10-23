import React, { useState, useRef, useEffect } from 'react';
import { Warehouse } from '../types';
import { IconChevronLeft, IconChevronRight, IconSummary, IconList, IconChevronDown, IconCheck } from '../constants';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { queryListData } from '../data/dummyData';
import Pagination from '../components/Pagination';

// --- PROPS INTERFACE ---
interface WarehouseDetailViewProps {
    warehouse: Warehouse;
    warehouses: Warehouse[];
    onSwitchWarehouse: (warehouse: Warehouse) => void;
    onBack: () => void;
}

// --- HELPER & CHILD COMPONENTS ---

const DetailItem: React.FC<{ label: string; value: React.ReactNode; }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-text-secondary">{label}</p>
        <div className="text-sm font-semibold text-text-primary mt-1">{value}</div>
    </div>
);

const StatusBadge: React.FC<{ status: Warehouse['status'] }> = ({ status }) => {
    const colorClasses: Record<Warehouse['status'], string> = {
        Running: 'bg-status-success-light text-status-success-dark',
        Active: 'bg-status-success-light text-status-success-dark',
        Suspended: 'bg-gray-200 text-gray-800',
        Idle: 'bg-status-info-light text-status-info-dark',
    };
    const dotClasses: Record<Warehouse['status'], string> = {
        Running: 'bg-status-success animate-pulse',
        Active: 'bg-status-success',
        Suspended: 'bg-gray-400',
        Idle: 'bg-status-info',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${colorClasses[status]}`}>
            <span className={`w-2 h-2 mr-2 rounded-full ${dotClasses[status]}`}></span>
            {status}
        </span>
    );
};

const WarehouseAvatar: React.FC<{ name: string }> = ({ name }) => {
    const initials = name.split('_').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return (
        <div className="h-8 w-8 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center flex-shrink-0">
            {initials}
        </div>
    );
};

const CreditTrendChart: React.FC = () => {
    const data = [
      { date: 'Oct 10', credits: 1.2 }, { date: 'Oct 11', credits: 1.5 }, { date: 'Oct 12', credits: 1.1 },
      { date: 'Oct 13', credits: 1.8 }, { date: 'Oct 14', credits: 2.0 }, { date: 'Oct 15', credits: 1.7 },
      { date: 'Oct 16', credits: 2.2 },
    ];
    return (
        <div className="bg-surface p-4 rounded-3xl break-inside-avoid mb-4">
            <h3 className="text-base font-semibold text-text-strong mb-3">Credit Trend (Last 7 Days)</h3>
            <div style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <XAxis dataKey="date" stroke="#9A9AB2" fontSize={12} />
                        <YAxis stroke="#9A9AB2" fontSize={12} unit="cr" />
                        <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E0', borderRadius: '1rem' }} formatter={(value: number) => [`${value.toFixed(2)}`, 'Credits']} />
                        <defs>
                            <linearGradient id="creditGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6932D5" stopOpacity={0.7}/>
                                <stop offset="95%" stopColor="#6932D5" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="credits" stroke="#6932D5" strokeWidth={2} fillOpacity={1} fill="url(#creditGradient)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

const PrivilegesTable: React.FC = () => {
    const privileges = [
        { role: 'SYSADMIN', privilege: 'OWNERSHIP', grantedTo: 'ROLE' },
        { role: 'ACCOUNTADMIN', privilege: 'ALL', grantedTo: 'ROLE' },
        { role: 'WAREHOUSE_OPERATORS', privilege: 'OPERATE', grantedTo: 'ROLE' },
        { role: 'WAREHOUSE_MONITORS', privilege: 'MONITOR', grantedTo: 'ROLE' },
        { role: 'ANALYST_ROLE', privilege: 'USAGE', grantedTo: 'ROLE' },
    ];
    return (
        <div className="bg-surface p-4 rounded-3xl break-inside-avoid mb-4">
            <h3 className="text-base font-semibold text-text-strong mb-3">Privileges</h3>
            <div className="overflow-auto" style={{ maxHeight: '300px' }}>
                <table className="w-full text-sm">
                    <thead className="text-left text-xs text-text-primary sticky top-0 bg-table-header-bg z-10">
                        <tr>
                            <th className="py-2 px-3 font-medium">Role</th>
                            <th className="py-2 px-3 font-medium">Privilege</th>
                            <th className="py-2 px-3 font-medium">Granted To</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-color">
                        {privileges.map((p, i) => (
                            <tr key={i} className="hover:bg-surface-hover">
                                <td className="py-2.5 px-3 font-semibold text-text-primary">{p.role}</td>
                                <td className="py-2.5 px-3 text-text-secondary">{p.privilege}</td>
                                <td className="py-2.5 px-3 text-text-secondary">{p.grantedTo}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const QueryHistoryTable: React.FC<{ warehouseName: string }> = ({ warehouseName }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const queries = queryListData.filter(q => q.warehouse === warehouseName);

    const totalPages = Math.ceil(queries.length / itemsPerPage);
    const paginatedQueries = queries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    
    return (
        <div className="bg-surface rounded-xl flex flex-col min-h-0 h-full">
             <div className="p-4 flex-shrink-0">
                <h2 className="text-xl font-bold text-text-strong">Executed Queries</h2>
                <p className="mt-1 text-text-secondary">History of queries executed on this warehouse.</p>
            </div>
            <div className="overflow-y-auto flex-grow min-h-0">
                <table className="w-full text-sm">
                    <thead className="text-sm text-text-primary sticky top-0 z-10 bg-table-header-bg">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-left">Query ID</th>
                            <th className="px-6 py-4 font-semibold text-left">User</th>
                            <th className="px-6 py-4 font-semibold text-left">Duration</th>
                            <th className="px-6 py-4 font-semibold text-left">Cost (Credits)</th>
                            <th className="px-6 py-4 font-semibold text-left">Start Time</th>
                        </tr>
                    </thead>
                    <tbody className="text-text-secondary bg-surface">
                        {paginatedQueries.map(q => (
                            <tr key={q.id} className="border-b border-border-light last:border-b-0 hover:bg-surface-hover">
                                <td className="px-6 py-3 font-mono text-xs text-link whitespace-nowrap">{q.id.substring(7, 13).toUpperCase()}</td>
                                <td className="px-6 py-3">{q.user}</td>
                                <td className="px-6 py-3">{q.duration}</td>
                                <td className="px-6 py-3">{q.costCredits.toFixed(3)}</td>
                                <td className="px-6 py-3">{new Date(q.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {queries.length > itemsPerPage && (
                <div className="flex-shrink-0">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={queries.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                    />
                </div>
            )}
        </div>
    );
};

// --- MAIN COMPONENT ---
const WarehouseDetailView: React.FC<WarehouseDetailViewProps> = ({ warehouse, warehouses, onSwitchWarehouse, onBack }) => {
    const [activeSection, setActiveSection] = useState('Warehouse Details');
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
    const switcherRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
                setIsSwitcherOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const navItems = [
        { name: 'Warehouse Details', icon: IconSummary },
        { name: 'Query History', icon: IconList }
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'Warehouse Details':
                return (
                    <div className="columns-1 lg:columns-2 gap-4">
                        <div className="bg-surface p-4 rounded-3xl break-inside-avoid mb-4">
                            <h3 className="text-base font-semibold text-text-strong">Details</h3>
                            <div className="grid grid-cols-3 gap-x-8 gap-y-6 mt-4">
                                <DetailItem label="Type" value="Standard" />
                                <DetailItem label="Status" value={<StatusBadge status={'Suspended'} />} />
                                <DetailItem label="Running" value="1 query" />
                                <DetailItem label="Queued" value="0 queries" />
                                <DetailItem label="Size" value={warehouse.size} />
                                <DetailItem label="Max Clusters" value="1" />
                                <DetailItem label="Min Clusters" value="1" />
                                <DetailItem label="Scaling Policy" value="STANDARD" />
                                <DetailItem label="Auto Suspend" value="600 seconds" />
                                <DetailItem label="Auto Resume" value="Enabled" />
                                <DetailItem label="Resumed On" value="3 hours ago" />
                                <DetailItem label="Query Acceleration" value="Disabled" />
                                <DetailItem label="Resource Constraint" value="STANDARD_GEN_1" />
                            </div>
                        </div>
                        <div className="bg-surface p-4 rounded-3xl break-inside-avoid mb-4">
                            <h3 className="text-base font-semibold text-text-strong mb-4">Credits Consumed</h3>
                            <div className="bg-surface-nested p-4 rounded-xl">
                                <p className="text-sm text-text-secondary">Total credits this period</p>
                                <p className="text-2xl font-bold text-text-primary mt-1 flex items-baseline">
                                    {warehouse.credits.toLocaleString()}
                                    <span className="text-sm font-medium text-text-secondary ml-1.5">credits</span>
                                </p>
                            </div>
                        </div>
                        <CreditTrendChart />
                        <PrivilegesTable />
                    </div>
                );
            case 'Query History':
                return <QueryHistoryTable warehouseName={warehouse.name} />;
            default:
                return null;
        }
    };
    
    return (
        <div className="flex h-full bg-background">
            <aside className={`bg-surface flex-shrink-0 flex flex-col transition-all duration-300 ${isSidebarExpanded ? 'w-64' : 'w-16'}`}>
                <div className="p-2 flex-shrink-0">
                    <div ref={switcherRef} className="relative w-full">
                        <button
                            onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
                            className={`w-full flex items-center transition-colors group relative ${
                                isSidebarExpanded
                                ? 'text-left p-2 rounded-lg bg-background hover:bg-surface-hover border border-border-light justify-between'
                                : 'h-10 w-10 rounded-full bg-surface-nested hover:bg-surface-hover justify-center'
                            }`}
                            aria-haspopup="true" aria-expanded={isSwitcherOpen}
                            title={isSidebarExpanded ? "Switch Warehouse" : warehouse.name}
                        >
                            {isSidebarExpanded ? (
                                <>
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <WarehouseAvatar name={warehouse.name} />
                                        <span className="text-sm font-bold text-text-primary truncate">{warehouse.name}</span>
                                    </div>
                                    <IconChevronDown className={`h-5 w-5 text-text-secondary transition-transform ${isSwitcherOpen ? 'rotate-180' : ''}`} />
                                </>
                            ) : (
                                <WarehouseAvatar name={warehouse.name} />
                            )}
                        </button>
                        {isSwitcherOpen && (
                            <div className={`absolute z-20 mt-1 rounded-lg bg-surface shadow-lg p-2 border border-border-color ${isSidebarExpanded ? 'w-full' : 'w-64 left-full ml-2 -top-2'}`}>
                                <div className="text-xs font-semibold text-text-muted px-2 py-1 mb-1">Switch Warehouse</div>
                                <ul className="max-h-60 overflow-y-auto">
                                    {warehouses.map(wh => (
                                        <li key={wh.id}>
                                            <button
                                                onClick={() => { onSwitchWarehouse(wh); setIsSwitcherOpen(false); }}
                                                className={`w-full text-left flex items-center justify-between gap-2 p-2 rounded-lg text-sm font-medium transition-colors ${
                                                    wh.id === warehouse.id ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-surface-hover text-text-secondary hover:text-text-primary'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <WarehouseAvatar name={wh.name} />
                                                    <span className="truncate">{wh.name}</span>
                                                </div>
                                                {wh.id === warehouse.id && <IconCheck className="h-5 w-5 text-primary flex-shrink-0" />}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                <nav className={`flex-grow px-2 ${isSidebarExpanded ? 'overflow-y-auto' : ''}`}>
                    <ul className="space-y-1">
                        {navItems.map(item => (
                            <li key={item.name}>
                                <button
                                    onClick={() => setActiveSection(item.name)}
                                    title={!isSidebarExpanded ? item.name : ''}
                                    className={`w-full flex items-center text-left p-2 rounded-lg text-sm transition-colors ${
                                        activeSection === item.name ? 'bg-[#EFE9FE] text-primary font-semibold' : 'text-text-strong font-medium hover:bg-surface-hover'
                                    } ${isSidebarExpanded ? 'gap-3' : 'justify-center'}`}
                                >
                                    <item.icon className={`h-5 w-5 shrink-0`} />
                                    {isSidebarExpanded && <span>{item.name}</span>}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-2 mt-auto flex-shrink-0">
                    <div className={`border-t border-border-light ${isSidebarExpanded ? 'mx-2' : ''}`}></div>
                    <div className={`flex mt-2 ${isSidebarExpanded ? 'justify-end' : 'justify-center'}`}>
                        <button
                            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                            className="p-1.5 rounded-full hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary"
                            aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
                        >
                            {isSidebarExpanded ? <IconChevronLeft className="h-5 w-5 text-text-secondary" /> : <IconChevronRight className="h-5 w-5 text-text-secondary" />}
                        </button>
                    </div>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto p-4">
                <div className="flex items-center gap-2 mb-4">
                    <button onClick={onBack} className="p-1 rounded-full text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors" aria-label="Back to All Warehouses">
                        <IconChevronLeft className="h-5 w-5" />
                    </button>
                    <h1 className="text-2xl font-bold text-text-primary">{warehouse.name}</h1>
                </div>
                <p className="mt-1 text-text-secondary">{activeSection}</p>
                <div className="mt-4">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default WarehouseDetailView;