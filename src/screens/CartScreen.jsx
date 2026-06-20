import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Trash2, LoaderCircle } from 'lucide-react';
import { useAppState } from '../hooks/useAppState';
import { optimizeCart } from '../services/sredaAgent';
import { createCartLink } from '../services/vkusvillMcpAdapter';
import { categoryLabels } from '../mockData/products';
import { formatDays } from '../utils/format';

export default function CartScreen() {
  const navigate = useNavigate();
  const { state, setCartItems, updateState } = useAppState();
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);
  const cartItems = state.cartItems || [];

  const totalPrice = cartItems.reduce((sum, product) => sum + product.price * (product.quantity || 1), 0);
  const grouped = cartItems.reduce((result, product) => {
    const category = product.category || 'other';
    if (!result[category]) result[category] = [];
    result[category].push(product);
    return result;
  }, {});

  const removeItem = (id) => setCartItems(cartItems.filter((product) => product.id !== id));
  const optimize = (mode) => setCartItems(optimizeCart(cartItems, mode));

  async function handleCreateLink() {
    setCreating(true);
    setError(null);
    try {
      const cartLink = await createCartLink(cartItems);
      updateState({ cartLink, cartLinkCreated: true });
      navigate('/cart-ready');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Не удалось создать ссылку');
    } finally {
      setCreating(false);
    }
  }

  if (!cartItems.length) {
    return (
      <div className="screen" style={{ paddingTop: 40 }}>
        <h1>Корзина пока пуста</h1>
        <p style={{ margin: '12px 0 20px' }}>Сначала расскажите о цели — Среда найдёт реальные товары во ВкусВилле.</p>
        <button className="btn-primary" onClick={() => navigate('/goal')}>Собрать корзину</button>
      </div>
    );
  }

  return (
    <div className="screen">
      <button onClick={() => navigate(-1)} className="link-button"><ArrowLeft size={18} /> Назад</button>
      <h1 style={{ marginBottom: 16 }}>Корзина во ВкусВилл</h1>
      <div className="card" style={{ marginBottom: 20 }}>
        <strong style={{ fontSize: 20 }}>{cartItems.length} товаров · {totalPrice.toLocaleString('ru-RU')} ₽</strong>
        <p>На {formatDays(state.days)}, для {state.people === 'family' ? 'семьи' : `${state.people || 1} чел.`}</p>
      </div>

      {Object.entries(grouped).map(([category, items]) => (
        <section key={category} style={{ marginBottom: 20 }}>
          <h3 style={{ marginBottom: 10 }}>{categoryLabels[category] || items[0]?.categoryLabel || 'Продукты'}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {items.map((product) => (
              <article key={product.id} className="card product-row">
                {product.image ? <img src={product.image} alt="" className="product-thumb" /> : <div className="product-thumb product-placeholder" />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <button className="product-title" onClick={() => navigate(`/product/${product.id}`)}>{product.name}</button>
                  <p>{product.weight} · ★ {product.rating?.toFixed?.(1) || '—'}</p>
                  <p style={{ fontWeight: 700, color: 'var(--color-text)' }}>{product.price} ₽</p>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button className="mini-button" onClick={() => navigate(`/replace/${product.id}`)}><RefreshCw size={13} /> Заменить</button>
                    <button className="mini-button danger" onClick={() => removeItem(product.id)}><Trash2 size={13} /> Удалить</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}

      {error && <p className="error-box">{error}</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="btn-primary" disabled={creating} onClick={handleCreateLink}>
          {creating && <LoaderCircle size={18} className="spin" />}
          {creating ? 'Создаю ссылку…' : 'Создать ссылку на корзину'}
        </button>
        <button className="btn-outline" onClick={() => optimize('cheaper')}>Сделать дешевле</button>
        <button className="btn-outline" onClick={() => optimize('more_protein')}>Больше белка</button>
        <button className="btn-outline" onClick={() => optimize('less_sugar')}>Меньше сахара</button>
      </div>
    </div>
  );
}
