<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';

  let { children } = $props();

  onMount(() => {
    const saved = localStorage.getItem('dd-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved ?? 'dark';
    document.documentElement.dataset.theme = theme;
  });
</script>

<svelte:head>
  <script>
    (function () {
      const saved = localStorage.getItem('dd-theme');
      const theme = saved ?? 'dark';
      document.documentElement.dataset.theme = theme;
    })();
  </script>
</svelte:head>

{@render children()}
