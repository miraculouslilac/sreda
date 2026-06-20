import {
  getFallbackProducts,
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

function adaptSearches(searches, preferences) {
  let result = searches.map(([query, category]) => ({ query, category }));
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
    targetItems: Math.min(18, Math.max(8, days + 5)),
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
              quantity: context.peopleMultiplier > 1 ? Math.min(context.peopleMultiplier, 3) : 1,
            };
          })
          .sort((a, b) => scoreProduct(b, context, search) - scoreProduct(a, context, search))
          .slice(0, 3);
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

export function generateRecipes(preferences, cart) {
  const context = buildNutritionContext(preferences);
  const protein = firstProduct(cart, 'protein');
  const vegetables = firstProduct(cart, 'vegetables');
  const grain = firstProduct(cart, 'grains');
  const dairy = firstProduct(cart, 'dairy');
  const snack = firstProduct(cart, 'snacks') || firstProduct(cart, 'ready');
  const quick = preferences.cookingTime === '10' || preferences.cookingTime === 'ready';
  const cookingTime = quick ? '8–10 мин' : preferences.cookingTime === '40' ? '30–40 мин' : '15–20 мин';
  const names = context.meals;
  const vegetarianWithEggs = (preferences.restrictions || []).includes('vegetarian')
    && protein
    && /яйц/.test(protein.name.toLowerCase())
    && !/тофу/.test(protein.name.toLowerCase());
  const lunchName = vegetarianWithEggs ? 'Яйца с крупой и овощами' : names.lunch[0];
  const dinnerName = vegetarianWithEggs ? 'Овощи с яйцом и зеленью' : names.dinner[0];

  const templates = [
    {
      name: names.breakfast[0],
      products: [protein, vegetables].filter(Boolean),
      steps: quick
        ? ['Подготовьте продукты', 'Соедините или разогрейте компоненты', 'Добавьте зелень и подавайте']
        : ['Подготовьте белковую основу', 'Добавьте овощи', 'Готовьте до готовности и подавайте'],
      type: 'breakfast',
    },
    {
      name: lunchName,
      products: [protein, grain, vegetables].filter(Boolean),
      steps: ['Приготовьте или разогрейте крупу', 'Добавьте белковый продукт', 'Дополните овощами и специями'],
      type: 'lunch',
    },
    {
      name: dinnerName,
      products: [protein, vegetables].filter(Boolean),
      steps: ['Нарежьте компоненты', quick ? 'Соберите блюдо без долгой готовки' : 'Запеките или потушите до готовности', 'Подавайте тёплым'],
      type: 'dinner',
    },
    {
      name: names.snack[0],
      products: [dairy, snack].filter(Boolean),
      steps: ['Отмерьте порцию', 'Соедините компоненты', 'Уберите остаток на следующий перекус'],
      type: 'snack',
    },
  ];

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

export function generateMealPlan(preferences, cart) {
  const recipes = generateRecipes(preferences, cart);
  const context = buildNutritionContext(preferences);
  const days = Number(preferences.days || 5);
  return Array.from({ length: days }, (_, index) => ({
    day: index + 1,
    meals: ['breakfast', 'lunch', 'dinner', 'snack'].map((type, mealIndex) => {
      const recipe = recipes[mealIndex % recipes.length];
      const alternativeIndex = index % 2;
      return {
        type,
        name: context.meals[type][alternativeIndex] || recipe.name,
        time: recipe.time,
        kcal: recipe.kcal,
        protein: recipe.protein,
        fat: recipe.fat,
        carbs: recipe.carbs,
        tags: recipe.tags,
      };
    }),
  }));
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
