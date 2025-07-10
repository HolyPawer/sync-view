import { Request, Response } from 'express';
import { FileService } from '../services/fileService';

export class FileController {
  constructor(private fileService: FileService) {}

  listFiles = async (_req: Request, res: Response) => {
    try {
      const files = await this.fileService.listFiles();
      res.json(files);
    } catch (error) {
      res.status(500).json({ error: 'Failed to list files' });
    }
  };

  getFile = async (req: Request, res: Response) => {
    try {
      const { fileName } = req.params;
      const content = await this.fileService.readFile(fileName);
      res.json({ content });
    } catch (error) {
      res.status(404).json({ error: `File ${req.params.fileName} not found` });
    }
  };

  updateFile = async (req: Request, res: Response) => {
    try {
      const { fileName } = req.params;
      const { content } = req.body;

      if (typeof content !== 'string') {
        return res.status(400).json({ error: 'Content must be a string' });
      }

      await this.fileService.writeFile(fileName, content);
      res.json({ message: 'File updated successfully' });
    } catch (error) {
      res.status(500).json({ error: `Failed to update file ${req.params.fileName}` });
    }
  };

  deleteFile = async (req: Request, res: Response) => {
    try {
      const { fileName } = req.params;
      await this.fileService.deleteFile(fileName);
      res.json({ message: 'File deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: `Failed to delete file ${req.params.fileName}` });
    }
  };
} 