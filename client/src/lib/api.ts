import type { ApiResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    return {
      data: data as T,
      status: response.status,
      error: !response.ok ? data.error : undefined,
    };
  } catch (error) {
    return {
      data: null as T,
      status: 500,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
} 