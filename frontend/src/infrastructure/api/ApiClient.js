const BASE_URL = '/onlineShop/api';

export class ApiClient {
  static getToken() {
    return localStorage.getItem('token');
  }

  static authHeaders() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  static async request(method, endpoint, body = null, auth = false) {
    const headers = {};

    // Only send Content-Type when there is actually a body.
    // This is critical for DELETE endpoints: JAX-RS uses @Consumes to
    // disambiguate two methods on the same path. If we send
    // Content-Type: application/json on a bodyless DELETE, JAX-RS routes
    // to the @Consumes(APPLICATION_JSON) overload (quantity endpoint) instead
    // of the plain remove-all overload, and quantity defaults to 0 → no-op.
    if (body !== null) {
      headers['Content-Type'] = 'application/json';
    }

    if (auth) Object.assign(headers, this.authHeaders());

    const options = { method, headers };
    if (body !== null) options.body = JSON.stringify(body);

    const res = await fetch(`${BASE_URL}${endpoint}`, options);

    if (res.status === 204) return {};

    const text = await res.text();
    let data = {};
    try { data = text ? JSON.parse(text) : {}; } catch { data = { error: text }; }

    if (!res.ok) {
      throw new Error(data.error || data.message || `Error ${res.status}`);
    }
    return data;
  }

  static get(endpoint, auth = false) {
    return this.request('GET', endpoint, null, auth);
  }

  static post(endpoint, body, auth = false) {
    return this.request('POST', endpoint, body, auth);
  }

  static put(endpoint, body, auth = false) {
    return this.request('PUT', endpoint, body, auth);
  }

  static delete(endpoint, auth = false) {
    return this.request('DELETE', endpoint, null, auth);
  }

  static deleteWithParams(endpoint, params, auth = false) {
    const query = new URLSearchParams(params).toString();
    return this.request('DELETE', `${endpoint}?${query}`, null, auth);
  }
}
