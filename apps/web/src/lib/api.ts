const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: 'An error occurred',
      }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Products
  async getProducts() {
    return this.request('/api/products');
  }

  async getProduct(id: string) {
    return this.request(`/api/products/${id}`);
  }

  async createProduct(data: any) {
    return this.request('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id: string, data: any) {
    return this.request(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/api/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Variations
  async getVariations(productId: string) {
    return this.request(`/api/products/${productId}/variations`);
  }

  async createVariation(productId: string, data: any) {
    return this.request(`/api/products/${productId}/variations`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // SKUs
  async getSkus(variationId: string) {
    return this.request(`/api/variations/${variationId}/skus`);
  }

  async createSku(variationId: string, data: any) {
    return this.request(`/api/variations/${variationId}/skus`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Fabrics
  async getFabrics() {
    return this.request('/api/fabrics');
  }

  async getFabric(id: string) {
    return this.request(`/api/fabrics/${id}`);
  }

  async getFabricBalance(id: string) {
    return this.request(`/api/fabrics/${id}/balance`);
  }

  async getFabricTransactions(id: string) {
    return this.request(`/api/fabrics/${id}/transactions`);
  }

  async createFabricTransaction(id: string, data: any) {
    return this.request(`/api/fabrics/${id}/transactions`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Fabric Types
  async getFabricTypes() {
    return this.request('/api/fabrics/fabric-types');
  }
}

export const api = new ApiClient(API_BASE_URL);
