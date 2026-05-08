<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { base } from '$app/paths';
  import { getCuriosByItem, getCuriosForLocation } from '$lib/data/curios';
  import { locations } from '$lib/data/locations';
  import { getTipsForLocation } from '$lib/data/tips';
  import type { Curio, CurioInteraction } from '$lib/data/types';
  import { getProvisionRecommendation } from '$lib/game/provisions';
  import { curioViews, difficulties, riskProfiles, updateParam } from '$lib/game/url-state';

  let { data } = $props();
  let shareStatus = $state('');

  const expedition = $derived(data.expedition);
  const recommendation = $derived(
    getProvisionRecommendation(expedition.location.id, expedition.length, expedition.difficulty, expedition.risk)
  );
  const tips = $derived(getTipsForLocation(expedition.location.id));
  const curios = $derived(filterCurios(getCuriosForLocation(expedition.location.id), expedition.query));
  const itemGroups = $derived(
    getCuriosByItem(expedition.location.id)
      .map((group) => ({ ...group, curios: filterCurios(group.curios, expedition.query) }))
      .filter((group) => group.curios.length)
  );
  const selectedRisk = $derived(riskProfiles.find((risk) => risk.id === expedition.risk) ?? riskProfiles[2]);
  const selectedRiskIndex = $derived(riskProfiles.findIndex((risk) => risk.id === expedition.risk));

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

