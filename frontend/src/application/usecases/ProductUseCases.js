import { Product } from '../../domain/entities/Product.js';
import { productApiAdapter } from '../../infrastructure/api/ProductApiAdapter.js';

export class ProductUseCases {
  constructor(repo = productApiAdapter) {
    this.repo = repo;
  }

  async getAll() {
    const data = await this.repo.getAll();
    return data.map(Product.fromDTO);
  }

  async getById(id) {
    const data = await this.repo.getById(id);
    return Product.fromDTO(data);
  }

  search(products, query) {
    if (!query) return products;
    const q = query.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  sort(products, by) {
    const arr = [...products];
    if (by === 'price-asc') return arr.sort((a, b) => a.price - b.price);
    if (by === 'price-desc') return arr.sort((a, b) => b.price - a.price);
    if (by === 'name') return arr.sort((a, b) => a.name.localeCompare(b.name));
    if (by === 'stock-asc') return arr.sort((a, b) => a.quantity - b.quantity);
    return arr;
  }

  filterAvailable(products, onlyAvailable) {
    if (!onlyAvailable) return products;
    return products.filter(p => p.isAvailable());
  }
}

export const productUseCases = new ProductUseCases();
