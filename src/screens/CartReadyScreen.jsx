import { useNavigate } from 'react-router-dom';
import { ExternalLink, ChefHat, Calendar, Bookmark, CheckCircle } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { products } from '../mockData/products';

export default function CartReadyScreen() {
  const navigate = useNavigate();
  const { state } = useAppState();

  const cartIds = state.cartProductIds || products.slice(0, 18).map(p => p.id);
  const cartItems = products.filter(p => cartIds.includes(p.id));
  const totalPrice = cartItems.reduce((sum, p) => sum + p.price, 0);

  const goalTexts = {
    energy: 'стабильная энергия и сложные углеводы',
    weight_loss: 'дефицит калорий и высокий белок',
    sugar_control: 'стабильная энергия и меньше сахара',
    sport: 'восстановление и высокий белок',
    healthy: 'баланс и разнообразие',
  };

  return (
    <div className="screen" style={{ textAlign: 'center', paddingTop: 32 }}>
      {/* Success icon */}
      <div style={{ marginBottom: 20 }}>
        <CheckCircle size={56} color="var(--color-primary)" strokeWidth={1.5} />
      </div>

      <h1 style={{ marginBottom: 8 }}>Корзина готова</h1>
      <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: 24, maxWidth: 300, margin: '0 auto 24px' }}>
        Я собрала корзину на {state.days || 5} дней под вашу цель: {goalTexts[state.goal] || goalTexts.healthy}.
      </p>

      {/* Summary */}
      <div className="card" style={{ marginBottom: 24, textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>Товаров</span>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{cartItems.length}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>Итого</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-primary)' }}>{totalPrice.toLocaleString('ru')} ₽</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>Дней</span>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{state.days || 5}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>Фокус</span>
          <span style={{ fontSize: 14, fontWeight: 500 }}>{goalTexts[state.goal] || 'баланс'}</span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
        <button 
          className="btn-primary" 
          onClick={() => window.open('https://vkusvill.ru', '_blank')}
        >
          <ExternalLink size={18} />
          Открыть корзину во ВкусВилл
        </button>
        <button className="btn-secondary" onClick={() => navigate('/today')}>
          <ChefHat size={18} />
          Что приготовить сегодня?
        </button>
        <button className="btn-outline" onClick={() => navigate('/goal')}>
          <Calendar size={18} />
          Запланировать следующую корзину
        </button>
        <button className="btn-outline" onClick={() => navigate('/')}>
          <Bookmark size={18} />
          Сохранить как шаблон
        </button>
      </div>

      {/* Disclaimer */}
      <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 20, lineHeight: 1.4 }}>
        Цены и наличие лучше проверить на стороне ВкусВилл перед заказом.
      </p>
    </div>
  );
}
