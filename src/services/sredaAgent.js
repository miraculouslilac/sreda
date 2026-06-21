import {
  getFallbackProducts,
  searchRecipes,
  searchProducts,
  setMcpError,
} from './vkusvillMcpAdapter';

const categoryLabels = {
  protein: 'Белок',
  vegetables: 'Овощи и зелень',
  grains: 'Крупы / сложные углеводы',
  dairy: 'Молочные / альтернативы',
  snacks: 'Перекусы',
  ready: 'Готовые решения',
};

const goalProfiles = {
  energy: {
    focus: 'стабильная энергия без резких спадов',
    searches: [
      ['филе индейки', 'protein'],
      ['яйца куриные', 'protein'],
      ['гречка зелёная', 'grains'],
      ['авокадо', 'vegetables'],
      ['йогурт греческий без сахара', 'dairy'],
      ['орехи миндаль', 'snacks'],
    ],
    meals: {
      breakfast: ['Омлет с зеленью и авокадо', 'Греческий йогурт с орехами'],
      lunch: ['Индейка с гречкой и овощами', 'Тёплый боул с птицей и крупой'],
      dinner: ['Овощи с яйцом и зеленью', 'Лёгкая индейка с овощами'],
      snack: ['Йогурт без сахара', 'Небольшая порция орехов'],
    },
  },
  weight_loss: {
    focus: 'сытость при умеренной калорийности',
    searches: [
      ['филе куриной грудки', 'protein'],
      ['творог обезжиренный', 'dairy'],
      ['брокколи свежая', 'vegetables'],
      ['овощной салат без майонеза', 'vegetables'],
      ['гречка порционная', 'grains'],
      ['суп овощной готовый', 'ready'],
    ],
    meals: {
      breakfast: ['Творог с зеленью', 'Яичный белковый завтрак'],
      lunch: ['Куриная грудка с брокколи', 'Овощной суп с белком'],
      dinner: ['Большой овощной салат с птицей', 'Лёгкий суп и овощи'],
      snack: ['Творог без добавок', 'Свежие овощи'],
    },
  },
  sugar_control: {
    focus: 'меньше сахара, больше белка и клетчатки',
    searches: [
      ['филе индейки без маринада', 'protein'],
      ['яйца куриные', 'protein'],
      ['овощи свежие без соуса', 'vegetables'],
      ['гречка зелёная', 'grains'],
      ['йогурт натуральный без сахара', 'dairy'],
      ['орехи без сахара', 'snacks'],
    ],
    meals: {
      breakfast: ['Омлет с овощами без сладких соусов', 'Натуральный йогурт с орехами'],
      lunch: ['Индейка с зелёной гречкой', 'Белковый салат с овощами'],
      dinner: ['Овощи и яйцо', 'Индейка с брокколи'],
      snack: ['Орехи без глазури', 'Йогурт без сахара'],
    },
  },
  sport: {
    focus: 'белок, восстановление и сложные углеводы',
    searches: [
      ['куриная грудка готовая', 'protein'],
      ['творог высокобелковый', 'dairy'],
      ['яйца куриные', 'protein'],
      ['киноа крупа', 'grains'],
      ['бананы', 'snacks'],
      ['батончик протеиновый без сахара', 'snacks'],
    ],
    meals: {
      breakfast: ['Высокобелковый творог с бананом', 'Омлет после тренировки'],
      lunch: ['Куриная грудка с киноа', 'Белковый боул с крупой'],
      dinner: ['Омлет с курицей и овощами', 'Творог и лёгкий гарнир'],
      snack: ['Протеиновый батончик', 'Банан и творог'],
    },
  },
  healthy: {
    focus: 'разнообразие и сбалансированный рацион',
    searches: [
      ['рыба филе охлаждённая', 'protein'],
      ['яйца куриные', 'protein'],
      ['овощи сезонные', 'vegetables'],
      ['киноа крупа', 'grains'],
      ['кефир натуральный', 'dairy'],
      ['хумус классический', 'snacks'],
    ],
    meals: {
      breakfast: ['Яйца с сезонными овощами', 'Кефир и лёгкий завтрак'],
      lunch: ['Рыба с киноа и овощами', 'Сбалансированный боул с хумусом'],
      dinner: ['Запечённая рыба с овощами', 'Овощи с яйцом'],
      snack: ['Хумус с овощами', 'Кефир'],
    },
  },
  custom: {
    focus: 'гибкий сбалансированный рацион',
    searches: [
      ['индейка готовая', 'protein'],
      ['яйца куриные', 'protein'],
      ['овощная смесь', 'vegetables'],
      ['рис бурый', 'grains'],
      ['йогурт натуральный', 'dairy'],
      ['хумус', 'snacks'],
    ],
    meals: {
      breakfast: ['Яйца с овощами', 'Натуральный йогурт'],
      lunch: ['Индейка с бурым рисом', 'Боул с овощами и хумусом'],
      dinner: ['Овощная смесь с белком', 'Лёгкая индейка с овощами'],
      snack: ['Хумус', 'Йогурт'],
    },
  },
};

