<script lang="ts">
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { page } from '$app/state';
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  import { heroes } from '$lib/data/heroes';
  import { teamCompositions } from '$lib/data/team-compositions';
  import { getWikiUrl } from '$lib/data/wiki';
  import { getChoiceIndex, getOffsetCycleTick, getResumeCycleOffset } from '$lib/team-composition-carousel';
  import type { Hero, HeroId, TeamSkill } from '$lib/data/types';

  type HeroFilterId = HeroId | 'arbalest-musketeer';

  interface HeroFilterOption {
    id: HeroFilterId;
    label: string;
    heroIds: HeroId[];
    heroNames: string[];
  }

  let hydrated = $state(false);
  let theme = $state<'dark' | 'light'>('dark');
  let cycleTick = $state(0);
  let hoveredSlotKey = $state<string | null>(null);
  let frozenCycleTick = $state(0);
  let releaseSlotKey = $state<string | null>(null);
  let releaseCycleTick = $state<number | null>(null);
  let slotCycleOffsets = $state<Record<string, number>>({});

  $effect(() => {
    const interval = setInterval(() => {
      cycleTick++;
    }, 1500);
    return () => clearInterval(interval);
  });

  $effect(() => {
    if (releaseSlotKey && releaseCycleTick !== null && cycleTick >= releaseCycleTick) {
      if (hoveredSlotKey === releaseSlotKey) {
        hoveredSlotKey = null;
      }
      releaseSlotKey = null;
      releaseCycleTick = null;
    }
  });

  const heroFilterOptions: HeroFilterOption[] = [
    {
      id: 'arbalest-musketeer',
      label: 'Arbalest / Musketeer',
      heroIds: ['arbalest', 'musketeer'],
      heroNames: ['Arbalest', 'Musketeer']
    },
    ...heroes
      .filter((hero) => hero.id !== 'arbalest' && hero.id !== 'musketeer')
      .map((hero: Hero) => ({
        id: hero.id,
        label: hero.name,
        heroIds: [hero.id],
        heroNames: [hero.name]
      }))
  ];

  const selectedHero = $derived(
    browser && hydrated ? (page.url.searchParams.get('hero') as HeroFilterId | null) : null
  );

  const selectedHeroFilter = $derived(
    selectedHero
      ? heroFilterOptions.find(
          (option) => option.id === selectedHero || option.heroIds.includes(selectedHero as HeroId)
        )
      : undefined
  );

  const filteredCompositions = $derived(() => {
    if (!selectedHero) return teamCompositions;
    const heroFilter = selectedHeroFilter;
    if (!heroFilter) return teamCompositions;
    return teamCompositions.filter((comp) =>
      comp.ranks.some((slot) =>
        heroFilter.heroNames.some((heroName) => slotIncludesHero(slot, heroName))
      )
    );
  });

  const titleClass = "font-[DwarvenAxeBB] text-[var(--dd-gold)] [text-shadow:var(--dd-text-shadow)] tracking-[0.02em] leading-none";
  const panelClass = "relative bg-[var(--dd-panel)] border-2 border-[var(--dd-panel-border)] [box-shadow:inset_0_1px_0_var(--dd-highlight-subtle),0_8px_32px_var(--dd-shadow-heavy)] before:absolute before:left-[10px] before:right-[10px] before:top-[-1px] before:h-[1px] before:bg-[linear-gradient(90deg,transparent_0%,var(--dd-panel-border-light)_12%,var(--dd-gold-dim)_50%,var(--dd-panel-border-light)_88%,transparent_100%)] before:opacity-60 after:absolute after:left-[10px] after:right-[10px] after:bottom-[-1px] after:h-[1px] after:bg-[linear-gradient(90deg,transparent_0%,var(--dd-panel-border-light)_12%,var(--dd-gold-dim)_50%,var(--dd-panel-border-light)_88%,transparent_100%)] after:opacity-60";
  const sectionHeaderClass = "relative pb-3 mb-5 border-b-2 border-[var(--dd-panel-border)] after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-12 after:bg-[var(--dd-gold-dim)]";
  const buttonClass = "relative inline-flex items-center justify-center bg-[var(--dd-button-bg)] border border-[var(--dd-panel-border-light)] text-[var(--dd-muted)] font-semibold text-[0.8125rem] uppercase tracking-[0.06em] leading-[1.2] transition-all duration-[120ms] ease-out [box-shadow:inset_0_1px_0_var(--dd-highlight-subtle),0_2px_4px_var(--dd-shadow-lighter)] hover:border-[var(--dd-gold-dim)] hover:text-[var(--dd-ink)] hover:[box-shadow:inset_0_1px_0_var(--dd-highlight-light),0_3px_8px_var(--dd-shadow-light)] active:translate-y-[1px] active:[box-shadow:inset_0_2px_4px_var(--dd-shadow-light)]";
  const buttonSelectedClass = "!border-[var(--dd-gold)] !bg-[var(--dd-gold-bg)] !text-[var(--dd-gold-bright)] ![box-shadow:inset_0_1px_0_var(--dd-selected-inset),0_0_10px_var(--dd-selected-glow)]";
  const cardClass = "relative bg-[var(--dd-bg-warm)] border border-[var(--dd-panel-border)] [box-shadow:inset_0_1px_0_var(--dd-highlight-faint)]";
  const panelInnerClass = "relative bg-[var(--dd-bg)] border border-[var(--dd-panel-border-inner)] [box-shadow:inset_0_2px_6px_var(--dd-shadow-medium)]";

  function setHeroFilter(heroId: HeroFilterId | null) {
    const params = new URLSearchParams(page.url.searchParams);
    if (heroId) {
      params.set('hero', heroId);
    } else {
      params.delete('hero');
    }
    goto(`${page.url.pathname}?${params.toString()}`, { keepFocus: true, noScroll: true });
  }

  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('dd-theme', theme);
  }

  function getInitials(name: string): string {
    return name
      .split(/[\s\-]+/)
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  function getHeroImage(name: string): string | undefined {
    const hero = heroes.find(
      (h) => h.name.toLowerCase() === name.toLowerCase()
    );
    return hero?.image;
  }

  function getHeroWikiUrl(name: string): string | null {
    const hero = heroes.find(
      (h) => h.name.toLowerCase() === name.toLowerCase()
    );
    return hero ? getWikiUrl(hero.name) : null;
  }

  function getHeroImageForSlot(slot: (typeof teamCompositions)[0]['ranks'][0]): string | undefined {
    if (slot.type === 'flexible') return undefined;
    const heroName = slot.options[0] || slot.hero;
    return getHeroImage(heroName);
  }

  function slotIncludesHero(slot: (typeof teamCompositions)[0]['ranks'][0], heroName: string): boolean {
    const normalizedName = heroName.toLowerCase();
    return (
      slot.hero.toLowerCase() === normalizedName ||
      slot.options.some((option) => option.toLowerCase() === normalizedName)
    );
  }

  function getChoiceSkillsForHero(
    slot: (typeof teamCompositions)[0]['ranks'][0],
    currentName: string
  ): TeamSkill[] {
    const explicitSkills = slot.skillsByHero?.[currentName];
    if (explicitSkills) return explicitSkills;

    const optionIndex = slot.options.findIndex(
      (option) => option.toLowerCase() === currentName.toLowerCase()
    );
    if (optionIndex === -1) return slot.skills;

    return slot.skills.map((skill) => {
      const alternative = skill.alternatives?.[optionIndex];
      return alternative ? { name: alternative } : skill;
    });
  }

  function getCurrentSkills(
    slot: (typeof teamCompositions)[0]['ranks'][0],
    currentName: string,
    hasMultipleImages: boolean
  ): TeamSkill[] {
    const skills: TeamSkill[] = (() => {
      if (slot.type === 'flexible') return slot.skills;
      if (hasMultipleImages) {
        return getChoiceSkillsForHero(slot, currentName);
      }
      return slot.skills;
    })();

    if (currentName === 'Abomination' || skills.length <= 4) return skills;

    const primarySkills = skills.slice(0, 3);
    const alternateNames = skills.slice(3).flatMap((skill) => skill.alternatives ?? [skill.name]);

    return [
      ...primarySkills,
      {
        name: alternateNames.join(' / '),
        alternatives: alternateNames,
      },
    ];
  }

  onMount(() => {
    hydrated = true;
    theme = (document.documentElement.dataset.theme as 'dark' | 'light') ?? 'dark';
  });
</script>

<svelte:head>
  <title>Team Compositions | Darkest Companion</title>
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
        <h1 id="page-title" class="sr-only">Team Compositions</h1>
      </div>
      <div class="flex w-full flex-col gap-3 md:absolute md:right-0 md:top-0 md:bottom-0 md:w-auto md:items-end md:justify-between">
        <div class="flex w-full gap-2 md:w-full md:justify-end">
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
          <span class="text-xs uppercase tracking-[0.12em] text-[var(--dd-faint)]">Navigate:</span>
          <div class="flex w-full gap-2 md:w-full md:justify-end">
            <a
              href="{base}/"
              class={[buttonClass, 'w-full min-h-10 gap-2 px-4 py-2 font-bold tracking-[0.12em] md:w-auto']}
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" aria-hidden="true">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span class="md:hidden">Home</span>
              <span class="hidden md:inline">Back to Expedition Planner</span>
            </a>
          </div>
        </div>
      </div>
    </header>

    <!-- Hero Filter -->
    <section class={[panelClass, 'p-5 mb-5']} aria-label="Hero filter">
      <div class={sectionHeaderClass}>
        <h2 class={[titleClass, 'text-2xl']}>Filter by Hero</h2>
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class={[buttonClass, !selectedHero && buttonSelectedClass, 'min-h-10 px-3 py-2']}
          onclick={() => setHeroFilter(null)}
        >
          All
        </button>
        {#each heroFilterOptions as heroFilter}
          <button
            type="button"
            class={[buttonClass, selectedHeroFilter?.id === heroFilter.id && buttonSelectedClass, 'min-h-10 px-3 py-2']}
            onclick={() => setHeroFilter(heroFilter.id)}
          >
            {heroFilter.label}
          </button>
        {/each}
      </div>
    </section>

    <!-- Compositions List -->
    <section aria-label="Team compositions" class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {#if filteredCompositions().length}
        {#each filteredCompositions() as comp}
          <article
            class={[cardClass, 'p-5']}
          >
            <!-- Title -->
            <div class={sectionHeaderClass}>
              <h3 class={[titleClass, 'text-2xl']}>{comp.name}</h3>
            </div>

            <!-- Heroes Row -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              {#each comp.ranks as slot, slotIndex}
                {@const isChoice = slot.type === 'choice'}
                {@const isFlexible = slot.type === 'flexible'}
                {@const choiceImages = isChoice ? slot.options.map((opt) => ({ name: opt, image: getHeroImage(opt) })).filter((x) => x.image) : []}
                {@const hasMultipleImages = choiceImages.length > 1}
                {@const slotKey = `${comp.id}-${slotIndex}`}
                {@const isSlotFrozen = hoveredSlotKey === slotKey && (releaseSlotKey !== slotKey || releaseCycleTick === null || cycleTick < releaseCycleTick)}
                {@const activeCycleTick = isSlotFrozen ? frozenCycleTick : getOffsetCycleTick(cycleTick, slotCycleOffsets[slotKey])}
                {#key `${comp.id}-${slotIndex}-${activeCycleTick}`}
                  {@const choiceIndex = hasMultipleImages ? getChoiceIndex(activeCycleTick, choiceImages.length) : 0}
                  {@const currentImage = hasMultipleImages ? choiceImages[choiceIndex].image : getHeroImageForSlot(slot)}
                  {@const currentName = hasMultipleImages ? choiceImages[choiceIndex].name : (slot.options[0] || slot.hero)}
                  {@const currentSkills = getCurrentSkills(slot, currentName, hasMultipleImages)}
                  {@const currentWikiUrl = getHeroWikiUrl(currentName)}
                  <div class={[
                    'flex flex-col gap-2 rounded-sm border p-3 transition-all duration-[150ms] ease-out hover:border-[var(--dd-gold-dim)] hover:bg-[var(--dd-card-hover)] hover:[box-shadow:inset_0_1px_0_var(--dd-highlight-light),0_4px_12px_var(--dd-shadow-lightest)]',
                    isFlexible ? 'border-[var(--dd-panel-border)]/50 bg-[var(--dd-bg)]/50 opacity-75' : 'border-[var(--dd-panel-border)] bg-[var(--dd-panel)]'
                  ]}
                    role="group"
                    onmouseenter={() => {
                      if (hasMultipleImages) {
                        hoveredSlotKey = slotKey;
                        frozenCycleTick = getOffsetCycleTick(cycleTick, slotCycleOffsets[slotKey]);
                        releaseSlotKey = null;
                        releaseCycleTick = null;
                      }
                    }}
                    onmouseleave={() => {
                      if (hoveredSlotKey === slotKey) {
                        slotCycleOffsets = {
                          ...slotCycleOffsets,
                          [slotKey]: getResumeCycleOffset(cycleTick, frozenCycleTick)
                        };
                        releaseSlotKey = slotKey;
                        releaseCycleTick = cycleTick + 1;
                      }
                    }}
                  >
                    <!-- Portrait + Name (vertical centered) -->
                    <div class="flex flex-col items-center gap-2">
                      <!-- Portrait -->
                      <div class="relative w-14 h-14">
                        {#if currentImage}
                          {#if currentWikiUrl}
                            <a href={currentWikiUrl} target="_blank" rel="noopener noreferrer" aria-label="Open {currentName} wiki page">
                              <img
                                src="{base}{currentImage}"
                                alt={currentName}
                                class="absolute inset-0 z-10 w-full h-full object-cover rounded-sm border-2 border-[var(--dd-gold-dim)] transition-opacity duration-300 hover:border-[var(--dd-gold)]"
                                onerror={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                              />
                            </a>
                          {:else}
                            <img
                              src="{base}{currentImage}"
                              alt={currentName}
                              class="absolute inset-0 z-10 w-full h-full object-cover rounded-sm border-2 border-[var(--dd-gold-dim)] transition-opacity duration-300"
                              onerror={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                            />
                          {/if}
                        {/if}
                        <div class="absolute inset-0 grid place-items-center rounded-sm border-2 font-[DwarvenAxeBB] text-lg {isFlexible ? 'border-[var(--dd-panel-border)] bg-[var(--dd-bg)] text-[var(--dd-faint)]' : 'border-[var(--dd-gold-dim)] bg-[var(--dd-slot-bg)] text-[var(--dd-gold)]'}">
                          {#if isFlexible}
                            <span class="text-2xl">?</span>
                          {:else}
                            {getInitials(currentName)}
                          {/if}
                        </div>
                      </div>

                      <!-- Choice indicators -->
                      {#if hasMultipleImages}
                        <div class="flex gap-1">
                          {#each choiceImages as _, i}
                            <span class="w-1.5 h-1.5 rounded-full transition-colors duration-300 {i === choiceIndex ? 'bg-[var(--dd-gold)]' : 'bg-[var(--dd-panel-border)]'}"></span>
                          {/each}
                        </div>
                      {/if}

                      <!-- Hero name -->
                      <div class="text-center">
                        {#if isChoice}
                          {#if hasMultipleImages}
                            {#if currentWikiUrl}
                              <a href={currentWikiUrl} target="_blank" rel="noopener noreferrer" class="text-sm font-semibold text-[var(--dd-ink)] leading-tight [text-decoration:none] hover:text-[var(--dd-gold-bright)]">{currentName}</a>
                            {:else}
                              <p class="text-sm font-semibold text-[var(--dd-ink)] leading-tight">{currentName}</p>
                            {/if}
                          {:else}
                            <p class="text-sm text-[var(--dd-ink)] leading-tight">
                              {#each slot.options as option, i}
                                {#if option.toLowerCase().includes('another') || option.toLowerCase().includes('frontline') || option.toLowerCase().includes('support')}
                                  <span class="text-[var(--dd-muted)] italic">{option}</span>
                                {:else if getHeroWikiUrl(option)}
                                  <a href={getHeroWikiUrl(option)} target="_blank" rel="noopener noreferrer" class="font-semibold text-[var(--dd-ink)] [text-decoration:none] hover:text-[var(--dd-gold-bright)]">{option}</a>
                                {:else}
                                  <span class="font-semibold">{option}</span>
                                {/if}
                                {#if i < slot.options.length - 1}
                                  <br />
                                  <strong class="text-[var(--dd-gold)]">OR</strong>
                                  <br />
                                {/if}
                              {/each}
                            </p>
                          {/if}
                        {:else if isFlexible}
                          <p class="text-sm text-[var(--dd-muted)] italic leading-tight">{slot.hero}</p>
                        {:else}
                          {#if currentWikiUrl}
                            <a href={currentWikiUrl} target="_blank" rel="noopener noreferrer" class="text-sm font-semibold text-[var(--dd-ink)] leading-tight [text-decoration:none] hover:text-[var(--dd-gold-bright)]">{slot.hero}</a>
                          {:else}
                            <p class="text-sm font-semibold text-[var(--dd-ink)] leading-tight">{slot.hero}</p>
                          {/if}
                        {/if}
                      </div>
                    </div>

                    {#if currentSkills.length}
                      <!-- Skills (vertical stack) -->
                      <div class="flex flex-col gap-1 mt-1">
                        {#each currentSkills as skill}
                          {#if skill.alternatives && skill.alternatives.length > 1}
                            <span class="inline-block px-2 py-0.5 text-xs rounded bg-[var(--dd-tag-bg)] border border-[var(--dd-tag-border)] text-[var(--dd-tag-text)] text-center leading-tight">
                              {#each skill.alternatives as alt, i}
                                {alt}{#if i < skill.alternatives.length - 1}<br /><strong>OR</strong><br />{/if}
                              {/each}
                            </span>
                          {:else}
                            <span class="inline-block px-2 py-0.5 text-xs rounded bg-[var(--dd-tag-bg)] border border-[var(--dd-tag-border)] text-[var(--dd-tag-text)] text-center leading-tight">{skill.name}</span>
                          {/if}
                        {/each}
                      </div>
                    {/if}
                  </div>
                {/key}
              {/each}
            </div>

            <!-- Strategy -->
            <div class="mt-5 pt-4 border-t border-[var(--dd-panel-border)]">
              <h4 class="mb-2 text-xs uppercase tracking-[0.14em] text-[var(--dd-faint)]">Strategy</h4>
              <ul class="grid gap-1.5">
                {#each comp.strategy as note}
                  <li class="flex gap-2 text-sm text-[var(--dd-muted)]">
                    <span class="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-[var(--dd-muted)]"></span>
                    <span>{note}</span>
                  </li>
                {/each}
              </ul>
            </div>

            <!-- Source -->
            <p class="mt-4 text-xs text-[var(--dd-faint)] italic">Source: {comp.source}</p>
          </article>
        {/each}
      {:else}
        <div class={[panelInnerClass, 'py-10 text-center']}>
          <h3 class={[titleClass, 'text-2xl']}>No compositions found</h3>
          <p class="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--dd-muted)]">
            No team compositions currently include this hero. Try selecting a different hero or view all compositions.
          </p>
        </div>
      {/if}
    </section>

    <footer class="py-10 text-center text-xs tracking-wide text-[var(--dd-faint)]">
      Game content, images and materials are trademarks and copyrights of Red Hook Studios, creators of Darkest Dungeon.
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
</main>
