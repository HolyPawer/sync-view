import fs from 'fs/promises';
import path from 'path';

export class FileService {
  constructor(private basePath: string) {}

  async listFiles(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.basePath);
      return files.filter(file => !file.startsWith('.'));
    } catch (error) {
      console.error('Failed to list files:', error);
      throw new Error('Failed to list files');
    }
  }

  async readFileBuffer(fileName: string): Promise<Buffer> {
    try {
      const filePath = path.join(this.basePath, fileName);
      return await fs.readFile(filePath);
    } catch (error) {
      console.error(`Failed to read file ${fileName}:`, error);
      throw new Error(`Failed to read file ${fileName}`);
    }
  }

  async writeFileBuffer(fileName: string, content: Buffer): Promise<void> {
    try {
      const filePath = path.join(this.basePath, fileName);
      await fs.writeFile(filePath, content);
    } catch (error) {
      console.error(`Failed to write file ${fileName}:`, error);
      throw new Error(`Failed to write file ${fileName}`);
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      const filePath = path.join(this.basePath, fileName);
      await fs.unlink(filePath);
    } catch (error) {
      console.error(`Failed to delete file ${fileName}:`, error);
      throw new Error(`Failed to delete file ${fileName}`);
    }
  }
} 