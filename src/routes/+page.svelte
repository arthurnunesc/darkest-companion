<script lang="ts">
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  import { getCuriosByItem, getCuriosForLocation } from '$lib/data/curios';
  import { getBossesForLocation } from '$lib/data/bosses';
  import { locations } from '$lib/data/locations';
  import { getTipsForLocation } from '$lib/data/tips';
  import type { Boss, Curio, CurioInteraction, OutcomeTone } from '$lib/data/types';
  import { getProvisionRecommendation, provisionRiskProfiles } from '$lib/data/provisions';
  import { curioViews, parseExpeditionParams, updateParam } from '$lib/expedition-state';
  import { getWikiUrl, getCurioWikiUrl } from '$lib/data/wiki';
  import { getHeroByName } from '$lib/data/heroes';

  let shareStatus = $state('');
  let hydrated = $state(false);
  let theme = $state<'dark' | 'light'>('dark');
  let showScrollTop = $state(false);

  function handleScroll() {
    showScrollTop = window.scrollY > 100;
  }

  function scrollToTop() {
    smoothScrollToY(0);
    showScrollTop = false;
  }

  const expedition = $derived(
    parseExpeditionParams(browser && hydrated ? page.url.searchParams : new URLSearchParams())
  );
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
  const bosses = $derived(getBossesForLocation(expedition.location.id));

  const tipCategoryLabels: Record<string, string> = {
    effective: 'Effective',
    ineffective: 'Ineffective',
    dangers: 'Dangers'
  };

  const titleClass = "font-[DwarvenAxeBB] text-[var(--dd-gold)] [text-shadow:var(--dd-text-shadow)] tracking-[0.02em] leading-none";
  const panelClass = "relative bg-[var(--dd-panel)] border-2 border-[var(--dd-panel-border)] [box-shadow:inset_0_1px_0_var(--dd-highlight-subtle),0_8px_32px_var(--dd-shadow-heavy)] before:absolute before:left-[10px] before:right-[10px] before:top-[-1px] before:h-[1px] before:bg-[linear-gradient(90deg,transparent_0%,var(--dd-panel-border-light)_12%,var(--dd-gold-dim)_50%,var(--dd-panel-border-light)_88%,transparent_100%)] before:opacity-60 after:absolute after:left-[10px] after:right-[10px] after:bottom-[-1px] after:h-[1px] after:bg-[linear-gradient(90deg,transparent_0%,var(--dd-panel-border-light)_12%,var(--dd-gold-dim)_50%,var(--dd-panel-border-light)_88%,transparent_100%)] after:opacity-60";
  const sectionHeaderClass = "relative pb-3 mb-5 border-b-2 border-[var(--dd-panel-border)] after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-12 after:bg-[var(--dd-gold-dim)]";
  const buttonClass = "relative inline-flex items-center justify-center bg-[var(--dd-button-bg)] border border-[var(--dd-panel-border-light)] text-[var(--dd-muted)] font-semibold text-[0.8125rem] uppercase tracking-[0.06em] leading-[1.2] transition-all duration-[120ms] ease-out [box-shadow:inset_0_1px_0_var(--dd-highlight-subtle),0_2px_4px_var(--dd-shadow-lighter)] hover:border-[var(--dd-gold-dim)] hover:text-[var(--dd-ink)] hover:[box-shadow:inset_0_1px_0_var(--dd-highlight-light),0_3px_8px_var(--dd-shadow-light)] active:translate-y-[1px] active:[box-shadow:inset_0_2px_4px_var(--dd-shadow-light)]";
  const buttonSelectedClass = "!border-[var(--dd-gold)] !bg-[var(--dd-gold-bg)] !text-[var(--dd-gold-bright)] ![box-shadow:inset_0_1px_0_var(--dd-selected-inset),0_0_10px_var(--dd-selected-glow)]";
  const inputClass = "bg-[var(--dd-bg)] border border-[var(--dd-panel-border)] text-[var(--dd-ink)] text-sm leading-[1.4] transition-all duration-[120ms] ease-out [box-shadow:inset_0_2px_5px_var(--dd-shadow-light)] placeholder:text-[var(--dd-faint)] focus:outline-none focus:border-[var(--dd-gold-dim)] focus:[box-shadow:inset_0_2px_5px_var(--dd-shadow-light),0_0_0_1px_var(--dd-gold-bg)]";
  const panelInnerClass = "relative bg-[var(--dd-bg)] border border-[var(--dd-panel-border-inner)] [box-shadow:inset_0_2px_6px_var(--dd-shadow-medium)]";
  const slotClass = "relative bg-[var(--dd-slot-bg)] border border-[var(--dd-slot-border)] [box-shadow:inset_0_2px_6px_var(--dd-shadow-heavy)] after:absolute after:inset-[2px] after:border after:border-[var(--dd-slot-inner-border)] after:content-[''] after:pointer-events-none";
  const cardClass = "relative bg-[var(--dd-bg-warm)] border border-[var(--dd-panel-border)] transition-all duration-[150ms] ease-out [box-shadow:inset_0_1px_0_var(--dd-highlight-faint)] hover:border-[var(--dd-gold-dim)] hover:bg-[var(--dd-card-hover)] hover:[box-shadow:inset_0_1px_0_var(--dd-highlight-light),0_4px_12px_var(--dd-shadow-lightest)]";
  const interactionClass = "relative border-l-2 border-[var(--dd-panel-border)] bg-[var(--dd-interaction-bg)]";
  const interactionRecommendedClass = "border-l-[var(--dd-gold-dim)] bg-[var(--dd-gold-bg-subtle)]";
  const enemyBaseClass = "font-[DwarvenAxeBB] text-[1.25rem] leading-[0.95] [box-shadow:inset_0_1px_0_var(--dd-highlight-light)] border";
  const enemyTypeClasses: Record<string, string> = {
    Beast: "text-[var(--dd-beast)] bg-[linear-gradient(135deg,transparent_0_12%,rgba(255,255,255,0.025)_12%_18%,transparent_18%_100%),var(--dd-beast-bg)] border-[var(--dd-beast)]/45",
    Bloodsucker: "text-[var(--dd-bloodsucker)] bg-[linear-gradient(135deg,transparent_0_12%,rgba(255,255,255,0.025)_12%_18%,transparent_18%_100%),var(--dd-bloodsucker-bg)] border-[var(--dd-bloodsucker)]/45",
    Eldritch: "text-[var(--dd-eldritch)] bg-[linear-gradient(135deg,transparent_0_12%,rgba(255,255,255,0.025)_12%_18%,transparent_18%_100%),var(--dd-eldritch-bg)] border-[var(--dd-eldritch)]/45",
    Human: "text-[var(--dd-human)] bg-[linear-gradient(135deg,transparent_0_12%,rgba(255,255,255,0.025)_12%_18%,transparent_18%_100%),var(--dd-human-bg)] border-[var(--dd-human)]/45",
    Husk: "text-[var(--dd-husk)] bg-[linear-gradient(135deg,transparent_0_12%,rgba(255,255,255,0.025)_12%_18%,transparent_18%_100%),var(--dd-husk-bg)] border-[var(--dd-husk)]/45",
    Ironwork: "text-[var(--dd-ironwork)] bg-[linear-gradient(135deg,transparent_0_12%,rgba(255,255,255,0.025)_12%_18%,transparent_18%_100%),var(--dd-ironwork-bg)] border-[var(--dd-ironwork)]/45",
    Unholy: "text-[var(--dd-unholy)] bg-[linear-gradient(135deg,transparent_0_12%,rgba(255,255,255,0.025)_12%_18%,transparent_18%_100%),var(--dd-unholy-bg)] border-[var(--dd-unholy)]/45",
  };
  const outcomeToneClasses: Record<OutcomeTone, string> = {
    positive: 'text-[var(--dd-green)]',
    danger: 'text-[var(--dd-blood)]',
    neutral: 'text-[var(--dd-muted)]',
    mixed: 'text-[var(--dd-muted)]',
  };
  const tipCategoryClasses: Record<string, { heading: string; item: string }> = {
    effective: {
      heading: '!text-[var(--dd-green)]',
      item: 'border-l-[var(--dd-green)]',
    },
    ineffective: {
      heading: '!text-[var(--dd-orange)]',
      item: 'border-l-[var(--dd-orange)]',
    },
    dangers: {
      heading: '!text-[var(--dd-blood)]',
      item: 'border-l-[var(--dd-blood)]',
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

  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('dd-theme', theme);
  }

  function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3);
  }

  function smoothScrollToY(targetY: number, duration = 350) {
    const startY = window.scrollY;
    const distance = targetY - startY;
    const startTime = performance.now();

    function step(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);

      window.scrollTo(0, startY + distance * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  function smoothScrollTo(elementId: string, duration = 350) {
    const element = document.getElementById(elementId);
    if (!element) return;
    smoothScrollToY(element.getBoundingClientRect().top + window.scrollY, duration);
  }

  function scrollToCurios() {
    smoothScrollTo('curios-section');
  }

  function scrollToBosses() {
    smoothScrollTo('bosses-section');
  }

  function getTeamCompositionsHeroUrl(heroName: string): string {
    const hero = getHeroByName(heroName);
    const params = new URLSearchParams();

    if (hero) {
      params.set('hero', hero.id);
    }

    return `${base}/team-compositions/${params.toString() ? `?${params.toString()}` : ''}`;
  }

  onMount(() => {
    hydrated = true;
    theme = (document.documentElement.dataset.theme as 'dark' | 'light') ?? 'dark';
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

<svelte:head>
  <title>Darkest Companion</title>
</svelte:head>

<main class="min-h-[100dvh] bg-[var(--dd-bg)] text-[var(--dd-ink)]">
  <div class="relative mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">

    <!-- Header -->
    <header class="relative mb-8 flex flex-col items-center gap-4 md:flex-row md:items-start md:justify-between" aria-labelledby="page-title">
      <div class="w-full md:w-auto">
        <a
          href="{base}/"
          aria-label="Darkest Companion home"
          class="block w-full text-center md:inline-block md:w-auto border-2 border-[var(--dd-header-border)] bg-[var(--dd-header-bg)] px-8 py-5"
        >
          <img
            class="mx-auto h-auto max-w-[280px] md:max-w-none md:w-[320px]"
            src="{base}/logo.png"
            alt="Darkest Companion torch mark"
          />
        </a>
        <h1 id="page-title" class="sr-only">Darkest Companion</h1>
      </div>
      <div class="flex w-full flex-col gap-3 md:absolute md:right-0 md:top-0 md:bottom-0 md:w-auto md:items-end md:justify-between">
        <div class="flex w-full gap-2 md:w-full md:justify-end">
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
            <span class="md:hidden">{shareStatus || 'Share'}</span>
            <span class="hidden md:inline">{shareStatus || 'Share Expedition'}</span>
          </button>
          <button
            class={[buttonClass, 'w-full min-h-10 gap-2 px-3 py-2 md:w-auto']}
            type="button"
            onclick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {#if theme === 'dark'}
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" aria-hidden="true">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            {:else}
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            {/if}
            <span class="md:hidden">{theme === 'dark' ? 'Light' : 'Dark'}</span>
            <span class="hidden md:inline">{theme === 'dark' ? 'Switch to Light theme' : 'Switch to Dark theme'}</span>
          </button>
        </div>
        <div class="flex w-full flex-col gap-2 md:w-full md:items-end">
          <span class="text-xs uppercase tracking-[0.12em] text-[var(--dd-faint)]">Jump to:</span>
          <div class="flex w-full gap-2 md:w-full md:justify-end">
          <a
            href="{base}/team-compositions/"
            class={[buttonClass, 'w-full min-h-10 gap-2 px-4 py-2 font-bold tracking-[0.12em] md:w-auto']}
          >
            <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" aria-hidden="true">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span class="md:hidden">Teams</span>
            <span class="hidden md:inline">Team Compositions</span>
          </a>
          <button
            class={[buttonClass, 'w-full min-h-10 gap-2 px-4 py-2 font-bold tracking-[0.12em] md:w-auto']}
            type="button"
            onclick={scrollToCurios}
            aria-label="Jump to Curios section"
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
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <span>Curios</span>
          </button>
          <button
            class={[buttonClass, 'w-full min-h-10 gap-2 px-4 py-2 font-bold tracking-[0.12em] md:w-auto']}
            type="button"
            onclick={scrollToBosses}
            aria-label="Jump to Bosses section"
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
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span>Bosses</span>
          </button>
          </div>
        </div>
      </div>
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
          <legend class={[titleClass, 'mb-3 text-lg']}>Supply Strategy<a href="#strategy-note" class="text-[var(--dd-muted)] no-underline" onclick={highlightNote}>*</a></legend>
          <div class="grid grid-cols-3 gap-2">
            {#each provisionRiskProfiles as profile}
              <button
                type="button"
                class={[buttonClass, profile.id === expedition.risk && buttonSelectedClass, 'min-h-10 px-2 py-2 !text-[0.6875rem]']}
                onclick={() => setParam('risk', profile.id)}
              >
                {profile.label}
              </button>
            {/each}
          </div>
          <p class="mt-2 text-xs text-[var(--dd-muted)]">{provisionRiskProfiles.find((p) => p.id === expedition.risk)?.description}</p>
        </fieldset>
      </section>

      <!-- Provisions -->
      <section class={[panelClass, 'p-5']} aria-label="Recommended provisions">
        <div class={[sectionHeaderClass, 'flex items-start justify-between']}>
          <h2 class={[titleClass, 'text-2xl']}>Provisions</h2>
          <div class="text-right">
            <span class="block text-xs uppercase tracking-[0.14em] text-[var(--dd-faint)]">Total</span>
            <span class={[titleClass, 'text-2xl']}>{recommendation.totalCost.toLocaleString()}g</span>
          </div>
        </div>

        <div class={[panelInnerClass, 'p-2']}>
          <div class="grid grid-cols-8">
            {#each recommendation.lines as line (line.id)}
              {#each line.stacks as stack, index (`${line.id}-${index}`)}
                <div
                  class={[slotClass, 'grid aspect-square place-items-center']}
                  title={`${line.label}: ${stack.quantity}`}
                >
                  <img class="relative z-[1] max-h-[92%] max-w-[92%] object-contain" src={stack.provision.icon} alt={line.label} />
                  {#if stack.quantity > 1}
                    <span
                      class="absolute left-[8%] top-[4%] z-[2] font-[DwarvenAxeBB] text-lg text-[var(--dd-gold-count)] [text-shadow:1px_1px_0_#000,0_0_4px_rgba(0,0,0,0.9)]"
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
          <span class="mb-2 block text-sm uppercase tracking-[0.12em] text-[var(--dd-faint)]">Enemy Types</span>
          <div class="flex flex-wrap gap-2">
            {#each expedition.location.enemyTypes as type}
              {@const typeWikiUrl = getWikiUrl(type)}
              {#if typeWikiUrl}
                <a href={typeWikiUrl} target="_blank" rel="noopener noreferrer" class="[text-decoration:none]">
                  <b class={[enemyBaseClass, enemyTypeClasses[type], 'px-3 py-1']}>{type}</b>
                </a>
              {:else}
                <b class={[enemyBaseClass, enemyTypeClasses[type], 'px-3 py-1']}>{type}</b>
              {/if}
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
                    <strong class="block text-sm text-[var(--dd-ink)]">{tip.label}</strong>
                    <p class="mt-0.5 text-sm text-[var(--dd-muted)]">{tip.details}</p>
                  </article>
                {/each}
              {:else}
                <p class="text-sm text-[var(--dd-faint)]">No major warning.</p>
              {/if}
            </section>
          {/each}
        </div>
      </section>
    </div>

    <!-- Curios -->
    <section id="curios-section" class={[panelClass, 'mt-5 p-5']} aria-labelledby="curios-title">
        <div class={[sectionHeaderClass, 'flex flex-col gap-4 md:flex-row md:items-start md:justify-between']}>
        <h2 id="curios-title" class={[titleClass, 'text-2xl']}>Curios</h2>
        <div class="flex flex-wrap items-end gap-3">
          <label class="grid gap-1 text-sm text-[var(--dd-muted)]">
            <span>Search</span>
            <div class="relative">
              <input
                class={[inputClass, 'min-h-10 w-full min-w-[220px] px-3 py-2 pr-9 text-sm']}
                value={expedition.query}
                oninput={(event) => setParam('q', event.currentTarget.value)}
                placeholder="curio, item, outcome"
              />
              {#if expedition.query}
                <button
                  type="button"
                  class="absolute right-1 top-1/2 -translate-y-1/2 grid h-7 w-7 place-items-center rounded text-[var(--dd-muted)] transition-colors hover:bg-[var(--dd-panel-border-light)] hover:text-[var(--dd-ink)]"
                  onclick={() => setParam('q', '')}
                  aria-label="Clear search"
                >
                  <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              {/if}
            </div>
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
                  <a href={getCurioWikiUrl(curio.name)} target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 [text-decoration:none]">
                    <img class="h-14 w-14 object-contain" src={curio.icon} alt={curio.name} />
                    <h3 class={[titleClass, 'text-2xl']}>{curio.name}</h3>
                  </a>
                </div>
                {#if curio.description}
                  <p class="mt-1 text-xs text-[var(--dd-muted)]">{curio.description}</p>
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
                        <strong class="block text-sm text-[var(--dd-ink)]">{interaction.label}</strong>
                        {#each interaction.outcomes as outcome}
                          <div class={['mt-1 flex items-start gap-2 text-sm', outcomeToneClasses[outcome.tone]]}>
                            <span class="mt-[0.55em] h-1 w-1 shrink-0 bg-current opacity-60"></span>
                            <span>{outcome.chance ? `${outcome.chance}% ` : ''}{outcome.label}{outcome.amount ? ` x${outcome.amount}` : ''}</span>
                          </div>
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
            <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--dd-muted)]">
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
                  <h3 class={[titleClass, 'text-xl']}>{group.label}</h3>
                </div>
                <div class="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {#each group.curios as curio}
                    {@const interaction = interactionFor(curio, { item: group.item, label: group.label, icon: group.icon, outcomes: [] })}
                    <article class={[cardClass, 'p-4']}>
                      <div class="flex items-center gap-3">
                        <a href={getCurioWikiUrl(curio.name)} target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 [text-decoration:none]">
                          <img class="h-10 w-10 object-contain" src={curio.icon} alt={curio.name} />
                          <h4 class={[titleClass, 'text-lg']}>{curio.name}</h4>
                        </a>
                      </div>
                      {#each interaction.outcomes as outcome}
                        <div class={['mt-2 flex items-start gap-2 text-sm', outcomeToneClasses[outcome.tone]]}>
                          <span class="mt-[0.55em] h-1 w-1 shrink-0 bg-current opacity-60"></span>
                          <span>{outcome.chance ? `${outcome.chance}% ` : ''}{outcome.label}{outcome.amount ? ` x${outcome.amount}` : ''}</span>
                        </div>
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
            <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--dd-muted)]">
              Try another curio, provision, or outcome term.
            </p>
          </div>
        {/if}
      {/if}
    </section>

    <!-- Bosses -->
    <section id="bosses-section" class={[panelClass, 'mt-5 p-5']} aria-labelledby="bosses-title">
      <div class={sectionHeaderClass}>
        <h2 id="bosses-title" class={[titleClass, 'text-2xl']}>Bosses</h2>
      </div>

      {#if bosses.length}
        <div class="grid grid-cols-1 gap-4">
          {#each bosses as boss}
            {@const bossWikiUrl = getWikiUrl(boss.name)}
            <article class={[cardClass, 'p-4']}>
              <div class="grid gap-4 md:grid-cols-[7rem_1fr]">
                <div class="grid place-items-center border border-[var(--dd-panel-border)] bg-[var(--dd-slot-bg)] p-3">
                  {#if bossWikiUrl}
                    <a href={bossWikiUrl} target="_blank" rel="noopener noreferrer" class="[text-decoration:none]">
                      <img class="max-h-24 object-contain" src={boss.image} alt={boss.imageAlt} />
                    </a>
                  {:else}
                    <img class="max-h-24 object-contain" src={boss.image} alt={boss.imageAlt} />
                  {/if}
                </div>

                <div>
                  <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      {#if bossWikiUrl}
                        <a href={bossWikiUrl} target="_blank" rel="noopener noreferrer" class="[text-decoration:none]">
                          <h3 class={[titleClass, 'text-3xl']}>{boss.name}</h3>
                        </a>
                      {:else}
                        <h3 class={[titleClass, 'text-3xl']}>{boss.name}</h3>
                      {/if}
                      {#if boss.variants?.length}
                        <p class="mt-1 text-xs uppercase tracking-[0.12em] text-[var(--dd-faint)]">
                          {boss.variants.join(' / ')}
                        </p>
                      {/if}
                    </div>

                    <div class="flex flex-wrap gap-2">
                      {#each boss.enemyTypes as type}
                        {@const typeWikiUrl = getWikiUrl(type)}
                        {#if typeWikiUrl}
                          <a href={typeWikiUrl} target="_blank" rel="noopener noreferrer" class="[text-decoration:none]">
                            <b class={[enemyBaseClass, enemyTypeClasses[type], 'px-3 py-1']}>{type}</b>
                          </a>
                        {:else}
                          <b class={[enemyBaseClass, enemyTypeClasses[type], 'px-3 py-1']}>{type}</b>
                        {/if}
                      {/each}
                      {#if boss.classification}
                        <b class={[enemyBaseClass, 'border-[var(--dd-faint)] bg-[var(--dd-bg)] px-3 py-1 text-[var(--dd-muted)]']}>
                          {boss.classification}
                        </b>
                      {/if}
                    </div>
                  </div>

                  {#if boss.size || boss.turns}
                    <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--dd-muted)]">
                      {#if boss.size}<span>Size: {boss.size}</span>{/if}
                      {#if boss.turns}<span>Turns: {boss.turns}</span>{/if}
                    </div>
                  {/if}
                </div>
              </div>

              <p class="mt-3 border-l-2 border-[var(--dd-gold-dim)] bg-[var(--dd-gold-bg-subtle)] p-3 text-sm leading-6 text-[var(--dd-ink)]">
                {boss.winCondition}
              </p>

              <div class="mt-4 grid gap-4 lg:grid-cols-3">
                <section>
                  <h3 class={[titleClass, '!text-[var(--dd-orange)] mb-2 inline-block text-lg']}>Mechanics</h3>
                  <div class="grid gap-2">
                    {#each boss.mechanics as entry}
                      <article class="border-l-2 border-[var(--dd-orange)] py-2 pl-3">
                        <strong class="block text-sm text-[var(--dd-ink)]">{entry.title}</strong>
                        <p class="mt-0.5 text-sm text-[var(--dd-muted)]">{entry.details}</p>
                      </article>
                    {/each}
                  </div>
                </section>

                <section>
                  <h3 class={[titleClass, '!text-[var(--dd-green)] mb-2 inline-block text-lg']}>Do</h3>
                  <div class="grid gap-2">
                    {#each boss.do as entry}
                      <article class="border-l-2 border-[var(--dd-green)] py-2 pl-3">
                        <strong class="block text-sm text-[var(--dd-ink)]">{entry.title}</strong>
                        <p class="mt-0.5 text-sm text-[var(--dd-muted)]">{entry.details}</p>
                      </article>
                    {/each}
                  </div>
                </section>

                <section>
                  <h3 class={[titleClass, '!text-[var(--dd-blood)] mb-2 inline-block text-lg']}>Avoid</h3>
                  <div class="grid gap-2">
                    {#each boss.avoid as entry}
                      <article class="border-l-2 border-[var(--dd-blood)] py-2 pl-3">
                        <strong class="block text-sm text-[var(--dd-ink)]">{entry.title}</strong>
                        <p class="mt-0.5 text-sm text-[var(--dd-muted)]">{entry.details}</p>
                      </article>
                    {/each}
                  </div>
                </section>
              </div>

              {#if boss.recommendedHeroes.length}
                <div class="mt-4">
                  <h4 class="mb-2 text-xs uppercase tracking-[0.14em] text-[var(--dd-faint)]">Good Picks</h4>
                  <div class="flex flex-wrap gap-2">
                    {#each boss.recommendedHeroes as hero}
                      <a
                        class="group relative border border-[var(--dd-panel-border)] bg-[var(--dd-bg)] px-2 py-1 text-xs text-[var(--dd-ink)] [text-decoration:none] transition-colors duration-150 hover:border-[var(--dd-gold-dim)] hover:text-[var(--dd-gold-bright)]"
                        href={getTeamCompositionsHeroUrl(hero)}
                      >
                        {hero}
                        <span class="absolute bottom-full left-0 z-20 h-2 w-full opacity-0" aria-hidden="true"></span>
                        <span class="absolute bottom-[calc(100%+0.5rem)] left-1/2 z-20 w-max max-w-40 -translate-x-1/2 border border-[var(--dd-gold-dim)] bg-[var(--dd-panel)] px-2 py-1 text-center text-[0.6875rem] leading-tight text-[var(--dd-ink)] opacity-0 [box-shadow:0_4px_12px_var(--dd-shadow-medium)] transition-opacity duration-150 group-hover:opacity-100">
                          Click to see team compositions
                        </span>
                      </a>
                    {/each}
                  </div>
                </div>
              {/if}

              {#if boss.notes?.length}
                <ul class="mt-4 grid gap-2 text-sm text-[var(--dd-muted)]">
                  {#each boss.notes as note}
                    <li class="flex gap-2">
                      <span class="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-[var(--dd-muted)]"></span>
                      <span>{note}</span>
                    </li>
                  {/each}
                </ul>
              {/if}
            </article>
          {/each}
        </div>
      {:else}
        <div class={[panelInnerClass, 'py-10 text-center']}>
          <h3 class={[titleClass, 'text-2xl']}>No boss notes yet</h3>
          <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--dd-muted)]">
            Boss strategy has not been added for this location.
          </p>
        </div>
      {/if}
    </section>

    <footer class="py-10 text-center text-xs tracking-wide text-[var(--dd-faint)]">
      Game content, images and materials are trademarks and copyrights of Red Hook Studios, creators of Darkest Dungeon.
      <p class="mt-2"><span id="strategy-note" class="text-[var(--dd-faint)]">* Destitute applies 80% of the prepared amount, Paranoid applies 120%. Firewood and torch count remain the same across strategies, as dungeon size is fixed.</span></p>
      <p class="mt-4">
        <a
          href="https://arthurnun.es"
          target="_blank"
          rel="noopener noreferrer"
          class="transition-colors duration-200 hover:underline"
          style="color: var(--dd-gold-dim);"
          onmouseenter={(e) => (e.currentTarget.style.color = 'var(--dd-gold)')}
          onmouseleave={(e) => (e.currentTarget.style.color = 'var(--dd-gold-dim)')}
        >
          Made by Arthur Nunes
        </a>
      </p>
    </footer>
  </div>

  {#if showScrollTop}
    <button
      type="button"
      class="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 border-2 border-[var(--dd-panel-border)] bg-[var(--dd-panel)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.06em] text-[var(--dd-gold)] [box-shadow:0_4px_16px_var(--dd-shadow-heavy)] transition-all duration-200 hover:border-[var(--dd-gold-dim)] hover:bg-[var(--dd-card-hover)] hover:[box-shadow:0_6px_24px_var(--dd-shadow-light)]"
      onclick={scrollToTop}
    >
      <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" aria-hidden="true">
        <path d="M18 15l-6-6-6 6"/>
      </svg>
      Scroll to top
    </button>
  {/if}
</main>
