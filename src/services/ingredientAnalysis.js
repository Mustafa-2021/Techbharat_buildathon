import openai from './openaiClient';

/**
 * Ingredient analysis service using OpenAI GPT-5
 */
class IngredientAnalysisService {
  constructor() {
    this.model = 'gpt-5-mini'; // Fast and cost-effective for OCR analysis
  }

  /**
   * Analyze ingredient text from image using OpenAI Vision
   * @param {string} imageBase64 - Base64 encoded image
   * @param {Object} options - Analysis options
   * @returns {Promise<Object>} Analysis result
   */
  async analyzeIngredientImage(imageBase64, options = {}) {
    try {
      const systemPrompt = `You are an expert nutritionist and food scientist. Analyze the ingredient list in this image and provide detailed information about each ingredient, including potential health concerns, allergens, and additives.

Focus on:
1. Extracting all visible ingredient text accurately
2. Identifying potential allergens
3. Flagging artificial additives and preservatives
4. Assessing nutritional quality
5. Providing health recommendations`;

      const response = await openai?.chat?.completions?.create({
        model: 'gpt-5',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: [
              { 
                type: 'text', 
                text: 'Please analyze the ingredient list in this image. Extract all ingredients and provide a comprehensive health analysis.' 
              },
              { 
                type: 'image_url', 
                image_url: { url: `data:image/jpeg;base64,${imageBase64}` } 
              },
            ],
          },
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'ingredient_analysis',
            schema: {
              type: 'object',
              properties: {
                extracted_text: { type: 'string', description: 'Raw extracted ingredient text' },
                ingredients: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      category: { type: 'string', enum: ['natural', 'processed', 'additive', 'preservative', 'flavor', 'color', 'emulsifier', 'other'] },
                      health_impact: { type: 'string', enum: ['positive', 'neutral', 'concerning', 'harmful'] },
                      description: { type: 'string' }
                    },
                    required: ['name', 'category', 'health_impact']
                  }
                },
                allergens: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'List of potential allergens found'
                },
                additives: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      e_number: { type: 'string' },
                      safety_level: { type: 'string', enum: ['safe', 'moderate', 'concerning', 'avoid'] },
                      purpose: { type: 'string' }
                    },
                    required: ['name', 'safety_level', 'purpose']
                  }
                },
                health_score: { type: 'number', minimum: 0, maximum: 100, description: 'Overall health score based on ingredients' },
                recommendations: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Health and dietary recommendations'
                },
                confidence: { type: 'number', minimum: 0, maximum: 1, description: 'OCR accuracy confidence' }
              },
              required: ['extracted_text', 'ingredients', 'allergens', 'additives', 'health_score', 'recommendations', 'confidence'],
              additionalProperties: false,
            },
          },
        },
        reasoning_effort: 'medium',
        verbosity: 'high'
      });

      return JSON.parse(response?.choices?.[0]?.message?.content);
    } catch (error) {
      console.error('Error analyzing ingredient image:', error);
      throw new Error('Failed to analyze ingredient image');
    }
  }

  /**
   * Analyze ingredient text using OpenAI
   * @param {string} ingredientText - Ingredient text to analyze
   * @returns {Promise<Object>} Analysis result
   */
  async analyzeIngredientText(ingredientText) {
    try {
      const systemPrompt = `You are an expert nutritionist and food scientist. Analyze this ingredient list and provide detailed information about each ingredient, including potential health concerns, allergens, and additives.

Focus on:
1. Parsing individual ingredients accurately
2. Identifying potential allergens
3. Flagging artificial additives and preservatives  
4. Assessing nutritional quality
5. Providing health recommendations`;

      const response = await openai?.chat?.completions?.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze these ingredients: ${ingredientText}` }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'ingredient_analysis',
            schema: {
              type: 'object',
              properties: {
                ingredients: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      category: { type: 'string', enum: ['natural', 'processed', 'additive', 'preservative', 'flavor', 'color', 'emulsifier', 'other'] },
                      health_impact: { type: 'string', enum: ['positive', 'neutral', 'concerning', 'harmful'] },
                      description: { type: 'string' }
                    },
                    required: ['name', 'category', 'health_impact']
                  }
                },
                allergens: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'List of potential allergens found'
                },
                additives: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      e_number: { type: 'string' },
                      safety_level: { type: 'string', enum: ['safe', 'moderate', 'concerning', 'avoid'] },
                      purpose: { type: 'string' }
                    },
                    required: ['name', 'safety_level', 'purpose']
                  }
                },
                health_score: { type: 'number', minimum: 0, maximum: 100 },
                recommendations: {
                  type: 'array',
                  items: { type: 'string' }
                },
                summary: { type: 'string', description: 'Brief summary of the ingredient analysis' }
              },
              required: ['ingredients', 'allergens', 'additives', 'health_score', 'recommendations', 'summary'],
              additionalProperties: false,
            },
          },
        },
        reasoning_effort: 'medium',
        verbosity: 'medium'
      });

      return JSON.parse(response?.choices?.[0]?.message?.content);
    } catch (error) {
      console.error('Error analyzing ingredient text:', error);
      throw new Error('Failed to analyze ingredient text');
    }
  }

  /**
   * Get detailed information about a specific ingredient
   * @param {string} ingredientName - Name of the ingredient
   * @returns {Promise<Object>} Detailed ingredient information
   */
  async getIngredientInfo(ingredientName) {
    try {
      const response = await openai?.chat?.completions?.create({
        model: this.model,
        messages: [
          { 
            role: 'system', 
            content: 'You are a food science expert. Provide detailed information about food ingredients including their purpose, safety, and health implications.' 
          },
          { 
            role: 'user', 
            content: `Tell me everything about this food ingredient: ${ingredientName}` 
          }
        ],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'ingredient_info',
            schema: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                common_names: { type: 'array', items: { type: 'string' } },
                category: { type: 'string' },
                purpose: { type: 'string' },
                source: { type: 'string', enum: ['natural', 'synthetic', 'semi-synthetic'] },
                safety_level: { type: 'string', enum: ['safe', 'moderate', 'concerning', 'avoid'] },
                health_effects: {
                  type: 'object',
                  properties: {
                    positive: { type: 'array', items: { type: 'string' } },
                    negative: { type: 'array', items: { type: 'string' } },
                    neutral: { type: 'array', items: { type: 'string' } }
                  },
                  required: ['positive', 'negative', 'neutral']
                },
                allergen_info: { type: 'string' },
                regulatory_status: { type: 'string' },
                alternatives: { type: 'array', items: { type: 'string' } },
                description: { type: 'string' }
              },
              required: ['name', 'category', 'purpose', 'source', 'safety_level', 'health_effects', 'description'],
              additionalProperties: false,
            },
          },
        },
        reasoning_effort: 'medium',
        verbosity: 'high'
      });

      return JSON.parse(response?.choices?.[0]?.message?.content);
    } catch (error) {
      console.error('Error getting ingredient info:', error);
      throw new Error('Failed to get ingredient information');
    }
  }

  /**
   * Convert image file to base64
   * @param {File} file - Image file
   * @returns {Promise<string>} Base64 encoded image
   */
  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        const base64 = result.split(',')[1]; // Remove data:image/jpeg;base64, prefix
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    }); }

  /**
   * Analyze ingredient image from file
   * @param {File} imageFile - Image file containing ingredients
   * @returns {Promise<Object>} Analysis result
   */
  async analyzeIngredientImageFile(imageFile) {
    try {
      const base64Image = await this.fileToBase64(imageFile);
      return await this.analyzeIngredientImage(base64Image);
    } catch (error) {
      console.error('Error analyzing ingredient image file:', error);
      throw new Error('Failed to analyze ingredient image file');
    }
  }
}

export default new IngredientAnalysisService();