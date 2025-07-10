import * as chokidar from 'chokidar';
import { EventEmitter } from 'events';

export class FileWatcherService extends EventEmitter {
  private watcher: chokidar.FSWatcher | null = null;

  async watchDirectory(path: string) {
    if (this.watcher) {
      await this.watcher.close();
    }

    this.watcher = chokidar.watch(path, {
      ignored: /(^|[\/\\])\../, // игнорируем скрытые файлы
      persistent: true,
      ignoreInitial: false,
    });

    this.watcher
      .on('add', (file: string) => {
        console.log(`File ${file} has been added`);
        this.emit('add', file);
      })
      .on('change', (file: string) => {
        console.log(`File ${file} has been changed`);
        this.emit('change', file);
      })
      .on('unlink', (file: string) => {
        console.log(`File ${file} has been removed`);
        this.emit('unlink', file);
      })
      .on('error', (error: unknown) => {
        console.error('Error happened', error);
        this.emit('error', error);
      });

    return this.watcher;
  }

  async close() {
    if (this.watcher) {
      await this.watcher.close();
      this.watcher = null;
    }
  }
} 