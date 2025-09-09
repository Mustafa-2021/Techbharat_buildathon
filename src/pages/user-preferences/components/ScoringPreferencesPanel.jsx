import React from 'react';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const ScoringPreferencesPanel = ({ 
  scoringWeights, 
  priorityFactors, 
  onWeightChange, 
  onPriorityToggle 
}) => {
  const nutritionalFactors = [
    {
      id: 'sugar',
      label: 'Sugar Content',
      description: 'Impact of added sugars and total sugar content on health score',
      icon: 'Candy'
    },
    {
      id: 'sodium',
      label: 'Sodium Levels',
      description: 'Weight given to sodium content in health assessment',
      icon: 'Droplets'
    },
    {
      id: 'saturated-fat',
      label: 'Saturated Fat',
      description: 'Emphasis on saturated fat content in scoring',
      icon: 'Heart'
    },
    {
      id: 'additives',
      label: 'Additives & Preservatives',
      description: 'Impact of artificial additives on health score',
      icon: 'Flask'
    },
    {
      id: 'fiber',
      label: 'Fiber Content',
      description: 'Positive weight for dietary fiber content',
      icon: 'Wheat'
    },
    {
      id: 'protein',
      label: 'Protein Quality',
      description: 'Emphasis on protein content and quality',
      icon: 'Zap'
    },
    {
      id: 'vitamins',
      label: 'Vitamins & Minerals',
      description: 'Weight given to micronutrient content',
      icon: 'Pill'
    },
    {
      id: 'processing',
      label: 'Processing Level',
      description: 'Impact of food processing on health assessment',
      icon: 'Settings'
    }
  ];

  const weightOptions = [
    { value: 'low', label: 'Low Priority (1x)' },
    { value: 'normal', label: 'Normal Priority (2x)' },
    { value: 'high', label: 'High Priority (3x)' },
    { value: 'critical', label: 'Critical Priority (4x)' }
  ];

  const healthGoals = [
    {
      id: 'weight-loss',
      label: 'Weight Management',
      description: 'Prioritize calorie density and satiety factors'
    },
    {
      id: 'heart-health',
      label: 'Heart Health',
      description: 'Focus on cholesterol, sodium, and healthy fats'
    },
    {
      id: 'diabetes-friendly',
      label: 'Blood Sugar Control',
      description: 'Emphasize glycemic impact and sugar content'
    },
    {
      id: 'muscle-building',
      label: 'Muscle Building',
      description: 'Prioritize protein quality and amino acid profiles'
    },
    {
      id: 'digestive-health',
      label: 'Digestive Health',
      description: 'Focus on fiber content and gut-friendly ingredients'
    },
    {
      id: 'general-wellness',
      label: 'General Wellness',
      description: 'Balanced approach to all nutritional factors'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-3 p-4 bg-primary/10 border border-primary/20 rounded-lg">
        <Icon name="Target" size={20} className="text-primary mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-text-primary mb-1">Personalized Health Scoring</h4>
          <p className="text-sm text-text-secondary">
            Customize how different nutritional factors impact your health scores. Higher priority factors will have greater influence on product assessments and recommendations.
          </p>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Health Goals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {healthGoals?.map((goal) => (
            <div key={goal?.id} className="space-y-2">
              <Checkbox
                label={goal?.label}
                checked={priorityFactors?.includes(goal?.id)}
                onChange={(e) => onPriorityToggle(goal?.id, e?.target?.checked)}
              />
              <p className="text-xs text-text-secondary ml-6">
                {goal?.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Nutritional Factor Weights</h3>
        <div className="space-y-4">
          {nutritionalFactors?.map((factor) => (
            <div key={factor?.id} className="border border-border rounded-lg p-4">
              <div className="flex items-start space-x-3 mb-3">
                <Icon name={factor?.icon} size={20} className="text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium text-text-primary">{factor?.label}</h4>
                  <p className="text-sm text-text-secondary mt-1">
                    {factor?.description}
                  </p>
                </div>
              </div>
              
              <div className="ml-8">
                <Select
                  label="Priority Level"
                  options={weightOptions}
                  value={scoringWeights?.[factor?.id] || 'normal'}
                  onChange={(value) => onWeightChange(factor?.id, value)}
                  className="max-w-xs"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-medium text-text-primary mb-3">Scoring Weight Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-lg font-semibold text-error">
              {Object.values(scoringWeights)?.filter(w => w === 'critical')?.length}
            </div>
            <div className="text-text-secondary">Critical (4x)</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-warning">
              {Object.values(scoringWeights)?.filter(w => w === 'high')?.length}
            </div>
            <div className="text-text-secondary">High (3x)</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-primary">
              {Object.values(scoringWeights)?.filter(w => w === 'normal')?.length}
            </div>
            <div className="text-text-secondary">Normal (2x)</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-text-secondary">
              {Object.values(scoringWeights)?.filter(w => w === 'low')?.length}
            </div>
            <div className="text-text-secondary">Low (1x)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoringPreferencesPanel;