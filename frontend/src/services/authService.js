import { apiFetch } from "./api";

export async function login(email, password) {
  const data = await apiFetch("/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: { "Content-Type": "application/json" },
  });

  return data;
}

export async function register(userData) {
  const data = await apiFetch("/users/register", {
    method: "POST",
    body: JSON.stringify(userData),
    headers: { "Content-Type": "application/json" },
  });

  return {
    token: data.token,
    user: data.user,
  };
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getCurrentUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem("token"));
}
