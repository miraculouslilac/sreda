import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppStateProvider } from './hooks/useAppState';
import BottomNav from './components/BottomNav';
import HomeScreen from './screens/HomeScreen';
import GoalScreen from './screens/GoalScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import ContextScreen from './screens/ContextScreen';
import LoadingScreen from './screens/LoadingScreen';
import MealPlanScreen from './screens/MealPlanScreen';
import CartScreen from './screens/CartScreen';
import ReplaceScreen from './screens/ReplaceScreen';
import ProductScreen from './screens/ProductScreen';
import RecipesScreen from './screens/RecipesScreen';
import CartReadyScreen from './screens/CartReadyScreen';
import TodayScreen from './screens/TodayScreen';
import ProfileScreen from './screens/ProfileScreen';
import McpStatusScreen from './screens/McpStatusScreen';

export default function App() {
  return (
    <AppStateProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/goal" element={<GoalScreen />} />
          <Route path="/onboarding" element={<OnboardingScreen />} />
          <Route path="/context" element={<ContextScreen />} />
          <Route path="/loading" element={<LoadingScreen />} />
          <Route path="/meal-plan" element={<MealPlanScreen />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/replace/:productId" element={<ReplaceScreen />} />
          <Route path="/product/:productId" element={<ProductScreen />} />
          <Route path="/recipes" element={<RecipesScreen />} />
          <Route path="/cart-ready" element={<CartReadyScreen />} />
          <Route path="/today" element={<TodayScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
          <Route path="/mcp-status" element={<McpStatusScreen />} />
        </Routes>
        <BottomNav />
      </HashRouter>
    </AppStateProvider>
  );
}
