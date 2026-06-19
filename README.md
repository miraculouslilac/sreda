# Среда — ИИ-агент питания от HealthOS

**Среда** — это прототип мобильного ИИ-агента питания, который помогает пользователю собрать персональную продуктовую корзину во ВкусВилл под цели здоровья.

Это модуль экосистемы **HealthOS by Health Hero** — ИИ-операционной системы превентивного здоровья.

> ВкусВилл знает каталог продуктов. HealthOS знает контекст здоровья пользователя.  
> «Среда» соединяет это в персональную корзину под здоровье.

---

## 1. Что это за прототип

Кликабельный мобильный web-прототип (mobile-first, 360–430px), который демонстрирует полный пользовательский сценарий:

- Персональный ИИ-агент питания (не маркетплейс)
- Подбор корзины под цель здоровья, ограничения и ритм жизни
- Интеграция с каталогом ВкусВилл через MCP-адаптер (mock в demo-mode)
- Рецепты из купленных продуктов
- Петля возврата (ежедневные рекомендации)

**Технологии:** React + Vite, React Router (HashRouter), localStorage для состояния.  
**Деплой:** Статический билд, готов для Vercel / Netlify / GitHub Pages.

---

## 2. Как запустить

```bash
# Установить зависимости
pnpm install

# Запустить dev-сервер
pnpm dev

# Собрать для продакшена
pnpm build

# Превью продакшен-билда
pnpm preview
```

Откройте в браузере: `http://localhost:5173`

Для деплоя на Vercel:
1. Push в GitHub
2. Подключите репозиторий в Vercel
3. Framework: Vite
4. Build command: `pnpm build`
5. Output directory: `dist`

---

## 3. Главный пользовательский сценарий

1. Пользователь открывает «Среду» → видит приветствие ИИ-агента
2. Нажимает «Собрать корзину» → выбирает цель недели
3. Проходит мини-онбординг (5 вопросов: дни, люди, бюджет, ограничения, время)
4. Видит health-контекст (что учитывает агент)
5. Агент «собирает» корзину (анимация AI-thinking)
6. Получает план питания на 3–7 дней
7. Смотрит корзину ВкусВилл (товары по категориям)
8. Может заменить/удалить товар, посмотреть детали
9. Создаёт ссылку на корзину → «Корзина готова»
10. Попадает в петлю возврата: «Что приготовить сегодня?»

---

## 4. Какие экраны есть

| # | Экран | Путь | Описание |
|---|-------|------|----------|
| 1 | Home | `/` | Главная с приветствием агента |
| 2 | Goal | `/goal` | Выбор цели недели |
| 3 | Onboarding | `/onboarding` | Мини-онбординг (5 вопросов) |
| 4 | Context | `/context` | Health-контекст пользователя |
| 5 | Loading | `/loading` | AI-thinking анимация |
| 6 | Meal Plan | `/meal-plan` | План питания на N дней |
| 7 | Cart | `/cart` | Корзина ВкусВилл |
| 8 | Replace | `/replace/:id` | Замена товара (bottom sheet) |
| 9 | Product | `/product/:id` | Детали товара |
| 10 | Recipes | `/recipes` | Рецепты из корзины |
| 11 | Cart Ready | `/cart-ready` | Финальный экран |
| 12 | Today | `/today` | Петля возврата / Сегодня |
| 13 | Profile | `/profile` | Профиль питания |
| 14 | MCP Status | `/mcp-status` | Dev-панель MCP |

---

## 5. Как работает mock MCP adapter

Файл: `src/services/vkusvillMcpAdapter.js`

Адаптер предоставляет 4 функции, которые в demo-mode работают с mock-данными:

```javascript
searchProducts(query, options)    // → массив товаров
getProductDetails(productId)      // → детали товара (состав, КБЖУ)
createCartLink(cartProducts)      // → { url, expiresAt }
getAlternatives(productId, mode)  // → альтернативные товары
```

Каждая функция имеет `DEMO_MODE` флаг. Когда `DEMO_MODE = true`, возвращаются mock-данные с имитацией задержки (800ms).

