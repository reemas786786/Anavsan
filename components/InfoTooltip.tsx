
import React from 'react';
import { IconInfo } from '../constants';

interface InfoTooltipProps {
    text: string;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ text }) => {
    const id = `tooltip-${React.useId()}`;
    return (
        <div className="relative group flex items-center">
            <button
                tabIndex={0}
                className="ml-1.5 text-text-muted hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-full"
                aria-describedby={id}
                aria-label="More information"
            >
                <IconInfo className="h-4 w-4" />
            </button>
            <div
                id={id}
                role="tooltip"
                className="absolute bottom-full mb-2 w-64 bg-sidebar-topbar text-white text-xs rounded-lg py-2 px-3 z-20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none left-0"
            >
                {text}
                <div className="absolute top-full left-2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-sidebar-topbar"></div>
            </div>
        </div>
    );
};

export default InfoTooltip;