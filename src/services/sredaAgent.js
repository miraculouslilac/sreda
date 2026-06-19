/**
 * Sreda AI Agent Service
 * 
 * This module contains the AI agent logic for:
 * - Building nutrition context from user answers
 * - Generating meal plans
 * - Building cart from meal plan
 * - Optimizing cart (cheaper, more protein, less sugar, etc.)
 * - Replacing individual products
 * - Generating cooking suggestions
 * 
 * Currently uses mock logic. In production, this would call an LLM
 * with the user's health context and VkusVill product catalog.
 * 
 * TODO: Connect to LLM (e.g., GPT-4) for intelligent meal planning
 * TODO: Use HealthOS API for user health data (blood tests, activity, etc.)
 */

import { products } from '../mockData/products';
import { mealPlans } from '../mockData/mealPlan';
import { recipes } from '../mockData/recipes';

/**
 * Build nutrition context from user's onboarding answers
 * 
 * @param {object} userAnswers - { goal, days, people, budget, restrictions, cookingTime }
 * @returns {object} - Nutrition context for meal plan generation
 */
export function buildNutritionContext(userAnswers) {
  const { goal, days, people, budget, restrictions, cookingTime } = userAnswers;
  
  const goalDescriptions = {
    energy: 'Больше энергии и стабильный уровень сахара в крови',
    weight_loss: 'Снижение веса через дефицит калорий и высокий белок',
    sugar_control: 'Контроль сахара: минимум простых углеводов, акцент на белок и клетчатку',
    sport: 'Спорт и восстановление: высокий белок, магний, сложные углеводы',
    healthy: 'Сбалансированное здоровое питание',
  };

  const focusMap = {
    energy: 'белок + сложные углеводы + стабильная энергия',
    weight_loss: 'белок + овощи + низкокалорийные блюда',
    sugar_control: 'белок + клетчатка + сложные углеводы',
    sport: 'белок + магний + восстановление',
    healthy: 'баланс + разнообразие + свежие продукты',
  };

  const agentMessages = {
    energy: 'Соберу корзину с акцентом на продукты, которые дают стабильную энергию без скачков сахара.',
    weight_loss: 'Подберу продукты с высоким содержанием белка и клетчатки — они помогают дольше оставаться сытым.',
    sugar_control: 'Буду избегать продуктов с высоким содержанием сахара и соберу корзину с акцентом на белок, овощи, клетчатку и сложные углеводы.',
    sport: 'Добавлю продукты для восстановления: белок, магний, сложные углеводы, удобные перекусы.',
    healthy: 'Соберу сбалансированную корзину с разнообразными свежими продуктами.',
  };

  return {
    goal: goalDescriptions[goal] || goalDescriptions.healthy,
    goalKey: goal || 'healthy',
    focus: focusMap[goal] || focusMap.healthy,
    agentMessage: agentMessages[goal] || agentMessages.healthy,
    days: days || 5,
    people: people || 1,
    budget: budget || 'flexible',
    restrictions: restrictions || [],
    cookingTime: cookingTime || '20min',
  };
}

/**
 * Generate a meal plan based on nutrition context
 * 
 * TODO: Replace with LLM-powered meal plan generation
 * 
 * @param {object} context - Nutrition context from buildNutritionContext
 * @returns {Promise<Array>} - Array of day plans
 */
export async function generateMealPlan(context) {
  // Simulate AI thinking time
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const plan = mealPlans.default.slice(0, context.days);
  return plan;
}

/**
 * Build a cart from the meal plan
 * 
 * TODO: Use VkusVill MCP to search for real products matching meal plan ingredients
 * 
 * @param {Array} mealPlan - Generated meal plan
 * @param {object} context - Nutrition context
 * @returns {Promise<Array>} - Array of product IDs for the cart
 */
