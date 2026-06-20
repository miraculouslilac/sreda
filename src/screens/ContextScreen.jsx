import { useNavigate } from 'react-router-dom';
import { Target, Calendar, Clock, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { formatDays } from '../utils/format';

const goalLabels = {
  energy: 'Больше энергии',
  weight_loss: 'Похудение',
  sugar_control: 'Контроль сахара',
  sport: 'Спорт и восстановление',
  healthy: 'Просто здоровая корзина',
  custom: 'Своя цель',
};

const cookingLabels = {
  '10': 'до 10 минут',
  '20': 'до 20 минут',
  '40': 'до 40 минут',
  'ready': 'готовые блюда',
};

const restrictionLabels = {
  no_sugar: 'без сахара',
  no_lactose: 'без лактозы',
  no_gluten: 'без глютена',
  vegetarian: 'вегетарианское',
  none: 'нет ограничений',
};

const goalFocus = {
  energy: 'белок + клетчатка + стабильная энергия',
  weight_loss: 'дефицит калорий + белок + овощи',
  sugar_control: 'белок + клетчатка + стабильная энергия',
  sport: 'высокий белок + магний + сложные углеводы',
  healthy: 'баланс + разнообразие + свежие продукты',
  custom: 'индивидуальный подбор',
};

const goalExplanation = {
  sugar_control: 'Буду избегать продуктов с высоким содержанием сахара и соберу корзину с акцентом на белок, овощи, клетчатку и сложные углеводы.',
  sport: 'Добавлю продукты для восстановления: белок, магний, сложные углеводы, удобные перекусы.',
  energy: 'Подберу продукты для стабильной энергии: сложные углеводы, белок, полезные жиры, минимум сахара.',
  weight_loss: 'Соберу корзину с дефицитом калорий: много овощей, белок для сытости, лёгкие ужины.',
  healthy: 'Соберу сбалансированную корзину: разнообразные продукты, свежие овощи, качественный белок.',
  custom: 'Подберу продукты под ваши индивидуальные предпочтения.',
};

export default function ContextScreen() {
  const navigate = useNavigate();
  const { state } = useAppState();

  const contextCards = [
    { icon: Target, label: 'Цель', value: goalLabels[state.goal] || 'Не выбрана' },
    { icon: Calendar, label: 'Рацион', value: formatDays(state.days) },
    { icon: Clock, label: 'Время готовки', value: cookingLabels[state.cookingTime] || 'до 20 минут' },
    { icon: AlertCircle, label: 'Ограничения', value: (state.restrictions || []).map(r => restrictionLabels[r]).join(', ') || 'нет' },
    { icon: Sparkles, label: 'Фокус недели', value: goalFocus[state.goal] || goalFocus.healthy },
  ];

  return (
    <div className="screen" style={{ paddingTop: 24 }}>
      <h1 style={{ marginBottom: 20 }}>Что учитывает «Среда»</h1>

      {/* Context cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
        {contextCards.map(({ icon: Icon, label, value }) => (
          <div key={label} className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
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

      {/* Goal-dependent explanation */}
      <div className="card" style={{ marginBottom: 24, background: 'linear-gradient(135deg, var(--color-primary-light) 0%, #F0F9FF 100%)', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            fontSize: 12, color: 'white', fontWeight: 700,
          }}>С</div>
          <p style={{ fontSize: 14, color: 'var(--color-text)', lineHeight: 1.6, fontStyle: 'italic' }}>
            {goalExplanation[state.goal] || goalExplanation.healthy}
          </p>
        </div>
      </div>

      {/* CTA */}
      <button className="btn-primary" onClick={() => navigate('/loading')}>
        Собрать корзину
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
