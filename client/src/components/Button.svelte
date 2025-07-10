<script lang="ts">
  export let type: 'primary' | 'secondary' = 'primary';
  export let disabled: boolean = false;
  export let onClick: () => void = () => {};
</script>

<button
  class="button {type}"
  {disabled}
  on:click={onClick}
>
  <slot />
</button>

<style>
  .button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
  }

  .button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .primary {
    background-color: #3b82f6;
    color: white;
  }

  .primary:hover:not(:disabled) {
    background-color: #2563eb;
  }

  .secondary {
    background-color: #e5e7eb;
    color: #374151;
  }

  .secondary:hover:not(:disabled) {
    background-color: #d1d5db;
  }
</style> 