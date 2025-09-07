
import React from 'react';
import { IconSparkles } from '../constants';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 p-4 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center">
        {/* Hamburger menu icon could go here */}
      </div>
      
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search queries, warehouses, or reports..."
            className="block w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 pl-10 pr-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-violet-500 focus:border-violet-500"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-slate-700 transition-colors">
          <IconSparkles className="h-5 w-5 text-slate-400" />
        </button>
        <button className="p-2 rounded-full hover:bg-slate-700 transition-colors relative">
          <svg className="h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-slate-800"></span>
        </button>
        <div className="flex items-center">
            <img src="https://picsum.photos/seed/user/40/40" alt="User Avatar" className="w-8 h-8 rounded-full" />
        </div>
      </div>
    </header>
  );
};

export default Header;
