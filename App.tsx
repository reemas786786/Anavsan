


import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Connections from './pages/Connections';
import AIAgent from './pages/AIAgent';
import Reports from './pages/Reports';
import BookDemo from './pages/BookDemo';
import Docs from './pages/Docs';
import Support from './pages/Support';
import Overview from './pages/Overview';
import AccountView from './pages/AccountView';
import UserView from './pages/UserView';
import SidePanel from './components/SidePanel';
import AddAccountFlow from './components/AddAccountFlow';
import SaveQueryFlow from './components/SaveQueryFlow';
import InviteUserFlow from './components/InviteUserFlow';
import EditUserRoleFlow from './components/EditUserRoleFlow';
import ConfirmationModal from './components/ConfirmationModal';
import Modal from './components/Modal';
import Toast from './components/Toast';
import BigScreenView from './components/BigScreenView';
import { Page, Account, SQLFile, UserRole, User, UserStatus, DashboardItem, BigScreenWidget, QueryListItem, AssignedQuery, AssignmentPriority, AssignmentStatus, PullRequest, Notification, ActivityLog, BreadcrumbItem, Warehouse } from './types';
import { connectionsData, sqlFilesData as initialSqlFiles, usersData, dashboardsData as initialDashboardsData, assignedQueriesData, pullRequestsData, notificationsData as initialNotificationsData, activityLogsData, warehousesData } from './data/dummyData';
import { accountNavItems } from './constants';
import SettingsPage from './pages/SettingsPage';
import Dashboards from './pages/Dashboards';
import DashboardEditor from './pages/DashboardEditor';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import Breadcrumb from './components/Breadcrumb';
import AssignQueryFlow from './components/AssignQueryFlow';
import AssignedQueries from './pages/AssignedQueries';
import QueryPreviewContent from './components/QueryPreviewModal';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import RequestSubmittedPage from './pages/RequestSubmittedPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import CheckEmailPage from './pages/CheckEmailPage';
import CreateNewPasswordPage from './pages/CreateNewPasswordPage';
import PasswordResetSuccessPage from './pages/PasswordResetSuccessPage';
import NotificationsPage from './pages/NotificationsPage';


type SidePanelType = 'addAccount' | 'saveQuery' | 'editUser' | 'assignQuery' | 'queryPreview';
type ModalType = 'addUser';
type Theme = 'light' | 'dark';
type AuthScreen = 'login' | 'signup' | 'submitted' | 'forgotPassword' | 'checkEmail' | 'createNewPassword' | 'passwordResetSuccess';
export type DisplayMode = 'cost' | 'credits';