export async function buildCartFromMealPlan(mealPlan, context) {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Select products based on goal
  let selectedIds = [];
  
  switch (context.goalKey) {
    case 'energy':
    case 'sugar_control':
      selectedIds = ['p001', 'p004', 'p005', 'p006', 'p007', 'p008', 'p010', 'p012', 'p013', 'p014', 'p015', 'p016', 'p017', 'p018', 'p019', 'p022', 'p023'];
      break;
    case 'weight_loss':
      selectedIds = ['p001', 'p002', 'p004', 'p005', 'p006', 'p010', 'p012', 'p013', 'p014', 'p015', 'p017', 'p018', 'p020'];
      break;
    case 'sport':
      selectedIds = ['p001', 'p002', 'p003', 'p004', 'p005', 'p006', 'p007', 'p008', 'p010', 'p015', 'p016', 'p017', 'p019', 'p022', 'p023'];
      break;
    default:
      selectedIds = ['p001', 'p004', 'p005', 'p006', 'p007', 'p009', 'p010', 'p011', 'p012', 'p013', 'p014', 'p015', 'p016', 'p018', 'p019', 'p021', 'p022', 'p023'];
  }
  
  // Filter by budget
  if (context.budget === '3000') {
    const budgetProducts = products.filter(p => selectedIds.includes(p.id) && p.price <= 200);
    selectedIds = budgetProducts.map(p => p.id).slice(0, 12);
  }
  
  return selectedIds;
}

/**
 * Optimize cart based on mode
 * 
 * @param {Array} cartProductIds - Current cart product IDs
 * @param {string} mode - 'cheaper' | 'more_protein' | 'less_sugar' | 'lighter' | 'higher_rating'
 * @returns {Promise<Array>} - Updated cart product IDs
 */
export async function optimizeCart(cartProductIds, mode) {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  let currentProducts = products.filter(p => cartProductIds.includes(p.id));
  
  switch (mode) {
    case 'cheaper':
      // Remove expensive items, add budget alternatives
      currentProducts = currentProducts
        .sort((a, b) => a.price - b.price)
        .slice(0, Math.max(10, currentProducts.length - 3));
      break;
    case 'more_protein':
      // Add high-protein products
      const highProtein = products
        .filter(p => p.protein >= 15 && !cartProductIds.includes(p.id))
        .slice(0, 2);
      currentProducts = [...currentProducts, ...highProtein];
      break;
    case 'less_sugar':
      // Remove products with sugar > 5
      currentProducts = currentProducts.filter(p => p.sugar <= 5);
      break;
    default:
      break;
  }
  
  return currentProducts.map(p => p.id);
}

/**
 * Replace a product with an alternative
 * 
 * @param {string} productId - Product to replace
 * @param {string} mode - Replacement mode
 * @returns {Promise<object|null>} - Replacement product or null
 */
export async function replaceProduct(productId, mode) {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const original = products.find(p => p.id === productId);
  if (!original) return null;
  
  const alternatives = products.filter(p => 
    p.category === original.category && p.id !== productId
  );
  
  if (alternatives.length === 0) return null;
  
  switch (mode) {
    case 'cheaper':
      return alternatives.sort((a, b) => a.price - b.price)[0];
    case 'more_protein':
      return alternatives.sort((a, b) => b.protein - a.protein)[0];
    case 'less_sugar':
      return alternatives.sort((a, b) => a.sugar - b.sugar)[0];
    case 'higher_rating':
      return alternatives.sort((a, b) => b.rating - a.rating)[0];
    default:
      return alternatives[0];
  }
}

/**
 * Generate cooking suggestions based on cart and context
 * 
 * @param {Array} cartProductIds - Cart product IDs
 * @param {object} context - Nutrition context
 * @returns {Promise<Array>} - Array of recipe suggestions
 */
export async function generateCookingSuggestions(cartProductIds, context) {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Filter recipes that use products from the cart
  const relevant = recipes.filter(r => 
    r.products.some(pid => cartProductIds.includes(pid))
  );
  
  return relevant.length > 0 ? relevant : recipes.slice(0, 3);
}
