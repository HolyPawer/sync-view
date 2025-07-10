import chokidar from 'chokidar';
import fs from 'fs/promises';
import path from 'path';
import type { FileEvent, FileWatcher, WebSocketClient } from '../types';

export class FileWatcherService {
  private watchers: Map<string, FileWatcher> = new Map();

  async watchDirectory(directoryPath: string): Promise<FileWatcher> {
    const absolutePath = path.resolve(directoryPath);
    
    if (this.watchers.has(absolutePath)) {
      return this.watchers.get(absolutePath)!;
    }

    const clients = new Set<WebSocketClient>();
    const watcher = chokidar.watch(absolutePath, {
      ignored: /(^|[\/\\])\../, // Игнорируем скрытые файлы
      persistent: true
    });

    const handleFileEvent = async (type: FileEvent['type'], filePath: string) => {
      const relativePath = path.relative(absolutePath, filePath);
      const event: FileEvent = { type, fileName: relativePath };

      if (type === 'change' || type === 'create') {
        try {
          const content = await fs.readFile(filePath, 'utf-8');
          event.content = content;
        } catch (error) {
          console.error(`Failed to read file ${filePath}:`, error);
        }
      }

      this.notifyClients(clients, event);
    };

    watcher
      .on('add', (filePath) => handleFileEvent('create', filePath))
      .on('change', (filePath) => handleFileEvent('change', filePath))
      .on('unlink', (filePath) => handleFileEvent('delete', filePath));

    const fileWatcher: FileWatcher = {
      path: absolutePath,
      clients,
      close: () => {
        watcher.close();
        this.watchers.delete(absolutePath);
      }
    };

    this.watchers.set(absolutePath, fileWatcher);
    return fileWatcher;
  }

  private notifyClients(clients: Set<WebSocketClient>, event: FileEvent) {
    const message = JSON.stringify(event);
    clients.forEach(client => {
      if (client.readyState === client.OPEN) {
        client.send(message);
      }
    });
  }

  addClient(directoryPath: string, client: WebSocketClient) {
    const watcher = this.watchers.get(path.resolve(directoryPath));
    if (watcher) {
      watcher.clients.add(client);
    }
  }

  removeClient(client: WebSocketClient) {
    this.watchers.forEach(watcher => {
      watcher.clients.delete(client);
    });
  }
} 