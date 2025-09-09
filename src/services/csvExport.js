/**
 * CSV Export service for product analysis data
 */
class CSVExportService {
  /**
   * Export product analysis data to CSV
   * @param {Object} data - Product analysis data
   * @param {string} filename - Optional filename
   * @returns {Promise<void>}
   */
  async exportProductAnalysis(data, filename = null) {
    try {
      const csvData = this.formatProductDataForCSV(data);
      const csvContent = this.arrayToCSV(csvData);
      
      const finalFilename = filename || this.generateFilename(data?.productName);
      this.downloadCSV(csvContent, finalFilename);
    } catch (error) {
      console.error('Error exporting product analysis:', error);
      throw new Error('Failed to export product analysis to CSV');
    }
  }

  /**
   * Export multiple products to CSV
   * @param {Array} products - Array of product analysis data
   * @param {string} filename - Optional filename
   * @returns {Promise<void>}
   */
  async exportMultipleProducts(products, filename = 'multiple-products-analysis.csv') {
    try {
      const csvData = [];
      
      // Add header
      csvData?.push([
        'Product Name',
        'Brand',
        'Barcode',
        'Nutri-Score',
        'Health Score',
        'Scan Date',
        'Calories (per 100g)',
        'Fat (g)',
        'Saturated Fat (g)',
        'Carbohydrates (g)',
        'Sugars (g)',
        'Fiber (g)',
        'Protein (g)',
        'Salt (g)',
        'Sodium (mg)',
        'Ingredients Count',
        'Additives Count',
        'Allergens',
        'Search Method'
      ]);

      // Add each product
      products?.forEach(product => {
        const row = [
          product?.productName || 'Unknown',
          product?.brand || 'Unknown',
          product?.barcode || 'N/A',
          product?.nutriscore || 'N/A',
          product?.healthScore || 0,
          product?.scanDate || new Date()?.toLocaleDateString(),
          product?.nutritionalValues?.energy?.value || 0,
          product?.nutritionalValues?.fat?.value || 0,
          product?.nutritionalValues?.saturatedFat?.value || 0,
          product?.nutritionalValues?.carbohydrates?.value || 0,
          product?.nutritionalValues?.sugars?.value || 0,
          product?.nutritionalValues?.fiber?.value || 0,
          product?.nutritionalValues?.proteins?.value || 0,
          product?.nutritionalValues?.salt?.value || 0,
          product?.nutritionalValues?.sodium?.value || 0,
          product?.ingredientsCount || 0,
          product?.additivesCount || 0,
          (product?.allergens || [])?.join('; '),
          product?.searchMethod || 'Unknown'
        ];
        csvData?.push(row);
      });

      const csvContent = this.arrayToCSV(csvData);
      this.downloadCSV(csvContent, filename);
    } catch (error) {
      console.error('Error exporting multiple products:', error);
      throw new Error('Failed to export multiple products to CSV');
    }
  }

  /**
   * Export ingredient analysis to CSV
   * @param {Object} analysis - Ingredient analysis data
   * @param {string} filename - Optional filename
   * @returns {Promise<void>}
   */
  async exportIngredientAnalysis(analysis, filename = 'ingredient-analysis.csv') {
    try {
      const csvData = [];
      
      // Header
      csvData?.push([
        'Ingredient Name',
        'Category',
        'Health Impact',
        'Safety Level',
        'E-Number',
        'Purpose',
        'Description'
      ]);

      // Ingredients
      if (analysis?.ingredients) {
        analysis?.ingredients?.forEach(ingredient => {
          csvData?.push([
            ingredient?.name || 'Unknown',
            ingredient?.category || 'Unknown',
            ingredient?.health_impact || 'Unknown',
            ingredient?.safety_level || 'Unknown',
            ingredient?.e_number || 'N/A',
            ingredient?.purpose || 'N/A',
            ingredient?.description || ''
          ]);
        });
      }

      // Add summary section
      csvData?.push([]);
      csvData?.push(['=== ANALYSIS SUMMARY ===']);
      csvData?.push(['Health Score', analysis?.health_score || 0]);
      csvData?.push(['Confidence', `${Math.round((analysis?.confidence || 0) * 100)}%`]);
      csvData?.push(['Total Allergens', (analysis?.allergens || [])?.length]);
      csvData?.push(['Total Additives', (analysis?.additives || [])?.length]);
      
      if (analysis?.allergens?.length > 0) {
        csvData?.push(['Allergens', (analysis?.allergens || [])?.join(', ')]);
      }
      
      if (analysis?.recommendations?.length > 0) {
        csvData?.push([]);
        csvData?.push(['=== RECOMMENDATIONS ===']);
        analysis?.recommendations?.forEach((rec, index) => {
          csvData?.push([`Recommendation ${index + 1}`, rec]);
        });
      }

      const csvContent = this.arrayToCSV(csvData);
      this.downloadCSV(csvContent, filename);
    } catch (error) {
      console.error('Error exporting ingredient analysis:', error);
      throw new Error('Failed to export ingredient analysis to CSV');
    }
  }

