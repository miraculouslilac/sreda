import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, RefreshCw, ExternalLink } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { products, categoryLabels } from '../mockData/products';

export default function CartScreen() {
  const navigate = useNavigate();
  const { state, updateState } = useAppState();
  
  const cartIds = state.cartProductIds || products.slice(0, 18).map(p => p.id);
  const [cartItems, setCartItems] = useState(
    products.filter(p => cartIds.includes(p.id))
  );

  const totalPrice = cartItems.reduce((sum, p) => sum + p.price, 0);
  const totalItems = cartItems.length;

  const grouped = {};
  cartItems.forEach(p => {
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  });

  const removeItem = (id) => {
    setCartItems(cartItems.filter(p => p.id !== id));
  };

  const handleCreateLink = () => {
    updateState({ cartLinkCreated: true });
    navigate('/cart-ready');
  };

  return (
    <div className="screen">
      {/* Back */}
      <button 
        onClick={() => navigate(-1)} 
        style={{ background: 'none', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)', marginBottom: 16, padding: '8px 0' }}
      >
        <ArrowLeft size={18} />
        <span style={{ fontSize: 14 }}>Назад</span>
      </button>

      <h1 style={{ marginBottom: 16 }}>Корзина во ВкусВилл</h1>

      {/* Summary */}
      <div className="card" style={{ marginBottom: 16, padding: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)' }}>{totalItems}</p>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>товаров</p>
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-primary)' }}>{totalPrice.toLocaleString('ru')} ₽</p>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>итого</p>
          </div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)' }}>{state.days || 5}</p>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>дней</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto', paddingBottom: 4 }}>
        {['Дешевле', 'Больше белка', 'Меньше сахара'].map(label => (
          <button key={label} style={{
            padding: '8px 14px',
            background: 'var(--color-white)',
            border: '1.5px solid var(--color-border)',
            borderRadius: 20,
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--color-text)',
            whiteSpace: 'nowrap',
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* Products by category */}
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 10, fontWeight: 600 }}>
            {categoryLabels[category] || category}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map(product => (
              <div key={product.id} className="card" style={{ padding: 12 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  {/* Color placeholder image */}
                  <div style={{
                    width: 52, height: 52, borderRadius: 10,
                    background: product.image,
                    flexShrink: 0,
                    opacity: 0.8,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)', marginBottom: 3 }}>
                      {product.name}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-primary)' }}>
                        {product.price} ₽
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                        {product.weight}
                      </span>
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--color-text-muted)', lineHeight: 1.3 }}>
                      {product.reason.substring(0, 60)}...
                    </p>
                    <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                      {product.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="tag" style={{ fontSize: 10, padding: '2px 6px' }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Actions */}
                <div style={{ display: 'flex', gap: 8, marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--color-border)' }}>
                  <button 
                    onClick={() => navigate(`/product/${product.id}`)}
                    style={{ flex: 1, padding: '8px', background: 'none', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12, color: 'var(--color-text-secondary)' }}
                  >
                    Подробнее
                  </button>
                  <button 
                    onClick={() => navigate(`/replace/${product.id}`)}
                    style={{ flex: 1, padding: '8px', background: 'none', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
                  >
                    <RefreshCw size={12} /> Заменить
                  </button>
                  <button 
                    onClick={() => removeItem(product.id)}
                    style={{ padding: '8px 12px', background: 'none', border: '1px solid var(--color-border)', borderRadius: 8, color: 'var(--color-danger)' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Bottom CTA */}
      <div style={{ position: 'sticky', bottom: 70, background: 'var(--color-bg)', padding: '12px 0', borderTop: '1px solid var(--color-border)' }}>
        <button className="btn-primary" onClick={handleCreateLink}>
          <ExternalLink size={18} />
          Создать ссылку на корзину
        </button>
      </div>
    </div>
  );
}
