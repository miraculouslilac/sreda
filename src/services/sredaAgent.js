/**
 * Sreda AI Agent Service
 * TODO: Connect to LLM for intelligent meal planning
 */
import { products } from '../mockData/products';
import { mealPlans } from '../mockData/mealPlan';
import { recipes } from '../mockData/recipes';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateMealPlan(preferences) {
  await delay(2000);
  const days = preferences.days || 5;
  return mealPlans.slice(0, days);
}

export async function generateCart(preferences) {
  await delay(1500);
  return products;
}

export async function getRecipeSuggestions(cartProductIds) {
  await delay(500);
  return recipes;
}

export async function getTodayRecommendation(state) {
  return {
    recipe: recipes[0],
    reason: 'Подходит под вашу цель: белок + сложные углеводы, готовится за 20 минут.',
    remaining: ['индейка', 'гречка', 'овощи', 'йогурт'],
  };
}
