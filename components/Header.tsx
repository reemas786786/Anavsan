
import React, { useState, useRef, useEffect } from 'react';
import { IconMenu, IconSparkles, IconUser, IconBell, IconClose, IconHelpCircle } from '../constants';
import NotificationDropdown from './NotificationDropdown';
import GlobalSearch from './GlobalSearch';
import { Notification, Page, Account, Warehouse, QueryListItem, User } from '../types';

interface HeaderProps {
    onMenuClick: () => void;
    onLogoClick: () => void;
    isSidebarOpen: boolean;
    brandLogo: string | null;
    onOpenProfileSettings: () => void;
    onLogout: () => void;
    hasNewAssignment?: boolean;
    notifications: Notification[];
    onMarkAllNotificationsAsRead: () => void;
    onClearAllNotifications: () => void;
    onNavigate: (page: Page) => void;
    onOpenQuickAsk: () => void;
    
    // Search Data Props
    accounts: Account[];
    warehouses: Warehouse[];
    queries: QueryListItem[];
    users: User[];
    onSelectAccount: (account: Account) => void;
    onSelectWarehouse: (warehouse: Warehouse) => void;
    onSelectQuery: (query: QueryListItem) => void;
    onSelectUser: (user: User) => void;
}

const AnavsanLogo: React.FC<{}> = () => (
    <div className="flex items-center" title="Anavsan - Home">
        <h1 className="text-xl font-bold flex items-center text-white">
            <span style={{fontFamily: 'serif', background: 'linear-gradient(to bottom right, #A78BFA, #6932D5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} className="text-4xl -mr-1">
                A
            </span>
            <span className="tracking-[0.1em]">
                NAVSAN
            </span>
        </h1>
    </div>
);

const BrandLogo: React.FC<{ logoUrl: string }> = ({ logoUrl }) => (
    <div className="flex items-center justify-center h-[26px] w-[112px]" title="Brand Logo">
        <img src={logoUrl} alt="Brand Logo" className="max-h-full max-w-full object-contain" />
    </div>
);


const Header: React.FC<HeaderProps> = ({ 
    onMenuClick, 
    onLogoClick, 
    isSidebarOpen, 
    brandLogo, 
    onOpenProfileSettings, 
    onLogout, 
    hasNewAssignment, 
    notifications,
    onMarkAllNotificationsAsRead,
    onClearAllNotifications,
    onNavigate,
    onOpenQuickAsk,
    accounts,
    warehouses,
    queries,
    users,
    onSelectAccount,
    onSelectWarehouse,
    onSelectQuery,
    onSelectUser
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
            setIsUserMenuOpen(false);
        }
        if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
            setIsNotificationsOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="bg-sidebar-topbar px-4 py-2 flex items-center justify-between flex-shrink-0 h-14 z-40 relative shadow-md">
      {/* Left Group: Menu & Logo */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <button 
            onClick={onMenuClick} 
            className="p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors" 
            aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isSidebarOpen}
            aria-controls="sidebar-menu"
        >
          {isSidebarOpen ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
        </button>
        <button onClick={onLogoClick} className="focus:outline-none focus:ring-2 focus:ring-primary rounded-md p-1 -m-1">
            {brandLogo ? <BrandLogo logoUrl={brandLogo} /> : <AnavsanLogo />}
        </button>
      </div>
      
      {/* Right Group: Search & Utility Icons */}
      <div className="flex items-center justify-end flex-1 gap-4 min-w-0">
        {/* Global Search with explicit constraints */}
        <div className="flex-1 max-w-lg min-w-[200px] hidden md:block">
            <GlobalSearch 
                accounts={accounts}
                warehouses={warehouses}
                queries={queries}
                users={users}
                onNavigate={onNavigate}
                onSelectAccount={onSelectAccount}
                onSelectWarehouse={onSelectWarehouse}
                onSelectQuery={onSelectQuery}
                onSelectUser={onSelectUser}
            />
        </div>
        
        {/* Utility Icons */}
        <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={onOpenQuickAsk} className="p-2 rounded-full text-primary bg-primary/20 hover:bg-primary/30 transition-colors" title="AI Assistant">
                <IconSparkles className="h-5 w-5" />
            </button>
            <div className="relative" ref={notificationsRef}>
                <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="relative p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors" title="Notifications">
                <IconBell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-status-error text-white text-[10px] font-bold ring-2 ring-sidebar-topbar">{unreadCount}</span>
                )}
                </button>
                <NotificationDropdown
                    isOpen={isNotificationsOpen}
                    onClose={() => setIsNotificationsOpen(false)}
                    notifications={notifications}
                    onMarkAllAsRead={onMarkAllNotificationsAsRead}
                    onViewAll={() => {
                        onNavigate('Notifications');
                        setIsNotificationsOpen(false);
                    }}
                />
            </div>
            <button 
                className="p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="Help"
                title="Help"
            >
                <IconHelpCircle className="h-5 w-5" />
            </button>

            <div className="relative flex items-center ml-1" ref={userMenuRef}>
                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors" aria-haspopup="true" aria-expanded={isUserMenuOpen} aria-label="User menu">
                    <IconUser className="h-5 w-5" />
                </button>
                {isUserMenuOpen && (
                    <div className="origin-top-right absolute right-0 top-full mt-2 w-48 rounded-lg shadow-lg bg-surface ring-1 ring-black ring-opacity-5 z-50">
                        <div className="py-1" role="menu" aria-orientation="vertical">
                            <button onClick={() => { onOpenProfileSettings(); setIsUserMenuOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-text-secondary hover:bg-surface-hover" role="menuitem">Profile Settings</button>
                            <button onClick={() => { onLogout(); setIsUserMenuOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-status-error hover:bg-status-error/10" role="menuitem">Logout</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
