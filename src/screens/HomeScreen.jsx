import { useNavigate } from 'react-router-dom';
import { ShoppingCart, ChefHat, RotateCcw, Target, Sparkles } from 'lucide-react';

export default function HomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="screen" style={{ paddingTop: 24 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, marginBottom: 4 }}>Среда</h1>
        <p style={{ fontSize: 15, color: 'var(--color-text-secondary)' }}>
          ИИ-агент питания под ваше здоровье
        </p>
      </div>

      {/* Main card */}
      <div className="card" style={{ marginBottom: 20, padding: 20, background: 'linear-gradient(135deg, var(--color-primary-light) 0%, #F0F9FF 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'var(--color-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <Sparkles size={20} color="white" />
          </div>
          <p style={{ fontSize: 15, color: 'var(--color-text)', lineHeight: 1.5, fontWeight: 500 }}>
            Соберу корзину во ВкусВилл под вашу цель, анализы и ритм жизни
          </p>
        </div>
      </div>

      {/* 4 Action buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        <button className="btn-primary" onClick={() => navigate('/goal')}>
          <ShoppingCart size={18} />
          Собрать корзину
        </button>
        <button className="btn-secondary" onClick={() => navigate('/today')}>
          <ChefHat size={18} />
          Что приготовить сегодня?
        </button>
        <button className="btn-outline" onClick={() => navigate('/cart')}>
          <RotateCcw size={18} />
          Повторить прошлую корзину
        </button>
        <button className="btn-outline" onClick={() => navigate('/goal')}>
          <Target size={18} />
          Настроить цель
        </button>
      </div>

      {/* Bottom block - weekly focus */}
      <div className="card" style={{ background: 'var(--color-white)' }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 6, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Фокус недели
        </p>
        <p style={{ fontSize: 14, color: 'var(--color-text)', lineHeight: 1.5 }}>
          На этой неделе фокус: больше белка, меньше сахара, простые ужины до 20 минут
        </p>
      </div>
    </div>
  );
}
