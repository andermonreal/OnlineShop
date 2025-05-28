import React from "react";
import { BrowserRouter } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  const { user, login, logout } = useAuth();

  return (
    <BrowserRouter>
      <AppRoutes user={user} login={login} logout={logout} />
    </BrowserRouter>
  );
}

export default App;
