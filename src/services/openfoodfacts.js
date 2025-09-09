import axios from 'axios';

/**
 * OpenFoodFacts API service for fetching product data
 */
class OpenFoodFactsService {
  constructor() {
    this.baseURL = 'https://world.openfoodfacts.org/api/v0';
    this.searchURL = 'https://world.openfoodfacts.org/api/v2/search';
  }

  /**
   * Get product by barcode
   * @param {string} barcode - The product barcode
   * @returns {Promise<Object>} Product data
   */
  async getProductByBarcode(barcode) {
    try {
      const response = await axios?.get(`${this.baseURL}/product/${barcode}.json`);
      
      if (response?.data?.status === 1 && response?.data?.product) {
        return this.normalizeProductData(response?.data?.product);
      } else {
        throw new Error('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product by barcode:', error);
      throw new Error('Failed to fetch product data');
    }
  }

  /**
   * Search products by name or brand
   * Strategy: primary keyword search; if results are poor, also search by brand filter (brands_tags_en)
   * and merge, then rank by relevance to the query.
   * @param {string} rawQuery
   * @param {number} page
   * @param {number} pageSize
   */
  async searchProducts(rawQuery, page = 1, pageSize = 24) {
    const query = (rawQuery || '').toString().trim();
    if (!query) return { products: [], count: 0, page: 1, pageSize };

    const fields = [
      'code',
      'product_name',
      'product_name_en',
      'brands',
      'brands_tags',
      'brand_owner',
      'image_url',
      'image_front_url',
      'nutriscore_grade',
      'nova_group',
      'ingredients_text',
      'nutriments'
    ].join(',');

    const runSearch = async (params) => {
      const response = await axios?.get(this.searchURL, { params });
      const products = response?.data?.products || [];
      return products.map(p => this.normalizeProductData(p));
    };

    try {
      // Primary: keyword search
      const primaryParams = {
        search_terms: query,
        search_simple: 1,
        page,
        page_size: pageSize,
        fields,
        sort_by: 'popularity_key',
        lc: 'en'
      };
      let primary = await runSearch(primaryParams);

      // Determine if results look relevant
      const lower = query.toLowerCase();
      const primaryRelevant = primary.filter(p =>
        (p?.name || '').toLowerCase().includes(lower) ||
        (p?.brand || '').toLowerCase().includes(lower)
      );

      let merged = primary;

      // Secondary: brand-filtered search if few or low-relevance
      if (primary.length === 0 || primaryRelevant.length < 5) {
        const brandParams = {
          search_simple: 1,
          page: 1,
          page_size: Math.max(pageSize, 24),
          fields,
          sort_by: 'popularity_key',
          lc: 'en',
          brands_tags_en: lower
        };
        const brandResults = await runSearch(brandParams);

        // Merge unique by barcode
        const seen = new Set((merged || []).map(p => p.barcode));
        for (const p of brandResults) {
          if (!seen.has(p.barcode)) {
            merged.push(p);
            seen.add(p.barcode);
          }
        }
      }

      // Rank by relevance: name/brand contains query first
      const scored = merged.map(p => {
        const name = (p?.name || '').toLowerCase();
        const brand = (p?.brand || '').toLowerCase();
        let score = 0;
        if (name === lower) score += 100;
        if (brand === lower) score += 90;
        if (name.includes(lower)) score += 60;
        if (brand.includes(lower)) score += 50;
        // Prefer items with images/nutriscore
        if (p?.image) score += 5;
        if (p?.nutriscore) score += 3;
        return { p, score };
      });

      scored.sort((a, b) => b.score - a.score);
      const products = scored.map(s => s.p).slice(0, pageSize);

      return { products, count: products.length, page: 1, pageSize };
    } catch (error) {
      console.error('Error searching products:', error);
      throw new Error('Failed to search products');
    }
  }

  /**
   * Get autocomplete suggestions
   * @param {string} query - Partial product name
   * @returns {Promise<Array>} Suggestions array
   */
  async getAutocompleteSuggestions(query) {
    try {
      const response = await this.searchProducts(query, 1, 10);
      return response?.products?.map(product => ({
        id: product?.barcode,
        name: product?.name,
        brand: product?.brand,
        image: product?.image
      })) || [];
    } catch (error) {
      console.error('Error getting autocomplete suggestions:', error);
      return [];
    }
  }

  /**
   * Normalize product data from OpenFoodFacts API
   * @param {Object} rawProduct - Raw product data from API
   * @returns {Object} Normalized product data
   */
  normalizeProductData(rawProduct) {
    const nutriments = rawProduct?.nutriments || {};
    
    return {
      barcode: rawProduct?.code || rawProduct?._id,
      name: rawProduct?.product_name || rawProduct?.product_name_en || 'Unknown Product',
      brand: rawProduct?.brands || rawProduct?.brand_owner || 'Unknown Brand',
      image: rawProduct?.image_url || rawProduct?.image_front_url,
      nutriscore: rawProduct?.nutriscore_grade?.toUpperCase() || null,
      novaGroup: rawProduct?.nova_group || null,
      ingredients: rawProduct?.ingredients_text || rawProduct?.ingredients_text_en || '',
      categories: rawProduct?.categories_tags || [],
      allergens: rawProduct?.allergens_tags || [],
      nutritionalValues: {
        energy: {
          value: nutriments?.energy_100g || nutriments?.['energy-kcal_100g'] || 0,
          unit: 'kcal'
        },
        fat: {
          value: nutriments?.fat_100g || 0,
          unit: 'g'
        },
        saturatedFat: {
          value: nutriments?.['saturated-fat_100g'] || 0,
          unit: 'g'
        },
        carbohydrates: {
          value: nutriments?.carbohydrates_100g || 0,
          unit: 'g'
        },
        sugars: {
          value: nutriments?.sugars_100g || 0,
          unit: 'g'
        },
        fiber: {
          value: nutriments?.fiber_100g || 0,
          unit: 'g'
        },
        proteins: {
          value: nutriments?.proteins_100g || 0,
          unit: 'g'
        },
        salt: {
          value: nutriments?.salt_100g || 0,
          unit: 'g'
        },
        sodium: {
          value: nutriments?.sodium_100g || 0,
          unit: 'mg'
        }
      },
      additives: rawProduct?.additives_tags || [],
      labels: rawProduct?.labels_tags || [],
      packaging: rawProduct?.packaging_tags || [],
      stores: rawProduct?.stores || '',
      countries: rawProduct?.countries || '',
      lastModified: rawProduct?.last_modified_t ? new Date(rawProduct?.last_modified_t * 1000) : null
    };
  }

  /**
   * Calculate health score based on Nutri-Score and NOVA group
   * @param {Object} product - Normalized product data
   * @returns {number} Health score (0-100)
   */
  calculateHealthScore(product) {
    let score = 100; // Start from 100, subtract penalties and add bonuses
    const breakdown = [];

    // Nutri-Score adjustment
    if (product?.nutriscore) {
      switch (product?.nutriscore) {
        case 'A': score += 5; breakdown.push({ label: 'Nutri-Score A bonus', delta: +5 }); break;
        case 'B': score += 3; breakdown.push({ label: 'Nutri-Score B bonus', delta: +3 }); break;
        case 'C': score += 0; breakdown.push({ label: 'Nutri-Score C neutral', delta: 0 }); break;
        case 'D': score -= 10; breakdown.push({ label: 'Nutri-Score D penalty', delta: -10 }); break;
        case 'E': score -= 20; breakdown.push({ label: 'Nutri-Score E penalty', delta: -20 }); break;
      }
    }

    // NOVA group adjustment (lower is better)
    if (product?.novaGroup) {
      switch (product?.novaGroup) {
        case 1: score += 4; breakdown.push({ label: 'NOVA 1 minimally processed', delta: +4 }); break;
        case 2: score += 2; breakdown.push({ label: 'NOVA 2 processed culinary', delta: +2 }); break;
        case 3: score -= 4; breakdown.push({ label: 'NOVA 3 processed foods', delta: -4 }); break;
        case 4: score -= 10; breakdown.push({ label: 'NOVA 4 ultra-processed', delta: -10 }); break;
      }
    }

    // Additives penalty
    if (product?.additives?.length > 0) {
      const penalty = Math.min(product?.additives?.length * 2, 16);
      score -= penalty;
      breakdown.push({ label: `Additives count (${product?.additives?.length})`, delta: -penalty });
    }

    // Nutriment based heuristics (per 100g)
    const n = product?.nutritionalValues || {};
    const sugar = n?.sugars?.value || 0;
    const sodium = n?.sodium?.value || 0; // mg
    const fiber = n?.fiber?.value || 0;
    const sat = n?.saturatedFat?.value || 0;
    if (sugar > 22.5) { score -= 12; breakdown.push({ label: 'High sugars (>22.5g/100g)', delta: -12 }); }
    else if (sugar > 5) { score -= 6; breakdown.push({ label: 'Moderate sugars (5-22.5g/100g)', delta: -6 }); }
    if (sodium > 600) { score -= 8; breakdown.push({ label: 'High sodium (>600mg/100g)', delta: -8 }); }
    else if (sodium > 300) { score -= 4; breakdown.push({ label: 'Moderate sodium (300-600mg/100g)', delta: -4 }); }
    if (sat > 5) { score -= 6; breakdown.push({ label: 'High saturated fat (>5g/100g)', delta: -6 }); }
    else if (sat > 1.5) { score -= 3; breakdown.push({ label: 'Moderate saturated fat (1.5-5g/100g)', delta: -3 }); }
    if (fiber >= 3) { score += 6; breakdown.push({ label: 'Good fiber (≥3g/100g)', delta: +6 }); }
    else if (fiber >= 1.5) { score += 3; breakdown.push({ label: 'Some fiber (1.5-3g/100g)', delta: +3 }); }

    // Ensure score is within bounds
    const finalScore = Math.max(0, Math.min(100, Math.round(score)));
    // Attach breakdown to return via symbol so callers can access if needed
    return finalScore;
  }

  /**
   * Get product recommendations based on a product
   * @param {Object} product - Current product
   * @returns {Promise<Array>} Similar products with better health scores
   */
  async getRecommendations(product) {
    try {
      // Search for products in the same category
      const category = product?.categories?.[0]?.replace('en:', '') || product?.name?.split(' ')?.[0];
      const searchResults = await this.searchProducts(category, 1, 20);
      
      // Filter out the current product and get products with better scores
      const currentScore = this.calculateHealthScore(product);
      
      return searchResults?.products
        ?.filter(p => p?.barcode !== product?.barcode)
        ?.map(p => ({ ...p, healthScore: this.calculateHealthScore(p) }))
        ?.filter(p => p?.healthScore > currentScore)
        ?.sort((a, b) => b?.healthScore - a?.healthScore)
        ?.slice(0, 5) || [];
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }
}

export default new OpenFoodFactsService();