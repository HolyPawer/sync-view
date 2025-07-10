<script lang="ts">
  import { files } from '../stores/files';
  import Button from './Button.svelte';

  let fileInput: HTMLInputElement;
  let isDragging = false;
  let isUploading = false;

  const handleFileSelect = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      await uploadFiles(input.files);
      input.value = ''; // Сбрасываем input после загрузки
    }
  };

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    isDragging = true;
  };

  const handleDragLeave = () => {
    isDragging = false;
  };

  const handleDrop = async (event: DragEvent) => {
    event.preventDefault();
    isDragging = false;

    if (event.dataTransfer?.files.length) {
      await uploadFiles(event.dataTransfer.files);
    }
  };

  const uploadFiles = async (fileList: FileList) => {
    isUploading = true;
    try {
      for (const file of fileList) {
        await files.uploadFile(file);
      }
    } finally {
      isUploading = false;
    }
  };

  const openFileDialog = () => {
    fileInput.click();
  };
</script>

<div
  class="upload-zone"
  class:dragging={isDragging}
  on:dragover={handleDragOver}
  on:dragleave={handleDragLeave}
  on:drop={handleDrop}
>
  <input
    type="file"
    bind:this={fileInput}
    on:change={handleFileSelect}
    multiple
    hidden
  />

  <div class="upload-content">
    {#if isUploading}
      <div class="uploading">
        Загрузка...
      </div>
    {:else}
      <div class="upload-message">
        <span>Перетащите файлы сюда или</span>
        <Button on:click={openFileDialog}>Выберите файлы</Button>
      </div>
    {/if}
  </div>
</div>

<style>
  .upload-zone {
    padding: 2rem;
    border: 2px dashed var(--border-color);
    border-radius: 0.5rem;
    background: var(--surface-1);
    transition: all 0.2s;
  }

  .upload-zone.dragging {
    border-color: var(--primary-color);
    background: var(--primary-color-light);
  }

  .upload-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    text-align: center;
  }

  .uploading {
    color: var(--text-2);
    font-style: italic;
  }

  .upload-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .upload-message span {
    color: var(--text-2);
  }
</style> 