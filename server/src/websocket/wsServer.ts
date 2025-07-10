import { Server } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { FileWatcherService } from '../services/fileWatcher';

type FileEvent = {
  type: 'add' | 'change' | 'unlink';
  file: string;
};

export class WsServer {
  private wss: WebSocketServer;
  private clients: Set<WebSocket> = new Set();

  constructor(
    server: Server, 
    private fileWatcher: FileWatcherService,
    private watchPath: string
  ) {
    this.wss = new WebSocketServer({ server });
    this.setupWebSocket();
    this.setupFileWatcher();
  }

  private setupWebSocket() {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('Client connected');
      this.clients.add(ws);

      ws.on('close', () => {
        console.log('Client disconnected');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });
    });
  }

  private setupFileWatcher() {
    this.fileWatcher.on('add', (file: string) => {
      this.broadcast({
        type: 'add',
        file: this.getRelativePath(file)
      });
    });

    this.fileWatcher.on('change', (file: string) => {
      this.broadcast({
        type: 'change',
        file: this.getRelativePath(file)
      });
    });

    this.fileWatcher.on('unlink', (file: string) => {
      this.broadcast({
        type: 'unlink',
        file: this.getRelativePath(file)
      });
    });
  }

  private broadcast(event: FileEvent) {
    const message = JSON.stringify(event);
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  private getRelativePath(file: string): string {
    return file.replace(this.watchPath, '').replace(/^[\\/]+/, '');
  }

  public close() {
    this.wss.close();
  }
} 