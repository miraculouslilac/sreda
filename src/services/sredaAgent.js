import { mealPlans } from '../mockData/mealPlan';
import {
  getFallbackProducts,
  searchProducts,
  setMcpError,
} from './vkusvillMcpAdapter';

const categoryLabels = {
  protein: 'Белок',
  vegetables: 'Овощи и зелень',
  grains: 'Сложные углеводы',
  dairy: 'Молочные продукты',
  snacks: 'Перекусы',
  ready: 'Готовые блюда',
};

const goalProfiles = {
  energy: {
    focus: 'стабильная энергия',
    queries: ['филе индейки', 'яйца', 'гречка', 'брокколи', 'авокадо', 'йогурт без сахара'],
  },
  weight_loss: {
    focus: 'сытость при умеренной калорийности',
    queries: ['филе курицы', 'творог', 'брокколи', 'овощной салат', 'гречка', 'готовый суп'],
  },
  sugar_control: {
    focus: 'меньше сахара, больше белка и клетчатки',
    queries: ['филе индейки', 'яйца', 'овощи', 'гречка', 'йогурт без сахара', 'орехи'],
  },
  sport: {
    focus: 'белок и восстановление',
    queries: ['филе индейки', 'творог', 'яйца', 'гречка', 'бананы', 'протеиновый батончик'],
  },
  healthy: {
    focus: 'баланс и разнообразие',
    queries: ['филе индейки', 'яйца', 'овощи', 'гречка', 'йогурт', 'хумус'],
  },
  custom: {
    focus: 'индивидуальный сбалансированный рацион',
    queries: ['филе индейки', 'яйца', 'овощи', 'гречка', 'йогурт', 'готовый боул'],
  },
};

const categoryByIndex = ['protein', 'protein', 'vegetables', 'grains', 'dairy', 'snacks'];

export function buildNutritionContext(preferences) {
  const profile = goalProfiles[preferences.goal] || goalProfiles.healthy;
  const peopleMultiplier = preferences.people === 'family' ? 3 : Number(preferences.people || 1);
  const targetItems = Math.min(18, Math.max(8, (preferences.days || 5) * 2));
  return {
    ...preferences,
    ...profile,
    peopleMultiplier,
    targetItems,
  };
}

function reasonFor(query, context) {
  const restrictionText = context.restrictions?.length && !context.restrictions.includes('none')
    ? ` с учётом ограничений: ${context.restrictions.join(', ')}`
    : '';
  return `Выбрано для фокуса «${context.focus}»${restrictionText}. Поиск: «${query}».`;
}

function scoreProduct(product, context, query) {
  let score = product.rating * 10 + Math.log10(product.ratingCount + 1) * 5;
  const name = product.name.toLowerCase();
  const words = query.toLowerCase().split(/\s+/);
  score += words.filter((word) => name.includes(word)).length * 20;
  if (context.budget === '3000') score -= product.price / 25;
  if (context.goal === 'weight_loss' && product.kcal) score -= product.kcal / 30;
  if (context.goal === 'sport' && product.protein) score += product.protein * 2;
  return score;
}

export async function generateCart(preferences) {
  const context = buildNutritionContext(preferences);
  try {
    const groups = await Promise.all(
      context.queries.map(async (query, index) => {
        const category = categoryByIndex[index] || 'other';
        const results = await searchProducts(query, {
          category,
          sort: context.budget === '3000' ? 'price_asc' : 'rating',
          reason: reasonFor(query, context),
        });
        return results
          .sort((a, b) => scoreProduct(b, context, query) - scoreProduct(a, context, query))
          .slice(0, context.peopleMultiplier > 1 ? 3 : 2)
          .map((product) => ({
            ...product,
            category,
            categoryLabel: categoryLabels[category],
            quantity: context.peopleMultiplier > 1 ? 2 : 1,
          }));
      })
    );
    const unique = [...new Map(groups.flat().map((product) => [product.id, product])).values()];
    if (!unique.length) throw new Error('Поиск не вернул подходящих товаров');
    return unique.slice(0, context.targetItems);
  } catch (error) {
    setMcpError(error);
    return getFallbackProducts().slice(0, context.targetItems);
  }
}

export function generateMealPlan(preferences) {
  const days = Math.min(preferences.days || 5, mealPlans.length);
  return mealPlans.slice(0, days);
}

export function optimizeCart(cart, mode) {
  if (mode === 'cheaper') {
    return [...cart].sort((a, b) => a.price - b.price).slice(0, Math.max(8, cart.length - 2));
  }
  if (mode === 'more_protein') {
    return [...cart].sort((a, b) => (b.protein || 0) - (a.protein || 0));
  }
  if (mode === 'less_sugar') {
    return cart.filter((product) =>
      /без сахара|овощ|мяс|птиц|яйц|греч|орех/i.test(`${product.name} ${product.description}`)
    );
  }
  return cart;
}
