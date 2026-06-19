import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../hooks/useAppState';
import { buildNutritionContext, generateMealPlan, buildCartFromMealPlan } from '../services/sredaAgent';

const steps = [
  { text: 'Среда анализирует запрос…', duration: 1200 },
  { text: 'Ищет продукты во ВкусВилл…', duration: 1500 },
  { text: 'Проверяет состав и КБЖУ…', duration: 1200 },
  { text: 'Собирает корзину…', duration: 1000 },
  { text: 'Готовит рецепты из выбранных продуктов…', duration: 1000 },
];

export default function LoadingScreen() {
  const navigate = useNavigate();
  const { state, updateState } = useAppState();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timeout;
    let progressInterval;

    // Progress animation
    const totalDuration = steps.reduce((sum, s) => sum + s.duration, 0);
    const startTime = Date.now();
    
    progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setProgress(Math.min((elapsed / totalDuration) * 100, 100));
    }, 50);

    // Step through messages
    const advanceSteps = async () => {
      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(i);
        await new Promise(resolve => setTimeout(resolve, steps[i].duration));
      }
      
      // Generate data
      const context = buildNutritionContext(state);
      const mealPlan = await generateMealPlan(context);
      const cartIds = await buildCartFromMealPlan(mealPlan, context);
      
      updateState({ cartGenerated: true, cartProductIds: cartIds });
      
      clearInterval(progressInterval);
      navigate('/meal-plan');
    };

    advanceSteps();

    return () => {
      clearTimeout(timeout);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="screen" style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '100vh',
      paddingBottom: 0,
    }}>
      {/* Animated orb */}
      <div style={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
        marginBottom: 32,
        animation: 'pulse 2s ease-in-out infinite',
        boxShadow: '0 8px 32px rgba(46, 125, 91, 0.3)',
      }} />

      {/* Current step text */}
      <p style={{ 
        fontSize: 16, 
        color: 'var(--color-text)', 
        fontWeight: 500, 
        textAlign: 'center',
        marginBottom: 24,
        minHeight: 24,
        transition: 'opacity 0.3s',
      }}>
        {steps[currentStep]?.text}
      </p>

      {/* Progress bar */}
      <div style={{ width: '80%', maxWidth: 240 }}>
        <div style={{ 
          height: 4, 
          background: 'var(--color-border)', 
          borderRadius: 2, 
          overflow: 'hidden' 
        }}>
          <div style={{ 
            height: '100%', 
            width: `${progress}%`, 
            background: 'var(--color-primary)', 
            borderRadius: 2, 
            transition: 'width 0.1s linear' 
          }} />
        </div>
      </div>

      {/* Step indicators */}
      <div style={{ display: 'flex', gap: 6, marginTop: 20 }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: i <= currentStep ? 'var(--color-primary)' : 'var(--color-border)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
    </div>
  );
}
