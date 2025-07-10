<script lang="ts">
  import { onMount } from 'svelte';
  import { listFiles, deleteFile } from '../lib/api';
  import Button from './Button.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  let files: string[] = [];
  let error: string | null = null;
  let isLoading = true;
  let selectedFile: string | null = null;

  export async function loadFiles() {
    try {
      isLoading = true;
      error = null;
      files = await listFiles();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Ошибка при загрузке списка файлов';
      files = [];
    } finally {
      isLoading = false;
    }
  }

  async function handleDelete(fileName: string) {
    try {
      await deleteFile(fileName);
      await loadFiles();
      if (selectedFile === fileName) {
        selectedFile = null;
        dispatch('select', { file: null });
      }
    } catch (err) {
      error = err instanceof Error ? err.message : 'Ошибка при удалении файла';
    }
  }

  function handleSelect(fileName: string) {
    selectedFile = fileName;
    dispatch('select', { file: fileName });
  }

  onMount(loadFiles);
</script>

<div class="file-list">
  <h2>Файлы</h2>

  {#if error}
    <div class="error">
      {error}
    </div>
  {/if}

  {#if isLoading}
    <div class="loading">Загрузка...</div>
  {:else if files.length === 0}
    <div class="empty">Нет доступных файлов</div>
  {:else}
    <ul>
      {#each files as fileName}
        <li class:selected={selectedFile === fileName}>
          <button 
            class="file-button" 
            on:click={() => handleSelect(fileName)}
          >
            {fileName}
          </button>
          <div class="actions">
            <Button type="danger" onClick={() => handleDelete(fileName)}>
              Удалить
            </Button>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .file-list {
    border: 1px solid var(--secondary-color);
    border-radius: 4px;
    padding: 1rem;
  }

  .error {
    color: var(--error-color);
    margin-bottom: 1rem;
    padding: 0.5rem;
    border: 1px solid var(--error-color);
    border-radius: 4px;
    background-color: #fee2e2;
  }

  .loading,
  .empty {
    color: #666;
    text-align: center;
    padding: 1rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    border-bottom: 1px solid var(--secondary-color);
    transition: background-color 0.2s ease;
  }

  li:last-child {
    border-bottom: none;
  }

  li.selected {
    background-color: var(--secondary-color);
  }

  .file-button {
    background: none;
    border: none;
    padding: 0.5rem;
    margin: -0.5rem;
    font-size: inherit;
    color: var(--text-color);
    cursor: pointer;
    flex-grow: 1;
    text-align: left;
    transition: color 0.2s ease;
  }

  .file-button:hover {
    color: var(--primary-color);
  }

  .actions {
    display: flex;
    gap: 0.5rem;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  li:hover .actions {
    opacity: 1;
  }
</style> 