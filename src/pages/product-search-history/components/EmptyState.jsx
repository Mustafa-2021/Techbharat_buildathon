import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ 
  hasFilters = false, 
  onClearFilters = null, 
  onStartScanning = null 
}) => {
  if (hasFilters) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Search" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-text-primary mb-2">
          No products match your filters
        </h3>
        <p className="text-text-secondary mb-6 max-w-md mx-auto">
          Try adjusting your search criteria or clearing filters to see more results.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
          <Button
            variant="outline"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
            iconSize={16}
          >
            Clear Filters
          </Button>
          <Button
            variant="default"
            onClick={onStartScanning}
            iconName="Camera"
            iconPosition="left"
            iconSize={16}
          >
            Scan New Product
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-12 text-center">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon name="Package" size={40} className="text-primary" />
      </div>
      <h3 className="text-xl font-medium text-text-primary mb-3">
        No scan history yet
      </h3>
      <p className="text-text-secondary mb-8 max-w-md mx-auto">
        Start scanning products to build your health assessment history. Your scanned products will appear here for easy access and comparison.
      </p>
      <Button
        variant="default"
        size="lg"
        onClick={onStartScanning}
        iconName="Camera"
        iconPosition="left"
        iconSize={20}
      >
        Start Scanning Products
      </Button>
      
      <div className="mt-8 pt-8 border-t border-border">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-text-secondary">
          <div className="flex items-center justify-center space-x-2">
            <Icon name="RotateCcw" size={16} />
            <span>Quick re-scan</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Icon name="TrendingUp" size={16} />
            <span>Track health scores</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Icon name="Download" size={16} />
            <span>Export data</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;