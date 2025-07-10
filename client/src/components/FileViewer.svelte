<script lang="ts">
  export let content: string = '';
  export let fileName: string | null = null;
</script>

<div class="file-viewer">
  <div class="header">
    {#if fileName}
      <h2>{fileName}</h2>
    {:else}
      <h2>Выберите файл для просмотра</h2>
    {/if}
  </div>
  
  <div class="content">
    {#if content}
      <pre>{content}</pre>
    {:else}
      <p class="empty">Нет содержимого для отображения</p>
    {/if}
  </div>
</div>

<style>
  .file-viewer {
    border: 1px solid var(--secondary-color);
    border-radius: 4px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .header {
    padding: 1rem;
    border-bottom: 1px solid var(--secondary-color);
  }

  .content {
    padding: 1rem;
    flex-grow: 1;
    overflow: auto;
    background-color: #f8f9fa;
  }

  pre {
    margin: 0;
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: monospace;
  }

  .empty {
    color: #666;
    font-style: italic;
  }

  h2 {
    margin: 0;
  }
</style> 