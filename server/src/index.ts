import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { config } from './config';
import { FileService } from './services/fileService';
import { FileController } from './controllers/fileController';
import { FileWatcherService } from './services/fileWatcher';
import { WsServer } from './websocket/wsServer';
import { createFileRouter } from './routes/fileRoutes';
import fs from 'fs/promises';

async function bootstrap() {
  // Создаем директорию для файлов, если она не существует
  try {
    await fs.access(config.watchPath);
  } catch {
    await fs.mkdir(config.watchPath, { recursive: true });
  }

  const app = express();
  const httpServer = createServer(app);

  // Middleware
  app.use(cors({ origin: config.corsOrigin }));
  app.use(express.json());

  // Сервисы
  const fileService = new FileService(config.watchPath);
  const fileWatcher = new FileWatcherService();
  
  // Контроллеры
  const fileController = new FileController(fileService);

  // Маршруты
  app.use('/api/files', createFileRouter(fileController));

  // WebSocket
  const wsServer = new WsServer(httpServer, fileWatcher, config.watchPath);
  await fileWatcher.watchDirectory(config.watchPath);

  // Запуск сервера
  httpServer.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
    console.log(`Watching directory: ${config.watchPath}`);
  });

  // Обработка завершения работы
  const cleanup = () => {
    console.log('Shutting down server...');
    wsServer.close();
    httpServer.close();
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
}

bootstrap().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
}); 