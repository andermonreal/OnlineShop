import { ApiClient } from './ApiClient.js';

export class AdminApiAdapter {
  // GET /admin/users
  getAllUsers() {
    return ApiClient.get('/admin/users', true);
  }

  // DELETE /admin/{userId}/delUser
  deleteUser(userId) {
    return ApiClient.delete(`/admin/${userId}/delUser`, true);
  }

  // GET /admin/{userId}/changeRol
  changeUserRole(userId) {
    return ApiClient.get(`/admin/${userId}/changeRol`, true);
  }

  // POST /admin/{userId}/changePassword
  changeUserPassword(userId, currentPassword, newPassword) {
    return ApiClient.post(`/admin/${userId}/changePassword`, { currentPassword, newPassword }, true);
  }

  // POST /admin/addProduct
  addProduct(data) {
    return ApiClient.post('/admin/addProduct', data, true);
  }

  // DELETE /admin/{productId}/delProduct
  deleteProduct(productId) {
    return ApiClient.delete(`/admin/${productId}/delProduct`, true);
  }

  // PUT /admin/{productId}/updateProduct
  updateProduct(productId, data) {
    return ApiClient.put(`/admin/${productId}/updateProduct`, data, true);
  }
}

export const adminApiAdapter = new AdminApiAdapter();