const restrictionLabels = {
  no_sugar: 'без сахара',
  no_lactose: 'без лактозы',
  no_gluten: 'без глютена',
  vegetarian: 'вегетарианский рацион',
};

const supportingSearches = [
  ['помидоры свежие', 'vegetables'],
  ['огурцы свежие', 'vegetables'],
  ['зелень свежая', 'vegetables'],
  ['морковь свежая', 'vegetables'],
  ['масло оливковое', 'snacks'],
  ['лук репчатый', 'vegetables'],
];

function adaptSearches(searches, preferences) {
  let result = [...searches, ...supportingSearches].map(([query, category]) => ({ query, category }));
  const restrictions = preferences.restrictions || [];

  if (restrictions.includes('vegetarian')) {
    result = result.map((item) => item.category === 'protein'
      ? { query: item.query.includes('яйц') ? 'яйца куриные' : 'тофу нут фасоль', category: 'protein' }
      : item);
  }
  if (restrictions.includes('no_lactose')) {
    result = result.map((item) => item.category === 'dairy'
      ? { query: 'йогурт кокосовый без сахара', category: 'dairy' }
      : item);
  }
  if (restrictions.includes('no_gluten')) {
    result = result.map((item) => item.category === 'grains'
      ? { query: 'гречка киноа без глютена', category: 'grains' }
      : item);
  }
  if (restrictions.includes('no_sugar')) {
    result = result.map((item) =>
      ['dairy', 'snacks', 'ready'].includes(item.category)
        ? { ...item, query: `${item.query} без сахара` }
        : item
    );
  }
  if (preferences.cookingTime === 'ready') {
    result = [
      { query: 'готовая куриная грудка', category: 'protein' },
      { query: 'готовое яйцо варёное', category: 'protein' },
      { query: 'овощной салат готовый', category: 'vegetables' },
      { query: 'гречка готовая', category: 'grains' },
      { query: restrictions.includes('no_lactose') ? 'йогурт растительный' : 'творог готовый завтрак', category: 'dairy' },
      { query: 'готовый боул полезный', category: 'ready' },
      { query: 'овощи нарезанные готовые', category: 'vegetables' },
      { query: 'салат листовой мытый', category: 'vegetables' },
      { query: 'орехи порционные', category: 'snacks' },
    ];
  } else if (preferences.cookingTime === '10') {
    result = result.map((item) =>
      ['protein', 'grains'].includes(item.category)
        ? { ...item, query: `${item.query} готовый` }
        : item
    );
  }

  return result;
}

function adaptMeals(meals, preferences) {
  const restrictions = preferences.restrictions || [];
  if (restrictions.includes('vegetarian')) {
    return {
      breakfast: ['Омлет с овощами и зеленью', 'Тофу-скрэмбл с томатами'],
      lunch: ['Тофу с гречкой и овощами', 'Боул с нутом и крупой'],
      dinner: ['Овощи с яйцом', 'Тофу с брокколи'],
      snack: restrictions.includes('no_lactose')
        ? ['Хумус с овощами', 'Орехи и фрукт']
        : ['Натуральный йогурт', 'Хумус с овощами'],
    };
  }
  if (restrictions.includes('no_lactose')) {
    return {
      ...meals,
      breakfast: meals.breakfast.map((name) => name.replace(/йогурт|творог/gi, 'растительный йогурт')),
      snack: ['Растительный йогурт без сахара', 'Орехи и фрукт'],
    };
  }
  return meals;
}

