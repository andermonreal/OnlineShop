import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../Login";
import Register from "../Register";
import Dashboard from "../Dashboard";
import Admin from "../Admin";
import { PrivateRoute } from "./PrivateRoute";

export const AppRoutes = ({ user, login, logout }) => (
  <Routes>
    <Route
      path="/login"
      element={!user ? <Login onLogin={login} /> : <Navigate to="/dashboard" replace />}
    />
    <Route
      path="/register"
      element={!user ? <Register onRegister={login} /> : <Navigate to="/dashboard" replace />}
    />
    <Route
      path="/dashboard"
      element={
        <PrivateRoute user={user}>
          <Dashboard user={user} onLogout={logout} />
        </PrivateRoute>
      }
    />
    <Route path="/admin" element={<Admin />} />
    <Route
      path="*"
      element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
    />
  </Routes>
);
