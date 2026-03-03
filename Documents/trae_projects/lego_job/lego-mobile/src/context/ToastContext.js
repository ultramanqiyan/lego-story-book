import React, { createContext, useContext, useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { COLORS } from '../utils/constants';
import logger from '../utils/logger';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    logger.debug('TOAST', `[${type.toUpperCase()}] ${message}`);
    setToast({ message, type, visible: true });

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    timerRef.current = setTimeout(() => {
      setToast((prev) => (prev ? { ...prev, visible: false } : null));
    }, duration);
  }, []);

  const hideToast = useCallback(() => {
    logger.debug('TOAST', 'Toast hidden');
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setToast((prev) => (prev ? { ...prev, visible: false } : null));
  }, []);

  const success = useCallback((message, duration) => {
    showToast(message, 'success', duration);
  }, [showToast]);

  const error = useCallback((message, duration) => {
    showToast(message, 'error', duration);
  }, [showToast]);

  const warning = useCallback((message, duration) => {
    showToast(message, 'warning', duration);
  }, [showToast]);

  const info = useCallback((message, duration) => {
    showToast(message, 'info', duration);
  }, [showToast]);

  const value = useMemo(() => ({
    toast,
    showToast,
    hideToast,
    success,
    error,
    warning,
    info,
  }), [toast, showToast, hideToast, success, error, warning, info]);

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const getToastColor = (type) => {
  switch (type) {
    case 'success':
      return COLORS.success;
    case 'error':
      return COLORS.error;
    case 'warning':
      return COLORS.warning;
    case 'info':
    default:
      return COLORS.info;
  }
};

export default ToastContext;
