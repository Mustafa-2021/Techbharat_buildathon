import React, { useEffect } from 'react';
import Icon from '../../../components/AppIcon';


const ScannerModeSelector = ({ activeMode, onModeChange }) => {
  const scannerModes = [
    {
      id: 'barcode',
      label: 'Barcode Scanner',
      description: 'Scan product barcode with camera',
      icon: 'Camera',
      color: 'primary',
      shortcut: '1'
    },
    {
      id: 'manual',
      label: 'Manual Entry',
      description: 'Enter barcode number manually',
      icon: 'Hash',
      color: 'secondary',
      shortcut: '2'
    },
    {
      id: 'search',
      label: 'Product Search',
      description: 'Search by product name or brand',
      icon: 'Search',
      color: 'warning',
      shortcut: '3'
    },
    {
      id: 'ocr',
      label: 'Ingredient OCR',
      description: 'Capture ingredient list with camera',
      icon: 'FileImage',
      color: 'success',
      shortcut: '4'
    }
  ];

  const getColorClasses = (color, isActive) => {
    const colorMap = {
      primary: {
        bg: isActive ? 'bg-primary' : 'bg-primary/10',
        text: isActive ? 'text-primary-foreground' : 'text-primary',
        border: 'border-primary/20',
        hover: 'hover:bg-primary/20'
      },
      secondary: {
        bg: isActive ? 'bg-secondary' : 'bg-secondary/10',
        text: isActive ? 'text-secondary-foreground' : 'text-secondary',
        border: 'border-secondary/20',
        hover: 'hover:bg-secondary/20'
      },
      warning: {
        bg: isActive ? 'bg-warning' : 'bg-warning/10',
        text: isActive ? 'text-warning-foreground' : 'text-warning',
        border: 'border-warning/20',
        hover: 'hover:bg-warning/20'
      },
      success: {
        bg: isActive ? 'bg-success' : 'bg-success/10',
        text: isActive ? 'text-success-foreground' : 'text-success',
        border: 'border-success/20',
        hover: 'hover:bg-success/20'
      }
    };
    return colorMap?.[color];
  };

  React.useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event?.key;
      const mode = scannerModes?.find(m => m?.shortcut === key);
      if (mode && mode?.id !== activeMode) {
        onModeChange(mode?.id);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeMode, onModeChange]);

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-text-primary mb-2">Choose Scanning Method</h3>
        <p className="text-sm text-text-secondary">Select how you'd like to identify the product</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {scannerModes?.map((mode) => {
          const isActive = activeMode === mode?.id;
          const colors = getColorClasses(mode?.color, isActive);
          
          return (
            <button
              key={mode?.id}
              onClick={() => onModeChange(mode?.id)}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-200 text-left group
                ${colors?.bg} ${colors?.border} ${!isActive ? colors?.hover : ''}
                ${isActive ? 'shadow-card scale-105' : 'hover:scale-102'}
              `}
            >
              {/* Keyboard Shortcut Badge */}
              <div className="absolute top-2 right-2 w-6 h-6 bg-black/10 rounded-full flex items-center justify-center">
                <span className={`text-xs font-mono font-bold ${colors?.text}`}>
                  {mode?.shortcut}
                </span>
              </div>
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isActive ? 'bg-white/20' : 'bg-white/10'}`}>
                  <Icon 
                    name={mode?.icon} 
                    size={24} 
                    className={colors?.text}
                  />
                </div>
                
                <div>
                  <h4 className={`font-semibold text-sm ${colors?.text} mb-1`}>
                    {mode?.label}
                  </h4>
                  <p className={`text-xs ${isActive ? 'text-white/80' : 'text-text-secondary'} leading-tight`}>
                    {mode?.description}
                  </p>
                </div>
              </div>
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute inset-0 rounded-lg border-2 border-white/30 pointer-events-none">
                  <div className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                </div>
              )}
            </button>
          );
        })}
      </div>
      {/* Keyboard Shortcuts Info */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center space-x-2 text-xs text-text-secondary">
          <Icon name="Keyboard" size={14} />
          <span>Use keyboard shortcuts (1-4) to quickly switch modes</span>
        </div>
      </div>
    </div>
  );
};

export default ScannerModeSelector;