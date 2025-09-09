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
import SidePanel from './components/SidePanel';
import AddAccountFlow from './components/AddAccountFlow';
import SaveQueryFlow from './components/SaveQueryFlow';
import InviteUserFlow from './components/InviteUserFlow';
import Toast from './components/Toast';
import { Page, Account, SQLFile, UserRole, User, UserStatus } from './types';
import { connectionsData, sqlFilesData as initialSqlFiles, usersData } from './data/dummyData';
import SettingsPage from './pages/SettingsPage';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [isSavingQuery, setIsSavingQuery] = useState(false);
  const [sqlFiles, setSqlFiles] = useState<SQLFile[]>(initialSqlFiles);
  const [users, setUsers] = useState<User[]>(usersData);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [isSettingsViewActive, setIsSettingsViewActive] = useState(false);
  const [activeSettingsSubPage, setActiveSettingsSubPage] = useState('User Management');
  
  const [isInvitingUser, setIsInvitingUser] = useState(false);


  useEffect(() => {
    if (accounts.length === 0 && !isAddingAccount) {
        setAccounts(connectionsData);
    }
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
        setToastMessage(null);
    }, 3000);
  };

  const handlePageChange = (page: Page, subPage?: string) => {
    setActivePage(page);
    setSelectedAccount(null);
    
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
    setActivePage('Dashboard');
    setSelectedAccount(null);
    setIsSettingsViewActive(false);
    setIsSidebarOpen(false);
  };

  const handleAddAccount = () => {
    const newAccount: Account = {
      id: `new-${Date.now()}`,
      name: `New Account #${accounts.length + 1}`,
      identifier: `xyz${Math.floor(Math.random() * 1000)}.eu-west-1`,
      role: 'ANALYST',
      status: 'Syncing',
      lastSynced: 'Just now',
    };
    setAccounts(prevAccounts => [...prevAccounts, newAccount]);
    setIsAddingAccount(false);
    showToast("Account added successfully!");
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
    setIsSettingsViewActive(false);
  };

  const handleBackToConnections = () => {
    setSelectedAccount(null);
    setActivePage('Connections');
  };
  
  const handleSendInvite = (data: { email: string; role: UserRole; }) => {
    const newUser: User = {
        id: `user-${Date.now()}`,
        name: data.email.split('@')[0] || 'New User',
        email: data.email,
        role: data.role,
        status: 'Invited',
    };
    
    setUsers(prevUsers => [newUser, ...prevUsers]);
    setIsInvitingUser(false);
    showToast('Invitation sent successfully!');

    // Dummy behavior: auto-activate after 5 seconds
    setTimeout(() => {
        setUsers(prevUsers => 
            prevUsers.map(user => 
                user.id === newUser.id ? { ...user, status: 'Active' as UserStatus } : user
            )
        );
        showToast(`User ${data.email} is now active.`);
    }, 5000);
  };

  const renderContent = () => {
    switch (activePage) {
      case 'Dashboard':
        return <Overview onSelectAccount={handleSelectAccount} accounts={accounts} />;
      case 'Connections':
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
  
  const isAccountView = !!selectedAccount;

  return (
    <div className="h-screen bg-background font-sans flex flex-col">
      <Header 
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        onLogoClick={handleLogoClick}
        isSidebarOpen={isSidebarOpen}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            activePage={activePage}
            setActivePage={handlePageChange}
            activeSettingsSubPage={activeSettingsSubPage}
            showCompact={!isAccountView && !isSettingsViewActive}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background">
          {selectedAccount ? (
              <AccountView
              account={selectedAccount}
              accounts={accounts}
              onBack={handleBackToConnections}
              onSwitchAccount={handleSelectAccount}
              sqlFiles={sqlFiles}
              onSaveQueryClick={() => setIsSavingQuery(true)}
              />
          ) : isSettingsViewActive ? (
            <SettingsPage
                users={users}
                activeSubPage={activeSettingsSubPage}
                onSubPageChange={setActiveSettingsSubPage}
                onBack={() => {
                    setIsSettingsViewActive(false);
                    setActivePage('Dashboard');
                }}
                onAddUserClick={() => setIsInvitingUser(true)}
            />
          ) : (
              <div className="p-6">
              {renderContent()}
              </div>
          )}
        </main>
      </div>


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
        isOpen={isInvitingUser}
        onClose={() => setIsInvitingUser(false)}
        title="Invite New User"
      >
        <InviteUserFlow
            onCancel={() => setIsInvitingUser(false)}
            onSendInvite={handleSendInvite}
        />
      </SidePanel>
    </div>
  );
};

export default App;