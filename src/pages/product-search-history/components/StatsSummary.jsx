import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsSummary = ({ stats }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Package" size={20} className="text-primary" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-text-primary">{stats?.totalProducts}</p>
            <p className="text-sm text-text-secondary">Total Scanned</p>
          </div>
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="TrendingUp" size={20} className="text-success" />
          </div>
          <div>
            <p className={`text-2xl font-semibold ${getScoreColor(stats?.averageScore)}`}>
              {stats?.averageScore}/100
            </p>
            <p className="text-sm text-text-secondary">
              Average Score ({getScoreLabel(stats?.averageScore)})
            </p>
          </div>
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
            <Icon name="Calendar" size={20} className="text-warning" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-text-primary">{stats?.thisWeek}</p>
            <p className="text-sm text-text-secondary">This Week</p>
          </div>
        </div>
      </div>
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Star" size={20} className="text-secondary" />
          </div>
          <div>
            <p className="text-2xl font-semibold text-text-primary">{stats?.topCategory}</p>
            <p className="text-sm text-text-secondary">Top Category</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSummary;