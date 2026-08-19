/* Application shell: hash router (including dynamic team/article routes),
   content rendering, search, live-data simulation and the smaller interactive
   modules (pick'em poll, reaction test, stream chat). */

(function () {
  'use strict';

  const D = TRIBUNA_DATA;
  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.prototype.slice.call((ctx || document).querySelectorAll(sel));

  const t    = k => I18N.t(k);
  const p    = v => I18N.pick(v);
  const fmt  = n => n.toLocaleString('en-US');
  const randInt = (a, b) => Math.floor(a + Math.random() * (b - a + 1));
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  /* Escapes anything that reaches innerHTML from a non-literal source. */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, c =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function setLive(el, value) {
    if (!el || el.textContent === String(value)) return;
    el.textContent = value;
    el.classList.remove('value-flash');
    void el.offsetWidth;
    el.classList.add('value-flash');
  }

  /* The drawer animates clip-path, so it needs explicit open/closed classes
     rather than Tailwind's `hidden` (display:none can't transition). */
  function openDrawer() {
    const nav = $('#mobile-nav');
    if (!nav) return;
    nav.classList.remove('hidden', 'is-closed');
    void nav.offsetWidth;
    nav.classList.add('is-open');
  }

  function closeDrawer() {
    const nav = $('#mobile-nav');
    if (!nav) return;
    nav.classList.remove('is-open');
    nav.classList.add('is-closed');
  }

  /* A language change re-renders every string on the page at once. Dipping the
     view for one frame turns a teleport into a transition. */
  function maskLanguageSwap(render) {
    const body = document.body;
    body.classList.add('lang-swapping');
    setTimeout(() => {
      render();
      requestAnimationFrame(() => body.classList.remove('lang-swapping'));
    }, 140);
    // rAF does not fire on a hidden tab; make sure the class never sticks.
    setTimeout(() => body.classList.remove('lang-swapping'), 600);
  }

  const teamBySlug = slug => D.teams.filter(x => x.slug === slug)[0] || null;
  const newsById   = id   => D.news.filter(x => x.id === id)[0] || null;

  /* True if `needle` (already lowercased) matches `gameCode`'s Latin tag OR
     any of its known spellings, Cyrillic included — see D.disciplineAliases. */
  function matchesDiscipline(gameCode, needle) {
    if (!gameCode) return false;
    if (gameCode.toLowerCase().indexOf(needle) !== -1) return true;
    const aliases = (D.disciplineAliases || {})[gameCode] || [];
    return aliases.some(a => a.indexOf(needle) !== -1);
  }

  /* ====================================================================== */
  /*  Shared fragments                                                      */
  /* ====================================================================== */

  const TONES = {
    primary:   'text-primary-fixed-dim border-primary/30',
    tertiary:  'text-tertiary-container border-tertiary-container/30',
    secondary: 'text-secondary-fixed border-secondary-fixed/30'
  };

  function catChip(cat, tone) {
    return `<span class="${TONES[tone] || TONES.primary} font-label-caps text-[11px] border px-2 py-0.5 rounded">${t('cat.' + cat)}</span>`;
  }

  /* ====================================================================== */
  /*  Home                                                                  */
  /* ====================================================================== */

  function renderTicker() {
    const wrap = $('#ticker');
    if (!wrap) return;
    const items = D.tickerSeeds.map(s =>
      `<span class="ticker__item"><span class="text-on-surface-variant">${p(s.label)}:</span> <span class="text-secondary">${esc(s.value)}</span></span>
       <span class="ticker__item text-outline-variant">/</span>`
    ).join('');
    wrap.innerHTML = items + items;   // duplicated so the marquee has no seam
  }

  function matchCard(m) {
    const [a, b] = m.teams;
    const leader = a.score === b.score ? -1 : (a.score > b.score ? 0 : 1);
    const cls = i => i === leader
      ? 'text-primary-fixed-dim drop-shadow-[0_0_12px_rgba(168,85,247,0.55)]'
      : 'text-on-surface';

    const side = tm => `
      <div class="flex flex-col items-center gap-2 w-20">
        ${tm.slug ? `<a href="#/team/${tm.slug}" data-route="#/team/${tm.slug}" class="hover:opacity-80 transition-opacity">${tribunaEmblem(tm.mark, tm.tint, 44)}</a>`
                  : tribunaEmblem(tm.mark, tm.tint, 44)}
        <span class="font-headline-md text-[15px] text-on-surface">${esc(tm.name)}</span>
      </div>`;

    return `
      <article class="glass-panel rounded-xl overflow-hidden hover-glow group">
        <div class="relative h-48 overflow-hidden cursor-pointer" data-route="#/live">
          <div class="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
               style="background-image:url('${m.image}')"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-surface-charcoal via-transparent to-transparent"></div>
          <div class="absolute top-4 left-4 bg-live text-black font-label-caps px-3 py-1 rounded-full text-[11px] font-bold live-pulse">LIVE</div>
          <div class="absolute bottom-4 left-4 bg-black/80 px-3 py-1 rounded text-[11px] font-label-caps text-on-surface">${p(m.stage)}</div>
          <div class="absolute bottom-4 right-4 bg-black/80 px-3 py-1 rounded text-[11px] font-label-caps text-secondary flex items-center gap-1">
            <span class="material-symbols-outlined text-[14px]">group</span>
            <span data-viewers="${m.id}">${Math.round(m.viewers / 1000)}K</span>
          </div>
        </div>
        <div class="p-6">
          <div class="text-center mb-5">
            <span class="font-label-caps text-on-surface-variant text-[11px] tracking-widest">${esc(m.tournament)}</span>
          </div>
          <div class="flex justify-between items-center">
            ${side(a)}
            <div class="font-display-xl text-[44px] ${cls(0)}" data-score="${m.id}-0">${a.score}</div>
            <div class="font-headline-md text-[16px] text-on-surface-variant">VS</div>
            <div class="font-display-xl text-[44px] ${cls(1)}" data-score="${m.id}-1">${b.score}</div>
            ${side(b)}
          </div>
        </div>
      </article>`;
  }

  function renderMatches() {
    const grid = $('#live-grid');
    if (grid) grid.innerHTML = D.liveMatches.map(matchCard).join('');
  }

  function renderViewership() {
    const host = $('#chart-viewership');
    if (!host) return;
    const v = D.viewership;
    Charts.areaResponsive(host, v.values, {
      labels: p(v.days), suffix: 'K', color: '#a855f7', min: 0
    });
    $('#viewership-peak').textContent   = v.peak + 'K';
    $('#viewership-avg').textContent    = v.avg + 'K';
    $('#viewership-growth').textContent = '+' + v.growth + '%';
  }

  function renderPrizeSplit() {
    const host = $('#chart-prize');
    if (!host) return;
    const total = D.prizeSplit.reduce((s, x) => s + x.value, 0);
    host.innerHTML = Charts.donut(D.prizeSplit, {
      centerValue: '$' + total.toFixed(1) + 'M',
      centerLabel: t('home.totalPrize')
    });
  }

  function renderTopRanked() {
    const host = $('#top-ranked');
    if (!host) return;
    host.innerHTML = D.teams.slice(0, 5).map(tm => `
      <a href="#/team/${tm.slug}" data-route="#/team/${tm.slug}"
         class="flex items-center gap-4 p-3 rounded-lg border border-transparent hover:border-primary/40 hover:bg-white/[0.03] transition-colors">
        <span class="font-stat-value text-[18px] text-outline w-7">${tm.rank}</span>
        ${tribunaEmblem(tm.mark, tm.tint, 34)}
        <span class="flex-1 min-w-0">
          <span class="block font-headline-md text-[17px] text-on-surface truncate">${esc(tm.name)}</span>
          <span class="block font-label-caps text-[10px] text-on-surface-variant">${esc(tm.game)}</span>
        </span>
        <span class="hidden sm:block w-[110px]">${Charts.sparkline(tm.trend.slice(-8), { color: tm.tint })}</span>
        <span class="font-stat-value text-[15px] text-primary-fixed-dim w-14 text-right">${tm.win.toFixed(1)}%</span>
      </a>`).join('');
  }

  function renderSchedule() {
    const host = $('#home-schedule');
    if (!host) return;
    host.innerHTML = D.upcoming.map(u => `
      <div class="match-row" data-route="#/live">
        <span class="font-stat-value text-[15px] text-primary-fixed-dim w-14">${u.time}</span>
        <span class="flex-1 min-w-0">
          <span class="block font-headline-md text-[17px] text-on-surface truncate">${esc(u.a)} <span class="text-on-surface-variant text-[14px]">vs</span> ${esc(u.b)}</span>
          <span class="block font-label-caps text-[10px] text-outline mt-1">${esc(u.event)}</span>
        </span>
        <span class="font-label-caps text-[10px] text-on-surface-variant border border-border-subtle rounded px-2 py-1 whitespace-nowrap">${esc(u.game)}</span>
      </div>`).join('');
  }

  function renderTrending() {
    const host = $('#home-trending');
    if (!host) return;
    host.innerHTML = D.news.slice(0, 3).map((n, i) => `
      <a href="#/article/${n.id}" data-route="#/article/${n.id}"
         class="flex gap-4 p-4 rounded-lg border border-border-subtle bg-surface-charcoal card-hover">
        <span class="font-display-xl text-[34px] text-outline-variant leading-none">${i + 1}</span>
        <span class="min-w-0">
          <span class="block mb-2">${catChip(n.cat, n.tone)}</span>
          <span class="block font-headline-md text-[18px] text-on-surface leading-snug">${p(n.title)}</span>
        </span>
      </a>`).join('');
  }

  function renderUpcoming() {
    const list = $('#upcoming-list');
    if (!list) return;
    list.innerHTML = D.upcoming.slice(0, 3).map(u => `
      <div class="flex items-center justify-between bg-surface-charcoal/50 p-3 rounded border border-border-subtle/50 hover:bg-surface-charcoal hover:border-primary/40 transition-colors cursor-pointer">
        <div class="flex items-center gap-3 min-w-0">
          <span class="font-stat-value text-[14px] text-on-surface-variant w-12 shrink-0">${u.time}</span>
          <span class="font-label-caps text-[12px] text-on-surface truncate">${esc(u.a)} — ${esc(u.b)}</span>
        </div>
        <span class="font-label-caps text-[10px] text-outline-variant shrink-0 ml-3">${esc(u.event)}</span>
      </div>`).join('');
  }

  function renderSpiritEmblem() {
    const slot = $('#spirit-emblem');
    if (slot) slot.innerHTML = tribunaEmblem('TS', '#ffd166', 176);
  }

  /* ====================================================================== */
  /*  Teams list                                                            */
  /* ====================================================================== */

  function teamCard(tm) {
    return `
      <article class="group bg-surface-charcoal rounded-xl border border-border-subtle overflow-hidden relative card-hover"
               data-game="${esc(tm.game)}">
        <div class="absolute inset-0 bg-gradient-to-b from-glass-highlight to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        <a href="#/team/${tm.slug}" data-route="#/team/${tm.slug}" class="block p-6 relative z-10 h-full flex flex-col">
          <div class="flex justify-between items-start mb-8">
            ${tribunaEmblem(tm.mark, tm.tint, 64)}
            <span class="bg-surface-bright text-on-surface font-label-caps text-[11px] px-3 py-1 rounded border border-border-subtle">${esc(tm.game)}</span>
          </div>
          <h3 class="font-headline-md text-[26px] text-on-surface mb-1 group-hover:text-primary-fixed-dim transition-colors">${esc(tm.name)}</h3>
          <p class="font-body-md text-body-md text-on-surface-variant mb-6 flex-grow">${p(tm.blurb)}</p>
          <div class="grid grid-cols-2 gap-4 mb-6 pt-6 border-t border-border-subtle">
            <div>
              <p class="font-label-caps text-[11px] text-on-surface-variant mb-1">${t('teams.rank')}</p>
              <p class="font-stat-value text-stat-value text-on-surface">#${tm.rank}</p>
            </div>
            <div>
              <p class="font-label-caps text-[11px] text-on-surface-variant mb-1">${t('teams.winRate')}</p>
              <p class="font-stat-value text-[20px] text-primary-fixed-dim">${tm.win.toFixed(1)}%</p>
            </div>
          </div>
          <div class="pt-4 border-t border-border-subtle">
            <div class="flex justify-between items-center mb-3">
              <p class="font-label-caps text-[11px] text-on-surface-variant">${t('teams.form')}</p>
              <span class="font-label-caps text-[11px] text-primary-fixed-dim flex items-center gap-1">
                ${t('teams.viewTeam')} <span class="material-symbols-outlined text-[14px]">arrow_forward</span>
              </span>
            </div>
            ${Charts.form(tm.form.slice(-5), t('team.win'), t('team.loss'))}
          </div>
        </a>
      </article>`;
  }

  function renderTeams() {
    const grid = $('#teams-grid');
    if (!grid) return;
    grid.innerHTML = D.teams.map(teamCard).join('');
    Charts.animate(grid);
  }

  /* ====================================================================== */
  /*  Team profile                                                          */
  /* ====================================================================== */

  function renderTeamPage(slug) {
    const host = $('#team-detail');
    const tm = teamBySlug(slug);

    if (!tm) {
      host.innerHTML = `<div class="py-32 text-center">
        <p class="font-headline-md text-[28px] text-on-surface mb-6">${t('team.notFound')}</p>
        <button data-route="#/teams" class="btn-secondary clip-corner font-label-caps text-label-caps px-8 py-3">${t('team.back')}</button>
      </div>`;
      return;
    }

    const monthLabels = tm.trend.map((_, i) => I18N.date(1, i).split(' ')[1]);
    const wins = tm.form.filter(Boolean).length;

    const stat = (label, value, accent) => `
      <div class="panel p-5">
        <div class="font-label-caps text-[10px] text-on-surface-variant mb-2">${label}</div>
        <div class="font-stat-value text-[22px] ${accent || 'text-on-surface'}">${value}</div>
      </div>`;

    host.innerHTML = `
      <button data-route="#/teams" class="font-label-caps text-[12px] text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 mb-8">
        <span class="material-symbols-outlined text-[16px]">arrow_back</span>${t('team.back')}
      </button>

      <!-- Identity -->
      <header class="panel relative overflow-hidden mb-gutter">
        <div class="absolute inset-0 opacity-[0.07]" style="background:radial-gradient(circle at 15% 20%, ${tm.tint}, transparent 60%)"></div>
        <div class="hud-bracket tl"></div><div class="hud-bracket br"></div>
        <div class="relative p-8 md:p-12 flex flex-col lg:flex-row lg:items-center gap-10">
          <div class="shrink-0">${tribunaEmblem(tm.mark, tm.tint, 132)}</div>
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-3 mb-4">
              <span class="font-label-caps text-[11px] px-3 py-1 rounded border border-border-subtle text-on-surface">${esc(tm.game)}</span>
              <span class="font-label-caps text-[11px] text-on-surface-variant">${p(tm.region)}</span>
            </div>
            <h1 class="font-display-xl text-[clamp(36px,5vw,64px)] text-on-surface mb-4">${esc(tm.name)}</h1>
            <p class="font-body-lg text-[clamp(15px,1.3vw,20px)] text-on-surface-variant max-w-2xl">${p(tm.blurb)}</p>
          </div>
          <div class="shrink-0 text-center lg:text-right">
            <div class="font-label-caps text-[11px] text-on-surface-variant mb-1">${t('teams.worldRank')}</div>
            <div class="font-display-xl text-[56px] leading-none" style="color:${tm.tint}">#${tm.rank}</div>
          </div>
        </div>
      </header>

      <!-- Key numbers -->
      <div class="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-gutter">
        ${stat(t('teams.winRate'), tm.win.toFixed(1) + '%', 'text-primary-fixed-dim')}
        ${stat(t('team.matches'), tm.played)}
        ${stat(t('team.titles'), tm.titles)}
        ${stat(t('team.earnings'), tm.earnings)}
        ${stat(t('team.founded'), tm.founded)}
        ${stat(t('team.streak'), tm.streak + ' ' + t('team.win'), 'text-live')}
      </div>

      <!-- About + Upcoming: the two things a visitor actually came for,
           so they sit right under the headline numbers instead of at the
           bottom of a long scroll. -->
      <div class="grid lg:grid-cols-2 gap-gutter mb-gutter">
        <div class="panel p-6 md:p-8">
          <h2 class="font-headline-md text-[22px] text-on-surface mb-4">${t('team.about')}</h2>
          ${p(tm.about).map(par => `<p class="font-body-md text-[15px] leading-relaxed text-on-surface-variant mb-4">${par}</p>`).join('')}
        </div>
        <div>
          <div class="mb-4 flex items-center gap-3">
            <span class="w-2.5 h-2.5 rounded-full bg-live live-pulse"></span>
            <h2 class="font-headline-md text-[22px] text-on-surface">${t('team.upcoming')}</h2>
          </div>
          <div class="flex flex-col gap-3">
            ${tm.fixtures.map((f, i) => `
              <div class="match-row">
                <span class="text-center w-14">
                  <span class="block font-label-caps text-[10px] text-on-surface-variant">${I18N.date(f.d, f.m)}</span>
                  <span class="block font-stat-value text-[15px] text-primary-fixed-dim mt-1">${f.time}</span>
                </span>
                <span class="flex-1 min-w-0">
                  <span class="block font-headline-md text-[18px] text-on-surface truncate">${esc(tm.name)} <span class="text-on-surface-variant text-[14px]">vs</span> ${esc(f.opp)}</span>
                  <span class="block font-label-caps text-[10px] text-outline mt-1">${esc(f.event)}</span>
                </span>
                <button type="button" class="reminder-bell${window.Prefs && Prefs.isSet('team-fixture.' + tm.slug + '.' + i) ? ' is-armed' : ''}"
                        data-remind="team-fixture.${tm.slug}.${i}"
                        aria-label="${t('common.remind')}"
                        aria-pressed="${window.Prefs && Prefs.isSet('team-fixture.' + tm.slug + '.' + i) ? 'true' : 'false'}">
                  <span class="material-symbols-outlined text-[18px]">notifications</span>
                </button>
              </div>`).join('')}
          </div>
        </div>
      </div>

      <!-- Analytics -->
      <div class="mb-4 flex items-center gap-3">
        <div class="accent-rule"></div>
        <h2 class="font-headline-md text-[24px] text-on-surface">${t('team.analytics')}</h2>
      </div>

      <div class="grid lg:grid-cols-3 gap-gutter mb-gutter">
        <div class="panel p-6 lg:col-span-2">
          <h3 class="font-headline-md text-[20px] text-on-surface">${t('team.winTrend')}</h3>
          <p class="font-body-md text-[13px] text-on-surface-variant mb-6">${t('team.winTrendSub')}</p>
          <div id="team-trend" data-chart-host></div>
        </div>
        <div class="panel p-6 flex flex-col">
          <h3 class="font-headline-md text-[20px] text-on-surface">${t(tm.poolKey)}</h3>
          <p class="font-body-md text-[13px] text-on-surface-variant mb-6">${t(tm.poolKey === 'team.sidePool' ? 'team.sidePoolSub' : 'team.mapPoolSub')}</p>
          <div id="team-pools" class="flex-grow"></div>
          <div class="mt-8 pt-6 border-t border-border-subtle">
            <p class="font-label-caps text-[11px] text-on-surface-variant mb-3">${t(tm.splitKey || 'team.sideSplit')}</p>
            <div id="team-split"></div>
          </div>
        </div>
      </div>

      <!-- Roster -->
      <div class="panel overflow-hidden mb-gutter">
        <div class="flex items-center justify-between p-6 pb-4">
          <h3 class="font-headline-md text-[20px] text-on-surface">${t('teams.roster')}</h3>
          <span class="font-label-caps text-[11px] text-on-surface-variant">${t('team.coach')}: <span class="text-on-surface">${esc(tm.coach)}</span></span>
        </div>
        <div class="roster-row border-t border-border-subtle bg-white/[0.02]">
          <span></span>
          <span class="font-label-caps text-[10px] text-on-surface-variant">${t('team.player')}</span>
          <span class="font-label-caps text-[10px] text-on-surface-variant">${t('team.role')}</span>
          <span class="font-label-caps text-[10px] text-on-surface-variant text-right">${t('team.rating')}</span>
          <span class="font-label-caps text-[10px] text-on-surface-variant text-right">${t('team.kd')}</span>
        </div>
        ${tm.roster.map(pl => `
          <div class="roster-row">
            ${tribunaEmblem(pl.nick.slice(0, 2).toUpperCase(), tm.tint, 34)}
            <span class="font-body-md text-[15px] text-on-surface truncate">${esc(pl.nick)}</span>
            <span class="font-label-caps text-[11px] text-on-surface-variant">${p(pl.role)}</span>
            <span class="font-stat-value text-[14px] text-right ${pl.rating >= 1.15 ? 'text-primary-fixed-dim' : 'text-on-surface'}">${pl.rating.toFixed(2)}</span>
            <span class="font-stat-value text-[14px] text-on-surface-variant text-right">${esc(pl.kd)}</span>
          </div>`).join('')}
      </div>

      <!-- Recent form + results: retrospective, so it closes out the page. -->
      <div class="grid lg:grid-cols-3 gap-gutter">
        <div class="panel p-6">
          <div class="flex items-baseline justify-between mb-4">
            <h3 class="font-headline-md text-[20px] text-on-surface">${t('team.recentForm')}</h3>
            <span class="font-stat-value text-[15px] text-primary-fixed-dim">${wins}-${10 - wins}</span>
          </div>
          <div id="team-form"></div>
        </div>
        <div class="lg:col-span-2">
          <div class="mb-4 flex items-center gap-3">
            <div class="accent-rule"></div>
            <h3 class="font-headline-md text-[22px] text-on-surface">${t('team.results')}</h3>
          </div>
          <div class="flex flex-col gap-3">
            ${tm.recent.map(r => `
              <div class="match-row">
                <span class="font-label-caps text-[10px] text-on-surface-variant w-14 text-center">${I18N.date(r.d, r.m)}</span>
                <span class="flex-1 min-w-0">
                  <span class="block font-headline-md text-[18px] text-on-surface truncate">${esc(r.opp)}</span>
                  <span class="block font-label-caps text-[10px] text-outline mt-1">${esc(r.event)}</span>
                </span>
                <span class="font-stat-value text-[16px] ${r.win ? 'text-primary-fixed-dim' : 'text-secondary'}">${esc(r.score)}</span>
                <span class="font-label-caps text-[11px] w-6 text-center ${r.win ? 'text-primary-fixed-dim' : 'text-secondary'}">${r.win ? t('team.win') : t('team.loss')}</span>
              </div>`).join('')}
          </div>
        </div>
      </div>`;

    // Charts are injected after the shell exists so their zero-state is in the DOM.
    Charts.areaResponsive($('#team-trend'), tm.trend, {
      labels: monthLabels, suffix: '%', color: tm.tint, min: 30, max: 100
    });
    $('#team-pools').innerHTML  = Charts.bars(tm.pools, { color: tm.tint });
    $('#team-split').innerHTML  = Charts.split(tm.splitVals[0], tm.splitVals[1], {
      labelA: p(tm.splitA), labelB: p(tm.splitB), colorA: tm.tint
    });
    $('#team-form').innerHTML   = Charts.form(tm.form, t('team.win'), t('team.loss'));

    Charts.animate(host);
  }

  /* ====================================================================== */
  /*  News                                                                  */
  /* ====================================================================== */

  function newsCard(n) {
    return `
      <article class="bg-surface-charcoal rounded-lg border border-border-subtle overflow-hidden relative group card-hover glass-border-top"
               data-cat="${n.cat}">
        <a href="#/article/${n.id}" data-route="#/article/${n.id}" class="block">
          <div class="h-64 bg-cover bg-center w-full transition-transform duration-700 group-hover:scale-105" style="background-image:url('${n.image}')"></div>
          <div class="absolute inset-x-0 top-0 h-64 bg-gradient-to-t from-surface-charcoal via-surface-charcoal/20 to-transparent pointer-events-none"></div>
          <div class="p-6 relative z-10 -mt-16 bg-surface-charcoal/90 backdrop-blur-sm">
            <div class="flex items-center gap-3 mb-3">
              ${catChip(n.cat, n.tone)}
              <span class="font-stat-value text-[11px] text-on-surface-variant">${p(n.age)}</span>
            </div>
            <h3 class="font-headline-md text-[24px] text-on-surface mb-3 group-hover:text-primary-fixed-dim transition-colors">${p(n.title)}</h3>
            <p class="font-body-md text-[14px] text-on-surface-variant mb-4 line-clamp-2">${p(n.excerpt)}</p>
            <div class="flex items-center gap-4 text-on-surface-variant font-label-caps text-[11px]">
              <span class="flex items-center gap-1"><span class="material-symbols-outlined text-base">schedule</span>${n.read} ${t('news.minRead')}</span>
              <span class="text-primary-fixed-dim flex items-center gap-1">${t('news.readMore')}<span class="material-symbols-outlined text-[14px]">arrow_forward</span></span>
            </div>
          </div>
        </a>
      </article>`;
  }

  function renderNews() {
    const grid = $('#news-grid');
    if (grid) grid.innerHTML = D.news.map(newsCard).join('');

    const hero = $('#news-hero');
    if (hero) {
      const b = D.breaking;
      hero.style.backgroundImage = `url('${b.image}')`;
      $('#news-hero-title').innerHTML = p(b.title);
      $('#news-hero-age').textContent = p(b.age);
      $('#news-hero-comments').textContent = b.comments + ' ' + t('common.comments');
      $('#news-hero-link').dataset.route = '#/article/' + b.id;

      const shareBtn = $('#news-hero-share');
      if (shareBtn) {
        shareBtn.dataset.shareUrl = location.origin + location.pathname + '#/article/' + b.id;
        shareBtn.dataset.shareTitle = p(b.title);
      }
    }
  }

  function renderArticle(id) {
    const host = $('#article-detail');
    const n = newsById(id);

    if (!n) {
      host.innerHTML = `<div class="py-32 text-center">
        <p class="font-headline-md text-[28px] text-on-surface mb-6">${t('news.notFound')}</p>
        <button data-route="#/news" class="btn-secondary clip-corner font-label-caps text-label-caps px-8 py-3">${t('news.back')}</button>
      </div>`;
      return;
    }

    const paras = p(n.body);
    const mid = Math.ceil(paras.length / 2);
    const related = D.news.filter(x => x.id !== n.id).slice(0, 3);
    const shareUrl = location.origin + location.pathname + '#/article/' + n.id;
    const isSaved = window.Prefs && Prefs.isSet('saved.' + n.id);

    host.innerHTML = `
      <button data-route="#/news" class="font-label-caps text-[12px] text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 mb-8">
        <span class="material-symbols-outlined text-[16px]">arrow_back</span>${t('news.back')}
      </button>

      <div class="relative w-full h-[420px] rounded-xl overflow-hidden border border-border-subtle mb-12">
        <div class="absolute inset-0 bg-cover bg-center" style="background-image:url('${n.image}')"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-transparent"></div>
        <div class="absolute bottom-0 left-0 p-8 md:p-12 w-full">
          <div class="flex flex-wrap items-center gap-3 mb-5">
            ${catChip(n.cat, n.tone)}
            <span class="font-stat-value text-[12px] text-on-surface-variant">${p(n.age)}</span>
            <span class="font-label-caps text-[11px] text-outline">${n.read} ${t('news.minRead')}</span>
            <button type="button" class="font-label-caps text-[11px] text-outline hover:text-primary transition-colors flex items-center gap-1" data-jump="#comments-section">
              <span class="material-symbols-outlined text-[15px]">chat_bubble</span><span id="comments-count">${n.comments || 0}</span>
            </button>
          </div>
          <h1 class="font-display-xl text-[clamp(28px,4.2vw,56px)] text-on-surface max-w-4xl">${p(n.title)}</h1>
        </div>
      </div>

      <div class="max-w-3xl mx-auto article-body">
        <p class="font-body-lg">${paras.slice(0, mid).join('</p><p class="font-body-lg">')}</p>
        ${n.quote ? `<blockquote class="article-quote font-body-lg">“${p(n.quote)}”</blockquote>` : ''}
        <p class="font-body-lg">${paras.slice(mid).join('</p><p class="font-body-lg">')}</p>

        <div class="flex items-center gap-3 pt-8 mt-4 border-t border-border-subtle">
          <button type="button" data-share data-share-url="${esc(shareUrl)}" data-share-title="${esc(p(n.title))}"
                  class="font-label-caps text-[11px] text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px]">share</span>${t('common.share')}
          </button>
          <button type="button" data-bookmark="${n.id}" aria-pressed="${isSaved ? 'true' : 'false'}"
                  class="bookmark-toggle font-label-caps text-[11px] text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2${isSaved ? ' is-saved' : ''}">
            <span class="material-symbols-outlined text-[20px]">bookmark</span>${t('common.save')}
          </button>
        </div>
      </div>

      <div id="comments-section" class="max-w-3xl mx-auto mt-20 pt-12 border-t border-border-subtle">
        <h2 class="font-headline-md text-[22px] text-on-surface mb-6">${t('comments.title')} · <span id="comments-count-h">0</span></h2>
        <form id="comment-form" class="comment-form mb-8">
          <input id="comment-input" type="text" maxlength="500" placeholder="${t('comments.placeholder')}" autocomplete="off"/>
          <button type="submit" aria-label="${t('comments.send')}"><span class="material-symbols-outlined text-[20px]">send</span></button>
        </form>
        <div id="comments-list"></div>
      </div>

      <div class="mt-24">
        <div class="mb-6 flex items-center gap-3">
          <div class="accent-rule"></div>
          <h2 class="font-headline-md text-[24px] text-on-surface">${t('news.related')}</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          ${related.map(newsCard).join('')}
        </div>
      </div>`;

    renderComments(n.id);
    initCommentForm(n.id);
  }

  /* ====================================================================== */
  /*  Filters                                                               */
  /* ====================================================================== */

  function bindFilters(groupSel, cardSel, attr) {
    const group = $(groupSel);
    if (!group) return;
    group.addEventListener('click', e => {
      const btn = e.target.closest('[data-filter]');
      if (!btn) return;
      $$('[data-filter]', group).forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const want = btn.dataset.filter;
      $$(cardSel).forEach(card => {
        const keep = want === 'ALL' || card.dataset[attr] === want;
        clearTimeout(card._filterT);
        if (keep) {
          card.style.display = '';
          void card.offsetWidth;
          card.classList.remove('filter-out');
        } else {
          card.classList.add('filter-out');
          // Leave it in flow while it fades, then pull it out.
          card._filterT = setTimeout(() => {
            if (card.classList.contains('filter-out')) card.style.display = 'none';
          }, 170);
        }
      });
    });
  }

  /* ====================================================================== */
  /*  Search                                                                */
  /* ====================================================================== */

  /* Instantiated twice — the desktop field in the nav bar and the one inside
     the mobile drawer — so both share the same matching and keyboard logic. */
  function initSearch(inputSel, resultsSel) {
    const input   = $(inputSel);
    const results = $(resultsSel);
    if (!input || !results) return;

    let cursor = -1;
    let matches = [];

    function close() {
      results.classList.remove('is-open');
      cursor = -1;
      // Keep it in the tree until the exit transition finishes.
      clearTimeout(results._hideT);
      results._hideT = setTimeout(() => { if (!results.classList.contains('is-open')) results.hidden = true; }, 200);
    }

    function open() {
      clearTimeout(results._hideT);
      results.hidden = false;
      void results.offsetWidth;
      results.classList.add('is-open');
    }

    function run(q) {
      const needle = q.trim().toLowerCase();
      if (!needle) { close(); return; }

      const hit = hay => hay.toLowerCase().indexOf(needle) !== -1;

      // Clubs are searchable by full name, tag, discipline (Cyrillic spellings
      // included — "лол"/"дота"/"пабг" all resolve), region and the short
      // names people actually type ("navi", "наві", "prx").
      const teams = D.teams.filter(tm =>
        hit(tm.name) || hit(tm.mark) || matchesDiscipline(tm.game, needle) || hit(p(tm.region)) ||
        (tm.alias || []).some(hit)
      ).slice(0, 5);

      const articles = D.news.filter(n =>
        hit(p(n.title)) || hit(p(n.excerpt)) || hit(t('cat.' + n.cat)) || matchesDiscipline(n.cat, needle)
      ).slice(0, 3);

      matches = teams.map(tm => ({ route: '#/team/' + tm.slug, tm }))
        .concat(articles.map(n => ({ route: '#/article/' + n.id, n })));

      if (!matches.length) {
        results.innerHTML = `<div class="search-empty">${t('common.noResults')}</div>`;
        open();
        return;
      }

      let html = '';
      if (teams.length) {
        html += `<div class="search-group font-label-caps">${t('nav.teams')}</div>`;
        html += teams.map((tm, i) => `
          <button class="search-item" data-index="${i}" data-route="#/team/${tm.slug}">
            ${tribunaEmblem(tm.mark, tm.tint, 34)}
            <span class="min-w-0 flex-1">
              <span class="block font-headline-md text-[16px] text-on-surface truncate">${esc(tm.name)}</span>
              <span class="block font-label-caps text-[10px] text-on-surface-variant">${esc(tm.game)} · #${tm.rank}</span>
            </span>
            <span class="font-stat-value text-[13px] text-primary-fixed-dim">${tm.win.toFixed(1)}%</span>
          </button>`).join('');
      }
      if (articles.length) {
        html += `<div class="search-group font-label-caps">${t('nav.news')}</div>`;
        html += articles.map((n, i) => `
          <button class="search-item" data-index="${teams.length + i}" data-route="#/article/${n.id}">
            <span class="material-symbols-outlined text-[20px] text-outline w-[34px] text-center">article</span>
            <span class="min-w-0 flex-1">
              <span class="block font-body-md text-[14px] text-on-surface line-clamp-2 leading-snug">${p(n.title)}</span>
              <span class="block font-label-caps text-[10px] text-on-surface-variant mt-1">${t('cat.' + n.cat)}</span>
            </span>
          </button>`).join('');
      }
      results.innerHTML = html;
      open();
    }

    function moveCursor(delta) {
      if (!matches.length) return;
      cursor = (cursor + delta + matches.length) % matches.length;
      $$('.search-item', results).forEach((el, i) => el.classList.toggle('is-cursor', i === cursor));
    }

    input.addEventListener('input', () => run(input.value));
    input.addEventListener('focus', () => { if (input.value.trim()) run(input.value); });

    input.addEventListener('keydown', e => {
      if (e.key === 'ArrowDown') { e.preventDefault(); moveCursor(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); moveCursor(-1); }
      else if (e.key === 'Enter') {
        const target = matches[cursor > -1 ? cursor : 0];
        if (target) { location.hash = target.route; input.value = ''; close(); input.blur(); }
      } else if (e.key === 'Escape') { close(); input.blur(); }
    });

    results.addEventListener('click', () => { input.value = ''; close(); });

    document.addEventListener('click', e => {
      if (!e.target.closest('.search-wrap')) close();
    });
  }

  /* ====================================================================== */
  /*  Live-data simulation                                                  */
  /* ====================================================================== */

  const sim = { viewers: {} };

  function startSimulation() {
    D.liveMatches.forEach(m => { sim.viewers[m.id] = m.viewers; });

    setInterval(() => {
      D.liveMatches.forEach(m => {
        sim.viewers[m.id] = Math.max(1000, sim.viewers[m.id] + randInt(-900, 1400));
        $$('[data-viewers="' + m.id + '"]').forEach(el => {
          el.textContent = Math.round(sim.viewers[m.id] / 1000) + 'K';
        });
      });
      const total = Object.keys(sim.viewers).reduce((a, k) => a + sim.viewers[k], 0) + 4700;
      $$('[data-total-viewers]').forEach(el => setLive(el, fmt(total)));
    }, 2200);

    setInterval(() => {
      const a = $('#live-round-a');
      const b = $('#live-round-b');
      if (!a || !b) return;
      const which = Math.random() < 0.52 ? a : b;
      const next = Number(which.textContent) + 1;
      if (next > 16) { a.textContent = '0'; b.textContent = '0'; return; }
      setLive(which, next);
    }, 7000);

    setInterval(() => {
      $$('[data-odds]').forEach(el => {
        const cur = parseFloat(el.textContent);
        setLive(el, Math.min(4.5, Math.max(1.05, cur + (Math.random() - 0.5) * 0.14)).toFixed(2));
      });
    }, 4000);
  }

  /* ====================================================================== */
  /*  Stream chat                                                           */
  /* ====================================================================== */

  let chatTimer = 0;

  function pushChatLine(box) {
    const user = pick(D.chatUsers);
    const now = new Date();
    const stamp = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    const line = document.createElement('div');
    line.className = 'chat-line font-body-md text-[14px] leading-relaxed';
    line.innerHTML =
      `<span class="font-label-caps text-[11px] text-outline-variant mr-2">${stamp}</span>` +
      (user.badge ? `<span class="material-symbols-outlined text-[14px] text-tertiary-fixed-dim align-middle mr-1 symbol-fill">${user.badge}</span>` : '') +
      `<span class="font-bold ${user.color} mr-2">${esc(user.name)}:</span>` +
      `<span class="text-on-surface">${esc(pick(p(D.chatLines)))}</span>`;
    box.appendChild(line);
    while (box.children.length > 40) box.removeChild(box.firstChild);
    box.scrollTop = box.scrollHeight;
  }

  function startChat() {
    const box = $('#chat-stream');
    if (!box || chatTimer) return;

    for (let i = 0; i < 6; i++) pushChatLine(box);
    chatTimer = setInterval(() => pushChatLine(box), 1600);

    const input = $('#chat-input');
    const send = () => {
      const text = input.value.trim();
      if (!text) return;
      const now = new Date();
      const stamp = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
      const line = document.createElement('div');
      line.className = 'chat-line font-body-md text-[14px] leading-relaxed bg-primary/10 border-l-2 border-electric pl-2 py-1';
      line.innerHTML =
        `<span class="font-label-caps text-[11px] text-outline-variant mr-2">${stamp}</span>` +
        `<span class="font-bold text-primary-fixed-dim mr-2">you:</span><span class="text-on-surface"></span>`;
      line.lastElementChild.textContent = text;   // textContent — chat input can't inject markup
      box.appendChild(line);
      box.scrollTop = box.scrollHeight;
      input.value = '';
    };
    input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
    $('#chat-send').addEventListener('click', send);
  }

  /* ====================================================================== */
  /*  Poll                                                                  */
  /* ====================================================================== */

  function initPoll() {
    const root = $('#poll');
    if (!root) return;

    const votes = { a: 6142, b: 5218 };
    const KEY = 'tribuna.poll.iem';
    let picked = null;
    try { picked = localStorage.getItem(KEY); } catch (e) { /* private mode */ }

    function paint() {
      const total = votes.a + votes.b;
      const pa = Math.round((votes.a / total) * 100);
      // scaleX, not width — the bar repaints on a 3.5s interval forever.
      $('[data-poll-fill="a"]', root).style.transform = 'scaleX(' + (pa / 100).toFixed(4) + ')';
      $('[data-poll-fill="b"]', root).style.transform = 'scaleX(' + ((100 - pa) / 100).toFixed(4) + ')';
      $('[data-poll-pct="a"]', root).textContent = pa + '%';
      $('[data-poll-pct="b"]', root).textContent = (100 - pa) + '%';
      $('[data-poll-total]', root).textContent = fmt(total) + ' ' + t('live.votes');
    }

    function lock() {
      $$('.poll-option', root).forEach(o => {
        o.classList.add('is-locked');
        o.classList.toggle('is-picked', o.dataset.pollOption === picked);
      });
      $('[data-poll-result]', root).hidden = false;
      $('[data-poll-hint]', root).hidden = true;
    }

    $$('.poll-option', root).forEach(opt => {
      opt.addEventListener('click', () => {
        if (picked) return;
        picked = opt.dataset.pollOption;
        votes[picked]++;
        try { localStorage.setItem(KEY, picked); } catch (e) { /* private mode */ }
        lock();
        paint();
      });
    });

    if (picked) { votes[picked]++; lock(); }
    paint();
    setInterval(() => { votes.a += randInt(0, 7); votes.b += randInt(0, 7); paint(); }, 3500);

    I18N.onChange(paint);
  }

  /* ====================================================================== */
  /*  Reaction test                                                         */
  /* ====================================================================== */

  /* ====================================================================== */
  /*  Share / remind / bookmark — delegated, so markup anywhere can opt in   */
  /*  just by carrying the right data- attribute.                           */
  /* ====================================================================== */

  function wireSocialActions() {
    // Remind: toggles a persisted flag and repaints whichever button (or
    // label span inside it) triggered the click.
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-remind]');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();   // these buttons often sit inside a [data-route] card

      const armed = Prefs.toggle(btn.dataset.remind);
      btn.classList.toggle('is-armed', armed);
      btn.setAttribute('aria-pressed', String(armed));
      const label = btn.querySelector('[data-remind-label]');
      if (label) label.textContent = armed ? t('common.reminderSet') : t('common.remind');

      Toast.show(armed ? t('common.reminderSet') : t('common.reminderOff'), { icon: 'bell' });
    });

    // Share: the Web Share API when the platform offers it (gives the visitor
    // their OS's own share sheet — Messages, mail, whatever they'd pick), a
    // clipboard copy otherwise. Either way it shares a real, working link to
    // the exact article, not the page the button happens to sit on.
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-share]');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();

      const url = btn.dataset.shareUrl || location.href;
      const title = btn.dataset.shareTitle || document.title;

      if (navigator.share) {
        navigator.share({ title, url }).catch(() => { /* user cancelled — not an error */ });
        return;
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url)
          .then(() => Toast.show(t('common.linkCopied'), { icon: 'link' }))
          .catch(() => Toast.show(t('common.linkCopied'), { icon: 'link' }));
      } else {
        Toast.show(t('common.linkCopied'), { icon: 'link' });
      }
    });

    // Bookmark: same persisted-flag pattern as remind, its own key namespace.
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-bookmark]');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();

      const saved = Prefs.toggle('saved.' + btn.dataset.bookmark);
      btn.classList.toggle('is-saved', saved);
      btn.setAttribute('aria-pressed', String(saved));
      Toast.show(saved ? t('common.saved') : t('common.unsaved'), { icon: 'bookmark' });
    });

    // A comment count is a promise ("there's a conversation here") — make it
    // keep that promise by jumping to the thread instead of sitting inert.
    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-jump]');
      if (!btn) return;
      const target = document.querySelector(btn.dataset.jump);
      if (!target) return;
      e.preventDefault();
      e.stopPropagation();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ====================================================================== */
  /*  Comments — seeded deterministically per article, visitor's own         */
  /*  comments persisted locally and appended on top. Same "real but scoped  */
  /*  to this browser" honesty as the stream chat and the pick'em poll.      */
  /* ====================================================================== */

  function seedComments(articleId, count) {
    // A stable hash of the id so the same article always shows the same seed
    // set (and picks) across reloads, without storing anything for it.
    let h = 0;
    for (let i = 0; i < articleId.length; i++) h = (h * 31 + articleId.charCodeAt(i)) >>> 0;

    const names = D.commenters;
    const lines = p(D.commentLines);
    const out = [];
    for (let i = 0; i < count; i++) {
      const name = names[(h + i * 7) % names.length];
      const line = lines[(h + i * 13) % lines.length];
      const hoursAgo = 1 + ((h >> (i + 2)) % 20);
      out.push({ name, text: line, age: hoursAgo });
    }
    return out;
  }

  function loadOwnComments(articleId) {
    try {
      const raw = localStorage.getItem('tribuna.comments.' + articleId);
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  }

  function saveOwnComments(articleId, list) {
    try { localStorage.setItem('tribuna.comments.' + articleId, JSON.stringify(list)); } catch (e) { /* private mode */ }
  }

  function renderComments(articleId) {
    const host = $('#comments-list');
    const countEl = $('#comments-count-h');
    if (!host) return;

    const seeded = seedComments(articleId, 3);
    const own = loadOwnComments(articleId);
    const total = seeded.length + own.length;
    if (countEl) countEl.textContent = String(total);

    // The row's text lands via textContent in a second pass, never via
    // innerHTML — a visitor's own comment must never be able to inject markup.
    const row = (name, ageLabel, isYou) => `
      <div class="comment-row${isYou ? ' is-you' : ''}">
        <div class="comment-row__avatar">${esc(name.slice(0, 2).toUpperCase())}</div>
        <div class="comment-row__body">
          <div class="comment-row__head">
            <span class="comment-row__name">${isYou ? t('comments.you') : esc(name)}</span>
            <span class="comment-row__time">${esc(ageLabel)}</span>
          </div>
          <div class="comment-row__text"></div>
        </div>
      </div>`;

    const all = seeded.map(c => ({ name: c.name, text: c.text, age: c.age + 'h', isYou: false }))
      .concat(own.map(c => ({ name: t('comments.you'), text: c.text, age: t('comments.justNow'), isYou: true })));

    host.innerHTML = all.map(c => row(c.name, c.age, c.isYou)).join('');
    [...host.querySelectorAll('.comment-row__text')].forEach((el, i) => { el.textContent = all[i].text; });
  }

  function initCommentForm(articleId) {
    const form = $('#comment-form');
    const input = $('#comment-input');
    if (!form || !input) return;

    form.addEventListener('submit', e => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;

      const own = loadOwnComments(articleId);
      own.push({ text: text.slice(0, 500) });
      saveOwnComments(articleId, own);
      input.value = '';
      renderComments(articleId);
      Toast.show(t('comments.posted'), { icon: 'check' });
    });
  }

  function initReaction() {
    const pad = $('#reaction-pad');
    if (!pad) return;

    const label = $('#reaction-label');
    const sub   = $('#reaction-sub');
    const bestEl = $('#reaction-best');
    const KEY = 'tribuna.reaction.best';
    const BASE = 'reaction-pad glass-panel clip-corner flex flex-col items-center justify-center h-56';

    let phase = 'idle';
    let timeout = 0;
    let goAt = 0;
    let lastMs = 0;              // kept so a language change can repaint the result

    const best = () => { try { return Number(localStorage.getItem(KEY)) || 0; } catch (e) { return 0; } };
    const paintBest = () => { bestEl.textContent = best() ? best() + ' ' + t('arena.ms') : '—'; };

    /* Single place that turns state into text, so a language change just
       calls it again instead of leaving half the pad in the old language. */
    function paintPad() {
      if (phase === 'idle') {
        pad.className = BASE;
        label.textContent = t('arena.clickToStart');
        sub.textContent = '';
      } else if (phase === 'armed') {
        pad.className = BASE + ' is-armed';
        label.textContent = t('arena.waitPurple');
        sub.textContent = t('arena.waitSub');
      } else if (phase === 'go') {
        pad.className = BASE + ' is-go';
        label.textContent = t('arena.clickNow');
        sub.textContent = '';
      } else if (phase === 'foul') {
        pad.className = BASE + ' is-foul';
        label.textContent = t('arena.tooEarly');
        sub.textContent = t('arena.foulSub');
      } else if (phase === 'done') {
        pad.className = BASE;
        label.textContent = lastMs + ' ' + t('arena.ms');
        const beaten = D.proBenchmarks.filter(b => lastMs < b.ms);
        sub.textContent = beaten.length
          ? t('arena.fasterThan') + ' ' + beaten.map(b => p(b.name)).join(', ') + '. ' + t('arena.retry')
          : t('arena.slowerThan') + ' ' + t('arena.retry');
      }
    }

    function arm() {
      phase = 'armed';
      paintPad();
      timeout = setTimeout(() => {
        phase = 'go';
        goAt = performance.now();
        paintPad();
      }, 1400 + Math.random() * 3600);
    }

    pad.addEventListener('click', () => {
      if (phase === 'idle' || phase === 'done' || phase === 'foul') { arm(); return; }

      if (phase === 'armed') {
        clearTimeout(timeout);
        phase = 'foul';
        paintPad();
        return;
      }

      if (phase === 'go') {
        lastMs = Math.round(performance.now() - goAt);
        phase = 'done';
        paintPad();
        if (!best() || lastMs < best()) {
          try { localStorage.setItem(KEY, String(lastMs)); } catch (e) { /* private mode */ }
        }
        paintBest();
      }
    });

    paintBest();
    I18N.onChange(() => { paintBest(); paintPad(); });
  }

  /* ====================================================================== */
  /*  Reveal on scroll                                                      */
  /* ====================================================================== */

  let revealObserver = null;

  function initReveal() {
    if (!('IntersectionObserver' in window)) {
      $$('.reveal').forEach(el => el.classList.add('is-visible'));
      return;
    }
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        Charts.animate(entry.target);
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.05 });
    observeReveals();
  }

  function observeReveals() {
    if (!revealObserver) return;
    $$('.reveal:not(.is-visible)').forEach(el => revealObserver.observe(el));
  }

  /* ====================================================================== */
  /*  Router                                                                */
  /* ====================================================================== */

  const STATIC_ROUTES = ['home', 'live', 'teams', 'news', 'arena'];
  let arena = null;

  function parseRoute() {
    const raw = (location.hash || '#/home').replace(/^#\/?/, '');
    const seg = raw.split('/');
    if (seg[0] === 'team' && seg[1])    return { view: 'team',    param: seg[1], nav: 'teams' };
    if (seg[0] === 'article' && seg[1]) return { view: 'article', param: seg[1], nav: 'news' };
    const name = STATIC_ROUTES.indexOf(seg[0]) !== -1 ? seg[0] : 'home';
    return { view: name, param: null, nav: name };
  }

  function navigate() {
    const route = parseRoute();

    $$('.view').forEach(v => {
      if (v.dataset.view === route.view) {
        v.classList.add('is-active', 'is-entering');
        void v.offsetWidth;                    // commit the entering state...
        v.classList.remove('is-entering');     // ...then transition away from it
      } else {
        v.classList.remove('is-active', 'is-entering');
      }
    });
    $$('[data-nav]').forEach(a => a.classList.toggle('is-active', a.dataset.nav === route.nav));

    document.title = 'TRIBUNA ESPORTS — ' + route.view.toUpperCase();
    window.scrollTo({ top: 0, behavior: 'instant' });
    closeDrawer();

    if (route.view === 'team')    renderTeamPage(route.param);
    if (route.view === 'article') renderArticle(route.param);
    if (route.view === 'live')    startChat();

    if (route.view === 'arena') {
      requestAnimationFrame(() => arena && arena.resize());
    } else if (arena) {
      arena.stop();
    }

    observeReveals();
    Charts.animate($('.view.is-active'));
  }

  /* ====================================================================== */
  /*  Language                                                              */
  /* ====================================================================== */

  function initLanguage() {
    const host = $('#lang-switch');
    if (!host) return;

    const LABEL = { uk: 'УКР', ru: 'РУС', en: 'ENG' };
    host.innerHTML = I18N.supported.map(code =>
      `<button class="lang-switch__btn${code === I18N.lang ? ' is-active' : ''}" data-lang="${code}"
               lang="${code}" aria-label="${LABEL[code]}">${LABEL[code]}</button>`).join('');

    host.addEventListener('click', e => {
      const btn = e.target.closest('[data-lang]');
      if (btn) I18N.set(btn.dataset.lang);
    });

    I18N.onChange(code => {
      $$('[data-lang]', host).forEach(b => b.classList.toggle('is-active', b.dataset.lang === code));
    });
  }

  /* Everything rendered from data has to be rebuilt when the language flips. */
  function renderAll() {
    renderTicker();
    renderMatches();
    renderTeams();
    renderNews();
    renderViewership();
    renderPrizeSplit();
    renderTopRanked();
    renderSchedule();
    renderTrending();
    renderUpcoming();
    renderSpiritEmblem();

    const route = parseRoute();
    if (route.view === 'team')    renderTeamPage(route.param);
    if (route.view === 'article') renderArticle(route.param);

    observeReveals();
    Charts.animate($('.view.is-active'));
  }

  /* ====================================================================== */
  /*  Boot                                                                  */
  /* ====================================================================== */

  function boot() {
    I18N.apply();
    initLanguage();
    renderAll();

    bindFilters('#teams-filters', '#teams-grid > article', 'game');
    bindFilters('#news-filters',  '#news-grid > article',  'cat');
    initSearch('#search-input', '#search-results');
    initSearch('#search-input-mobile', '#search-results-mobile');

    document.addEventListener('click', e => {
      // Explicit guard rather than relying on stopPropagation() ordering:
      // share/remind/bookmark buttons often sit inside a whole-card
      // [data-route] link (the news hero, fixture rows), and two listeners
      // on the same document node fire in registration order regardless of
      // stopPropagation — only an explicit exclusion is order-independent.
      if (e.target.closest('[data-share],[data-remind],[data-bookmark],[data-jump]')) return;
      const el = e.target.closest('[data-route]');
      if (!el) return;
      e.preventDefault();
      location.hash = el.dataset.route;
    });

    wireSocialActions();

    $('#mobile-toggle').addEventListener('click', () => {
      const nav = $('#mobile-nav');
      nav.classList.contains('is-open') ? closeDrawer() : openDrawer();
    });

    const shader = window.ApexShader ? ApexShader.mount($('#hero-shader')) : null;
    let hero = window.ApexHero ? ApexHero.create($('#hero'), shader) : null;

    const arenaRoot = $('#arena');
    if (arenaRoot && window.AimArena) arena = AimArena.create(arenaRoot);

    initPoll();
    initReaction();
    initReveal();
    startSimulation();

    // Re-render data-driven markup on every language change.
    I18N.onChange(() => {
      if (arena && arena.relabel) arena.relabel();
      maskLanguageSwap(() => {
        if (hero) { hero.destroy(); hero = ApexHero.create($('#hero'), shader); }
        renderAll();
      });
    });

    const nav = $('#topnav');
    window.addEventListener('scroll', () => {
      nav.classList.toggle('bg-void/90', window.scrollY > 40);
    }, { passive: true });

    window.addEventListener('hashchange', navigate);
    navigate();

    // Home charts sit above the fold on tall screens; make sure they draw.
    Charts.animate(document);
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', boot)
    : boot();
})();
