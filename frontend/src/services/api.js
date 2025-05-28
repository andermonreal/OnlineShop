const API_BASE = "/onlineShop/api";

const getToken = () => localStorage.getItem("token");

export async function apiFetch(path, options = {}) {
  const defaultHeaders = {
    ...(options.body && { "Content-Type": "application/json" }),
    Authorization: `Bearer ${getToken()}`,
  };

  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "API Error");
  }

  return response.json();
}
