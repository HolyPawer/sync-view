import App from './App.svelte';
import './styles/global.css';

const app = new App({
  target: document.getElementById('app') as HTMLElement,
  props: {
    url: window.location.pathname
  }
});

export default app; 