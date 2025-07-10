export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Session {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
  status: number;
}

export type FileChangeEvent = {
  type: 'change';
  fileName: string;
  content: string;
};

export type FileDeleteEvent = {
  type: 'delete';
  fileName: string;
};

export type FileCreateEvent = {
  type: 'create';
  fileName: string;
  content: string;
};

export type FileEvent = FileChangeEvent | FileDeleteEvent | FileCreateEvent; 