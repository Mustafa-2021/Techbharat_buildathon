import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import barcodeService from '../../../services/barcodeService';
import openFoodFactsService from '../../../services/openfoodfacts';

const BarcodeScanner = ({ onBarcodeDetected, isActive, onToggle }) => {
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const containerIdRef = useRef(`scanner_${Math.random().toString(36).slice(2)}`);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [hasPermission, setHasPermission] = useState(null);
  const [detectedBarcode, setDetectedBarcode] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isActive) {
      startScanning();
    } else {
      stopScanning();
    }

    return () => {
      stopScanning();
    };
  }, [isActive]);

  const startScanning = async () => {
    try {
      setError('');
      setIsProcessing(false);
      
      // Prefer html5-qrcode for faster detection
      await barcodeService?.startHtml5Qrcode(containerIdRef.current, async (result) => {
        if (isProcessing) return; // Prevent multiple simultaneous scans
        
        setIsProcessing(true);
        setDetectedBarcode(result?.code);
        
        try {
          // Validate barcode format
          const validation = barcodeService?.validateBarcode(result?.code);
          if (!validation?.valid) {
            setError('Invalid barcode format detected');
            setIsProcessing(false);
            return;
          }

          // Automatically fetch product data
          const productData = await openFoodFactsService?.getProductByBarcode(result?.code);
          const healthScore = openFoodFactsService?.calculateHealthScore(productData);
          
          // Stop scanning and pass data to parent
          stopScanning();
          onBarcodeDetected({
            ...productData,
            healthScore,
            scanMethod: 'automatic_scan',
            confidence: result?.confidence || 1.0,
            timestamp: new Date()?.toISOString()
          });
        } catch (fetchError) {
          console.error('Error fetching product data:', fetchError);
          setError('Product not found in database. Try manual entry.');
          setIsProcessing(false);
          setDetectedBarcode(null);
        }
      }, () => {}, { fps: 24, qrbox: 270 });

      setHasPermission(true);
      setIsScanning(true);
    } catch (err) {
      setError('Camera access denied. Please enable camera permissions.');
      setHasPermission(false);
      console.error('Scanner initialization error:', err);
    }
  };

  const stopScanning = () => {
    try {
      barcodeService?.stopHtml5Qrcode();
      setIsScanning(false);
      setDetectedBarcode(null);
      setIsProcessing(false);
    } catch (error) {
      console.error('Error stopping scanner:', error);
    }
  };

  const retryScanning = () => {
    setError('');
    setDetectedBarcode(null);
    setIsProcessing(false);
    startScanning();
  };

  if (!isActive) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 hover:shadow-card transition-spring">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Camera" size={24} className="text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-text-primary">Live Barcode Scanner</h3>
            <p className="text-sm text-text-secondary">Automatically scan and analyze product barcodes</p>
          </div>
          <Button variant="outline" onClick={onToggle}>
            Start Scanning
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">Live Barcode Scanner</h3>
            <p className="text-sm text-text-secondary">Position barcode within the scanning area</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onToggle}>
            <Icon name="X" size={20} />
          </Button>
        </div>
      </div>

      <div className="relative">
        {error ? (
          <div className="p-8 text-center">
            <Icon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
            <p className="text-error font-medium mb-4">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={retryScanning}>
                Try Again
              </Button>
              <Button variant="secondary" onClick={onToggle}>
                Use Manual Entry
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div 
              id={containerIdRef.current}
              ref={scannerRef}
              className="w-full h-64 sm:h-80 bg-black relative overflow-hidden"
            />
            
            {/* Scanning Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative">
                {/* Scanning Frame */}
                <div className="w-64 h-32 border-2 border-primary rounded-lg relative bg-black/10">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
                  
                  {/* Scanning Line Animation */}
                  <div className="absolute inset-x-0 top-1/2 h-0.5 bg-primary animate-pulse"></div>
                </div>
                
                {detectedBarcode && (
                  <div className="text-center text-white bg-primary/90 px-3 py-1 rounded-full text-sm mt-4">
                    {isProcessing ? 'Processing...' : `Found: ${detectedBarcode}`}
                  </div>
                )}
                
                {!detectedBarcode && (
                  <p className="text-center text-white bg-black/70 px-3 py-1 rounded-full text-sm mt-4">
                    Position barcode within the frame
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="p-4 bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              isScanning ? 'bg-success animate-pulse' : isProcessing ?'bg-warning animate-spin' : 'bg-muted'
            }`}></div>
            <span className="text-sm text-text-secondary">
              {isProcessing ? 'Processing barcode...' : isScanning ?'Scanning for barcodes...': 'Scanner inactive'}
            </span>
          </div>
          
          {detectedBarcode && !isProcessing && (
            <div className="flex items-center space-x-2 text-sm text-primary">
              <Icon name="CheckCircle" size={16} />
              <span>Barcode detected</span>
            </div>
          )}
        </div>
        
        <div className="mt-3 text-xs text-text-secondary">
          <p><strong>Tip:</strong> Hold your device steady and ensure good lighting for best results</p>
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;