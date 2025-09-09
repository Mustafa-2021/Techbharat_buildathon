import React from 'react';
import Icon from '../../../components/AppIcon';

const NutriScoreDisplay = ({ score, grade, productName }) => {
  const resolvedScore = typeof score === 'number' ? score : 0;
  const resolvedName = productName || 'Analyzed Product';
  const resolvedGrade = grade || 'C';
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-success/10';
    if (score >= 60) return 'bg-warning/10';
    return 'bg-error/10';
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A': return 'bg-success text-success-foreground';
      case 'B': return 'bg-warning text-warning-foreground';
      case 'C': return 'bg-amber-500 text-white';
      case 'D': return 'bg-orange-500 text-white';
      case 'E': return 'bg-error text-error-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-card">
      <div className="text-center">
        <h1 className="text-2xl font-heading font-semibold text-text-primary mb-2">
          {resolvedName}
        </h1>
        
        <div className="flex items-center justify-center space-x-6 mb-6">
          {/* Nutri-Score Circle */}
          <div className={`relative w-24 h-24 rounded-full ${getScoreBg(resolvedScore)} flex items-center justify-center`}>
            <div className="text-center">
              <div className={`text-3xl font-heading font-bold ${getScoreColor(resolvedScore)}`}>
                {resolvedScore}
              </div>
              <div className="text-xs text-text-secondary">out of 100</div>
            </div>
          </div>

          {/* Grade Badge */}
          <div className={`w-16 h-16 rounded-lg ${getGradeColor(resolvedGrade)} flex items-center justify-center`}>
            <span className="text-2xl font-heading font-bold">{resolvedGrade}</span>
          </div>
        </div>

        {/* Score Bar */}
        <div className="w-full bg-muted rounded-full h-3 mb-4">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              resolvedScore >= 80 ? 'bg-success' : resolvedScore >= 60 ? 'bg-warning' : 'bg-error'
            }`}
            style={{ width: `${resolvedScore}%` }}
          />
        </div>

        {/* Score Labels */}
        <div className="flex justify-between text-xs text-text-secondary mb-4">
          <span>Poor (0-39)</span>
          <span>Fair (40-59)</span>
          <span>Good (60-79)</span>
          <span>Excellent (80-100)</span>
        </div>

        {/* Health Rating */}
        <div className="flex items-center justify-center space-x-2">
          <Icon name="Heart" size={20} className={getScoreColor(resolvedScore)} />
          <span className={`font-medium ${getScoreColor(resolvedScore)}`}>
            {resolvedScore >= 80 ? 'Excellent Choice' : resolvedScore >= 60 ? 'Good Choice' : 'Consider Alternatives'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NutriScoreDisplay;