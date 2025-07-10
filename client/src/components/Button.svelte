<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'danger' = 'primary';
  export let disabled = false;
</script>

<button 
  class={variant} 
  {disabled} 
  on:click
>
  <slot />
</button>

<style>
  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .primary {
    background: var(--primary-color);
    color: white;
  }

  .primary:hover:not(:disabled) {
    background: var(--primary-color-dark);
  }

  .secondary {
    background: var(--surface-2);
    color: var(--text-1);
  }

  .secondary:hover:not(:disabled) {
    background: var(--surface-3);
  }

  .danger {
    background: var(--error-color);
    color: white;
  }

  .danger:hover:not(:disabled) {
    background: var(--error-color-dark);
  }
</style> 