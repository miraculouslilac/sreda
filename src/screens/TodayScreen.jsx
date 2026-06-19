import { useNavigate } from 'react-router-dom';
import { ChefHat, ShoppingBag, MessageCircle, Clock, ArrowRight } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { recipes } from '../mockData/recipes';

const quickQuestions = [
  'Что приготовить, если я устала?',
  'Что взять с собой завтра?',
  'Собери ужин без готовки',
  'Дозаказать продукты',
];

const remainingProducts = [
  'Индейка',
  'Гречка',
  'Овощи',
  'Йогурт',
  'Хумус',
  'Орехи',
];

export default function TodayScreen() {
  const navigate = useNavigate();
  const { state } = useAppState();
  
  const todayRecipe = recipes[0];

  return (
    <div className="screen">
      <h1 style={{ marginBottom: 6 }}>Сегодня</h1>
      <p style={{ marginBottom: 20, fontSize: 14, color: 'var(--color-text-muted)' }}>
        {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
      </p>

      {/* Today's suggestion */}
      <div className="card" style={{ marginBottom: 14, padding: 18, background: 'linear-gradient(135deg, var(--color-primary-light) 0%, #F0F9FF 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <ChefHat size={18} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 12, color: 'var(--color-primary)', fontWeight: 600, marginBottom: 4 }}>
              Сегодня лучше приготовить
            </p>
            <h3 style={{ fontSize: 16, marginBottom: 6 }}>{todayRecipe.name}</h3>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.4, marginBottom: 8 }}>
              Подходит под вашу цель: белок + сложные углеводы, готовится за {todayRecipe.time}.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={13} color="var(--color-text-muted)" />
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{todayRecipe.time}</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>·</span>
              <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{todayRecipe.kcal} ккал</span>
            </div>
          </div>
        </div>
        <button 
          className="btn-secondary" 
          onClick={() => navigate('/recipes')}
          style={{ marginTop: 14, padding: '10px' }}
        >
          Открыть рецепт
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Remaining products */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <ShoppingBag size={16} color="var(--color-text-muted)" />
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 600 }}>
            Что осталось в корзине
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {remainingProducts.map(item => (
            <span key={item} style={{
              padding: '6px 12px',
              background: 'var(--color-bg)',
              borderRadius: 8,
              fontSize: 13,
              color: 'var(--color-text)',
            }}>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Quick questions */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <MessageCircle size={16} color="var(--color-text-muted)" />
          <p style={{ fontSize: 13, color: 'var(--color-text-muted)', fontWeight: 600 }}>
            Спросить агента
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {quickQuestions.map(q => (
            <button
              key={q}
              onClick={() => navigate('/recipes')}
              style={{
                padding: '12px 14px',
                background: 'var(--color-bg)',
                border: 'none',
                borderRadius: 10,
                fontSize: 14,
                color: 'var(--color-text)',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {q}
              <ArrowRight size={14} color="var(--color-text-muted)" />
            </button>
          ))}
        </div>
      </div>

      {/* Tomorrow reminder */}
      <div className="card" style={{ background: 'var(--color-accent-light)' }}>
        <p style={{ fontSize: 13, color: 'var(--color-accent)', fontWeight: 500 }}>
          Завтра: напомнить собрать перекус
        </p>
      </div>
    </div>
  );
}
