
import React, { useState, useEffect, useRef } from 'react';
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
import { Page, Account, SQLFile, UserRole, User, UserStatus, DashboardItem, BigScreenWidget } from './types';
import { connectionsData, sqlFilesData as initialSqlFiles, usersData, dashboardsData as initialDashboardsData } from './data/dummyData';
import SettingsPage from './pages/SettingsPage';
import Dashboards from './pages/Dashboards';
import DashboardEditor from './pages/DashboardEditor';
import ProfileSettingsPage from './pages/ProfileSettingsPage';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('Data Cloud Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [isSavingQuery, setIsSavingQuery] = useState(false);
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
  const [activeSettingsSubPage, setActiveSettingsSubPage] = useState('User Management');
  
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToSuspend, setUserToSuspend] = useState<User | null>(null);
  const [userToRemove, setUserToRemove] = useState<User | null>(null);
  const [userToActivate, setUserToActivate] = useState<User | null>(null);
  const [dashboardToDelete, setDashboardToDelete] = useState<DashboardItem | null>(null);
  
  const [editingDashboard, setEditingDashboard] = useState<DashboardItem | 'new' | null>(null);
  const [bigScreenWidget, setBigScreenWidget] = useState<BigScreenWidget | null>(null);

  const [isProfileSettingsPageActive, setIsProfileSettingsPageActive] = useState(false);
  // Mock current user - assuming the first user is the logged-in user
  const [currentUser, setCurrentUser] = useState<User | null>(users.length > 0 ? users[0] : null);
  const [brandLogo, setBrandLogo] = useState<string | null>(null);


  useEffect(() => {
    if (accounts.length === 0 && !isAddingAccount) {
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
    
    if (page === 'Settings') {
        setIsSettingsViewActive(true);
        if (subPage) {
            setActiveSettingsSubPage(subPage);
        } else {
            setActiveSettingsSubPage('User Management');
        }
    } else {
        setIsSettingsViewActive(false);
    }

    setIsSidebarOpen(false);
  };

  const handleLogoClick = () => {
    setActivePage('Data Cloud Overview');
    setSelectedAccount(null);
    setSelectedUser(null);
    setIsSettingsViewActive(false);
    setIsProfileSettingsPageActive(false);
    setIsSidebarOpen(false);
  };

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
    setIsAddingAccount(false);
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
            }]
        };
        setSqlFiles(prev => [...prev, newFile]);
    } else if (saveType === 'existing' && fileId) {
        setSqlFiles(prev => prev.map(file => {
            if (file.id === fileId) {
                const newVersionNumber = file.versions.reduce((max, v) => Math.max(max, v.version), 0) + 1;
                const newVersion = {
                    id: `v-${Date.now()}`,
                    version: newVersionNumber,
                    // FIX: Corrected typo `new D ate()` to `new Date()`.
                    date: new Date().toISOString().split('T')[0],
                    description,
                    tag
                };
                return { ...file, versions: [newVersion, ...file.versions] };
            }
            return file;
        }));
    }
    setIsSavingQuery(false);
    showToast("Query saved successfully!");
  };
  
  const handleCancelAddAccount = () => setIsAddingAccount(false);
  const handleCancelSaveQuery = () => setIsSavingQuery(false);

  const handleSelectAccount = (account: Account) => {
    setSelectedAccount(account);
    setSelectedUser(null);
    setIsSettingsViewActive(false);
    setIsProfileSettingsPageActive(false);
    setActivePage('Account(s)');
  };

  const handleSelectUser = (user: User) => {
      setSelectedUser(user);
      setSelectedAccount(null);
      setIsSettingsViewActive(false);
      setIsProfileSettingsPageActive(false);
  };

  const handleBackToAccounts = () => {
    setSelectedAccount(null);
    setActivePage('Account(s)');
  };
  
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
    setIsAddingUser(false);
    showToast('User added (mock data)');
  };

  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    setUsers(prevUsers => 
        prevUsers.map(user => 
            user.id === userId ? { ...user, role: newRole } : user
        )
    );
    setUserToEdit(null);
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
      showToast('Dashboard deleted successfully.');
  };

  const handleSaveDashboard = (dashboardToSave: DashboardItem) => {
    if (dashboardToSave.id.startsWith('temp-')) {
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
        setDashboards(prev => [newDashboard, ...prev]);
        showToast('Dashboard created successfully!');
    } else {
        setDashboards(prev => prev.map(d => d.id === dashboardToSave.id ? dashboardToSave : d));
        showToast('Dashboard updated successfully!');
    }
    setEditingDashboard(null);
  };

  const handleUpdateUserProfile = (updatedUser: User) => {
    // Update the current user state
    setCurrentUser(updatedUser);
    // Also update the main users list to reflect changes elsewhere
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
    // In a real app, you'd clear session/token here
  };


  const renderContent = () => {
    switch (activePage) {
      case 'Data Cloud Overview':
        return <Overview onSelectAccount={handleSelectAccount} onSelectUser={handleSelectUser} accounts={accounts} users={users} onSetBigScreenWidget={setBigScreenWidget} />;
      case 'Dashboards':
        return editingDashboard ? (
            <DashboardEditor
                dashboard={editingDashboard === 'new' ? null : editingDashboard}
                onSave={handleSaveDashboard}
                onCancel={() => setEditingDashboard(null)}
                accounts={accounts}
            />
        ) : (
            <Dashboards
                dashboards={dashboards}
                onDeleteDashboardClick={(dashboard) => setDashboardToDelete(dashboard)}
                onAddDashboardClick={() => setEditingDashboard('new')}
                onEditDashboardClick={(dashboard) => setEditingDashboard(dashboard)}
            />
        );
      case 'Account(s)':
        return <Connections accounts={accounts} onSelectAccount={handleSelectAccount} onAddAccountClick={() => setIsAddingAccount(true)} onDeleteAccount={handleDeleteAccount} />;
      case 'AI Agent':
        return <AIAgent />;
      case 'Reports':
        return <Reports />;
      case 'Book a Demo':
        return <BookDemo />; 
      case 'Docs':
        return <Docs />;
      case 'Settings':
         // This case is now handled by the isSettingsViewActive flag, 
         // but we keep a placeholder for direct navigation logic if needed.
        return <Settings />;
      case 'Support':
        return <Support />;
      default:
        return <Connections accounts={accounts} onSelectAccount={handleSelectAccount} onAddAccountClick={() => setIsAddingAccount(true)} onDeleteAccount={handleDeleteAccount} />;
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
          />
      ) : (
        <>
          <Header 
            onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
            onLogoClick={handleLogoClick}
            isSidebarOpen={isSidebarOpen}
            brandLogo={brandLogo}
            onOpenProfileSettings={() => {
              setIsSidebarOpen(false);
              setSelectedAccount(null);
              setSelectedUser(null);
              setIsSettingsViewActive(false);
              setIsProfileSettingsPageActive(true);
            }}
            onLogout={handleLogout}
          />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                activePage={activePage}
                setActivePage={handlePageChange}
                activeSettingsSubPage={activeSettingsSubPage}
                showCompact={!isAccountView && !isSettingsViewActive && !isProfileSettingsPageActive}
            />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
              {selectedAccount ? (
                  <AccountView
                  account={selectedAccount}
                  accounts={accounts}
                  onBack={handleBackToAccounts}
                  onSwitchAccount={handleSelectAccount}
                  sqlFiles={sqlFiles}
                  onSaveQueryClick={() => setIsSavingQuery(true)}
                  />
              ) : selectedUser ? (
                  <UserView user={selectedUser} onBack={() => setSelectedUser(null)} />
              ) : isSettingsViewActive ? (
                <SettingsPage
                    users={users}
                    activeSubPage={activeSettingsSubPage}
                    onSubPageChange={setActiveSettingsSubPage}
                    onBack={() => {
                        setIsSettingsViewActive(false);
                        setActivePage('Data Cloud Overview');
                    }}
                    onAddUserClick={() => setIsAddingUser(true)}
                    onEditUserRoleClick={(user) => setUserToEdit(user)}
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
                  />
              ) : (
                  <div className={activePage === 'Dashboards' && editingDashboard ? '' : 'p-4'}>
                    {renderContent()}
                  </div>
              )}
            </main>
          </div>
        </>
      )}


      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      <SidePanel
        isOpen={isAddingAccount}
        onClose={handleCancelAddAccount}
        title="Connect Snowflake Account"
      >
        <AddAccountFlow
          onCancel={handleCancelAddAccount}
          onAddAccount={handleAddAccount}
        />
      </SidePanel>

      <SidePanel
        isOpen={isSavingQuery}
        onClose={handleCancelSaveQuery}
        title="Save Query Version"
      >
        <SaveQueryFlow 
          files={sqlFiles}
          onCancel={handleCancelSaveQuery}
          onSave={handleSaveQuery}
        />
      </SidePanel>
      
      <SidePanel
          isOpen={isAddingUser}
          onClose={() => setIsAddingUser(false)}
          title="Add User"
      >
          <InviteUserFlow
              onCancel={() => setIsAddingUser(false)}
              onAddUser={handleAddUser}
          />
      </SidePanel>

      <SidePanel
        isOpen={!!userToEdit}
        onClose={() => setUserToEdit(null)}
        title="Edit User Role"
      >
        {userToEdit && (
            <EditUserRoleFlow
                user={userToEdit}
                onCancel={() => setUserToEdit(null)}
                onSave={handleUpdateUserRole}
            />
        )}
      </SidePanel>
      
      {userToSuspend && (
          <ConfirmationModal
              isOpen={!!userToSuspend}
              onClose={() => setUserToSuspend(null)}
              onConfirm={() => handleSuspendUser(userToSuspend.id)}
              title="Suspend User"
              message={`Are you sure you want to suspend ${userToSuspend.name}? They will lose access to the platform.`}
              confirmText="Suspend"
              confirmVariant="warning"
          />
      )}

      {userToRemove && (
          <ConfirmationModal
              isOpen={!!userToRemove}
              onClose={() => setUserToRemove(null)}
              onConfirm={() => handleRemoveUser(userToRemove.id)}
              title="Remove User"
              message={`Are you sure you want to remove ${userToRemove.name}? This action cannot be undone.`}
              confirmText="Remove"
              confirmVariant="danger"
          />
      )}

      {userToActivate && (
          <ConfirmationModal
              isOpen={!!userToActivate}
              onClose={() => setUserToActivate(null)}
              onConfirm={() => handleConfirmActivateUser(userToActivate.id)}
              title="Activate User"
              message={`Are you sure you want to activate ${userToActivate.name}? They will regain access to the platform.`}
              confirmText="Activate"
              confirmVariant="primary"
          />
      )}

      {dashboardToDelete && (
          <ConfirmationModal
              isOpen={!!dashboardToDelete}
              onClose={() => setDashboardToDelete(null)}
              onConfirm={() => handleDeleteDashboard(dashboardToDelete.id)}
              title="Delete Dashboard"
              message={`Are you sure you want to delete the "${dashboardToDelete.title}" dashboard? This action cannot be undone.`}
              confirmText="Delete"
              confirmVariant="danger"
          />
      )}
    </div>
  );
};

export default App;
