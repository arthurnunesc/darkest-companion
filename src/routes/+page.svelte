<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { base } from '$app/paths';
  import { getCuriosByItem, getCuriosForLocation } from '$lib/data/curios';
  import { locations } from '$lib/data/locations';
  import { getTipsForLocation } from '$lib/data/tips';
  import type { Curio, CurioInteraction } from '$lib/data/types';
  import { getProvisionRecommendation } from '$lib/game/provisions';
  import { curioViews, updateParam } from '$lib/game/url-state';

  let { data } = $props();
  let shareStatus = $state('');

  const expedition = $derived(data.expedition);
  const recommendation = $derived(
    getProvisionRecommendation(expedition.location.id, expedition.length)
  );
  const tips = $derived(getTipsForLocation(expedition.location.id));
  const curios = $derived(filterCurios(getCuriosForLocation(expedition.location.id), expedition.query));
  const itemGroups = $derived(
    getCuriosByItem(expedition.location.id)
      .map((group) => ({ ...group, curios: filterCurios(group.curios, expedition.query) }))
      .filter((group) => group.curios.length)
  );

  const tipCategoryLabels: Record<string, string> = {
    effective: 'Effective',
    ineffective: 'Ineffective',
    dangers: 'Dangers'
  };

  function filterCurios(source: Curio[], query: string) {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return source;

    return source.filter((curio) => {
      const haystack = [
        curio.name,
        curio.description ?? '',
        ...curio.interactions.flatMap((interaction) => [
          interaction.label,
          ...interaction.outcomes.map((outcome) => outcome.label)
        ])
      ].join(' ').toLowerCase();

      return haystack.includes(normalized);
    });
  }

  function setParam(key: string, value: string) {
    const params = updateParam(page.url.searchParams, key, value);
    goto(`${page.url.pathname}?${params.toString()}`, { keepFocus: true, noScroll: true });
  }

  function interactionFor(curio: Curio, interaction: CurioInteraction) {
    return curio.interactions.find((candidate) => candidate.item === interaction.item) ?? interaction;
  }

  function titleCase(value: string) {
    return value
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  async function shareExpedition() {
    await navigator.clipboard.writeText(page.url.href);
    shareStatus = 'Copied';
    window.setTimeout(() => {
      shareStatus = '';
    }, 1800);
  }
</script>

<svelte:head>
  <title>Darkest Companion</title>
</svelte:head>

<main class="min-h-[100dvh] bg-[#0a0908] text-[#c4bba8]">
  <div class="relative mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">

    <!-- Header -->
    <header class="mb-8 flex flex-col items-center gap-4 md:flex-row md:items-end md:justify-between" aria-labelledby="page-title">
      <div class="w-full md:w-auto">
        <a
          href="{base}/"
          aria-label="Darkest Companion home"
          class="block w-full text-center md:inline-block md:w-auto border-2 border-[#5a5038] bg-[#5a5548] px-8 py-5"
        >
          <img
            class="mx-auto h-auto max-w-[280px] md:max-w-[200px]"
            src="{base}/logo.png"
            alt="Darkest Companion torch mark"
          />
        </a>
        <h1 id="page-title" class="sr-only">Darkest Companion</h1>
      </div>
      <button
        class="dd-btn w-full justify-center inline-flex min-h-10 items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] md:w-auto"
        type="button"
        onclick={shareExpedition}
        aria-live="polite"
      >
        <svg
          class="h-4 w-4"
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        >
          <path d="M16 5h2.5A2.5 2.5 0 0 1 21 7.5v11A2.5 2.5 0 0 1 18.5 21h-11A2.5 2.5 0 0 1 5 18.5V16" />
          <path d="M14 3h7v7" />
          <path d="M21 3 10 14" />
        </svg>
        <span>{shareStatus || 'Share Expedition'}</span>
      </button>
    </header>

    <!-- Main panels -->
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.2fr_1fr] items-start">

      <!-- Expedition Setup -->
      <section class="dd-panel p-5" aria-label="Expedition setup">
        <div class="dd-section-header">
          <h2 class="dd-title text-2xl">Choose the Run</h2>
        </div>

        <fieldset class="mb-6 border-0 p-0">
          <legend class="dd-title mb-3 text-base">Location</legend>
          <div class="grid grid-cols-2 gap-2">
            {#each locations as location}
              <button
                type="button"
                class="dd-btn min-h-10 px-2 py-2 text-xs {location.id === expedition.location.id ? 'selected' : ''}"
                onclick={() => setParam('location', location.id)}
              >
                {location.name}
              </button>
            {/each}
          </div>
        </fieldset>

        <fieldset class="border-0 p-0">
          <legend class="dd-title mb-3 text-base">Length</legend>
          <div class="grid grid-cols-3 gap-2">
            {#each expedition.location.lengths as length}
              <button
                type="button"
                class="dd-btn min-h-10 px-2 py-2 text-xs {length === expedition.length ? 'selected' : ''}"
                onclick={() => setParam('length', length)}
              >
                {titleCase(length)}
              </button>
            {/each}
          </div>
        </fieldset>
      </section>

      <!-- Provisions -->
      <section class="dd-panel p-5" aria-label="Recommended provisions">
        <div class="dd-section-header flex items-start justify-between">
          <h2 class="dd-title text-2xl">Provisions</h2>
          <div class="text-right">
            <span class="block text-xs uppercase tracking-[0.14em] text-[#4a443a]">Total</span>
            <span class="dd-title text-2xl">{recommendation.totalCost.toLocaleString()}g</span>
          </div>
        </div>

        <div class="dd-panel-inner p-2">
          <div class="grid grid-cols-8">
            {#each recommendation.lines as line}
              {#each line.stacks as stack, index}
                <div
                  class="dd-slot relative grid aspect-square place-items-center"
                  title={`${line.label}: ${stack.quantity}`}
                >
                  <img class="relative z-[1] max-h-[92%] max-w-[92%] object-contain" src={line.icon} alt={line.label} />
                  {#if stack.quantity > 1}
                    <span
                      class="absolute left-[8%] top-[4%] z-[2] font-[DwarvenAxeBB] text-lg text-[#b8a050] [text-shadow:1px_1px_0_#000,0_0_4px_rgba(0,0,0,0.9)]"
                    >
                      {stack.quantity}
                    </span>
                  {/if}
                </div>
              {/each}
            {/each}
          </div>
        </div>
      </section>

      <!-- Tips -->
      <section class="dd-panel p-5" aria-label="Location tips">
        <div class="dd-section-header">
          <h2 class="dd-title text-2xl">Tips</h2>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {#each Object.entries(tips) as [category, entries]}
            {@const categoryColor = category === 'effective' ? '#5a7a3a' : category === 'ineffective' ? '#a07030' : '#9a3028'}
            <section>
              <h3
                class="dd-title mb-2 inline-block border-b-2 pb-1 text-lg"
                style="border-color: {categoryColor}; color: {categoryColor};"
              >
                {tipCategoryLabels[category]}
              </h3>
              {#if entries.length}
                {#each entries as tip}
                  <article class="border-t border-[var(--dd-panel-border)] py-2 pl-3" style="border-left: 2px solid {categoryColor};">
                    <strong class="block text-sm md:text-xs text-[#c4bba8]">{tip.label}</strong>
                    <p class="mt-0.5 text-sm md:text-xs text-[#6e6558]">{tip.details}</p>
                  </article>
                {/each}
              {:else}
                <p class="text-sm md:text-xs text-[#4a443a]">No major warning.</p>
              {/if}
            </section>
          {/each}
        </div>
      </section>
    </div>

    <!-- Curios -->
    <section class="dd-panel mt-5 p-5" aria-labelledby="curios-title">
      <div class="dd-section-header flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h2 id="curios-title" class="dd-title text-2xl">Curios</h2>
        <div class="flex flex-wrap items-end gap-3">
          <label class="grid gap-1 text-sm text-[#6e6558]">
            <span>Search</span>
            <input
              class="dd-input min-h-10 w-full min-w-[220px] px-3 py-2 text-sm"
              value={expedition.query}
              oninput={(event) => setParam('q', event.currentTarget.value)}
              placeholder="curio, item, outcome"
            />
          </label>
          <div class="grid grid-cols-2 gap-2">
            {#each curioViews as view}
              <button
                type="button"
                class="dd-btn min-h-10 px-3 py-2 text-xs {view.id === expedition.view ? 'selected' : ''}"
                onclick={() => setParam('view', view.id)}
              >
                {view.label}
              </button>
            {/each}
          </div>
        </div>
      </div>

      {#if expedition.view === 'by-curio'}
        {#if curios.length}
          <div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {#each curios as curio}
              <article class="dd-card p-4">
                <div class="flex items-center gap-3">
                  <img class="h-14 w-14 object-contain" src={curio.icon} alt={curio.name} />
                  <h3 class="dd-title text-lg">{curio.name}</h3>
                </div>
                {#if curio.description}
                  <p class="mt-1 text-xs text-[#6e6558]">{curio.description}</p>
                {/if}
                <div class="mt-3 grid gap-2">
                  {#each curio.interactions as interaction}
                    <div class="dd-interaction grid grid-cols-[2.25rem_1fr] gap-3 rounded-sm p-3 {interaction.recommended ? 'recommended' : ''}">
                      <img class="h-9 w-9 object-contain" src={interaction.icon} alt={interaction.label} />
                      <div>
                        <strong class="block text-sm text-[#c4bba8]">{interaction.label}</strong>
                        {#each interaction.outcomes as outcome}
                          <p
                            class="mt-1 text-sm {outcome.tone === 'positive' ? 'text-[#7a9a5a]' : outcome.tone === 'danger' ? 'text-[#b07060]' : 'text-[#6e6558]'}"
                          >
                            {outcome.chance ? `${outcome.chance}% ` : ''}{outcome.label}{outcome.amount ? ` x${outcome.amount}` : ''}
                          </p>
                        {/each}
                      </div>
                    </div>
                  {/each}
                </div>
              </article>
            {/each}
          </div>
        {:else}
          <div class="dd-panel-inner py-10 text-center">
            <h3 class="dd-title text-2xl">No curios found</h3>
            <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6e6558]">
              Try another curio, provision, or outcome term.
            </p>
          </div>
        {/if}
      {:else}
        {#if itemGroups.length}
          <div class="grid grid-cols-1 gap-4">
            {#each itemGroups as group}
              <section class="dd-card p-4">
                <div class="flex items-center gap-3">
                  <img class="h-9 w-9 object-contain" src={group.icon} alt={group.label} />
                  <h3 class="dd-title text-lg">{group.label}</h3>
                </div>
                <div class="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {#each group.curios as curio}
                    {@const interaction = interactionFor(curio, { item: group.item, label: group.label, icon: group.icon, outcomes: [] })}
                    <article class="dd-card p-4">
                      <div class="flex items-center gap-3">
                        <img class="h-10 w-10 object-contain" src={curio.icon} alt={curio.name} />
                        <h4 class="dd-title text-base">{curio.name}</h4>
                      </div>
                      {#each interaction.outcomes as outcome}
                        <p
                          class="mt-2 text-sm {outcome.tone === 'positive' ? 'text-[#7a9a5a]' : outcome.tone === 'danger' ? 'text-[#b07060]' : 'text-[#6e6558]'}"
                        >
                          {outcome.chance ? `${outcome.chance}% ` : ''}{outcome.label}{outcome.amount ? ` x${outcome.amount}` : ''}
                        </p>
                      {/each}
                    </article>
                  {/each}
                </div>
              </section>
            {/each}
          </div>
        {:else}
          <div class="dd-panel-inner py-10 text-center">
            <h3 class="dd-title text-2xl">No curios found</h3>
            <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6e6558]">
              Try another curio, provision, or outcome term.
            </p>
          </div>
        {/if}
      {/if}
    </section>

    <footer class="py-10 text-center text-xs tracking-wide text-[#3a3528]">
      Game content, images and materials are trademarks and copyrights of Red Hook Studios, creators of Darkest Dungeon.
    </footer>
  </div>
</main>