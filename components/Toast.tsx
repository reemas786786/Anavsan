import React, { useEffect, useState } from 'react';
import { IconCheckCircle, IconClose, IconExclamationTriangle } from '../constants';

interface ToastProps {
  toast: { message: string, type: 'success' | 'error' } | null;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (toast) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 2800); // Start fade out before onClose is called
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!toast) return null;

  const isError = toast.type === 'error';
  const bgColor = isError ? 'bg-status-error' : 'bg-status-success';
  const iconColor = isError ? 'text-status-error' : 'text-status-success';
  const Icon = isError ? IconExclamationTriangle : IconCheckCircle;

  return (
    <div
      className={`fixed top-5 right-5 z-50 transform transition-all duration-300 ease-in-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
      }`}
    >
      <div className={`${bgColor} text-white rounded-full shadow-lg flex items-center p-1 pr-3`}>
        <div className="bg-white rounded-full p-1 mr-2 flex-shrink-0">
            <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <p className="text-sm font-medium">{toast.message}</p>
        <button onClick={onClose} className="ml-4 p-1 rounded-full text-white/70 hover:text-white hover:bg-white/20">
          <IconClose className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
