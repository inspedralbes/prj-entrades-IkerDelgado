const BASE_URL = 'http://127.0.0.1:8000/api';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('auth_token');
  
  const headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...options.headers,
  });

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Error en la petició al servidor');
  }

  return data;
}
