import React from 'react';
import { AlertCircle, RefreshCw, XCircle } from 'lucide-react';

const ErrorMessage = ({ 
  message = 'Something went wrong', 
  onRetry = null,
  onDismiss = null,
  type = 'error' 
}) => {
  const styles = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-500',
      text: 'text-red-800',
      button: 'bg-red-100 hover:bg-red-200 text-red-700',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-500',
      text: 'text-yellow-800',
      button: 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-500',
      text: 'text-blue-800',
      button: 'bg-blue-100 hover:bg-blue-200 text-blue-700',
    },
  };

  const style = styles[type];

  return (
    <div className={`${style.bg} ${style.border} border rounded-lg p-4 animate-fade-in`}>
      <div className="flex items-start">
        <AlertCircle className={`${style.icon} w-5 h-5 mt-0.5 mr-3 flex-shrink-0`} />
        <div className="flex-1">
          <p className={`${style.text} text-sm font-medium`}>{message}</p>
          {(onRetry || onDismiss) && (
            <div className="mt-3 flex space-x-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className={`${style.button} inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors`}
                >
                  <RefreshCw className="w-4 h-4 mr-1.5" />
                  Try Again
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Dismiss
                </button>
              )}
            </div>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-3 text-gray-400 hover:text-gray-600"
          >
            <XCircle className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;