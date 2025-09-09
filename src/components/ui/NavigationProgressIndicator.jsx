import React from 'react';
import Icon from '../AppIcon';

const NavigationProgressIndicator = ({ currentStep = 1, totalSteps = 3 }) => {
  const steps = [
    { id: 1, label: 'Scanning', icon: 'Camera' },
    { id: 2, label: 'Processing', icon: 'Loader' },
    { id: 3, label: 'Results', icon: 'CheckCircle' }
  ];

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'active';
    return 'pending';
  };

  const getStepClasses = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'active':
        return 'bg-primary text-primary-foreground';
      case 'pending':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getConnectorClasses = (stepId) => {
    return stepId < currentStep ? 'bg-success' : 'bg-muted';
  };

  return (
    <div className="w-full bg-surface border-b border-border px-4 py-3">
      <div className="flex items-center justify-center max-w-md mx-auto">
        {steps?.map((step, index) => {
          const status = getStepStatus(step?.id);
          const isLast = index === steps?.length - 1;

          return (
            <div key={step?.id} className="flex items-center">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center transition-spring
                    ${getStepClasses(status)}
                  `}
                >
                  <Icon 
                    name={status === 'active' && step?.icon === 'Loader' ? 'Loader' : step?.icon} 
                    size={18}
                    className={status === 'active' && step?.icon === 'Loader' ? 'animate-spin' : ''}
                  />
                </div>
                
                {/* Step Label - Hidden on mobile */}
                <span className="hidden sm:block text-xs font-caption text-text-secondary mt-1">
                  {step?.label}
                </span>
              </div>
              {/* Connector Line */}
              {!isLast && (
                <div
                  className={`
                    w-12 sm:w-16 h-0.5 mx-2 transition-spring
                    ${getConnectorClasses(step?.id)}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
      {/* Mobile Step Label */}
      <div className="sm:hidden text-center mt-2">
        <span className="text-sm font-medium text-text-primary">
          {steps?.find(step => step?.id === currentStep)?.label}
        </span>
        <span className="text-xs text-text-secondary ml-2">
          {currentStep} of {totalSteps}
        </span>
      </div>
    </div>
  );
};

export default NavigationProgressIndicator;