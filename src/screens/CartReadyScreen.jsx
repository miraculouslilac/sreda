import { useNavigate } from 'react-router-dom';
import { ExternalLink, ChefHat, Calendar, Bookmark } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { products } from '../mockData/products';

export default function CartReadyScreen() {
  const navigate = useNavigate();
  const { state, updateState } = useAppState();
  const totalPrice = products.reduce((sum, p) => sum + p.price, 0);
  const totalItems = products.length;

  const handleOpenCart = () => {
    updateState({ cartLinkCreated: true });
    window.open('https://vkusvill.ru/cart?demo=true', '_blank');
  };

  return (
    <div className="screen" style={{ paddingTop: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--color-primary-light)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 28, color: 'var(--color-primary)' }}>&#10003;</span>
        </div>
        <h1 style={{ marginBottom: 8 }}>Корзина готова</h1>
        <p style={{ fontSize: 15, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
          Я собрала корзину на {state.days || 5} дней под вашу цель: стабильная энергия и меньше сахара.
        </p>
      </div>
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div><p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 2 }}>Итоговая сумма</p><p style={{ fontSize: 18, fontWeight: 700 }}>{totalPrice.toLocaleString('ru-RU')}&nbsp;&#8381;</p></div>
          <div><p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 2 }}>Товаров</p><p style={{ fontSize: 18, fontWeight: 700 }}>{totalItems}</p></div>
          <div><p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 2 }}>Блюд</p><p style={{ fontSize: 18, fontWeight: 700 }}>10</p></div>
          <div><p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 2 }}>Фокус недели</p><p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-primary)' }}>белок + клетчатка</p></div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="btn-primary" onClick={handleOpenCart}><ExternalLink size={18} /> Открыть корзину во ВкусВилл</button>
        <button className="btn-secondary" onClick={() => navigate('/recipes')}><ChefHat size={18} /> Что приготовить сегодня?</button>
        <button className="btn-outline" onClick={() => navigate('/goal')}><Calendar size={18} /> Запланировать следующую корзину</button>
        <button className="btn-outline" onClick={() => {}}><Bookmark size={18} /> Сохранить как шаблон</button>
      </div>
    </div>
  );
}
