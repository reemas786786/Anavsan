import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Connections from './pages/Connections';
import AIAgent from './pages/AIAgent';
import Reports from './pages/Reports';
import BookDemo from './pages/BookDemo';
import Settings from './pages/Settings';
import Support from './pages/Support';
import Overview from './pages/Overview';
import AccountView from './pages/AccountView';
import SidePanel from './components/SidePanel';
import AddAccountFlow from './components/AddAccountFlow';
import SaveQueryFlow from './components/SaveQueryFlow';
import Toast from './components/Toast';
import { Page, Account, SQLFile } from './types';
import { connectionsData, sqlFilesData as initialSqlFiles } from './data/dummyData';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('Overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [isSavingQuery, setIsSavingQuery] = useState(false);
  const [sqlFiles, setSqlFiles] = useState<SQLFile[]>(initialSqlFiles);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const sidebarRef = useRef<HTMLElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (accounts.length === 0 && !isAddingAccount) {
        setAccounts(connectionsData);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Node;
        if (
            !isSidebarCollapsed &&
            sidebarRef.current &&
            !sidebarRef.current.contains(target) &&
            toggleButtonRef.current &&
            !toggleButtonRef.current.contains(target)
        ) {
            setIsSidebarCollapsed(true);
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSidebarCollapsed]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
        setToastMessage(null);
    }, 3000);
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
  };

  const handleBackToConnections = () => {
    setSelectedAccount(null);
    setActivePage('Connections');
  };

  const renderContent = () => {
    switch (activePage) {
      case 'Overview':
        return <Overview onSelectAccount={handleSelectAccount} accounts={accounts} />;
      case 'Dashboard':
        return <Dashboard />;
      case 'Connections':
        return <Connections accounts={accounts} onSelectAccount={handleSelectAccount} onAddAccountClick={() => setIsAddingAccount(true)} onDeleteAccount={handleDeleteAccount} />;
      case 'AI Agent':
        return <AIAgent />;
      case 'Reports':
        return <Reports />;
      case 'Book a Demo':
        return <BookDemo />; 
      case 'Settings':
        return <Settings />;
      case 'Support':
        return <Support />;
      default:
        return <Connections accounts={accounts} onSelectAccount={handleSelectAccount} onAddAccountClick={() => setIsAddingAccount(true)} onDeleteAccount={handleDeleteAccount} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background font-sans">
      <Header 
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        toggleButtonRef={toggleButtonRef}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          activePage={activePage} 
          setActivePage={(page) => {
            setActivePage(page);
            setSelectedAccount(null);
          }}
          isCollapsed={isSidebarCollapsed}
          isHidden={!!selectedAccount}
          collapseSidebar={() => setIsSidebarCollapsed(true)}
          ref={sidebarRef}
        />
        <main className={`flex-1 overflow-x-hidden overflow-y-auto bg-background transition-all duration-300 ease-in-out ${selectedAccount ? 'ml-0' : 'ml-12'}`}>
          {selectedAccount ? (
            <AccountView
              account={selectedAccount}
              accounts={accounts}
              onBack={handleBackToConnections}
              onSwitchAccount={handleSelectAccount}
              sqlFiles={sqlFiles}
              onSaveQueryClick={() => setIsSavingQuery(true)}
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
    </div>
  );
};

export default App;