import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const StatusNotificationBar = ({ 
  type = 'info', 
  message = '', 
  isVisible = false, 
  onDismiss = null,
  autoHide = false,
  autoHideDelay = 5000,
  actionLabel = null,
  onAction = null
}) => {
  const [isShown, setIsShown] = useState(isVisible);

  useEffect(() => {
    setIsShown(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (autoHide && isShown) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [autoHide, isShown, autoHideDelay]);

  const handleDismiss = () => {
    setIsShown(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  const getNotificationConfig = (type) => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-success/10',
          borderColor: 'border-success/20',
          textColor: 'text-success-foreground',
          icon: 'CheckCircle',
          iconColor: 'text-success'
        };
      case 'warning':
        return {
          bgColor: 'bg-warning/10',
          borderColor: 'border-warning/20',
          textColor: 'text-warning-foreground',
          icon: 'AlertTriangle',
          iconColor: 'text-warning'
        };
      case 'error':
        return {
          bgColor: 'bg-error/10',
          borderColor: 'border-error/20',
          textColor: 'text-error-foreground',
          icon: 'AlertCircle',
          iconColor: 'text-error'
        };
      case 'loading':
        return {
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/20',
          textColor: 'text-primary-foreground',
          icon: 'Loader',
          iconColor: 'text-primary'
        };
      default: // info
        return {
          bgColor: 'bg-muted',
          borderColor: 'border-border',
          textColor: 'text-text-primary',
          icon: 'Info',
          iconColor: 'text-text-secondary'
        };
    }
  };

  if (!isShown || !message) {
    return null;
  }

  const config = getNotificationConfig(type);

  return (
    <div className={`
      w-full ${config?.bgColor} border-b ${config?.borderColor} px-4 py-3
      transition-all duration-300 ease-spring
    `}>
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <Icon 
            name={config?.icon} 
            size={20} 
            className={`
              ${config?.iconColor} flex-shrink-0
              ${type === 'loading' ? 'animate-spin' : ''}
            `}
          />
          <p className={`text-sm font-medium ${config?.textColor} truncate sm:whitespace-normal`}>
            {message}
          </p>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          {actionLabel && onAction && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onAction}
              className={`${config?.textColor} hover:bg-black/5 text-xs px-3 py-1`}
            >
              {actionLabel}
            </Button>
          )}
          
          {onDismiss && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className={`${config?.iconColor} hover:bg-black/5 w-8 h-8 flex-shrink-0`}
              title="Dismiss notification"
            >
              <Icon name="X" size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusNotificationBar;