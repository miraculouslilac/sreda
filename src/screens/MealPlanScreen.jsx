import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronUp, ShoppingCart, Clock } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { mealPlans, mealTypeLabels } from '../mockData/mealPlan';

export default function MealPlanScreen() {
  const navigate = useNavigate();
  const { state } = useAppState();
  const [expandedDay, setExpandedDay] = useState(0);
  
  const days = state.days || 5;
  const plan = mealPlans.default.slice(0, days);

  return (
    <div className="screen">
      {/* Back */}
      <button 
        onClick={() => navigate('/')} 
        style={{ background: 'none', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)', marginBottom: 16, padding: '8px 0' }}
      >
        <ArrowLeft size={18} />
        <span style={{ fontSize: 14 }}>Назад</span>
      </button>

      <h1 style={{ marginBottom: 6 }}>План на {days} дней готов</h1>
      <p style={{ marginBottom: 20 }}>Учла вашу цель и ограничения</p>

      {/* Days */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {plan.map((dayPlan, idx) => (
          <div key={idx} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Day header */}
            <button
              onClick={() => setExpandedDay(expandedDay === idx ? -1 : idx)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                background: 'none',
                borderBottom: expandedDay === idx ? '1px solid var(--color-border)' : 'none',
              }}
            >
              <span style={{ fontSize: 15, fontWeight: 600 }}>День {dayPlan.day}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                  {dayPlan.meals.reduce((sum, m) => sum + m.kcal, 0)} ккал
                </span>
                {expandedDay === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </button>

            {/* Meals */}
            {expandedDay === idx && (
              <div style={{ padding: '8px 16px 16px' }}>
                {dayPlan.meals.map((meal, mIdx) => (
                  <div key={mIdx} style={{ 
                    padding: '12px 0', 
                    borderBottom: mIdx < dayPlan.meals.length - 1 ? '1px solid var(--color-border)' : 'none' 
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                      <div>
                        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', marginBottom: 3 }}>
                          {mealTypeLabels[meal.type]}
                        </p>
                        <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)' }}>
                          {meal.name}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <Clock size={12} color="var(--color-text-muted)" />
                      <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{meal.time}</span>
                      <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>·</span>
                      <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                        {meal.kcal} ккал · Б{meal.protein} Ж{meal.fat} У{meal.carbs}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {meal.tags.map(tag => (
                        <span key={tag} className="tag" style={{ fontSize: 11, padding: '2px 8px' }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="btn-primary" onClick={() => navigate('/cart')}>
          <ShoppingCart size={18} />
          Посмотреть корзину
        </button>
        <button className="btn-secondary" onClick={() => navigate('/cart')}>
          Сделать проще
        </button>
        <button className="btn-outline" onClick={() => navigate('/cart')}>
          Сделать дешевле
        </button>
      </div>
    </div>
  );
}
