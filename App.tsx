import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Connections from './pages/Connections';
import AIAgent from './pages/AIAgent';
import Reports from './pages/Reports';
import BookDemo from './pages/BookDemo';
import Docs from './pages/Docs';
import Settings from './pages/Settings';
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
import { Page, Account, SQLFile, UserRole, User, UserStatus, DashboardItem, BigScreenWidget, QueryListItem, AssignedQuery, AssignmentPriority, AssignmentStatus, PullRequest } from './types';
import { connectionsData, sqlFilesData as initialSqlFiles, usersData, dashboardsData as initialDashboardsData, assignedQueriesData, pullRequestsData } from './data/dummyData';
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


type SidePanelType = 'addAccount' | 'saveQuery' | 'editUser' | 'assignQuery' | 'queryPreview';
type ModalType = 'addUser';
type Theme = 'light' | 'dark';
type AuthScreen = 'login' | 'signup' | 'submitted' | 'forgotPassword' | 'checkEmail' | 'createNewPassword' | 'passwordResetSuccess';
type UserAppRole = 'Admin' | 'User';

const SplashScreen: React.FC = () => (
    <div id="splash-loader" style={{ opacity: 1 }}>
        <div className="loader">
            <div className="logo-container">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="52" viewBox="0 0 48 52" fill="none">
                    <path d="M26.0245 1.10411C26.5035 0.944589 27.0263 0.947640 27.4289 1.26015C27.8353 1.57579 27.9607 2.08272 27.9091 2.58175C27.8545 3.11164 27.7675 3.64069 27.6909 4.14221C27.6133 4.65109 27.5445 5.14003 27.5176 5.62516C27.3883 8.02999 27.2264 10.4046 27.2481 12.7777L27.2642 13.7268C27.3734 18.1509 27.9741 22.5304 28.8846 26.8812L29.0846 27.8133L29.1091 27.9046C29.117 27.9271 29.1239 27.9412 29.1284 27.9492C29.1329 27.9508 29.1399 27.952 29.1488 27.9545C29.1812 27.9632 29.2339 27.973 29.3187 27.9788C31.4692 28.126 33.6249 28.4423 35.6955 29.2251L35.8816 29.3026C36.0621 29.3849 36.2283 29.4799 36.3789 29.5712C36.5986 29.7041 36.752 29.8069 36.9415 29.9151L37.3619 30.155L37.0464 30.8939L36.8645 31.3163L36.4143 31.2091C34.2199 30.6888 31.9678 30.4478 29.7124 30.4872C29.9032 31.2229 30.0827 31.9235 30.2867 32.6262C31.4116 36.4888 32.6906 40.2413 34.7811 43.6545L35.1436 44.2309C36.0023 45.5552 36.9639 46.7297 38.2796 47.5599L38.5897 47.7445C40.1382 48.6137 41.6866 48.6982 43.2402 47.8018C44.9151 46.8355 45.6648 45.3592 45.5815 43.4241L45.5804 43.4135V43.4029C45.5802 43.3222 45.5841 43.2412 45.5921 43.1609L45.6371 42.7182L46.0831 42.6737L46.2745 42.6556L46.8392 42.5993L46.8756 43.1609C46.8944 43.4511 46.9331 43.7052 46.9665 44.042C46.9897 44.276 47.0079 44.5296 46.9965 44.7903L46.9741 45.0536C46.3837 49.7291 41.6611 52.2231 37.1523 50.4015C35.0198 49.5389 33.3957 48.0921 32.0633 46.3699L31.8002 46.0216C29.9253 43.4767 28.618 40.6676 27.5444 37.7853L27.0973 36.5454C26.7652 35.5902 26.4614 34.6274 26.169 33.6655L25.309 30.7877C25.2985 30.7525 25.2886 30.7234 25.2801 30.6985C21.2845 31.0504 17.4836 31.9481 13.9994 33.8247L13.3064 34.2133C10.7497 35.7051 8.95567 37.8478 7.83348 40.4943L7.6185 41.0303C7.09339 42.4103 6.60802 43.8048 6.13716 45.2075L4.74352 49.4345C4.5561 50.0028 4.25777 50.4981 3.76487 50.7741C3.32521 51.0202 2.82414 51.0403 2.30386 50.9185L2.08032 50.8581C1.74906 50.7565 1.35788 50.5985 1.14552 50.2424C0.921445 49.8662 0.994972 49.4467 1.10809 49.0969L2.15412 45.8465C2.50903 44.7593 2.87718 43.6729 3.27715 42.5993L4.01302 40.6493C7.48513 31.5656 11.5018 22.7148 16.4167 14.2723L17.4841 12.4689C19.3773 9.32226 21.5145 6.30633 23.5506 3.28343L23.7057 3.06475C24.0816 2.56193 24.538 2.12133 24.9497 1.73147L24.956 1.72722L25.0726 1.62426C25.3531 1.39264 25.6763 1.21696 26.0245 1.10411ZM23.0063 10.1675C18.5457 17.0145 14.8187 24.1166 11.563 31.4691C13.3624 30.4149 15.3197 29.6376 17.3675 29.1699L18.3344 28.9598C20.4134 28.5266 22.5251 28.2002 24.6202 27.8323C23.4817 22.1099 22.7559 16.2408 23.0063 10.1675Z" fill="url(#paint0_linear_splash)" stroke="url(#paint1_linear_splash)" strokeWidth="0.75"/>
                    <defs>
                      <linearGradient id="paint0_linear_splash" x1="23.9999" y1="1.54252" x2="23.9999" y2="50.4578" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#6932D5"/>
                        <stop offset="1" stopColor="#7163C6"/>
                      </linearGradient>
                      <linearGradient id="paint1_linear_splash" x1="24" y1="1" x2="24" y2="51" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#6932D5"/>
                        <stop offset="1" stopColor="#7163C6"/>
                      </linearGradient>
                    </defs>
                  </svg>
            </div>
        </div>
    </div>
);


