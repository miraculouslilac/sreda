import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../hooks/useAppState';
import { generateCart, generateMealPlan, generateRecipes } from '../services/sredaAgent';

const steps = [
  'Анализирую цель и ограничения…',
  'Ищу подходящие товары во ВкусВилл…',
  'Сравниваю цены и рейтинг…',
  'Собираю корзину и план питания…',
];

export default function LoadingScreen() {
  const navigate = useNavigate();
  const { state, updateState } = useAppState();
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);
  const preferences = useMemo(() => ({
    goal: state.goal,
    days: state.days,
    people: state.people,
    budget: state.budget,
    restrictions: state.restrictions,
    cookingTime: state.cookingTime,
  }), [state.budget, state.cookingTime, state.days, state.goal, state.people, state.restrictions]);

  useEffect(() => {
    let cancelled = false;
    const interval = setInterval(() => {
      setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
    }, 1100);

    async function run() {
      try {
        const cartItems = await generateCart(preferences);
        const recipes = generateRecipes(preferences, cartItems);
        const mealPlan = generateMealPlan(preferences, cartItems);
        if (cancelled) return;
        updateState({
          cartGenerated: true,
          cartItems,
          mealPlan,
          recipes,
          cartLink: null,
          cartLinkCreated: false,
          generationError: null,
        });
        navigate('/meal-plan', { replace: true });
      } catch (requestError) {
        if (cancelled) return;
        const message = requestError instanceof Error ? requestError.message : 'Не удалось собрать корзину';
        setError(message);
        updateState({ generationError: message });
      }
    }

    run();
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [navigate, preferences, updateState]);

  return (
    <div className="screen" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', paddingBottom: 0 }}>
      <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', marginBottom: 32, animation: 'pulse 2s ease-in-out infinite', boxShadow: '0 8px 32px rgba(46, 125, 91, 0.3)' }} />
      <p style={{ fontSize: 16, color: error ? 'var(--color-danger)' : 'var(--color-text)', fontWeight: 500, textAlign: 'center', marginBottom: 24, minHeight: 48 }}>
        {error || steps[currentStep]}
      </p>
      {error ? (
        <button className="btn-primary" onClick={() => navigate('/context')}>Вернуться и попробовать ещё раз</button>
      ) : (
        <div style={{ display: 'flex', gap: 6 }}>
          {steps.map((_, index) => (
            <div key={index} style={{ width: 7, height: 7, borderRadius: '50%', background: index <= currentStep ? 'var(--color-primary)' : 'var(--color-border)' }} />
          ))}
        </div>
      )}
    </div>
  );
}
