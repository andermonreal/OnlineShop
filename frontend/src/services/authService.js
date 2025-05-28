const API_BASE = "/onlineShop/api";

export async function login(email, password) {
  const response = await fetch("/onlineShop/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }

  const data = await response.json();

  return data;
}

export async function register(userData) {
  const response = await fetch(`${API_BASE}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Registration failed");

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
  return JSON.parse(localStorage.getItem("user"));
}

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}
