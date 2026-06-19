/**
 * VkusVill MCP Adapter
 * 
 * This service layer abstracts VkusVill product operations.
 * Currently uses mock data for the demo prototype.
 * 
 * After NDA with VkusVill, replace mock implementations with real MCP calls:
 * - vkusvill_products_search — search products by keywords
 * - vkusvill_product_details — get detailed product info (composition, KBJU)
 * - vkusvill_cart_link_create — create a VkusVill cart link
 * 
 * MCP Reference: https://habr.com/ru/companies/vkusvill/articles/981866/
 * 
 * Connection point: Replace the body of each function below with actual MCP tool calls.
 * The MCP server endpoint and authentication should be configured via environment variables:
 * - VITE_VKUSVILL_MCP_URL
 * - VITE_VKUSVILL_MCP_TOKEN
 */

import { products, budgetAlternatives, proteinAlternatives } from '../mockData/products';

const DEMO_MODE = true; // Set to false when real MCP is connected
const SIMULATED_DELAY = 800; // ms

/**
 * Search products by query and optional filters
 * 
 * TODO: replace mock implementation with real VkusVill MCP call after NDA and test access.
 * Real call: vkusvill_products_search({ query, filters })
 * 
 * @param {string} query - Search keywords
 * @param {object} options - { category, maxPrice, tags, limit }
 * @returns {Promise<Array>} - Array of product objects
 */
export async function searchProducts(query, options = {}) {
  if (!DEMO_MODE) {
    // TODO: Replace with real MCP call
    // const response = await mcpClient.call('vkusvill_products_search', { query, ...options });
    // return response.products;
    throw new Error('Real MCP not connected. Set DEMO_MODE=true or configure MCP endpoint.');
  }

  // Mock implementation
  await simulateDelay();
  
  let results = [...products];
  
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.tags.some(t => t.toLowerCase().includes(q)) ||
      p.category.includes(q)
    );
  }
  
  if (options.category) {
    results = results.filter(p => p.category === options.category);
  }
  
  if (options.maxPrice) {
    results = results.filter(p => p.price <= options.maxPrice);
  }
  
  if (options.tags && options.tags.length) {
    results = results.filter(p => 
      options.tags.some(tag => p.tags.includes(tag))
    );
  }
  
  if (options.limit) {
    results = results.slice(0, options.limit);
  }
  
  return results;
}

/**
 * Get detailed product information
 * 
 * TODO: replace mock implementation with real VkusVill MCP call after NDA and test access.
 * Real call: vkusvill_product_details({ product_id })
 * 
 * @param {string} productId - Product ID
 * @returns {Promise<object>} - Full product details
 */
export async function getProductDetails(productId) {
  if (!DEMO_MODE) {
    // TODO: Replace with real MCP call
    // const response = await mcpClient.call('vkusvill_product_details', { product_id: productId });
    // return response;
    throw new Error('Real MCP not connected.');
  }

  await simulateDelay();
  
  const product = products.find(p => p.id === productId);
  if (!product) throw new Error(`Product not found: ${productId}`);
  return product;
}

/**
 * Create a VkusVill cart link from selected products
 * 
 * TODO: replace mock implementation with real VkusVill MCP call after NDA and test access.
 * Real call: vkusvill_cart_link_create({ products: [...] })
 * 
 * @param {Array} cartProducts - Array of { productId, quantity }
 * @returns {Promise<object>} - { url, expiresAt }
 */
export async function createCartLink(cartProducts) {
  if (!DEMO_MODE) {
    // TODO: Replace with real MCP call
    // const response = await mcpClient.call('vkusvill_cart_link_create', { 
    //   products: cartProducts.map(p => ({ xml_id: p.xml_id, quantity: p.quantity || 1 }))
    // });
    // return { url: response.cart_url, expiresAt: response.expires_at };
    throw new Error('Real MCP not connected.');
  }

  await simulateDelay();
  
  // Mock: generate a fake cart link
  const mockId = Math.random().toString(36).substring(2, 10);
  return {
    url: `https://vkusvill.ru/cart/shared/${mockId}`,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    productCount: cartProducts.length,
  };
}

/**
 * Get alternative products for replacement
 * 
 * @param {string} productId - Product to replace
 * @param {string} mode - 'cheaper' | 'more_protein' | 'less_sugar' | 'higher_rating' | 'no_lactose'
 * @returns {Promise<Array>} - Array of alternative products
 */
export async function getAlternatives(productId, mode) {
  await simulateDelay();
  
  const original = products.find(p => p.id === productId);
  if (!original) return [];
  
  let alternatives = [];
  
  switch (mode) {
    case 'cheaper':
      alternatives = products
        .filter(p => p.category === original.category && p.price < original.price && p.id !== productId)
        .sort((a, b) => a.price - b.price)
        .slice(0, 3);
      break;
    case 'more_protein':
      alternatives = products
        .filter(p => p.protein > original.protein && p.id !== productId)
        .sort((a, b) => b.protein - a.protein)
        .slice(0, 3);
      break;
    case 'less_sugar':
      alternatives = products
        .filter(p => p.sugar < original.sugar && p.id !== productId && p.category === original.category)
        .sort((a, b) => a.sugar - b.sugar)
        .slice(0, 3);
      if (alternatives.length === 0) {
        alternatives = products
          .filter(p => p.sugar === 0 && p.id !== productId)
          .slice(0, 3);
      }
      break;
    case 'higher_rating':
      alternatives = products
        .filter(p => p.category === original.category && p.rating > original.rating && p.id !== productId)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);
      break;
    case 'no_lactose':
      alternatives = products
        .filter(p => p.tags.includes('без лактозы') && p.id !== productId)
        .slice(0, 3);
      break;
    default:
      alternatives = products
        .filter(p => p.category === original.category && p.id !== productId)
        .slice(0, 3);
  }
  
  return alternatives;
}

/**
 * Get MCP connection status (for dev screen)
 */
export function getMcpStatus() {
  return {
    mode: DEMO_MODE ? 'Demo' : 'Real MCP',
    services: {
      products_search: DEMO_MODE ? 'mock' : 'connected',
      product_details: DEMO_MODE ? 'mock' : 'connected',
      cart_link_create: DEMO_MODE ? 'mock' : 'connected',
    },
    lastRequest: DEMO_MODE ? 'searchProducts("индейка")' : null,
    lastResponse: DEMO_MODE ? '{ products: [...], count: 2 }' : null,
    endpoint: DEMO_MODE ? 'localhost (mock)' : import.meta.env.VITE_VKUSVILL_MCP_URL || 'not configured',
  };
}

// Utility
function simulateDelay() {
  return new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY));
}
