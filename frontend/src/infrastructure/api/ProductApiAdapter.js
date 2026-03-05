import { ApiClient } from './ApiClient.js';

export class ProductApiAdapter {
  // GET /products/
  getAll() {
    return ApiClient.get('/products/', true);
  }

  // GET /products/{id}
  getById(id) {
    return ApiClient.get(`/products/${id}`, true);
  }
}

export const productApiAdapter = new ProductApiAdapter();
