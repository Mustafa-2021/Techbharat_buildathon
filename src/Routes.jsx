import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import ProductSearchHistory from './pages/product-search-history';
import HealthAssessmentResults from './pages/health-assessment-results';
import UserPreferences from './pages/user-preferences';
import ProductScanner from './pages/product-scanner';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<HealthAssessmentResults />} />
        <Route path="/product-search-history" element={<ProductSearchHistory />} />
        <Route path="/health-assessment-results" element={<HealthAssessmentResults />} />
        <Route path="/user-preferences" element={<UserPreferences />} />
        <Route path="/product-scanner" element={<ProductScanner />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
