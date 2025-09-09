import React from 'react';
import Icon from '../../../components/AppIcon';

const HealthExplanationPanel = ({ product, score }) => {
  const s = typeof score === 'number' ? score : (typeof product?.healthScore === 'number' ? product?.healthScore : 0);
  const sugar = product?.nutritionalValues?.sugars?.value;
  const fiber = product?.nutritionalValues?.fiber?.value;
  const sodium = product?.nutritionalValues?.sodium?.value;
  const fat = product?.nutritionalValues?.fat?.value;

  const positiveFactors = [];
  if (fiber >= 3) positiveFactors.push('Good fiber content');
  if (product?.nutriscore === 'A' || product?.nutriscore === 'B') positiveFactors.push(`Nutri-Score ${product?.nutriscore}`);
  if ((fat || 0) < 10) positiveFactors.push('Low total fat');

  const concerningFactors = [];
  if ((sugar || 0) > 10) concerningFactors.push('High sugars per 100g');
  if ((sodium || 0) > 300) concerningFactors.push('High sodium');
  if (product?.additives?.length > 0) concerningFactors.push(`${product?.additives?.length} additives listed`);

  const recommendations = [];
  if ((sugar || 0) > 10) recommendations.push('Consider low‑sugar alternatives or smaller portions');
  if ((sodium || 0) > 300) recommendations.push('Prefer lower‑sodium variants when available');
  if (fiber < 3) recommendations.push('Add fiber‑rich sides (e.g., vegetables, whole grains)');

  const mainReason = s >= 80
    ? 'Excellent nutritional profile relative to typical products in this category.'
    : s >= 60
      ? 'Generally good nutrition with a few areas to watch.'
      : 'Several nutritional concerns reduce this product’s health score.';

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-card">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="MessageCircle" size={24} className="text-primary" />
        <h2 className="text-xl font-heading font-semibold text-text-primary">
          Health Assessment Explanation
        </h2>
      </div>
      {/* Main Explanation */}
      <div className="bg-muted rounded-lg p-4 mb-6">
        <p className="text-text-primary leading-relaxed">
          {mainReason}
        </p>
      </div>
      {/* Positive Factors */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="CheckCircle" size={20} className="text-success" />
          <h3 className="font-heading font-medium text-text-primary">What's Good</h3>
        </div>
        <ul className="space-y-2">
          {positiveFactors?.length > 0 ? positiveFactors?.map((factor, index) => (
            <li key={index} className="flex items-start space-x-2">
              <Icon name="Plus" size={16} className="text-success mt-0.5 flex-shrink-0" />
              <span className="text-sm text-text-secondary">{factor}</span>
            </li>
          )) : (
            <li className="text-sm text-text-secondary">No notable positives detected.</li>
          )}
        </ul>
      </div>
      {/* Concerning Factors */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="AlertTriangle" size={20} className="text-warning" />
          <h3 className="font-heading font-medium text-text-primary">Areas of Concern</h3>
        </div>
        <ul className="space-y-2">
          {concerningFactors?.length > 0 ? concerningFactors?.map((factor, index) => (
            <li key={index} className="flex items-start space-x-2">
              <Icon name="Minus" size={16} className="text-warning mt-0.5 flex-shrink-0" />
              <span className="text-sm text-text-secondary">{factor}</span>
            </li>
          )) : (
            <li className="text-sm text-text-secondary">No major concerns identified.</li>
          )}
        </ul>
      </div>
      {/* Recommendations */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="Lightbulb" size={20} className="text-primary" />
          <h3 className="font-heading font-medium text-text-primary">Our Recommendations</h3>
        </div>
        <ul className="space-y-2">
          {(recommendations?.length > 0 ? recommendations : ['Enjoy in moderation and balance with whole foods.'])?.map((recommendation, index) => (
            <li key={index} className="flex items-start space-x-2">
              <Icon name="ArrowRight" size={16} className="text-primary mt-0.5 flex-shrink-0" />
              <span className="text-sm text-text-secondary">{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HealthExplanationPanel;