
import React, { useEffect, useRef } from 'react';
import { IconClose } from '../constants';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onClose, title, children }) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const panel = panelRef.current;
    if (!isOpen || !panel) return;

    const focusableElements = panel.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
            onClose();
        }

        if (event.key === 'Tab') {
            if (focusableElements.length === 1) {
                event.preventDefault();
                return;
            }
            if (event.shiftKey) { // Shift+Tab
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    event.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    event.preventDefault();
                }
            }
        }
    };
    
    document.addEventListener('keydown', handleKeyDown);

    if (firstElement) {
      firstElement.focus();
    } else {
      panel.focus();
    }

    return () => {
        document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);


  return (
    <div 
        ref={panelRef}
        tabIndex={-1}
        className={`fixed inset-0 z-30 overflow-hidden transition-all duration-500 ${isOpen ? 'visible' : 'invisible'}`} 
        role="dialog" 
        aria-modal="true"
    >
      {/* Overlay */}
      <div 
        className={`fixed top-12 inset-x-0 bottom-0 bg-black/40 transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        aria-hidden="true"
        onClick={onClose}
      ></div>

      {/* Side Panel Container */}
      <div className={`fixed top-12 bottom-0 right-0 flex max-w-full pl-10 transform transition-transform duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="w-screen max-w-2xl">
          <div className="flex h-full flex-col bg-surface">
            {/* Header */}
            <div className="bg-background p-6 flex-shrink-0">
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
                    <IconClose className="h-6 w-6" />
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
