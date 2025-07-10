<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import FileList from '../components/FileList.svelte';
  import FileViewer from '../components/FileViewer.svelte';
  import { fileStore, fetchFiles, fetchFileContent } from '../stores/files';
  import { wsClient } from '../lib/websocket';

  let files: string[] = [];
  let selectedFile: string | null = null;
  let fileContent: string | null = null;
  let isLoading: boolean = false;
  let error: string | null = null;

  fileStore.subscribe(state => {
    files = state.files;
    selectedFile = state.selectedFile;
    fileContent = state.fileContent;
    isLoading = state.isLoading;
    error = state.error;
  });

  onMount(() => {
    fetchFiles();
    wsClient.connect();
  });

  onDestroy(() => {
    wsClient.disconnect();
  });

  function handleFileSelect({ detail }: CustomEvent<{ file: string }>) {
    fetchFileContent(detail.file);
  }
</script>

<main>
  <h1>Sync View</h1>
  
  {#if error}
    <div class="error">
      {error}
    </div>
  {/if}

  {#if isLoading}
    <div class="loading">
      Загрузка...
    </div>
  {/if}

  <div class="container">
    <div class="files">
      <FileList 
        {files}
        {selectedFile}
        on:select={handleFileSelect}
      />
    </div>
    <div class="viewer">
      <FileViewer 
        fileName={selectedFile}
        content={fileContent || ''}
      />
    </div>
  </div>
</main>

<style>
  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .container {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2rem;
    margin-top: 2rem;
  }

  .error {
    background-color: var(--error-color);
    color: white;
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
  }

  .loading {
    text-align: center;
    padding: 1rem;
    color: #666;
  }

  .viewer {
    height: 600px;
  }
</style> 