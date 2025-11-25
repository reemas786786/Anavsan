
import React, { useState, useMemo, useEffect } from 'react';
import { Warehouse } from '../types';
import { IconArrowUp, IconArrowDown, IconSearch } from '../constants';
import Pagination from '../components/Pagination';
import DateRangeDropdown from '../components/DateRangeDropdown';
import MultiSelectDropdown from '../components/MultiSelectDropdown';

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

interface AllWarehousesProps {
    warehouses: Warehouse[];
    onSelectWarehouse: (warehouse: Warehouse) => void;
}

const AllWarehouses: React.FC<AllWarehousesProps> = ({ warehouses, onSelectWarehouse }) => {
    const [sortConfig, setSortConfig] = useState<{ key: keyof Warehouse; direction: 'ascending' | 'descending' } | null>({ key: 'name', direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    
    // Filter states
    const [search, setSearch] = useState('');
    const [dateFilter, setDateFilter] = useState<string | { start: string; end: string }>('All');
    const [sizeFilter, setSizeFilter] = useState<string[]>([]);
    const [statusFilter, setStatusFilter] = useState<string[]>([]);

    const warehouseSizes = ['X-Small', 'Small', 'Medium', 'Large', 'X-Large'];
    const warehouseStatuses: Warehouse['status'][] = ['Running', 'Active', 'Suspended', 'Idle'];

    const summaryStats = useMemo(() => ({
        total: warehouses.length,
        running: warehouses.filter(w => w.status === 'Running' || w.status === 'Active').length,
        suspended: warehouses.filter(w => w.status === 'Suspended').length,
        idle: warehouses.filter(w => w.status === 'Idle').length,
    }), [warehouses]);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, dateFilter, sizeFilter, statusFilter, itemsPerPage]);

    const filteredAndSortedWarehouses = useMemo(() => {
        let filtered = warehouses.filter(wh => {
            if (search && !wh.name.toLowerCase().includes(search.toLowerCase())) {
                return false;
            }
            if (sizeFilter.length > 0 && !sizeFilter.includes(wh.size)) {
                return false;
            }
            if (statusFilter.length > 0 && !statusFilter.includes(wh.status)) {
                return false;
            }
            // Date filtering is not implemented due to data format, but UI is present
            return true;
        });

        if (sortConfig !== null) {
            filtered.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return filtered;
    }, [warehouses, search, sizeFilter, statusFilter, sortConfig]);

    const totalPages = Math.ceil(filteredAndSortedWarehouses.length / itemsPerPage);
    const paginatedData = useMemo(() => filteredAndSortedWarehouses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filteredAndSortedWarehouses, currentPage, itemsPerPage]);

    const requestSort = (key: keyof Warehouse) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const SortIcon: React.FC<{ columnKey: keyof Warehouse }> = ({ columnKey }) => {
        if (!sortConfig || sortConfig.key !== columnKey) return <span className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-50"><IconArrowUp/></span>;
        return sortConfig.direction === 'ascending' ? <IconArrowUp className="w-4 h-4 ml-1" /> : <IconArrowDown className="w-4 h-4 ml-1" />;
    };

    return (
        <div className="p-4 flex flex-col space-y-4">
            <div>
                <h1 className="text-2xl font-bold text-text-primary">All Warehouses</h1>
                <p className="mt-1 text-text-secondary">A list of all warehouses in this account.</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
                <div className="px-4 py-2 rounded-full text-sm font-medium bg-surface">
                    Total: <span className="font-bold text-text-strong">{summaryStats.total}</span>
                </div>
                <div className="px-4 py-2 rounded-full text-sm font-medium bg-surface">
                    Running: <span className="font-bold text-status-success-dark">{summaryStats.running}</span>
                </div>
                <div className="px-4 py-2 rounded-full text-sm font-medium bg-surface">
                    Suspended: <span className="font-bold text-text-secondary">{summaryStats.suspended}</span>
                </div>
                 <div className="px-4 py-2 rounded-full text-sm font-medium bg-surface">
                    Idle: <span className="font-bold text-status-info-dark">{summaryStats.idle}</span>
                </div>
            </div>

            <div className="bg-surface rounded-xl flex flex-col">
                <div className="p-4 flex justify-between items-center flex-shrink-0 border-b border-border-color">
                    <div className="flex items-center gap-x-2">
                        <DateRangeDropdown selectedValue={dateFilter} onChange={setDateFilter} />
                        <div className="h-4 w-px bg-border-color"></div>
                        <MultiSelectDropdown label="Size" options={warehouseSizes} selectedOptions={sizeFilter} onChange={setSizeFilter} selectionMode="single" />
                        <div className="h-4 w-px bg-border-color"></div>
                        <MultiSelectDropdown label="Status" options={warehouseStatuses} selectedOptions={statusFilter} onChange={setStatusFilter} selectionMode="single" />
                    </div>
                    <div className="relative">
                        <IconSearch className="h-5 w-5 text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="search"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search warehouses..."
                            className="w-full md:w-80 pl-11 pr-4 py-2.5 bg-background border-transparent rounded-full text-sm focus:ring-1 focus:ring-primary"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-sm text-text-primary sticky top-0 z-10 bg-table-header-bg">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestSort('name')} className="group flex items-center">Warehouse Name <SortIcon columnKey="name" /></button></th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestSort('size')} className="group flex items-center">Size <SortIcon columnKey="size" /></button></th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestSort('status')} className="group flex items-center">Status <SortIcon columnKey="status" /></button></th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestSort('credits')} className="group flex items-center">Credit Usage <SortIcon columnKey="credits" /></button></th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestSort('queriesExecuted')} className="group flex items-center">Queries Executed <SortIcon columnKey="queriesExecuted" /></button></th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestSort('lastActive')} className="group flex items-center">Last Active <SortIcon columnKey="lastActive" /></button></th>
                            </tr>
                        </thead>
                        <tbody className="text-text-secondary">
                            {paginatedData.map(wh => (
                                <tr key={wh.id} className="border-b border-border-light last:border-b-0 hover:bg-surface-nested">
                                    <td className="px-6 py-3 font-medium text-link whitespace-nowrap">
                                        <button onClick={() => onSelectWarehouse(wh)} className="hover:underline focus:outline-none">
                                            {wh.name}
                                        </button>
                                    </td>
                                    <td className="px-6 py-3">{wh.size}</td>
                                    <td className="px-6 py-3"><StatusBadge status={wh.status} /></td>
                                    <td className="px-6 py-3">{wh.credits.toLocaleString()}</td>
                                    <td className="px-6 py-3">{wh.queriesExecuted.toLocaleString()}</td>
                                    <td className="px-6 py-3">{wh.lastActive}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {filteredAndSortedWarehouses.length > itemsPerPage && (
                     <div className="flex-shrink-0">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={filteredAndSortedWarehouses.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={setItemsPerPage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllWarehouses;
