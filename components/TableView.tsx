import React, { useState, useMemo, useEffect } from 'react';
import { IconSearch, IconChevronLeft, IconChevronRight, IconShare, IconChevronDown } from '../constants';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (items: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange,
}) => {
    if (totalItems === 0) {
        return null;
    }

    const startItem = totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const pageOptions = Array.from({ length: totalPages }, (_, i) => i + 1);
    const itemsPerPageOptions = [10, 20, 50, 100];

    return (
        <div className="flex justify-between items-center text-sm text-text-secondary px-4 py-2 border-t border-border-light bg-surface rounded-b-xl">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <span>Items per page:</span>
                    <div className="relative">
                        <select
                            value={itemsPerPage}
                            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                            className="appearance-none bg-surface-nested rounded px-2 py-1 pr-7 font-medium text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            aria-label="Items per page"
                        >
                            {itemsPerPageOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                        <IconChevronDown className="h-4 w-4 text-text-muted absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
                <div className="border-l border-border-color h-6"></div>
                <span>
                    {startItem}–{endItem} of {totalItems} items
                </span>
            </div>
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <select
                            value={currentPage}
                            onChange={(e) => onPageChange(Number(e.target.value))}
                            className="appearance-none bg-surface-nested rounded px-2 py-1 pr-7 font-medium text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                            aria-label="Go to page"
                        >
                            {pageOptions.map(page => (
                                <option key={page} value={page}>{page}</option>
                            ))}
                        </select>
                         <IconChevronDown className="h-4 w-4 text-text-muted absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    <span>of {totalPages} pages</span>
                </div>
                <div className="border-l border-border-color h-6"></div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-8 h-8 flex items-center justify-center rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-hover transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
                        aria-label="Previous page"
                    >
                        <IconChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="w-8 h-8 flex items-center justify-center rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-hover transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
                        aria-label="Next page"
                    >
                        <IconChevronRight className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

interface TableViewData {
    name: string;
    cost: number;
    credits: number;
    percentage: number;
}

interface TableViewProps {
    title: string;
    data: TableViewData[];
}

const SortIndicator: React.FC<{ direction: 'ascending' | 'descending' | null }> = ({ direction }) => {
    if (!direction) return <span className="w-4 h-4 inline-block"></span>;
    return (
        <svg
            className="w-4 h-4 inline-block ml-1 text-text-secondary group-hover:text-text-primary"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
        >
            {direction === 'ascending' ? (
                <path d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L11 6.414V17a1 1 0 11-2 0V6.414L7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3z"></path>
            ) : (
                <path d="M10 17a1 1 0 01-.707-.293l-3-3a1 1 0 011.414-1.414L9 13.586V3a1 1 0 112 0v10.586l1.293-1.293a1 1 0 011.414 1.414l-3 3A1 1 0 0110 17z"></path>
            )}
        </svg>
    );
};


const TableView: React.FC<TableViewProps> = ({ title, data }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof TableViewData; direction: 'ascending' | 'descending' } | null>({ key: 'cost', direction: 'descending' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const sortedAndFilteredData = useMemo(() => {
        let sortedData = [...data];

        if (sortConfig !== null) {
            sortedData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        if (searchTerm) {
            return sortedData.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return sortedData;
    }, [data, sortConfig, searchTerm]);
    
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sortConfig]);

    const totalPages = Math.ceil(sortedAndFilteredData.length / itemsPerPage);
    const paginatedData = sortedAndFilteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleItemsPerPageChange = (newSize: number) => {
        setItemsPerPage(newSize);
        setCurrentPage(1);
    };

    const requestSort = (key: keyof TableViewData) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: keyof TableViewData) => {
        if (!sortConfig || sortConfig.key !== key) {
            return <SortIndicator direction={null} />;
        }
        return <SortIndicator direction={sortConfig.direction} />;
    };

    const handleExportCSV = () => {
        const header = ['Name', 'Cost ($)', 'Credits', '% of Total'];
        const rows = sortedAndFilteredData.map(item => [
            `"${item.name.replace(/"/g, '""')}"`, // escape double quotes
            item.cost.toFixed(2),
            item.credits.toFixed(2),
            item.percentage.toFixed(2),
        ]);

        const csvContent = [
            header.join(','),
            ...rows.map(row => row.join(',')),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `${title.replace(/\s+/g, '_')}_table_view.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-6">
                 <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
                    <button 
                        onClick={handleExportCSV} 
                        className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color hover:bg-gray-50 flex items-center gap-2"
                        aria-label="Export data as CSV"
                    >
                        <IconShare className="h-4 w-4" />
                        Export CSV
                    </button>
                </div>
                <div className="relative mt-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <IconSearch className="h-5 w-5 text-text-muted" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-border-color rounded-full text-sm focus:ring-primary focus:border-primary bg-input-bg"
                        aria-label="Search table content"
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                 <table className="w-full text-sm text-left text-text-secondary">
                    <thead className="bg-table-header-bg text-xs text-text-secondary uppercase font-medium sticky top-0 z-10">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                <button onClick={() => requestSort('name')} className="group flex items-center">Name {getSortIndicator('name')}</button>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                 <button onClick={() => requestSort('cost')} className="group flex items-center">Cost ($) {getSortIndicator('cost')}</button>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                 <button onClick={() => requestSort('credits')} className="group flex items-center">Credits {getSortIndicator('credits')}</button>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                 <button onClick={() => requestSort('percentage')} className="group flex items-center">% of Total {getSortIndicator('percentage')}</button>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-surface">
                        {paginatedData.map((item, index) => (
                            <tr key={`${item.name}-${index}`} className="even:bg-surface-nested hover:bg-surface-hover">
                                <td className="px-6 py-4 font-medium text-text-primary whitespace-nowrap">{item.name}</td>
                                <td className="px-6 py-4">${item.cost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                <td className="px-6 py-4">{item.credits.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                                <td className="px-6 py-4">{item.percentage.toFixed(2)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {sortedAndFilteredData.length > 0 && (
                 <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={sortedAndFilteredData.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    onItemsPerPageChange={handleItemsPerPageChange}
                />
            )}
        </div>
    );
};

export default TableView;