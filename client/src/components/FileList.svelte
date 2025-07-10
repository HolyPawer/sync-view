<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Button from './Button.svelte';

  export let files: string[] = [];
  export let selectedFile: string | null = null;

  const dispatch = createEventDispatcher();

  function handleFileSelect(file: string) {
    selectedFile = file;
    dispatch('select', { file });
  }
</script>

<div class="file-list">
  <h2>Файлы</h2>
  {#if files.length === 0}
    <p class="empty">Нет доступных файлов</p>
  {:else}
    <ul>
      {#each files as file}
        <li class:selected={selectedFile === file}>
          <Button 
            type="secondary"
            onClick={() => handleFileSelect(file)}
          >
            {file}
          </Button>
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
    margin-bottom: 1rem;
  }

  h2 {
    margin-bottom: 1rem;
  }

  .empty {
    color: #666;
    font-style: italic;
  }

  ul {
    list-style: none;
  }

  li {
    margin-bottom: 0.5rem;
  }

  .selected {
    background-color: var(--secondary-color);
    border-radius: 4px;
  }
</style> 