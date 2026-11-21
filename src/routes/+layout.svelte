<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { afterNavigate } from '$app/navigation';
  import { capturePage } from '$lib/analytics';
  import { base } from '$app/paths';

  afterNavigate(({ to }) => { if (to) capturePage(to.url.pathname); });

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

<footer class="p-4 text-center text-sm text-[var(--dd-muted)]"><a class="underline" href="{base}/privacy">Privacy notice</a></footer>
