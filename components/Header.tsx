import React from 'react';
import { IconMenu } from '../constants';

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

const IconWandFilled: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clipRule="evenodd" />
      <path d="M5.26 17.242a.75.75 0 10-1.06-1.06l1.5-1.5a.75.75 0 101.06 1.06l-1.5 1.5zm8.25-8.25a.75.75 0 10-1.06-1.06l-1.5 1.5a.75.75 0 101.06 1.06l1.5-1.5zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z" />
    </svg>
);


const AnavsanLogo: React.FC<{}> = () => (
    <div className="flex items-center gap-3">
      <div className="bg-primary p-2 rounded-lg flex items-center justify-center">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M2 7L12 12L22 7" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M12 22V12" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
        </svg>
      </div>
      <h1 className="text-xl font-bold text-white tracking-wider">ANAVSAN</h1>
    </div>
);


interface HeaderProps {
    isSidebarCollapsed: boolean;
    toggleSidebar: () => void;
    showToggleButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isSidebarCollapsed, toggleSidebar, showToggleButton = true }) => {
  return (
    <header className="bg-sidebar-topbar p-4 flex items-center justify-between flex-shrink-0 h-16 z-30">
      <div className="flex items-center">
        {showToggleButton && (
          <button onClick={toggleSidebar} className="p-2.5 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors mr-4">
            <IconMenu className="h-6 w-6" />
          </button>
        )}
        <AnavsanLogo />
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-lg mr-4">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <IconSearch className="h-5 w-5 text-text-muted" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              className="block w-full bg-white/20 border-0 text-white rounded-full py-2.5 pl-11 pr-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-sidebar-topbar shadow-sm"
            />
        </div>
        <button className="p-2.5 rounded-full text-primary hover:bg-primary/10 transition-colors">
            <IconWandFilled className="h-6 w-6" />
        </button>
        <button className="p-2.5 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
          <IconBell className="h-6 w-6" />
        </button>
        <button className="p-2.5 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
          <IconQuestionMark className="h-6 w-6" />
        </button>
        <div className="flex items-center pl-2">
            <img src="https://i.pravatar.cc/40?u=a042581f4e29026704d" alt="User Avatar" className="w-9 h-9 rounded-full" />
        </div>
      </div>
    </header>
  );
};

export default Header;