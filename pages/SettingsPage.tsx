import React, { useState } from 'react';
import { IconChevronLeft, IconChevronRight, IconUser, IconBell } from '../constants';
import UserManagement from './settings/UserManagement';
import { User } from '../types';

interface SettingsPageProps {
    activeSubPage: string;
    onSubPageChange: (subPage: string) => void;
    onBack: () => void;
    onAddUserClick: () => void;
    users: User[];
    onEditUserRoleClick: (user: User) => void;
    onSuspendUserClick: (user: User) => void;
    onActivateUserClick: (user: User) => void;
    onRemoveUserClick: (user: User) => void;
}

const settingsNavItems = [
    { name: 'User Management', icon: IconUser },
    { name: 'Budgets & Alerts', icon: IconBell },
];

const Breadcrumb: React.FC<{ items: { label: string; onClick?: () => void }[] }> = ({ items }) => (
    <nav className="text-sm text-text-secondary">
        {items.map((item, index) => (
            <span key={index}>
                {index > 0 && <span className="mx-2">/</span>}
                {item.onClick ? (
                    <button onClick={item.onClick} className="hover:underline text-link">{item.label}</button>
                ) : (
                    <span className="text-text-primary font-medium">{item.label}</span>
                )}
            </span>
        ))}
    </nav>
);

const SettingsPage: React.FC<SettingsPageProps> = ({ 
    activeSubPage, 
    onSubPageChange, 
    onBack, 
    onAddUserClick, 
    users,
    onEditUserRoleClick,
    onSuspendUserClick,
    onActivateUserClick,
    onRemoveUserClick 
}) => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

    const renderSubPage = () => {
        switch (activeSubPage) {
            case 'User Management':
                return (
                    <UserManagement 
                        users={users} 
                        onAddUser={onAddUserClick} 
                        onEditUserRole={onEditUserRoleClick}
                        onSuspendUser={onSuspendUserClick}
                        onActivateUserClick={onActivateUserClick}
                        onRemoveUser={onRemoveUserClick}
                    />
                );
            case 'Budgets & Alerts':
                 return (
                    <div className="p-4 bg-surface rounded-lg border border-border-color">
                        <h2 className="text-xl font-semibold text-text-primary">Budgets & Alerts</h2>
                        <p className="mt-2 text-text-secondary">Set spending budgets and configure alert notifications.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    const breadcrumbItems = [
        { label: 'Dashboard', onClick: onBack },
        { label: 'Settings' },
        { label: activeSubPage },
    ];

    return (
        <div className="flex flex-col h-full bg-background">
            <div className="bg-surface w-full py-4 px-6 border-b border-border-color flex-shrink-0">
                <Breadcrumb items={breadcrumbItems} />
            </div>
            <div className="flex flex-1 overflow-hidden">
                <aside className={`bg-surface flex-shrink-0 border-r border-border-color flex flex-col transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'w-64' : 'w-16'}`}>
                    <div className="flex-grow overflow-y-auto p-4">
                         <nav>
                            <ul className="space-y-1">
                                {settingsNavItems.map(item => (
                                    <li key={item.name}>
                                        <button
                                            onClick={() => onSubPageChange(item.name)}
                                            className={`w-full flex items-center text-left px-3 py-2 rounded-full text-sm font-medium transition-colors ${activeSubPage === item.name ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'}`}
                                            aria-label={item.name}
                                            title={isSidebarExpanded ? '' : item.name}
                                        >
                                            <item.icon className={`h-5 w-5 shrink-0 ${activeSubPage === item.name ? 'text-primary' : 'text-text-secondary'}`} />
                                            {isSidebarExpanded && <span className="ml-3">{item.name}</span>}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                    <div className="flex-shrink-0 mt-auto p-2">
                        <div className={`border-t border-border-light ${isSidebarExpanded ? 'mx-2' : ''}`}></div>
                        <div className={`flex mt-2 ${isSidebarExpanded ? 'justify-end' : 'justify-center'}`}>
                            <button
                                onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                                className="p-1.5 rounded-full hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary"
                                aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
                            >
                                {isSidebarExpanded 
                                    ? <IconChevronLeft className="h-5 w-5 text-text-secondary" /> 
                                    : <IconChevronRight className="h-5 w-5 text-text-secondary" />
                                }
                            </button>
                        </div>
                    </div>
                </aside>
                <main className="flex-1 overflow-y-auto bg-background">
                    <div className="p-4">
                        {renderSubPage()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SettingsPage;
