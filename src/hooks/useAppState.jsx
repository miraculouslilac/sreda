import { createContext, useContext, useState, useEffect } from 'react';

const AppStateContext = createContext(null);

const STORAGE_KEY = 'sreda_state';

const defaultState = {
  goal: null,
  days: null,
  people: null,
  budget: null,
  restrictions: [],
  cookingTime: null,
  cartGenerated: false,
  cartLinkCreated: false,
  onboardingComplete: false,
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return { ...defaultState, ...JSON.parse(saved) };
  } catch (e) { /* ignore */ }
  return defaultState;
}

export function AppStateProvider({ children }) {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateState = (updates) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const resetState = () => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AppStateContext.Provider value={{ state, updateState, resetState }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
