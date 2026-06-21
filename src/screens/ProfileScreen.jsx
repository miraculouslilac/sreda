import { useNavigate } from 'react-router-dom';
import { Target, AlertCircle, Wallet, Link2, FlaskConical } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';

const goalLabels = { energy: 'Больше энергии', weight_loss: 'Похудение', sugar_control: 'Контроль сахара', sport: 'Спорт и восстановление', healthy: 'Просто здоровая корзина', custom: 'Своя цель' };
const budgetLabels = { '3000': 'до 3000 \u20BD', '5000': '3000\u20135000 \u20BD', '8000': '5000\u20138000 \u20BD', 'flexible': 'Без строгого бюджета' };
const restrictionLabels = { no_sugar: 'без сахара', no_lactose: 'без лактозы', no_gluten: 'без глютена', vegetarian: 'вегетарианское', none: 'нет ограничений' };

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { state, resetState } = useAppState();
  const sections = [
    { icon: Target, label: 'Цель', value: goalLabels[state.goal] || 'Не выбрана' },
    { icon: AlertCircle, label: 'Ограничения', value: (state.restrictions || []).map(r => restrictionLabels[r]).join(', ') || 'Нет' },
    { icon: Wallet, label: 'Бюджет', value: budgetLabels[state.budget] || 'Не указан' },
    { icon: Link2, label: 'Связь с HealthOS', value: 'Не подключено' },
    { icon: FlaskConical, label: 'Анализы', value: 'Не загружены' },
  ];

  return (
    <div className="screen" style={{ paddingTop: 24 }}>
      <h1 style={{ marginBottom: 20 }}>Профиль питания</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {sections.map(({ icon: Icon, label, value }) => (
          <div key={label} className="card" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={18} color="var(--color-primary)" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 2 }}>{label}</p>
              <p style={{ fontSize: 14, color: 'var(--color-text)', fontWeight: 500 }}>{value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="card" style={{ marginBottom: 16, background: 'var(--color-accent-light)', border: 'none' }}>
        <h3 style={{ marginBottom: 8, color: 'var(--color-accent)' }}>Подключить анализы HealthOS</h3>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>
          Если у вас есть анализы, «Среда» сможет учитывать глюкозу, ферритин, витамин D, холестерин и другие показатели при подборе корзины.
        </p>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontStyle: 'italic', marginBottom: 12 }}>
          Поможет сделать питание более персональным, но не заменяет консультацию врача.
        </p>
        <button className="btn-secondary" style={{ background: 'white', width: 'auto', padding: '10px 16px' }}>Подключить</button>
      </div>
      <button onClick={() => navigate('/mcp-status')} style={{ background: 'none', fontSize: 12, color: 'var(--color-text-muted)', padding: '8px 0', textDecoration: 'underline' }}>MCP Status (dev)</button>
      <button onClick={resetState} style={{ background: 'none', fontSize: 12, color: 'var(--color-danger)', padding: '8px 0', marginTop: 8, display: 'block' }}>Сбросить все данные</button>
    </div>
  );
}
