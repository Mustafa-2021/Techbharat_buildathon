import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const BulkActions = ({ 
  selectedCount = 0, 
  totalCount = 0, 
  onClearAll, 
  onClearDateRange, 
  onExportData,
  onSelectAll,
  onClearSelection 
}) => {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showDateRange, setShowDateRange] = useState(false);

  const handleClearByDateRange = () => {
    if (dateRange?.start && dateRange?.end) {
      onClearDateRange(dateRange?.start, dateRange?.end);
      setDateRange({ start: '', end: '' });
      setShowDateRange(false);
    }
  };

  const handleExport = () => {
    onExportData();
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={20} className="text-text-secondary" />
            <span className="font-medium text-text-primary">Bulk Actions</span>
            {selectedCount > 0 && (
              <span className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full">
                {selectedCount} selected
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {selectedCount === 0 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onSelectAll}
              iconName="CheckSquare"
              iconSize={16}
            >
              Select All ({totalCount})
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearSelection}
              iconName="Square"
              iconSize={16}
            >
              Clear Selection
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDateRange(!showDateRange)}
            iconName="Calendar"
            iconSize={16}
          >
            Clear by Date
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            iconName="Download"
            iconSize={16}
          >
            Export Data
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={onClearAll}
            iconName="Trash2"
            iconSize={16}
          >
            Clear All History
          </Button>
        </div>
      </div>
      {showDateRange && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-col sm:flex-row sm:items-end space-y-3 sm:space-y-0 sm:space-x-3">
            <Input
              type="date"
              label="From Date"
              value={dateRange?.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e?.target?.value }))}
              className="flex-1"
            />
            <Input
              type="date"
              label="To Date"
              value={dateRange?.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e?.target?.value }))}
              className="flex-1"
            />
            <div className="flex space-x-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleClearByDateRange}
                disabled={!dateRange?.start || !dateRange?.end}
                iconName="Trash2"
                iconSize={16}
              >
                Clear Range
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDateRange(false)}
                iconName="X"
                iconSize={16}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkActions;