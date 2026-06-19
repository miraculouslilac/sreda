import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { products } from '../mockData/products';
import { getAlternatives } from '../services/vkusvillMcpAdapter';

const modes = [
  { id: 'cheaper', label: 'Выгоднее' },
  { id: 'higher_rating', label: 'Лучший рейтинг' },
  { id: 'less_calories', label: 'Меньше калорий' },
  { id: 'more_protein', label: 'Больше белка' },
  { id: 'no_lactose', label: 'Без лактозы / без сахара' },
];

export default function ReplaceScreen() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [selectedMode, setSelectedMode] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading] = useState(false);

  const original = products.find(p => p.id === productId);

  const handleModeSelect = async (mode) => {
    setSelectedMode(mode);
    setLoading(true);
    try {
      const alts = await getAlternatives(productId, mode);
      setAlternatives(alts);
    } catch (e) {
      setAlternatives([]);
    }
    setLoading(false);
  };

  if (!original) {
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

      <h2 style={{ marginBottom: 6 }}>Чем заменить?</h2>
      <p style={{ marginBottom: 4, fontSize: 14, color: 'var(--color-text-secondary)' }}>
        Вместо: <strong>{original.name}</strong>
      </p>
      <p style={{ marginBottom: 20, fontSize: 13, color: 'var(--color-text-muted)' }}>
        {original.price} ₽ · {original.weight}
      </p>

      {/* Mode selection */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {modes.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => handleModeSelect(id)}
            style={{
              padding: '8px 14px',
              background: selectedMode === id ? 'var(--color-primary)' : 'var(--color-white)',
              color: selectedMode === id ? 'white' : 'var(--color-text)',
              border: selectedMode === id ? 'none' : '1.5px solid var(--color-border)',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 500,
              transition: 'all 0.2s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: 20 }}>
          <p style={{ fontSize: 14, color: 'var(--color-text-muted)', animation: 'pulse 1.5s infinite' }}>
            Ищу альтернативы…
          </p>
        </div>
      )}

      {/* Alternatives */}
      {!loading && alternatives.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {alternatives.map(alt => (
            <div key={alt.id} className="card" style={{ padding: 14 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 10,
                  background: alt.image,
                  flexShrink: 0,
                  opacity: 0.8,
                }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{alt.name}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-primary)' }}>
                      {alt.price} ₽
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                      {alt.weight}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                    Б{alt.protein} · Ж{alt.fat} · У{alt.carbs} · {alt.kcal} ккал
                  </p>
                </div>
              </div>
              <button 
                onClick={() => navigate(-1)}
                className="btn-secondary" 
                style={{ marginTop: 10, padding: '10px' }}
              >
                <Check size={16} />
                Выбрать
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && selectedMode && alternatives.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 20 }}>
          <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
            Подходящих альтернатив не найдено
          </p>
        </div>
      )}
    </div>
  );
}
