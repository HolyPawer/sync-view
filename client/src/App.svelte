<script lang="ts">
  import { Router, Link, Route } from "svelte-routing";
  import Home from "./routes/Home.svelte";
  import About from "./routes/About.svelte";
</script>

<Router>
  <nav>
    <Link to="/">Главная</Link>
    <Link to="/about">О проекте</Link>
  </nav>

  <main>
    <Route path="/" component={Home} />
    <Route path="/about" component={About} />
  </main>
</Router>

<style>
  nav {
    padding: 1rem;
    background-color: #f8f9fa;
  }

  nav :global(a) {
    margin-right: 1rem;
    color: #333;
    text-decoration: none;
  }

  nav :global(a:hover) {
    text-decoration: underline;
  }

  main {
    padding: 2rem;
  }
</style> 