import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const HistoryItem = ({ 
  product, 
  onRescan, 
  onViewDetails, 
  onRemove,
  isMobile = false 
}) => {
  const getHealthScoreColor = (score) => {
    if (score >= 80) return 'text-success bg-success/10';
    if (score >= 60) return 'text-warning bg-warning/10';
    return 'text-error bg-error/10';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryIcon = (category) => {
    const categoryIcons = {
      'beverages': 'Coffee',
      'snacks': 'Cookie',
      'dairy': 'Milk',
      'meat': 'Beef',
      'fruits': 'Apple',
      'vegetables': 'Carrot',
      'grains': 'Wheat',
      'condiments': 'Droplets',
      'frozen': 'Snowflake',
      'bakery': 'Cake'
    };
    return categoryIcons?.[category?.toLowerCase()] || 'Package';
  };

  if (isMobile) {
    return (
      <div className="bg-card border border-border rounded-lg p-4 shadow-card">
        <div className="flex items-start space-x-3">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
            {product?.image ? (
              <Image 
                src={product?.image} 
                alt={product?.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Icon name={getCategoryIcon(product?.category)} size={24} className="text-muted-foreground" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-text-primary text-sm leading-tight truncate pr-2">
                {product?.name}
              </h3>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthScoreColor(product?.healthScore)}`}>
                {product?.healthScore}/100
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-xs text-text-secondary mb-3">
              <Icon name="Clock" size={12} />
              <span>{formatDate(product?.scanDate)}</span>
              {product?.category && (
                <>
                  <span>•</span>
                  <span className="capitalize">{product?.category}</span>
                </>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="xs"
                onClick={() => onRescan(product)}
                iconName="RotateCcw"
                iconSize={12}
              >
                Rescan
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onViewDetails(product)}
                iconName="Eye"
                iconSize={12}
              >
                Details
              </Button>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => onRemove(product?.id)}
                iconName="Trash2"
                iconSize={12}
                className="text-error hover:text-error"
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-card transition-spring">
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
          {product?.image ? (
            <Image 
              src={product?.image} 
              alt={product?.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Icon name={getCategoryIcon(product?.category)} size={28} className="text-muted-foreground" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-medium text-text-primary text-lg leading-tight">
                {product?.name}
              </h3>
              {product?.brand && (
                <p className="text-sm text-text-secondary mt-1">{product?.brand}</p>
              )}
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getHealthScoreColor(product?.healthScore)}`}>
              {product?.healthScore}/100
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-text-secondary mb-3">
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} />
              <span>{formatDate(product?.scanDate)}</span>
            </div>
            {product?.category && (
              <div className="flex items-center space-x-1">
                <Icon name={getCategoryIcon(product?.category)} size={14} />
                <span className="capitalize">{product?.category}</span>
              </div>
            )}
            {product?.barcode && (
              <div className="flex items-center space-x-1">
                <Icon name="Hash" size={14} />
                <span>{product?.barcode}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onRescan(product)}
              iconName="RotateCcw"
              iconPosition="left"
              iconSize={16}
            >
              Rescan Product
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(product)}
              iconName="Eye"
              iconPosition="left"
              iconSize={16}
            >
              View Details
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(product?.id)}
              iconName="Trash2"
              iconPosition="left"
              iconSize={16}
              className="text-error hover:text-error"
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryItem;