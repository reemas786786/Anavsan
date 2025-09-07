
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './pages/Overview';
import Dashboard from './pages/Dashboard';
import Connections from './pages/Connections';
import AIAgent from './pages/AIAgent';
import Reports from './pages/Reports';
import BookDemo from './pages/BookDemo';
import Settings from './pages/Settings';
import Support from './pages/Support';
import { Page } from './types';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('Overview');

  const renderContent = () => {
    switch (activePage) {
      case 'Overview':
        return <Overview />;
      case 'Dashboard':
        return <Dashboard />;
      case 'Connections':
        return <Connections />;
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
        return <Overview />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-900 font-sans">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-900 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
