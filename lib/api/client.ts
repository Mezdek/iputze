import { ApiError } from '@/types';

async function handleResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    if (response.status === 204 || response.status === 205)
      return undefined as T;
    return response.json() as T;
  }

  throw await ApiError.fromResponse(response);
}

const API_BASE_ROUTE = '/api';
function route(url: string, base?: string): string {
  const baseUrl = base ?? API_BASE_ROUTE;
  return baseUrl + url;
}

async function get<T>(url: string) {
  const response = await fetch(route(url), { credentials: 'include' });
  return handleResponse<T>(response);
}

async function post<T>(url: string, data?: unknown) {
  const response = await fetch(route(url), {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<T>(response);
}

async function patch<T>(url: string, data?: unknown) {
  const response = await fetch(route(url), {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<T>(response);
}

async function _delete<T>(url: string) {
  const response = await fetch(route(url), {
    method: 'DELETE',
    credentials: 'include',
  });
  return handleResponse<T>(response);
}

export const api = { get, post, patch, delete: _delete };
