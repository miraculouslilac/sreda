import { useNavigate } from 'react-router-dom';
import { ExternalLink, ChefHat, Calendar, Copy } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { formatDays } from '../utils/format';

export default function CartReadyScreen() {
  const navigate = useNavigate();
  const { state } = useAppState();
  const totalPrice = state.cartItems.reduce((sum, product) => sum + product.price * (product.quantity || 1), 0);

  return (
    <div className="screen" style={{ paddingTop: 32 }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div className="success-mark">✓</div>
        <h1>Корзина готова</h1>
        <p style={{ marginTop: 8 }}>Настоящая ссылка ВкусВилла создана для {state.cartItems.length} товаров.</p>
      </div>
      <div className="card summary-grid" style={{ marginBottom: 20 }}>
        <div><small>Примерная сумма</small><strong>{totalPrice.toLocaleString('ru-RU')} ₽</strong></div>
        <div><small>Товаров</small><strong>{state.cartItems.length}</strong></div>
        <div><small>Период</small><strong>{formatDays(state.days)}</strong></div>
        <div><small>Источник</small><strong>ВкусВилл MCP</strong></div>
      </div>
      {state.cartLink ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <a className="btn-primary" href={state.cartLink} target="_blank" rel="noreferrer"><ExternalLink size={18} /> Открыть корзину во ВкусВилле</a>
          <button className="btn-outline" onClick={() => navigator.clipboard.writeText(state.cartLink)}><Copy size={18} /> Скопировать ссылку</button>
        </div>
      ) : (
        <button className="btn-primary" onClick={() => navigate('/cart')}>Вернуться к корзине</button>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
        <button className="btn-secondary" onClick={() => navigate('/recipes')}><ChefHat size={18} /> Что приготовить сегодня?</button>
        <button className="btn-outline" onClick={() => navigate('/goal')}><Calendar size={18} /> Запланировать следующую корзину</button>
      </div>
    </div>
  );
}
