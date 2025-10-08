import React, { useState, useEffect, useRef, useMemo } from 'react';
import { User, UserStatus } from '../../types';
import { IconAdd, IconDotsVertical, IconArrowUp, IconArrowDown } from '../../constants';

const StatusBadge: React.FC<{ status: UserStatus }> = ({ status }) => {
    const colorClasses: Record<UserStatus, string> = {
        Active: 'bg-status-success-light text-status-success-dark',
        Invited: 'bg-status-info-light text-status-info-dark',
        Suspended: 'bg-gray-200 text-gray-800',
    };
    const dotClasses: Record<UserStatus, string> = {
        Active: 'bg-status-success',
        Invited: 'bg-status-info',
        Suspended: 'bg-gray-500',
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${colorClasses[status]}`}>
            <span className={`w-2 h-2 mr-2 rounded-full ${dotClasses[status]}`}></span>
            {status}
        </span>
    );
};

const UserAvatar: React.FC<{ name: string; avatarUrl?: string }> = ({ name, avatarUrl }) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    return (
        <div className="h-8 w-8 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center flex-shrink-0">
            {initials}
        </div>
    );
};


interface UserManagementProps {
    users: User[];
    onAddUser: () => void;
    onEditUserRole: (user: User) => void;
    onSuspendUser: (user: User) => void;
    onActivateUserClick: (user: User) => void;
    onRemoveUser: (user: User) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onAddUser, onEditUserRole, onSuspendUser, onActivateUserClick, onRemoveUser }) => {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'ascending' | 'descending' } | null>({ key: 'name', direction: 'ascending' });

    const sortedUsers = useMemo(() => {
        let sortableItems = [...users];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [users, sortConfig]);

    const requestSort = (key: keyof User) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (openMenuId && menuRef.current && !menuRef.current.contains(target)) {
                if (!target.closest(`[data-menu-trigger-id]`)) {
                    setOpenMenuId(null);
                }
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openMenuId]);
    
    const SortIcon: React.FC<{ columnKey: keyof User }> = ({ columnKey }) => {
        if (!sortConfig || sortConfig.key !== columnKey) {
            return <span className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-50"><IconArrowUp/></span>;
        }
        if (sortConfig.direction === 'ascending') {
            return <IconArrowUp className="w-4 h-4 ml-1" />;
        }
        return <IconArrowDown className="w-4 h-4 ml-1" />;
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-text-primary">User Management</h1>
                <button
                    onClick={onAddUser}
                    className="bg-primary text-white font-semibold px-4 py-2 rounded-full flex items-center gap-2 hover:bg-primary-hover transition-colors whitespace-nowrap shadow-sm"
                >
                    <IconAdd className="h-5 w-5" />
                    Add User
                </button>
            </div>

            <div className="bg-surface p-4 rounded-3xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-text-secondary">
                        <thead className="bg-table-header-bg text-xs text-text-primary font-medium">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    <button onClick={() => requestSort('name')} className="group flex items-center">
                                        User <SortIcon columnKey="name" />
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                     <button onClick={() => requestSort('role')} className="group flex items-center">
                                        Role <SortIcon columnKey="role" />
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                     <button onClick={() => requestSort('status')} className="group flex items-center">
                                        Status <SortIcon columnKey="status" />
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <button onClick={() => requestSort('dateAdded')} className="group flex items-center">
                                        Date Added <SortIcon columnKey="dateAdded" />
                                    </button>
                                </th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedUsers.map(user => (
                                <tr key={user.id} className="border-t border-border-color hover:bg-surface-hover">
                                    <td className="px-6 py-4 font-medium text-text-primary whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <UserAvatar name={user.name} />
                                            <div>
                                                <div>{user.name}</div>
                                                <div className="text-sm text-text-secondary font-normal">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{user.role}</td>
                                    <td className="px-6 py-4"><StatusBadge status={user.status} /></td>
                                    <td className="px-6 py-4">{user.dateAdded}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="relative inline-block text-left" ref={openMenuId === user.id ? menuRef : null}>
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                                                aria-label={`Actions for ${user.name}`}
                                                title="Actions"
                                                aria-haspopup="true"
                                                aria-expanded={openMenuId === user.id}
                                                data-menu-trigger-id={user.id}
                                                className="p-2 text-text-secondary hover:text-primary rounded-full hover:bg-primary/10 transition-colors"
                                            >
                                                <IconDotsVertical className="h-5 w-5" />
                                            </button>
                                            {openMenuId === user.id && (
                                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-surface ring-1 ring-black ring-opacity-5 z-10">
                                                    <div className="py-1" role="menu" aria-orientation="vertical">
                                                        <button onClick={() => { onEditUserRole(user); setOpenMenuId(null); }} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Edit Role</button>
                                                        {user.status === 'Suspended' ? (
                                                            <button onClick={() => { onActivateUserClick(user); setOpenMenuId(null); }} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Activate User</button>
                                                        ) : (
                                                            <button onClick={() => { onSuspendUser(user); setOpenMenuId(null); }} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Suspend User</button>
                                                        )}
                                                        <button onClick={() => { onRemoveUser(user); setOpenMenuId(null); }} className="w-full text-left block px-4 py-2 text-sm text-status-error hover:bg-status-error/10" role="menuitem">Remove User</button>
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
            </div>
        </div>
    );
};

export default UserManagement;
