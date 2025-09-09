import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import DietaryRestrictionsPanel from './components/DietaryRestrictionsPanel';
import AllergenWarningsPanel from './components/AllergenWarningsPanel';
import ScoringPreferencesPanel from './components/ScoringPreferencesPanel';
import AppSettingsPanel from './components/AppSettingsPanel';
// import PreferenceSummaryPanel from './components/PreferenceSummaryPanel';

const UserPreferences = () => {
  const [activeTab, setActiveTab] = useState('dietary');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Dietary Restrictions State
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [customRestrictions, setCustomRestrictions] = useState("");

  // Allergen Settings State
  const [allergenSettings, setAllergenSettings] = useState({});
  const [customAllergens, setCustomAllergens] = useState("");

  // Scoring Preferences State
  const [scoringWeights, setScoringWeights] = useState({
    sugar: 'normal',
    sodium: 'normal',
    'saturated-fat': 'normal',
    additives: 'normal',
    fiber: 'normal',
    protein: 'normal',
    vitamins: 'normal',
    processing: 'normal'
  });
  const [priorityFactors, setPriorityFactors] = useState([]);

  // App Settings State
  const [appSettings, setAppSettings] = useState({
    offlineMode: false,
    autoSaveHistory: true,
    highQualityOCR: false,
    cacheRetention: '30',
    notificationLevel: 'all',
    soundAlerts: true,
    vibrationFeedback: true,
    exportFormat: 'json',
    showApiStatus: false
  });

  const tabs = [
    // { id: 'dietary', label: 'Dietary Restrictions', icon: 'Utensils' },
    // { id: 'allergens', label: 'Allergen Warnings', icon: 'AlertTriangle' },
    { id: 'scoring', label: 'Scoring Preferences', icon: 'Target' },
    // { id: 'app', label: 'App Settings', icon: 'Settings' },
    // { id: 'summary', label: 'Summary', icon: 'FileText' }
  ];

  // Load preferences from localStorage on component mount
  useEffect(() => {
    const loadPreferences = () => {
      try {
        const savedPrefs = localStorage.getItem('nutriscan-preferences');
        if (savedPrefs) {
          const prefs = JSON.parse(savedPrefs);
          setDietaryRestrictions(prefs?.dietaryRestrictions || []);
          setCustomRestrictions(prefs?.customRestrictions || "");
          setAllergenSettings(prefs?.allergenSettings || {});
          setCustomAllergens(prefs?.customAllergens || "");
          setScoringWeights(prefs?.scoringWeights || scoringWeights);
          setPriorityFactors(prefs?.priorityFactors || []);
          setAppSettings(prefs?.appSettings || appSettings);
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    };

    loadPreferences();
  }, []);

  // Save preferences to localStorage
  const savePreferences = () => {
    try {
      const preferences = {
        dietaryRestrictions,
        customRestrictions,
        allergenSettings,
        customAllergens,
        scoringWeights,
        priorityFactors,
        appSettings,
        lastUpdated: new Date()?.toISOString()
      };
      localStorage.setItem('nutriscan-preferences', JSON.stringify(preferences));
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  // Dietary Restrictions Handlers
  const handleDietaryChange = (restrictionId, checked) => {
    if (checked) {
      setDietaryRestrictions(prev => [...prev, restrictionId]);
    } else {
      setDietaryRestrictions(prev => prev?.filter(id => id !== restrictionId));
    }
    setHasUnsavedChanges(true);
  };

  const handleCustomRestrictionsChange = (value) => {
    setCustomRestrictions(value);
    setHasUnsavedChanges(true);
  };

  // Allergen Settings Handlers
  const handleAllergenToggle = (allergenId, enabled) => {
    setAllergenSettings(prev => ({
      ...prev,
      [allergenId]: {
        ...prev?.[allergenId],
        enabled,
        severity: prev?.[allergenId]?.severity || 'moderate'
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleSeverityChange = (allergenId, severity) => {
    setAllergenSettings(prev => ({
      ...prev,
      [allergenId]: {
        ...prev?.[allergenId],
        severity
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleCustomAllergensChange = (value) => {
    setCustomAllergens(value);
    setHasUnsavedChanges(true);
  };

  // Scoring Preferences Handlers
  const handleWeightChange = (factorId, weight) => {
    setScoringWeights(prev => ({
      ...prev,
      [factorId]: weight
    }));
    setHasUnsavedChanges(true);
  };

  const handlePriorityToggle = (goalId, checked) => {
    if (checked) {
      setPriorityFactors(prev => [...prev, goalId]);
    } else {
      setPriorityFactors(prev => prev?.filter(id => id !== goalId));
    }
    setHasUnsavedChanges(true);
  };

  // App Settings Handlers
  const handleSettingToggle = (settingId, value) => {
    setAppSettings(prev => ({
      ...prev,
      [settingId]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleSettingChange = (settingId, value) => {
    setAppSettings(prev => ({
      ...prev,
      [settingId]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleExportData = () => {
    const data = {
      preferences: {
        dietaryRestrictions,
        customRestrictions,
        allergenSettings,
        customAllergens,
        scoringWeights,
        priorityFactors,
        appSettings
      },
      exportDate: new Date()?.toISOString(),
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nutriscan-preferences-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    setConfirmAction(() => () => {
      localStorage.removeItem('nutriscan-preferences');
      localStorage.removeItem('nutriscan-history');
      localStorage.removeItem('nutriscan-cache');
      window.location?.reload();
    });
    setShowConfirmDialog(true);
  };

  // Reset Handlers
  const handleResetCategory = (category) => {
    setConfirmAction(() => () => {
      switch (category) {
        case 'dietary':
          setDietaryRestrictions([]);
          setCustomRestrictions("");
          break;
        case 'allergens':
          setAllergenSettings({});
          setCustomAllergens("");
          break;
        case 'scoring':
          setScoringWeights({
            sugar: 'normal',
            sodium: 'normal',
            'saturated-fat': 'normal',
            additives: 'normal',
            fiber: 'normal',
            protein: 'normal',
            vitamins: 'normal',
            processing: 'normal'
          });
          setPriorityFactors([]);
          break;
        case 'app':
          setAppSettings({
            offlineMode: false,
            autoSaveHistory: true,
            highQualityOCR: false,
            cacheRetention: '30',
            notificationLevel: 'all',
            soundAlerts: true,
            vibrationFeedback: true,
            exportFormat: 'json',
            showApiStatus: false
          });
          break;
      }
      setHasUnsavedChanges(true);
    });
    setShowConfirmDialog(true);
  };

  const handleResetAll = () => {
    setConfirmAction(() => () => {
      setDietaryRestrictions([]);
      setCustomRestrictions("");
      setAllergenSettings({});
      setCustomAllergens("");
      setScoringWeights({
        sugar: 'normal',
        sodium: 'normal',
        'saturated-fat': 'normal',
        additives: 'normal',
        fiber: 'normal',
        protein: 'normal',
        vitamins: 'normal',
        processing: 'normal'
      });
      setPriorityFactors([]);
      setAppSettings({
        offlineMode: false,
        autoSaveHistory: true,
        highQualityOCR: false,
        cacheRetention: '30',
        notificationLevel: 'all',
        soundAlerts: true,
        vibrationFeedback: true,
        exportFormat: 'json',
        showApiStatus: false
      });
      setHasUnsavedChanges(true);
    });
    setShowConfirmDialog(true);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dietary':
        return (
          <DietaryRestrictionsPanel
            dietaryRestrictions={dietaryRestrictions}
            customRestrictions={customRestrictions}
            onDietaryChange={handleDietaryChange}
            onCustomRestrictionsChange={handleCustomRestrictionsChange}
          />
        );
      case 'allergens':
        return (
          <AllergenWarningsPanel
            allergenSettings={allergenSettings}
            customAllergens={customAllergens}
            onAllergenToggle={handleAllergenToggle}
            onSeverityChange={handleSeverityChange}
            onCustomAllergensChange={handleCustomAllergensChange}
          />
        );
      case 'scoring':
        return (
          <ScoringPreferencesPanel
            scoringWeights={scoringWeights}
            priorityFactors={priorityFactors}
            onWeightChange={handleWeightChange}
            onPriorityToggle={handlePriorityToggle}
          />
        );
      case 'app':
        return (
          <AppSettingsPanel
            appSettings={appSettings}
            onSettingToggle={handleSettingToggle}
            onSettingChange={handleSettingChange}
            onExportData={handleExportData}
            onClearData={handleClearData}
          />
        );
      // case 'summary':
      //   return (
      //     <PreferenceSummaryPanel
      //       dietaryRestrictions={dietaryRestrictions}
      //       allergenSettings={allergenSettings}
      //       scoringWeights={scoringWeights}
      //       priorityFactors={priorityFactors}
      //       appSettings={appSettings}
      //       onResetAll={handleResetAll}
      //       onResetCategory={handleResetCategory}
      //     />
      //   );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-text-primary mb-2">User Preferences</h1>
            <p className="text-text-secondary">
              Customize your health assessment criteria and app settings for personalized product evaluations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Tab Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-4 sticky top-20">
                <nav className="space-y-1">
                  {tabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`
                        w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-spring
                        ${activeTab === tab?.id
                          ? 'bg-primary text-primary-foreground'
                          : 'text-text-secondary hover:text-text-primary hover:bg-accent'
                        }
                      `}
                    >
                      <Icon name={tab?.icon} size={18} />
                      <span className="hidden sm:block lg:block">{tab?.label}</span>
                    </button>
                  ))}
                </nav>

                {/* Mobile Tab Indicator */}
                <div className="sm:hidden lg:hidden mt-4 text-center">
                  <span className="text-sm font-medium text-text-primary">
                    {tabs?.find(tab => tab?.id === activeTab)?.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border rounded-lg p-6">
                {renderTabContent()}
              </div>
            </div>
          </div>

          {/* Save/Reset Actions */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-card border border-border rounded-lg">
            <div className="flex items-center space-x-2">
              {hasUnsavedChanges && (
                <>
                  <Icon name="AlertCircle" size={16} className="text-warning" />
                  <span className="text-sm text-warning">You have unsaved changes</span>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => window.location?.reload()}
                iconName="RotateCcw"
                iconPosition="left"
              >
                Discard Changes
              </Button>
              <Button
                variant="default"
                onClick={savePreferences}
                iconName="Save"
                iconPosition="left"
                disabled={!hasUnsavedChanges}
              >
                Save Preferences
              </Button>
            </div>
          </div>
        </div>
      </main>
      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg p-6 max-w-md w-full">
            <div className="flex items-start space-x-3 mb-4">
              <Icon name="AlertTriangle" size={24} className="text-warning flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Confirm Action</h3>
                <p className="text-sm text-text-secondary">
                  This action cannot be undone. Are you sure you want to proceed?
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowConfirmDialog(false);
                  setConfirmAction(null);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (confirmAction) confirmAction();
                  setShowConfirmDialog(false);
                  setConfirmAction(null);
                }}
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPreferences;