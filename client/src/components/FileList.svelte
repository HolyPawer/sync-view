<script lang="ts">
  import { onMount } from 'svelte';
  import { files } from '../stores/files';
  import { wsStatus } from '../stores/websocket';
  import type { FileInfo } from '../types/files';
  import Button from './Button.svelte';

  let selectedFile: FileInfo | null = null;

  const formatSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const handleDelete = async (file: FileInfo) => {
    if (confirm(`Удалить файл ${file.name}?`)) {
      await files.deleteFile(file.name);
    }
  };

  const handleSelect = (file: FileInfo) => {
    selectedFile = file;
  };

  onMount(() => {
    wsStatus.connect();
  });
</script>

<div class="file-list">
  <div class="header">
    <h2>Файлы</h2>
    <div class="connection-status" class:connected={$wsStatus === 'connected'}>
      {$wsStatus === 'connected' ? 'Подключено' : 'Отключено'}
    </div>
  </div>

  {#if $files.length === 0}
    <p class="no-files">Нет файлов</p>
  {:else}
    <div class="files">
      {#each $files as file (file.name)}
        <div 
          class="file-item" 
          class:selected={selectedFile?.name === file.name}
          on:click={() => handleSelect(file)}
        >
          <div class="file-info">
            <span class="file-name">{file.name}</span>
            <span class="file-size">{formatSize(file.size)}</span>
          </div>
          <Button variant="danger" on:click={() => handleDelete(file)}>Удалить</Button>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .file-list {
    padding: 1rem;
    background: var(--surface-1);
    border-radius: 0.5rem;
    box-shadow: var(--shadow-1);
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .connection-status {
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    background: var(--error-color);
    color: white;
    font-size: 0.875rem;
  }

  .connection-status.connected {
    background: var(--success-color);
  }

  .no-files {
    text-align: center;
    color: var(--text-2);
    font-style: italic;
  }

  .files {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    background: var(--surface-2);
    border-radius: 0.25rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .file-item:hover {
    background: var(--surface-3);
  }

  .file-item.selected {
    background: var(--primary-color-light);
  }

  .file-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .file-name {
    font-weight: 500;
  }

  .file-size {
    font-size: 0.875rem;
    color: var(--text-2);
  }
</style> 