<main class="min-h-[100dvh] bg-[#171715] text-stone-100">
  <div class="mx-auto max-w-[1400px] px-4 py-5 sm:px-6 lg:px-8">
    <section class="mb-5 grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto] md:items-end" aria-labelledby="page-title">
      <div>
        <a
          class="inline-grid w-full max-w-none place-items-center rounded-md border border-amber-200/20 bg-stone-100/90 p-4 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.65)] transition active:scale-[0.99] md:max-w-sm"
          href={`${base}/`}
          aria-label="Darkest Companion home"
        >
          <img class="block w-full" src="{base}/logo.png" alt="Darkest Companion torch mark" />
        </a>
        <h1 id="page-title" class="sr-only">Darkest Companion</h1>
      </div>
      <button
        class="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-amber-200/25 bg-stone-900/80 px-4 text-sm font-bold uppercase tracking-[0.14em] text-amber-200 transition hover:border-amber-100/50 hover:text-stone-50 active:translate-y-px active:scale-[0.98]"
        type="button"
        onclick={shareExpedition}
        aria-live="polite"
      >
        <svg
          class="h-5 w-5"
          viewBox="0 0 24 24"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.8"
        >
          <path d="M16 5h2.5A2.5 2.5 0 0 1 21 7.5v11A2.5 2.5 0 0 1 18.5 21h-11A2.5 2.5 0 0 1 5 18.5V16" />
          <path d="M14 3h7v7" />
          <path d="M21 3 10 14" />
        </svg>
        <span>{shareStatus || 'Share this combination'}</span>
      </button>
    </section>

    <section class="grid grid-cols-1 gap-4 lg:grid-cols-[0.9fr_1.2fr_1fr] items-start" aria-label="Expedition setup">
      <div class="rounded-[1rem] border border-amber-200/15 bg-stone-900/70 p-4 shadow-[0_24px_70px_-35px_rgba(0,0,0,0.8)] backdrop-blur">
        <div class="mb-4">
          <h2 class="[font-family:DwarvenAxeBB,Georgia,serif] text-3xl leading-none text-amber-200">Choose the run</h2>
        </div>

        <fieldset class="mb-5 border-0 p-0">
          <legend class="mb-2 [font-family:DwarvenAxeBB,Georgia,serif] text-xl text-stone-100">Location</legend>
          <div class="grid grid-cols-3 gap-2">
            {#each locations as location}
              <button
                type="button"
                class={`min-h-11 rounded-md border px-3 text-sm font-semibold transition active:translate-y-px active:scale-[0.98] ${location.id === expedition.location.id ? 'border-amber-200/60 bg-amber-200/12 text-amber-100' : 'border-stone-100/10 bg-stone-950/40 text-stone-400 hover:border-amber-200/35 hover:text-stone-100'}`}
                onclick={() => setParam('location', location.id)}
              >
                <span>{location.name}</span>
              </button>
            {/each}
          </div>
        </fieldset>

        <fieldset class="mb-5 border-0 p-0">
          <legend class="mb-2 [font-family:DwarvenAxeBB,Georgia,serif] text-xl text-stone-100">Length</legend>
          <div class="grid grid-cols-3 gap-2">
            {#each expedition.location.lengths as length}
              <button
                type="button"
                class={`min-h-11 rounded-md border px-3 text-sm font-semibold transition active:translate-y-px active:scale-[0.98] ${length === expedition.length ? 'border-amber-200/60 bg-amber-200/12 text-amber-100' : 'border-stone-100/10 bg-stone-950/40 text-stone-400 hover:border-amber-200/35 hover:text-stone-100'}`}
                onclick={() => setParam('length', length)}
              >
                {titleCase(length)}
              </button>
            {/each}
          </div>
        </fieldset>

        <fieldset class="mb-5 border-0 p-0">
          <legend class="mb-2 [font-family:DwarvenAxeBB,Georgia,serif] text-xl text-stone-100">Difficulty</legend>
          <div class="grid grid-cols-3 gap-2">
            {#each difficulties as difficulty}
              <button
                type="button"
                class={`min-h-11 rounded-md border px-3 text-sm font-semibold transition active:translate-y-px active:scale-[0.98] ${difficulty.id === expedition.difficulty ? 'border-amber-200/60 bg-amber-200/12 text-amber-100' : 'border-stone-100/10 bg-stone-950/40 text-stone-400 hover:border-amber-200/35 hover:text-stone-100'}`}
                onclick={() => setParam('difficulty', difficulty.id)}
              >
                {difficulty.label}
              </button>
            {/each}
          </div>
        </fieldset>

        <fieldset class="mb-5 border-0 p-0">
          <legend class="mb-2 [font-family:DwarvenAxeBB,Georgia,serif] text-xl text-stone-100">Risk</legend>
          <div class="relative pb-5" style={`--risk-progress: ${(selectedRiskIndex / (riskProfiles.length - 1)) * 100}%`}>
            <input
              class="risk-slider"
              type="range"
              min="0"
              max={riskProfiles.length - 1}
              step="1"
              value={selectedRiskIndex}
              oninput={(event) => {
                const input = event.currentTarget;
                const value = Number(input.value);
                const max = Number(input.max);
                const progress = max === 0 ? 0 : (value / max) * 100;
                (input.closest('.relative') as HTMLElement | null)?.style.setProperty('--risk-progress', `${progress}%`);
                setParam('risk', riskProfiles[value].id);
              }}
              aria-label="Provision risk profile"
            />
            <div class="absolute inset-x-0 bottom-0 flex justify-between text-xs text-stone-500" aria-hidden="true">
              {#each riskProfiles as risk, index}
                <span class={index === selectedRiskIndex ? 'text-amber-200' : ''}>{risk.label}</span>
              {/each}
            </div>
          </div>
          <div class="mt-2 grid gap-1">
            <strong class="text-stone-100">{selectedRisk.label}</strong>
            <span class="text-sm text-stone-400">{selectedRisk.description}</span>
          </div>
        </fieldset>
      </div>

      <div class="rounded-[1rem] border border-amber-200/15 bg-stone-900/70 p-4 shadow-[0_24px_70px_-35px_rgba(0,0,0,0.8)] backdrop-blur">
        <div class="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 class="[font-family:DwarvenAxeBB,Georgia,serif] text-3xl leading-none text-amber-200">Provisions</h2>
          </div>
          <div class="grid justify-items-end [font-family:DwarvenAxeBB,Georgia,serif] text-3xl text-amber-200">
            <span class="text-xs uppercase tracking-[0.14em] text-stone-400">Total</span>
            {recommendation.totalCost.toLocaleString()}g
          </div>
        </div>

        <div class="rounded-md border border-stone-700 bg-[#030303] p-2" aria-label="Recommended provisions">
          <div class="grid grid-cols-8">
            {#each recommendation.lines as line}
              {#each line.stacks as stack, index}
                <div
                  class="inventory-slot relative grid aspect-square place-items-center border border-stone-800 bg-[#050505]"
                  title={`${line.label}: ${stack.quantity}`}
                >
                  <img class="relative z-[1] max-h-[94%] max-w-[94%] object-contain" src={line.icon} alt={line.label} />
                  {#if stack.quantity > 1}
                    <span
                      class="absolute left-[8%] top-[3%] z-[2] [font-family:DwarvenAxeBB,Georgia,serif] text-xl text-amber-200 [text-shadow:1px_1px_0_#050504,0_0_6px_rgba(0,0,0,0.85)]"
                    >
                      {stack.quantity}
                    </span>
                  {/if}
                </div>
              {/each}
            {/each}
          </div>
        </div>

        <p class="mt-4 text-sm text-stone-400">
          Recommendations favor safety by default. Move the risk slider toward Lean only when you understand the region and party well.
        </p>
      </div>

      <div class="rounded-[1rem] border border-amber-200/15 bg-stone-900/70 p-4 shadow-[0_24px_70px_-35px_rgba(0,0,0,0.8)] backdrop-blur">
        <div class="mb-4">
          <h2 class="[font-family:DwarvenAxeBB,Georgia,serif] text-3xl leading-none text-amber-200">Tips</h2>
        </div>

        <div class="mb-4 grid gap-2">
          <span class="text-sm text-stone-400">You will face</span>
          <div class="flex flex-wrap gap-2">
            {#each expedition.location.enemyTypes as type}
              <b class={`enemy enemy-${type.toLowerCase()}`}>{type}</b>
            {/each}
          </div>
        </div>

        <div class="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {#each Object.entries(tips) as [category, entries]}
            <section>
              <h3
                class={`mb-2 inline-block border-b pb-1 text-xl [font-family:DwarvenAxeBB,Georgia,serif] ${category === 'effective' ? 'border-green-500/60 text-[#72a447]' : category === 'ineffective' ? 'border-orange-500/60 text-[#d38b26]' : 'border-red-500/60 text-[#d42d24]'}`}
              >
                {tipCategoryLabels[category]}
              </h3>
              {#if entries.length}
                {#each entries as tip}
                  <article class="relative border-t border-amber-100/10 py-2 pl-3 before:absolute before:left-0 before:top-3 before:h-4 before:w-[2px] before:rounded-full before:bg-current before:opacity-60">
                    <strong class="block text-sm text-stone-100">{tip.label}</strong>
                    <p class="mt-0.5 text-sm text-stone-400">{tip.details}</p>
                  </article>
                {/each}
              {:else}
                <p class="text-sm text-stone-500">No major warning.</p>
              {/if}
            </section>
          {/each}
        </div>
      </div>
    </section>

    <section
      class="mt-5 rounded-[1rem] border border-amber-200/15 bg-stone-900/70 p-4 shadow-[0_24px_70px_-35px_rgba(0,0,0,0.8)] backdrop-blur"
      aria-labelledby="curios-title"
    >
      <div class="mb-4 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <h2 id="curios-title" class="[font-family:DwarvenAxeBB,Georgia,serif] text-3xl leading-none text-amber-200">Curios</h2>
        </div>
        <div class="flex flex-wrap items-end justify-end gap-3">
          <label class="grid gap-1 text-sm text-stone-400">
            <span>Search</span>
            <input
              class="min-h-11 w-full min-w-0 rounded-md border border-stone-100/10 bg-stone-950/50 px-3 text-stone-100 placeholder:text-stone-500 outline-none transition focus:border-amber-200/60"
              value={expedition.query}
              oninput={(event) => setParam('q', event.currentTarget.value)}
              placeholder="curio, item, outcome"
            />
          </label>
          <div class="grid grid-cols-2 gap-2">
            {#each curioViews as view}
              <button
                type="button"
                class={`min-h-11 rounded-md border px-3 text-sm font-semibold transition active:translate-y-px active:scale-[0.98] ${view.id === expedition.view ? 'border-amber-200/60 bg-amber-200/12 text-amber-100' : 'border-stone-100/10 bg-stone-950/40 text-stone-400 hover:border-amber-200/35 hover:text-stone-100'}`}
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
              <article class="rounded-md border border-amber-100/10 bg-stone-950/35 p-4 transition hover:border-amber-200/25 hover:bg-stone-900/70">
                <div class="flex items-center gap-3">
                  <img class="h-16 w-16 object-contain" src={curio.icon} alt={curio.name} />
                  <h3 class="[font-family:DwarvenAxeBB,Georgia,serif] text-xl leading-none text-amber-200">{curio.name}</h3>
                </div>
                <div class="mt-3 grid gap-2">
                  {#each curio.interactions as interaction}
                    <div
                      class={`grid grid-cols-[2.5rem_1fr] gap-3 rounded-md border-l-2 p-3 ${interaction.recommended ? 'border-amber-200/70 bg-amber-200/8' : 'border-stone-700 bg-stone-950/30'}`}
                    >
                      <img class="h-10 w-10 object-contain" src={interaction.icon} alt={interaction.label} />
                      <div>
                        <strong class="block text-sm text-stone-100">{interaction.label}</strong>
                        {#each interaction.outcomes as outcome}
                          <p
                            class={`mt-1 text-sm ${outcome.tone === 'positive' ? 'text-[#9fbf77]' : outcome.tone === 'danger' ? 'text-[#d07866]' : 'text-stone-400'}`}
                          >
                            {outcome.chance ? `${outcome.chance}% ` : ''}{outcome.label}
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
          <div class="rounded-md border border-dashed border-amber-100/20 bg-stone-950/30 p-8 text-center">
            <h3 class="[font-family:DwarvenAxeBB,Georgia,serif] text-3xl text-amber-200">No curios found</h3>
            <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-400">
              Try another curio, provision, or outcome term.
            </p>
          </div>
        {/if}
      {:else}
        {#if itemGroups.length}
          <div class="grid grid-cols-1 gap-4">
            {#each itemGroups as group}
              <section class="rounded-md border border-amber-100/10 bg-stone-950/35 p-4">
                <div class="flex items-center gap-3">
                  <img class="h-10 w-10 object-contain" src={group.icon} alt={group.label} />
                  <h3 class="[font-family:DwarvenAxeBB,Georgia,serif] text-xl leading-none text-amber-200">{group.label}</h3>
                </div>
                <div class="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {#each group.curios as curio}
                    {@const interaction = interactionFor(curio, { item: group.item, label: group.label, icon: group.icon, outcomes: [] })}
                    <article class="rounded-md border border-amber-100/10 bg-stone-950/35 p-4 transition hover:border-amber-200/25 hover:bg-stone-900/70">
                      <div class="flex items-center gap-3">
                        <img class="h-12 w-12 object-contain" src={curio.icon} alt={curio.name} />
                        <h4 class="[font-family:DwarvenAxeBB,Georgia,serif] text-lg leading-none text-amber-200">{curio.name}</h4>
                      </div>
                      {#each interaction.outcomes as outcome}
                        <p
                          class={`mt-2 text-sm ${outcome.tone === 'positive' ? 'text-[#9fbf77]' : outcome.tone === 'danger' ? 'text-[#d07866]' : 'text-stone-400'}`}
                        >
                          {outcome.chance ? `${outcome.chance}% ` : ''}{outcome.label}
                        </p>
                      {/each}
                    </article>
                  {/each}
                </div>
              </section>
            {/each}
          </div>
        {:else}
          <div class="rounded-md border border-dashed border-amber-100/20 bg-stone-950/30 p-8 text-center">
            <h3 class="[font-family:DwarvenAxeBB,Georgia,serif] text-3xl text-amber-200">No curios found</h3>
            <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-400">
              Try another curio, provision, or outcome term.
            </p>
          </div>
        {/if}
      {/if}
    </section>

    <footer class="py-10 text-center text-sm text-stone-500">
      Game content, images and materials are trademarks and copyrights of Red Hook Studios, creators of Darkest Dungeon.
    </footer>
  </div>
</main>
