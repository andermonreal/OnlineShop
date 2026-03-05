import { ApiClient } from './ApiClient.js';

export class UserApiAdapter {
  // POST /users/login
  login(email, password) {
    return ApiClient.post('/users/login', { email, password });
  }

  // POST /users/register
  register(name, email, password) {
    return ApiClient.post('/users/register', { name, email, password });
  }

  // POST /users/logout
  logout() {
    return ApiClient.post('/users/logout', {}, true);
  }

  // GET /users/role
  getRole() {
    return ApiClient.get('/users/role', true);
  }

  // POST /users/{userId}/change-password
  changePassword(userId, currentPassword, newPassword) {
    return ApiClient.post(`/users/${userId}/change-password`, { currentPassword, newPassword }, true);
  }
}

export const userApiAdapter = new UserApiAdapter();
