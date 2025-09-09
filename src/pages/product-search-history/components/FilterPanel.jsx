import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterPanel = ({ 
  filters, 
  onFiltersChange, 
  isCollapsed = false, 
  onToggleCollapse = null 
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const sortOptions = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'score-desc', label: 'Highest Score' },
    { value: 'score-asc', label: 'Lowest Score' },
    { value: 'name-asc', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' }
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'snacks', label: 'Snacks' },
    { value: 'dairy', label: 'Dairy' },
    { value: 'meat', label: 'Meat & Poultry' },
    { value: 'fruits', label: 'Fruits' },
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'grains', label: 'Grains & Cereals' },
    { value: 'condiments', label: 'Condiments' },
    { value: 'frozen', label: 'Frozen Foods' },
    { value: 'bakery', label: 'Bakery' }
  ];

  const scoreRangeOptions = [
    { value: '', label: 'All Scores' },
    { value: '80-100', label: 'Excellent (80-100)' },
    { value: '60-79', label: 'Good (60-79)' },
    { value: '40-59', label: 'Fair (40-59)' },
    { value: '0-39', label: 'Poor (0-39)' }
  ];

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      sortBy: 'date-desc',
      category: '',
      scoreRange: '',
      dateRange: ''
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = localFilters?.search || localFilters?.category || localFilters?.scoreRange || localFilters?.dateRange;

  if (isCollapsed) {
    return (
      <div className="bg-card border border-border rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon name="Filter" size={20} className="text-text-secondary" />
            <span className="font-medium text-text-primary">Filters</span>
            {hasActiveFilters && (
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                Active
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            iconName="ChevronDown"
            iconSize={16}
          >
            Show Filters
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Icon name="Filter" size={20} className="text-text-secondary" />
          <h3 className="font-medium text-text-primary">Filter & Sort</h3>
          {hasActiveFilters && (
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {Object.values(localFilters)?.filter(v => v && v !== 'date-desc')?.length} active
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              iconName="X"
              iconSize={14}
            >
              Clear All
            </Button>
          )}
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              iconName="ChevronUp"
              iconSize={16}
            >
              Hide
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <Input
            type="search"
            placeholder="Search products..."
            value={localFilters?.search}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
            className="w-full"
          />
        </div>

        <Select
          placeholder="Sort by"
          options={sortOptions}
          value={localFilters?.sortBy}
          onChange={(value) => handleFilterChange('sortBy', value)}
        />

        <Select
          placeholder="Category"
          options={categoryOptions}
          value={localFilters?.category}
          onChange={(value) => handleFilterChange('category', value)}
        />

        <Select
          placeholder="Health Score"
          options={scoreRangeOptions}
          value={localFilters?.scoreRange}
          onChange={(value) => handleFilterChange('scoreRange', value)}
        />

        <div className="lg:col-span-3">
          <Input
            type="date"
            label="Scanned after"
            value={localFilters?.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e?.target?.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;