  /**
   * Format product data for CSV export
   * @param {Object} data - Raw product data
   * @returns {Array} Formatted CSV data array
   */
  formatProductDataForCSV(data) {
    const csvData = [];
    
    // Product Information Section
    csvData?.push(['=== PRODUCT INFORMATION ===']);
    csvData?.push(['Field', 'Value']);
    csvData?.push(['Product Name', data?.productName || 'Unknown']);
    csvData?.push(['Brand', data?.brand || 'Unknown']);
    csvData?.push(['Barcode', data?.barcode || 'N/A']);
    csvData?.push(['Nutri-Score', data?.nutriscore || 'N/A']);
    csvData?.push(['Health Score', data?.healthScore || 0]);
    csvData?.push(['Scan Date', data?.scanDate || new Date()?.toLocaleDateString()]);
    csvData?.push(['Search Method', data?.searchMethod || 'Unknown']);
    
    // Nutritional Information Section
    csvData?.push([]);
    csvData?.push(['=== NUTRITIONAL VALUES (per 100g) ===']);
    csvData?.push(['Nutrient', 'Value', 'Unit']);
    
    if (data?.nutritionalValues) {
      Object.entries(data?.nutritionalValues)?.forEach(([key, value]) => {
        const nutrientName = key?.replace(/([A-Z])/g, ' $1')?.toLowerCase()?.replace(/^./, str => str?.toUpperCase());
        csvData?.push([
          nutrientName,
          value?.value || 0,
          value?.unit || ''
        ]);
      });
    }

    // Ingredients Section
    if (data?.ingredients) {
      csvData?.push([]);
      csvData?.push(['=== INGREDIENTS ANALYSIS ===']);
      csvData?.push(['Ingredient', 'Category', 'Health Impact', 'Description']);
      
      data?.ingredients?.forEach(ingredient => {
        csvData?.push([
          ingredient?.name || 'Unknown',
          ingredient?.category || 'Unknown',
          ingredient?.health_impact || 'Unknown',
          ingredient?.description || ''
        ]);
      });
    }

    // Additives Section
    if (data?.additives && data?.additives?.length > 0) {
      csvData?.push([]);
      csvData?.push(['=== ADDITIVES ===']);
      csvData?.push(['Name', 'E-Number', 'Safety Level', 'Purpose']);
      
      data?.additives?.forEach(additive => {
        csvData?.push([
          additive?.name || 'Unknown',
          additive?.e_number || 'N/A',
          additive?.safety_level || 'Unknown',
          additive?.purpose || 'Unknown'
        ]);
      });
    }

    // Allergens Section
    if (data?.allergens && data?.allergens?.length > 0) {
      csvData?.push([]);
      csvData?.push(['=== ALLERGENS ===']);
      csvData?.push(['Allergen']);
      
      data?.allergens?.forEach(allergen => {
        csvData?.push([allergen]);
      });
    }

    // Recommendations Section
    if (data?.recommendations && data?.recommendations?.length > 0) {
      csvData?.push([]);
      csvData?.push(['=== HEALTH RECOMMENDATIONS ===']);
      csvData?.push(['Recommendation']);
      
      data?.recommendations?.forEach(recommendation => {
        csvData?.push([recommendation]);
      });
    }

    return csvData;
  }

  /**
   * Convert 2D array to CSV string
   * @param {Array} data - 2D array of data
   * @returns {string} CSV formatted string
   */
  arrayToCSV(data) {
    return data?.map(row => 
      row?.map(cell => {
        // Handle null, undefined, and non-string values
        if (cell == null) return '';
        
        const cellStr = String(cell);
        
        // Escape quotes and wrap in quotes if necessary
        if (cellStr?.includes(',') || cellStr?.includes('"') || cellStr?.includes('\n')) {
          return '"' + cellStr?.replace(/"/g, '""') + '"';
        }
        
        return cellStr;
      })?.join(',')
    )?.join('\n');
  }

  /**
   * Generate filename based on product name and timestamp
   * @param {string} productName - Product name
   * @returns {string} Generated filename
   */
  generateFilename(productName) {
    const timestamp = new Date()?.toISOString()?.split('T')?.[0]; // YYYY-MM-DD
    const safeName = (productName || 'product')?.replace(/[^a-zA-Z0-9]/g, '-')?.toLowerCase()?.substring(0, 30);
    
    return `${safeName}-analysis-${timestamp}.csv`;
  }

  /**
   * Download CSV content as file
   * @param {string} csvContent - CSV content string
   * @param {string} filename - Filename for download
   */
  downloadCSV(csvContent, filename) {
    // Add BOM for UTF-8 encoding (helps with Excel compatibility)
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link?.setAttribute('href', url);
    link?.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    // Trigger download
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(url);
  }

  /**
   * Export search history to CSV
   * @param {Array} history - Search history array
   * @param {string} filename - Optional filename
   * @returns {Promise<void>}
   */
  async exportSearchHistory(history, filename = 'search-history.csv') {
    try {
      const csvData = [];
      
      // Header
      csvData?.push([
        'Date',
        'Product Name',
        'Brand',
        'Barcode',
        'Nutri-Score',
        'Health Score',
        'Search Method',
        'Categories',
        'Allergens Present'
      ]);

      // Data rows
      history?.forEach(item => {
        csvData?.push([
          new Date(item?.timestamp || Date.now())?.toLocaleDateString(),
          item?.productName || 'Unknown',
          item?.brand || 'Unknown',
          item?.barcode || 'N/A',
          item?.nutriscore || 'N/A',
          item?.healthScore || 0,
          item?.searchMethod || 'Unknown',
          (item?.categories || [])?.join('; '),
          (item?.allergens || [])?.length > 0 ? 'Yes' : 'No'
        ]);
      });

      const csvContent = this.arrayToCSV(csvData);
      this.downloadCSV(csvContent, filename);
    } catch (error) {
      console.error('Error exporting search history:', error);
      throw new Error('Failed to export search history to CSV');
    }
  }
}

export default new CSVExportService();