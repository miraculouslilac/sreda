/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const AppStateContext = createContext(null);
const STORAGE_KEY = 'sreda_state_v2';

const defaultState = {
  goal: null,
  days: null,
  people: null,
  budget: null,
  restrictions: [],
  cookingTime: null,
  cartGenerated: false,
  cartItems: [],
  mealPlan: [],
  cartLink: null,
  cartLinkCreated: false,
  generationError: null,
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultState, ...JSON.parse(saved) } : defaultState;
  } catch {
    return defaultState;
  }
}

export function AppStateProvider({ children }) {
  const [state, setState] = useState(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateState = useCallback((partial) => {
    setState((previous) => ({ ...previous, ...partial }));
  }, []);

  const setCartItems = useCallback((cartItems) => {
    setState((previous) => ({
      ...previous,
      cartItems,
      cartLink: null,
      cartLinkCreated: false,
    }));
  }, []);

  const resetState = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(() => ({
    state,
    updateState,
    setCartItems,
    resetState,
  }), [resetState, setCartItems, state, updateState]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useAppState must be used within AppStateProvider');
  return context;
}
