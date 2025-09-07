import React, { useEffect } from 'react';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onClose, title, children }) => {
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);


  return (
    <div 
        className={`fixed inset-0 z-30 overflow-hidden transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`} 
        role="dialog" 
        aria-modal="true"
    >
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden="true"
        onClick={onClose}
      ></div>

      {/* Side Panel Container */}
      <div className={`fixed inset-y-0 right-0 flex max-w-full pl-10 transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="w-screen max-w-2xl">
          <div className="flex h-full flex-col bg-surface shadow-2xl">
            {/* Header */}
            <div className="bg-background p-6 border-b border-border-color flex-shrink-0">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-semibold text-text-primary" id="slide-over-title">
                  {title}
                </h2>
                <div className="ml-3 flex h-7 items-center">
                  <button
                    type="button"
                    className="rounded-full bg-background text-text-secondary hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close panel</span>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Content */}
            <div className="relative flex-1 overflow-y-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;