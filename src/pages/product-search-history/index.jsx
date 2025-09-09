import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import QuickActionFloatingButton from '../../components/ui/QuickActionFloatingButton';
import StatusNotificationBar from '../../components/ui/StatusNotificationBar';

import Button from '../../components/ui/Button';
import HistoryItem from './components/HistoryItem';
import FilterPanel from './components/FilterPanel';
import StatsSummary from './components/StatsSummary';
import BulkActions from './components/BulkActions';
import EmptyState from './components/EmptyState';

const ProductSearchHistory = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [notification, setNotification] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'date-desc',
    category: '',
    scoreRange: '',
    dateRange: ''
  });
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);

  const loadSessionHistory = () => {
    try {
      const allRaw = localStorage.getItem('search_history_all');
      const list = allRaw ? JSON.parse(allRaw) : [];
      return list.map((item, idx) => ({
        id: idx + 1,
        name: item?.name,
        brand: item?.brand,
        barcode: item?.barcode,
        category: 'recent',
        healthScore: item?.healthScore || 0,
        scanDate: item?.timestamp,
        image: item?.image,
      }));
    } catch (_) {
      return [];
    }
  };

  // Calculate statistics
  const calculateStats = (productList) => {
    if (productList?.length === 0) {
      return {
        totalProducts: 0,
        averageScore: 0,
        thisWeek: 0,
        topCategory: 'None'
      };
    }

    const totalProducts = productList?.length;
    const averageScore = Math.round(
      productList?.reduce((sum, product) => sum + (product?.healthScore || 0), 0) / totalProducts
    );

    const oneWeekAgo = new Date();
    oneWeekAgo?.setDate(oneWeekAgo?.getDate() - 7);
    const thisWeek = productList?.filter(
      product => new Date(product.scanDate) >= oneWeekAgo
    )?.length;

    const categoryCount = productList?.reduce((acc, product) => {
      acc[product.category] = (acc?.[product?.category] || 0) + 1;
      return acc;
    }, {});

    const topCategory = Object.keys(categoryCount)?.reduce((a, b) =>
      categoryCount?.[a] > categoryCount?.[b] ? a : b, 'None'
    );

    return {
      totalProducts,
      averageScore,
      thisWeek,
      topCategory: topCategory?.charAt(0)?.toUpperCase() + topCategory?.slice(1)
    };
  };

  // Filter and sort products
  const applyFilters = (productList, filterOptions) => {
    let filtered = [...productList];

    // Search filter
    if (filterOptions?.search) {
      const searchTerm = filterOptions?.search?.toLowerCase();
      filtered = filtered?.filter(product =>
        product?.name?.toLowerCase()?.includes(searchTerm) ||
        product?.brand?.toLowerCase()?.includes(searchTerm) ||
        product?.barcode?.includes(searchTerm)
      );
    }

    // Category filter
    if (filterOptions?.category) {
      filtered = filtered?.filter(product => product?.category === filterOptions?.category);
    }

    // Score range filter
    if (filterOptions?.scoreRange) {
      const [min, max] = filterOptions?.scoreRange?.split('-')?.map(Number);
      filtered = filtered?.filter(product => 
        (product?.healthScore || 0) >= min && (product?.healthScore || 0) <= max
      );
    }

    // Date range filter
    if (filterOptions?.dateRange) {
      const filterDate = new Date(filterOptions.dateRange);
      filtered = filtered?.filter(product => 
        new Date(product.scanDate) >= filterDate
      );
    }

    // Sort
    filtered?.sort((a, b) => {
      switch (filterOptions?.sortBy) {
        case 'date-asc':
          return new Date(a.scanDate) - new Date(b.scanDate);
        case 'date-desc':
          return new Date(b.scanDate) - new Date(a.scanDate);
        case 'score-asc':
          return (a?.healthScore || 0) - (b?.healthScore || 0);
        case 'score-desc':
          return (b?.healthScore || 0) - (a?.healthScore || 0);
        case 'name-asc':
          return a?.name?.localeCompare(b?.name);
        case 'name-desc':
          return b?.name?.localeCompare(a?.name);
        default:
          return new Date(b.scanDate) - new Date(a.scanDate);
      }
    });

    return filtered;
  };

  // Initialize data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      setProducts(loadSessionHistory());
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Apply filters when products or filters change
  useEffect(() => {
    let filtered = applyFilters(products, filters);
    setFilteredProducts(filtered);
  }, [products, filters]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 1024) {
        setIsFilterCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleRescan = (product) => {
    setNotification({
      type: 'loading',
      message: `Rescanning ${product?.name}...`,
      isVisible: true,
      autoHide: true,
      autoHideDelay: 2000
    });

    setTimeout(() => {
      navigate('/product-scanner', { 
        state: { 
          productData: product,
          isRescan: true 
        } 
      });
    }, 2000);
  };

  const handleViewDetails = (product) => {
    navigate('/health-assessment-results', { 
      state: { 
        productData: product 
      } 
    });
  };

  const handleRemove = (productId) => {
    setProducts(prev => prev?.filter(p => p?.id !== productId));
    setSelectedProducts(prev => prev?.filter(id => id !== productId));
    setNotification({
      type: 'success',
      message: 'Product removed from history',
      isVisible: true,
      autoHide: true,
      autoHideDelay: 3000
    });
  };

  const handleSelectAll = () => {
    setSelectedProducts(filteredProducts?.map(p => p?.id));
  };

  const handleClearSelection = () => {
    setSelectedProducts([]);
  };

  const handleClearAll = () => {
    setProducts([]);
    setSelectedProducts([]);
    localStorage.removeItem('search_history_all');
    setNotification({
      type: 'success',
      message: 'All history cleared successfully',
      isVisible: true,
      autoHide: true,
      autoHideDelay: 3000
    });
  };

  const handleClearDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    setProducts(prev => prev?.filter(product => {
      const scanDate = new Date(product.scanDate);
      return scanDate < start || scanDate > end;
    }));

    setNotification({
      type: 'success',
      message: `Products from ${startDate} to ${endDate} cleared`,
      isVisible: true,
      autoHide: true,
      autoHideDelay: 3000
    });
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(filteredProducts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nutriscan-history-${new Date()?.toISOString()?.split('T')?.[0]}.json`;
    link?.click();
    URL.revokeObjectURL(url);

    setNotification({
      type: 'success',
      message: 'History data exported successfully',
      isVisible: true,
      autoHide: true,
      autoHideDelay: 3000
    });
  };

  const handleStartScanning = () => {
    navigate('/product-scanner');
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      sortBy: 'date-desc',
      category: '',
      scoreRange: '',
      dateRange: ''
    });
  };

  const stats = calculateStats(products);
  const hasActiveFilters = filters?.search || filters?.category || filters?.scoreRange || filters?.dateRange;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-64 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {[...Array(4)]?.map((_, i) => (
                  <div key={i} className="h-24 bg-muted rounded-lg"></div>
                ))}
              </div>
              <div className="h-32 bg-muted rounded-lg mb-6"></div>
              <div className="space-y-4">
                {[...Array(5)]?.map((_, i) => (
                  <div key={i} className="h-24 bg-muted rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {notification?.isVisible && (
        <StatusNotificationBar
          type={notification?.type}
          message={notification?.message}
          isVisible={notification?.isVisible}
          autoHide={notification?.autoHide}
          autoHideDelay={notification?.autoHideDelay}
          onDismiss={() => setNotification(prev => ({ ...prev, isVisible: false }))}
        />
      )}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-text-primary mb-2">
                Scan History
              </h1>
              <p className="text-text-secondary">
                Browse and manage your product scanning history
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button
                variant="default"
                onClick={handleStartScanning}
                iconName="Camera"
                iconPosition="left"
                iconSize={18}
              >
                Scan New Product
              </Button>
            </div>
          </div>

          {/* Products List */}
          {filteredProducts?.length === 0 ? (
            <EmptyState
              hasFilters={hasActiveFilters}
              onClearFilters={handleClearFilters}
              onStartScanning={handleStartScanning}
            />
          ) : (
            <div className="space-y-4">
              {filteredProducts?.map((product) => (
                <HistoryItem
                  key={product?.id}
                  product={product}
                  onRescan={handleRescan}
                  onViewDetails={handleViewDetails}
                  onRemove={handleRemove}
                  isMobile={isMobile}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <QuickActionFloatingButton />
    </div>
  );
};

export default ProductSearchHistory;