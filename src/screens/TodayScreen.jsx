import { useNavigate } from 'react-router-dom';
import { ChefHat, Bell } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { summarizeCart } from '../services/sredaAgent';

const quickQuestions = [
  'Что приготовить, если я устала?',
  'Что взять с собой завтра?',
  'Собери ужин без готовки',
  'Дозаказать продукты',
];

export default function TodayScreen() {
  const navigate = useNavigate();
  const { state } = useAppState();
  const todayRecipe = state.recipes?.[0];
  const remaining = summarizeCart(state.cartItems || []);

  if (!todayRecipe) {
    return (
      <div className="screen" style={{ paddingTop: 40 }}>
        <h1>Сегодня</h1>
        <p style={{ margin: '12px 0 20px' }}>Соберите первую корзину, чтобы получить рекомендацию на день.</p>
        <button className="btn-primary" onClick={() => navigate('/goal')}>Собрать корзину</button>
      </div>
    );
  }

  return (
    <div className="screen" style={{ paddingTop: 24 }}>
      <h1 style={{ marginBottom: 20 }}>Сегодня</h1>
      <div className="card" style={{ marginBottom: 16, background: 'linear-gradient(135deg, var(--color-primary-light) 0%, #F0F9FF 100%)', border: 'none' }}>
        <p className="eyebrow">Сегодня лучше приготовить</p>
        <p style={{ fontSize: 17, fontWeight: 600, color: 'var(--color-text)', marginBottom: 8 }}>{todayRecipe.name}</p>
        <p style={{ fontSize: 14, marginBottom: 12 }}>{todayRecipe.why}</p>
        <button className="btn-secondary" onClick={() => navigate('/recipes')} style={{ width: 'auto', padding: '10px 16px' }}>
          <ChefHat size={16} /> Открыть рецепт
        </button>
      </div>
      <div className="card" style={{ marginBottom: 16 }}>
        <p className="eyebrow">Что есть в корзине</p>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {remaining.map((item) => <span key={item} className="tag">{item}</span>)}
        </div>
      </div>
      <div className="card" style={{ marginBottom: 16 }}>
        <p className="eyebrow">Вопрос агенту</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {quickQuestions.map((question) => (
            <button key={question} onClick={() => navigate('/recipes')} style={{ padding: '12px 14px', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 10, fontSize: 14, textAlign: 'left' }}>{question}</button>
          ))}
        </div>
      </div>
      <div className="card" style={{ background: 'var(--color-accent-light)', border: 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Bell size={18} color="var(--color-accent)" />
          <div><p className="eyebrow">Завтра</p><p>Напомнить собрать перекус</p></div>
        </div>
      </div>
    </div>
  );
}
