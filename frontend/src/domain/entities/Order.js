// Domain Entity: Order
// Backend Status enum: active | completed | cancelled
// OrderItem wraps a full Product object
import { Product } from './Product.js';

export class OrderItem {
  constructor({ id, product, quantity, createdAt }) {
    this.id = id;
    // Product may arrive as a full DTO object — parse defensively
    try {
      this.product = product instanceof Product ? product : Product.fromDTO(product);
    } catch {
      // Fallback minimal product if parsing fails
      this.product = new Product({ id: 0, name: 'Unknown', price: 0, quantity: 0, description: '', imageUrl: null });
    }
    this.quantity = quantity || 1;
    this.createdAt = createdAt || null;
  }

  subtotal() {
    return this.product.price * this.quantity;
  }

  formattedSubtotal() {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.subtotal());
  }
}

export class Order {
  constructor({ id, user, status, orderItems, createdAt }) {
    this.id = id;
    this.user = user;
    this.status = status || 'active';
    // Backend may serialize as "orderItems", "items", or "order_items"
    const rawItems = orderItems || [];
    this.orderItems = rawItems
      .filter(item => item != null)
      .map(item => item instanceof OrderItem ? item : new OrderItem(item));
    this.createdAt = createdAt || null;
  }

  itemCount() {
    return this.orderItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  total() {
    return this.orderItems.reduce((sum, item) => sum + item.subtotal(), 0);
  }

  formattedTotal() {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(this.total());
  }

  isActive()    { return this.status === 'active'; }
  isCompleted() { return this.status === 'completed'; }
  isCancelled() { return this.status === 'cancelled'; }

  static fromDTO(dto) {
    if (!dto) throw new Error('Invalid order data');
    // Accept orderItems or items or order_items from the serialized DTO
    const rawItems =
      (Array.isArray(dto.orderItems)   ? dto.orderItems   : null) ||
      (Array.isArray(dto.items)        ? dto.items        : null) ||
      (Array.isArray(dto.order_items)  ? dto.order_items  : null) ||
      [];
    return new Order({
      id:         dto.id,
      user:       dto.user || null,
      status:     dto.status || 'active',
      orderItems: rawItems,
      createdAt:  dto.createdAt || dto.created_at || null,
    });
  }
}
