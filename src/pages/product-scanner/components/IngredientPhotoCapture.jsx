import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import ingredientAnalysisService from '../../../services/ingredientAnalysis';

const IngredientPhotoCapture = ({ onIngredientAnalysis, isActive, onToggle }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [hasPermission, setHasPermission] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  useEffect(() => {
    if (isActive && !capturedImage) {
      startCamera();
    } else if (!isActive) {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isActive, capturedImage]);

  const startCamera = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices?.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      if (videoRef?.current) {
        videoRef.current.srcObject = stream;
        setHasPermission(true);
        setIsCapturing(true);
      }
    } catch (err) {
      setError('Camera access denied. Please enable camera permissions or upload an image.');
      setHasPermission(false);
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (videoRef?.current && videoRef?.current?.srcObject) {
      const tracks = videoRef?.current?.srcObject?.getTracks();
      tracks?.forEach(track => track?.stop());
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    if (!videoRef?.current || !canvasRef?.current) return;

    const canvas = canvasRef?.current;
    const video = videoRef?.current;
    const context = canvas?.getContext('2d');

    canvas.width = video?.videoWidth;
    canvas.height = video?.videoHeight;
    context?.drawImage(video, 0, 0);

    const imageDataUrl = canvas?.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageDataUrl);
    stopCamera();
  };

  const handleFileUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (file && file?.type?.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e?.target?.result);
        stopCamera();
      };
      reader?.readAsDataURL(file);
    }
  };

  const analyzeIngredients = async () => {
    if (!capturedImage) return;

    setIsAnalyzing(true);
    setError('');
    setAnalysisProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      // Extract base64 from data URL
      const base64Image = capturedImage?.split(',')?.[1];
      
      // Use OpenAI GPT-5 for ingredient analysis
      const analysisResult = await ingredientAnalysisService?.analyzeIngredientImage(base64Image);
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      
      // Enhanced result with additional metadata
      const enhancedResult = {
        ...analysisResult,
        image: capturedImage,
        analysisMethod: 'openai_vision',
        timestamp: new Date()?.toISOString(),
        processingTime: Date.now() - Date.now() // Would be calculated properly in real implementation
      };
      
      onIngredientAnalysis(enhancedResult);
      
      // Reset state
      setCapturedImage(null);
      onToggle();
    } catch (err) {
      console.error('Ingredient analysis error:', err);
      setError('Failed to analyze ingredients. Please ensure the image is clear and try again.');
      setAnalysisProgress(0);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setError('');
    setAnalysisProgress(0);
    startCamera();
  };

  if (!isActive) {
    return (
      <div className="bg-card border border-border rounded-xl p-6 hover:shadow-card transition-spring">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="FileImage" size={24} className="text-success" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-text-primary">AI Ingredient Analysis</h3>
            <p className="text-sm text-text-secondary">Capture ingredient list and get AI-powered health analysis</p>
          </div>
          <Button variant="outline" onClick={onToggle}>
            Start Analysis
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
            <h3 className="text-lg font-semibold text-text-primary">AI Ingredient Analysis</h3>
            <p className="text-sm text-text-secondary">Mustafa special</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onToggle}>
            <Icon name="X" size={20} />
          </Button>
        </div>
      </div>
      <div className="relative">
        {capturedImage ? (
          // Captured Image Preview
          (<div className="relative">
            <Image
              src={capturedImage}
              alt="Captured ingredient list"
              className="w-full h-64 sm:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              {isAnalyzing && (
                <div className="bg-black/80 text-white px-4 py-3 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <Icon name="Loader" size={20} className="animate-spin" />
                    <span className="font-medium">Analyzing ingredients with AI...</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${analysisProgress}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-center mt-1">{analysisProgress}%</div>
                </div>
              )}
            </div>
          </div>)
        ) : error ? (
          // Error State
          (<div className="p-8 text-center">
            <Icon name="AlertCircle" size={48} className="text-error mx-auto mb-4" />
            <p className="text-error font-medium mb-4">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={startCamera}>
                Try Camera Again
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => fileInputRef?.current?.click()}
              >
                Upload Image
              </Button>
            </div>
          </div>)
        ) : (
          // Camera View
          (<>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-64 sm:h-80 object-cover bg-muted"
            />
            {/* Capture Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* Capture Frame */}
                <div className="w-72 h-48 border-2 border-success rounded-lg relative bg-black/10">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-success rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-success rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-success rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-success rounded-br-lg"></div>
                  
                  {/* Guide text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white bg-black/60 px-3 py-1 rounded text-sm text-center">
                      Ingredient List
                    </div>
                  </div>
                </div>
                
                <p className="text-center text-white bg-black/70 px-3 py-1 rounded-full text-sm mt-4">
                  Position ingredient list within the frame
                </p>
              </div>
            </div>
          </>)
        )}
      </div>
      <div className="p-4 bg-muted/50">
        {capturedImage ? (
          // Captured Image Actions
          (<div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="default"
              onClick={analyzeIngredients}
              disabled={isAnalyzing}
              className="flex-1"
            >
              <Icon 
                name={isAnalyzing ? "Loader" : "Zap"} 
                size={16} 
                className={`mr-2 ${isAnalyzing ? 'animate-spin' : ''}`}
              />
              {isAnalyzing ? 'Analyzing with AI...' : 'Analyze with AI'}
            </Button>
            <Button variant="outline" onClick={retakePhoto} disabled={isAnalyzing}>
              <Icon name="RotateCcw" size={16} className="mr-2" />
              Retake Photo
            </Button>
          </div>)
        ) : (
          // Camera Actions
          (<div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isCapturing ? 'bg-success animate-pulse' : 'bg-muted'}`}></div>
              <span className="text-sm text-text-secondary">
                {isCapturing ? 'Camera ready' : 'Camera inactive'}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef?.current?.click()}
              >
                <Icon name="Upload" size={16} className="mr-2" />
                Upload
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={capturePhoto}
                disabled={!isCapturing}
              >
                <Icon name="Camera" size={16} className="mr-2" />
                Capture
              </Button>
            </div>
          </div>)
        )}
      </div>
      {/* AI Analysis Info */}
      <div className="p-4 border-t border-border">
        <div className="flex items-start space-x-2">
          <Icon name="Sparkles" size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <div className="text-xs text-text-secondary">
            <p className="font-medium mb-1">AI-Powered Analysis:</p>
            <ul className="space-y-1">
              <li>• Extracts ingredient text with high accuracy</li>
              <li>• Identifies allergens and additives automatically</li>
              <li>• Provides health impact assessment for each ingredient</li>
              <li>• Generates personalized recommendations</li>
            </ul>
          </div>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default IngredientPhotoCapture;