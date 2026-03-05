import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './presentation/context/AuthContext.jsx';
import { CartProvider } from './presentation/context/CartContext.jsx';
import { ProtectedRoute, AdminRoute, PublicOnlyRoute } from './presentation/components/ProtectedRoute.jsx';
import Navbar from './presentation/components/Navbar.jsx';
import HomePage from './presentation/pages/HomePage.jsx';
import ProductDetailPage from './presentation/pages/ProductDetailPage.jsx';
import CartPage from './presentation/pages/CartPage.jsx';
import LoginPage from './presentation/pages/LoginPage.jsx';
import RegisterPage from './presentation/pages/RegisterPage.jsx';
import ProfilePage from './presentation/pages/ProfilePage.jsx';
import AdminPage from './presentation/pages/AdminPage.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/global.css';

// Layout with navbar for authenticated areas
function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public-only: redirect to home if already logged in */}
            <Route path="/login" element={
              <PublicOnlyRoute><LoginPage /></PublicOnlyRoute>
            } />
            <Route path="/register" element={
              <PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>
            } />

            {/* Protected: must be logged in */}
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout><HomePage /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/product/:id" element={
              <ProtectedRoute>
                <AppLayout><ProductDetailPage /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/cart" element={
              <ProtectedRoute>
                <AppLayout><CartPage /></AppLayout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <AppLayout><ProfilePage /></AppLayout>
              </ProtectedRoute>
            } />

            {/* Admin only */}
            <Route path="/admin" element={
              <AdminRoute>
                <AppLayout><AdminPage /></AppLayout>
              </AdminRoute>
            } />

            {/* Catch-all → login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
