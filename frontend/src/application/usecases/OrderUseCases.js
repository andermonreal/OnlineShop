import { Order } from '../../domain/entities/Order.js';
import { orderApiAdapter } from '../../infrastructure/api/OrderApiAdapter.js';

export class OrderUseCases {
  constructor(repo = orderApiAdapter) {
    this.repo = repo;
  }

  async getCart(userId) {
    const data = await this.repo.getByUser(userId);
    return Order.fromDTO(data);
  }

  async addToCart(userId, productId, quantity = 1) {
    if (quantity < 1) throw new Error('Quantity must be greater than 0');
    return this.repo.addProduct(userId, productId, quantity);
  }

  async removeFromCart(userId, productId) {
    return this.repo.removeProduct(userId, productId, 9999);
  }

  async decreaseQuantity(userId, productId, quantity) {
    if (quantity < 1) throw new Error('Quantity must be greater than 0');
    return this.repo.removeProductQuantity(userId, productId, quantity);
  }

  async clearCart(userId) {
    return this.repo.clearOrder(userId);
  }
}

export const orderUseCases = new OrderUseCases();
