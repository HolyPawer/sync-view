import { Router } from 'express';
import { FileController } from '../controllers/fileController';

export function createFileRouter(fileController: FileController): Router {
  const router = Router();

  router.get('/', fileController.listFiles);
  router.get('/:fileName', fileController.getFile);
  router.put('/:fileName', fileController.updateFile);
  router.delete('/:fileName', fileController.deleteFile);

  return router;
} 