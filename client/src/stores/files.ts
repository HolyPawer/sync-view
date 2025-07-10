import { writable } from 'svelte/store';
import type { FileInfo } from '../types/files';

type FileEvent = {
  type: 'add' | 'change' | 'unlink';
  file: string;
};

function createFilesStore() {
  const { subscribe, set, update } = writable<FileInfo[]>([]);
  let ws: WebSocket | null = null;

  const fetchFiles = async () => {
    try {
      const response = await fetch('http://localhost:3000/files');
      const files = await response.json();
      set(files);
    } catch (error) {
      console.error('Failed to fetch files:', error);
    }
  };

  const setupWebSocket = () => {
    const wsUrl = `ws://${window.location.hostname}:3000`;
    ws = new WebSocket(wsUrl);

    ws.addEventListener('message', async (event) => {
      const fileEvent: FileEvent = JSON.parse(event.data);
      console.log('Received file event:', fileEvent);

      // Обновляем список файлов при любом событии
      await fetchFiles();
    });

    ws.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
    });
  };

  const deleteFile = async (filename: string) => {
    try {
      await fetch(`http://localhost:3000/files/${encodeURIComponent(filename)}`, {
        method: 'DELETE',
      });
      
      // Обновляем список файлов после удаления
      await fetchFiles();
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  const uploadFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      await fetch('http://localhost:3000/files', {
        method: 'POST',
        body: formData,
      });

      // Обновляем список файлов после загрузки
      await fetchFiles();
    } catch (error) {
      console.error('Failed to upload file:', error);
    }
  };

  // Инициализация
  fetchFiles();
  setupWebSocket();

  return {
    subscribe,
    fetchFiles,
    deleteFile,
    uploadFile
  };
}

export const files = createFilesStore(); 