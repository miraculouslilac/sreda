import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, LoaderCircle } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { getProductAnalogs } from '../services/vkusvillMcpAdapter';

const filters = [
  { id: 'cheaper', label: 'Выгоднее' },
  { id: 'rating', label: 'Лучший рейтинг' },
  { id: 'more_protein', label: 'Больше белка' },
];

export default function ReplaceScreen() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { state, setCartItems } = useAppState();
  const [activeFilter, setActiveFilter] = useState('cheaper');
  const [alternatives, setAlternatives] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const original = state.cartItems.find((product) => product.id === productId);

  useEffect(() => {
    let cancelled = false;
    getProductAnalogs(original, activeFilter)
      .then((items) => {
        if (!cancelled) setAlternatives(items.filter((item) => item.id !== original?.id).slice(0, 6));
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError instanceof Error ? requestError.message : 'Не удалось найти замену');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [activeFilter, original]);

  function changeFilter(filter) {
    setLoading(true);
    setError(null);
    setSelected(null);
    setActiveFilter(filter);
  }

  function replace() {
    const replacement = alternatives.find((item) => item.id === selected);
    if (!replacement) return;
    setCartItems(state.cartItems.map((item) =>
      item.id === original.id ? { ...replacement, quantity: item.quantity || 1 } : item
    ));
    navigate('/cart', { replace: true });
  }

  if (!original) return <div className="screen"><h1>Товар не найден</h1><button className="btn-primary" onClick={() => navigate('/cart')}>К корзине</button></div>;

  return (
    <div className="screen">
      <button onClick={() => navigate(-1)} className="link-button"><ArrowLeft size={18} /> Назад</button>
      <h1>Чем заменить?</h1>
      <p style={{ margin: '6px 0 16px' }}>Вместо: {original.name}</p>
      <div className="filter-row">
        {filters.map((filter) => (
          <button key={filter.id} className={activeFilter === filter.id ? 'filter active' : 'filter'} onClick={() => changeFilter(filter.id)}>{filter.label}</button>
        ))}
      </div>
      {loading && <p className="status-line"><LoaderCircle size={18} className="spin" /> Ищу реальные аналоги…</p>}
      {error && <p className="error-box">{error}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '16px 0 24px' }}>
        {alternatives.map((product) => (
          <button key={product.id} className={selected === product.id ? 'card alternative selected' : 'card alternative'} onClick={() => setSelected(product.id)}>
            {product.image && <img src={product.image} alt="" className="product-thumb" />}
            <span style={{ flex: 1, textAlign: 'left' }}>
              <strong>{product.name}</strong>
              <small>{product.price} ₽ · ★ {product.rating?.toFixed?.(1) || '—'}</small>
            </span>
            {selected === product.id && <Check size={20} color="var(--color-primary)" />}
          </button>
        ))}
      </div>
      <button className="btn-primary" disabled={!selected} onClick={replace}>Заменить товар</button>
    </div>
  );
}
