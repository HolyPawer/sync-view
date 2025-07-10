import type { ApiResponse } from '../types';

const API_URL = 'http://localhost:3000/api';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  try {
    const url = endpoint.startsWith('/') ? `${API_URL}${endpoint}` : `${API_URL}/${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
      throw new Error(error.error || 'API request failed');
    }

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      return await response.json();
    }

    return await response.blob();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export async function listFiles() {
  return fetchApi('files');
}

export async function getFile(fileName: string) {
  return fetchApi(`files/${fileName}`);
}

export async function uploadFile(fileName: string, file: File) {
  return fetchApi(`files/${fileName}`, {
    method: 'POST',
    body: file,
    headers: {
      'Content-Type': 'application/octet-stream'
    }
  });
}

export async function deleteFile(fileName: string) {
  return fetchApi(`files/${fileName}`, {
    method: 'DELETE'
  });
} 