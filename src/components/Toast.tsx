import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const baseClasses = "fixed z-50 top-4 right-4 px-6 py-3 rounded-lg shadow-xl text-white font-medium transform transition-all duration-300 flex items-center";
  const typeClasses = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-blue-600'
  }[type];

  const icons = {
    success: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }[type];

  const visibilityClasses = isVisible 
    ? "translate-y-0 opacity-100" 
    : "-translate-y-4 opacity-0";

  return (
    <div className={`${baseClasses} ${typeClasses} ${visibilityClasses}`}>
      {icons}
      <span className="text-sm">{message}</span>
    </div>
  );
};

type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

type ToastCallback = (toast: ToastMessage) => void;

class ToastManagerClass {
  private subscribers: ToastCallback[] = [];
  private counter = 0;

  subscribe(callback: ToastCallback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  show(options: ToastOptions) {
    const toast: ToastMessage = {
      id: ++this.counter,
      message: options.message,
      type: options.type || 'info',
      duration: options.duration || 3000
    };

    this.subscribers.forEach(callback => callback(toast));
  }
}

export const ToastManager = new ToastManagerClass();