Файл: `src/services/sredaAgent.js`

Логика ИИ-агента:

```javascript
buildNutritionContext(userAnswers)          // контекст из ответов
generateMealPlan(context)                   // план питания
buildCartFromMealPlan(mealPlan, context)    // корзина из плана
optimizeCart(cartProductIds, mode)           // оптимизация
replaceProduct(productId, mode)             // замена товара
generateCookingSuggestions(cart, context)   // рецепты
```

---

## 6. Где подключать реальный MCP ВкусВилл

### Шаг 1: Настроить переменные окружения

```env
VITE_VKUSVILL_MCP_URL=https://mcp.vkusvill.ru/api
VITE_VKUSVILL_MCP_TOKEN=your_token_here
```

### Шаг 2: Изменить адаптер

В файле `src/services/vkusvillMcpAdapter.js`:

1. Установить `DEMO_MODE = false`
2. Реализовать реальные вызовы MCP-инструментов:

```javascript
// vkusvill_products_search
const response = await fetch(`${MCP_URL}/tools/vkusvill_products_search`, {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${TOKEN}` },
  body: JSON.stringify({ query, ...options })
});

// vkusvill_product_details
const response = await fetch(`${MCP_URL}/tools/vkusvill_product_details`, {
  method: 'POST',
  body: JSON.stringify({ product_id: productId })
});

// vkusvill_cart_link_create
const response = await fetch(`${MCP_URL}/tools/vkusvill_cart_link_create`, {
  method: 'POST',
  body: JSON.stringify({ products: [...] })
});
```

### Справка по MCP ВкусВилл

- Статья: https://habr.com/ru/companies/vkusvill/articles/981866/
- Инструменты: `vkusvill_products_search`, `vkusvill_product_details`, `vkusvill_cart_link_create`

---

## 7. Какие метрики можно проверять на прототипе

| Метрика | Описание | Точка измерения |
|---------|----------|-----------------|
| Activation Rate | Начал сбор корзины | Клик «Собрать корзину» на Home |
| Onboarding Completion | Прошёл все 5 вопросов | Переход на /context |
| Cart Generated | Корзина сгенерирована | Переход на /meal-plan |
| Cart Link Created | Создал ссылку на корзину | Клик «Создать ссылку» |
| Product Replacement | Заменил товар | Использование /replace/:id |
| Recipe Opened | Открыл рецепт | Раскрытие карточки рецепта |
| Return to Today | Вернулся на экран «Сегодня» | Переход на /today после заказа |
| Repeat Basket Intent | Хочет повторить корзину | Клик «Повторить прошлую корзину» |

---

## Структура проекта

```
sreda/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── BottomNav.jsx
│   ├── hooks/
│   │   └── useAppState.jsx
│   ├── mockData/
│   │   ├── products.js
│   │   ├── mealPlan.js
│   │   └── recipes.js
│   ├── screens/
│   │   ├── HomeScreen.jsx
│   │   ├── GoalScreen.jsx
│   │   ├── OnboardingScreen.jsx
│   │   ├── ContextScreen.jsx
│   │   ├── LoadingScreen.jsx
│   │   ├── MealPlanScreen.jsx
│   │   ├── CartScreen.jsx
│   │   ├── ReplaceScreen.jsx
│   │   ├── ProductScreen.jsx
│   │   ├── RecipesScreen.jsx
│   │   ├── CartReadyScreen.jsx
│   │   ├── TodayScreen.jsx
│   │   ├── ProfileScreen.jsx
│   │   └── McpStatusScreen.jsx
│   ├── services/
│   │   ├── vkusvillMcpAdapter.js
│   │   └── sredaAgent.js
│   ├── styles/
│   │   └── global.css
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## Дисклеймер

«Среда» помогает с организацией питания и подбором продуктов, но не заменяет консультацию врача или индивидуальный медицинский план питания.

---

## Лицензия

Proprietary. HealthOS by Health Hero. All rights reserved.
