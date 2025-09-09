
import React, { useEffect } from 'react';
import { IconClose, IconExclamationTriangle } from '../constants';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  confirmVariant?: 'danger' | 'warning' | 'primary';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', confirmVariant = 'primary' }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const variantClasses = {
    primary: 'bg-primary hover:bg-primary-hover focus:ring-primary',
    warning: 'bg-status-warning hover:bg-status-warning/90 focus:ring-status-warning',
    danger: 'bg-status-error hover:bg-status-error/90 focus:ring-status-error',
  };

  const iconBgClasses = {
      primary: 'bg-status-info-light',
      warning: 'bg-status-warning-light',
      danger: 'bg-status-error-light',
  }

  const iconClasses = {
      primary: 'text-status-info',
      warning: 'text-status-warning',
      danger: 'text-status-error',
  }
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-surface rounded-xl shadow-xl w-full max-w-md m-4 p-6 text-center transform transition-all duration-300 ease-in-out scale-100">
        <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${iconBgClasses[confirmVariant]} mb-4`}>
          <IconExclamationTriangle className={`h-6 w-6 ${iconClasses[confirmVariant]}`} aria-hidden="true" />
        </div>

        <h3 id="modal-title" className="text-lg font-semibold text-text-primary">{title}</h3>
        <div className="mt-2">
            <p className="text-sm text-text-secondary">{message}</p>
        </div>
        
        <div className="mt-6 flex justify-center gap-4">
          <button 
            type="button"
            onClick={onClose} 
            className="px-4 py-2 text-sm font-semibold rounded-full border border-border-color hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={onConfirm} 
            className={`px-4 py-2 text-sm font-semibold text-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${variantClasses[confirmVariant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;