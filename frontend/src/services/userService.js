import { apiFetch } from "./api";

export async function getUserRoles() {
  const response = await apiFetch("/users/role");
  return Array.isArray(response.roles) ? response.roles : [];
}

export async function changePassword(userId, oldPassword, newPassword) {
  return await apiFetch(`/users/${userId}/change-password`, {
    method: "POST",
    body: JSON.stringify({ oldPassword, newPassword }),
  });
}
