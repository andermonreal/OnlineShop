import { User } from '../../domain/entities/User.js';
import { adminApiAdapter } from '../../infrastructure/api/AdminApiAdapter.js';

export class AdminUseCases {
  constructor(repo = adminApiAdapter) {
    this.repo = repo;
  }

  async getAllUsers() {
    const data = await this.repo.getAllUsers();
    return data.map(User.fromDTO);
  }

  async deleteUser(userId) {
    return this.repo.deleteUser(userId);
  }

  async changeUserRole(userId) {
    return this.repo.changeUserRole(userId);
  }

  async changeUserPassword(userId, currentPassword, newPassword) {
    if (!newPassword || newPassword.length < 6)
      throw new Error('New password must be at least 6 characters');
    return this.repo.changeUserPassword(userId, currentPassword, newPassword);
  }

  async addProduct({ name, description, price, quantity, imageUrl }) {
    if (!name) throw new Error('Name is required');
    if (!price || parseFloat(price) <= 0) throw new Error('Price must be greater than 0');
    return this.repo.addProduct({
      name,
      description,
      price: parseFloat(price),
      quantity: parseInt(quantity) || 0,
      imageUrl,
    });
  }

  async deleteProduct(productId) {
    return this.repo.deleteProduct(productId);
  }

  async updateProduct(productId, { price, quantity, description }) {
    const payload = {};
    if (price !== undefined && price !== '') {
      if (parseFloat(price) <= 0) throw new Error('Price must be greater than 0');
      payload.price = parseFloat(price);
    }
    if (quantity !== undefined && quantity !== '') {
      if (parseInt(quantity) < 0) throw new Error('Stock cannot be negative');
      payload.quantity = parseInt(quantity);
    }
    if (description !== undefined) payload.description = description;
    if (Object.keys(payload).length === 0) throw new Error('No changes to save');
    return this.repo.updateProduct(productId, payload);
  }
}

export const adminUseCases = new AdminUseCases();
