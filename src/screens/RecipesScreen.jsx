import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronDown, ChevronUp, Check, ThumbsDown } from 'lucide-react';
import { recipes } from '../mockData/recipes';
import { products } from '../mockData/products';

export default function RecipesScreen() {
  const navigate = useNavigate();
  const [expandedRecipe, setExpandedRecipe] = useState(null);

  return (
    <div className="screen">
      <h1 style={{ marginBottom: 6 }}>Что приготовить из корзины</h1>
      <p style={{ marginBottom: 20 }}>Рецепты из продуктов, которые вы заказали</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {recipes.map((recipe) => (
          <div key={recipe.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Recipe header */}
            <button
              onClick={() => setExpandedRecipe(expandedRecipe === recipe.id ? null : recipe.id)}
              style={{
                width: '100%',
                padding: '16px',
                background: 'none',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 15, marginBottom: 6 }}>{recipe.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <Clock size={13} color="var(--color-text-muted)" />
                    <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{recipe.time}</span>
                    <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>·</span>
                    <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{recipe.kcal} ккал</span>
                  </div>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {recipe.tags.map(tag => (
                      <span key={tag} className="tag" style={{ fontSize: 11, padding: '2px 8px' }}>{tag}</span>
                    ))}
                  </div>
                </div>
                {expandedRecipe === recipe.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>
            </button>

            {/* Expanded content */}
            {expandedRecipe === recipe.id && (
              <div style={{ padding: '0 16px 16px', borderTop: '1px solid var(--color-border)' }}>
                {/* Products used */}
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600, marginTop: 12, marginBottom: 8 }}>
                  Продукты из корзины:
                </p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                  {recipe.products.map(pid => {
                    const p = products.find(pr => pr.id === pid);
                    return p ? (
                      <span key={pid} style={{
                        padding: '4px 10px',
                        background: 'var(--color-bg)',
                        borderRadius: 8,
                        fontSize: 12,
                        color: 'var(--color-text-secondary)',
                      }}>
                        {p.name.split(' ').slice(0, 2).join(' ')}
                      </span>
                    ) : null;
                  })}
                </div>

                {/* Steps */}
                <p style={{ fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600, marginBottom: 8 }}>
                  Шаги:
                </p>
                <ol style={{ paddingLeft: 20, marginBottom: 12 }}>
                  {recipe.steps.map((step, i) => (
                    <li key={i} style={{ fontSize: 13, color: 'var(--color-text)', lineHeight: 1.6, marginBottom: 4 }}>
                      {step}
                    </li>
                  ))}
                </ol>

                {/* KBJU */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 12, padding: '10px', background: 'var(--color-bg)', borderRadius: 8 }}>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Б{recipe.protein}</span>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Ж{recipe.fat}</span>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>У{recipe.carbs}</span>
                  <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{recipe.kcal} ккал</span>
                </div>

                {/* Why */}
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontStyle: 'italic', marginBottom: 14, lineHeight: 1.4 }}>
                  «{recipe.why}»
                </p>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="btn-secondary" style={{ flex: 1, padding: '10px' }}>
                    <Check size={16} />
                    Приготовила
                  </button>
                  <button className="btn-outline" style={{ flex: 1, padding: '10px' }}>
                    <ThumbsDown size={16} />
                    Не подошло
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
