import { WebSocket } from 'ws';

export interface FileEvent {
  type: 'change' | 'create' | 'delete';
  fileName: string;
  content?: string;
}

export interface WebSocketClient extends WebSocket {
  isAlive?: boolean;
}

export interface FileWatcher {
  path: string;
  clients: Set<WebSocketClient>;
  close: () => void;
} 