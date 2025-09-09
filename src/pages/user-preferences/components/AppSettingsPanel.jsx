import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const AppSettingsPanel = ({ 
  appSettings, 
  onSettingToggle, 
  onSettingChange, 
  onExportData, 
  onClearData 
}) => {
  const exportFormatOptions = [
    { value: 'json', label: 'JSON Format' },
    { value: 'csv', label: 'CSV Spreadsheet' },
    { value: 'pdf', label: 'PDF Report' }
  ];

  const notificationOptions = [
    { value: 'all', label: 'All Notifications' },
    { value: 'critical', label: 'Critical Alerts Only' },
    { value: 'none', label: 'No Notifications' }
  ];

  const cacheRetentionOptions = [
    { value: '7', label: '7 Days' },
    { value: '30', label: '30 Days' },
    { value: '90', label: '90 Days' },
    { value: 'unlimited', label: 'Unlimited' }
  ];

  const getApiStatus = () => {
    // Mock API status - in real app this would check actual API health
    return {
      openFoodFacts: 'online',
      openAI: 'online',
      lastCheck: new Date()?.toLocaleTimeString()
    };
  };

  const apiStatus = getApiStatus();

  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-3 p-4 bg-muted rounded-lg">
        <Icon name="Settings" size={20} className="text-primary mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-text-primary mb-1">Application Settings</h4>
          <p className="text-sm text-text-secondary">
            Configure app behavior, data management, and system preferences for optimal performance and privacy.
          </p>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Performance & Storage</h3>
        <div className="space-y-4">
          <Checkbox
            label="Enable Offline Mode"
            description="Cache product data for offline access when internet is unavailable"
            checked={appSettings?.offlineMode || false}
            onChange={(e) => onSettingToggle('offlineMode', e?.target?.checked)}
          />
          
          <Checkbox
            label="Auto-Save Scan History"
            description="Automatically save all product scans to local history"
            checked={appSettings?.autoSaveHistory || true}
            onChange={(e) => onSettingToggle('autoSaveHistory', e?.target?.checked)}
          />
          
          <Checkbox
            label="High-Quality Image Processing"
            description="Use enhanced OCR processing for better ingredient recognition (uses more data)"
            checked={appSettings?.highQualityOCR || false}
            onChange={(e) => onSettingToggle('highQualityOCR', e?.target?.checked)}
          />

          <div className="ml-6">
            <Select
              label="Cache Retention Period"
              description="How long to keep cached product data"
              options={cacheRetentionOptions}
              value={appSettings?.cacheRetention || '30'}
              onChange={(value) => onSettingChange('cacheRetention', value)}
              className="max-w-xs"
            />
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Notifications & Alerts</h3>
        <div className="space-y-4">
          <Select
            label="Notification Level"
            description="Choose which types of notifications to receive"
            options={notificationOptions}
            value={appSettings?.notificationLevel || 'all'}
            onChange={(value) => onSettingChange('notificationLevel', value)}
            className="max-w-xs"
          />
          
          <Checkbox
            label="Sound Alerts"
            description="Play sound for critical allergen warnings"
            checked={appSettings?.soundAlerts || true}
            onChange={(e) => onSettingToggle('soundAlerts', e?.target?.checked)}
          />
          
          <Checkbox
            label="Vibration Feedback"
            description="Vibrate device for important alerts (mobile only)"
            checked={appSettings?.vibrationFeedback || true}
            onChange={(e) => onSettingToggle('vibrationFeedback', e?.target?.checked)}
          />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Data Management</h3>
        <div className="space-y-4">
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-medium text-text-primary mb-2">Export Your Data</h4>
            <p className="text-sm text-text-secondary mb-3">
              Download your scan history, preferences, and health assessments
            </p>
            <div className="flex items-center space-x-3">
              <Select
                options={exportFormatOptions}
                value={appSettings?.exportFormat || 'json'}
                onChange={(value) => onSettingChange('exportFormat', value)}
                className="max-w-xs"
              />
              <Button
                variant="outline"
                onClick={onExportData}
                iconName="Download"
                iconPosition="left"
              >
                Export Data
              </Button>
            </div>
          </div>

          <div className="border border-destructive/20 rounded-lg p-4 bg-destructive/5">
            <h4 className="font-medium text-text-primary mb-2">Clear All Data</h4>
            <p className="text-sm text-text-secondary mb-3">
              Permanently delete all stored preferences, history, and cached data
            </p>
            <Button
              variant="destructive"
              onClick={onClearData}
              iconName="Trash2"
              iconPosition="left"
            >
              Clear All Data
            </Button>
          </div>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">API Status Monitor</h3>
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-text-primary">Service Status</h4>
            <span className="text-xs text-text-secondary">
              Last checked: {apiStatus?.lastCheck}
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-primary">Open Food Facts API</span>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  apiStatus?.openFoodFacts === 'online' ? 'bg-success' : 'bg-error'
                }`} />
                <span className={`text-xs font-medium ${
                  apiStatus?.openFoodFacts === 'online' ? 'text-success' : 'text-error'
                }`}>
                  {apiStatus?.openFoodFacts === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-primary">OpenAI GPT-4o API</span>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  apiStatus?.openAI === 'online' ? 'bg-success' : 'bg-error'
                }`} />
                <span className={`text-xs font-medium ${
                  apiStatus?.openAI === 'online' ? 'text-success' : 'text-error'
                }`}>
                  {apiStatus?.openAI === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
          
          <Checkbox
            label="Show API Status in Header"
            description="Display real-time API status indicators in the app header"
            checked={appSettings?.showApiStatus || false}
            onChange={(e) => onSettingToggle('showApiStatus', e?.target?.checked)}
            className="mt-4"
          />
        </div>
      </div>
    </div>
  );
};

export default AppSettingsPanel;