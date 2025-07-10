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
      const file = await this.fileService.readFileBuffer(fileName);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.send(file);
    } catch (error) {
      res.status(404).json({ error: `File ${req.params.fileName} not found` });
    }
  };

  updateFile = async (req: Request, res: Response) => {
    try {
      const { fileName } = req.params;
      const content = req.body;

      if (!content) {
        return res.status(400).json({ error: 'File content is required' });
      }

      await this.fileService.writeFileBuffer(fileName, content);
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

  uploadFile = async (req: Request, res: Response) => {
    try {
      const { fileName } = req.params;
      const content = req.body;

      if (!content) {
        return res.status(400).json({ error: 'File content is required' });
      }

      await this.fileService.writeFileBuffer(fileName, content);
      res.status(201).json({ message: 'File uploaded successfully' });
    } catch (error) {
      res.status(500).json({ error: `Failed to upload file ${req.params.fileName}` });
    }
  };
} 