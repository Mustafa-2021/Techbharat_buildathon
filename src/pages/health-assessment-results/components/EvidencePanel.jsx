import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const EvidencePanel = ({ product }) => {
  const [expandedRule, setExpandedRule] = useState(null);

  const n = product?.nutritionalValues || {};
  const fiber = n?.fiber?.value || 0;
  const sugar = n?.sugars?.value || 0;
  const sodium = n?.sodium?.value || 0;
  const sat = n?.saturatedFat?.value || 0;

  // Build scoring contributions mirroring the service logic
  const contributions = (() => {
    const items = [];
    // Start baseline 100
    items.push({ label: 'Baseline', delta: 100 });
    // Nutri-Score
    switch (product?.nutriscore) {
      case 'A': items.push({ label: 'Nutri-Score A bonus', delta: +5 }); break;
      case 'B': items.push({ label: 'Nutri-Score B bonus', delta: +3 }); break;
      case 'C': items.push({ label: 'Nutri-Score C neutral', delta: 0 }); break;
      case 'D': items.push({ label: 'Nutri-Score D penalty', delta: -10 }); break;
      case 'E': items.push({ label: 'Nutri-Score E penalty', delta: -20 }); break;
      default: break;
    }
    // NOVA
    switch (product?.novaGroup) {
      case 1: items.push({ label: 'NOVA 1 minimally processed', delta: +4 }); break;
      case 2: items.push({ label: 'NOVA 2 processed culinary', delta: +2 }); break;
      case 3: items.push({ label: 'NOVA 3 processed foods', delta: -4 }); break;
      case 4: items.push({ label: 'NOVA 4 ultra-processed', delta: -10 }); break;
      default: break;
    }
    // Additives
    if (product?.additives?.length > 0) {
      const penalty = Math.min(product?.additives?.length * 2, 16);
      items.push({ label: `Additives count (${product?.additives?.length})`, delta: -penalty });
    }
    // Nutriments
    if (sugar > 22.5) items.push({ label: 'High sugars (>22.5g/100g)', delta: -12 });
    else if (sugar > 5) items.push({ label: 'Moderate sugars (5-22.5g/100g)', delta: -6 });

    if (sodium > 600) items.push({ label: 'High sodium (>600mg/100g)', delta: -8 });
    else if (sodium > 300) items.push({ label: 'Moderate sodium (300-600mg/100g)', delta: -4 });

    if (sat > 5) items.push({ label: 'High saturated fat (>5g/100g)', delta: -6 });
    else if (sat > 1.5) items.push({ label: 'Moderate saturated fat (1.5-5g/100g)', delta: -3 });

    if (fiber >= 3) items.push({ label: 'Good fiber (≥3g/100g)', delta: +6 });
    else if (fiber >= 1.5) items.push({ label: 'Some fiber (1.5-3g/100g)', delta: +3 });

    return items;
  })();

  const totalScore = Math.max(0, Math.min(100, Math.round(contributions.reduce((sum, c) => sum + c.delta, 0))));

  const evidenceData = {
    appliedRules: (() => {
      // Show contributions except the baseline as applied rules
      return contributions.slice(1).map((c, idx) => ({ id: idx + 1, name: c.label, category: 'Scoring', impact: (c.delta > 0 ? '+' : '') + c.delta, threshold: '-', actualValue: '-', status: c.delta >= 0 ? 'passed' : 'failed', description: c.label }));
    })(),
    dataSources: [
      {
        name: "Open Food Facts Database",
        type: "Product Information",
        reliability: "High",
        lastUpdated: "2025-01-05",
        description: "Comprehensive product database with verified nutritional information"
      },
      {
        name: "FDA Nutrition Database",
        type: "Nutritional Standards",
        reliability: "Authoritative",
        lastUpdated: "2024-12-15",
        description: "Official nutritional guidelines and recommended daily values"
      },
      {
        name: "Peer-Reviewed Research",
        type: "Scientific Evidence",
        reliability: "High",
        lastUpdated: "2024-11-20",
        description: "Meta-analysis of nutritional research from PubMed database"
      }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'passed': return 'text-success bg-success/10 border-success/20';
      case 'failed': return 'text-error bg-error/10 border-error/20';
      case 'success': return 'text-success';
      default: return 'text-text-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed': return 'CheckCircle';
      case 'failed': return 'XCircle';
      case 'success': return 'CheckCircle';
      default: return 'Circle';
    }
  };

  const getImpactColor = (impact) => {
    if (impact?.startsWith('+')) return 'text-success';
    if (impact?.startsWith('-')) return 'text-error';
    return 'text-text-secondary';
  };

  const toggleRule = (id) => {
    setExpandedRule(expandedRule === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Score breakdown */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="Sigma" size={18} className="text-primary" />
          <h3 className="text-lg font-heading font-semibold text-text-primary">Score Breakdown</h3>
        </div>
        <div className="space-y-2">
          {contributions.map((c, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">{c.label}</span>
              <span className={`font-medium ${c.delta >= 0 ? 'text-success' : 'text-error'}`}>{c.delta >= 0 ? '+' : ''}{c.delta}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          <span className="font-medium text-text-primary">Final Score</span>
          <span className="font-bold text-text-primary">{totalScore} / 100</span>
        </div>
      </div>

      {/* Applied Rules (dynamic) */}
      <div>
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
          Applied Scoring Rules
        </h3>
        <div className="space-y-3">
          {evidenceData?.appliedRules?.map((rule) => (
            <div key={rule?.id} className="bg-card rounded-lg border border-border overflow-hidden">
              <div 
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleRule(rule?.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon 
                      name={getStatusIcon(rule?.status)} 
                      size={20} 
                      className={rule?.status === 'passed' ? 'text-success' : 'text-error'} 
                    />
                    <div>
                      <h4 className="font-medium text-text-primary">{rule?.name}</h4>
                      <span className="text-sm text-text-secondary">{rule?.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`font-medium ${getImpactColor(rule?.impact)}`}>
                      {rule?.impact}
                    </span>
                    <Icon 
                      name={expandedRule === rule?.id ? "ChevronUp" : "ChevronDown"} 
                      size={20} 
                      className="text-text-secondary" 
                    />
                  </div>
                </div>
              </div>
              
              {expandedRule === rule?.id && (
                <div className="px-4 pb-4 border-t border-border bg-muted/30">
                  <div className="pt-4 space-y-3">
                    <p className="text-sm text-text-secondary">
                      {rule?.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Data Sources */}
      <div>
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
          Data Sources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {evidenceData?.dataSources?.map((source, index) => (
            <div key={index} className="bg-card rounded-lg border border-border p-4">
              <div className="flex items-start space-x-3">
                <Icon name="Database" size={20} className="text-primary mt-1" />
                <div className="flex-1">
                  <h4 className="font-medium text-text-primary mb-1">{source?.name}</h4>
                  <p className="text-sm text-text-secondary mb-2">{source?.description}</p>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-text-secondary">Type:</span>
                      <span className="text-xs text-text-primary">{source?.type}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-text-secondary">Reliability:</span>
                      <span className="text-xs text-success">{source?.reliability}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-text-secondary">Updated:</span>
                      <span className="text-xs text-text-primary">{source?.lastUpdated}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EvidencePanel;