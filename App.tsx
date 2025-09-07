import React, { useState, useEffect } from 'react';
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  
  // Simulate first-time user experience
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isAddingAccount, setIsAddingAccount] = useState(false);

  useEffect(() => {
    // If there are no accounts after an initial check, prompt the user to add one.
    if (accounts.length === 0) {
      setIsAddingAccount(true);
    } else {
      setIsAddingAccount(false);
    }
  }, [accounts]);

  const handleAddAccount = () => {
    // In a real app, this would come from the form.
    // Here, we'll just populate with dummy data.
    setAccounts(connectionsData);
    setIsAddingAccount(false);
  };
  
  const handleCancelAddAccount = () => {
    // Only allow canceling if there are existing accounts.
    if (accounts.length > 0) {
      setIsAddingAccount(false);
    }
  };

  const handleSelectAccount = (account: Account) => {
    setSelectedAccount(account);
  };

  const handleBackToConnections = () => {
    setSelectedAccount(null);
    setActivePage('Connections');
  };

  const renderContent = () => {
    if (selectedAccount) {
      return <AccountView account={selectedAccount} onBack={handleBackToConnections} />;
    }
    
    switch (activePage) {
      case 'Overview':
        return <Overview />;
      case 'Dashboard':
        return <Dashboard />;
      case 'Connections':
        return <Connections accounts={accounts} onSelectAccount={handleSelectAccount} onAddAccountClick={() => setIsAddingAccount(true)} />;
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
        return <Connections accounts={accounts} onSelectAccount={handleSelectAccount} onAddAccountClick={() => setIsAddingAccount(true)} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background font-sans">
      <Header 
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          activePage={activePage} 
          setActivePage={setActivePage}
          isCollapsed={isSidebarCollapsed}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4">
          {renderContent()}
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