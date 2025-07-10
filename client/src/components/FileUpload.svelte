<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Button from './Button.svelte';
  import { fetchApi } from '../lib/api';

  const dispatch = createEventDispatcher();
  let fileName: string = '';
  let fileContent: string = '';
  let error: string | null = null;
  let isLoading: boolean = false;

  async function handleSubmit() {
    if (!fileName || !fileContent) {
      error = 'Имя файла и содержимое обязательны';
      return;
    }

    isLoading = true;
    error = null;

    try {
      const response = await fetchApi(`/api/files/${fileName}`, {
        method: 'POST',
        body: JSON.stringify({ content: fileContent }),
      });

      if (response.error) {
        throw new Error(response.error);
      }

      fileName = '';
      fileContent = '';
      dispatch('upload');
    } catch (err) {
      error = err instanceof Error ? err.message : 'Ошибка при загрузке файла';
    } finally {
      isLoading = false;
    }
  }

  function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      fileName = file.name;
      const reader = new FileReader();
      
      reader.onload = (e) => {
        fileContent = e.target?.result as string;
      };
      
      reader.readAsText(file);
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

  <div class="form-group">
    <label>
      Содержимое:
      <textarea
        bind:value={fileContent}
        placeholder="Введите содержимое файла"
        rows="5"
        disabled={isLoading}
      ></textarea>
    </label>
  </div>

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

  input[type="text"],
  textarea {
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

  textarea {
    resize: vertical;
  }
</style> 