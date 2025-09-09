import React from 'react';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const AllergenWarningsPanel = ({ 
  allergenSettings, 
  customAllergens, 
  onAllergenToggle, 
  onSeverityChange, 
  onCustomAllergensChange 
}) => {
  const majorAllergens = [
    {
      id: 'milk',
      label: 'Milk/Dairy',
      description: 'Includes lactose, casein, whey, and dairy derivatives'
    },
    {
      id: 'eggs',
      label: 'Eggs',
      description: 'Includes egg whites, yolks, and egg-derived ingredients'
    },
    {
      id: 'fish',
      label: 'Fish',
      description: 'All fish species and fish-derived ingredients'
    },
    {
      id: 'shellfish',
      label: 'Shellfish',
      description: 'Crustaceans, mollusks, and shellfish derivatives'
    },
    {
      id: 'tree-nuts',
      label: 'Tree Nuts',
      description: 'Almonds, walnuts, cashews, and other tree nuts'
    },
    {
      id: 'peanuts',
      label: 'Peanuts',
      description: 'Peanuts and peanut-derived ingredients'
    },
    {
      id: 'wheat',
      label: 'Wheat',
      description: 'Wheat flour, gluten, and wheat-based ingredients'
    },
    {
      id: 'soy',
      label: 'Soy',
      description: 'Soybeans, soy protein, and soy derivatives'
    },
    {
      id: 'sesame',
      label: 'Sesame',
      description: 'Sesame seeds, tahini, and sesame oil'
    }
  ];

  const severityOptions = [
    { value: 'mild', label: 'Mild - Preference avoidance' },
    { value: 'moderate', label: 'Moderate - Strong warning' },
    { value: 'severe', label: 'Severe - Critical alert' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-3 p-4 bg-warning/10 border border-warning/20 rounded-lg">
        <Icon name="AlertTriangle" size={20} className="text-warning mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-text-primary mb-1">Allergen Detection & Warnings</h4>
          <p className="text-sm text-text-secondary">
            Products containing selected allergens will be flagged with severity-based warnings. Severe allergens will show critical alerts and significantly lower health scores.
          </p>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Major Allergens</h3>
        <div className="space-y-4">
          {majorAllergens?.map((allergen) => (
            <div key={allergen?.id} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <Checkbox
                    label={allergen?.label}
                    checked={allergenSettings?.[allergen?.id]?.enabled || false}
                    onChange={(e) => onAllergenToggle(allergen?.id, e?.target?.checked)}
                  />
                  <p className="text-xs text-text-secondary mt-1 ml-6">
                    {allergen?.description}
                  </p>
                </div>
              </div>
              
              {allergenSettings?.[allergen?.id]?.enabled && (
                <div className="ml-6 mt-3">
                  <Select
                    label="Severity Level"
                    options={severityOptions}
                    value={allergenSettings?.[allergen?.id]?.severity || 'moderate'}
                    onChange={(value) => onSeverityChange(allergen?.id, value)}
                    className="max-w-xs"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Custom Allergens</h3>
        <div className="space-y-3">
          <Input
            label="Additional Allergens"
            type="text"
            placeholder="Enter custom allergens (e.g., sulfites, MSG, artificial colors)"
            description="Separate multiple allergens with commas. All custom allergens are treated as moderate severity."
            value={customAllergens}
            onChange={(e) => onCustomAllergensChange(e?.target?.value)}
            className="w-full"
          />
          
          {customAllergens && (
            <div className="p-3 bg-accent rounded-lg">
              <h4 className="text-sm font-medium text-text-primary mb-2">Your Custom Allergens:</h4>
              <div className="flex flex-wrap gap-2">
                {customAllergens?.split(',')?.map((allergen, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-warning/10 text-warning text-xs rounded-full border border-warning/20"
                  >
                    {allergen?.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-medium text-text-primary mb-2">Allergen Alert Summary</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-lg font-semibold text-error">
              {Object.values(allergenSettings)?.filter(a => a?.enabled && a?.severity === 'severe')?.length}
            </div>
            <div className="text-text-secondary">Severe Alerts</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-warning">
              {Object.values(allergenSettings)?.filter(a => a?.enabled && a?.severity === 'moderate')?.length}
            </div>
            <div className="text-text-secondary">Moderate Warnings</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-text-secondary">
              {Object.values(allergenSettings)?.filter(a => a?.enabled && a?.severity === 'mild')?.length}
            </div>
            <div className="text-text-secondary">Mild Preferences</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllergenWarningsPanel;