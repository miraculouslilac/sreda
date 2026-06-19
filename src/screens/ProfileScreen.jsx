import { useNavigate } from 'react-router-dom';
import { Target, AlertCircle, Wallet, Heart, X, Link2, Activity, RotateCcw } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';

const goalLabels = {
  energy: 'Больше энергии',
  weight_loss: 'Похудение',
  sugar_control: 'Контроль сахара',
  sport: 'Спорт и восстановление',
  healthy: 'Здоровая корзина',
  custom: 'Своя цель',
};

const budgetLabels = {
  '3000': 'до 3 000 ₽',
  '5000': '3 000–5 000 ₽',
  '8000': '5 000–8 000 ₽',
  'flexible': 'Без ограничений',
};

const restrictionLabels = {
  no_sugar: 'Без сахара',
  no_lactose: 'Без лактозы',
  no_gluten: 'Без глютена',
  vegetarian: 'Вегетарианское',
  none: 'Нет ограничений',
};

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { state, resetState } = useAppState();

  const profileItems = [
    { icon: Target, label: 'Цель', value: goalLabels[state.goal] || 'Не выбрана', action: () => navigate('/goal') },
    { icon: AlertCircle, label: 'Ограничения', value: (state.restrictions || []).map(r => restrictionLabels[r]).join(', ') || 'Не указаны' },
    { icon: Wallet, label: 'Бюджет', value: budgetLabels[state.budget] || 'Не указан' },
    { icon: Heart, label: 'Любимые продукты', value: 'Индейка, гречка, йогурт' },
    { icon: X, label: 'Нелюбимые продукты', value: 'Не указаны' },
  ];

  return (
    <div className="screen">
      <h1 style={{ marginBottom: 6 }}>Профиль питания</h1>
      <p style={{ marginBottom: 20 }}>Ваши настройки для подбора корзины</p>

      {/* Profile items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        {profileItems.map(({ icon: Icon, label, value, action }) => (
          <button
            key={label}
            onClick={action}
            className="card"
            style={{ 
              display: 'flex', alignItems: 'center', gap: 12, padding: 14, 
              textAlign: 'left', width: '100%',
              cursor: action ? 'pointer' : 'default',
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'var(--color-primary-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon size={18} color="var(--color-primary)" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 2 }}>{label}</p>
              <p style={{ fontSize: 14, color: 'var(--color-text)', fontWeight: 500 }}>{value}</p>
            </div>
          </button>
        ))}
      </div>

      {/* HealthOS connection */}
      <div className="card" style={{ marginBottom: 16, background: 'var(--color-accent-light)', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--color-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Link2 size={18} color="white" />
          </div>
          <div>
            <h3 style={{ fontSize: 15, marginBottom: 4 }}>Подключить анализы HealthOS</h3>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
              Если у вас есть анализы, «Среда» сможет учитывать глюкозу, ферритин, витамин D, холестерин и другие показатели при подборе корзины.
            </p>
          </div>
        </div>
        <button className="btn-secondary" style={{ marginTop: 12, padding: '10px', background: 'white' }}>
          <Activity size={16} />
          Подключить
        </button>
      </div>

      {/* Disclaimer */}
      <div className="card" style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
          «Среда» помогает сделать питание более персональным, но не заменяет консультацию врача или индивидуальный медицинский план питания.
        </p>
      </div>

      {/* Dev link */}
      <button 
        className="btn-outline" 
        onClick={() => navigate('/mcp-status')}
        style={{ marginBottom: 10, fontSize: 13, color: 'var(--color-text-muted)' }}
      >
        MCP Status (dev)
      </button>

      {/* Reset */}
      <button 
        className="btn-outline" 
        onClick={resetState}
        style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
      >
        <RotateCcw size={16} />
        Сбросить все настройки
      </button>
    </div>
  );
}
