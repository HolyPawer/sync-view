import type { FileEvent } from '../types';
import { fileStore } from '../stores/files';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectTimeout: number = 1000;
  private maxReconnectTimeout: number = 30000;

  connect() {
    this.ws = new WebSocket(WS_URL);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectTimeout = 1000;
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected, trying to reconnect...');
      this.reconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onmessage = (event) => {
      try {
        const fileEvent: FileEvent = JSON.parse(event.data);
        this.handleFileEvent(fileEvent);
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };
  }

  private reconnect() {
    setTimeout(() => {
      this.connect();
      this.reconnectTimeout = Math.min(
        this.reconnectTimeout * 2,
        this.maxReconnectTimeout
      );
    }, this.reconnectTimeout);
  }

  private handleFileEvent(event: FileEvent) {
    fileStore.update(state => {
      switch (event.type) {
        case 'change':
          if (state.selectedFile === event.fileName) {
            return { ...state, fileContent: event.content };
          }
          return state;

        case 'delete':
          return {
            ...state,
            files: state.files.filter(f => f !== event.fileName),
            fileContent: state.selectedFile === event.fileName ? null : state.fileContent,
            selectedFile: state.selectedFile === event.fileName ? null : state.selectedFile
          };

        case 'create':
          return {
            ...state,
            files: [...state.files, event.fileName].sort()
          };

        default:
          return state;
      }
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const wsClient = new WebSocketClient(); 