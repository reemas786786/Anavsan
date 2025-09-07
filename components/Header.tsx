import React from 'react';
import { IconMenu, IconAIAgent, IconSupport, IconUser, IconSearch, IconBell } from '../constants';

const AnavsanLogo: React.FC<{}> = () => (
    <div className="flex items-center" title="Anavsan">
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


interface HeaderProps {
    isSidebarCollapsed: boolean;
    toggleSidebar: () => void;
    toggleButtonRef: React.RefObject<HTMLButtonElement>;
}

const Header: React.FC<HeaderProps> = ({ isSidebarCollapsed, toggleSidebar, toggleButtonRef }) => {
  return (
    <header className="bg-sidebar-topbar px-4 py-2 flex items-center justify-between flex-shrink-0 h-12 z-30">
      <div className="flex items-center">
        <button ref={toggleButtonRef} onClick={toggleSidebar} className="p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors mr-2">
          <IconMenu className="h-6 w-6" />
        </button>
        <AnavsanLogo />
      </div>
      
      <div className="flex items-center space-x-1">
        <div className="relative flex-1 max-w-lg mr-2">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <IconSearch className="h-5 w-5 text-text-muted" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full bg-white/20 border-0 text-white rounded-full py-2 pl-11 pr-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-sidebar-topbar"
            />
        </div>
        <button className="p-2 rounded-full text-primary bg-primary/20 hover:bg-primary/30 transition-colors">
            <IconAIAgent className="h-5 w-5" />
        </button>
        <button className="p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
          <IconBell className="h-5 w-5" />
        </button>
        <button className="p-2 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
          <IconSupport className="h-5 w-5" />
        </button>

        <div className="flex items-center pl-2">
            <button className="rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-sidebar-topbar focus:ring-primary transition-colors">
                <IconUser className="w-9 h-9" />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;