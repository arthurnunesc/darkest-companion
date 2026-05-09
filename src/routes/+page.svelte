<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { base } from '$app/paths';
  import { getCuriosByItem, getCuriosForLocation } from '$lib/data/curios';
  import { locations } from '$lib/data/locations';
  import { getTipsForLocation } from '$lib/data/tips';
  import type { Curio, CurioInteraction, OutcomeTone } from '$lib/data/types';
  import { getProvisionRecommendation, provisionRiskProfiles } from '$lib/data/provisions';
  import { curioViews, parseExpeditionParams, updateParam } from '$lib/expedition-state';

  let shareStatus = $state('');

  const expedition = $derived(parseExpeditionParams(page.url.searchParams));
  const recommendation = $derived(
    getProvisionRecommendation(expedition.location.id, expedition.length, expedition.risk)
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

  const titleClass = "font-[DwarvenAxeBB] text-[#b8a050] [text-shadow:0_1px_2px_rgba(0,0,0,0.9),0_0_1px_rgba(0,0,0,1)] tracking-[0.02em] leading-none";
  const panelClass = "relative bg-[#12100e] border-2 border-[#2a2420] [box-shadow:inset_0_1px_0_rgba(255,235,180,0.03),0_8px_32px_rgba(0,0,0,0.55)] before:absolute before:left-[10px] before:right-[10px] before:top-[-1px] before:h-[1px] before:bg-[linear-gradient(90deg,transparent_0%,#3d3528_12%,#7a6a38_50%,#3d3528_88%,transparent_100%)] before:opacity-60 after:absolute after:left-[10px] after:right-[10px] after:bottom-[-1px] after:h-[1px] after:bg-[linear-gradient(90deg,transparent_0%,#3d3528_12%,#7a6a38_50%,#3d3528_88%,transparent_100%)] after:opacity-60";
  const sectionHeaderClass = "relative pb-3 mb-5 border-b-2 border-[#2a2420] after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-12 after:bg-[#7a6a38]";
  const buttonClass = "relative inline-flex items-center justify-center bg-[#161410] border border-[#3d3528] text-[#6e6558] font-semibold text-[0.8125rem] uppercase tracking-[0.06em] leading-[1.2] transition-all duration-[120ms] ease-out [box-shadow:inset_0_1px_0_rgba(255,255,255,0.03),0_2px_4px_rgba(0,0,0,0.35)] hover:border-[#7a6a38] hover:text-[#c4bba8] hover:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.04),0_3px_8px_rgba(0,0,0,0.4)] active:translate-y-[1px] active:[box-shadow:inset_0_2px_4px_rgba(0,0,0,0.45)]";
  const buttonSelectedClass = "border-[#b8a050] bg-[rgba(184,160,80,0.07)] text-[#d4c078] [box-shadow:inset_0_1px_0_rgba(255,235,180,0.06),0_0_10px_rgba(184,160,80,0.06)]";
  const inputClass = "bg-[#0a0908] border border-[#2a2420] text-[#c4bba8] text-sm leading-[1.4] transition-all duration-[120ms] ease-out [box-shadow:inset_0_2px_5px_rgba(0,0,0,0.45)] placeholder:text-[#4a443a] focus:outline-none focus:border-[#7a6a38] focus:[box-shadow:inset_0_2px_5px_rgba(0,0,0,0.45),0_0_0_1px_rgba(184,160,80,0.1)]";
  const panelInnerClass = "relative bg-[#0a0908] border border-[#1c1814] [box-shadow:inset_0_2px_6px_rgba(0,0,0,0.5)]";
  const slotClass = "relative bg-[#080706] border border-[#1a1612] [box-shadow:inset_0_2px_6px_rgba(0,0,0,0.55)] after:absolute after:inset-[2px] after:border after:border-[rgba(55,45,30,0.45)] after:content-[''] after:pointer-events-none";
  const cardClass = "relative bg-[#0e0c0a] border border-[#2a2420] transition-all duration-[150ms] ease-out [box-shadow:inset_0_1px_0_rgba(255,255,255,0.015)] hover:border-[#7a6a38] hover:bg-[#13110e] hover:[box-shadow:inset_0_1px_0_rgba(255,255,255,0.02),0_4px_12px_rgba(0,0,0,0.3)]";
  const interactionClass = "relative border-l-2 border-[#2a2420] bg-[rgba(0,0,0,0.15)]";
  const interactionRecommendedClass = "border-l-[#7a6a38] bg-[rgba(184,160,80,0.04)]";
  const enemyBaseClass = "font-[DwarvenAxeBB] text-[1.25rem] leading-[0.95] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.04)] border";
  const enemyTypeClasses: Record<string, string> = {
    Beast: "text-[#a07048] bg-[linear-gradient(135deg,transparent_0_12%,rgba(255,255,255,0.025)_12%_18%,transparent_18%_100%),rgba(160,112,72,0.08)] border-[#a07048]/45",
    Bloodsucker: "text-[#b83830] bg-[linear-gradient(135deg,transparent_0_12%,rgba(255,255,255,0.025)_12%_18%,transparent_18%_100%),rgba(184,56,48,0.1)] border-[#b83830]/45",
    Eldritch: "text-[#6aa08a] bg-[linear-gradient(135deg,transparent_0_12%,rgba(255,255,255,0.025)_12%_18%,transparent_18%_100%),rgba(106,160,138,0.07)] border-[#6aa08a]/45",
    Human: "text-[#a09888] bg-[linear-gradient(135deg,transparent_0_12%,rgba(255,255,255,0.025)_12%_18%,transparent_18%_100%),rgba(160,152,136,0.07)] border-[#a09888]/45",
    Husk: "text-[#8a9ca8] bg-[linear-gradient(135deg,transparent_0_12%,rgba(255,255,255,0.025)_12%_18%,transparent_18%_100%),rgba(138,156,168,0.07)] border-[#8a9ca8]/45",
    Unholy: "text-[#c8b870] bg-[linear-gradient(135deg,transparent_0_12%,rgba(255,255,255,0.025)_12%_18%,transparent_18%_100%),rgba(200,184,112,0.07)] border-[#c8b870]/45",
  };
  const outcomeToneClasses: Record<OutcomeTone, string> = {
    positive: 'text-[#7a9a5a]',
    danger: 'text-[#b07060]',
    neutral: 'text-[#6e6558]',
    mixed: 'text-[#6e6558]',
  };
  const tipCategoryClasses: Record<string, { heading: string; item: string }> = {
    effective: {
      heading: '!text-[#5a7a3a]',
      item: 'border-l-[#5a7a3a]',
    },
    ineffective: {
      heading: '!text-[#a07030]',
      item: 'border-l-[#a07030]',
    },
    dangers: {
      heading: '!text-[#9a3028]',
      item: 'border-l-[#9a3028]',
    },
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

  function highlightNote() {
    const note = document.getElementById('strategy-note');
    if (!note) return;
    note.classList.remove('note-highlight');
    void note.offsetWidth;
    note.classList.add('note-highlight');
  }

  async function shareExpedition() {
    await navigator.clipboard.writeText(page.url.href);
    shareStatus = 'Copied to clipboard';
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
        class={[buttonClass, 'w-full min-h-10 gap-2 px-4 py-2 font-bold tracking-[0.12em] md:w-auto']}
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
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        <span>{shareStatus || 'Share Expedition'}</span>
      </button>
    </header>

    <!-- Main panels -->
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.2fr_1fr] items-start">

      <!-- Expedition Setup -->
      <section class={[panelClass, 'p-5']} aria-label="Expedition setup">
        <div class={sectionHeaderClass}>
          <h2 class={[titleClass, 'text-2xl']}>Choose the Run</h2>
        </div>

        <fieldset class="mb-6 border-0 p-0">
          <legend class={[titleClass, 'mb-3 text-lg']}>Location</legend>
          <div class="grid grid-cols-2 gap-2">
            {#each locations as location}
              <button
                type="button"
                class={[buttonClass, location.id === expedition.location.id && buttonSelectedClass, 'min-h-10 px-2 py-2']}
                onclick={() => setParam('location', location.id)}
              >
                {location.name}
              </button>
            {/each}
          </div>
        </fieldset>

        <fieldset class="border-0 p-0">
          <legend class={[titleClass, 'mb-3 text-lg']}>Length</legend>
          <div class="grid grid-cols-3 gap-2">
            {#each expedition.location.lengths as length}
              <button
                type="button"
                class={[buttonClass, length === expedition.length && buttonSelectedClass, 'min-h-10 px-2 py-2']}
                onclick={() => setParam('length', length)}
              >
                {titleCase(length)}
              </button>
            {/each}
          </div>
        </fieldset>

        <fieldset class="mt-6 border-0 p-0">
          <legend class={[titleClass, 'mb-3 text-lg']}>Supply Strategy<a href="#strategy-note" class="text-[#6e6558] no-underline" onclick={highlightNote}>*</a></legend>
          <div class="grid grid-cols-3 gap-2">
            {#each provisionRiskProfiles as profile}
              <button
                type="button"
                class={[buttonClass, profile.id === expedition.risk && buttonSelectedClass, 'min-h-10 px-2 py-2']}
                onclick={() => setParam('risk', profile.id)}
              >
                {profile.label}
              </button>
            {/each}
          </div>
          <p class="mt-2 text-xs text-[#6e6558]">{provisionRiskProfiles.find((p) => p.id === expedition.risk)?.description}</p>
        </fieldset>
      </section>

      <!-- Provisions -->
      <section class={[panelClass, 'p-5']} aria-label="Recommended provisions">
        <div class={[sectionHeaderClass, 'flex items-start justify-between']}>
          <h2 class={[titleClass, 'text-2xl']}>Provisions</h2>
          <div class="text-right">
            <span class="block text-xs uppercase tracking-[0.14em] text-[#4a443a]">Total</span>
            <span class={[titleClass, 'text-2xl']}>{recommendation.totalCost.toLocaleString()}g</span>
          </div>
        </div>

        <div class={[panelInnerClass, 'p-2']}>
          <div class="grid grid-cols-8">
            {#each recommendation.lines as line}
              {#each line.stacks as stack, index}
                <div
                  class={[slotClass, 'grid aspect-square place-items-center']}
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
      <section class={[panelClass, 'p-5']} aria-label="Location tips">
        <div class={sectionHeaderClass}>
          <h2 class={[titleClass, 'text-2xl']}>Tips</h2>
        </div>

        <div class="mb-4">
          <span class="mb-2 block text-sm uppercase tracking-[0.12em] text-[#4a443a]">Enemy Types</span>
          <div class="flex flex-wrap gap-2">
            {#each expedition.location.enemyTypes as type}
              <b class={[enemyBaseClass, enemyTypeClasses[type], 'px-3 py-1']}>{type}</b>
            {/each}
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {#each Object.entries(tips) as [category, entries]}
            {@const categoryClasses = tipCategoryClasses[category]}
            <section>
              <h3
                class={[titleClass, categoryClasses.heading, 'mb-2 inline-block text-lg']}
              >
                {tipCategoryLabels[category]}
              </h3>
              {#if entries.length}
                {#each entries as tip}
                  <article class={[
                    categoryClasses.item,
                    'border-t border-t-[var(--dd-panel-border)] border-l-2 py-2 pl-3'
                  ]}>
                    <strong class="block text-sm text-[#c4bba8]">{tip.label}</strong>
                    <p class="mt-0.5 text-sm text-[#6e6558]">{tip.details}</p>
                  </article>
                {/each}
              {:else}
                <p class="text-sm text-[#4a443a]">No major warning.</p>
              {/if}
            </section>
          {/each}
        </div>
      </section>
    </div>

    <!-- Curios -->
    <section class={[panelClass, 'mt-5 p-5']} aria-labelledby="curios-title">
      <div class={[sectionHeaderClass, 'flex flex-col gap-4 md:flex-row md:items-end md:justify-between']}>
        <h2 id="curios-title" class={[titleClass, 'text-2xl']}>Curios</h2>
        <div class="flex flex-wrap items-end gap-3">
          <label class="grid gap-1 text-sm text-[#6e6558]">
            <span>Search</span>
            <input
              class={[inputClass, 'min-h-10 w-full min-w-[220px] px-3 py-2 text-sm']}
              value={expedition.query}
              oninput={(event) => setParam('q', event.currentTarget.value)}
              placeholder="curio, item, outcome"
            />
          </label>
          <div class="grid grid-cols-2 gap-2">
            {#each curioViews as view}
              <button
                type="button"
                class={[buttonClass, view.id === expedition.view && buttonSelectedClass, 'min-h-10 px-3 py-2']}
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
              <article class={[cardClass, 'p-4']}>
                <div class="flex items-center gap-3">
                  <img class="h-14 w-14 object-contain" src={curio.icon} alt={curio.name} />
                  <h3 class={[titleClass, 'text-lg']}>{curio.name}</h3>
                </div>
                {#if curio.description}
                  <p class="mt-1 text-xs text-[#6e6558]">{curio.description}</p>
                {/if}
                <div class="mt-3 grid gap-2">
                  {#each curio.interactions as interaction}
                    <div class={[
                      interactionClass,
                      interaction.recommended && interactionRecommendedClass,
                      'grid grid-cols-[2.25rem_1fr] gap-3 rounded-sm p-3'
                    ]}>
                      <img class="h-9 w-9 object-contain" src={interaction.icon} alt={interaction.label} />
                      <div>
                        <strong class="block text-sm text-[#c4bba8]">{interaction.label}</strong>
                        {#each interaction.outcomes as outcome}
                          <p
                            class={['mt-1 text-sm', outcomeToneClasses[outcome.tone]]}
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
          <div class={[panelInnerClass, 'py-10 text-center']}>
            <h3 class={[titleClass, 'text-2xl']}>No curios found</h3>
            <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6e6558]">
              Try another curio, provision, or outcome term.
            </p>
          </div>
        {/if}
      {:else}
        {#if itemGroups.length}
          <div class="grid grid-cols-1 gap-4">
            {#each itemGroups as group}
              <section class={[cardClass, 'p-4']}>
                <div class="flex items-center gap-3">
                  <img class="h-9 w-9 object-contain" src={group.icon} alt={group.label} />
                  <h3 class={[titleClass, 'text-lg']}>{group.label}</h3>
                </div>
                <div class="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {#each group.curios as curio}
                    {@const interaction = interactionFor(curio, { item: group.item, label: group.label, icon: group.icon, outcomes: [] })}
                    <article class={[cardClass, 'p-4']}>
                      <div class="flex items-center gap-3">
                        <img class="h-10 w-10 object-contain" src={curio.icon} alt={curio.name} />
                        <h4 class={[titleClass, 'text-base']}>{curio.name}</h4>
                      </div>
                      {#each interaction.outcomes as outcome}
                        <p
                          class={['mt-2 text-sm', outcomeToneClasses[outcome.tone]]}
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
          <div class={[panelInnerClass, 'py-10 text-center']}>
            <h3 class={[titleClass, 'text-2xl']}>No curios found</h3>
            <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6e6558]">
              Try another curio, provision, or outcome term.
            </p>
          </div>
        {/if}
      {/if}
    </section>

    <footer class="py-10 text-center text-xs tracking-wide text-[#3a3528]">
      Game content, images and materials are trademarks and copyrights of Red Hook Studios, creators of Darkest Dungeon.
      <p class="mt-2"><span id="strategy-note" class="text-[#4a443a]">* Destitute applies 80% of the prepared amount, Paranoid applies 120%. Firewood and torch count remain the same across strategies, as dungeon size is fixed.</span></p>
    </footer>
  </div>
</main>
