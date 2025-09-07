import React from 'react';
import { IconMenu, IconRocketLaunch, IconArrowPath, IconArrowsPointingOut } from '../constants';

const IconSearch: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
    </svg>
);

const IconBell: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
    </svg>
);

const IconQuestionMark: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

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
}

const Header: React.FC<HeaderProps> = ({ isSidebarCollapsed, toggleSidebar }) => {
  return (
    <header className="bg-sidebar-topbar p-4 flex items-center justify-between flex-shrink-0 h-16 z-30">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="p-2.5 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors mr-4">
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
              className="block w-full bg-white/10 border-0 text-white rounded-md py-2 pl-11 pr-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-sidebar-topbar"
            />
        </div>
        <button className="p-2.5 rounded-md text-primary bg-primary/20 hover:bg-primary/30 transition-colors">
            <IconRocketLaunch className="h-5 w-5" />
        </button>
        <button className="p-2.5 rounded-md text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
          <IconBell className="h-5 w-5" />
        </button>
        <button className="p-2.5 rounded-md text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
          <IconQuestionMark className="h-5 w-5" />
        </button>

        <div className="border-l border-white/10 mx-2 h-6"></div>
        
        <button className="p-2.5 rounded-md text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
          <IconArrowPath className="h-5 w-5" />
        </button>
        <button className="p-2.5 rounded-md text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
          <IconArrowsPointingOut className="h-5 w-5" />
        </button>

        <div className="flex items-center pl-2">
            <img src="https://i.pravatar.cc/40?u=a042581f4e29026704d" alt="User Avatar" className="w-9 h-9 rounded-full" />
        </div>
      </div>
    </header>
  );
};

export default Header;