import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check, RefreshCw, Trash2 } from 'lucide-react';
import { products } from '../mockData/products';

export default function ProductScreen() {
  const navigate = useNavigate();
  const { productId } = useParams();
  
  const product = products.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="screen">
        <p>Товар не найден</p>
        <button className="btn-outline" onClick={() => navigate(-1)}>Назад</button>
      </div>
    );
  }

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

      {/* Product image placeholder */}
      <div style={{
        width: '100%',
        height: 160,
        borderRadius: 'var(--radius-lg)',
        background: product.image,
        marginBottom: 20,
        opacity: 0.7,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <span style={{ fontSize: 40, opacity: 0.5 }}>📦</span>
      </div>

      {/* Name and price */}
      <h1 style={{ marginBottom: 6 }}>{product.name}</h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-primary)' }}>
          {product.price} ₽
        </span>
        <span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
          {product.weight}
        </span>
        <span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
          ★ {product.rating}
        </span>
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {product.tags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      {/* KBJU */}
      <div className="card" style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 10, fontWeight: 600 }}>
          КБЖУ на 100 г
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {[
            { label: 'Ккал', value: product.kcal, color: 'var(--color-text)' },
            { label: 'Белки', value: `${product.protein} г`, color: '#FF6B6B' },
            { label: 'Жиры', value: `${product.fat} г`, color: '#FFB800' },
            { label: 'Углеводы', value: `${product.carbs} г`, color: '#4ECDC4' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 16, fontWeight: 700, color }}>{value}</p>
              <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Composition */}
      <div className="card" style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 6, fontWeight: 600 }}>
          Состав
        </p>
        <p style={{ fontSize: 14, color: 'var(--color-text)', lineHeight: 1.5 }}>
          {product.composition}
        </p>
      </div>

      {/* Why chosen */}
      <div className="card" style={{ marginBottom: 24, background: 'var(--color-primary-light)', border: 'none' }}>
        <p style={{ fontSize: 12, color: 'var(--color-primary)', marginBottom: 6, fontWeight: 600 }}>
          Почему выбран
        </p>
        <p style={{ fontSize: 14, color: 'var(--color-text)', lineHeight: 1.5 }}>
          {product.reason}
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button className="btn-primary" onClick={() => navigate(-1)}>
          <Check size={18} />
          Оставить
        </button>
        <button className="btn-secondary" onClick={() => navigate(`/replace/${product.id}`)}>
          <RefreshCw size={18} />
          Заменить
        </button>
        <button className="btn-outline" onClick={() => navigate(-1)} style={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}>
          <Trash2 size={18} />
          Удалить
        </button>
      </div>
    </div>
  );
}
