import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import StatusNotificationBar from '../../components/ui/StatusNotificationBar';
import QuickActionFloatingButton from '../../components/ui/QuickActionFloatingButton';
import NutriScoreDisplay from './components/NutriScoreDisplay';
import HealthExplanationPanel from './components/HealthExplanationPanel';
import NutritionalBreakdown from './components/NutritionalBreakdown';
import IngredientAnalysis from './components/IngredientAnalysis';
import EvidencePanel from './components/EvidencePanel';
import ProductComparison from './components/ProductComparison';
import ActionButtons from './components/ActionButtons';
import Icon from '../../components/AppIcon';
import openFoodFactsService from '../../services/openfoodfacts';

const HealthAssessmentResults = () => {
  const location = useLocation();
  const initialProduct = location?.state?.productData || {};
  const [productData, setProductData] = useState(initialProduct);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [activeTab, setActiveTab] = useState('nutrition');
  const [showNotification, setShowNotification] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // If navigated from history or OCR with limited fields, hydrate from OFF by barcode
  useEffect(() => {
    const hydrateIfNeeded = async () => {
      if (!productData) return;
      const missingNutrition = !productData?.nutritionalValues || Object.keys(productData?.nutritionalValues || {}).length === 0;
      if (productData?.barcode && missingNutrition) {
        try {
          setIsLoadingData(true);
          const full = await openFoodFactsService.getProductByBarcode(productData.barcode);
          const score = openFoodFactsService.calculateHealthScore(full);
          setProductData({ ...full, healthScore: score, searchMethod: productData?.searchMethod || full?.searchMethod });
        } catch (_) {
          // keep existing minimal data
        } finally {
          setIsLoadingData(false);
        }
      }
    };
    hydrateIfNeeded();
  }, [productData?.barcode]);

  const tabs = [
    {
      id: 'nutrition',
      label: 'Nutrition',
      icon: 'BarChart3',
      component: <NutritionalBreakdown product={productData} />
    },
    {
      id: 'ingredients',
      label: 'Ingredients',
      icon: 'List',
      component: <IngredientAnalysis product={productData} />
    },
    {
      id: 'evidence',
      label: 'Evidence',
      icon: 'FileText',
      component: <EvidencePanel product={productData} />
    },
    // {
    //   id: 'comparison',
    //   label: 'Alternatives',
    //   icon: 'GitCompare',
    //   component: <ProductComparison />
    // }
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const renderTabContent = () => {
    const activeTabData = tabs?.find(tab => tab?.id === activeTab);
    return activeTabData ? activeTabData?.component : null;
  };

  const renderMobileAccordion = () => {
    return (
      <div className="space-y-3">
        {tabs?.map((tab) => (
          <div key={tab?.id} className="bg-card rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => handleTabChange(activeTab === tab?.id ? '' : tab?.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Icon name={tab?.icon} size={20} className="text-primary" />
                <span className="font-medium text-text-primary">{tab?.label}</span>
              </div>
              <Icon 
                name={activeTab === tab?.id ? "ChevronUp" : "ChevronDown"} 
                size={20} 
                className="text-text-secondary" 
              />
            </button>
            {activeTab === tab?.id && (
              <div className="border-t border-border p-4 bg-muted/30">
                {tab?.component}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {showNotification && (
        <StatusNotificationBar
          type="success"
          message="Health assessment completed successfully! Your product has been analyzed."
          isVisible={showNotification}
          onDismiss={() => setShowNotification(false)}
          autoHide={true}
          autoHideDelay={5000}
        />
      )}
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-6 lg:px-6">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <Icon name="Activity" size={24} className="text-primary" />
              <h1 className="text-3xl font-heading font-bold text-text-primary">
                Health Assessment Results
              </h1>
            </div>
            <p className="text-text-secondary">
              Comprehensive nutritional analysis and health evaluation for your scanned product.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Nutri-Score Display */}
              <NutriScoreDisplay 
                productName={productData?.name}
                score={productData?.healthScore}
                grade={productData?.nutriscore}
              />

              {/* Health Explanation */}
              <HealthExplanationPanel product={productData} score={productData?.healthScore} />

              {/* Tabbed Content for Desktop, Accordion for Mobile */}
              <div className="bg-card rounded-lg border border-border shadow-card">
                {!isMobile ? (
                  <>
                    {/* Desktop Tabs */}
                    <div className="border-b border-border">
                      <nav className="flex space-x-1 p-1">
                        {tabs?.map((tab) => (
                          <button
                            key={tab?.id}
                            onClick={() => handleTabChange(tab?.id)}
                            className={`
                              flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-spring
                              ${activeTab === tab?.id
                                ? 'bg-primary text-primary-foreground'
                                : 'text-text-secondary hover:text-text-primary hover:bg-accent'
                              }
                            `}
                          >
                            <Icon name={tab?.icon} size={18} />
                            <span>{tab?.label}</span>
                          </button>
                        ))}
                      </nav>
                    </div>
                    
                    {/* Desktop Tab Content */}
                    <div className="p-6">
                      {isLoadingData ? (
                        <div className="text-sm text-text-secondary">Loading product details…</div>
                      ) : (
                        renderTabContent()
                      )}
                    </div>
                  </>
                ) : (
                  /* Mobile Accordion */
                  (<div className="p-4">
                    {renderMobileAccordion()}
                  </div>)
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Action Buttons */}
              {/* <ActionButtons /> */}

              {/* Quick Stats Card */}
              {/* <div className="bg-card rounded-lg border border-border p-6 shadow-card">
                <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Processing Time</span>
                    <span className="text-sm font-medium text-text-primary">2.3 seconds</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Data Sources</span>
                    <span className="text-sm font-medium text-text-primary">3 verified</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Rules Applied</span>
                    <span className="text-sm font-medium text-text-primary">5 scoring rules</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Confidence Level</span>
                    <span className="text-sm font-medium text-success">High (94%)</span>
                  </div>
                </div>
              </div> */}

              {/* Tips Card */}
              <div className="bg-card rounded-lg border border-border p-6 shadow-card">
                <div className="flex items-center space-x-2 mb-4">
                  <Icon name="Lightbulb" size={20} className="text-warning" />
                  <h3 className="text-lg font-heading font-semibold text-text-primary">
                    Pro Tips
                  </h3>
                </div>
                <ul className="space-y-2 text-sm text-text-secondary">
                  <li className="flex items-start space-x-2">
                    <Icon name="CheckCircle" size={14} className="text-success mt-0.5 flex-shrink-0" />
                    <span>Compare similar products to find healthier alternatives</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="CheckCircle" size={14} className="text-success mt-0.5 flex-shrink-0" />
                    <span>Check the ingredient list for allergens and additives</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <Icon name="CheckCircle" size={14} className="text-success mt-0.5 flex-shrink-0" />
                    <span>Consider portion sizes when evaluating nutritional content</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <QuickActionFloatingButton />
    </div>
  );
};

export default HealthAssessmentResults;