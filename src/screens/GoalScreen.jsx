import { useNavigate } from 'react-router-dom';
import { Zap, TrendingDown, Activity, Dumbbell, Salad, PenLine, ArrowLeft } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';

const goals = [
  { id: 'energy', label: 'Больше энергии', icon: Zap, color: '#FF9500' },
  { id: 'weight_loss', label: 'Похудение', icon: TrendingDown, color: '#FF3B30' },
  { id: 'sugar_control', label: 'Контроль сахара', icon: Activity, color: '#5856D6' },
  { id: 'sport', label: 'Спорт и восстановление', icon: Dumbbell, color: '#007AFF' },
  { id: 'healthy', label: 'Просто здоровая корзина', icon: Salad, color: '#34C759' },
  { id: 'custom', label: 'Своя цель', icon: PenLine, color: '#8E8E93' },
];

export default function GoalScreen() {
  const navigate = useNavigate();
  const { state, updateState } = useAppState();

  const handleSelect = (goalId) => {
    updateState({ goal: goalId });
    navigate('/onboarding');
  };

  return (
    <div className="screen">
      <button
        onClick={() => navigate('/')}
        style={{ background: 'none', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)', marginBottom: 16, padding: '8px 0' }}
      >
        <ArrowLeft size={18} />
        <span style={{ fontSize: 14 }}>Назад</span>
      </button>

      <h1 style={{ marginBottom: 20 }}>Какая цель на эту неделю?</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {goals.map(({ id, label, icon: Icon, color }) => (
          <button
            key={id}
            onClick={() => handleSelect(id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '16px 18px',
              background: state.goal === id ? 'var(--color-primary-light)' : 'var(--color-white)',
              border: state.goal === id ? '2px solid var(--color-primary)' : '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'left',
              minHeight: 60,
            }}
          >
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: `${color}15`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon size={20} color={color} />
            </div>
            <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text)' }}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
