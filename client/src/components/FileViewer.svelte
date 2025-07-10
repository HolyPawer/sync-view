<script lang="ts">
  import type { FileInfo } from '../types/files';

  export let file: FileInfo | null = null;

  $: fileUrl = file ? `http://localhost:3000/files/${encodeURIComponent(file.name)}` : null;
  $: isVideo = file?.type.startsWith('video/');
  $: isImage = file?.type.startsWith('image/');
  $: isText = file?.type.startsWith('text/') || file?.type === 'application/json';

  let content: string | null = null;

  $: if (file && isText) {
    fetch(fileUrl!)
      .then(response => response.text())
      .then(text => {
        content = text;
      })
      .catch(error => {
        console.error('Failed to load text content:', error);
        content = null;
      });
  } else {
    content = null;
  }
</script>

<div class="viewer">
  {#if !file}
    <div class="placeholder">
      <p>Выберите файл для просмотра</p>
    </div>
  {:else if isVideo}
    <video src={fileUrl} controls>
      <track kind="captions">
      Ваш браузер не поддерживает видео
    </video>
  {:else if isImage}
    <img src={fileUrl} alt={file.name} />
  {:else if isText && content !== null}
    <pre>{content}</pre>
  {:else}
    <div class="unsupported">
      <p>Предпросмотр не поддерживается для этого типа файлов</p>
      <p>Тип файла: {file.type}</p>
      <a href={fileUrl} download={file.name}>Скачать файл</a>
    </div>
  {/if}
</div>

<style>
  .viewer {
    height: 100%;
    min-height: 400px;
    background: var(--surface-1);
    border-radius: 0.5rem;
    box-shadow: var(--shadow-1);
    overflow: hidden;
  }

  .placeholder,
  .unsupported {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: var(--text-2);
    text-align: center;
    padding: 2rem;
  }

  .unsupported a {
    color: var(--primary-color);
    text-decoration: none;
    margin-top: 1rem;
  }

  .unsupported a:hover {
    text-decoration: underline;
  }

  video,
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  pre {
    margin: 0;
    padding: 1rem;
    overflow: auto;
    font-family: monospace;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
</style> 