import { Navigate } from "react-router-dom";

export const PrivateRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/login" replace />;
};
