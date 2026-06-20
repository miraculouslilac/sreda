import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, ExternalLink, LoaderCircle, RefreshCw, Trash2 } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { getProductDetails } from '../services/vkusvillMcpAdapter';

const goalLabels = {
  energy: 'Больше энергии',
  weight_loss: 'Похудение',
  sugar_control: 'Контроль сахара',
  sport: 'Спорт и восстановление',
  healthy: 'Здоровая корзина',
  custom: 'Своя цель',
};

export default function ProductScreen() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { state, setCartItems } = useAppState();
  const baseProduct = state.cartItems.find((product) => product.id === productId);
  const [product, setProduct] = useState(baseProduct);
  const [loading, setLoading] = useState(Boolean(baseProduct?.source === 'mcp'));

  useEffect(() => {
    if (!baseProduct || baseProduct.source !== 'mcp') return;
    let cancelled = false;
    getProductDetails(baseProduct.id, baseProduct)
      .then((details) => {
        if (!cancelled) setProduct(details);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [baseProduct]);

  function remove() {
    setCartItems(state.cartItems.filter((item) => item.id !== productId));
    navigate('/cart', { replace: true });
  }

  if (!product) return <div className="screen"><h1>Товар не найден</h1><button className="btn-primary" onClick={() => navigate('/cart')}>К корзине</button></div>;

  const macros = [
    ['ккал', product.kcal],
    ['белки', product.protein],
    ['жиры', product.fat],
    ['углеводы', product.carbs],
  ];

  return (
    <div className="screen">
      <button onClick={() => navigate(-1)} className="link-button"><ArrowLeft size={18} /> Назад</button>
      {product.image ? <img src={product.image} alt={product.name} className="product-hero" /> : <div className="product-hero product-placeholder" />}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
        <h1>{product.name}</h1>
        <strong style={{ fontSize: 20, whiteSpace: 'nowrap' }}>{product.price} ₽</strong>
      </div>
      <p style={{ marginBottom: 16 }}>{product.weight} · ★ {product.rating?.toFixed?.(1) || '—'}</p>
      {loading && <p className="status-line"><LoaderCircle size={16} className="spin" /> Загружаю состав и КБЖУ…</p>}
      <div className="card" style={{ marginBottom: 12 }}>
        <small className="eyebrow">Состав</small>
        <p>{product.composition || product.description || 'Состав уточняется на странице товара'}</p>
      </div>
      <div className="card macro-grid" style={{ marginBottom: 12 }}>
        {macros.map(([label, value]) => <div key={label}><strong>{value ?? '—'}</strong><small>{label}</small></div>)}
      </div>
      <div className="card" style={{ marginBottom: 12, background: 'var(--color-primary-light)' }}>
        <small className="eyebrow">Почему Среда выбрала</small>
        <p>{product.reason || `Подходит под цель «${goalLabels[state.goal] || 'Здоровая корзина'}».`}</p>
      </div>
      {product.url && <a className="btn-outline" href={product.url} target="_blank" rel="noreferrer"><ExternalLink size={17} /> Карточка во ВкусВилле</a>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
        <button className="btn-primary" onClick={() => navigate(-1)}><Check size={18} /> Оставить</button>
        <button className="btn-secondary" onClick={() => navigate(`/replace/${product.id}`)}><RefreshCw size={18} /> Заменить</button>
        <button className="btn-outline danger-text" onClick={remove}><Trash2 size={18} /> Удалить</button>
      </div>
    </div>
  );
}