const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<UserAppRole | null>(null);
  const [authScreen, setAuthScreen] = useState<AuthScreen>('login');
  const [activePage, setActivePage] = useState<Page>('Data Cloud Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedQuery, setSelectedQuery] = useState<QueryListItem | null>(null);
  const [analyzingQuery, setAnalyzingQuery] = useState<QueryListItem | null>(null);
  const [selectedPullRequest, setSelectedPullRequest] = useState<PullRequest | null>(null);
  const [navigationSource, setNavigationSource] = useState<string | null>(null);
  
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [sqlFiles, setSqlFiles] = useState<SQLFile[]>(initialSqlFiles);
  const [users, setUsers] = useState<User[]>(() => {
    try {
        const storedUsers = window.localStorage.getItem('anavsan-users');
        if (storedUsers) {
            return JSON.parse(storedUsers);
        }
        window.localStorage.setItem('anavsan-users', JSON.stringify(usersData));
        return usersData;
    } catch (error) {
        console.error("Error with user data in localStorage:", error);
        return usersData;
    }
  });
  const [dashboards, setDashboards] = useState<DashboardItem[]>(initialDashboardsData);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isSettingsViewActive, setIsSettingsViewActive] = useState(false);
  const [activeSubPage, setActiveSubPage] = useState<string | undefined>();
  
  const [userToSuspend, setUserToSuspend] = useState<User | null>(null);
  const [userToRemove, setUserToRemove] = useState<User | null>(null);
  const [userToActivate, setUserToActivate] = useState<User | null>(null);
  const [dashboardToDelete, setDashboardToDelete] = useState<DashboardItem | null>(null);
  
  const [editingDashboard, setEditingDashboard] = useState<DashboardItem | 'new' | null>(null);
  const [viewingDashboard, setViewingDashboard] = useState<DashboardItem | null>(null);
  const [bigScreenWidget, setBigScreenWidget] = useState<BigScreenWidget | null>(null);

  const [isProfileSettingsPageActive, setIsProfileSettingsPageActive] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(users.length > 0 ? users[0] : null);
  const [brandLogo, setBrandLogo] = useState<string | null>(null);

  const [activeAccountSubPage, setActiveAccountSubPage] = useState('Account overview');
  const [activeProfileSubPage, setActiveProfileSubPage] = useState('User Info');
  
  const [assignedQueries, setAssignedQueries] = useState<AssignedQuery[]>(assignedQueriesData);
  const [hasNewAssignment, setHasNewAssignment] = useState(true);

  const [activeSidePanel, setActiveSidePanel] = useState<{ type: SidePanelType; props?: any } | null>(null);
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [displayMode, setDisplayMode] = useState<'cost' | 'credits'>('cost');
  const [theme, setTheme] = useState<Theme>('light');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (email: string) => {
    setIsLoading(true);
    if (email.toLowerCase() === 'admin@anavsan.com') {
        setCurrentUserRole('Admin');
    } else {
        setCurrentUserRole('User');
    }

    setTimeout(() => {
        setIsLoggedIn(true);
        setIsLoading(false);
    }, 2500);
  };
  
  const handleSignupSubmit = () => setAuthScreen('submitted');
  const handleShowSignup = () => setAuthScreen('signup');
  const handleShowLogin = () => setAuthScreen('login');
  const handleShowForgotPassword = () => setAuthScreen('forgotPassword');
  const handlePasswordResetRequest = () => setAuthScreen('checkEmail');
  const handleCodeSubmit = () => setAuthScreen('createNewPassword');
  const handleNewPasswordSubmit = () => setAuthScreen('passwordResetSuccess');

  useEffect(() => {
    // This effect handles the very first page load splash screen in index.html
    const splashLoader = document.getElementById('splash-loader');
    if (splashLoader) {
      const timer = setTimeout(() => {
        splashLoader.style.opacity = '0';
        setTimeout(() => splashLoader.remove(), 500);
      }, 1000); // Keep initial loader for 1s then fade out
      return () => clearTimeout(timer);
    }
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    if (accounts.length === 0) {
        setAccounts(connectionsData);
    }
  }, []);

  useEffect(() => {
    try {
        window.localStorage.setItem('anavsan-users', JSON.stringify(users));
    } catch (error) {
        console.error("Failed to save users to localStorage:", error);
    }
  }, [users]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);


  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
        setToastMessage(null);
    }, 3000);
  };

  const handlePageChange = (page: Page, subPage?: string) => {
    setActivePage(page);
    setSelectedAccount(null);
    setSelectedUser(null);
    setIsProfileSettingsPageActive(false);
    setViewingDashboard(null);
    setEditingDashboard(null);
    setSelectedQuery(null);
    setAnalyzingQuery(null);
    setSelectedPullRequest(null);
    setNavigationSource(null);
    
    if (page === 'Settings') {
        setIsSettingsViewActive(true);
        setActiveSubPage(subPage || 'User Management');
    } else {
        setIsSettingsViewActive(false);
        setActiveSubPage(subPage);
    }

    if (page === 'Assigned Queries') {
        setHasNewAssignment(false);
    }
  };

  const handleLogoClick = useCallback(() => {
    setActivePage('Data Cloud Overview');
    setSelectedAccount(null);
    setSelectedUser(null);
    setIsSettingsViewActive(false);
    setIsProfileSettingsPageActive(false);
    setViewingDashboard(null);
    setEditingDashboard(null);
    setSelectedQuery(null);
    setAnalyzingQuery(null);
    setSelectedPullRequest(null);
    setNavigationSource(null);
    setIsSidebarOpen(false);
  }, []);

  const handleCloseSidePanel = () => setActiveSidePanel(null);

  const handleAddAccount = (data: { name: string }) => {
    const newCost = Math.floor(Math.random() * 500) + 50;
    const newAccount: Account = {
      id: `new-${Date.now()}`,
      name: data.name || `New Account #${accounts.length + 1}`,
      identifier: `xyz${Math.floor(Math.random() * 1000)}.eu-west-1`,
      role: 'ANALYST',
      status: 'Syncing',
      lastSynced: 'Just now',
      cost: newCost,
      credits: parseFloat((newCost * 0.4).toFixed(2)),
    };
    setAccounts(prevAccounts => [...prevAccounts, newAccount]);
    handleCloseSidePanel();
    showToast("Account added (mock data)");
  };
  
  const handleDeleteAccount = (accountId: string) => {
    setAccounts(prevAccounts => prevAccounts.filter(acc => acc.id !== accountId));
    showToast("Account deleted successfully.");
  };
  
  const handleSaveQuery = (data: { saveType: 'new' | 'existing'; fileName: string; fileId?: string; description: string; tag: string; }) => {
    const { saveType, fileName, fileId, description, tag } = data;

    if (saveType === 'new') {
        const newFile: SQLFile = {
            id: `file-${Date.now()}`,
            name: fileName.endsWith('.sql') ? fileName : `${fileName}.sql`,
            versions: [{
                id: `v-${Date.now()}`,
                version: 1,
                date: new Date().toISOString().split('T')[0],
                description,
                tag
            }],
            createdDate: new Date().toISOString().split('T')[0],
        };
        setSqlFiles(prev => [...prev, newFile]);
    } else if (saveType === 'existing' && fileId) {
        setSqlFiles(prev => prev.map(file => {
            if (file.id === fileId) {
                const newVersionNumber = file.versions.reduce((max, v) => Math.max(max, v.version), 0) + 1;
                const newVersion = {
                    id: `v-${Date.now()}`,
                    version: newVersionNumber,
                    date: new Date().toISOString().split('T')[0],
                    description,
                    tag
                };
                return { ...file, versions: [newVersion, ...file.versions] };
            }
            return file;
        }));
    }
    handleCloseSidePanel();
    showToast("Query version saved successfully.");
  };

  const handleSelectAccount = (account: Account) => {
    setSelectedAccount(account);
    setSelectedUser(null);
    setIsSettingsViewActive(false);
    setIsProfileSettingsPageActive(false);
    setActivePage('Snowflake Accounts');
    setActiveAccountSubPage('Account overview'); // Reset sub-page on account change
    setSelectedQuery(null);
    setAnalyzingQuery(null);
    setSelectedPullRequest(null);
    setNavigationSource(null);
  };

  const handleSelectUser = (user: User) => {
      setSelectedUser(user);
      setSelectedAccount(null);
      setIsSettingsViewActive(false);
      setIsProfileSettingsPageActive(false);
      setSelectedQuery(null);
      // FIX: Fix truncated line and complete function body for consistency
      setAnalyzingQuery(null);
      setSelectedPullRequest(null);
      setNavigationSource(null);
  };
  
  const handleOpenProfileSettings = () => {
    setIsProfileSettingsPageActive(true);
    setActivePage('Settings');
    setActiveProfileSubPage('User Info');
  };

  const renderPage = () => {
    if (isProfileSettingsPageActive) {
        return <ProfileSettingsPage 
            user={currentUser!} 
            onSave={(updatedUser) => {
                setCurrentUser(updatedUser);
                setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
                showToast('Profile updated!');
            }}
            onBack={() => setIsProfileSettingsPageActive(false)}
            brandLogo={brandLogo}
            onUpdateBrandLogo={(logo) => {
                setBrandLogo(logo);
                showToast('Brand logo updated!');
            }}
            activeSection={activeProfileSubPage}
            onSectionChange={setActiveProfileSubPage}
        />;
    }

    if (isSettingsViewActive) {
        return <SettingsPage 
            activeSubPage={activeSubPage || 'User Management'}
            onSubPageChange={(subPage) => handlePageChange('Settings', subPage)}
            onBack={() => {
                setIsSettingsViewActive(false);
                handlePageChange('Data Cloud Overview');
            }}
            onAddUserClick={() => setActiveModal('addUser')}
            users={users}
            onEditUserRoleClick={(user) => setActiveSidePanel({ type: 'editUser', props: { user } })}
            onSuspendUserClick={setUserToSuspend}
            onActivateUserClick={setUserToActivate}
            onRemoveUserClick={setUserToRemove}
        />;
    }
    
    if (editingDashboard) {
        return <DashboardEditor 
            dashboard={editingDashboard === 'new' ? null : editingDashboard}
            accounts={accounts}
            onSave={(dashboard) => {
                if (editingDashboard === 'new') {
                    setDashboards([...dashboards, { ...dashboard, id: `dash-${Date.now()}` }]);
                    showToast('Dashboard created');
                } else {
                    setDashboards(dashboards.map(d => d.id === dashboard.id ? dashboard : d));
                    showToast('Dashboard saved');
                }
                setEditingDashboard(null);
            }}
            onCancel={() => setEditingDashboard(null)}
        />;
    }
    
    if (viewingDashboard) {
        return <DashboardEditor
            dashboard={viewingDashboard}
            accounts={accounts}
            onSave={() => {}}
            onCancel={() => setViewingDashboard(null)}
            isViewMode={true}
            allDashboards={dashboards}
            onSwitchDashboard={setViewingDashboard}
            onEditDashboard={() => {
                setEditingDashboard(viewingDashboard);
                setViewingDashboard(null);
            }}
            onDeleteDashboard={() => setDashboardToDelete(viewingDashboard)}
        />;
    }

    if (selectedAccount) {
      return (
        <AccountView
          account={selectedAccount}
          accounts={accounts}
          onSwitchAccount={setSelectedAccount}
          sqlFiles={sqlFiles}
          onSaveQueryClick={(tag: string) => setActiveSidePanel({ type: 'saveQuery', props: { contextualTag: tag } })}
          onSetBigScreenWidget={setBigScreenWidget}
          activePage={activeAccountSubPage}
          onPageChange={setActiveAccountSubPage}
          onShareQueryClick={(query: QueryListItem) => setActiveSidePanel({ type: 'assignQuery', props: { query } })}
          onPreviewQuery={(query: QueryListItem) => setActiveSidePanel({ type: 'queryPreview', props: { query } })}
          selectedQuery={selectedQuery}
          setSelectedQuery={setSelectedQuery}
          analyzingQuery={analyzingQuery}
          onAnalyzeQuery={(query, source) => {
              setAnalyzingQuery(query);
              setNavigationSource(source);
              setActiveAccountSubPage('Query analyzer');
          }}
          onOptimizeQuery={(query, source) => {
              setAnalyzingQuery(query);
              setNavigationSource(source);
              setActiveAccountSubPage('Query optimizer');
          }}
          onSimulateQuery={(query, source) => {
              setAnalyzingQuery(query);
              setNavigationSource(source);
              setActiveAccountSubPage('Query simulator');
          }}
          pullRequests={pullRequestsData}
          selectedPullRequest={selectedPullRequest}
          setSelectedPullRequest={setSelectedPullRequest}
          displayMode={displayMode}
          users={users}
          navigationSource={navigationSource}
        />
      );
    }
    if (selectedUser) {
      return <UserView user={selectedUser} onBack={() => setSelectedUser(null)} />;
    }
    switch (activePage) {
      case 'Data Cloud Overview':
        return <Overview onSelectAccount={handleSelectAccount} onSelectUser={handleSelectUser} accounts={accounts} users={users} onSetBigScreenWidget={setBigScreenWidget} displayMode={displayMode} currentUserRole={currentUserRole} />;
      case 'Dashboards':
        return <Dashboards 
                    dashboards={dashboards} 
                    onDeleteDashboardClick={setDashboardToDelete} 
                    onAddDashboardClick={() => setEditingDashboard('new')}
                    onEditDashboardClick={setEditingDashboard}
                    onViewDashboardClick={setViewingDashboard}
                />;
      case 'Snowflake Accounts':
        return <Connections accounts={accounts} onSelectAccount={handleSelectAccount} onAddAccountClick={() => setActiveSidePanel({ type: 'addAccount' })} onDeleteAccount={handleDeleteAccount} />;
      case 'AI Agent':
        return <AIAgent />;
      case 'Reports':
        return <Reports />;
      case 'Assigned Queries':
        return <AssignedQueries assignedQueries={assignedQueries} onUpdateStatus={(id, status) => {
            setAssignedQueries(assignedQueries.map(q => q.id === id ? { ...q, status } : q));
        }} />;
      case 'Book a Demo':
        return <BookDemo />;
      case 'Docs':
        return <Docs />;
      case 'Settings':
        return <Settings />;
      case 'Support':
        return <Support />;
      default:
        return <div>Page not found</div>;
    }
  };

  const renderSidePanelContent = () => {
    if (!activeSidePanel) return null;
    switch (activeSidePanel.type) {
        case 'addAccount':
            return <AddAccountFlow onCancel={handleCloseSidePanel} onAddAccount={handleAddAccount} />;
        case 'saveQuery':
            return <SaveQueryFlow onCancel={handleCloseSidePanel} onSave={handleSaveQuery} files={sqlFiles} {...activeSidePanel.props} />;
        case 'editUser':
            return <EditUserRoleFlow {...activeSidePanel.props} onCancel={handleCloseSidePanel} onSave={(userId, newRole) => {
                setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
                handleCloseSidePanel();
            }} />;
        case 'assignQuery':
             return <AssignQueryFlow {...activeSidePanel.props} users={users} onCancel={handleCloseSidePanel} onAssign={({ assigneeId, priority, message }) => {
                const assignee = users.find(u => u.id === assigneeId);
                const newAssignment: AssignedQuery = {
                    id: `aq-${Date.now()}`,
                    queryId: activeSidePanel.props.query.id,
                    queryText: activeSidePanel.props.query.queryText,
                    assignedBy: currentUser!.name,
                    assignedTo: assignee!.name,
                    priority,
                    status: 'Pending',
                    message,
                    assignedOn: new Date().toISOString(),
                    cost: activeSidePanel.props.query.costUSD,
                    credits: activeSidePanel.props.query.costCredits,
                };
                setAssignedQueries(prev => [newAssignment, ...prev]);
                showToast(`Query assigned to ${assignee!.name}`);
                handleCloseSidePanel();
             }} />;
        case 'queryPreview':
            return <QueryPreviewContent {...activeSidePanel.props} onAnalyze={(q) => {
                handleCloseSidePanel();
                if(selectedAccount) {
                    setAnalyzingQuery(q);
                    setNavigationSource(activeAccountSubPage);
                    setActiveAccountSubPage('Query analyzer');
                }
            }} onOptimize={(q) => {
                handleCloseSidePanel();
                if(selectedAccount) {
                    setAnalyzingQuery(q);
                    setNavigationSource(activeAccountSubPage);
                    setActiveAccountSubPage('Query optimizer');
                }
            }} onSimulate={(q) => {
                 handleCloseSidePanel();
                if(selectedAccount) {
                    setAnalyzingQuery(q);
                    setNavigationSource(activeAccountSubPage);
                    setActiveAccountSubPage('Query simulator');
                }
            }} />;
        default:
            return null;
    }
  };

  const getSidePanelTitle = () => {
      if (!activeSidePanel) return '';
      switch (activeSidePanel.type) {
          case 'addAccount': return 'Add Snowflake Account';
          case 'saveQuery': return 'Save Query Version';
          case 'editUser': return `Edit Role for ${activeSidePanel.props.user.name}`;
          case 'assignQuery': return 'Assign Query for Optimization';
          case 'queryPreview': return 'Query Preview';
          default: return '';
      }
  };

  const renderModalContent = () => {
    if (!activeModal) return null;
    switch(activeModal) {
        case 'addUser':
            return <InviteUserFlow onCancel={() => setActiveModal(null)} onAddUser={(data) => {
                const newUser: User = {
                    id: `user-${Date.now()}`,
                    name: data.email.split('@')[0],
                    email: data.email,
                    role: 'Viewer',
                    status: 'Invited',
                    dateAdded: new Date().toISOString().split('T')[0],
                    cost: 0,
                    credits: 0,
                };
                setUsers(prev => [newUser, ...prev]);
                setActiveModal(null);
            }} />;
        default:
            return null;
    }
  };
  
  const getModalTitle = () => {
    if (!activeModal) return '';
    switch(activeModal) {
        case 'addUser': return 'Invite User';
        default: return '';
    }
  };
  
  if (!isLoggedIn) {
      if (authScreen === 'login') return <LoginPage onLogin={handleLogin} onShowSignup={handleShowSignup} onShowForgotPassword={handleShowForgotPassword} />;
      if (authScreen === 'signup') return <SignupPage onSignup={handleSignupSubmit} onShowLogin={handleShowLogin} />;
      if (authScreen === 'submitted') return <RequestSubmittedPage onBackToHomepage={handleShowLogin} />;
      if (authScreen === 'forgotPassword') return <ForgotPasswordPage onContinue={handlePasswordResetRequest} onBackToLogin={handleShowLogin} />;
      if (authScreen === 'checkEmail') return <CheckEmailPage onContinue={handleCodeSubmit} />;
      if (authScreen === 'createNewPassword') return <CreateNewPasswordPage onContinue={handleNewPasswordSubmit} />;
      if (authScreen === 'passwordResetSuccess') return <PasswordResetSuccessPage onGoToSignIn={handleShowLogin} />;
  }

  return (
    <div className={`app-container flex flex-col h-screen bg-background font-sans text-text-primary ${theme}`}>
      {isLoading && <SplashScreen />}
      <Header
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarOpen={isSidebarOpen}
        onLogoClick={handleLogoClick}
        brandLogo={brandLogo}
        onOpenProfileSettings={handleOpenProfileSettings}
        onLogout={() => { setIsLoggedIn(false); setCurrentUserRole(null); }}
        hasNewAssignment={hasNewAssignment}
        displayMode={displayMode}
        onDisplayModeChange={setDisplayMode}
        theme={theme}
        onThemeChange={setTheme}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activePage={activePage}
          setActivePage={handlePageChange}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeSubPage={activeSubPage}
          showCompact={!selectedAccount}
        />
        <main className={`flex-1 overflow-y-auto ${!selectedAccount ? 'ml-4 mt-4' : ''}`}>
          {renderPage()}
        </main>
      </div>

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      <SidePanel 
          isOpen={!!activeSidePanel} 
          onClose={handleCloseSidePanel}
          title={getSidePanelTitle()}
      >
          {renderSidePanelContent()}
      </SidePanel>
      
      <Modal 
          isOpen={!!activeModal}
          onClose={() => setActiveModal(null)}
          title={getModalTitle()}
      >
          {renderModalContent()}
      </Modal>

      {userToSuspend && (
          <ConfirmationModal
              isOpen={!!userToSuspend}
              onClose={() => setUserToSuspend(null)}
              onConfirm={() => {
                  setUsers(users.map(u => u.id === userToSuspend.id ? { ...u, status: 'Suspended' } : u));
                  setUserToSuspend(null);
              }}
              title="Suspend User"
              message={<>Are you sure you want to suspend <strong>{userToSuspend.name}</strong>? They will lose access to the platform.</>}
              confirmText="Suspend"
              confirmVariant="warning"
          />
      )}
       {userToActivate && (
          <ConfirmationModal
              isOpen={!!userToActivate}
              onClose={() => setUserToActivate(null)}
              onConfirm={() => {
                  setUsers(users.map(u => u.id === userToActivate.id ? { ...u, status: 'Active' } : u));
                  setUserToActivate(null);
              }}
              title="Activate User"
              message={<>Are you sure you want to activate <strong>{userToActivate.name}</strong>? They will regain access to the platform.</>}
              confirmText="Activate"
          />
      )}
      {userToRemove && (
          <ConfirmationModal
              isOpen={!!userToRemove}
              onClose={() => setUserToRemove(null)}
              onConfirm={() => {
                  setUsers(users.filter(u => u.id !== userToRemove.id));
                  setUserToRemove(null);
              }}
              title="Remove User"
              message={<>Are you sure you want to permanently remove <strong>{userToRemove.name}</strong> from the organization?</>}
              confirmText="Remove"
              confirmVariant="danger"
          />
      )}
      {dashboardToDelete && (
          <ConfirmationModal
              isOpen={!!dashboardToDelete}
              onClose={() => setDashboardToDelete(null)}
              onConfirm={() => {
                  setDashboards(dashboards.filter(d => d.id !== dashboardToDelete.id));
                  setDashboardToDelete(null);
                  setViewingDashboard(null);
              }}
              title="Delete Dashboard"
              message={<>Are you sure you want to delete the "<strong>{dashboardToDelete.title}</strong>" dashboard? This action cannot be undone.</>}
              confirmText="Delete"
              confirmVariant="danger"
          />
      )}
      {bigScreenWidget && (
          <BigScreenView
              widget={bigScreenWidget}
              accounts={accounts}
              users={users}
              onClose={() => setBigScreenWidget(null)}
              onSelectAccount={(account) => {
                  setBigScreenWidget(null);
                  handleSelectAccount(account);
              }}
              onSelectUser={(user) => {
                  setBigScreenWidget(null);
                  handleSelectUser(user);
              }}
              displayMode={displayMode}
          />
      )}
    </div>
  );
};
// FIX: Add default export to fix module import error
export default App;