const SplashScreen: React.FC = () => (
    <div id="splash-loader" style={{ opacity: 1 }}>
        <div className="loader">
            <div className="logo-container">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="52" viewBox="0 0 48 52" fill="none">
                    <path d="M26.0245 1.10411C26.5035 0.944589 27.0263 0.947640 27.4289 1.26015C27.8353 1.57579 27.9607 2.08272 27.9091 2.58175C27.8545 3.11164 27.7675 3.64069 27.6909 4.14221C27.6133 4.65109 27.5445 5.14003 27.5176 5.62516C27.3883 8.02999 27.2264 10.4046 27.2481 12.7777L27.2642 13.7268C27.3734 18.1509 27.9741 22.5304 28.8846 26.8812L29.0846 27.8133L29.1091 27.9046C29.117 27.9271 29.1239 27.9412 29.1284 27.9492C29.1329 27.9508 29.1399 27.952 29.1488 27.9545C29.1812 27.9632 29.2339 27.973 29.3187 27.9788C31.4692 28.126 33.6249 28.4423 35.6955 29.2251L35.8816 29.3026C36.0621 29.3849 36.2283 29.4799 36.3789 29.5712C36.5986 29.7041 36.752 29.8069 36.9415 29.9151L37.3619 30.155L37.0464 30.8939L36.8645 31.3163L36.4143 31.2091C34.2199 30.6888 31.9678 30.4478 29.7124 30.4872C29.9032 31.2229 30.0827 31.9235 30.2867 32.6262C31.4116 36.4888 32.6906 40.2413 34.7811 43.6545L35.1436 44.2309C36.0023 45.5552 36.9639 46.7297 38.2796 47.5599L38.5897 47.7445C40.1382 48.6137 41.6866 48.6982 43.2402 47.8018C44.9151 46.8355 45.6648 45.3592 45.5815 43.4241L45.5804 43.4135V43.4029C45.5802 43.3222 45.5841 43.2412 45.5921 43.1609L45.6371 42.7182L46.0831 42.6737L46.2745 42.6556L46.8392 42.5993L46.8756 43.1609C46.8944 43.4511 46.9331 43.7052 46.9665 44.042C46.9897 44.276 47.0079 44.5296 46.9965 44.7903L46.9741 45.0536C46.3837 49.7291 41.6611 52.2231 37.1523 50.4015C35.0198 49.5389 33.3957 48.0921 32.0633 46.3699L31.8002 46.0216C29.9253 43.4767 28.618 40.6676 27.5444 37.7853L27.0973 36.5454C26.7652 35.5902 26.4614 34.6274 26.169 33.6655L25.309 30.7877C25.2985 30.7525 25.2886 30.7234 25.2801 30.6985C21.2845 31.0504 17.4836 31.9481 13.9994 33.8247L13.3064 34.2133C10.7497 35.7051 8.95567 37.8478 7.83348 40.4943L7.6185 41.0303C7.09339 42.4103 6.60802 43.8048 6.13716 45.2075L4.74352 49.4345C4.5561 50.0028 4.25777 50.4981 3.76487 50.7741C3.32521 51.0202 2.82414 51.0403 2.30386 50.9185L2.08032 50.8581C1.74906 50.7565 1.35788 50.5985 1.14552 50.2424C0.921445 49.8662 0.994972 49.4467 1.10809 49.0969L2.15412 45.8465C2.50903 44.7593 2.87718 43.6729 3.27715 42.5993L4.01302 40.6493C7.48513 31.5656 11.5018 22.7148 16.4167 14.2723L17.4841 12.4689C19.3773 9.32226 21.5145 6.30633 23.5506 3.28343L23.7057 3.06475C24.0816 2.56193 24.538 2.12133 24.9497 1.73147L24.956 1.72722L25.0726 1.62426C25.3531 1.39264 25.6763 1.21696 26.0245 1.10411ZM23.0063 10.1675C18.5457 17.0145 14.8187 24.1166 11.563 31.4691C13.3624 30.4149 15.3197 29.6376 17.3675 29.1699L18.3344 28.9598C20.4134 28.5266 22.5251 28.2002 24.6202 27.8323C23.4817 22.1099 22.7559 16.2408 23.0063 10.1675Z" fill="url(#paint0_linear_splash)" stroke="url(#paint1_linear_splash)" stroke-width="0.75"/>
                </svg>
            </div>
        </div>
    </div>
);

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  
  const [activePage, setActivePage] = useState<Page>('Data Cloud Overview');
  const [activeSubPage, setActiveSubPage] = useState<string | undefined>();
  
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Data states
  const [accounts, setAccounts] = useState<Account[]>(connectionsData);
  const [sqlFiles, setSqlFiles] = useState<SQLFile[]>(initialSqlFiles);
  const [users, setUsers] = useState<User[]>(usersData);
  const [dashboards, setDashboards] = useState<DashboardItem[]>(initialDashboardsData);
  const [assignedQueries, setAssignedQueries] = useState<AssignedQuery[]>(assignedQueriesData);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>(pullRequestsData);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotificationsData);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(activityLogsData);

  // UI states
  const [sidePanel, setSidePanel] = useState<{ type: SidePanelType; data?: any } | null>(null);
  const [modal, setModal] = useState<{ type: ModalType; data?: any } | null>(null);
  const [confirmation, setConfirmation] = useState<{ title: string; message: React.ReactNode; onConfirm: () => void; confirmText?: string; confirmVariant?: 'danger' | 'warning' | 'primary' } | null>(null);
  
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedDashboard, setSelectedDashboard] = useState<DashboardItem | null>(null);
  const [editingDashboard, setEditingDashboard] = useState<DashboardItem | null>(null);
  const [isViewingDashboard, setIsViewingDashboard] = useState(false);

  const [selectedQuery, setSelectedQuery] = useState<QueryListItem | null>(null);
  const [analyzingQuery, setAnalyzingQuery] = useState<QueryListItem | null>(null);
  const [navigationSource, setNavigationSource] = useState<string | null>(null);

  const [selectedPullRequest, setSelectedPullRequest] = useState<PullRequest | null>(null);
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>('light');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('cost');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [bigScreenWidget, setBigScreenWidget] = useState<BigScreenWidget | null>(null);

  const [accountViewPage, setAccountViewPage] = useState('Account overview');
  const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItem[]>([]);

  const brandLogo = useMemo(() => null, []);

  useEffect(() => {
    setTimeout(() => {
      const splash = document.getElementById('splash-loader');
      if (splash) {
        splash.style.opacity = '0';
        setTimeout(() => {
          splash.style.display = 'none';
          setLoading(false);
        }, 300);
      } else {
        setLoading(false);
      }
    }, 500);

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleSetActivePage = (page: Page, subPage?: string) => {
    setActivePage(page);
    setActiveSubPage(subPage);
    setSelectedAccount(null);
    setSelectedUser(null);
    setSidebarOpen(false);
    setIsViewingDashboard(false);
    setEditingDashboard(null);
    setSelectedDashboard(null);
    setSelectedQuery(null);
    setSelectedPullRequest(null);
    setSelectedWarehouse(null);
  };
  
  useEffect(() => {
    let items: BreadcrumbItem[] = [];
    const overviewItem: BreadcrumbItem = { label: 'Data Cloud Overview', onClick: () => handleSetActivePage('Data Cloud Overview') };

    if (selectedWarehouse && selectedAccount) {
        items = [
            { label: 'Snowflake Accounts', onClick: () => { 
                setSelectedAccount(null); 
                setSelectedWarehouse(null);
                handleSetActivePage('Snowflake Accounts'); 
            }},
            { label: selectedAccount.name, onClick: () => { 
                setSelectedWarehouse(null);
                setAccountViewPage('Account overview');
            } },
            { label: 'Warehouses', onClick: () => { 
                setSelectedWarehouse(null);
                setAccountViewPage('All Warehouses');
            } },
            { label: selectedWarehouse.name }
        ];
    } else if (selectedAccount) {
        items = [
            { label: 'Snowflake Accounts', onClick: () => { setSelectedAccount(null); handleSetActivePage('Snowflake Accounts'); }},
            { label: selectedAccount.name, onClick: () => {
                setAccountViewPage('Account overview');
                setSelectedWarehouse(null);
            } }
        ];
    
        const parentNavItem = accountNavItems.find(item => 
            item.name === accountViewPage || item.children.some(child => child.name === accountViewPage)
        );
    
        if (parentNavItem && parentNavItem.name !== 'Account overview') {
            if (parentNavItem.children.length > 0) {
                items.push({ label: parentNavItem.name, onClick: () => setAccountViewPage(parentNavItem.children[0].name) });
            }
        }
        
        const isTopLevel = accountNavItems.some(item => item.name === accountViewPage);
        if (accountViewPage !== 'Account overview' && !isTopLevel) {
             items.push({ label: accountViewPage });
        }
    
        if (selectedPullRequest) {
            items.push({ label: `#${selectedPullRequest.id} ${selectedPullRequest.title}` });
        } else if (selectedQuery) {
            items.push({ label: `Query ${selectedQuery.id.substring(7, 13).toUpperCase()}` });
        }
    } else if (activePage === 'Notifications') {
        items = [overviewItem, { label: 'Notifications' }];
    } else if (selectedUser) {
        items = [overviewItem, { label: selectedUser.name }];
    } else if (isViewingDashboard && selectedDashboard) {
        items = [
            { label: 'Dashboards', onClick: () => handleSetActivePage('Dashboards') },
            { label: selectedDashboard.title }
        ];
    } else if (editingDashboard) {
        items = [
            { label: 'Dashboards', onClick: () => handleSetActivePage('Dashboards') },
            { label: editingDashboard.id.startsWith('temp-') ? 'New Dashboard' : `Editing '${editingDashboard.title}'` }
        ];
    } else if (activePage !== 'Data Cloud Overview' && activePage !== 'Snowflake Accounts' && activePage !== 'Dashboards') {
        switch (activePage) {
            case 'Assigned Queries':
            case 'Reports':
            case 'AI Agent':
                items = [overviewItem, { label: activePage }];
                break;
            case 'Settings':
                items = [overviewItem, { label: 'Settings' }, { label: activeSubPage || 'User Management' }];
                break;
            case 'Profile Settings':
                 items = [overviewItem, { label: 'Profile Settings' }];
                break;
        }
    }
    
    setBreadcrumbItems(items);
}, [
    activePage, 
    activeSubPage, 
    selectedAccount,
    accountViewPage,
    selectedQuery,
    selectedPullRequest,
    selectedUser, 
    isViewingDashboard, 
    editingDashboard, 
    selectedDashboard,
    selectedWarehouse,
]);
  
  const handleLogin = (email: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    setCurrentUser(user || users[0]);
    setIsAuthenticated(true);
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActivePage('Data Cloud Overview');
    setAuthScreen('login');
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };
  
  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(notifications.map(n => ({...n, isRead: true})));
    showToast("All notifications marked as read.");
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    showToast("All notifications cleared.");
  };

  const handleMarkNotificationAsRead = (notificationId: string) => {
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
      showToast("Insight marked as read.");
  };

  const handleClearNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    showToast("Notification cleared.");
  };

  const handleNavigateToWarehouse = (account: Account, warehouse: Warehouse) => {
      setSelectedAccount(account);
      setSelectedWarehouse(warehouse);
      setActivePage('Snowflake Accounts');
  };

  const handleNavigateToQuery = (account: Account, query: QueryListItem) => {
      setSelectedAccount(account);
      setSelectedQuery(query);
      setActivePage('Snowflake Accounts');
      setAccountViewPage('All queries');
  };

  const handleSaveDashboard = (d: DashboardItem) => {
      if (d.id.startsWith('temp-')) {
          d.id = `dash-${Date.now()}`;
      }
      setDashboards(prev => {
          const existing = prev.find(db => db.id === d.id);
          if (existing) {
              return prev.map(db => db.id === d.id ? d : db);
          }
          return [...prev, d];
      });
      setEditingDashboard(null);
      setIsViewingDashboard(false);
      showToast(`Dashboard "${d.title}" saved.`);
  };

  const renderPage = () => {
    if (selectedAccount) {
      return <AccountView 
        account={selectedAccount} 
        accounts={accounts} 
        onSwitchAccount={(acc) => {
            setSelectedAccount(acc);
            setAccountViewPage('Account overview');
            setSelectedQuery(null);
            setSelectedPullRequest(null);
            setSelectedWarehouse(null);
        }} 
        onBackToAccounts={() => {
            setSelectedAccount(null);
            handleSetActivePage('Snowflake Accounts');
        }}
        sqlFiles={sqlFiles} 
        onSaveQueryClick={() => setSidePanel({type: 'saveQuery'})} 
        onSetBigScreenWidget={setBigScreenWidget} 
        activePage={accountViewPage} 
        onPageChange={setAccountViewPage} 
        onShareQueryClick={(query) => setSidePanel({type: 'assignQuery', data: query})} 
        onPreviewQuery={(query) => setSidePanel({type: 'queryPreview', data: query})} 
        selectedQuery={selectedQuery} 
        setSelectedQuery={setSelectedQuery} 
        analyzingQuery={analyzingQuery} 
        onAnalyzeQuery={(q, source) => { setAnalyzingQuery(q); setNavigationSource(source); setAccountViewPage('Query analyzer'); }} 
        onOptimizeQuery={(q, source) => { setAnalyzingQuery(q); setNavigationSource(source); setAccountViewPage('Query optimizer'); }} 
        onSimulateQuery={(q, source) => { setAnalyzingQuery(q); setNavigationSource(source); setAccountViewPage('Query simulator'); }} 
        pullRequests={pullRequests} 
        selectedPullRequest={selectedPullRequest} 
        setSelectedPullRequest={setSelectedPullRequest} 
        users={users} 
        navigationSource={navigationSource} 
        selectedWarehouse={selectedWarehouse}
        setSelectedWarehouse={setSelectedWarehouse}
        warehouses={warehousesData}
      />;
    }
    if (selectedUser) {
      return <UserView user={selectedUser} onBack={() => setSelectedUser(null)} />;
    }
    if (editingDashboard) {
      return <DashboardEditor dashboard={editingDashboard} accounts={accounts} onSave={handleSaveDashboard} onCancel={() => { setEditingDashboard(null); setIsViewingDashboard(false); }} />;
    }
    if(isViewingDashboard && selectedDashboard){
        const handleSwitchDashboard = (dashboard: DashboardItem) => {
           setSelectedDashboard(dashboard);
       };
       const handleEditDashboard = () => {
           setEditingDashboard(selectedDashboard);
           setIsViewingDashboard(false);
       };
       const handleDeleteDashboard = () => {
           if (selectedDashboard) {
                setConfirmation({
                    title: 'Delete Dashboard',
                    message: `Are you sure you want to delete "${selectedDashboard.title}"?`,
                    onConfirm: () => {
                        setDashboards(prev => prev.filter(d => d.id !== selectedDashboard.id));
                        setSelectedDashboard(null);
                        setIsViewingDashboard(false);
                        showToast('Dashboard deleted.');
                    },
                    confirmVariant: 'danger',
                    confirmText: 'Delete'
                })
           }
       };
       return <DashboardEditor 
           dashboard={selectedDashboard} 
           accounts={accounts} 
           onSave={()=>{}} // Not called in view mode
           onCancel={() => { setSelectedDashboard(null); setIsViewingDashboard(false); }}
           isViewMode={true}
           allDashboards={dashboards}
           onSwitchDashboard={handleSwitchDashboard}
           onEditDashboard={handleEditDashboard}
           onDeleteDashboard={handleDeleteDashboard}
       />;
   }

    switch (activePage) {
        case 'Data Cloud Overview':
            return <Overview onSelectAccount={setSelectedAccount} onSelectUser={setSelectedUser} accounts={accounts} users={users} onSetBigScreenWidget={setBigScreenWidget} currentUser={currentUser} />;
        case 'Snowflake Accounts':
            return <Connections accounts={accounts} onSelectAccount={setSelectedAccount} onAddAccountClick={() => setSidePanel({ type: 'addAccount' })} onDeleteAccount={(id) => { setConfirmation({ title: 'Delete Account', message: 'Are you sure?', onConfirm: () => {setAccounts(accs => accs.filter(a => a.id !== id)); showToast('Account deleted.'); }, confirmText: 'Delete', confirmVariant: 'danger'}) }} />;
        case 'AI Agent':
            return <AIAgent />;
        case 'Reports':
            return <Reports />;
        case 'Assigned Queries':
            return <AssignedQueries assignedQueries={assignedQueries} onUpdateStatus={(id, status) => {setAssignedQueries(aqs => aqs.map(aq => aq.id === id ? {...aq, status} : aq)); showToast('Query status updated.')}} />;
        case 'Book a Demo':
            return <BookDemo />;
        case 'Docs':
            return <Docs />;
        case 'Settings':
            return <SettingsPage 
                activeSubPage={activeSubPage || 'User Management'} 
                onSubPageChange={(sub) => setActiveSubPage(sub)}
                onBack={() => setActivePage('Data Cloud Overview')} 
                onAddUserClick={() => setModal({ type: 'addUser' })}
                users={users}
                onEditUserRoleClick={(user) => setSidePanel({ type: 'editUser', data: user })}
                onSuspendUserClick={(user) => setConfirmation({ title: 'Suspend User', message: `Are you sure you want to suspend ${user.name}?`, confirmVariant: 'warning', confirmText: 'Suspend', onConfirm: () => {setUsers(us => us.map(u => u.id === user.id ? {...u, status: 'Suspended'} : u)); showToast('User suspended.')} })}
                onActivateUserClick={(user) => {setUsers(us => us.map(u => u.id === user.id ? {...u, status: 'Active'} : u)); showToast('User activated.')}}
                onRemoveUserClick={(user) => setConfirmation({ title: 'Remove User', message: `Are you sure you want to remove ${user.name}? This action cannot be undone.`, confirmVariant: 'danger', confirmText: 'Remove', onConfirm: () => {setUsers(us => us.filter(u => u.id !== user.id)); showToast('User removed.')} })}
            />;
        case 'Support':
            return <Support />;
        case 'Dashboards':
            return <Dashboards
                dashboards={dashboards}
                onDeleteDashboardClick={(d) => setConfirmation({ title: 'Delete Dashboard', message: `Are you sure you want to delete "${d.title}"?`, onConfirm: () => {setDashboards(ds => ds.filter(db => db.id !== d.id)); showToast('Dashboard deleted.')}, confirmText: 'Delete', confirmVariant: 'danger' })}
                onAddDashboardClick={() => setEditingDashboard({ id: `temp-${Date.now()}`, title: '', createdOn: new Date().toISOString(), widgets: [], dataSourceContext: { type: 'overall' } })}
                onEditDashboardClick={setEditingDashboard}
                onViewDashboardClick={(d) => { setSelectedDashboard(d); setIsViewingDashboard(true); }}
            />;
        case 'Profile Settings':
             return <ProfileSettingsPage user={currentUser!} onBack={() => handleSetActivePage('Data Cloud Overview')} />;
        case 'Notifications':
            return <NotificationsPage 
                notifications={notifications} 
                activityLogs={activityLogs} 
                onMarkAllAsRead={handleMarkAllNotificationsAsRead} 
                onClearNotification={handleClearNotification} 
                users={users} 
                onBackToOverview={() => handleSetActivePage('Data Cloud Overview')}
                accounts={accounts}
                onNavigateToWarehouse={handleNavigateToWarehouse}
                onNavigateToQuery={handleNavigateToQuery}
                onMarkNotificationAsRead={handleMarkNotificationAsRead}
            />;
        default:
            return <Overview onSelectAccount={setSelectedAccount} onSelectUser={setSelectedUser} accounts={accounts} users={users} onSetBigScreenWidget={setBigScreenWidget} currentUser={currentUser} />;
    }
  };

  const handleAddAccount = (data: { name: string }) => {
    const newAccount: Account = { id: `acc-${Date.now()}`, name: data.name, identifier: 'new.snowflake.account', role: 'SYSADMIN', status: 'Syncing', lastSynced: 'Just now', cost: 0, credits: 0 };
    setAccounts(prev => [...prev, newAccount]);
    setSidePanel(null);
    showToast(`Account "${data.name}" added successfully.`);
  };

  const handleSaveQuery = (data: any) => {
    showToast(`Query version saved to "${data.fileName}".`);
    setSidePanel(null);
  }

  const handleAddUser = (data: { email: string; }) => {
      const newUser: User = { id: `user-${Date.now()}`, name: 'Invited User', email: data.email, role: 'Viewer', status: 'Invited', dateAdded: new Date().toISOString().split('T')[0], cost: 0, credits: 0, message: 'Invitation pending' };
      setUsers(prev => [newUser, ...prev]);
      setModal(null);
      showToast(`Invitation sent to ${data.email}.`);
  };
  
  const handleEditUserRole = (userId: string, newRole: UserRole) => {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      setSidePanel(null);
      showToast(`User role updated successfully.`);
  };

  const handleAssignQuery = (details: { assigneeId: string; priority: AssignmentPriority; message: string; }) => {
    if (!sidePanel || sidePanel.type !== 'assignQuery' || !sidePanel.data) return;
    
    const queryToAssign = sidePanel.data as QueryListItem;
    const assignee = users.find(u => u.id === details.assigneeId);

    if (!assignee || !currentUser) {
        showToast("Error: Could not find user to assign to.");
        return;
    }

    const newAssignment: AssignedQuery = {
        id: `aq-${Date.now()}`,
        queryId: queryToAssign.id,
        queryText: queryToAssign.queryText,
        assignedBy: currentUser.name,
        assignedTo: assignee.name,
        priority: details.priority,
        status: 'Pending',
        message: details.message,
        assignedOn: new Date().toISOString(),
        cost: queryToAssign.costUSD,
        credits: queryToAssign.costCredits,
    };

    setAssignedQueries(prev => [newAssignment, ...prev]);

    showToast(`Query assigned to ${assignee.name}.`);
    setSidePanel(null);
  }
  
  const authPage = () => {
      switch(authScreen) {
          case 'login': return <LoginPage onLogin={handleLogin} onShowSignup={() => setAuthScreen('signup')} onShowForgotPassword={() => setAuthScreen('forgotPassword')} />;
          case 'signup': return <SignupPage onSignup={() => setAuthScreen('submitted')} onShowLogin={() => setAuthScreen('login')} />;
          case 'submitted': return <RequestSubmittedPage onBackToHomepage={() => setAuthScreen('login')} />;
          case 'forgotPassword': return <ForgotPasswordPage onContinue={() => setAuthScreen('checkEmail')} onBackToLogin={() => setAuthScreen('login')} />;
          case 'checkEmail': return <CheckEmailPage onContinue={() => setAuthScreen('createNewPassword')} />;
          case 'createNewPassword': return <CreateNewPasswordPage onContinue={() => setAuthScreen('passwordResetSuccess')} />;
          case 'passwordResetSuccess': return <PasswordResetSuccessPage onGoToSignIn={() => setAuthScreen('login')} />;
          default: return <LoginPage onLogin={handleLogin} onShowSignup={() => setAuthScreen('signup')} onShowForgotPassword={() => setAuthScreen('forgotPassword')} />;
      }
  }

  const showCompactLayout = !selectedAccount && activePage !== 'Notifications';
  
  const mainContentPadding = useMemo(() => {
    if (selectedAccount || activePage === 'Notifications' || activePage === 'Settings' || activePage === 'Profile Settings' || editingDashboard || isViewingDashboard) {
        return '';
    }
    if (activePage === 'Data Cloud Overview' || activePage === 'Snowflake Accounts' || activePage === 'Dashboards' || activePage === 'Assigned Queries' || activePage === 'Reports' || activePage === 'AI Agent') {
        return 'p-4';
    }
    return '';
  }, [activePage, selectedAccount, editingDashboard, isViewingDashboard]);

  const managesOwnScroll = useMemo(() => {
    return !!(selectedAccount || activePage === 'Notifications' || activePage === 'Settings' || activePage === 'Profile Settings' || editingDashboard || isViewingDashboard);
  }, [selectedAccount, activePage, editingDashboard, isViewingDashboard]);

  return (
    <>
      {loading && <SplashScreen />}
      {!isAuthenticated ? (
        authPage()
      ) : (
        <div className="flex flex-col h-screen bg-background text-text-primary">
            <Header
                onMenuClick={() => setSidebarOpen(!isSidebarOpen)}
                onLogoClick={() => handleSetActivePage('Data Cloud Overview')}
                isSidebarOpen={isSidebarOpen}
                brandLogo={brandLogo}
                onOpenProfileSettings={() => handleSetActivePage('Profile Settings')}
                onLogout={handleLogout}
                hasNewAssignment={assignedQueries.some(q => q.status === 'Pending')}
                theme={theme}
                onThemeChange={setTheme}
                notifications={notifications}
                onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
                onClearAllNotifications={handleClearAllNotifications}
                onNavigate={(page) => handleSetActivePage(page)}
            />

            {breadcrumbItems.length > 0 && (
              <div className="bg-surface shadow-sm flex-shrink-0 z-10 border-b border-border-light">
                <div className="h-[42px] px-4 flex items-center">
                  <Breadcrumb items={breadcrumbItems} />
                </div>
              </div>
            )}
            
            <div className="flex flex-1 overflow-hidden">
                <Sidebar
                    activePage={activePage}
                    setActivePage={handleSetActivePage}
                    isOpen={isSidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    activeSubPage={activeSubPage}
                    showCompact={showCompactLayout}
                />
                <main className={`flex-1 ${managesOwnScroll ? 'overflow-hidden' : 'overflow-y-auto'}`}>
                    <div className={mainContentPadding}>
                        {renderPage()}
                    </div>
                </main>
            </div>
        </div>
      )}

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {confirmation && (
        <ConfirmationModal
            isOpen={!!confirmation}
            onClose={() => setConfirmation(null)}
            onConfirm={() => { confirmation.onConfirm(); setConfirmation(null); }}
            title={confirmation.title}
            message={confirmation.message}
            confirmText={confirmation.confirmText}
            confirmVariant={confirmation.confirmVariant}
        />
      )}

      {bigScreenWidget && (
        <BigScreenView
            widget={bigScreenWidget}
            accounts={accounts}
            users={users}
            onClose={() => setBigScreenWidget(null)}
            onSelectAccount={(acc) => { setBigScreenWidget(null); setSelectedAccount(acc); }}
            onSelectUser={(user) => { setBigScreenWidget(null); setSelectedUser(user); }}
            displayMode={displayMode}
        />
      )}

      <SidePanel
        isOpen={sidePanel?.type === 'addAccount'}
        onClose={() => setSidePanel(null)}
        title="Add Snowflake Account"
      >
        <AddAccountFlow onCancel={() => setSidePanel(null)} onAddAccount={handleAddAccount} />
      </SidePanel>
      
      <SidePanel
        isOpen={sidePanel?.type === 'saveQuery'}
        onClose={() => setSidePanel(null)}
        title="Save Query Version"
      >
        <SaveQueryFlow files={sqlFiles} onCancel={() => setSidePanel(null)} onSave={handleSaveQuery} />
      </SidePanel>
      
      <SidePanel
        isOpen={sidePanel?.type === 'editUser'}
        onClose={() => setSidePanel(null)}
        title="Edit User Role"
      >
        {sidePanel?.type === 'editUser' && sidePanel.data && (
            <EditUserRoleFlow user={sidePanel.data} onCancel={() => setSidePanel(null)} onSave={handleEditUserRole} />
        )}
      </SidePanel>

       <SidePanel
            isOpen={sidePanel?.type === 'assignQuery'}
            onClose={() => setSidePanel(null)}
            title="Share and Assign Query"
        >
            {sidePanel?.type === 'assignQuery' && sidePanel.data && (
                <AssignQueryFlow query={sidePanel.data} users={users} onCancel={() => setSidePanel(null)} onAssign={handleAssignQuery} />
            )}
       </SidePanel>

       <SidePanel
            isOpen={sidePanel?.type === 'queryPreview'}
            onClose={() => setSidePanel(null)}
            title="Query Preview"
        >
            {sidePanel?.type === 'queryPreview' && sidePanel.data && (
                <QueryPreviewContent
                    query={sidePanel.data}
                    onAnalyze={(q) => { setSidePanel(null); setAnalyzingQuery(q); setNavigationSource('Slow queries'); setAccountViewPage('Query analyzer'); }}
                    onOptimize={(q) => { setSidePanel(null); setAnalyzingQuery(q); setNavigationSource('Slow queries'); setAccountViewPage('Query optimizer'); }}
                    onSimulate={(q) => { setSidePanel(null); setAnalyzingQuery(q); setNavigationSource('Slow queries'); setAccountViewPage('Query simulator'); }}
                />
            )}
       </SidePanel>

      <Modal
        isOpen={modal?.type === 'addUser'}
        onClose={() => setModal(null)}
        title="Add a New User"
      >
        <InviteUserFlow onCancel={() => setModal(null)} onAddUser={handleAddUser} />
      </Modal>
    </>
  );
};

export default App;