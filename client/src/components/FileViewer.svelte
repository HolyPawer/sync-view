<script lang="ts">
  import { onMount } from 'svelte';
  import { getFile } from '../lib/api';

  export let fileName: string | null = null;
  let error: string | null = null;
  let isLoading = false;
  let videoUrl: string | null = null;

  $: if (fileName) {
    loadFile(fileName);
  } else {
    videoUrl = null;
  }

  async function loadFile(name: string) {
    try {
      isLoading = true;
      error = null;
      const blob = await getFile(name);
      videoUrl = URL.createObjectURL(blob);
    } catch (err) {
      error = err instanceof Error ? err.message : 'Ошибка при загрузке файла';
      videoUrl = null;
    } finally {
      isLoading = false;
    }
  }

  onMount(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  });
</script>

<div class="file-viewer">
  <h2>Просмотр файла</h2>

  {#if error}
    <div class="error">
      {error}
    </div>
  {/if}

  {#if isLoading}
    <div class="loading">Загрузка...</div>
  {:else if !fileName}
    <div class="empty">Выберите файл для просмотра</div>
  {:else if videoUrl}
    <div class="video-container">
      <video controls>
        <source src={videoUrl} type="video/mp4">
        Ваш браузер не поддерживает воспроизведение видео.
      </video>
    </div>
  {/if}
</div>

<style>
  .file-viewer {
    border: 1px solid var(--secondary-color);
    border-radius: 4px;
    padding: 1rem;
    height: 100%;
    display: flex;
    flex-direction: column;
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
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .video-container {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #000;
    border-radius: 4px;
    overflow: hidden;
  }

  video {
    max-width: 100%;
    max-height: 100%;
  }
</style> 