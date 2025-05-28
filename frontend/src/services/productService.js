import { apiFetch } from "./api"; 

export const fetchProducts = async () => {
  return apiFetch("/products");
};