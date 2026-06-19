import { useState } from 'react';
import { Clock, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown } from 'lucide-react';
import { recipes } from '../mockData/recipes';
import { products } from '../mockData/products';

export default function RecipesScreen() {
  const [expanded, setExpanded] = useState(null);
  const [cooked, setCooked] = useState([]);
  const [disliked, setDisliked] = useState([]);
  const getProductName = (id) => { const p = products.find(pr => pr.id === id); return p ? p.name : id; };

  return (
    <div className="screen">
      <h1 style={{ marginBottom: 20 }}>Что приготовить из корзины</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {recipes.map((recipe) => (
          <div key={recipe.id} className="card" style={{ padding: 0, overflow: 'hidden', opacity: disliked.includes(recipe.id) ? 0.5 : 1 }}>
            <button onClick={() => setExpanded(expanded === recipe.id ? null : recipe.id)} style={{ width: '100%', padding: '14px 16px', background: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 }}>{recipe.name}</p>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={12} /> {recipe.time}</span>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{recipe.kcal} ккал</span>
                </div>
              </div>
              {expanded === recipe.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expanded === recipe.id && (
              <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', gap: 12, marginTop: 12, marginBottom: 12, fontSize: 12, color: 'var(--color-text-muted)' }}>
                  <span>Б: {recipe.protein} г</span><span>Ж: {recipe.fat} г</span><span>У: {recipe.carbs} г</span><span>{recipe.kcal} ккал</span>
                </div>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', marginBottom: 6 }}>Продукты из корзины</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                  {recipe.products.map(pid => (<span key={pid} className="tag" style={{ fontSize: 11 }}>{getProductName(pid)}</span>))}
                </div>
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', marginBottom: 6 }}>Шаги приготовления</p>
                <ol style={{ paddingLeft: 18, marginBottom: 16 }}>
                  {recipe.steps.map((step, i) => (<li key={i} style={{ fontSize: 14, color: 'var(--color-text)', marginBottom: 6, lineHeight: 1.4 }}>{step}</li>))}
                </ol>
                <div style={{ display: 'flex', gap: 4, marginBottom: 14, flexWrap: 'wrap' }}>
                  {recipe.tags.map(t => <span key={t} className="tag" style={{ fontSize: 11 }}>{t}</span>)}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setCooked([...cooked, recipe.id])} style={{ flex: 1, padding: '10px 14px', borderRadius: 10, fontSize: 13, fontWeight: 500, background: cooked.includes(recipe.id) ? 'var(--color-primary)' : 'var(--color-primary-light)', color: cooked.includes(recipe.id) ? 'white' : 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <ThumbsUp size={14} /> {cooked.includes(recipe.id) ? 'Готово!' : 'Приготовила'}
                  </button>
                  <button onClick={() => setDisliked([...disliked, recipe.id])} style={{ flex: 1, padding: '10px 14px', borderRadius: 10, fontSize: 13, fontWeight: 500, background: '#FEE2E2', color: 'var(--color-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <ThumbsDown size={14} /> Не понравилось
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
