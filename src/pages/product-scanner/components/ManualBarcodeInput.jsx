import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import barcodeService from '../../../services/barcodeService';
import openFoodFactsService from '../../../services/openfoodfacts';

const ManualBarcodeInput = ({ onBarcodeSubmit }) => {
  const [barcode, setBarcode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [validationResult, setValidationResult] = useState(null);

  const handleInputChange = (e) => {
    const value = e?.target?.value?.replace(/\D/g, ''); // Remove non-digits
    setBarcode(value);
    setError('');
    
    // Real-time validation
    if (value?.length > 0) {
      const validation = barcodeService?.validateBarcode(value);
      setValidationResult(validation);
    } else {
      setValidationResult(null);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!barcode?.trim()) {
      setError('Please enter a barcode');
      return;
    }

    // Validate barcode format
    const validation = barcodeService?.validateBarcode(barcode);
    if (!validation?.valid) {
      setError(validation?.error || 'Invalid barcode format');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Fetch product data from OpenFoodFacts
      const productData = await openFoodFactsService?.getProductByBarcode(barcode);
      const healthScore = openFoodFactsService?.calculateHealthScore(productData);
      
      // Call parent callback with enhanced data
      onBarcodeSubmit({
        ...productData,
        healthScore,
        scanMethod: 'manual_entry',
        timestamp: new Date()?.toISOString(),
        validationType: validation?.type
      });
      
      // Clear form after successful submission
      setBarcode('');
      setValidationResult(null);
    } catch (fetchError) {
      console.error('Error fetching product:', fetchError);
      setError('Product not found in database. Please check the barcode number.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setBarcode('');
    setError('');
    setValidationResult(null);
  };

  // Sample barcodes for testing
  const sampleBarcodes = [
    { code: '3017620422003', name: 'Nutella', type: 'EAN-13' },
    { code: '5449000000996', name: 'Coca-Cola', type: 'EAN-13' },
    { code: '8901491100519', name: 'Kurkure', type: 'EAN-13' },
    { code: '3168930010265', name: 'Activia Yogurt', type: 'EAN-13' }
  ];

  const fillSampleBarcode = (code) => {
    setBarcode(code);
    const validation = barcodeService?.validateBarcode(code);
    setValidationResult(validation);
    setError('');
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
          <Icon name="Hash" size={24} className="text-info" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Manual Barcode Entry</h3>
          <p className="text-sm text-text-secondary">Enter barcode number manually for product lookup</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="barcode-input" className="text-sm font-medium text-text-primary">
            Barcode Number
          </label>
          <div className="relative">
            <Input
              id="barcode-input"
              type="text"
              placeholder="Enter 8, 12, or 13 digit barcode..."
              value={barcode}
              onChange={handleInputChange}
              className={`pr-20 ${
                error ? 'border-error' : validationResult?.valid ?'border-success' : ''
              }`}
              disabled={isProcessing}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
              {validationResult?.valid && (
                <Icon name="CheckCircle" size={16} className="text-success" />
              )}
              {barcode && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-text-secondary hover:text-text-primary transition-spring"
                  disabled={isProcessing}
                >
                  <Icon name="X" size={16} />
                </button>
              )}
            </div>
          </div>
          
          {/* Real-time validation feedback */}
          {validationResult && (
            <div className={`text-sm flex items-center space-x-2 ${
              validationResult?.valid ? 'text-success' : 'text-error'
            }`}>
              <Icon 
                name={validationResult?.valid ? "CheckCircle" : "AlertCircle"} 
                size={14} 
              />
              <span>
                {validationResult?.valid 
                  ? `Valid ${validationResult?.type} barcode` 
                  : validationResult?.error
                }
              </span>
            </div>
          )}
          
          {error && (
            <div className="text-sm text-error flex items-center space-x-2">
              <Icon name="AlertCircle" size={14} />
              <span>{error}</span>
            </div>
          )}
        </div>

        <Button
          type="submit"
          variant="default"
          className="w-full"
          disabled={!barcode?.trim() || isProcessing || !validationResult?.valid}
          loading={isProcessing}
        >
          {isProcessing ? 'Looking up product...' : 'Lookup Product'}
        </Button>
      </form>

      {/* Sample Barcodes */}
      <div className="mt-6 pt-6 border-t border-border">
        <h4 className="text-sm font-medium text-text-primary mb-3">Try Sample Barcodes:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {sampleBarcodes?.map((sample, index) => (
            <button
              key={index}
              onClick={() => fillSampleBarcode(sample?.code)}
              className="p-3 text-left bg-muted hover:bg-accent rounded-lg transition-spring"
              disabled={isProcessing}
            >
              <div className="text-sm font-medium text-text-primary">{sample?.name}</div>
              <div className="text-xs text-text-secondary font-mono">{sample?.code}</div>
              <div className="text-xs text-info">{sample?.type}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Barcode Format Help */}
      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Info" size={16} className="text-text-secondary mt-0.5 flex-shrink-0" />
          <div className="text-xs text-text-secondary">
            <p className="font-medium mb-1">Supported Barcode Formats:</p>
            <ul className="space-y-1">
              <li>• <strong>EAN-13:</strong> 13 digits (most common worldwide)</li>
              <li>• <strong>UPC-A:</strong> 12 digits (common in US/Canada)</li>
              <li>• <strong>EAN-8:</strong> 8 digits (short format)</li>
              <li>• <strong>Code 39:</strong> Alphanumeric codes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualBarcodeInput;