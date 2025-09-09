import React from 'react';
import Icon from '../../../components/AppIcon';

const NutritionalBreakdown = ({ product }) => {
  const nutriments = product?.nutritionalValues || {};
  const nutritionalData = {
    servingSize: product?.servingSize || "Per 100g",
    servingsPerContainer: product?.servingsPerContainer || null,
    nutrients: [
      { name: "Calories", amount: nutriments?.energy?.value || 0, unit: nutriments?.energy?.unit || 'kcal', dailyValue: null, status: (nutriments?.energy?.value || 0) < 200 ? 'good' : 'moderate' },
      { name: "Total Fat", amount: nutriments?.fat?.value || 0, unit: nutriments?.fat?.unit || 'g', dailyValue: null, status: (nutriments?.fat?.value || 0) < 3 ? 'good' : 'moderate' },
      { name: "Saturated Fat", amount: nutriments?.saturatedFat?.value || 0, unit: nutriments?.saturatedFat?.unit || 'g', dailyValue: null, status: (nutriments?.saturatedFat?.value || 0) < 1.5 ? 'good' : 'moderate' },
      { name: "Sodium", amount: nutriments?.sodium?.value || 0, unit: nutriments?.sodium?.unit || 'mg', dailyValue: null, status: (nutriments?.sodium?.value || 0) < 300 ? 'good' : 'moderate' },
      { name: "Total Carbohydrates", amount: nutriments?.carbohydrates?.value || 0, unit: nutriments?.carbohydrates?.unit || 'g', dailyValue: null, status: 'good' },
      { name: "Total Sugars", amount: nutriments?.sugars?.value || 0, unit: nutriments?.sugars?.unit || 'g', dailyValue: null, status: (nutriments?.sugars?.value || 0) < 5 ? 'good' : 'moderate' },
      { name: "Dietary Fiber", amount: nutriments?.fiber?.value || 0, unit: nutriments?.fiber?.unit || 'g', dailyValue: null, status: (nutriments?.fiber?.value || 0) >= 3 ? 'excellent' : 'moderate' },
      { name: "Protein", amount: nutriments?.proteins?.value || 0, unit: nutriments?.proteins?.unit || 'g', dailyValue: null, status: (nutriments?.proteins?.value || 0) >= 5 ? 'good' : 'moderate' }
    ],
    vitaminsAndMinerals: []
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-primary';
      case 'moderate': return 'text-warning';
      case 'poor': return 'text-error';
      default: return 'text-text-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent': return 'CheckCircle2';
      case 'good': return 'CheckCircle';
      case 'moderate': return 'AlertCircle';
      case 'poor': return 'XCircle';
      default: return 'Circle';
    }
  };

  return (
    <div className="space-y-6">
      {/* Serving Information */}
      <div className="bg-muted rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-text-primary">Serving Size:</span>
            <span className="ml-2 text-sm text-text-secondary">{nutritionalData?.servingSize}</span>
          </div>
        </div>
      </div>
      {/* Main Nutrients */}
      <div>
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
          Nutritional Information
        </h3>
        <div className="space-y-3">
          {nutritionalData?.nutrients?.map((nutrient, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
              <div className="flex items-center space-x-3">
                <Icon 
                  name={getStatusIcon(nutrient?.status)} 
                  size={16} 
                  className={getStatusColor(nutrient?.status)} 
                />
                <span className="font-medium text-text-primary">{nutrient?.name}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-text-secondary">
                  {nutrient?.amount}{nutrient?.unit}
                </span>
                {nutrient?.dailyValue && (
                  <span className="text-sm text-text-secondary min-w-[60px] text-right">
                    {nutrient?.dailyValue}% DV
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Vitamins and Minerals */}
      <div>
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
          Vitamins & Minerals
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {nutritionalData?.vitaminsAndMinerals?.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium text-text-primary">{item?.name}</span>
              <div className="text-right">
                <div className="text-text-secondary">{item?.amount}</div>
                <div className="text-xs text-text-secondary">{item?.dailyValue}% DV</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Daily Value Note */}
      <div className="bg-muted rounded-lg p-4">
        <p className="text-xs text-text-secondary">
          * Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs.
        </p>
      </div>
    </div>
  );
};

export default NutritionalBreakdown;