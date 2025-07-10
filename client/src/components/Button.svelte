<script lang="ts">
  export let type: 'primary' | 'secondary' | 'danger' = 'primary';
  export let onClick: () => void;
  export let disabled: boolean = false;
</script>

<button
  class={type}
  on:click={onClick}
  {disabled}
>
  <slot />
</button>

<style>
  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .primary {
    background-color: #3b82f6;
    color: white;
  }

  .primary:hover:not(:disabled) {
    background-color: #2563eb;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .secondary {
    background-color: #e5e7eb;
    color: #374151;
  }

  .secondary:hover:not(:disabled) {
    background-color: #d1d5db;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .danger {
    background-color: #ef4444;
    color: white;
  }

  .danger:hover:not(:disabled) {
    background-color: #dc2626;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
</style> 