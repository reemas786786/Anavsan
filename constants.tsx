import React from 'react';
import { NavItem } from './types';

// Carbon Design System Icons (viewBox="0 0 32 32")

export const IconLayoutGrid: React.FC<{ className?: string }> = ({ className }) => ( // Dashboard
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32">
        <path d="M12 4H6a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V6a2 2 0 00-2-2zM26 4h-6a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V6a2 2 0 00-2-2zM12 18H6a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2v-6a2 2 0 00-2-2zM26 18h-6a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2v-6a2 2 0 00-2-2z"/>
    </svg>
);
export const IconBarChart: React.FC<{ className?: string }> = ({ className }) => ( // Analytics
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32">
        <path d="M4 2H2v26a2 2 0 002 2h26v-2H4zM30 9L22 17l-6-6-8 8 1.414 1.414L16 11.828l6 6L28.586 10.414z"/>
    </svg>
);
export const IconLink: React.FC<{ className?: string }> = ({ className }) => ( // Connect
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32">
        <path d="M14 19a4 4 0 11-4 4 4 4 0 014-4m0-2a6 6 0 106 6 6 6 0 00-6-6zM27 8a4 4 0 11-4 4 4 4 0 014-4m0-2a6 6 0 106 6 6 6 0 00-6-6zM10 12a2 2 0 11-2 2 2 2 0 012-2m0-2a4 4 0 104 4 4 4 0 00-4-4zM23 21a2 2 0 11-2 2 2 2 0 012-2m0-2a4 4 0 104 4 4 4 0 00-4-4zM25 15.59l-11.59 4.82L15.59 25 20 22.82 25 25z"/>
    </svg>
);
export const IconWand: React.FC<{ className?: string }> = ({ className }) => ( // Magic Wand
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32">
        <path d="M11 25.434V22h2v3.434a4.505 4.505 0 01-2 0zM12 3a2 2 0 102 2 2 2 0 00-2-2zM5.5 8a1.5 1.5 0 101.5 1.5A1.5 1.5 0 005.5 8zM2 13a2 2 0 102 2 2 2 0 00-2-2zM5.5 18a1.5 1.5 0 101.5 1.5A1.5 1.5 0 005.5 18zM19 8a2 2 0 102 2 2 2 0 00-2-2zM24.5 12a1.5 1.5 0 101.5 1.5A1.5 1.5 0 0024.5 12zM21 21.43V18h-2v3.43a4.504 4.504 0 012 0zM19 28a2 2 0 102 2 2 2 0 00-2-2zM12 8a4 4 0 114 4 4 4 0 01-4-4zm0 12a4 4 0 11-4-4 4 4 0 014 4z"/>
    </svg>
);
export const IconFileText: React.FC<{ className?: string }> = ({ className }) => ( // Report
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32">
        <path d="M27 10H5a1 1 0 010-2h22a1 1 0 010 2zM27 17H5a1 1 0 010-2h22a1 1 0 010 2zM27 24H5a1 1 0 010-2h22a1 1 0 010 2z"/><path d="M29 4H3a1 1 0 00-1 1V27a1 1 0 001 1H29a1 1 0 001-1V5a1 1 0 00-1-4zM3 26V6H29V26z"/>
    </svg>
);
export const IconCalendar: React.FC<{ className?: string }> = ({ className }) => ( // Calendar
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32">
        <path d="M26 6h-4V4h-2v2h-8V4h-2v2H6a2 2 0 00-2 2v16a2 2 0 002 2h20a2 2 0 002-2V8a2 2 0 00-2-2zm0 18H6V8h4v2h2V8h8v2h2V8h4z"/>
    </svg>
);
export const IconCog: React.FC<{ className?: string }> = ({ className }) => ( // Settings
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32">
        <path d="M28.9 18.21l-2.43-1.4a1 1 0 01-.47-1.35l.82-2.92a1 1 0 00-.59-1.15l-2.92-.82a1 1 0 01-1.15-.59l-1.4-2.43a1 1 0 00-1.74 0l-1.4 2.43a1 1 0 01-1.15.59l-2.92.82a1 1 0 00-.59 1.15l.82 2.92a1 1 0 01-.47 1.35l-2.43 1.4a1 1 0 000 1.74l2.43 1.4a1 1 0 01.47 1.35l-.82 2.92a1 1 0 00.59 1.15l2.92.82a1 1 0 011.15.59l1.4 2.43a1 1 0 001.74 0l1.4-2.43a1 1 0 011.15-.59l2.92-.82a1 1 0 00.59-1.15l-.82-2.92a1 1 0 01.47-1.35l2.43-1.4a1 1 0 000-1.74zM16 22a6 6 0 116-6 6 6 0 01-6 6z"/>
    </svg>
);
export const IconQuestionMarkCircle: React.FC<{ className?: string }> = ({ className }) => ( // Help
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32">
        <path d="M16 2a14 14 0 1014 14A14 14 0 0016 2zm0 26a12 12 0 1112-12 12 12 0 01-12 12z"/><path d="M15 20h2v2h-2zM15 8h2v10h-2z"/>
    </svg>
);
export const IconMenu: React.FC<{ className?: string }> = ({ className }) => ( // Menu
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32">
        <path d="M4 6h24v2H4zM4 15h24v2H4zM4 24h24v2H4z"/>
    </svg>
);
export const IconDotsVertical: React.FC<{ className?: string }> = ({ className }) => ( // OverflowMenuVertical
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32">
        <circle cx="16" cy="8" r="2"/><circle cx="16" cy="16" r="2"/><circle cx="16" cy="24" r="2"/>
    </svg>
);
export const IconChevronDown: React.FC<{ className?: string }> = ({ className }) => ( // ChevronDown
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32">
        <path d="M16 22L6 12l1.4-1.4 8.6 8.6 8.6-8.6L26 12z"/>
    </svg>
);
export const IconArrowPath: React.FC<{ className?: string }> = ({ className }) => ( // Renew
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32">
        <path d="M25.5 14a1 1 0 01-1-1 10.49 10.49 0 00-19.12 4H7.5a1 1 0 010 2h-4a1 1 0 01-1-1v-4a1 1 0 012 0v1.44A12.5 12.5 0 0126.5 13a1 1 0 01-1 1zM3.5 18a1 1 0 011 1 10.49 10.49 0 0019.12-4H24.5a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0v-1.44A12.5 12.5 0 015.5 19a1 1 0 01-1-1z"/>
    </svg>
);
export const IconSparkles: React.FC<{ className?: string }> = ({ className }) => ( // MagicWandFilled
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32">
        <path d="M13 3a1 1 0 10-1-1 1 1 0 001 1zM7 8a1 1 0 10-1-1 1 1 0 001 1zM19 8a1 1 0 10-1-1 1 1 0 001 1zM4 14a1 1 0 10-1-1 1 1 0 001 1zM11.45 20.44L8.29 17.28a1 1 0 00-1.41 1.41L10 21.83V28a1 1 0 002 0v-6.17l3.12-3.13a1 1 0 00-1.41-1.41zM22 14a1 1 0 10-1-1 1 1 0 001 1zM17 10a4 4 0 10-4-4 4 4 0 004 4zM17 22a4 4 0 10-4-4 4 4 0 004 4z"/>
    </svg>
);
export const IconLifebuoy: React.FC<{ className?: string }> = ({ className }) => ( // HelpFilled
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32">
        <path d="M16 2a14 14 0 1014 14A14 14 0 0016 2zm-1 21h2v-2h-2zm1-4a3.91 3.91 0 01-4-4 3.42 3.42 0 011-2.45V13a1 1 0 012 0v1.1a2 2 0 102 2 1 1 0 01-2 0v-3a1 1 0 012 0 1.5 1.5 0 01-1.5 1.5.5.5 0 00-.5.5v1.45A3.91 3.91 0 0116 19z"/>
    </svg>
);
export const IconUserCircle: React.FC<{ className?: string }> = ({ className }) => ( // UserAvatarFilled
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32">
        <path d="M16 2a14 14 0 1014 14A14 14 0 0016 2zm0 4a5 5 0 11-5 5 5 5 0 015-5zm8 14.41a11.94 11.94 0 01-16 0V20a1 1 0 011-1h14a1 1 0 011 1z"/>
    </svg>
);
export const IconSearch: React.FC<{ className?: string }> = ({ className }) => ( // Search
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32">
      <path d="M29 27.586l-7.55-7.55A11.93 11.93 0 0023 13a12 12 0 10-12 12 11.93 11.93 0 008.036-1.55l7.55 7.55zM5 13a8 8 0 118 8 8 8 0 01-8-8z"/>
    </svg>
);
export const IconBell: React.FC<{ className?: string }> = ({ className }) => ( // Notification
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32">
        <path d="M28.7 20.3l-2-3.46a1 1 0 00-1.37-.37L20 19.34V12a8 8 0 00-16 0v7.34l-5.33-2.87a1 1 0 00-1.37.37l-2 3.46a1 1 0 00.37 1.37L10 26.13V28h2v-1.87l4.67-2.52a1 1 0 00.37-1.37zM4 12a6 6 0 0112 0v8.4l-6 3.25-6-3.25z"/>
    </svg>
);
export const IconEye: React.FC<{ className?: string }> = ({ className }) => ( // View
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32">
        <path d="M30.94 15.66A16.69 16.69 0 0016 6 16.69 16.69 0 001.06 15.66a1 1 0 000 .68A16.69 16.69 0 0016 26a16.69 16.69 0 0014.94-9.66a1 1 0 000-.68zM16 24a8 8 0 118-8 8 8 0 01-8 8z"/><path d="M16 12a4 4 0 11-4 4 4 4 0 014-4z"/>
    </svg>
);
export const IconPencil: React.FC<{ className?: string }> = ({ className }) => ( // Edit
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32">
        <path d="M2 26h28v2H2zM25.4 9.4l-2.8-2.8a1 1 0 00-1.4 0l-12 12a1 1 0 00-.3.7v4a1 1 0 001 1h4a1 1 0 00.7-.3l12-12a1 1 0 000-1.4zM10.4 22H8v-2.4l10-10L20.4 12z"/>
    </svg>
);
export const IconTrash: React.FC<{ className?: string }> = ({ className }) => ( // TrashCan
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32">
        <path d="M12 4h8v2h-8zM10 28H6a2 2 0 01-2-2V8h2v18h4z"/><path d="M26 8h-4l-2-2h-8l-2 2h-4v2h20z"/>
    </svg>
);
export const IconAdd: React.FC<{ className?: string }> = ({ className }) => ( // Add
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32">
        <path d="M17 15V8h-2v7H8v2h7v7h2v-7h7v-2z"/>
    </svg>
);
export const IconClose: React.FC<{ className?: string }> = ({ className }) => ( // Close
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32">
        <path d="M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4z"/>
    </svg>
);


