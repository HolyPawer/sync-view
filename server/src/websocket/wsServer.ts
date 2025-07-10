import { Server } from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import type { WebSocketClient } from '../types';
import { FileWatcherService } from '../services/fileWatcher';

export class WsServer {
  private wss: WebSocketServer;
  private pingInterval: NodeJS.Timeout;

  constructor(
    server: Server,
    private fileWatcher: FileWatcherService,
    private watchPath: string
  ) {
    this.wss = new WebSocketServer({ server });
    this.setupWebSocketServer();
    this.pingInterval = this.startPingInterval();
  }

  private setupWebSocketServer() {
    this.wss.on('connection', (ws: WebSocketClient) => {
      console.log('New WebSocket connection');
      
      ws.isAlive = true;
      ws.on('pong', () => {
        ws.isAlive = true;
      });

      this.fileWatcher.addClient(this.watchPath, ws);

      ws.on('close', () => {
        this.fileWatcher.removeClient(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.fileWatcher.removeClient(ws);
      });
    });
  }

  private startPingInterval() {
    return setInterval(() => {
      this.wss.clients.forEach((ws: WebSocketClient) => {
        if (ws.isAlive === false) {
          this.fileWatcher.removeClient(ws);
          return ws.terminate();
        }

        ws.isAlive = false;
        ws.ping();
      });
    }, 30000);
  }

  close() {
    clearInterval(this.pingInterval);
    this.wss.close();
  }
} 