import { writable } from 'svelte/store';
import { fetchApi } from '../lib/api';

interface FileState {
  files: string[];
  selectedFile: string | null;
  fileContent: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: FileState = {
  files: [],
  selectedFile: null,
  fileContent: null,
  isLoading: false,
  error: null
};

export const fileStore = writable<FileState>(initialState);

export const fetchFiles = async () => {
  fileStore.update(state => ({ ...state, isLoading: true, error: null }));
  
  try {
    const response = await fetchApi<string[]>('/api/files');
    
    if (response.error) {
      throw new Error(response.error);
    }

    fileStore.update(state => ({
      ...state,
      files: response.data,
      isLoading: false
    }));
  } catch (error) {
    fileStore.update(state => ({
      ...state,
      error: error instanceof Error ? error.message : 'Failed to fetch files',
      isLoading: false
    }));
  }
};

export const fetchFileContent = async (fileName: string) => {
  fileStore.update(state => ({ ...state, isLoading: true, error: null }));
  
  try {
    const response = await fetchApi<string>(`/api/files/${fileName}`);
    
    if (response.error) {
      throw new Error(response.error);
    }

    fileStore.update(state => ({
      ...state,
      selectedFile: fileName,
      fileContent: response.data,
      isLoading: false
    }));
  } catch (error) {
    fileStore.update(state => ({
      ...state,
      error: error instanceof Error ? error.message : 'Failed to fetch file content',
      isLoading: false
    }));
  }
}; 