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

type SidePanelType = 'addAccount' | 'saveQuery' | 'addUser' | 'editUser' | 'assignQuery';
type Theme = 'light' | 'dark';

const App: React.FC = () => {
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
  const [displayMode, setDisplayMode] = useState<'cost' | 'credits'>('cost');
  const [theme, setTheme] = useState<Theme>('light');


  useEffect(() => {
    const splashLoader = document.getElementById('splash-loader');
    if (splashLoader) {
      const timer = setTimeout(() => {
        splashLoader.style.opacity = '0';
        setTimeout(() => {
          splashLoader.remove();
        }, 500); // match transition duration
      }, 2000); // show loader for 2 seconds
      return () => clearTimeout(timer);
    }
  }, []);

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
      setAnalyzingQuery(null);
      setSelectedPullRequest(null);
      setNavigationSource(null);
  };

  const handleBackToAccounts = useCallback(() => {
    setSelectedAccount(null);
    setActivePage('Snowflake Accounts');
    setSelectedQuery(null);
    setAnalyzingQuery(null);
    setSelectedPullRequest(null);
    setNavigationSource(null);
  }, []);

  const handleBackFromUserView = useCallback(() => {
    setSelectedUser(null);
  }, []);
  
  const handleAddUser = (data: { name: string; role: UserRole; }) => {
    const newCost = Math.floor(Math.random() * 3000);
    const newUser: User = {
        id: `user-${Date.now()}`,
        name: data.name,
        email: `${data.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
        role: data.role,
        status: 'Active',
        dateAdded: new Date().toISOString().split('T')[0],
        cost: newCost,
        credits: parseFloat((newCost * 0.4).toFixed(2)),
    };
    
    setUsers(prevUsers => [newUser, ...prevUsers]);
    handleCloseSidePanel();
    showToast('User added (mock data)');
  };

  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    setUsers(prevUsers => 
        prevUsers.map(user => 
            user.id === userId ? { ...user, role: newRole } : user
        )
    );
    handleCloseSidePanel();
    showToast('User role updated successfully!');
  };

  const handleSuspendUser = (userId: string) => {
      setUsers(prevUsers => 
          prevUsers.map(user => 
              user.id === userId ? { ...user, status: 'Suspended' as UserStatus } : user
          )
      );
      setUserToSuspend(null);
      showToast('User has been suspended.');
  };

  const handleConfirmActivateUser = (userId: string) => {
      setUsers(prevUsers => 
          prevUsers.map(user => 
              user.id === userId ? { ...user, status: 'Active' as UserStatus } : user
          )
      );
      setUserToActivate(null);
      showToast('User has been activated.');
  };

  const handleRemoveUser = (userId: string) => {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      setUserToRemove(null);
      showToast('User has been removed.');
  };
  
  const handleDeleteDashboard = (dashboardId: string) => {
      setDashboards(prevDashboards => prevDashboards.filter(d => d.id !== dashboardId));
      setDashboardToDelete(null);
      if (viewingDashboard?.id === dashboardId) {
          setViewingDashboard(null);
      }
      showToast('Dashboard deleted successfully.');
  };

  const handleSaveDashboard = (dashboardToSave: DashboardItem) => {
    const isNew = dashboardToSave.id.startsWith('temp-');
    let savedDashboard = dashboardToSave;

    if (isNew) {
        const newDashboard: DashboardItem = {
            ...dashboardToSave,
            id: `dash-${Date.now()}`,
            createdOn: new Date().toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            }),
        };
        savedDashboard = newDashboard;
        setDashboards(prev => [newDashboard, ...prev]);
        showToast('Dashboard created successfully!');
    } else {
        setDashboards(prev => prev.map(d => d.id === dashboardToSave.id ? dashboardToSave : d));
        showToast('Dashboard updated successfully!');
    }

    setEditingDashboard(null);

    if (isNew) {
        // For a new dashboard, return to the list view
        setViewingDashboard(null);
    } else {
        // For an updated dashboard, show the view mode
        setViewingDashboard(savedDashboard);
    }
  };

  const handleUpdateUserProfile = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setUsers(prevUsers => 
        prevUsers.map(user => 
            user.id === updatedUser.id ? updatedUser : user
        )
    );
    showToast('Profile updated successfully!');
  };
  
  const handleUpdateBrandLogo = (newLogo: string) => {
    setBrandLogo(newLogo);
    showToast("Brand logo updated successfully!");
  };

  const handleLogout = () => {
    showToast('You have been logged out.');
  };
  
  const handleOpenProfileSettings = () => {
    setIsSidebarOpen(false);
    setSelectedAccount(null);
    setSelectedUser(null);
    setIsSettingsViewActive(false);
    setIsProfileSettingsPageActive(true);
    setActiveProfileSubPage('User Info');
  };

  const handleOpenAssignQuery = (query: QueryListItem) => {
    setActiveSidePanel({ type: 'assignQuery', props: { query } });
  };

  const handleAssignQuery = (details: { assigneeId: string; priority: AssignmentPriority; message: string; }) => {
    if (!activeSidePanel || activeSidePanel.type !== 'assignQuery' || !currentUser) return;
    const { query } = activeSidePanel.props;

    const assignee = users.find(u => u.id === details.assigneeId);
    if (!assignee) return;

    const newAssignment: AssignedQuery = {
        id: `aq-${Date.now()}`,
        queryId: query.id,
        queryText: query.queryText,
        assignedBy: currentUser.name,
        assignedTo: assignee.name,
        priority: details.priority,
        status: 'Pending',
        message: details.message,
        assignedOn: new Date().toISOString(),
        cost: query.costUSD,
        credits: query.costCredits,
    };

    setAssignedQueries(prev => [newAssignment, ...prev]);
    handleCloseSidePanel();
    setHasNewAssignment(true);
    showToast(`Query assigned to ${assignee.name}`);
  };

  const handleUpdateAssignmentStatus = (assignmentId: string, status: AssignmentStatus) => {
    setAssignedQueries(prev => prev.map(aq =>
        aq.id === assignmentId ? { ...aq, status } : aq
    ));
    showToast(`Assignment status updated to "${status}"`);
  };

  const handleAnalyzeQuery = (query: QueryListItem | null, source: string) => {
    setAnalyzingQuery(query);
    setNavigationSource(source || null);
    if (query) {
        setActiveAccountSubPage('Query analyzer');
        setSelectedQuery(null);
    }
  };
  
  const handleOptimizeQuery = (query: QueryListItem | null, source: string) => {
    setAnalyzingQuery(query); // Re-use the same state for simplicity
    setNavigationSource(source || null);
    if (query) {
        setActiveAccountSubPage('Query optimizer');
        setSelectedQuery(null);
    }
  };

  const handleSimulateQuery = (query: QueryListItem | null, source: string) => {
    setAnalyzingQuery(query); // Re-use the same state for simplicity
    setNavigationSource(source || null);
    if (query) {
        setActiveAccountSubPage('Query simulator');
        setSelectedQuery(null);
    }
  };

  const handleOpenSaveQuery = (tag: string) => {
    setActiveSidePanel({ type: 'saveQuery', props: { contextualTag: tag } });
  };

  const handleAccountSubPageChange = (subPage: string) => {
    setActiveAccountSubPage(subPage);
    setSelectedQuery(null);
    setAnalyzingQuery(null);
    setSelectedPullRequest(null);
    setNavigationSource(null);
  };

  const breadcrumbItems = useMemo(() => {
      if (isProfileSettingsPageActive) {
          return [
              { label: 'Dashboard', onClick: handleLogoClick },
              { label: 'Profile Settings', onClick: () => setActiveProfileSubPage('User Info') },
              { label: activeProfileSubPage }
          ];
      }

      if (isSettingsViewActive) {
          return [
              { label: 'Dashboard', onClick: handleLogoClick },
              { label: 'Settings', onClick: () => handlePageChange('Settings', 'User Management') },
              { label: activeSubPage }
          ];
      }
      
      if (selectedAccount) {
            const baseItems = [
              { label: 'Snowflake Accounts', onClick: handleBackToAccounts },
              { label: selectedAccount.name, onClick: () => handleAccountSubPageChange('Account overview') },
            ];

            if (analyzingQuery) {
                const sourceLabel = navigationSource || 'All queries';
                const sourcePage = navigationSource || 'All queries';
                let toolLabel = '';
                if (activeAccountSubPage === 'Query analyzer') toolLabel = 'Query Analyzer';
                if (activeAccountSubPage === 'Query optimizer') toolLabel = 'Query Optimizer';
                if (activeAccountSubPage === 'Query simulator') toolLabel = 'Query Simulator';
                
                if (toolLabel) {
                    return [
                        ...baseItems,
                        { label: sourceLabel, onClick: () => { handleAnalyzeQuery(null, ''); handleAccountSubPageChange(sourcePage); } },
                        { label: toolLabel }
                    ];
                }
            }
            if (selectedPullRequest) {
                return [
                    ...baseItems,
                    { label: 'Pull Requests', onClick: () => setSelectedPullRequest(null) },
                    { label: `#${selectedPullRequest.id}: ${selectedPullRequest.title}` }
                ];
            }

            if (selectedQuery) {
                return [
                    ...baseItems,
                    { label: activeAccountSubPage, onClick: () => setSelectedQuery(null) },
                    { label: selectedQuery.id }
                ];
            }
            return [...baseItems, { label: activeAccountSubPage }];
      }

      if(selectedUser) {
          return [
              { label: 'Data Cloud Overview', onClick: handleBackFromUserView },
              { label: selectedUser.name }
          ]
      }

      return [];
  }, [activePage, selectedAccount, activeAccountSubPage, selectedUser, isSettingsViewActive, activeSubPage, isProfileSettingsPageActive, activeProfileSubPage, handleLogoClick, handleBackToAccounts, handleBackFromUserView, selectedQuery, selectedPullRequest, analyzingQuery, navigationSource]);

  const showBreadcrumb = breadcrumbItems.length > 0;

  const renderContent = () => {
    switch (activePage) {
      case 'Data Cloud Overview':
        return <Overview onSelectAccount={handleSelectAccount} onSelectUser={handleSelectUser} accounts={accounts} users={users} onSetBigScreenWidget={setBigScreenWidget} displayMode={displayMode} />;
      case 'Dashboards':
        if (editingDashboard) {
          return <DashboardEditor
            dashboard={editingDashboard === 'new' ? null : editingDashboard}
            onSave={handleSaveDashboard}
            onCancel={() => setEditingDashboard(null)}
            accounts={accounts}
          />;
        }
        if (viewingDashboard) {
          return <DashboardEditor
            dashboard={viewingDashboard}
            onSave={handleSaveDashboard}
            onCancel={() => setViewingDashboard(null)}
            accounts={accounts}
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
        return <Dashboards
            dashboards={dashboards}
            onDeleteDashboardClick={(dashboard) => setDashboardToDelete(dashboard)}
            onAddDashboardClick={() => setEditingDashboard('new')}
            onEditDashboardClick={(dashboard) => setEditingDashboard(dashboard)}
            onViewDashboardClick={(dashboard) => setViewingDashboard(dashboard)}
        />;
      case 'Snowflake Accounts':
        return <Connections accounts={accounts} onSelectAccount={handleSelectAccount} onAddAccountClick={() => setActiveSidePanel({ type: 'addAccount' })} onDeleteAccount={handleDeleteAccount} />;
      case 'Assigned Queries':
        return <AssignedQueries assignedQueries={assignedQueries} onUpdateStatus={handleUpdateAssignmentStatus} />;
      case 'AI Agent':
        return <AIAgent />;
      case 'Reports':
        return <Reports />;
      case 'Book a Demo':
        return <BookDemo />; 
      case 'Docs':
        return <Docs />;
      case 'Settings':
        return <Settings />;
      case 'Support':
        return <Support />;
      default:
        return <Connections accounts={accounts} onSelectAccount={handleSelectAccount} onAddAccountClick={() => setActiveSidePanel({ type: 'addAccount' })} onDeleteAccount={handleDeleteAccount} />;
    }
  };
  
  const isAccountView = !!selectedAccount || !!selectedUser;

  return (
    <div className="h-screen bg-background font-sans flex flex-col">
      {bigScreenWidget ? (
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
      ) : (
        <>
          <Header 
            onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
            onLogoClick={handleLogoClick}
            isSidebarOpen={isSidebarOpen}
            brandLogo={brandLogo}
            onOpenProfileSettings={handleOpenProfileSettings}
            onLogout={handleLogout}
            hasNewAssignment={hasNewAssignment}
            displayMode={displayMode}
            onDisplayModeChange={setDisplayMode}
            theme={theme}
            onThemeChange={setTheme}
          />
          
          {showBreadcrumb && (
              <div className="bg-surface w-full py-3 px-6 flex-shrink-0">
                  <Breadcrumb items={breadcrumbItems} />
              </div>
          )}

          <div className="flex flex-1 overflow-hidden">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                activePage={activePage}
                setActivePage={handlePageChange}
                activeSubPage={activeSubPage}
                showCompact={!isAccountView && !isSettingsViewActive && !isProfileSettingsPageActive && !editingDashboard}
            />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
              {selectedAccount ? (
                  <AccountView
                      account={selectedAccount}
                      accounts={accounts}
                      onSwitchAccount={handleSelectAccount}
                      sqlFiles={sqlFiles}
                      onSaveQueryClick={handleOpenSaveQuery}
                      onSetBigScreenWidget={setBigScreenWidget}
                      activePage={activeAccountSubPage}
                      onPageChange={handleAccountSubPageChange}
                      onShareQueryClick={handleOpenAssignQuery}
                      selectedQuery={selectedQuery}
                      setSelectedQuery={setSelectedQuery}
                      analyzingQuery={analyzingQuery}
                      onAnalyzeQuery={handleAnalyzeQuery}
                      onOptimizeQuery={handleOptimizeQuery}
                      onSimulateQuery={handleSimulateQuery}
                      pullRequests={pullRequestsData}
                      selectedPullRequest={selectedPullRequest}
                      setSelectedPullRequest={setSelectedPullRequest}
                      displayMode={displayMode}
                      users={users}
                      navigationSource={navigationSource}
                  />
              ) : selectedUser ? (
                  <UserView user={selectedUser} onBack={() => setSelectedUser(null)} />
              ) : isSettingsViewActive ? (
                <SettingsPage
                    users={users}
                    activeSubPage={activeSubPage || 'User Management'}
                    onSubPageChange={(subPage) => handlePageChange('Settings', subPage)}
                    onBack={() => {
                        setIsSettingsViewActive(false);
                        setActivePage('Data Cloud Overview');
                    }}
                    onAddUserClick={() => setActiveSidePanel({ type: 'addUser' })}
                    onEditUserRoleClick={(user) => setActiveSidePanel({ type: 'editUser', props: { user } })}
                    onSuspendUserClick={(user) => setUserToSuspend(user)}
                    onActivateUserClick={(user) => setUserToActivate(user)}
                    onRemoveUserClick={(user) => setUserToRemove(user)}
                />
              ) : isProfileSettingsPageActive && currentUser ? (
                  <ProfileSettingsPage
                      user={currentUser}
                      onSave={handleUpdateUserProfile}
                      onBack={() => setIsProfileSettingsPageActive(false)}
                      brandLogo={brandLogo}
                      onUpdateBrandLogo={handleUpdateBrandLogo}
                      activeSection={activeProfileSubPage}
                      onSectionChange={setActiveProfileSubPage}
                  />
              ) : (
                  <div className={activePage === 'Dashboards' && (editingDashboard || viewingDashboard) ? '' : 'p-4'}>
                    {renderContent()}
                  </div>
              )}
            </main>
          </div>
        </>
      )}

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      <SidePanel isOpen={activeSidePanel?.type === 'addAccount'} onClose={handleCloseSidePanel} title="Connect Snowflake Account">
        <AddAccountFlow onCancel={handleCloseSidePanel} onAddAccount={handleAddAccount} />
      </SidePanel>

      <SidePanel isOpen={activeSidePanel?.type === 'saveQuery'} onClose={handleCloseSidePanel} title="Save Query Version">
        {activeSidePanel?.type === 'saveQuery' && <SaveQueryFlow files={sqlFiles} onCancel={handleCloseSidePanel} onSave={handleSaveQuery} {...activeSidePanel.props} />}
      </SidePanel>
      
      <SidePanel isOpen={activeSidePanel?.type === 'addUser'} onClose={handleCloseSidePanel} title="Add User">
          <InviteUserFlow onCancel={handleCloseSidePanel} onAddUser={handleAddUser} />
      </SidePanel>

      <SidePanel isOpen={activeSidePanel?.type === 'editUser'} onClose={handleCloseSidePanel} title="Edit User Role">
        {activeSidePanel?.type === 'editUser' && <EditUserRoleFlow user={activeSidePanel.props.user} onCancel={handleCloseSidePanel} onSave={handleUpdateUserRole} />}
      </SidePanel>
      
      <SidePanel isOpen={activeSidePanel?.type === 'assignQuery'} onClose={handleCloseSidePanel} title="Assign Query for Optimization">
          {activeSidePanel?.type === 'assignQuery' && <AssignQueryFlow query={activeSidePanel.props.query} users={users} onCancel={handleCloseSidePanel} onAssign={handleAssignQuery} />}
      </SidePanel>

      {userToSuspend && (
          <ConfirmationModal isOpen={!!userToSuspend} onClose={() => setUserToSuspend(null)} onConfirm={() => handleSuspendUser(userToSuspend.id)} title="Suspend User" message={`Are you sure you want to suspend ${userToSuspend.name}? They will lose access to the platform.`} confirmText="Suspend" confirmVariant="warning" />
      )}

      {userToRemove && (
          <ConfirmationModal isOpen={!!userToRemove} onClose={() => setUserToRemove(null)} onConfirm={() => handleRemoveUser(userToRemove.id)} title="Remove User" message={`Are you sure you want to remove ${userToRemove.name}? This action cannot be undone.`} confirmText="Remove" confirmVariant="danger" />
      )}

      {userToActivate && (
          <ConfirmationModal isOpen={!!userToActivate} onClose={() => setUserToActivate(null)} onConfirm={() => handleConfirmActivateUser(userToActivate.id)} title="Activate User" message={`Are you sure you want to activate ${userToActivate.name}? They will regain access to the platform.`} confirmText="Activate" confirmVariant="primary" />
      )}

      {dashboardToDelete && (
          <ConfirmationModal isOpen={!!dashboardToDelete} onClose={() => setDashboardToDelete(null)} onConfirm={() => handleDeleteDashboard(dashboardToDelete.id)} title="Delete Dashboard" message={`Are you sure you want to delete the "${dashboardToDelete.title}" dashboard? This action cannot be undone.`} confirmText="Delete" confirmVariant="danger" />
      )}
    </div>
  );
};

export default App;