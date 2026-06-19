import { useNavigate, useLocation } from 'react-router-dom';
import { CalendarDays, ShoppingCart, ChefHat, User } from 'lucide-react';

const tabs = [
  { path: '/today', label: 'Сегодня', icon: CalendarDays },
  { path: '/cart', label: 'Корзина', icon: ShoppingCart },
  { path: '/recipes', label: 'Рецепты', icon: ChefHat },
  { path: '/profile', label: 'Профиль', icon: User },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 430,
      background: 'white',
      borderTop: '1px solid var(--color-border)',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '8px 0 env(safe-area-inset-bottom, 8px)',
      zIndex: 1000,
    }}>
      {tabs.map(({ path, label, icon: Icon }) => {
        const active = location.pathname === path || 
          (path === '/today' && location.pathname === '/');
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              background: 'none',
              padding: '6px 12px',
              minWidth: 64,
              color: active ? 'var(--color-primary)' : 'var(--color-text-muted)',
              transition: 'color 0.2s',
            }}
          >
            <Icon size={22} strokeWidth={active ? 2.2 : 1.8} />
            <span style={{ fontSize: 11, fontWeight: active ? 600 : 400 }}>{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
