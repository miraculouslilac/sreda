import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Trash2 } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { products, categoryLabels } from '../mockData/products';

export default function CartScreen() {
  const navigate = useNavigate();
  const { state } = useAppState();
  const [cartItems, setCartItems] = useState(products);

  const totalPrice = cartItems.reduce((sum, p) => sum + p.price, 0);
  const totalItems = cartItems.length;

  const grouped = {};
  cartItems.forEach(p => {
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  });

  const removeItem = (id) => setCartItems(cartItems.filter(p => p.id !== id));

  return (
    <div className="screen">
      <button onClick={() => navigate(-1)} style={{ background: 'none', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)', marginBottom: 16, padding: '8px 0' }}>
        <ArrowLeft size={18} /><span style={{ fontSize: 14 }}>Назад</span>
      </button>
      <h1 style={{ marginBottom: 16 }}>Корзина во ВкусВилл</h1>
      <div className="card" style={{ marginBottom: 20, padding: 14 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8, fontWeight: 500, textTransform: 'uppercase' }}>Итого</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div><span style={{ fontSize: 20, fontWeight: 700 }}>{totalItems}</span><span style={{ fontSize: 13, color: 'var(--color-text-muted)', marginLeft: 4 }}>товаров</span></div>
          <div><span style={{ fontSize: 20, fontWeight: 700 }}>{totalPrice.toLocaleString('ru-RU')}&nbsp;&#8381;</span></div>
          <div><span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>на {state.days || 5} дней</span></div>
          <div><span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>10 блюд</span></div>
        </div>
      </div>
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat} style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 10, fontSize: 14, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{categoryLabels[cat] || cat}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map(product => (
              <div key={product.id} className="card" style={{ padding: 12 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 10, background: product.image, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)', lineHeight: 1.3, cursor: 'pointer' }} onClick={() => navigate('/product/' + product.id)}>{product.name}</p>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)', whiteSpace: 'nowrap', marginLeft: 8 }}>{product.price}&nbsp;&#8381;</span>
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>{product.weight}</p>
                    <div style={{ display: 'flex', gap: 4, marginTop: 4, flexWrap: 'wrap' }}>
                      {product.tags.slice(0, 2).map(tag => (<span key={tag} className="tag" style={{ fontSize: 10 }}>{tag}</span>))}
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4, fontStyle: 'italic' }}>{product.reason.slice(0, 60)}...</p>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button onClick={() => navigate('/replace/' + product.id)} style={{ padding: '6px 12px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', borderRadius: 8, fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <RefreshCw size={12} /> Заменить
                      </button>
                      <button onClick={() => removeItem(product.id)} style={{ padding: '6px 12px', background: '#FEE2E2', color: 'var(--color-danger)', borderRadius: 8, fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Trash2 size={12} /> Удалить
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
        <button className="btn-primary" onClick={() => navigate('/cart-ready')}>Создать ссылку на корзину</button>
        <button className="btn-outline" onClick={() => {}}>Сделать дешевле</button>
        <button className="btn-outline" onClick={() => {}}>Больше белка</button>
        <button className="btn-outline" onClick={() => {}}>Меньше сахара</button>
      </div>
    </div>
  );
}
