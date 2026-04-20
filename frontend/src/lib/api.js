const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const { token, body, headers, ...rest } = options;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || 'Request failed.');
  }

  return data;
}

export const authApi = {
  register(role, payload) {
    const endpoint = role === 'admin' ? '/admin/register' : '/auth/register';
    return request(endpoint, {
      method: 'POST',
      body: payload,
    });
  },
  login(role, payload) {
    const endpoint = role === 'admin' ? '/admin/login' : '/auth/login';
    return request(endpoint, {
      method: 'POST',
      body: payload,
    });
  },
  getAdminOverview(token) {
    return request('/admin/overview', {
      method: 'GET',
      token,
    });
  },
};

export const productApi = {
  getAll() {
    return request('/products', {
      method: 'GET',
    });
  },
  getById(id) {
    return request(`/products/${id}`, {
      method: 'GET',
    });
  },
  create(token, payload) {
    return request('/admin/products', {
      method: 'POST',
      token,
      body: payload,
    });
  },
  update(token, id, payload) {
    return request(`/admin/products/${id}`, {
      method: 'PUT',
      token,
      body: payload,
    });
  },
  remove(token, id) {
    return request(`/admin/products/${id}`, {
      method: 'DELETE',
      token,
    });
  },
};

export const orderApi = {
  create(token, payload) {
    return request('/orders', {
      method: 'POST',
      token,
      body: payload,
    });
  },
  getAll(token) {
    return request('/orders', {
      method: 'GET',
      token,
    });
  },
  adminGetAll(token) {
    return request('/orders/admin/all', {
      method: 'GET',
      token,
    });
  },
  adminUpdateStatus(token, id, payload) {
    return request(`/orders/admin/${id}/status`, {
      method: 'PATCH',
      token,
      body: payload,
    });
  },
};
