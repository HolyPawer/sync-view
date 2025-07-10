<script lang="ts">
  import FileList from './components/FileList.svelte';
  import FileUpload from './components/FileUpload.svelte';
  import FileViewer from './components/FileViewer.svelte';
  import { files } from './stores/files';
  import { wsStatus } from './stores/websocket';
</script>

<main>
  <header>
    <h1>Sync View</h1>
    <div class="connection-status" class:connected={$wsStatus === 'connected'}>
      {$wsStatus === 'connected' ? 'Подключено' : 'Отключено'}
    </div>
  </header>

  <div class="content">
    <aside>
      <FileUpload />
      <FileList />
    </aside>
    <FileViewer />
  </div>
</main>

<style>
  main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  h1 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-1);
  }

  .connection-status {
    padding: 0.5rem 1rem;
    border-radius: 1rem;
    background: var(--error-color);
    color: white;
    font-size: 0.875rem;
  }

  .connection-status.connected {
    background: var(--success-color);
  }

  .content {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: 2rem;
  }

  aside {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style> 