import { apiFetch } from "./api"; 

export const fetchUsers = async () => {
  return apiFetch("/admin/users");
};

export const deleteUser = async (userId) => {
  return apiFetch(`/admin/${userId}/delUser`, {
    method: "DELETE",
  });
};

export const changeUserRole = async (userId) => {
  return apiFetch(`/admin/${userId}/changeRol`);
};

export const changeUserPassword = async (userId, newPassword) => {
  return apiFetch(`/admin/${userId}/changePassword`, {
    method: "POST",
    body: JSON.stringify({ newPassword }),
  });
};