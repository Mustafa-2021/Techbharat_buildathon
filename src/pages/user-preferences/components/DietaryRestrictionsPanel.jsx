import React from 'react';
import { Checkbox, CheckboxGroup } from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const DietaryRestrictionsPanel = ({ 
  dietaryRestrictions, 
  customRestrictions, 
  onDietaryChange, 
  onCustomRestrictionsChange 
}) => {
  const commonRestrictions = [
    {
      id: 'vegetarian',
      label: 'Vegetarian',
      description: 'Excludes meat, poultry, and fish products'
    },
    {
      id: 'vegan',
      label: 'Vegan',
      description: 'Excludes all animal products and by-products'
    },
    {
      id: 'gluten-free',
      label: 'Gluten-Free',
      description: 'Excludes wheat, barley, rye, and gluten-containing ingredients'
    },
    {
      id: 'keto',
      label: 'Ketogenic',
      description: 'Low-carb, high-fat diet with less than 20g carbs daily'
    },
    {
      id: 'low-sodium',
      label: 'Low Sodium',
      description: 'Limits sodium intake to less than 2,300mg per day'
    },
    {
      id: 'dairy-free',
      label: 'Dairy-Free',
      description: 'Excludes milk, cheese, yogurt, and dairy derivatives'
    },
    {
      id: 'paleo',
      label: 'Paleo',
      description: 'Focuses on whole foods, excludes processed items'
    },
    {
      id: 'low-sugar',
      label: 'Low Sugar',
      description: 'Limits added sugars and high-sugar content foods'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-3 p-4 bg-muted rounded-lg">
        <Icon name="Info" size={20} className="text-primary mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="font-medium text-text-primary mb-1">How This Affects Your Health Scores</h4>
          <p className="text-sm text-text-secondary">
            Selected dietary restrictions will be highlighted in product assessments, and conflicting ingredients will receive lower health scores in your personalized evaluations.
          </p>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Common Dietary Restrictions</h3>
        <CheckboxGroup>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commonRestrictions?.map((restriction) => (
              <div key={restriction?.id} className="space-y-2">
                <Checkbox
                  label={restriction?.label}
                  checked={dietaryRestrictions?.includes(restriction?.id)}
                  onChange={(e) => onDietaryChange(restriction?.id, e?.target?.checked)}
                />
                <p className="text-xs text-text-secondary ml-6">
                  {restriction?.description}
                </p>
              </div>
            ))}
          </div>
        </CheckboxGroup>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Custom Restrictions</h3>
        <div className="space-y-3">
          <Input
            label="Additional Dietary Restrictions"
            type="text"
            placeholder="Enter custom restrictions (e.g., no artificial sweeteners, organic only)"
            description="Separate multiple restrictions with commas"
            value={customRestrictions}
            onChange={(e) => onCustomRestrictionsChange(e?.target?.value)}
            className="w-full"
          />
          
          {customRestrictions && (
            <div className="p-3 bg-accent rounded-lg">
              <h4 className="text-sm font-medium text-text-primary mb-2">Your Custom Restrictions:</h4>
              <div className="flex flex-wrap gap-2">
                {customRestrictions?.split(',')?.map((restriction, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    {restriction?.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DietaryRestrictionsPanel;