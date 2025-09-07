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
import { Page, Account } from './types';
import { connectionsData } from './data/dummyData';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('Connections');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isAddingAccount, setIsAddingAccount] = useState(false);

  const sidebarRef = useRef<HTMLElement>(null);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (accounts.length === 0 && !isAddingAccount) {
        // Initially load dummy data if accounts are empty
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
  };
  
  const handleDeleteAccount = (accountId: string) => {
    setAccounts(prevAccounts => prevAccounts.filter(acc => acc.id !== accountId));
  };
  
  const handleCancelAddAccount = () => {
    setIsAddingAccount(false);
  };

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
        return <Overview />;
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
          isHidden={!!selectedAccount && isSidebarCollapsed}
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
            />
          ) : (
             <div className="p-6">
              {renderContent()}
            </div>
          )}
        </main>
      </div>

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
    </div>
  );
};

export default App;