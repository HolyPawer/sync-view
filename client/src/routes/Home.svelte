<script lang="ts">
  import FileUpload from '../components/FileUpload.svelte';
  import FileList from '../components/FileList.svelte';
  import FileViewer from '../components/FileViewer.svelte';
  import { onMount } from 'svelte';

  let selectedFile: string | null = null;

  function handleFileSelect(event: CustomEvent<{ file: string }>) {
    selectedFile = event.detail.file;
  }

  function handleUpload() {
    selectedFile = null;
  }
</script>

<main>
  <FileUpload on:upload={handleUpload} />
  
  <div class="content">
    <FileList on:select={handleFileSelect} />
    
    <FileViewer fileName={selectedFile} />
  </div>
</main>

<style>
  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .content {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2rem;
    margin-top: 2rem;
  }

  @media (max-width: 768px) {
    .content {
      grid-template-columns: 1fr;
    }
  }
</style> 