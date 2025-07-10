import { writable } from 'svelte/store';

type FileEvent = {
  type: 'add' | 'change' | 'unlink';
  file: string;
};

type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

function createWebSocketStore() {
  const { subscribe, set, update } = writable<WebSocketStatus>('disconnected');
  let ws: WebSocket | null = null;
  let reconnectTimeout: NodeJS.Timeout | null = null;

  const connect = () => {
    if (ws?.readyState === WebSocket.OPEN) return;

    const wsUrl = `ws://${window.location.hostname}:3000`;
    ws = new WebSocket(wsUrl);

    ws.addEventListener('open', () => {
      set('connected');
      console.log('WebSocket connected');
    });

    ws.addEventListener('close', () => {
      set('disconnected');
      console.log('WebSocket disconnected');
      scheduleReconnect();
    });

    ws.addEventListener('error', (error) => {
      set('error');
      console.error('WebSocket error:', error);
      scheduleReconnect();
    });

    set('connecting');
  };

  const scheduleReconnect = () => {
    if (reconnectTimeout) clearTimeout(reconnectTimeout);
    reconnectTimeout = setTimeout(() => {
      connect();
    }, 5000);
  };

  const disconnect = () => {
    if (reconnectTimeout) clearTimeout(reconnectTimeout);
    if (ws) {
      ws.close();
      ws = null;
    }
    set('disconnected');
  };

  return {
    subscribe,
    connect,
    disconnect
  };
}

export const wsStatus = createWebSocketStore(); 