export function buildNutritionContext(preferences) {
  const profile = goalProfiles[preferences.goal] || goalProfiles.healthy;
  const peopleMultiplier = preferences.people === 'family' ? 3 : Number(preferences.people || 1);
  const days = Number(preferences.days || 5);
  return {
    ...preferences,
    ...profile,
    meals: adaptMeals(profile.meals, preferences),
    searches: adaptSearches(profile.searches, preferences),
    peopleMultiplier,
    targetItems: Math.min(20, Math.max(12, days * 2 + 4)),
  };
}

function inferCategory(product, requestedCategory) {
  const name = product.name.toLowerCase();
  const catalog = (product.catalogCategories || []).join(' ').toLowerCase();
  if (/яйц|индей|куриц|курин|рыб|тун|тофу|нут|фасол|мяс/.test(name)) return 'protein';
  if (/творог|йогурт|кефир|молоч|сыр|рикот/.test(name)) return 'dairy';
  if (/греч|киноа|рис|булгур|круп|овся|макарон/.test(name)) return 'grains';
  if (/банан|яблок|груш|ягод|фрукт|орех|хумус|батончик/.test(name)) return 'snacks';
  if (/броккол|овощ|томат|помид|авокад|шпинат|зелень|огур|морков|руккол/.test(name)) return 'vegetables';
  if (/боул|суп|готов|котлет|запеканк|салат/.test(name)) return 'ready';
  if (/яйц|мяс|птиц|рыб|бобов|тофу/.test(catalog)) return 'protein';
  if (/молоч|сыр|йогурт|творог/.test(catalog)) return 'dairy';
  if (/круп|макарон|хлеб/.test(catalog)) return 'grains';
  return requestedCategory;
}

function violatesRestrictions(product, restrictions = []) {
  const text = `${product.name} ${product.description} ${product.composition}`.toLowerCase();
  if (restrictions.includes('vegetarian') && /индей|куриц|мяс|рыб|тун|кревет|морепродукт|ветчин|колбас/.test(text)) return true;
  if (
    restrictions.includes('no_lactose')
    && /молок|сливк|творог|кефир|йогурт|сыр/.test(text)
    && !/безлактоз|кокос|раститель|соев|миндал/.test(text)
  ) return true;
  if (restrictions.includes('no_gluten') && /пшениц|булгур|макарон|хлеб|кус-?кус|ячмен/.test(text)) return true;
  if (restrictions.includes('no_sugar') && /с сахаром|сгущ|глазур|сироп|шоколадн/.test(text)) return true;
  return false;
}

function queryStems(query) {
  const stopWords = new Set(['без', 'сахара', 'готовый', 'готовая', 'готовое', 'свежий', 'свежая', 'натуральный', 'натуральная']);
  return query
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.replace(/[^а-яёa-z]/gi, ''))
    .filter((word) => word.length >= 4 && !stopWords.has(word))
    .map((word) => word.slice(0, Math.min(5, word.length)));
}

function isRelevant(product, query) {
  const text = `${product.name} ${(product.catalogCategories || []).join(' ')}`.toLowerCase();
  const stems = queryStems(query);
  if (stems.length === 0) return true;
  if (/тофу.*нут.*фасол/.test(query.toLowerCase())) return stems.some((stem) => text.includes(stem));
  return text.includes(stems[0]) || (stems[1] && text.includes(stems[1]));
}

function reasonFor(search, context) {
  const restrictions = (context.restrictions || [])
    .filter((item) => item !== 'none')
    .map((item) => restrictionLabels[item])
    .filter(Boolean);
  return `Фокус: ${context.focus}.${restrictions.length ? ` Учтено: ${restrictions.join(', ')}.` : ''} Поиск: «${search.query}».`;
}

function scoreProduct(product, context, search) {
  let score = product.rating * 10 + Math.log10(product.ratingCount + 1) * 5;
  const name = product.name.toLowerCase();
  score += search.query.toLowerCase().split(/\s+/).filter((word) => word.length > 2 && name.includes(word)).length * 22;
  if (context.budget === '3000') score -= product.price / 18;
  if (context.budget === '8000' || context.budget === 'flexible') score += product.ratingCount > 1000 ? 5 : 0;
  if (context.goal === 'weight_loss' && product.kcal) score -= product.kcal / 20;
  if (context.goal === 'sport' && product.protein) score += product.protein * 3;
  if (context.goal === 'sugar_control' && /без сахара/.test(`${product.name} ${product.description}`.toLowerCase())) score += 30;
  return score;
}

