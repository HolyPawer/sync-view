import { writable } from 'svelte/store';

interface AppState {
  isLoading: boolean;
  error: string | null;
}

const initialState: AppState = {
  isLoading: false,
  error: null
};

export const appStore = writable<AppState>(initialState);

export const setLoading = (loading: boolean) => {
  appStore.update(state => ({ ...state, isLoading: loading }));
};

export const setError = (error: string | null) => {
  appStore.update(state => ({ ...state, error }));
}; 