import { User } from '../../domain/entities/User.js';
import { userApiAdapter } from '../../infrastructure/api/UserApiAdapter.js';

export class AuthUseCases {
  constructor(repo = userApiAdapter) {
    this.repo = repo;
  }

  async login(email, password) {
    if (!email || !password) throw new Error('Email and password are required');
    const data = await this.repo.login(email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return { token: data.token, user: User.fromDTO(data.user) };
  }

  async register(name, email, password) {
    if (!name || !email || !password) throw new Error('All fields are required');
    if (password.length < 6) throw new Error('Password must be at least 6 characters');
    const data = await this.repo.register(name, email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return { token: data.token, user: User.fromDTO(data.user) };
  }

  async logout() {
    try { await this.repo.logout(); } catch (_) {}
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async getRole() {
    return this.repo.getRole();
  }

  async changePassword(userId, currentPassword, newPassword) {
    if (!currentPassword || !newPassword) throw new Error('Both passwords are required');
    if (newPassword.length < 6) throw new Error('New password must be at least 6 characters');
    return this.repo.changePassword(userId, currentPassword, newPassword);
  }

  getCurrentUser() {
    try {
      const raw = localStorage.getItem('user');
      return raw ? User.fromDTO(JSON.parse(raw)) : null;
    } catch { return null; }
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}

export const authUseCases = new AuthUseCases();
