import { products as fallbackProducts } from '../mockData/products';

export const MCP_URL = 'https://mcp001.vkusvill.ru/mcp';

let requestId = 0;
let status = {
  mode: 'Ожидание',
  connected: false,
  endpoint: MCP_URL,
  lastRequest: null,
  lastResponse: null,
  error: null,
};

function stripHtml(value = '') {
  const document = new DOMParser().parseFromString(String(value), 'text/html');
  return document.body.textContent?.trim() || '';
}

function parseNutrition(properties = []) {
  const nutrition = properties.find((item) =>
    item.name?.toLowerCase().includes('пищевая и энергетическая')
  )?.value || '';
  const clean = stripHtml(nutrition).replace(',', '.');
  const numberAfter = (label) => {
    const match = clean.match(new RegExp(`${label}[^\\d]*(\\d+(?:\\.\\d+)?)`, 'i'));
    return match ? Number(match[1]) : null;
  };

  return {
    protein: numberAfter('белки'),
    fat: numberAfter('жиры'),
    carbs: numberAfter('углеводы'),
    kcal: numberAfter('ккал') || Number(clean.match(/(\d+(?:\.\d+)?)\s*ккал/i)?.[1]) || null,
  };
}

function formatWeight(weight, unit) {
  if (!weight?.value) return unit || 'шт';
  const value = weight.unit === 'кг' && weight.value < 1
    ? `${Math.round(weight.value * 1000)} г`
    : `${weight.value} ${weight.unit}`;
  return value.replace('.', ',');
}

function normalizeProduct(item, category = 'other', reason = '') {
  const nutrition = parseNutrition(item.properties);
  const composition = stripHtml(
    item.properties?.find((property) => property.name?.toLowerCase() === 'состав')?.value
  );

  return {
    id: String(item.id),
    xmlId: Number(item.xml_id || item.id),
    name: stripHtml(item.name),
    description: stripHtml(item.description),
    price: Number(item.price?.current || 0),
    weight: formatWeight(item.weight, item.unit),
    category,
    kcal: nutrition.kcal,
    protein: nutrition.protein,
    fat: nutrition.fat,
    carbs: nutrition.carbs,
    rating: Number(item.rating?.average || 0),
    ratingCount: Number(item.rating?.count || 0),
    tags: [],
    composition,
    reason,
    image: item.images?.[0]?.medium || item.images?.[0]?.small || null,
    url: item.url || null,
    source: 'mcp',
  };
}

async function callTool(name, args) {
  status = { ...status, lastRequest: `${name}(${JSON.stringify(args)})`, error: null };
  const response = await fetch(MCP_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: ++requestId,
      method: 'tools/call',
      params: { name, arguments: args },
    }),
  });

  if (!response.ok) throw new Error(`MCP ответил ${response.status}`);
  const rpc = await response.json();
  if (rpc.error) throw new Error(rpc.error.message || 'Ошибка MCP');
  const text = rpc.result?.content?.find((part) => part.type === 'text')?.text;
  if (!text) throw new Error('MCP вернул пустой ответ');
  const payload = JSON.parse(text);
  if (!payload.ok) throw new Error(payload.error?.message || 'Инструмент MCP завершился с ошибкой');

  status = {
    ...status,
    mode: 'Real MCP',
    connected: true,
    lastResponse: `${name}: ok`,
    error: null,
  };
  return payload.data;
}

export async function searchProducts(query, options = {}) {
  const data = await callTool('vkusvill_products_search', {
    q: query,
    page: options.page || 1,
    sort: options.sort || 'rating',
    vvonly: options.vvonly ?? 1,
  });
  return (data.items || []).map((item) =>
    normalizeProduct(item, options.category, options.reason)
  );
}

export async function getProductDetails(productId, baseProduct = null) {
  const data = await callTool('vkusvill_product_details', { id: Number(productId) });
  return {
    ...baseProduct,
    ...normalizeProduct(
      data,
      baseProduct?.category || 'other',
      baseProduct?.reason || ''
    ),
  };
}

export async function getProductAnalogs(product, mode = 'rating') {
  const sort = mode === 'cheaper' ? 'price_asc' : mode === 'rating' ? 'rating' : 'popularity';
  const stopWords = new Set(['для', 'без', 'под', 'при', 'или', 'и', 'с', 'со', 'из', 'на', 'в']);
  const meaningfulWords = (product?.name || '')
    .toLowerCase()
    .replace(/[«»"'(),]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));
  const queryWords = meaningfulWords.slice(0, 3);
  const results = await searchProducts(queryWords.join(' ') || 'полезные продукты', {
    sort,
    category: product?.category,
    reason: product?.reason,
  });
  const relevant = results.filter((candidate) => {
    const name = candidate.name.toLowerCase();
    return queryWords.some((word) => name.includes(word));
  });
  return relevant.length ? relevant : results;
}

export async function createCartLink(cartProducts) {
  const products = cartProducts
    .filter((product) => product.xmlId)
    .slice(0, 20)
    .map((product) => ({ xml_id: Number(product.xmlId), q: Number(product.quantity || 1) }));
  if (!products.length) throw new Error('В корзине нет товаров ВкусВилла');
  const data = await callTool('vkusvill_cart_link_create', { products });
  return data.link;
}

export function getMcpStatus() {
  return status;
}

export function setMcpError(error) {
  status = {
    ...status,
    mode: 'Demo fallback',
    connected: false,
    error: error instanceof Error ? error.message : String(error),
  };
}

export function getFallbackProducts() {
  return fallbackProducts.map((product, index) => ({
    ...product,
    xmlId: null,
    source: 'demo',
    image: null,
    quantity: 1,
    id: `demo-${index + 1}`,
  }));
}
