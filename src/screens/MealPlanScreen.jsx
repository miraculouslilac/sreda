import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Clock, ArrowLeft } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { mealPlans, mealTypeLabels } from '../mockData/mealPlan';

export default function MealPlanScreen() {
  const navigate = useNavigate();
  const { state } = useAppState();
  const [expandedDay, setExpandedDay] = useState(1);
  const days = state.days || 5;
  const plan = mealPlans.slice(0, days);

  return (
    <div className="screen">
      <button onClick={() => navigate('/')} style={{ background: 'none', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)', marginBottom: 16, padding: '8px 0' }}>
        <ArrowLeft size={18} /><span style={{ fontSize: 14 }}>Назад</span>
      </button>
      <h1 style={{ marginBottom: 20 }}>{"План на " + days + " дней готов"}</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {plan.map(({ day, meals }) => (
          <div key={day} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <button onClick={() => setExpandedDay(expandedDay === day ? null : day)} style={{ width: '100%', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', borderBottom: expandedDay === day ? '1px solid var(--color-border)' : 'none' }}>
              <span style={{ fontSize: 16, fontWeight: 600 }}>{"День " + day}</span>
              {expandedDay === day ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expandedDay === day && (
              <div style={{ padding: '12px 16px' }}>
                {meals.map((meal, i) => (
                  <div key={i} style={{ padding: '10px 0', borderBottom: i < meals.length - 1 ? '1px solid var(--color-border)' : 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase' }}>{mealTypeLabels[meal.type]}</span>
                      <span style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={12} /> {meal.time}</span>
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--color-text)', marginBottom: 6 }}>{meal.name}</p>
                    <div style={{ display: 'flex', gap: 8, fontSize: 12, color: 'var(--color-text-muted)' }}>
                      <span>{meal.kcal} ккал</span><span>Б:{meal.protein}</span><span>Ж:{meal.fat}</span><span>У:{meal.carbs}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                      {meal.tags.map(tag => (<span key={tag} className="tag" style={{ fontSize: 11 }}>{tag}</span>))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="btn-primary" onClick={() => navigate('/cart')}>Посмотреть корзину</button>
        <button className="btn-outline" onClick={() => navigate('/loading')}>Изменить план</button>
        <button className="btn-outline" onClick={() => {}}>Сделать проще</button>
        <button className="btn-outline" onClick={() => {}}>Сделать дешевле</button>
      </div>
    </div>
  );
}
