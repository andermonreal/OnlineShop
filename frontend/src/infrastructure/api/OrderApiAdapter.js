import { ApiClient } from './ApiClient.js';

export class OrderApiAdapter {
  // GET /order/{userId}
  getByUser(userId) {
    return ApiClient.get(`/order/${userId}`, true);
  }

  // POST /order/{userId}/add  body: { productId, quantity }
  addProduct(userId, productId, quantity) {
    return ApiClient.post(`/order/${userId}/add`, { productId, quantity }, true);
  }

  // DELETE /order/{userId}/remove/{productId}  — removes all units of that product
  removeProduct(userId, productId, quantity) {
    return ApiClient.delete(`/order/${userId}/remove/${productId}?quantity=${quantity}`, true);
  }

  // DELETE /order/{userId}/remove/{productId}?quantity=X  — reduces quantity
  removeProductQuantity(userId, productId, quantity) {
    return ApiClient.deleteWithParams(
      `/order/${userId}/remove/${productId}`,
      { quantity },
      true
    );
  }

  // DELETE /order/{userId}/clear
  clearOrder(userId) {
    return ApiClient.delete(`/order/${userId}/clear`, true);
  }
}

export const orderApiAdapter = new OrderApiAdapter();
