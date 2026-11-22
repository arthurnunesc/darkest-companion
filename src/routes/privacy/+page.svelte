<svelte:head>
  <title>Privacy notice | Darkest Companion</title>
</svelte:head>

<main class="mx-auto max-w-3xl p-6 text-[var(--dd-ink)]">
  <p class="mb-4"><a class="underline" href="{base}/">Back to expedition planner</a></p>
  <h1 class="mb-4 text-2xl">Privacy notice</h1>
  <p class="mb-4">The site uses browser storage to remember your theme. It also loads fonts from Google Fonts, which receives a request from your browser.</p>
  <p class="mb-4">Optional audience measurement is disabled unless the site owner configures it at build time. If enabled, this site uses PostHog to count visits, selected filter and share actions, and whether visitors reach the Bosses and Curios sections by shortcut or otherwise. It does not send scroll positions.</p>
  <p class="mb-4">The planned configuration does not use browser storage for analytics or create person profiles. It sends the fixed page address, selected predefined event values, the site hostname, and the browser’s user-agent string, not search text or shared URL parameters. PostHog uses the hostname, user agent, connection IP address, and date to estimate daily visitors without using cookies. The site sends no HTTP referrer to other sites.</p>
  <p class="mb-4">The retention period depends on the PostHog project settings and has not yet been confirmed. The owner must confirm and publish it before enabling analytics. Consent requirements and the deployed configuration must also be reviewed before activation.</p>
  <p>For privacy questions, contact the owner through <a class="underline" href="https://github.com/arthurnunesc/darkest-companion/issues">the project's GitHub issues</a>. Do not post sensitive personal information in a public issue.</p>
</main>
<script lang="ts">
  import { base } from '$app/paths';
</script>
