import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import csvExportService from '../../../services/csvExport';

const ActionButtons = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Get product data from location state
  const productData = location?.state?.productData || {};

  const handleExportData = async () => {
    setIsExporting(true);
    
    try {
      // Prepare comprehensive data for CSV export
      const exportData = {
        productName: productData?.name || 'Unknown Product',
        brand: productData?.brand || 'Unknown Brand',
        barcode: productData?.barcode || 'N/A',
        nutriscore: productData?.nutriscore || 'N/A',
        healthScore: productData?.healthScore || 0,
        scanDate: new Date()?.toLocaleDateString(),
        searchMethod: productData?.searchMethod || productData?.scanMethod || 'Unknown',
        nutritionalValues: productData?.nutritionalValues || {},
        ingredients: productData?.ingredients || [],
        additives: productData?.additives || [],
        allergens: productData?.allergens || [],
        recommendations: productData?.recommendations || [],
        analysisMethod: productData?.analysisMethod || 'standard',
        confidence: productData?.confidence || 1.0,
        timestamp: productData?.timestamp || new Date()?.toISOString()
      };

      await csvExportService?.exportProductAnalysis(exportData);
      
      // Show success feedback
      const event = new CustomEvent('showNotification', {
        detail: {
          type: 'success',
          message: 'Product analysis exported successfully!',
          autoHide: true
        }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Export failed:', error);
      const event = new CustomEvent('showNotification', {
        detail: {
          type: 'error',
          message: 'Export failed. Please try again.',
          autoHide: true
        }
      });
      window.dispatchEvent(event);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveReport = async () => {
    setIsSaving(true);
    
    try {
      // In a real app, this would save to database or local storage
      const savedData = {
        ...productData,
        savedAt: new Date()?.toISOString(),
        id: Date.now()?.toString()
      };
      
      // Save to localStorage for now
      const existingHistory = JSON.parse(localStorage.getItem('productHistory') || '[]');
      existingHistory?.unshift(savedData);
      localStorage.setItem('productHistory', JSON.stringify(existingHistory?.slice(0, 50))); // Keep last 50
      
      const event = new CustomEvent('showNotification', {
        detail: {
          type: 'success',
          message: 'Product saved to your history!',
          autoHide: true
        }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Save failed:', error);
      const event = new CustomEvent('showNotification', {
        detail: {
          type: 'error',
          message: 'Save failed. Please try again.',
          autoHide: true
        }
      });
      window.dispatchEvent(event);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShareReport = async () => {
    setIsSharing(true);
    
    try {
      const shareText = `Health Analysis: ${productData?.name || 'Product'}\n` +
                       `Health Score: ${productData?.healthScore || 0}/100\n` +
                       `${productData?.nutriscore ? `Nutri-Score: ${productData?.nutriscore}\n` : ''}` +
                       `Analyzed with NutriScan Pro`;
      
      if (navigator?.share) {
        await navigator?.share({
          title: `Health Analysis: ${productData?.name || 'Product'}`,
          text: shareText,
          url: window?.location?.href
        });
      } else {
        // Fallback to copy to clipboard
        await navigator?.clipboard?.writeText(shareText + `\n${window?.location?.href}`);
        const event = new CustomEvent('showNotification', {
          detail: {
            type: 'success',
            message: 'Analysis details copied to clipboard!',
            autoHide: true
          }
        });
        window.dispatchEvent(event);
      }
    } catch (error) {
      if (error?.name !== 'AbortError') { // User cancelled share
        console.error('Share failed:', error);
        const event = new CustomEvent('showNotification', {
          detail: {
            type: 'error',
            message: 'Sharing failed. Please try again.',
            autoHide: true
          }
        });
        window.dispatchEvent(event);
      }
    } finally {
      setIsSharing(false);
    }
  };

  const handleNewScan = () => {
    navigate('/product-scanner');
  };

  const handleViewHistory = () => {
    navigate('/product-search-history');
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 shadow-card">
      <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
        Quick Actions
      </h3>
      
      <div className="space-y-3">
        {/* Export Data (CSV) */}
        <Button 
          variant="default" 
          className="w-full justify-start"
          onClick={handleExportData}
          disabled={isExporting}
        >
          <Icon 
            name={isExporting ? "Loader" : "Download"} 
            size={16} 
            className={`mr-3 ${isExporting ? 'animate-spin' : ''}`} 
          />
          {isExporting ? 'Exporting...' : 'Export Analysis (CSV)'}
        </Button>

        {/* Save Report */}
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={handleSaveReport}
          disabled={isSaving}
        >
          <Icon 
            name={isSaving ? "Loader" : "Bookmark"} 
            size={16} 
            className={`mr-3 ${isSaving ? 'animate-spin' : ''}`} 
          />
          {isSaving ? 'Saving...' : 'Save to History'}
        </Button>

        {/* Share Report */}
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={handleShareReport}
          disabled={isSharing}
        >
          <Icon 
            name={isSharing ? "Loader" : "Share2"} 
            size={16} 
            className={`mr-3 ${isSharing ? 'animate-spin' : ''}`} 
          />
          {isSharing ? 'Sharing...' : 'Share Analysis'}
        </Button>

        <div className="border-t border-border pt-3 mt-4">
          {/* Navigation Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant="ghost"
              onClick={handleNewScan}
              className="w-full justify-start"
            >
              <Icon name="Scan" size={16} className="mr-2" />
              New Scan
            </Button>
            
            <Button
              variant="ghost"
              onClick={handleViewHistory}
              className="w-full justify-start"
            >
              <Icon name="History" size={16} className="mr-2" />
              View History
            </Button>
          </div>
        </div>
      </div>

      {/* Export Info */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="text-xs text-text-secondary">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Info" size={12} className="flex-shrink-0" />
            <span className="font-medium">CSV Export includes:</span>
          </div>
          <ul className="space-y-1 ml-4 text-xs">
            <li>• Complete nutritional breakdown</li>
            <li>• Detailed ingredient analysis</li>
            <li>• Health score and recommendations</li>
            <li>• Allergen and additive information</li>
            <li>• Analysis metadata and timestamps</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons;