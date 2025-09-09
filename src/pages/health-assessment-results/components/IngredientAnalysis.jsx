import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const IngredientAnalysis = ({ product }) => {
  const [expandedIngredient, setExpandedIngredient] = useState(null);

  const ingredientText = product?.ingredientsText || product?.ingredients || '';
  const ingredientsList = Array.isArray(product?.ingredients)
    ? product?.ingredients?.map((ing, idx) => ({ id: idx + 1, name: ing?.name || String(ing) }))
    : (ingredientText
      ? ingredientText.split(/,|\n/).map((s, idx) => ({ id: idx + 1, name: s.trim() })).filter(i => i.name)
      : []);
  const allergens = (product?.allergens || []).map(a => a.replace('en:', ''));
  const ingredientData = {
    ingredients: ingredientsList.map(item => ({
      id: item.id,
      name: item.name,
      category: 'ingredient',
      status: 'good',
      allergens: [],
      description: '',
      concerns: []
    })),
    allergenInfo: {
      contains: allergens,
      mayContain: [],
      free: []
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-success bg-success/10 border-success/20';
      case 'good': return 'text-primary bg-primary/10 border-primary/20';
      case 'moderate': return 'text-warning bg-warning/10 border-warning/20';
      case 'poor': return 'text-error bg-error/10 border-error/20';
      default: return 'text-text-secondary bg-muted border-border';
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

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'grain': return 'Wheat';
      case 'sweetener': return 'Candy';
      case 'preservative': return 'Shield';
      case 'flavoring': return 'Sparkles';
      case 'vitamin': return 'Pill';
      case 'mineral': return 'Gem';
      default: return 'Circle';
    }
  };

  const toggleIngredient = (id) => {
    setExpandedIngredient(expandedIngredient === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Allergen Information */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="AlertTriangle" size={20} className="text-warning" />
          <h3 className="text-lg font-heading font-semibold text-text-primary">
            Allergen Information
          </h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ingredientData?.allergenInfo?.contains?.length > 0 && (
            <div>
              <h4 className="font-medium text-error mb-2">Contains:</h4>
              <ul className="space-y-1">
                {ingredientData?.allergenInfo?.contains?.map((allergen, index) => (
                  <li key={index} className="text-sm text-error bg-error/10 px-2 py-1 rounded">
                    {allergen}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {ingredientData?.allergenInfo?.mayContain?.length > 0 && (
            <div>
              <h4 className="font-medium text-warning mb-2">May Contain:</h4>
              <ul className="space-y-1">
                {ingredientData?.allergenInfo?.mayContain?.map((allergen, index) => (
                  <li key={index} className="text-sm text-warning bg-warning/10 px-2 py-1 rounded">
                    {allergen}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div>
           
            <ul className="space-y-1">
              {ingredientData?.allergenInfo?.free?.map((allergen, index) => (
                <li key={index} className="text-sm text-success bg-success/10 px-2 py-1 rounded">
                  {allergen}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* Ingredients List */}
      <div>
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
          Ingredient Analysis
        </h3>
        <div className="space-y-3">
          {ingredientData?.ingredients?.map((ingredient) => (
            <div key={ingredient?.id} className="bg-card rounded-lg border border-border overflow-hidden">
              <div 
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                // onClick={() => toggleIngredient(ingredient?.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon 
                      name={getCategoryIcon(ingredient?.category)} 
                      size={20} 
                      className="text-text-secondary" 
                    />
                    <div>
                      <h4 className="font-medium text-text-primary">{ingredient?.name}</h4>
                      <span className="text-sm text-text-secondary capitalize">{ingredient?.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* <div className={`flex items-center space-x-1 px-2 py-1 rounded-full border ${getStatusColor(ingredient?.status)}`}>
                      <Icon name={getStatusIcon(ingredient?.status)} size={14} />
                      <span className="text-xs font-medium capitalize">{ingredient?.status}</span>
                    </div> */}
                    {/* <Icon 
                      name={expandedIngredient === ingredient?.id ? "ChevronUp" : "ChevronDown"} 
                      size={20} 
                      className="text-text-secondary" 
                    /> */}
                  </div>
                </div>
              </div>
              
              {expandedIngredient === ingredient?.id && (
                <div className="px-4 pb-4 border-t border-border bg-muted/30">
                  <div className="pt-4">
                    <p className="text-sm text-text-secondary mb-3">
                      {ingredient?.description}
                    </p>
                    
                    {ingredient?.concerns?.length > 0 && (
                      <div>
                        <h5 className="font-medium text-text-primary mb-2">Potential Concerns:</h5>
                        <ul className="space-y-1">
                          {ingredient?.concerns?.map((concern, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <Icon name="AlertCircle" size={14} className="text-warning mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-text-secondary">{concern}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IngredientAnalysis;