import type { z } from 'zod';

import { ApiError } from '@/types';

async function handleResponse<T>(
  response: Response,
  schema?: z.ZodSchema<T>
): Promise<T> {
  if (response.ok) {
    if (response.status === 204 || response.status === 205) {
      return undefined as T;
    }

    const data = await response.json();

    // Validate if schema provided
    if (schema) {
      return schema.parse(data);
    }

    return data as T;
  }

  throw await ApiError.fromResponse(response);
}

const API_VERSION = process.env['API_VERSION'] ?? 'v1';
const API_BASE_ROUTE = `/api/${API_VERSION}`;

function route(url: string, base?: string): string {
  const baseUrl = base ?? API_BASE_ROUTE;
  return baseUrl + url;
}

async function get<T>(url: string, schema?: z.ZodSchema<T>) {
  const response = await fetch(route(url), { credentials: 'include' });
  return handleResponse<T>(response, schema);
}

async function post<T>(url: string, data?: unknown, schema?: z.ZodSchema<T>) {
  const isFormData = data instanceof FormData;

  const response = await fetch(route(url), {
    method: 'POST',
    credentials: 'include',
    headers: isFormData ? {} : { 'Content-Type': 'application/json' },
    body: isFormData ? data : JSON.stringify(data),
  });
  return handleResponse<T>(response, schema);
}

async function patch<T>(url: string, data?: unknown, schema?: z.ZodSchema<T>) {
  const response = await fetch(route(url), {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handleResponse<T>(response, schema);
}

async function _delete<T>(url: string, schema?: z.ZodSchema<T>) {
  const response = await fetch(route(url), {
    method: 'DELETE',
    credentials: 'include',
  });
  return handleResponse<T>(response, schema);
}

export const api = { get, post, patch, delete: _delete };
