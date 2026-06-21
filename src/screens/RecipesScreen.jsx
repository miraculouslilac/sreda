import { useState } from 'react';
import { Clock, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../hooks/useAppState';

export default function RecipesScreen() {
  const navigate = useNavigate();
  const { state } = useAppState();
  const [expanded, setExpanded] = useState(null);
  const [cooked, setCooked] = useState([]);
  const [disliked, setDisliked] = useState([]);
  const recipes = state.recipes || [];

  if (!recipes.length) {
    return (
      <div className="screen" style={{ paddingTop: 40 }}>
        <h1>Рецептов пока нет</h1>
        <p style={{ margin: '12px 0 20px' }}>Сначала соберите корзину — рецепты появятся из реально выбранных продуктов.</p>
        <button className="btn-primary" onClick={() => navigate('/goal')}>Собрать корзину</button>
      </div>
    );
  }

  return (
    <div className="screen">
      <h1 style={{ marginBottom: 6 }}>Что приготовить из корзины</h1>
      <p style={{ marginBottom: 20 }}>Подборка для вашей цели: {state.goal || 'здоровое питание'}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {recipes.map((recipe) => (
          <div key={recipe.id} className="card" style={{ padding: 0, overflow: 'hidden', opacity: disliked.includes(recipe.id) ? 0.5 : 1 }}>
            <button onClick={() => setExpanded(expanded === recipe.id ? null : recipe.id)} style={{ width: '100%', padding: '14px 16px', background: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text)', marginBottom: 4 }}>{recipe.name}</p>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={12} /> {recipe.time}</span>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{Math.round(recipe.kcal)} ккал</span>
                </div>
              </div>
              {expanded === recipe.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            {expanded === recipe.id && (
              <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--color-border)' }}>
                <p style={{ margin: '12px 0', fontStyle: 'italic' }}>{recipe.why}</p>
                <p className="eyebrow">Продукты из вашей корзины</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                  {recipe.productNames.map((name) => <span key={name} className="tag" style={{ fontSize: 11 }}>{name}</span>)}
                </div>
                {recipe.ingredients?.length > 0 && (
                  <>
                    <p className="eyebrow">Все ингредиенты</p>
                    <ul style={{ paddingLeft: 18, marginBottom: 14 }}>
                      {recipe.ingredients.map((ingredient) => (
                        <li key={`${ingredient.name}-${ingredient.quantity}`} style={{ fontSize: 14, marginBottom: 4 }}>
                          {ingredient.name} — {ingredient.quantity}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <p className="eyebrow">Шаги приготовления</p>
                <ol style={{ paddingLeft: 18, marginBottom: 16 }}>
                  {recipe.steps.map((step, index) => <li key={step} style={{ fontSize: 14, marginBottom: 6 }}>{index + 1}. {step}</li>)}
                </ol>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => setCooked((items) => [...new Set([...items, recipe.id])])} className="mini-button" style={{ flex: 1, justifyContent: 'center' }}>
                    <ThumbsUp size={14} /> {cooked.includes(recipe.id) ? 'Готово!' : 'Приготовила'}
                  </button>
                  <button onClick={() => setDisliked((items) => [...new Set([...items, recipe.id])])} className="mini-button danger" style={{ flex: 1, justifyContent: 'center' }}>
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
