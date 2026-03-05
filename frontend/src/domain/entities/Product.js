// Domain Entity: Product
// Backend fields: id, name, price (BigDecimal->number), quantity (stock), description, imageUrl, createdAt
export class Product {
  constructor({ id, name, price, quantity, description, imageUrl, createdAt }) {
    this.id = id;
    this.name = name || 'Unnamed product';
    this.price = parseFloat(price) || 0;
    this.quantity = parseInt(quantity) ?? 0;
    this.description = description || '';
    this.imageUrl = imageUrl || null;
    this.createdAt = createdAt || null;
  }

  isAvailable() {
    return this.quantity > 0;
  }

  isLowStock() {
    return this.quantity > 0 && this.quantity <= 5;
  }

  formattedPrice() {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(this.price);
  }

  static fromDTO(dto) {
    if (!dto) throw new Error('Invalid product data');
    return new Product({
      id:          dto.id,
      name:        dto.name,
      price:       dto.price,
      quantity:    dto.quantity,
      description: dto.description,
      imageUrl:    dto.imageUrl || dto.image_url || null,
      createdAt:   dto.createdAt || dto.created_at || null,
    });
  }
}
