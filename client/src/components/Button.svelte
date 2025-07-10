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
    cursor: pointer;
    transition: all 0.2s ease;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .primary {
    background-color: var(--primary-color);
    color: white;
  }

  .primary:hover:not(:disabled) {
    background-color: var(--primary-color-dark);
    transform: translateY(-1px);
  }

  .secondary {
    background-color: var(--secondary-color);
    color: var(--text-color);
  }

  .secondary:hover:not(:disabled) {
    background-color: var(--secondary-color-dark);
    transform: translateY(-1px);
  }

  .danger {
    background-color: #ef4444;
    color: white;
  }

  .danger:hover:not(:disabled) {
    background-color: #dc2626;
    transform: translateY(-1px);
  }
</style> 