import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import openFoodFactsService from '../../../services/openfoodfacts';

const ProductSearch = ({ onProductSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef?.current && !searchRef?.current?.contains(event?.target)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery?.length >= 2) {
      setIsSearching(true);
      // Debounce search requests
      const searchTimeout = setTimeout(async () => {
        try {
          const searchResults = await openFoodFactsService?.searchProducts(searchQuery, 1, 10);
          setSuggestions(searchResults?.products || []);
          setShowSuggestions(true);
          setSelectedIndex(-1);
        } catch (error) {
          console.error('Search error:', error);
          setSuggestions([]);
          setShowSuggestions(false);
        } finally {
          setIsSearching(false);
        }
      }, 300);

      return () => clearTimeout(searchTimeout);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleInputChange = (e) => {
    setSearchQuery(e?.target?.value);
  };

  const handleKeyDown = async (e) => {
    switch (e?.key) {
      case 'ArrowDown':
        e?.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions?.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e?.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions?.length - 1
        );
        break;
      case 'Enter':
        e?.preventDefault();
        if (showSuggestions && suggestions?.length > 0 && selectedIndex >= 0) {
          handleProductSelect(suggestions?.[selectedIndex]);
        } else if (searchQuery?.trim()?.length >= 2) {
          try {
            setIsSearching(true);
            const searchResults = await openFoodFactsService?.searchProducts(searchQuery, 1, 10);
            const items = searchResults?.products || [];
            if (items?.length > 0) {
              handleProductSelect(items[0]);
            } else {
              setSuggestions([]);
              setShowSuggestions(true);
              setSelectedIndex(-1);
            }
          } catch (err) {
            console.error('Search error:', err);
            setSuggestions([]);
            setShowSuggestions(true);
            setSelectedIndex(-1);
          } finally {
            setIsSearching(false);
          }
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleProductSelect = async (product) => {
    try {
      setSearchQuery(product?.name || '');
      setShowSuggestions(false);
      setSelectedIndex(-1);
      // Calculate health score and add metadata
      const healthScore = openFoodFactsService?.calculateHealthScore(product);
      const enhancedProduct = {
        ...product,
        healthScore,
        searchMethod: 'product_search',
        timestamp: new Date()?.toISOString()
      };
      onProductSelect(enhancedProduct);
    } catch (error) {
      console.error('Error selecting product:', error);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
          <Icon name="Search" size={24} className="text-warning" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Product Search</h3>
          <p className="text-sm text-text-secondary">Search global food database by name or brand</p>
        </div>
      </div>
      
      <div className="relative" ref={searchRef}>
        <div className="relative">
          <Input
            type="search"
            placeholder="Type at least 2 characters to search..."
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => searchQuery?.length >= 2 && setShowSuggestions(true)}
            className="pr-20"
          />
          
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
            {isSearching && (
              <Icon name="Loader" size={16} className="text-text-secondary animate-spin" />
            )}
            {searchQuery && (
              <button
                onClick={handleClear}
                className="text-text-secondary hover:text-text-primary transition-spring"
              >
                <Icon name="X" size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Real-time Suggestions Dropdown (Live API) */}
        {showSuggestions && suggestions?.length > 0 && (
          <div 
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-lg shadow-modal max-h-80 overflow-y-auto z-50"
          >
            {suggestions?.map((product, index) => (
              <button
                key={product?.barcode || index}
                onClick={() => handleProductSelect(product)}
                className={`
                  w-full px-4 py-3 text-left hover:bg-accent transition-spring border-b border-border last:border-b-0
                  ${index === selectedIndex ? 'bg-accent' : ''}
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    {product?.image && (
                      <img 
                        src={product?.image} 
                        alt={product?.name}
                        className="w-10 h-10 rounded object-cover flex-shrink-0"
                        onError={(e) => { e.target.style.display = 'none' }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-text-primary truncate">
                        {product?.name}
                      </div>
                      <div className="text-sm text-text-secondary flex items-center space-x-2">
                        <span>{product?.brand}</span>
                        {product?.nutriscore && (
                          <>
                            <span>•</span>
                            <span className={`font-medium ${
                              product?.nutriscore === 'A' ? 'text-success' :
                              product?.nutriscore === 'B' ? 'text-success' :
                              product?.nutriscore === 'C' ? 'text-warning' :
                              product?.nutriscore === 'D'? 'text-warning' : 'text-error'
                            }`}>
                              Nutri-Score {product?.nutriscore}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Icon name="ArrowRight" size={16} className="text-text-secondary ml-2 flex-shrink-0" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No Results */}
        {showSuggestions && suggestions?.length === 0 && searchQuery?.length >= 2 && !isSearching && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-lg shadow-modal p-4 z-50">
            <div className="text-center">
              <Icon name="Search" size={32} className="text-text-secondary mx-auto mb-2" />
              <p className="text-text-primary font-medium">No products found</p>
              <p className="text-sm text-text-secondary">Try a different search term or check spelling</p>
            </div>
          </div>
        )}
      </div>

      {/* Search Tips */}
      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start space-x-2">
          <Icon name="Lightbulb" size={16} className="text-text-secondary mt-0.5 flex-shrink-0" />
          <div className="text-xs text-text-secondary">
            <p className="font-medium mb-1">Search Tips:</p>
            <ul className="space-y-1">
              <li>• Type at least 2 letters to query OpenFoodFacts</li>
              <li>• Try brand names (e.g., "Lay's", "Nestlé")</li>
              <li>• Use product categories like "yogurt", "cereals", "cookies"</li>
              <li>• Add country for regional products (e.g., "French cheese")</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSearch;