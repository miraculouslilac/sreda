import { useNavigate } from 'react-router-dom';
import { ChefHat, Bell } from 'lucide-react';
import { recipes } from '../mockData/recipes';

const quickQuestions = [
  'Что приготовить, если я устала?',
  'Что взять с собой завтра?',
  'Собери ужин без готовки',
  'Дозаказать продукты',
];

export default function TodayScreen() {
  const navigate = useNavigate();
  const todayRecipe = recipes[0];

  return (
    <div className="screen" style={{ paddingTop: 24 }}>
      <h1 style={{ marginBottom: 20 }}>Сегодня</h1>
      <div className="card" style={{ marginBottom: 16, background: 'linear-gradient(135deg, var(--color-primary-light) 0%, #F0F9FF 100%)', border: 'none' }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', marginBottom: 6 }}>Сегодня лучше приготовить</p>
        <p style={{ fontSize: 17, fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>{todayRecipe.name}</p>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', marginBottom: 4 }}>Почему</p>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>{todayRecipe.why}</p>
        <button className="btn-secondary" onClick={() => navigate('/recipes')} style={{ width: 'auto', padding: '10px 16px' }}>
          <ChefHat size={16} /> Открыть рецепт
        </button>
      </div>
      <div className="card" style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', marginBottom: 8 }}>Что осталось в корзине</p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['индейка', 'гречка', 'овощи', 'йогурт'].map(item => (<span key={item} className="tag">{item}</span>))}
        </div>
      </div>
      <div className="card" style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', marginBottom: 10 }}>Вопрос агенту</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {quickQuestions.map(q => (
            <button key={q} style={{ padding: '12px 14px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 10, fontSize: 14, color: 'var(--color-text)', textAlign: 'left' }}>{q}</button>
          ))}
        </div>
      </div>
      <div className="card" style={{ background: 'var(--color-accent-light)', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Bell size={18} color="var(--color-accent)" />
          <div>
            <p style={{ fontSize: 12, color: 'var(--color-accent)', fontWeight: 500, textTransform: 'uppercase', marginBottom: 2 }}>Завтра</p>
            <p style={{ fontSize: 14, color: 'var(--color-text)' }}>Напомнить собрать перекус</p>
          </div>
        </div>
      </div>
    </div>
  );
}