function quantityFor(category, context) {
  const portions = context.peopleMultiplier * Number(context.days || 5);
  if (category === 'protein') return Math.max(1, Math.ceil(portions / 4));
  if (category === 'vegetables') return Math.max(1, Math.ceil(portions / 5));
  if (category === 'grains') return Math.max(1, Math.ceil(portions / 8));
  if (category === 'dairy' || category === 'snacks') return Math.max(1, Math.ceil(portions / 6));
  return Math.max(1, Math.ceil(portions / 7));
}

function interleave(groups, limit) {
  const result = [];
  const maxLength = Math.max(...groups.map((group) => group.length), 0);
  for (let index = 0; index < maxLength && result.length < limit; index += 1) {
    groups.forEach((group) => {
      if (group[index] && result.length < limit) result.push(group[index]);
    });
  }
  return result;
}

export async function generateCart(preferences) {
  const context = buildNutritionContext(preferences);
  try {
    const groups = await Promise.all(
      context.searches.map(async (search) => {
        const results = await searchProducts(search.query, {
          category: search.category,
          sort: context.budget === '3000' ? 'price_asc' : 'rating',
          reason: reasonFor(search, context),
          pages: context.budget === '3000' ? 3 : 2,
          vvonly: 0,
        });
        return results
          .filter((product) => isRelevant(product, search.query))
          .filter((product) => !violatesRestrictions(product, context.restrictions))
          .map((product) => {
            const category = inferCategory(product, search.category);
            return {
              ...product,
              category,
              categoryLabel: categoryLabels[category],
              quantity: quantityFor(category, context),
            };
          })
          .sort((a, b) => scoreProduct(b, context, search) - scoreProduct(a, context, search))
          .slice(0, 4);
      })
    );
    const uniqueGroups = groups.map((group) => [...new Map(group.map((product) => [product.id, product])).values()]);
    const unique = [...new Map(interleave(uniqueGroups, context.targetItems).map((product) => [product.id, product])).values()];
    if (!unique.length) throw new Error('Поиск не вернул подходящих товаров');
    return unique;
  } catch (error) {
    setMcpError(error);
    return getFallbackProducts()
      .filter((product) => !violatesRestrictions(product, context.restrictions))
      .map((product) => ({ ...product, category: inferCategory(product, product.category) }))
      .slice(0, context.targetItems);
  }
}

function firstProduct(cart, category, pattern) {
  return cart.find((product) => product.category === category && (!pattern || pattern.test(product.name.toLowerCase())))
    || cart.find((product) => product.category === category);
}

function productNames(cart, categories) {
  return categories
    .map((category) => firstProduct(cart, category))
    .filter(Boolean)
    .map((product) => product.name);
}

function recipeFilters(preferences) {
  const restrictions = preferences.restrictions || [];
  const excludeAllergenIds = [];
  if (restrictions.includes('no_gluten')) excludeAllergenIds.push(305747);
  if (restrictions.includes('no_lactose')) excludeAllergenIds.push(305748);
  if (restrictions.includes('no_sugar')) excludeAllergenIds.push(305752);
  const categoryId = restrictions.includes('vegetarian')
    ? 344
    : preferences.goal === 'sport'
      ? 2368
      : preferences.goal === 'weight_loss'
        ? 2370
        : preferences.goal === 'sugar_control'
          ? 2372
          : 334;
  const cookingTimeId = preferences.cookingTime === '20' || preferences.cookingTime === '10'
    ? 397967
    : preferences.cookingTime === '40'
      ? 305736
      : 0;
  return { excludeAllergenIds, categoryId, cookingTimeId };
}