// These are unused but kept for reference or potential future use
export const IconRocketLaunch: React.FC<{ className?: string }> = ({ className }) => ( // MagicWand
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor">
    <path d="M11 25.434V22h2v3.434a4.505 4.505 0 01-2 0zM12 3a2 2 0 102 2 2 2 0 00-2-2zM5.5 8a1.5 1.5 0 101.5 1.5A1.5 1.5 0 005.5 8zM2 13a2 2 0 102 2 2 2 0 00-2-2zM5.5 18a1.5 1.5 0 101.5 1.5A1.5 1.5 0 005.5 18zM19 8a2 2 0 102 2 2 2 0 00-2-2zM24.5 12a1.5 1.5 0 101.5 1.5A1.5 1.5 0 0024.5 12zM21 21.43V18h-2v3.43a4.504 4.504 0 012 0zM19 28a2 2 0 102 2 2 2 0 00-2-2zM12 8a4 4 0 114 4 4 4 0 01-4-4zm0 12a4 4 0 11-4-4 4 4 0 014 4z"/>
  </svg>
);
export const IconArrowsPointingOut: React.FC<{ className?: string }> = ({ className }) => ( // Launch
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32">
        <path d="M26 24v4H6V6h12V4H6a2 2 0 00-2 2v20a2 2 0 002 2h20a2 2 0 002-2v-8h-2zM28 2h-8v2h4.59L12 16.59 13.41 18 26 5.41V10h2z"/>
    </svg>
);


export const NAV_ITEMS_MAIN: NavItem[] = [
    { name: 'Overview', icon: IconBarChart },
    { name: 'Dashboard', icon: IconLayoutGrid },
    { name: 'Connections', icon: IconLink },
    { name: 'AI Agent', icon: IconWand },
    { name: 'Reports', icon: IconFileText },
];

export const NAV_ITEMS_BOTTOM: NavItem[] = [
    { name: 'Book a Demo', icon: IconCalendar },
    { name: 'Settings', icon: IconCog },
    { name: 'Support', icon: IconQuestionMarkCircle },
];
