import React, { useState, useMemo, useRef, useEffect } from 'react';
import { SQLFile, Account, SQLVersion, User } from '../types';
import { IconSearch, IconDotsVertical, IconWand, IconBeaker, IconView, IconArrowUp, IconArrowDown } from '../constants';
import Pagination from '../components/Pagination';
import MultiSelectDropdown from '../components/MultiSelectDropdown';
import SidePanel from '../components/SidePanel';

const Tag: React.FC<{ tag?: string }> = ({ tag }) => {
    if (!tag) return null;

    const colorClasses: { [key: string]: string } = {
        Optimized: "bg-status-success-light text-status-success-dark",
        Simulated: "bg-status-info-light text-status-info-dark",
        Analyzed: "bg-status-warning-light text-status-warning-dark",
        Default: "bg-gray-100 text-gray-800"
    };
    
    const tagClass = colorClasses[tag] || colorClasses.Default;

    return <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${tagClass}`}>{tag}</span>;
}

interface QueryLibraryProps {
    sqlFiles: SQLFile[];
    accounts: Account[];
    onPreview: (file: SQLFile, version: SQLVersion) => void;
    onNavigateToTool: (file: SQLFile, version: SQLVersion, tool: 'analyzer' | 'optimizer' | 'simulator') => void;
    onRowClick: (file: SQLFile, version: SQLVersion) => void;
}

const QueryLibrary: React.FC<QueryLibraryProps> = ({ sqlFiles, accounts, onPreview, onNavigateToTool, onRowClick }) => {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>({ key: 'date', direction: 'descending' });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [accountFilter, setAccountFilter] = useState<string[]>([]);
    const [tagFilter, setTagFilter] = useState<string[]>([]);
    const [userFilter, setUserFilter] = useState<string[]>([]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const libraryItems = useMemo(() => {
        return sqlFiles.flatMap(file => 
            file.versions
                .filter(version => version.tag === 'Analyzed' || version.tag === 'Optimized')
                .map(version => {
                    const fileNum = file.id.replace('file-', '');
                    const versionNum = version.id.replace('v', '').replace('-', '');
                    return {
                        id: `${file.id}-${version.id}`,
                        queryId: `QL-${fileNum}${versionNum}`,
                        queryName: file.name,
                        accountName: file.accountName,
                        user: version.user,
                        tag: version.tag,
                        date: version.date,
                        file: file,
                        version: version
                    }
                })
        );
    }, [sqlFiles]);
    
    const filterOptions = useMemo(() => {
        return {
            accounts: [...new Set(libraryItems.map(item => item.accountName))],
            tags: [...new Set(libraryItems.map(item => item.tag).filter(Boolean))] as string[],
            users: [...new Set(libraryItems.map(item => item.user).filter(Boolean))] as string[],
        }
    }, [libraryItems]);

    const filteredAndSortedItems = useMemo(() => {
        let filtered = libraryItems.filter(item => {
            if (searchTerm && !(item.queryName.toLowerCase().includes(searchTerm.toLowerCase()) || item.queryId.toLowerCase().includes(searchTerm.toLowerCase()))) return false;
            if (accountFilter.length > 0 && !accountFilter.includes(item.accountName)) return false;
            if (tagFilter.length > 0 && !(item.tag && tagFilter.includes(item.tag))) return false;
            if (userFilter.length > 0 && !(item.user && userFilter.includes(item.user))) return false;
            return true;
        });

        if (sortConfig !== null) {
            filtered.sort((a, b) => {
                const key = sortConfig.key as keyof typeof a;
                if (a[key] < b[key]) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (a[key] > b[key]) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return filtered;
    }, [libraryItems, searchTerm, accountFilter, tagFilter, userFilter, sortConfig]);
    
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, accountFilter, tagFilter, userFilter, itemsPerPage]);

    const totalPages = Math.ceil(filteredAndSortedItems.length / itemsPerPage);
    const paginatedData = useMemo(() => filteredAndSortedItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage), [filteredAndSortedItems, currentPage, itemsPerPage]);
    
    const requestSort = (key: string) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const SortIcon: React.FC<{ columnKey: string }> = ({ columnKey }) => {
        if (!sortConfig || sortConfig.key !== columnKey) {
            return <span className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-50"><IconArrowUp/></span>;
        }
        if (sortConfig.direction === 'ascending') {
            return <IconArrowUp className="w-4 h-4 ml-1" />;
        }
        return <IconArrowDown className="w-4 h-4 ml-1" />;
    };

    return (
        <div className="flex flex-col bg-background space-y-4">
            <div>
                <h1 className="text-2xl font-bold text-text-primary">Query Library</h1>
                <p className="mt-1 text-text-secondary">Access your analyzed and optimized queries for future reference or reuse.</p>
            </div>

            <div className="bg-surface rounded-xl flex flex-col">
                <div className="p-4 flex justify-between items-center flex-shrink-0 border-b border-border-color">
                    <div className="flex items-center gap-4">
                        <MultiSelectDropdown label="Account" options={filterOptions.accounts} selectedOptions={accountFilter} onChange={setAccountFilter} />
                        <MultiSelectDropdown label="Tag" options={filterOptions.tags} selectedOptions={tagFilter} onChange={setTagFilter} />
                        <MultiSelectDropdown label="User" options={filterOptions.users} selectedOptions={userFilter} onChange={setUserFilter} />
                    </div>
                    <div className="relative">
                        <IconSearch className="h-5 w-5 text-text-muted absolute left-4 top-1/2 -translate-y-1/2" />
                        <input 
                            type="search" 
                            value={searchTerm} 
                            onChange={e => setSearchTerm(e.target.value)} 
                            placeholder="Search queries..." 
                            className="w-full md:w-64 pl-11 pr-4 py-2.5 bg-background border-transparent rounded-full text-sm focus:ring-1 focus:ring-primary" 
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-sm text-text-primary sticky top-0 z-10 bg-table-header-bg">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestSort('queryId')} className="group flex items-center">Query ID <SortIcon columnKey="queryId" /></button></th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestSort('accountName')} className="group flex items-center">Account <SortIcon columnKey="accountName" /></button></th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestSort('user')} className="group flex items-center">User <SortIcon columnKey="user" /></button></th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestSort('tag')} className="group flex items-center">Tag <SortIcon columnKey="tag" /></button></th>
                                <th scope="col" className="px-6 py-4 font-semibold text-left"><button onClick={() => requestSort('date')} className="group flex items-center">Execution date <SortIcon columnKey="date" /></button></th>
                                <th scope="col" className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-text-secondary">
                            {paginatedData.map(item => (
                                <tr key={item.id} onClick={() => onRowClick(item.file, item.version)} className="border-b border-border-light last:border-b-0 hover:bg-surface-nested cursor-pointer" data-row-hover>
                                    <td className="px-6 py-3 font-medium text-link whitespace-nowrap">{item.queryId}</td>
                                    <td className="px-6 py-3">{item.accountName}</td>
                                    <td className="px-6 py-3">{item.user}</td>
                                    <td className="px-6 py-3"><Tag tag={item.tag} /></td>
                                    <td className="px-6 py-3">{new Date(item.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-3 text-right">
                                        <div className="relative inline-block text-left" ref={openMenuId === item.id ? menuRef : null}>
                                            <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === item.id ? null : item.id); }} title="Actions" className="p-2 text-text-secondary hover:text-primary rounded-full hover:bg-primary/10 transition-colors">
                                                <IconDotsVertical className="h-5 w-5"/>
                                            </button>
                                            {openMenuId === item.id && (
                                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg bg-surface shadow-lg z-20 border border-border-color">
                                                    <div className="py-1" role="menu">
                                                        <button onClick={() => { onPreview(item.file, item.version); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem"><IconView className="h-4 w-4"/> Preview</button>
                                                        <button onClick={() => { onNavigateToTool(item.file, item.version, 'analyzer'); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem"><IconSearch className="h-4 w-4"/> Analyze</button>
                                                        <button onClick={() => { onNavigateToTool(item.file, item.version, 'optimizer'); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem"><IconWand className="h-4 w-4"/> Optimize</button>
                                                        <button onClick={() => { onNavigateToTool(item.file, item.version, 'simulator'); setOpenMenuId(null); }} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem"><IconBeaker className="h-4 w-4"/> Simulate</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {filteredAndSortedItems.length > itemsPerPage && (
                     <div className="flex-shrink-0">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={filteredAndSortedItems.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={(size) => setItemsPerPage(size)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default QueryLibrary;