function recipeQueries(cart) {
  const protein = firstProduct(cart, 'protein');
  const grain = firstProduct(cart, 'grains');
  const vegetable = firstProduct(cart, 'vegetables');
  const ingredientQueries = cart
    .filter((product) => ['protein', 'grains', 'vegetables', 'dairy', 'snacks'].includes(product.category))
    .map((product) => product.name.split(/[",]/)[0])
    .filter(Boolean)
    .slice(0, 4);
  const queries = [
    [protein, grain].filter(Boolean).map((product) => product.name.split(/[",]/)[0]).join(' '),
    [protein, vegetable].filter(Boolean).map((product) => product.name.split(/[",]/)[0]).join(' '),
    vegetable?.name.split(/[",]/)[0] || '',
    ...ingredientQueries,
    '',
  ];
  return [...new Set(queries.filter((query, index) => query || index === queries.length - 1))];
}

function recipeMatchesCart(recipe, cart) {
  const cartText = cart.map((product) => product.name.toLowerCase()).join(' ');
  const meaningful = recipe.ingredients
    .map((ingredient) => ingredient.name.toLowerCase().split(/\s+/)[0])
    .filter((word) => word.length >= 4);
  return meaningful.filter((word) => cartText.includes(word.slice(0, 5))).length;
}

function recipeProductNames(recipe, cart) {
  const names = recipe.ingredients.map((ingredient) => ingredient.name.toLowerCase());
  return cart
    .filter((product) => names.some((name) => {
      const stem = name.split(/\s+/)[0]?.slice(0, 5);
      return stem && product.name.toLowerCase().includes(stem);
    }))
    .map((product) => product.name)
    .slice(0, 5);
}

function normalizeMcpRecipe(recipe, cart, context) {
  const productNamesInCart = recipeProductNames(recipe, cart);
  return {
    ...recipe,
    productNames: productNamesInCart.length
      ? productNamesInCart
      : recipe.ingredients.slice(0, 5).map((ingredient) => `${ingredient.name} — ${ingredient.quantity}`),
    products: cart.filter((product) => productNamesInCart.includes(product.name)).map((product) => product.id),
    tags: [context.focus, recipe.complexity || 'рецепт ВкусВилла'],
    why: `Реальный рецепт ВкусВилла под цель «${context.focus}». Совпадает с ${recipeMatchesCart(recipe, cart)} ингредиентами текущей корзины.`,
  };
}

export async function generateRecipes(preferences, cart) {
  const context = buildNutritionContext(preferences);
  const filters = recipeFilters(preferences);
  const targetCount = Number(preferences.days || 5) * 4;
  const fallbackRecipes = generateFallbackRecipes(preferences, cart, targetCount);
  try {
    const queries = recipeQueries(cart);
    const groups = await Promise.all(
      queries.flatMap((query) => query
        ? [searchRecipes(query, { ...filters, page: 1 })]
        : [1, 2, 3].map((page) => searchRecipes('', { ...filters, page }))
      )
    );
    const mcpRecipes = [...new Map(groups.flat().map((recipe) => [recipe.id, recipe])).values()]
      .sort((a, b) => recipeMatchesCart(b, cart) - recipeMatchesCart(a, cart))
      .filter((recipe) => recipeMatchesCart(recipe, cart) > 0)
      .map((recipe) => normalizeMcpRecipe(recipe, cart, context));

    return [...mcpRecipes, ...fallbackRecipes]
      .filter((recipe, index, all) => {
        const key = String(recipe.name).trim().toLowerCase();
        return key && all.findIndex((candidate) => (
          String(candidate.name).trim().toLowerCase() === key
        )) === index;
      })
      .slice(0, targetCount);
  } catch {
    // The deterministic fallback below keeps the flow usable.
  }

  return fallbackRecipes;
}

function generateFallbackRecipes(preferences, cart, targetCount = Number(preferences.days || 5) * 4) {
  const context = buildNutritionContext(preferences);
  const quick = preferences.cookingTime === '10' || preferences.cookingTime === 'ready';
  const cookingTime = quick ? '8–10 мин' : preferences.cookingTime === '40' ? '30–40 мин' : '15–20 мин';
  const byCategory = (category) => cart.filter((product) => product.category === category);
  const proteins = byCategory('protein');
  const vegetables = byCategory('vegetables');
  const grains = byCategory('grains');
  const dairy = byCategory('dairy');
  const snacks = [...byCategory('snacks'), ...byCategory('ready')];
  const pick = (items, index) => items.length ? items[index % items.length] : null;
  const mealNames = {
    breakfast: [
      ...context.meals.breakfast,
      'Тёплый белковый завтрак с овощами',
      'Завтрак-боул с крупой и зеленью',
      'Овощной скрэмбл с белковой основой',
      'Сытный завтрак с крупой',
      'Лёгкий завтрак с овощами',
    ],
    lunch: [
      ...context.meals.lunch,
      'Тёплый боул с крупой и овощами',
      'Белковая тарелка с сезонными овощами',
      'Крупа с овощами и белковой основой',
      'Сытный салат с крупой',
      'Домашний обед из продуктов корзины',
    ],
    dinner: [
      ...context.meals.dinner,
      'Запечённые овощи с белковой основой',
      'Лёгкий ужин с овощами и зеленью',
      'Тёплый салат с белком',
      'Овощное рагу с белковой основой',
      'Белковое блюдо с сезонным гарниром',
    ],
    snack: [
      ...context.meals.snack,
      'Овощные палочки с полезной закуской',
      'Лёгкий перекус без готовки',
      'Белковый перекус без готовки',
      'Порционный перекус из корзины',
      'Быстрый перекус с овощами',
    ],
  };
  const types = ['breakfast', 'lunch', 'dinner', 'snack'];
  const templates = Array.from({ length: targetCount }, (_, index) => {
    const type = types[index % types.length];
    const variant = Math.floor(index / types.length);
    const products = type === 'breakfast'
      ? [pick(proteins, variant), pick(vegetables, variant), pick(dairy, variant)]
      : type === 'lunch'
        ? [pick(proteins, variant), pick(grains, variant), pick(vegetables, variant + 1)]
        : type === 'dinner'
          ? [pick(proteins, variant + 1), pick(vegetables, variant), pick(grains, variant + 1)]
          : [pick(dairy, variant), pick(snacks, variant), pick(vegetables, variant + 2)];
    return {
      name: mealNames[type][variant % mealNames[type].length],
      products: products.filter(Boolean),
      steps: type === 'snack'
        ? ['Отмерьте порцию', 'Соедините компоненты', 'Оставшиеся продукты уберите на следующий приём пищи']
        : ['Подготовьте продукты', quick ? 'Соберите или разогрейте компоненты' : 'Приготовьте компоненты выбранным способом', 'Добавьте овощи или зелень и подавайте'],
      type,
    };
  });

  return templates
    .filter((recipe) => recipe.products.length)
    .map((recipe, index) => {
      const proteinValue = recipe.products.reduce((sum, product) => sum + (product.protein || 0), 0);
      const kcalValue = recipe.products.reduce((sum, product) => sum + (product.kcal || 0), 0);
      return {
        id: `${preferences.goal || 'healthy'}-${recipe.type}-${index}`,
        name: recipe.name,
        time: recipe.type === 'snack' ? '3–5 мин' : cookingTime,
        kcal: kcalValue || (recipe.type === 'snack' ? 180 : 350),
        protein: proteinValue || 15,
        fat: null,
        carbs: null,
        tags: [context.focus, quick ? 'быстро' : 'домашнее'],
        products: recipe.products.map((product) => product.id),
        productNames: recipe.products.map((product) => product.name),
        steps: recipe.steps,
        why: `Подходит под цель «${context.focus}» и использует товары из вашей текущей корзины.`,
      };
    });
}

export function generateMealPlan(preferences, cart, recipes) {
  const days = Number(preferences.days || 5);
  const requiredMeals = days * 4;
  const fallbackRecipes = generateFallbackRecipes(preferences, cart, requiredMeals);
  const availableRecipes = [...(recipes || []), ...fallbackRecipes]
    .filter((recipe, index, all) => {
      const key = String(recipe.id || recipe.name).trim().toLowerCase();
      return key && all.findIndex((candidate) => (
        String(candidate.id || candidate.name).trim().toLowerCase() === key
      )) === index;
    });
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
  return Array.from({ length: days }, (_, dayIndex) => {
    const meals = mealTypes.map((type, mealIndex) => {
      const recipe = availableRecipes[dayIndex * mealTypes.length + mealIndex];

      return {
        type,
        name: recipe.name,
        time: recipe.time,
        kcal: recipe.kcal,
        protein: recipe.protein,
        fat: recipe.fat,
        carbs: recipe.carbs,
        tags: recipe.tags,
      };
    });

    return {
      day: dayIndex + 1,
      meals,
    };
  });
}

export function optimizeCart(cart, mode) {
  if (mode === 'cheaper') return [...cart].sort((a, b) => a.price - b.price).slice(0, Math.max(6, cart.length - 2));
  if (mode === 'more_protein') return [...cart].sort((a, b) => (b.protein || 0) - (a.protein || 0));
  if (mode === 'less_sugar') return cart.filter((product) => !violatesRestrictions(product, ['no_sugar']));
  return cart;
}

export function summarizeCart(cart) {
  return productNames(cart, ['protein', 'grains', 'vegetables', 'dairy']).slice(0, 4);
}
