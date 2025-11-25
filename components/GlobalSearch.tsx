
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { IconSearch, IconClock, IconLayers, IconDatabase, IconUser, IconSettings, IconChevronRight, IconBolt } from '../constants';
import { Account, Warehouse, QueryListItem, User, Page } from '../types';

interface SearchResult {
    id: string;
    type: 'Page' | 'Account' | 'Warehouse' | 'Query' | 'User';
    title: string;
    subtitle?: string;
    meta?: string; // Status or extra info
    onSelect: () => void;
}

interface GlobalSearchProps {
    accounts: Account[];
    warehouses: Warehouse[];
    queries: QueryListItem[];
    users: User[];
    onNavigate: (page: Page) => void;
    onSelectAccount: (account: Account) => void;
    onSelectWarehouse: (warehouse: Warehouse) => void;
    onSelectQuery: (query: QueryListItem) => void;
    onSelectUser: (user: User) => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({
    accounts,
    warehouses,
    queries,
    users,
    onNavigate,
    onSelectAccount,
    onSelectWarehouse,
    onSelectQuery,
    onSelectUser
}) => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // --- SEARCH LOGIC ---
    const results = useMemo(() => {
        if (!query.trim()) return [];
        
        const lowerQuery = query.toLowerCase();
        const searchResults: SearchResult[] = [];

        // 1. Pages / Actions
        const appPages: Page[] = ['Data Cloud Overview', 'Dashboards', 'Snowflake Accounts', 'AI Agent', 'Query Library', 'Reports', 'Assigned Queries', 'Settings', 'Profile Settings'];
        appPages.forEach(page => {
            if (page.toLowerCase().includes(lowerQuery)) {
                searchResults.push({
                    id: `page-${page}`,
                    type: 'Page',
                    title: page,
                    subtitle: 'Go to page',
                    onSelect: () => onNavigate(page)
                });
            }
        });

        // 2. Accounts
        accounts.forEach(acc => {
            if (acc.name.toLowerCase().includes(lowerQuery) || acc.identifier.toLowerCase().includes(lowerQuery)) {
                searchResults.push({
                    id: acc.id,
                    type: 'Account',
                    title: acc.name,
                    subtitle: acc.identifier,
                    meta: acc.status,
                    onSelect: () => onSelectAccount(acc)
                });
            }
        });

        // 3. Warehouses
        warehouses.forEach(wh => {
            if (wh.name.toLowerCase().includes(lowerQuery)) {
                searchResults.push({
                    id: wh.id,
                    type: 'Warehouse',
                    title: wh.name,
                    subtitle: wh.size,
                    meta: wh.status,
                    onSelect: () => onSelectWarehouse(wh)
                });
            }
        });

        // 4. Users
        users.forEach(u => {
            if (u.name.toLowerCase().includes(lowerQuery) || u.email.toLowerCase().includes(lowerQuery)) {
                searchResults.push({
                    id: u.id,
                    type: 'User',
                    title: u.name,
                    subtitle: u.email,
                    meta: u.role,
                    onSelect: () => onSelectUser(u)
                });
            }
        });

        // 5. Queries (Limit to top 5 matches to prevent lag)
        let queryCount = 0;
        for (const q of queries) {
            if (queryCount >= 5) break;
            if (q.queryText.toLowerCase().includes(lowerQuery) || q.id.toLowerCase().includes(lowerQuery)) {
                searchResults.push({
                    id: q.id,
                    type: 'Query',
                    title: q.id.substring(0, 13).toUpperCase(),
                    subtitle: q.queryText.substring(0, 60) + '...',
                    meta: q.status,
                    onSelect: () => onSelectQuery(q)
                });
                queryCount++;
            }
        }

        return searchResults;
    }, [query, accounts, warehouses, queries, users]);

    // --- GROUPING RESULTS ---
    const groupedResults = useMemo(() => {
        const groups: Record<string, SearchResult[]> = {};
        results.forEach(result => {
            if (!groups[result.type]) groups[result.type] = [];
            groups[result.type].push(result);
        });
        return groups;
    }, [results]);

    const flattenedResults = useMemo(() => {
        return Object.values(groupedResults).flat();
    }, [groupedResults]);

    // --- EVENT HANDLERS ---
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(prev => (prev < flattenedResults.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(prev => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (activeIndex >= 0 && activeIndex < flattenedResults.length) {
                handleSelect(flattenedResults[activeIndex]);
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
            inputRef.current?.blur();
        }
    };

    const handleSelect = (result: SearchResult) => {
        result.onSelect();
        setQuery('');
        setIsOpen(false);
        setActiveIndex(-1);
    };

    // --- ICONS HELPER ---
    const TypeIcon = ({ type }: { type: string }) => {
        switch (type) {
            case 'Page': return <IconSettings className="h-4 w-4 text-text-secondary" />;
            case 'Account': return <IconBolt className="h-4 w-4 text-text-secondary" />;
            case 'Warehouse': return <IconLayers className="h-4 w-4 text-text-secondary" />;
            case 'Query': return <IconClock className="h-4 w-4 text-text-secondary" />;
            case 'User': return <IconUser className="h-4 w-4 text-text-secondary" />;
            default: return <IconSearch className="h-4 w-4 text-text-secondary" />;
        }
    };

    return (
        <div className="relative w-full z-50" ref={containerRef}>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <IconSearch className="h-5 w-5 text-text-muted" />
            </div>
            <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => { setQuery(e.target.value); setIsOpen(true); setActiveIndex(-1); }}
                onFocus={() => setIsOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder="Search queries, warehouses, settings..."
                className="block w-full bg-white/10 hover:bg-white/20 focus:bg-white/20 border-0 text-white rounded-full py-2 pl-11 pr-3 text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
            />
            
            {isOpen && query && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-surface rounded-xl shadow-xl border border-border-color max-h-[80vh] overflow-y-auto z-50">
                    {Object.keys(groupedResults).map((group) => (
                        <div key={group}>
                            <div className="px-4 py-2 bg-surface-nested text-xs font-bold text-text-secondary uppercase tracking-wider sticky top-0">
                                {group}s
                            </div>
                            <ul>
                                {groupedResults[group].map((result) => {
                                    // Calculate global index for keyboard navigation highlights
                                    const isSelected = flattenedResults.indexOf(result) === activeIndex;
                                    return (
                                        <li key={result.id}>
                                            <button
                                                onClick={() => handleSelect(result)}
                                                onMouseEnter={() => setActiveIndex(flattenedResults.indexOf(result))}
                                                className={`w-full text-left px-4 py-3 flex items-center justify-between group transition-colors ${isSelected ? 'bg-primary/5' : 'hover:bg-surface-hover'}`}
                                            >
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-white shadow-sm' : 'bg-surface-nested'}`}>
                                                        <TypeIcon type={result.type} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className={`text-sm font-medium truncate ${isSelected ? 'text-primary' : 'text-text-primary'}`}>
                                                            {result.title}
                                                        </p>
                                                        {result.subtitle && (
                                                            <p className="text-xs text-text-secondary truncate">
                                                                {result.subtitle}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                {result.meta && (
                                                    <span className="flex-shrink-0 ml-2 text-xs font-medium px-2 py-0.5 rounded-full bg-surface-nested text-text-secondary border border-border-color">
                                                        {result.meta}
                                                    </span>
                                                )}
                                                {isSelected && <IconChevronRight className="h-4 w-4 text-primary ml-2" />}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {isOpen && query && results.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-surface rounded-xl shadow-xl border border-border-color p-8 text-center z-50">
                    <p className="text-text-secondary text-sm">No results found for "{query}"</p>
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;
