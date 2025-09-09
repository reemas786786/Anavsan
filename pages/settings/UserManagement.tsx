import React, { useState, useEffect, useRef } from 'react';
import { User, UserStatus } from '../../types';
import { IconAdd, IconDotsVertical } from '../../constants';

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
        <div className="h-8 w-8 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center">
            {initials}
        </div>
    );
};


interface UserManagementProps {
    users: User[];
    onAddUser: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, onAddUser }) => {
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

            <div className="bg-surface p-6 rounded-xl border border-border-color shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-text-secondary">
                        <thead className="bg-background text-xs text-text-secondary uppercase font-medium">
                            <tr>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Email</th>
                                <th scope="col" className="px-6 py-3">Role</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-t border-border-color hover:bg-surface-hover">
                                    <td className="px-6 py-4 font-medium text-text-primary whitespace-nowrap flex items-center gap-3">
                                        <UserAvatar name={user.name} />
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">{user.role}</td>
                                    <td className="px-6 py-4"><StatusBadge status={user.status} /></td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="relative inline-block text-left" ref={openMenuId === user.id ? menuRef : null}>
                                            <button
                                                onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                                                aria-label={`Actions for ${user.name}`}
                                                className="p-2 text-text-secondary hover:text-primary rounded-full hover:bg-primary/10 transition-colors"
                                            >
                                                <IconDotsVertical className="h-5 w-5" />
                                            </button>
                                            {openMenuId === user.id && (
                                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-surface ring-1 ring-black ring-opacity-5 z-10">
                                                    <div className="py-1" role="menu" aria-orientation="vertical">
                                                        <a href="#" className="block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Suspend User</a>
                                                        <a href="#" className="block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Edit Role</a>
                                                        <a href="#" className="block px-4 py-2 text-sm text-status-error hover:bg-status-error/10" role="menuitem">Remove User</a>
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