import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Calendar, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { buildNutritionContext } from '../services/sredaAgent';

const goalLabels = {
  energy: 'Больше энергии',
  weight_loss: 'Похудение',
  sugar_control: 'Контроль сахара',
  sport: 'Спорт и восстановление',
  healthy: 'Здоровая корзина',
  custom: 'Своя цель',
};

const cookingLabels = {
  '10min': 'до 10 минут',
  '20min': 'до 20 минут',
  '40min': 'до 40 минут',
  'ready': 'готовые блюда',
};

const restrictionLabels = {
  no_sugar: 'без сахара',
  no_lactose: 'без лактозы',
  no_gluten: 'без глютена',
  vegetarian: 'вегетарианское',
  none: 'нет ограничений',
};

export default function ContextScreen() {
  const navigate = useNavigate();
  const { state } = useAppState();
  
  const context = buildNutritionContext(state);

  const items = [
    { icon: Target, label: 'Цель', value: goalLabels[state.goal] || 'Здоровая корзина' },
    { icon: Calendar, label: 'Рацион', value: `${state.days || 5} дней` },
    { icon: Clock, label: 'Время готовки', value: cookingLabels[state.cookingTime] || 'до 20 минут' },
    { icon: AlertCircle, label: 'Ограничения', value: (state.restrictions || []).map(r => restrictionLabels[r]).join(', ') || 'нет' },
  ];

  return (
    <div className="screen">
      {/* Back */}
      <button 
        onClick={() => navigate('/onboarding')} 
        style={{ background: 'none', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)', marginBottom: 16, padding: '8px 0' }}
      >
        <ArrowLeft size={18} />
        <span style={{ fontSize: 14 }}>Назад</span>
      </button>

      <h1 style={{ marginBottom: 8 }}>Что учитывает Среда</h1>
      <p style={{ marginBottom: 20 }}>Ваш контекст для подбора корзины</p>

      {/* Context cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--color-primary-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon size={18} color="var(--color-primary)" />
            </div>
            <div>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 2 }}>{label}</p>
              <p style={{ fontSize: 14, color: 'var(--color-text)', fontWeight: 500 }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Focus card */}
      <div className="card" style={{ marginBottom: 20, background: 'linear-gradient(135deg, var(--color-primary-light) 0%, #F0F9FF 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <Sparkles size={18} color="var(--color-primary)" style={{ marginTop: 2, flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: 12, color: 'var(--color-primary)', fontWeight: 600, marginBottom: 6 }}>
              Фокус недели
            </p>
            <p style={{ fontSize: 14, color: 'var(--color-text)', lineHeight: 1.5 }}>
              {context.focus}
            </p>
          </div>
        </div>
      </div>

      {/* Agent message */}
      <div className="card" style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 14, color: 'var(--color-text)', lineHeight: 1.6, fontStyle: 'italic' }}>
          «{context.agentMessage}»
        </p>
      </div>

      {/* CTA */}
      <button className="btn-primary" onClick={() => navigate('/loading')}>
        <ShoppingCart size={18} />
        Собрать корзину
      </button>
    </div>
  );
}

function ShoppingCart({ size, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
    </svg>
  );
}
