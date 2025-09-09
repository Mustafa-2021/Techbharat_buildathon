import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import StatusNotificationBar from '../../components/ui/StatusNotificationBar';
import QuickActionFloatingButton from '../../components/ui/QuickActionFloatingButton';

// Import scanner components
import ScannerModeSelector from './components/ScannerModeSelector';
import BarcodeScanner from './components/BarcodeScanner';
import ManualBarcodeInput from './components/ManualBarcodeInput';
import ProductSearch from './components/ProductSearch';
import IngredientPhotoCapture from './components/IngredientPhotoCapture';
import RecentSearchHistory from './components/RecentSearchHistory';

const ProductScanner = () => {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState('barcode');
  const [notification, setNotification] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const saveRecentSearch = (item) => {
    try {
      const key = 'recent_searches';
      const allKey = 'search_history_all';
      const existingRaw = localStorage.getItem(key);
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const withoutDup = existing.filter(e => (e?.barcode && item?.barcode) ? e.barcode !== item.barcode : true);
      const next = [
        {
          name: item?.name || 'Product',
          brand: item?.brand || '',
          barcode: item?.barcode || '',
          searchMethod: item?.searchMethod || item?.scanMethod || 'unknown',
          timestamp: item?.timestamp || new Date()?.toISOString(),
          healthScore: item?.healthScore || 0,
          image: item?.image || ''
        },
        ...withoutDup
      ].slice(0, 5);
      localStorage.setItem(key, JSON.stringify(next));
      window.dispatchEvent(new CustomEvent('recentSearchUpdated'));

      // Persist full session history
      const allRaw = localStorage.getItem(allKey);
      const all = allRaw ? JSON.parse(allRaw) : [];
      const entry = {
        name: item?.name || 'Product',
        brand: item?.brand || '',
        barcode: item?.barcode || '',
        searchMethod: item?.searchMethod || item?.scanMethod || 'unknown',
        timestamp: item?.timestamp || new Date()?.toISOString(),
        healthScore: item?.healthScore || 0,
        image: item?.image || ''
      };
      // keep newest first, cap to last 200 entries
      const updatedAll = [entry, ...all].slice(0, 200);
      localStorage.setItem(allKey, JSON.stringify(updatedAll));
    } catch (_) {
      // ignore storage errors
    }
  };

  // Check for camera permissions on mount
  useEffect(() => {
    const checkCameraPermissions = async () => {
      try {
        const permissions = await navigator.permissions?.query({ name: 'camera' });
        if (permissions?.state === 'denied') {
          setNotification({
            type: 'warning',
            message: 'Camera access is required for barcode scanning and photo capture features.',
            actionLabel: 'Enable Camera',
            onAction: () => {
              setNotification(null);
            }
          });
        }
      } catch (error) {
        console.log('Camera permissions check not supported');
      }
    };

    checkCameraPermissions();
  }, []);

  const handleModeChange = (mode) => {
    setActiveMode(mode);
    setNotification(null);
  };

  const handleBarcodeDetected = async (productData) => {
    setIsProcessing(true);
    setNotification({
      type: 'loading',
      message: `Processing barcode: ${productData?.barcode || 'item'}...`
    });

    try {
      // Navigate to results with fetched product data
      navigate('/health-assessment-results', {
        state: {
          productData: {
            ...productData,
            searchMethod: productData?.scanMethod || 'barcode_scan',
            timestamp: productData?.timestamp || new Date()?.toISOString()
          }
        }
      });
      saveRecentSearch({ ...productData, searchMethod: productData?.scanMethod || 'barcode_scan' });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to process barcode. Please try again.',
        autoHide: true
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBarcodeSubmit = async (productData) => {
    setIsProcessing(true);
    setNotification({
      type: 'loading',
      message: `Loading product: ${productData?.name || productData?.barcode || 'item'}...`
    });

    try {
      // Navigate to results with fetched product data
      navigate('/health-assessment-results', {
        state: {
          productData: {
            ...productData,
            searchMethod: productData?.searchMethod || 'manual_entry',
            timestamp: productData?.timestamp || new Date()?.toISOString()
          }
        }
      });
      saveRecentSearch({ ...productData, searchMethod: productData?.searchMethod || 'manual_entry' });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Product not found. Please check the barcode and try again.',
        autoHide: true
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProductSelect = async (product) => {
    setIsProcessing(true);
    setNotification({
      type: 'loading',
      message: `Loading product: ${product?.name}...`
    });

    try {
      // Simulate API call delay
      //await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Navigate to results with product data
      navigate('/health-assessment-results', {
        state: {
          productData: {
            ...product,
            searchMethod: 'product_search',
            timestamp: new Date()?.toISOString()
          }
        }
      });
      saveRecentSearch({ ...product, searchMethod: 'product_search' });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to load product details. Please try again.',
        autoHide: true
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleIngredientAnalysis = async (analysisData) => {
    setIsProcessing(true);
    setNotification({
      type: 'loading',
      message: 'Processing ingredient analysis...'
    });

    try {
      // Navigate to results with OCR data
      navigate('/health-assessment-results', {
        state: {
          productData: {
            name: 'Product from Ingredient Analysis',
            ingredientsText: analysisData?.extracted_text || analysisData?.rawText || '',
            ingredients: analysisData?.ingredients || [],
            allergens: analysisData?.allergens || [],
            additives: analysisData?.additives || [],
            healthScore: typeof analysisData?.health_score === 'number' ? analysisData?.health_score : undefined,
            confidence: analysisData?.confidence,
            searchMethod: 'ocr_analysis',
            timestamp: new Date()?.toISOString()
          }
        }
      });
      saveRecentSearch({
        name: 'Product from Ingredient Analysis',
        healthScore: typeof analysisData?.health_score === 'number' ? analysisData?.health_score : 0,
        searchMethod: 'ocr_analysis',
        timestamp: new Date()?.toISOString()
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to process ingredient analysis. Please try again.',
        autoHide: true
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  const renderActiveScanner = () => {
    switch (activeMode) {
      case 'barcode':
        return (
          <BarcodeScanner
            onBarcodeDetected={handleBarcodeDetected}
            isActive={true}
            onToggle={() => setActiveMode(null)}
          />
        );
      case 'manual':
        return (
          <ManualBarcodeInput
            onBarcodeSubmit={handleBarcodeSubmit}
          />
        );
      case 'search':
        return (
          <ProductSearch
            onProductSelect={handleProductSelect}
          />
        );
      case 'ocr':
        return (
          <IngredientPhotoCapture
            onIngredientAnalysis={handleIngredientAnalysis}
            isActive={true}
            onToggle={() => setActiveMode(null)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Status Notification */}
      <StatusNotificationBar
        type={notification?.type}
        message={notification?.message}
        isVisible={!!notification}
        onDismiss={dismissNotification}
        autoHide={notification?.autoHide}
        actionLabel={notification?.actionLabel}
        onAction={notification?.onAction}
      />

      {/* Main Content */}
      <main className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Icon name="Scan" size={32} className="text-primary" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Product Scanner
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Scan, search, or capture product information to get instant health assessments and nutritional insights
            </p>
          </div>

          {/* Scanner Mode Selector */}
          <div className="mb-8">
            <ScannerModeSelector
              activeMode={activeMode}
              onModeChange={handleModeChange}
            />
          </div>

          {/* Active Scanner Interface */}
          {activeMode && (
            <div className="mb-8">
              {renderActiveScanner()}
            </div>
          )}

          {/* Recent Search History */}
          <div className="mb-8">
            <RecentSearchHistory
              onProductSelect={handleProductSelect}
            />
          </div>

          {/* Help Section */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                <Icon name="HelpCircle" size={20} className="text-text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary">Need Help?</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-text-primary mb-2">Scanning Tips</h4>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• Ensure good lighting for barcode scanning</li>
                  <li>• Hold camera steady and focus on the barcode</li>
                  <li>• Try different angles if barcode won't scan</li>
                  <li>• Use manual entry if camera scanning fails</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-text-primary mb-2">Search Tips</h4>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>• Search by product name or brand</li>
                  <li>• Use specific product names for better results</li>
                  <li>• Try partial names if exact match fails</li>
                  <li>• Check spelling and try variations</li>
                </ul>
              </div>
            </div>

            
          </div>
        </div>
      </main>

      {/* Quick Action Button */}
      <QuickActionFloatingButton isVisible={false} />

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-xl p-6 max-w-sm mx-4 text-center">
            <Icon name="Loader" size={32} className="text-primary mx-auto mb-4 animate-spin" />
            <p className="text-text-primary font-medium">Processing...</p>
            <p className="text-sm text-text-secondary mt-1">Please wait while we analyze your product</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductScanner;