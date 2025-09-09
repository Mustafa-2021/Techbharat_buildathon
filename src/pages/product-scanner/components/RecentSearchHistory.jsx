import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const RecentSearchHistory = ({ onProductSelect }) => {
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const key = 'recent_searches';
    const load = () => {
      try {
        const raw = localStorage.getItem(key);
        const list = raw ? JSON.parse(raw) : [];
        const hydrated = list.map((i, idx) => ({ ...i, id: idx + 1, timestamp: new Date(i?.timestamp) }));
        setRecentSearches(hydrated);
      } catch (_) {
        setRecentSearches([]);
      } finally {
        setIsLoading(false);
      }
    };
    load();
    const handler = () => load();
    window.addEventListener('recentSearchUpdated', handler);
    return () => window.removeEventListener('recentSearchUpdated', handler);
  }, []);

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return `${days}d ago`;
    }
  };

  const getSearchMethodIcon = (method) => {
    switch (method) {
      case 'barcode': case'camera':
        return 'Camera';
      case 'search':
        return 'Search';
      case 'ocr': case 'ocr_analysis':
        return 'FileImage';
      default:
        return 'Clock';
    }
  };

  const getSearchMethodLabel = (method) => {
    switch (method) {
      case 'barcode':
        return 'Barcode Scan';
      case 'camera':
        return 'Camera Scan';
      case 'search': case 'product_search':
        return 'Product Search';
      case 'ocr': case 'ocr_analysis':
        return 'OCR Capture';
      default:
        return 'Unknown';
    }
  };

  const getHealthScoreColor = (score) => {
    if (score >= 70) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-error';
  };

  const getHealthScoreBg = (score) => {
    if (score >= 70) return 'bg-success/10';
    if (score >= 50) return 'bg-warning/10';
    return 'bg-error/10';
  };

  const handleProductSelect = (product) => {
    onProductSelect({
      name: product?.name,
      brand: product?.brand,
      barcode: product?.barcode,
      image: product?.image,
      searchMethod: product?.searchMethod,
      timestamp: product?.timestamp,
      healthScore: product?.healthScore
    });
  };

  const clearHistory = () => {
    try {
      localStorage.removeItem('recent_searches');
      setRecentSearches([]);
    } catch (_) {}
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
            <Icon name="Clock" size={24} className="text-text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Recent Searches</h3>
            <p className="text-sm text-text-secondary">Loading your search history...</p>
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3]?.map((i) => (
            <div key={i} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg animate-pulse">
              <div className="w-12 h-12 bg-muted rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
              <div className="w-16 h-6 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (recentSearches?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
            <Icon name="Clock" size={24} className="text-text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Recent Searches</h3>
            <p className="text-sm text-text-secondary">Your search history will appear here</p>
          </div>
        </div>
        
        <div className="text-center py-8">
          <Icon name="Search" size={48} className="text-text-secondary mx-auto mb-4" />
          <p className="text-text-primary font-medium mb-2">No recent searches</p>
          <p className="text-sm text-text-secondary">Start scanning or searching for products to see your history</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
            <Icon name="Clock" size={24} className="text-text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Recent Searches</h3>
            <p className="text-sm text-text-secondary">{recentSearches?.length} recent items</p>
          </div>
        </div>
        
        <Button variant="ghost" size="sm" onClick={clearHistory}>
          <Icon name="Trash2" size={16} className="mr-2" />
          Clear
        </Button>
      </div>
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {recentSearches?.map((product) => (
          <button
            key={product?.id}
            onClick={() => handleProductSelect(product)}
            className="w-full flex items-center space-x-3 p-3 bg-muted/30 hover:bg-accent rounded-lg transition-spring text-left group"
          >
            <div className="relative">
              <Image
                src={product?.image}
                alt={product?.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-surface border border-border rounded-full flex items-center justify-center">
                <Icon 
                  name={getSearchMethodIcon(product?.searchMethod)} 
                  size={10} 
                  className="text-text-secondary" 
                />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="font-medium text-text-primary truncate group-hover:text-primary">
                {product?.name}
              </div>
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <span>{product?.brand}</span>
                <span>•</span>
                <span>{getSearchMethodLabel(product?.searchMethod)}</span>
                <span>•</span>
                <span>{formatTimestamp(product?.timestamp)}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthScoreBg(product?.healthScore)} ${getHealthScoreColor(product?.healthScore)}`}>
                {product?.healthScore}
              </div>
              <Icon name="ArrowRight" size={16} className="text-text-secondary group-hover:text-primary" />
            </div>
          </button>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => window.location.href = '/product-search-history'}
          className="w-full"
        >
          View Full History
          <Icon name="ExternalLink" size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default RecentSearchHistory;