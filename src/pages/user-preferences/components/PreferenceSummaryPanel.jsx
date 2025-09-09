import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const PreferenceSummaryPanel = ({ 
  dietaryRestrictions, 
  allergenSettings, 
  scoringWeights, 
  priorityFactors, 
  appSettings, 
  onResetAll, 
  onResetCategory 
}) => {
  const getActiveRestrictions = () => {
    return dietaryRestrictions?.filter(r => r)?.length;
  };

  const getActiveAllergens = () => {
    return Object.values(allergenSettings)?.filter(a => a?.enabled)?.length;
  };

  const getHighPriorityFactors = () => {
    return Object.values(scoringWeights)?.filter(w => w === 'high' || w === 'critical')?.length;
  };

  const getDataUsage = () => {
    // Mock data usage calculation
    const baseSize = 2.5; // MB
    const historySize = 1.2; // MB
    const cacheSize = appSettings?.offlineMode ? 15.8 : 0; // MB
    return (baseSize + historySize + cacheSize)?.toFixed(1);
  };

  const summaryItems = [
    {
      category: 'Dietary Restrictions',
      count: getActiveRestrictions(),
      icon: 'Utensils',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      category: 'Allergen Alerts',
      count: getActiveAllergens(),
      icon: 'AlertTriangle',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      category: 'High Priority Factors',
      count: getHighPriorityFactors(),
      icon: 'Target',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      category: 'Health Goals',
      count: priorityFactors?.length,
      icon: 'Heart',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Preference Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {summaryItems?.map((item) => (
            <div key={item?.category} className={`${item?.bgColor} rounded-lg p-4 text-center`}>
              <Icon name={item?.icon} size={24} className={`${item?.color} mx-auto mb-2`} />
              <div className={`text-2xl font-bold ${item?.color} mb-1`}>
                {item?.count}
              </div>
              <div className="text-xs text-text-secondary">
                {item?.category}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border border-border rounded-lg p-4">
        <h4 className="font-medium text-text-primary mb-3">Data & Privacy</h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Local Storage Used:</span>
            <span className="font-medium text-text-primary">{getDataUsage()} MB</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Offline Mode:</span>
            <span className={`font-medium ${appSettings?.offlineMode ? 'text-success' : 'text-text-secondary'}`}>
              {appSettings?.offlineMode ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Auto-Save History:</span>
            <span className={`font-medium ${appSettings?.autoSaveHistory ? 'text-success' : 'text-text-secondary'}`}>
              {appSettings?.autoSaveHistory ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">Cache Retention:</span>
            <span className="font-medium text-text-primary">
              {appSettings?.cacheRetention === 'unlimited' ? 'Unlimited' : `${appSettings?.cacheRetention} days`}
            </span>
          </div>
        </div>
      </div>
      <div className="border border-border rounded-lg p-4">
        <h4 className="font-medium text-text-primary mb-3">Quick Reset Options</h4>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onResetCategory('dietary')}
              iconName="RotateCcw"
              iconPosition="left"
            >
              Reset Dietary
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onResetCategory('allergens')}
              iconName="RotateCcw"
              iconPosition="left"
            >
              Reset Allergens
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onResetCategory('scoring')}
              iconName="RotateCcw"
              iconPosition="left"
            >
              Reset Scoring
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onResetCategory('app')}
              iconName="RotateCcw"
              iconPosition="left"
            >
              Reset App Settings
            </Button>
          </div>
          
          <div className="pt-2 border-t border-border">
            <Button
              variant="destructive"
              onClick={onResetAll}
              iconName="RefreshCw"
              iconPosition="left"
              className="w-full sm:w-auto"
            >
              Reset All Preferences
            </Button>
          </div>
        </div>
      </div>
      <div className="p-4 bg-muted rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Shield" size={20} className="text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-text-primary mb-1">Privacy Notice</h4>
            <p className="text-sm text-text-secondary">
              All preferences are stored locally on your device. No personal data is shared with third parties. 
              Product data is retrieved from Open Food Facts API and processed using OpenAI's GPT-4o for health assessments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferenceSummaryPanel;