import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, RefreshCw, Trash2 } from 'lucide-react';
import { products } from '../mockData/products';
import { useAppState } from '../hooks/useAppState';

const goalLabels = { energy: 'Больше энергии', weight_loss: 'Похудение', sugar_control: 'Контроль сахара', sport: 'Спорт и восстановление', healthy: 'Просто здоровая корзина', custom: 'Своя цель' };

export default function ProductScreen() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { state } = useAppState();
  const product = products.find(p => p.id === productId);
  if (!product) return <div className="screen"><p>Товар не найден</p><button className="btn-outline" onClick={() => navigate(-1)}>Назад</button></div>;

  return (
    <div className="screen">
      <button onClick={() => navigate(-1)} style={{ background: 'none', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)', marginBottom: 16, padding: '8px 0' }}>
        <ArrowLeft size={18} /><span style={{ fontSize: 14 }}>Назад</span>
      </button>
      <div style={{ width: '100%', height: 160, borderRadius: 16, background: product.image, marginBottom: 20 }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <h1 style={{ fontSize: 20, flex: 1 }}>{product.name}</h1>
        <span style={{ fontSize: 20, fontWeight: 700, whiteSpace: 'nowrap', marginLeft: 12 }}>{product.price}&nbsp;&#8381;</span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16 }}>{product.weight}</p>
      <div className="card" style={{ marginBottom: 12 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4, fontWeight: 500, textTransform: 'uppercase' }}>Состав</p>
        <p style={{ fontSize: 14, color: 'var(--color-text)' }}>{product.composition}</p>
      </div>
      <div className="card" style={{ marginBottom: 12 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 8, fontWeight: 500, textTransform: 'uppercase' }}>КБЖУ на 100 г</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, textAlign: 'center' }}>
          <div><p style={{ fontSize: 18, fontWeight: 700 }}>{product.kcal}</p><p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>ккал</p></div>
          <div><p style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-primary)' }}>{product.protein}</p><p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>белки</p></div>
          <div><p style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-warning)' }}>{product.fat}</p><p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>жиры</p></div>
          <div><p style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-accent)' }}>{product.carbs}</p><p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>углеводы</p></div>
        </div>
      </div>
      <div className="card" style={{ marginBottom: 12, background: 'var(--color-primary-light)', border: 'none' }}>
        <p style={{ fontSize: 12, color: 'var(--color-primary)', marginBottom: 4, fontWeight: 500, textTransform: 'uppercase' }}>Почему агент выбрал</p>
        <p style={{ fontSize: 14, color: 'var(--color-text)', fontStyle: 'italic' }}>{product.reason}</p>
      </div>
      <div className="card" style={{ marginBottom: 12 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4, fontWeight: 500, textTransform: 'uppercase' }}>Подходит под цель</p>
        <p style={{ fontSize: 14, color: 'var(--color-text)' }}>{goalLabels[state.goal] || 'Здоровая корзина'}</p>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
        {product.tags.map(tag => (<span key={tag} className="tag">{tag}</span>))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="btn-primary" onClick={() => navigate(-1)}><Check size={18} /> Оставить</button>
        <button className="btn-secondary" onClick={() => navigate('/replace/' + product.id)}><RefreshCw size={18} /> Заменить</button>
        <button className="btn-outline" onClick={() => navigate(-1)} style={{ color: 'var(--color-danger)', borderColor: '#FEE2E2' }}><Trash2 size={18} /> Удалить</button>
      </div>
    </div>
  );
}
