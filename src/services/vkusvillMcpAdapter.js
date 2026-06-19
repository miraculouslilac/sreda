/**
 * VkusVill MCP Adapter
 * In DEMO_MODE, all functions return mock data.
 * To connect real VkusVill MCP:
 * 1. Set DEMO_MODE = false
 * 2. Set env vars: VITE_VKUSVILL_MCP_URL, VITE_VKUSVILL_MCP_TOKEN
 * 3. Implement real fetch calls to MCP tools
 * Reference: https://habr.com/ru/companies/vkusvill/articles/981866/
 */

import { products, cheaperAlternatives, proteinAlternatives } from '../mockData/products';

const DEMO_MODE = true;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function searchProducts(query, options = {}) {
  if (DEMO_MODE) {
    await delay(800);
    const q = query.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.tags.some(t => t.includes(q)) ||
      p.category === q
    );
  }
  // TODO: Real MCP call to vkusvill_products_search
}

export async function getProductDetails(productId) {
  if (DEMO_MODE) {
    await delay(500);
    return products.find(p => p.id === productId) || null;
  }
  // TODO: Real MCP call to vkusvill_product_details
}

export async function createCartLink(cartProducts) {
  if (DEMO_MODE) {
    await delay(1000);
    return {
      url: 'https://vkusvill.ru/cart?demo=true&items=' + cartProducts.length,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  }
  // TODO: Real MCP call to vkusvill_cart_link_create
}

export async function getAlternatives(productId, mode) {
  if (DEMO_MODE) {
    await delay(800);
    if (mode === 'cheaper') return cheaperAlternatives;
    if (mode === 'more_protein') return proteinAlternatives;
    return cheaperAlternatives;
  }
  // TODO: Search for alternatives via MCP
}

export function getMcpStatus() {
  return {
    mode: DEMO_MODE ? 'Demo' : 'Real MCP',
    services: {
      'products_search': DEMO_MODE ? 'mock' : 'connected',
      'product_details': DEMO_MODE ? 'mock' : 'connected',
      'cart_link_create': DEMO_MODE ? 'mock' : 'connected',
    },
    endpoint: DEMO_MODE ? 'localhost (mock)' : 'not set',
    lastRequest: DEMO_MODE ? 'searchProducts("белок")' : null,
    lastResponse: DEMO_MODE ? '{ products: [...18 items] }' : null,
  };
}
