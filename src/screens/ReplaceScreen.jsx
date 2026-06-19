import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { products, cheaperAlternatives, proteinAlternatives } from '../mockData/products';

const filters = [
  { id: 'cheaper', label: 'Выгоднее' },
  { id: 'rating', label: 'Лучший рейтинг' },
  { id: 'less_cal', label: 'Меньше калорий' },
  { id: 'more_protein', label: 'Больше белка' },
  { id: 'no_sugar', label: 'Без лактозы / без сахара' },
];

export default function ReplaceScreen() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [activeFilter, setActiveFilter] = useState('cheaper');
  const [selected, setSelected] = useState(null);

  const original = products.find(p => p.id === productId);
  const alternatives = activeFilter === 'more_protein' ? proteinAlternatives : cheaperAlternatives;

  return (
    <div className="screen">
      <button onClick={() => navigate(-1)} style={{ background: 'none', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-secondary)', marginBottom: 16, padding: '8px 0' }}>
        <ArrowLeft size={18} /><span style={{ fontSize: 14 }}>Назад</span>
      </button>
      <h1 style={{ marginBottom: 8 }}>Чем заменить?</h1>
      {original && <p style={{ marginBottom: 16, fontSize: 14, color: 'var(--color-text-secondary)' }}>Вместо: {original.name}</p>}
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 12, marginBottom: 16 }}>
        {filters.map(f => (
          <button key={f.id} onClick={() => setActiveFilter(f.id)} style={{ padding: '8px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', background: activeFilter === f.id ? 'var(--color-primary)' : 'var(--color-white)', color: activeFilter === f.id ? 'white' : 'var(--color-text-secondary)', border: activeFilter === f.id ? 'none' : '1px solid var(--color-border)' }}>{f.label}</button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {alternatives.map(alt => (
          <div key={alt.id} className="card" style={{ padding: 14, border: selected === alt.id ? '2px solid var(--color-primary)' : undefined, cursor: 'pointer' }} onClick={() => setSelected(alt.id)}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: alt.image, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)' }}>{alt.name}</p>
                <div style={{ display: 'flex', gap: 8, marginTop: 4, fontSize: 12, color: 'var(--color-text-muted)' }}>
                  <span>{alt.price}&nbsp;&#8381;</span><span>{alt.weight}</span><span>{alt.kcal} ккал</span><span>Б:{alt.protein}</span>
                </div>
                <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                  {alt.tags.map(t => <span key={t} className="tag" style={{ fontSize: 10 }}>{t}</span>)}
                </div>
              </div>
              {selected === alt.id && <Check size={20} color="var(--color-primary)" />}
            </div>
          </div>
        ))}
      </div>
      <button className="btn-primary" disabled={!selected} onClick={() => navigate(-1)} style={{ opacity: selected ? 1 : 0.5 }}>Заменить</button>
    </div>
  );
}
