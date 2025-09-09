import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const QuickActionFloatingButton = ({ isVisible = true }) => {
  const location = useLocation();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  // Determine if FAB should be shown based on current route
  useEffect(() => {
    const showOnRoutes = ['/health-assessment-results', '/product-search-history'];
    setShouldShow(showOnRoutes?.includes(location?.pathname));
  }, [location?.pathname]);

  // Handle keyboard visibility on mobile
  useEffect(() => {
    const handleResize = () => {
      const viewportHeight = window.visualViewport?.height || window.innerHeight;
      const windowHeight = window.screen?.height;
      const keyboardThreshold = windowHeight * 0.75;
      
      setIsKeyboardVisible(viewportHeight < keyboardThreshold);
    };

    if (window.visualViewport) {
      window.visualViewport?.addEventListener('resize', handleResize);
    } else {
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport?.removeEventListener('resize', handleResize);
      } else {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  const handleQuickScan = () => {
    window.location.href = '/product-scanner';
  };

  if (!shouldShow || !isVisible || isKeyboardVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Button
        variant="default"
        size="lg"
        onClick={handleQuickScan}
        className="
          w-14 h-14 rounded-full shadow-modal hover:shadow-lg
          bg-primary hover:bg-primary/90 text-primary-foreground
          transition-all duration-200 ease-spring
          hover:scale-105 active:scale-95
          flex items-center justify-center
        "
        title="Quick scan product"
      >
        <Icon name="Camera" size={24} />
      </Button>
    </div>
  );
};

export default QuickActionFloatingButton;