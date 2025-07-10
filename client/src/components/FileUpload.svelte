<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Button from './Button.svelte';
  import { uploadFile } from '../lib/api';

  const dispatch = createEventDispatcher();
  let fileName: string = '';
  let file: File | null = null;
  let error: string | null = null;
  let isLoading: boolean = false;
  let uploadProgress: number = 0;

  async function handleSubmit() {
    if (!fileName || !file) {
      error = 'Выберите файл для загрузки';
      return;
    }

    isLoading = true;
    error = null;
    uploadProgress = 0;

    try {
      await uploadFile(fileName, file);
      fileName = '';
      file = null;
      uploadProgress = 100;
      dispatch('upload', { success: true });
    } catch (err) {
      error = err instanceof Error ? err.message : 'Ошибка при загрузке файла';
      dispatch('upload', { success: false });
    } finally {
      isLoading = false;
    }
  }

  function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const selectedFile = input.files?.[0];
    
    if (selectedFile) {
      fileName = selectedFile.name;
      file = selectedFile;
      error = null;
    }
  }
</script>

<div class="upload-form">
  <h2>Загрузить файл</h2>
  
  {#if error}
    <div class="error">
      {error}
    </div>
  {/if}

  <div class="form-group">
    <label>
      Выберите файл:
      <input 
        type="file"
        on:change={handleFileSelect}
        disabled={isLoading}
      />
    </label>
  </div>

  <div class="form-group">
    <label>
      Имя файла:
      <input 
        type="text"
        bind:value={fileName}
        placeholder="Введите имя файла"
        disabled={isLoading}
      />
    </label>
  </div>

  {#if isLoading}
    <div class="progress">
      <div class="progress-bar" style="width: {uploadProgress}%">
        {uploadProgress}%
      </div>
    </div>
  {/if}

  <Button
    type="primary"
    onClick={handleSubmit}
    disabled={isLoading}
  >
    {isLoading ? 'Загрузка...' : 'Загрузить'}
  </Button>
</div>

<style>
  .upload-form {
    border: 1px solid var(--secondary-color);
    border-radius: 4px;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #666;
  }

  input[type="text"] {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--secondary-color);
    border-radius: 4px;
    font-family: inherit;
  }

  .error {
    color: var(--error-color);
    margin-bottom: 1rem;
    padding: 0.5rem;
    border: 1px solid var(--error-color);
    border-radius: 4px;
    background-color: #fee2e2;
  }

  input[type="file"] {
    margin-bottom: 0.5rem;
  }

  .progress {
    margin-bottom: 1rem;
    background-color: var(--secondary-color);
    border-radius: 4px;
    overflow: hidden;
  }

  .progress-bar {
    height: 20px;
    background-color: var(--primary-color);
    color: white;
    text-align: center;
    line-height: 20px;
    transition: width 0.3s ease;
  }
</style> 