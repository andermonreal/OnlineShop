import { apiFetch } from "./api";

const getUserId = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user?.id) throw new Error("User not found in localStorage");
  return user.id;
};

export const getOrder = async () => {
  const userId = getUserId();
  return apiFetch(`/order/${userId}`);
};

export const clearOrder = async () => {
  const userId = getUserId();
  return apiFetch(`/order/${userId}/clear`, {
    method: "DELETE",
  });
};

export const addProductToOrder = async (productId, quantity = 1) => {
  const userId = getUserId();
  return apiFetch(`/order/${userId}/add`, {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
};

export const removeProductFromOrder = async (productId, quantity = 1) => {
  const userId = getUserId();
  return apiFetch(`/order/${userId}/remove/${productId}?quantity=${quantity}`, {
    method: "DELETE",
  });
};