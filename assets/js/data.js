/* Mock content layer.
   Everything the prototype renders comes from here, so swapping in a real API
   later means replacing this file rather than editing markup.

   T(en, uk, ru) marks a translatable string — see i18n.js. Proper nouns are
   never wrapped: club names, player nicknames, tournaments, maps and scores
   stay identical in every language, the way an esports desk actually writes.

   Player nicknames are invented. Attaching fabricated K/D numbers to real
   people would be the one thing an actual sports newsroom would refuse to
   ship, so the rosters are plausible rather than real. */

/* Team emblems are generated, not bitmaps: a chamfered hex badge echoing the
   rank-badge shape, with the club's initials. Deliberately generic placeholders
   — no real club marks are reproduced — and they stay crisp at any size. */
function tribunaEmblem(initials, color, size) {
  const s = size || 64;
  return `
<svg viewBox="0 0 64 64" width="${s}" height="${s}" role="img" aria-label="${initials}" focusable="false">
  <path d="M32 2.5 L58.5 16 L58.5 48 L32 61.5 L5.5 48 L5.5 16 Z"
        fill="rgba(11,13,18,0.75)" stroke="${color}" stroke-width="2"/>
  <path d="M32 2.5 L58.5 16 L32 29.5 L5.5 16 Z" fill="${color}" opacity="0.16"/>
  <path d="M14 44 L26 20" stroke="${color}" stroke-width="1.5" opacity="0.5"/>
  <text x="32" y="42" text-anchor="middle" font-family="Anton, Oswald, sans-serif"
        font-size="21" letter-spacing="0.5" fill="${color}">${initials}</text>
</svg>`;
}

/* Roles reused across rosters. */
const ROLE = {
  igl:      T('IGL', 'Капітан', 'Капитан'),
  awp:      T('AWPer', 'AWP', 'AWP'),
  rifle:    T('Rifler', 'Рифлер', 'Рифлер'),
  entry:    T('Entry', 'Ентрі', 'Энтри'),
  support:  T('Support', 'Підтримка', 'Поддержка'),
  carry:    T('Carry', 'Керрі', 'Керри'),
  mid:      T('Mid', 'Мідер', 'Мидер'),
  off:      T('Offlane', 'Офлейн', 'Офлейн'),
  hard:     T('Hard support', 'Хард сапорт', 'Хард саппорт'),
  duelist:  T('Duelist', 'Дуеліст', 'Дуэлист'),
  /* LoL */
  top:      T('Top', 'Топ', 'Топ'),
  jungle:   T('Jungle', 'Ліс', 'Лес'),
  adc:      T('Bot', 'Бот', 'Бот'),
  /* PUBG */
  fragger:  T('Fragger', 'Фрагер', 'Фраггер'),
  sniper:   T('Sniper', 'Снайпер', 'Снайпер'),
  control:  T('Controller', 'Контролер', 'Контроллер'),
  init:     T('Initiator', 'Ініціатор', 'Инициатор'),
  sentinel: T('Sentinel', 'Вартовий', 'Страж'),
  flex:     T('Flex', 'Флекс', 'Флекс')
};

const TRIBUNA_DATA = {

  /* ---------------------------------------------------------------- hero */
  /* Each slide carries an accent the WebGL background lerps toward, so the
     shader shifts hue as the carousel advances. */
  heroSlides: [
    {
      tag: T('LIVE NOW', 'ЗАРАЗ У ЕФІРІ', 'СЕЙЧАС В ЭФИРЕ'),
      live: true,
      event: 'EWC 2026 — CS2',
      title: T('ROUND OF 16', '1/8 ФІНАЛУ', '1/8 ФИНАЛА'),
      matchup: 'NATUS VINCERE vs LEGACY',
      blurb: T('Round of 16 at the Esports World Cup. Map 2 on Mirage, and Kyiv is holding its breath.',
               '1/8 фіналу Esports World Cup. Друга карта на Mirage — і Київ затамував подих.',
               '1/8 финала Esports World Cup. Вторая карта на Mirage — и Киев затаил дыхание.'),
      meta: [
        [T('PRIZE POOL', 'ПРИЗОВИЙ ФОНД', 'ПРИЗОВОЙ ФОНД'), '$1,000,000'],
        [T('VIEWERS', 'ГЛЯДАЧІ', 'ЗРИТЕЛИ'), '112,480'],
        [T('FORMAT', 'ФОРМАТ', 'ФОРМАТ'), 'BO5']
      ],
      image: 'assets/img/stage-arena-main.jpg',
      accent: [0.659, 0.333, 0.969],
      cta: T('WATCH LIVE', 'ДИВИТИСЬ', 'СМОТРЕТЬ')
    },
    {
      tag: T('GAME 3', 'ГРА 3', 'ИГРА 3'),
      live: true,
      event: 'EWC 2026 — CS2',
      title: T('THE HARDEST DRAW', 'НАЙВАЖЧИЙ ЖЕРЕБ', 'САМЫЙ ТЯЖЁЛЫЙ ЖРЕБИЙ'),
      matchup: 'B8 vs TEAM SPIRIT',
      blurb: T('The second Ukrainian roster drew the defending champions in the opening round.',
               'Другому українському складу в стартовому раунді дістався чинний чемпіон.',
               'Второму украинскому составу в стартовом раунде достался действующий чемпион.'),
      meta: [
        [T('PRIZE POOL', 'ПРИЗОВИЙ ФОНД', 'ПРИЗОВОЙ ФОНД'), '$1,000,000'],
        [T('VIEWERS', 'ГЛЯДАЧІ', 'ЗРИТЕЛИ'), '85,120'],
        [T('FORMAT', 'ФОРМАТ', 'ФОРМАТ'), 'BO5']
      ],
      image: 'assets/img/stage-arena-packed.jpg',
      accent: [0.976, 0.310, 0.667],
      cta: T('WATCH LIVE', 'ДИВИТИСЬ', 'СМОТРЕТЬ')
    },
    {
      tag: T('STARTS IN', 'ПОЧАТОК ЧЕРЕЗ', 'НАЧАЛО ЧЕРЕЗ'),
      countdown: 134,
      live: false,
      event: 'WARSAW LAN — CS2',
      title: T('THE UKRAINIAN DERBY', 'УКРАЇНСЬКЕ ДЕРБІ', 'УКРАИНСКОЕ ДЕРБИ'),
      matchup: 'B8 vs INNER CIRCLE',
      blurb: T('Eight teams, $150,000 and a full hall. The two rosters can only meet in the semi-final.',
               'Вісім команд, $150 000 і повна зала. Два склади можуть зустрітися лише в півфіналі.',
               'Восемь команд, $150 000 и полный зал. Два состава могут встретиться только в полуфинале.'),
      meta: [
        [T('PRIZE POOL', 'ПРИЗОВИЙ ФОНД', 'ПРИЗОВОЙ ФОНД'), '$150,000'],
        [T('WAITING', 'ОЧІКУЮТЬ', 'ОЖИДАЮТ'), '18,400'],
        [T('FORMAT', 'ФОРМАТ', 'ФОРМАТ'), 'BO3']
      ],
      image: 'assets/img/stage-beams.jpg',
      accent: [1.000, 0.278, 0.341],
      cta: T('SET REMINDER', 'НАГАДАТИ', 'НАПОМНИТЬ')
    },
    {
      tag: T('THIS WEEKEND', 'ЦИХ ВИХІДНИХ', 'В ЭТИ ВЫХОДНЫЕ'),
      live: false,
      event: 'THE INTERNATIONAL 2026',
      title: T('SIXTEEN REMAIN', 'ЛИШИЛОСЬ ШІСТНАДЦЯТЬ', 'ОСТАЛОСЬ ШЕСТНАДЦАТЬ'),
      matchup: 'PLAYOFF BRACKET IS SET',
      blurb: T('Falcons, BB, Spirit and Iron Wing took the last slots. The bracket opens on Friday.',
               'Falcons, BB, Spirit та Iron Wing забрали останні путівки. Сітка стартує в п’ятницю.',
               'Falcons, BB, Spirit и Iron Wing забрали последние путёвки. Сетка стартует в пятницу.'),
      meta: [
        [T('PRIZE POOL', 'ПРИЗОВИЙ ФОНД', 'ПРИЗОВОЙ ФОНД'), '$40,018,195'],
        [T('REGISTERED', 'ЗАРЕЄСТРОВАНО', 'ЗАРЕГИСТРИРОВАНО'), '1.2M'],
        [T('FORMAT', 'ФОРМАТ', 'ФОРМАТ'), 'BO5']
      ],
      image: 'assets/img/stage-arena-packed.jpg',
      accent: [0.360, 0.706, 1.000],
      cta: T('FULL SCHEDULE', 'РОЗКЛАД', 'РАСПИСАНИЕ')
    }
  ],

  /* ------------------------------------------------------------- matches */
  liveMatches: [
    {
      id: 'm1',
      tournament: 'EWC 2026 — ROUND OF 16',
      stage: T('MAP 2 — MIRAGE', 'КАРТА 2 — MIRAGE', 'КАРТА 2 — MIRAGE'),
      image: 'assets/img/stage-arena-main.jpg',
      viewers: 112480,
      teams: [
        { name: 'NAVI',   slug: 'natus-vincere', mark: 'NV', tint: '#ffe14d', score: 1 },
        { name: 'LEGACY', slug: null,            mark: 'LG', tint: '#7dd87d', score: 0 }
      ]
    },
    {
      id: 'm2',
      tournament: 'EWC 2026 — ROUND OF 16',
      stage: T('MAP 1 — ANCIENT', 'КАРТА 1 — ANCIENT', 'КАРТА 1 — ANCIENT'),
      image: 'assets/img/stage-arena-packed.jpg',
      viewers: 85120,
      teams: [
        { name: 'B8',     slug: 'b8',          mark: 'B8', tint: '#5cc8ff', score: 1 },
        { name: 'SPIRIT', slug: 'team-spirit', mark: 'TS', tint: '#ffd166', score: 2 }
      ]
    },
    {
      id: 'm3',
      tournament: 'THE INTERNATIONAL 2026',
      stage: T('GAME 3', 'ГРА 3', 'ИГРА 3'),
      image: 'assets/img/stage-beams.jpg',
      viewers: 42900,
      teams: [
        { name: 'FALCONS', slug: 'team-falcons', mark: 'TF', tint: '#4dd4a8', score: 0 },
        { name: 'BB',      slug: null,          mark: 'BB', tint: '#ff9d4d', score: 0 }
      ]
    }
  ],

  upcoming: [
    { time: '16:00', a: 'B8',            b: 'TEAM SPIRIT', event: 'EWC 2026',      game: 'CS2' },
    { time: '19:00', a: 'NAVI',          b: 'LEGACY',      event: 'EWC 2026',      game: 'CS2' },
    { time: '21:30', a: 'G2 ESPORTS',    b: 'VITALITY',    event: 'EWC 2026',      game: 'CS2' },
    { time: '23:15', a: 'TEAM FALCONS',  b: 'BB TEAM',     event: 'TI 2026',       game: 'DOTA 2' },
    { time: '02:00', a: 'GEN.G',         b: 'PAPER REX',   event: 'VCT PACIFIC',   game: 'VALORANT' }
  ],

  /* -------------------------------------------------------- home charts */
  viewership: {
    values: [148, 186, 172, 231, 205, 288, 342],
    days: T(['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
            ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'НД'],
            ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС']),
    peak: 342, avg: 224, growth: 31
  },

  prizeSplit: [
    { label: 'DOTA 2',   value: 40.0, display: '$40.0M', color: '#a855f7' },
    { label: 'CS2',      value: 12.4, display: '$12.4M', color: '#ff6b00' },
    { label: 'VALORANT', value: 9.1,  display: '$9.1M',  color: '#ff3b5c' },
    { label: 'LOL',      value: 7.3,  display: '$7.3M',  color: '#5cc8ff' },
    { label: 'PUBG',     value: 4.6,  display: '$4.6M',  color: '#00d4a0' }
  ],

  /* --------------------------------------------------------------- teams */
  teams: [
    {
      slug: 'team-spirit', alias: ['spirit', 'ts', 'спірит', 'спирит'], name: 'Team Spirit', game: 'DOTA 2', rank: 1, win: 82.0,
      mark: 'TS', tint: '#ffd166',
      region: T('CIS', 'СНД', 'СНГ'), founded: 2015, earnings: '$28.4M', titles: 11,
      coach: 'Kanaev', streak: 7, played: 64,
      blurb: T('Back-to-back international champions with the deepest draft pool in the game.',
               'Дворазові чемпіони світу з найглибшим пулом драфту в дисципліні.',
               'Двукратные чемпионы мира с самым глубоким пулом драфта в дисциплине.'),
      about: T(['Spirit turned a roster nobody rated into the most feared draft in Dota. Their identity is flexibility: any of the five can play a position off-meta, which makes the ban phase against them a guessing game.',
                'The last two years brought two Aegis wins and a run of tournament finals that stopped being surprising some time around the second one. What has not changed is the pace — Spirit still play the fastest mid-game in the top ten.'],
               ['Spirit перетворили склад, у який ніхто не вірив, на найнебезпечніший драфт у Dota. Їхня суть — гнучкість: будь-хто з п’ятьох може зіграти позицію поза метою, і фаза банів проти них перетворюється на здогадки.',
                'Останні два роки принесли два Аегіси та серію фіналів, які перестали дивувати десь після другого. Не змінилося одне — темп: у Spirit досі найшвидша середня стадія в топ-10.'],
               ['Spirit превратили состав, в который никто не верил, в самый опасный драфт в Dota. Их суть — гибкость: любой из пятерых может сыграть позицию вне меты, и фаза банов против них превращается в угадайку.',
                'Последние два года принесли два Аегиса и серию финалов, которые перестали удивлять где-то после второго. Не изменилось одно — темп: у Spirit до сих пор самая быстрая средняя стадия в топ-10.']),
      roster: [
        { nick: 'vortexx',   role: ROLE.carry,   rating: 1.28, kd: '4.1' },
        { nick: 'kryo',      role: ROLE.mid,     rating: 1.24, kd: '3.8' },
        { nick: 'sablewind', role: ROLE.off,     rating: 1.11, kd: '2.9' },
        { nick: 'mirrorr',   role: ROLE.support, rating: 1.05, kd: '2.2' },
        { nick: 'lodestone', role: ROLE.hard,    rating: 0.98, kd: '1.8' }
      ],
      trend: [61, 64, 68, 66, 72, 75, 71, 78, 80, 77, 83, 82],
      pools: [
        { label: 'Radiant', value: 84 }, { label: 'Dire', value: 79 },
        { label: 'BO1', value: 71 }, { label: 'BO3', value: 85 }, { label: 'BO5', value: 88 }
      ],
      poolKey: 'team.sidePool',
      splitA: T('Radiant', 'Radiant', 'Radiant'), splitB: T('Dire', 'Dire', 'Dire'),
      splitVals: [84, 79],
      form: [true, true, false, true, true, true, true, false, true, true],
      fixtures: [
        { d: 18, m: 8, time: '20:00', opp: 'Team Falcons', event: 'BLAST PREMIER' },
        { d: 21, m: 8, time: '17:30', opp: 'Gaimin Gladiators', event: 'ESL ONE' },
        { d: 24, m: 8, time: '19:00', opp: 'BetBoom Team', event: 'ESL ONE' }
      ],
      recent: [
        { d: 14, m: 8, opp: 'Tundra Esports', score: '2 : 0', win: true,  event: 'ESL ONE' },
        { d: 11, m: 8, opp: 'Team Liquid',    score: '2 : 1', win: true,  event: 'ESL ONE' },
        { d: 8,  m: 8, opp: 'Gaimin Gladiators', score: '1 : 2', win: false, event: 'RIYADH MASTERS' },
        { d: 5,  m: 8, opp: 'Team Falcons',   score: '2 : 0', win: true,  event: 'RIYADH MASTERS' },
        { d: 2,  m: 8, opp: 'Xtreme Gaming',  score: '2 : 1', win: true,  event: 'RIYADH MASTERS' }
      ]
    },

    {
      slug: 'natus-vincere', alias: ['navi', 'nv', 'наві', 'нави', 'натус'], name: 'Natus Vincere', game: 'CS2', rank: 2, win: 74.5,
      mark: 'NV', tint: '#ffe14d',
      region: T('Ukraine', 'Україна', 'Украина'), founded: 2009, earnings: '$21.7M', titles: 9,
      coach: 'Bohdan', streak: 4, played: 58,
      blurb: T('Born to win. The Ukrainian powerhouse that keeps defining the modern meta.',
               'Народжені перемагати. Українська машина, що знову й знову задає меті.',
               'Рождённые побеждать. Украинская машина, что снова и снова задаёт мету.'),
      about: T(['No organisation carries more weight in the CIS scene, and none has rebuilt itself as often without losing its identity. The current five play a slow, structured Counter-Strike that punishes teams used to chaos.',
                'Their Mirage record this season is the best in the circuit, and the anti-eco discipline that used to be their weakness is now the reason they close out halves.'],
               ['Жодна організація не важить у сцені стільки, скільки NAVI, і жодна не перебудовувала себе так часто, не втрачаючи обличчя. Нинішня п’ятірка грає повільний структурний CS, що карає команди, звиклі до хаосу.',
                'Їхня статистика на Mirage цього сезону — найкраща в турі, а дисципліна в анти-еко, яка колись була слабкістю, тепер причина, чому вони дотискають половини.'],
               ['Ни одна организация не весит в сцене столько, сколько NAVI, и ни одна не перестраивала себя так часто, не теряя лица. Нынешняя пятёрка играет медленный структурный CS, наказывающий команды, привыкшие к хаосу.',
                'Их статистика на Mirage в этом сезоне — лучшая в туре, а дисциплина в анти-эко, которая когда-то была слабостью, теперь причина, почему они дожимают половины.']),
      roster: [
        { nick: 'veles',   role: ROLE.igl,     rating: 1.09, kd: '1.04' },
        { nick: 'sokil',   role: ROLE.awp,     rating: 1.31, kd: '1.42' },
        { nick: 'arcticz', role: ROLE.rifle,   rating: 1.18, kd: '1.21' },
        { nick: 'n0vak',   role: ROLE.entry,   rating: 1.12, kd: '1.08' },
        { nick: 'tempoo',  role: ROLE.support, rating: 1.02, kd: '0.97' }
      ],
      trend: [58, 62, 60, 67, 71, 69, 74, 72, 76, 73, 77, 75],
      pools: [
        { label: 'Mirage', value: 88 }, { label: 'Inferno', value: 76 },
        { label: 'Ancient', value: 71 }, { label: 'Nuke', value: 64 }, { label: 'Anubis', value: 58 }
      ],
      poolKey: 'team.mapPool',
      splitA: T('Attack', 'Атака', 'Атака'), splitB: T('Defence', 'Захист', 'Защита'),
      splitVals: [54, 46],
      form: [true, true, true, false, true, true, false, true, true, false],
      fixtures: [
        { d: 18, m: 8, time: '19:00', opp: 'FaZe Clan',  event: 'IEM COLOGNE' },
        { d: 20, m: 8, time: '16:00', opp: 'G2 Esports', event: 'ESL PRO LEAGUE' },
        { d: 23, m: 8, time: '18:30', opp: 'Vitality',   event: 'ESL PRO LEAGUE' }
      ],
      recent: [
        { d: 15, m: 8, opp: 'Team Vitality', score: '2 : 1', win: true,  event: 'IEM COLOGNE' },
        { d: 13, m: 8, opp: 'MOUZ',          score: '2 : 0', win: true,  event: 'IEM COLOGNE' },
        { d: 10, m: 8, opp: 'FaZe Clan',     score: '1 : 2', win: false, event: 'BLAST PREMIER' },
        { d: 7,  m: 8, opp: 'Cloud9',        score: '2 : 0', win: true,  event: 'BLAST PREMIER' },
        { d: 4,  m: 8, opp: 'Astralis',      score: '2 : 1', win: true,  event: 'BLAST PREMIER' }
      ]
    },

    {
      slug: 'faze-clan', alias: ['faze', 'fz', 'фейз'], name: 'FaZe Clan', game: 'CS2', rank: 4, win: 68.2,
      mark: 'FZ', tint: '#ff5c5c',
      region: T('International', 'Інтернаціонал', 'Интернационал'), founded: 2010, earnings: '$18.9M', titles: 7,
      coach: 'Halden', streak: 2, played: 61,
      blurb: T('International superteam known for clutch plays and high-octane strats.',
               'Інтернаціональна суперкоманда, відома клатчами й ризиковими тактиками.',
               'Интернациональная суперкоманда, известная клатчами и рискованными тактиками.'),
      about: T(['FaZe were the first roster to prove a five-nation lineup could win a Major, and they still play like a team that believes structure is optional when the aim is good enough.',
                'The trade-off is volatility: they beat anyone on a good day and lose to anyone on a bad one. This season the good days are winning, largely because their entry timings finally match their utility.'],
               ['FaZe першими довели, що склад із п’яти націй може виграти Major, і досі грають так, ніби структура необов’язкова, коли аїм достатньо гарний.',
                'Плата за це — нестабільність: у добрий день вони обіграють будь-кого, у поганий — програють будь-кому. Цього сезону добрих днів більше, головно тому, що тайминги входу нарешті збіглися з утилітою.'],
               ['FaZe первыми доказали, что состав из пяти наций может выиграть Major, и до сих пор играют так, будто структура необязательна, когда аим достаточно хорош.',
                'Плата за это — нестабильность: в хороший день они обыграют кого угодно, в плохой — проиграют кому угодно. В этом сезоне хороших дней больше, в основном потому, что тайминги входа наконец совпали с утилитой.']),
      roster: [
        { nick: 'harlow', role: ROLE.igl,     rating: 1.05, kd: '0.99' },
        { nick: 'brisk',  role: ROLE.awp,     rating: 1.26, kd: '1.33' },
        { nick: 'vandl',  role: ROLE.rifle,   rating: 1.21, kd: '1.24' },
        { nick: 'ozone',  role: ROLE.entry,   rating: 1.14, kd: '1.11' },
        { nick: 'krypt',  role: ROLE.support, rating: 1.00, kd: '0.95' }
      ],
      trend: [64, 61, 66, 63, 68, 71, 66, 70, 67, 72, 69, 68],
      pools: [
        { label: 'Inferno', value: 81 }, { label: 'Nuke', value: 74 },
        { label: 'Mirage', value: 66 }, { label: 'Anubis', value: 62 }, { label: 'Ancient', value: 55 }
      ],
      poolKey: 'team.mapPool',
      splitA: T('Attack', 'Атака', 'Атака'), splitB: T('Defence', 'Захист', 'Защита'),
      splitVals: [58, 42],
      form: [true, false, true, true, false, true, false, true, true, false],
      fixtures: [
        { d: 18, m: 8, time: '19:00', opp: 'Natus Vincere', event: 'IEM COLOGNE' },
        { d: 22, m: 8, time: '15:00', opp: 'Astralis',      event: 'ESL PRO LEAGUE' },
        { d: 26, m: 8, time: '20:00', opp: 'MOUZ',          event: 'ESL PRO LEAGUE' }
      ],
      recent: [
        { d: 15, m: 8, opp: 'G2 Esports',  score: '2 : 0', win: true,  event: 'IEM COLOGNE' },
        { d: 12, m: 8, opp: 'Team Spirit', score: '0 : 2', win: false, event: 'IEM COLOGNE' },
        { d: 10, m: 8, opp: 'Natus Vincere', score: '2 : 1', win: true, event: 'BLAST PREMIER' },
        { d: 6,  m: 8, opp: 'Heroic',      score: '2 : 1', win: true,  event: 'BLAST PREMIER' },
        { d: 3,  m: 8, opp: 'Team Vitality', score: '1 : 2', win: false, event: 'BLAST PREMIER' }
      ]
    },

    {
      slug: 'g2-esports', alias: ['g2', 'джи2'], name: 'G2 Esports', game: 'CS2', rank: 6, win: 65.8,
      mark: 'G2', tint: '#e8e8ee',
      region: T('Europe', 'Європа', 'Европа'), founded: 2013, earnings: '$16.2M', titles: 6,
      coach: 'Rehm', streak: 1, played: 59,
      blurb: T('Entertaining, chaotic, and relentlessly skilled European titans.',
               'Видовищні, хаотичні й нещадно талановиті європейські титани.',
               'Зрелищные, хаотичные и беспощадно талантливые европейские титаны.'),
      about: T(['G2 have spent a decade being the most watchable team in Europe and, in stretches, the best. The roster is built around individual firepower rather than a system, and the coaching staff has largely stopped fighting that.',
                'Their weakness is the same as it has always been: series that go long. G2 win more BO1s than anyone in the top five and fewer BO5s.'],
               ['G2 десять років лишаються найвидовищнішою командою Європи, а часом і найкращою. Склад побудований навколо індивідуальної вогневої потужності, а не системи, і тренерський штаб уже майже не бореться з цим.',
                'Слабкість та сама, що й завжди: довгі серії. G2 виграють більше BO1, ніж будь-хто з топ-5, і менше BO5.'],
               ['G2 десять лет остаются самой зрелищной командой Европы, а порой и лучшей. Состав построен вокруг индивидуальной огневой мощи, а не системы, и тренерский штаб уже почти не борется с этим.',
                'Слабость та же, что и всегда: длинные серии. G2 выигрывают больше BO1, чем кто-либо из топ-5, и меньше BO5.']),
      roster: [
        { nick: 'kaskade', role: ROLE.igl,     rating: 1.03, kd: '0.98' },
        { nick: 'riven',   role: ROLE.awp,     rating: 1.22, kd: '1.28' },
        { nick: 'juno',    role: ROLE.rifle,   rating: 1.19, kd: '1.19' },
        { nick: 'aurel',   role: ROLE.entry,   rating: 1.10, kd: '1.06' },
        { nick: 'pyre',    role: ROLE.support, rating: 0.99, kd: '0.94' }
      ],
      trend: [59, 63, 61, 65, 62, 68, 64, 67, 63, 69, 66, 66],
      pools: [
        { label: 'Anubis', value: 77 }, { label: 'Mirage', value: 72 },
        { label: 'Ancient', value: 68 }, { label: 'Inferno', value: 60 }, { label: 'Nuke', value: 52 }
      ],
      poolKey: 'team.mapPool',
      splitA: T('Attack', 'Атака', 'Атака'), splitB: T('Defence', 'Захист', 'Защита'),
      splitVals: [52, 48],
      form: [false, true, true, false, true, false, true, true, false, true],
      fixtures: [
        { d: 18, m: 8, time: '18:00', opp: 'Team Vitality', event: 'IEM COLOGNE' },
        { d: 20, m: 8, time: '16:00', opp: 'Natus Vincere', event: 'ESL PRO LEAGUE' },
        { d: 25, m: 8, time: '17:00', opp: 'Cloud9',        event: 'ESL PRO LEAGUE' }
      ],
      recent: [
        { d: 15, m: 8, opp: 'FaZe Clan',   score: '0 : 2', win: false, event: 'IEM COLOGNE' },
        { d: 13, m: 8, opp: 'Heroic',      score: '2 : 0', win: true,  event: 'IEM COLOGNE' },
        { d: 9,  m: 8, opp: 'Astralis',    score: '2 : 1', win: true,  event: 'BLAST PREMIER' },
        { d: 6,  m: 8, opp: 'MOUZ',        score: '1 : 2', win: false, event: 'BLAST PREMIER' },
        { d: 2,  m: 8, opp: 'Team Liquid', score: '2 : 0', win: true,  event: 'BLAST PREMIER' }
      ]
    },

    {
      slug: 't1', alias: ['t1', 'т1'], name: 'T1', game: 'VALORANT', rank: 8, win: 63.4,
      mark: 'T1', tint: '#ff3b5c',
      region: T('South Korea', 'Південна Корея', 'Южная Корея'), founded: 2004, earnings: '$14.8M', titles: 5,
      coach: 'Jeong', streak: 3, played: 52,
      blurb: T('Seoul dynasty carrying the heaviest expectations in all of esports.',
               'Сеульська династія з найважчими очікуваннями в усьому кіберспорті.',
               'Сеульская династия с самыми тяжёлыми ожиданиями во всём киберспорте.'),
      about: T(['No badge in esports comes with more pressure. T1 are expected to win domestically and to contend internationally, every single split, and the roster is built accordingly — veterans who have already handled the noise.',
                'Their Valorant side is the most disciplined defensive team in the Pacific. They give up fewer opening picks than anyone, and they convert retakes at a rate that borders on unfair.'],
               ['Жоден логотип у кіберспорті не тисне так сильно. Від T1 очікують перемог удома й боротьби за міжнародні титули щоспліту, і склад зібраний відповідно — ветерани, що вже витримали цей шум.',
                'Їхній склад із Valorant — найдисциплінованіша команда захисту в Пацифіці. Вони віддають менше перших фрагів, ніж будь-хто, і забирають ретейки з майже несправедливою частотою.'],
               ['Ни один логотип в киберспорте не давит так сильно. От T1 ждут побед дома и борьбы за международные титулы каждый сплит, и состав собран соответственно — ветераны, уже выдержавшие этот шум.',
                'Их состав по Valorant — самая дисциплинированная команда защиты в Пацифике. Они отдают меньше первых фрагов, чем кто-либо, и забирают ретейки с почти несправедливой частотой.']),
      roster: [
        { nick: 'haneul', role: ROLE.duelist,  rating: 1.24, kd: '1.29' },
        { nick: 'jinwoo', role: ROLE.control,  rating: 1.08, kd: '1.05' },
        { nick: 'seolgi', role: ROLE.init,     rating: 1.15, kd: '1.14' },
        { nick: 'byul',   role: ROLE.sentinel, rating: 1.11, kd: '1.09' },
        { nick: 'raon',   role: ROLE.flex,     rating: 1.02, kd: '0.98' }
      ],
      trend: [52, 55, 58, 56, 61, 59, 63, 66, 62, 65, 64, 63],
      pools: [
        { label: 'Ascent', value: 79 }, { label: 'Haven', value: 72 },
        { label: 'Lotus', value: 66 }, { label: 'Bind', value: 58 }, { label: 'Split', value: 51 }
      ],
      poolKey: 'team.mapPool',
      splitA: T('Attack', 'Атака', 'Атака'), splitB: T('Defence', 'Захист', 'Защита'),
      splitVals: [44, 56],
      form: [true, true, true, false, true, false, true, false, true, true],
      fixtures: [
        { d: 19, m: 8, time: '11:30', opp: 'DRX',       event: 'VCT PACIFIC' },
        { d: 22, m: 8, time: '13:00', opp: 'Gen.G',     event: 'VCT PACIFIC' },
        { d: 27, m: 8, time: '12:00', opp: 'Paper Rex', event: 'VCT PACIFIC' }
      ],
      recent: [
        { d: 16, m: 8, opp: 'Gen.G',        score: '2 : 1', win: true,  event: 'VCT PACIFIC' },
        { d: 12, m: 8, opp: 'Paper Rex',    score: '1 : 2', win: false, event: 'VCT PACIFIC' },
        { d: 9,  m: 8, opp: 'DRX',          score: '2 : 0', win: true,  event: 'VCT PACIFIC' },
        { d: 5,  m: 8, opp: 'Team Secret',  score: '2 : 0', win: true,  event: 'VCT PACIFIC' },
        { d: 1,  m: 8, opp: 'Rex Regum Qeon', score: '2 : 1', win: true, event: 'VCT PACIFIC' }
      ]
    },

    {
      slug: 'paper-rex', alias: ['prx', 'paper', 'пейпер'], name: 'Paper Rex', game: 'VALORANT', rank: 9, win: 61.9,
      mark: 'PRX', tint: '#ff8ac4',
      region: T('Singapore', 'Сінгапур', 'Сингапур'), founded: 2020, earnings: '$4.6M', titles: 3,
      coach: 'Alvin', streak: 2, played: 48,
      blurb: T('W-keying their way through the Pacific with zero regard for convention.',
               'Проходять Пацифік напролом, не зважаючи на жодні умовності.',
               'Проходят Пацифик напролом, не считаясь ни с какими условностями.'),
      about: T(['Paper Rex built an identity out of refusing to play the game the way the manual describes. They rush, they trade, they take fights nobody else would take, and often enough it works.',
                'Statistically they are an outlier in every direction: the fastest average round time in the league, the highest first-blood rate, and the worst economy discipline in the top eight. The entertainment value is unmatched.'],
               ['Paper Rex збудували ідентичність на відмові грати так, як написано в підручнику. Вони біжать, розмінюються й беруть бої, які не взяв би ніхто інший, — і достатньо часто це спрацьовує.',
                'Статистично вони викид у всіх напрямках: найшвидший середній раунд у лізі, найвищий відсоток перших фрагів і найгірша економічна дисципліна в топ-8. За видовищністю їм немає рівних.'],
               ['Paper Rex построили идентичность на отказе играть так, как написано в учебнике. Они бегут, разменивают и берут бои, которые не взял бы никто другой, — и достаточно часто это срабатывает.',
                'Статистически они выброс во всех направлениях: самый быстрый средний раунд в лиге, самый высокий процент первых фрагов и худшая экономическая дисциплина в топ-8. По зрелищности им нет равных.']),
      roster: [
        { nick: 'kiro',   role: ROLE.duelist,  rating: 1.30, kd: '1.36' },
        { nick: 'mangoz', role: ROLE.duelist,  rating: 1.19, kd: '1.22' },
        { nick: 'vypr',   role: ROLE.init,     rating: 1.09, kd: '1.04' },
        { nick: 'senko',  role: ROLE.control,  rating: 1.04, kd: '1.01' },
        { nick: 'arai',   role: ROLE.sentinel, rating: 0.97, kd: '0.93' }
      ],
      trend: [48, 54, 51, 58, 62, 57, 64, 60, 66, 61, 63, 62],
      pools: [
        { label: 'Split', value: 76 }, { label: 'Bind', value: 70 },
        { label: 'Ascent', value: 63 }, { label: 'Lotus', value: 57 }, { label: 'Haven', value: 49 }
      ],
      poolKey: 'team.mapPool',
      splitA: T('Attack', 'Атака', 'Атака'), splitB: T('Defence', 'Захист', 'Защита'),
      splitVals: [64, 36],
      form: [true, true, false, true, false, false, true, true, false, true],
      fixtures: [
        { d: 19, m: 8, time: '14:00', opp: 'FNATIC',     event: 'VCT MASTERS TOKYO' },
        { d: 23, m: 8, time: '12:30', opp: 'Gen.G',      event: 'VCT PACIFIC' },
        { d: 27, m: 8, time: '12:00', opp: 'T1',         event: 'VCT PACIFIC' }
      ],
      recent: [
        { d: 14, m: 8, opp: 'DRX',           score: '2 : 0', win: true,  event: 'VCT PACIFIC' },
        { d: 12, m: 8, opp: 'T1',            score: '2 : 1', win: true,  event: 'VCT PACIFIC' },
        { d: 8,  m: 8, opp: 'Gen.G',         score: '0 : 2', win: false, event: 'VCT PACIFIC' },
        { d: 4,  m: 8, opp: 'Team Secret',   score: '2 : 1', win: true,  event: 'VCT PACIFIC' },
        { d: 1,  m: 8, opp: 'Global Esports', score: '2 : 0', win: true, event: 'VCT PACIFIC' }
      ]
    },

    {
      slug: 'team-falcons', alias: ['falcons', 'tf', 'фалконс'], name: 'Team Falcons', game: 'DOTA 2', rank: 11, win: 59.7,
      mark: 'TF', tint: '#4dd4a8',
      region: T('MENA', 'MENA', 'MENA'), founded: 2017, earnings: '$9.3M', titles: 4,
      coach: 'Sami', streak: 2, played: 55,
      blurb: T('Newly assembled roster spending big and climbing faster than anyone expected.',
               'Свіжозібраний склад із великим бюджетом, що піднімається швидше за всі прогнози.',
               'Свежесобранный состав с большим бюджетом, поднимающийся быстрее всех прогнозов.'),
      about: T(['Falcons assembled a roster the way a football club would: identify the best available at each position, pay whatever it costs, then work out the chemistry afterwards. It should not have worked this quickly.',
                'Ten months in they are a fixture in the top eight and a genuine threat in any bracket. What is still missing is a signature win over Spirit — three attempts, three losses.'],
               ['Falcons зібрали склад так, як це робить футбольний клуб: знайти найкращого доступного на кожну позицію, заплатити скільки потрібно, а хімію вибудовувати потім. Це не мало спрацювати так швидко.',
                'За десять місяців вони стали постійними в топ-8 і справжньою загрозою в будь-якій сітці. Бракує лише знакової перемоги над Spirit — три спроби, три поразки.'],
               ['Falcons собрали состав так, как это делает футбольный клуб: найти лучшего доступного на каждую позицию, заплатить сколько нужно, а химию выстраивать потом. Это не должно было сработать так быстро.',
                'За десять месяцев они стали постоянными в топ-8 и настоящей угрозой в любой сетке. Не хватает лишь знаковой победы над Spirit — три попытки, три поражения.']),
      roster: [
        { nick: 'zafir', role: ROLE.carry,   rating: 1.21, kd: '3.6' },
        { nick: 'noor',  role: ROLE.mid,     rating: 1.16, kd: '3.2' },
        { nick: 'dahab', role: ROLE.off,     rating: 1.07, kd: '2.6' },
        { nick: 'rimal', role: ROLE.support, rating: 1.01, kd: '2.0' },
        { nick: 'qasr',  role: ROLE.hard,    rating: 0.96, kd: '1.7' }
      ],
      trend: [42, 47, 51, 49, 55, 58, 54, 60, 57, 62, 59, 60],
      pools: [
        { label: 'Radiant', value: 66 }, { label: 'Dire', value: 61 },
        { label: 'BO1', value: 58 }, { label: 'BO3', value: 63 }, { label: 'BO5', value: 55 }
      ],
      poolKey: 'team.sidePool',
      splitA: T('Radiant', 'Radiant', 'Radiant'), splitB: T('Dire', 'Dire', 'Dire'),
      splitVals: [66, 61],
      form: [true, false, true, true, false, true, false, false, true, true],
      fixtures: [
        { d: 18, m: 8, time: '20:00', opp: 'Team Spirit', event: 'BLAST PREMIER' },
        { d: 21, m: 8, time: '14:00', opp: 'Tundra Esports', event: 'ESL ONE' },
        { d: 25, m: 8, time: '18:00', opp: 'BetBoom Team', event: 'ESL ONE' }
      ],
      recent: [
        { d: 14, m: 8, opp: 'Xtreme Gaming',     score: '2 : 1', win: true,  event: 'ESL ONE' },
        { d: 10, m: 8, opp: 'Team Liquid',       score: '1 : 2', win: false, event: 'ESL ONE' },
        { d: 7,  m: 8, opp: 'Gaimin Gladiators', score: '2 : 0', win: true,  event: 'RIYADH MASTERS' },
        { d: 5,  m: 8, opp: 'Team Spirit',       score: '0 : 2', win: false, event: 'RIYADH MASTERS' },
        { d: 1,  m: 8, opp: 'Tundra Esports',    score: '2 : 1', win: true,  event: 'RIYADH MASTERS' }
      ]
    },

    {
      slug: 'gen-g', alias: ['geng', 'gg', 'gen g', 'ген джи'], name: 'Gen.G', game: 'VALORANT', rank: 12, win: 58.1,
      mark: 'GG', tint: '#f2b13c',
      region: T('South Korea', 'Південна Корея', 'Южная Корея'), founded: 2017, earnings: '$7.1M', titles: 3,
      coach: 'Lim', streak: 1, played: 50,
      blurb: T('Methodical, disciplined, and almost impossible to break on defence.',
               'Методичні, дисципліновані й майже непробивні в захисті.',
               'Методичные, дисциплинированные и почти непробиваемые в защите.'),
      about: T(['Gen.G play the least chaotic Valorant in the Pacific. Every round has a plan, every utility use has a purpose, and the team is happy to bleed clock in exchange for information.',
                'It makes them exhausting to face and, occasionally, exhausting to watch — but the results have followed. They have not lost a defensive half by more than four rounds all split.'],
               ['Gen.G грають найменш хаотичний Valorant у Пацифіці. У кожного раунду є план, у кожної гранати — призначення, і команда спокійно віддає час в обмін на інформацію.',
                'Проти них виснажливо грати й іноді виснажливо дивитись — але результат є. За весь спліт вони не програли жодної половини в захисті більш ніж у чотири раунди.'],
               ['Gen.G играют наименее хаотичный Valorant в Пацифике. У каждого раунда есть план, у каждой гранаты — назначение, и команда спокойно отдаёт время в обмен на информацию.',
                'Против них изматывающе играть и иногда изматывающе смотреть — но результат есть. За весь сплит они не проиграли ни одной половины в защите больше чем в четыре раунда.']),
      roster: [
        { nick: 'doyun',  role: ROLE.duelist,  rating: 1.17, kd: '1.18' },
        { nick: 'hwan',   role: ROLE.init,     rating: 1.12, kd: '1.10' },
        { nick: 'minseo', role: ROLE.control,  rating: 1.06, kd: '1.03' },
        { nick: 'taeri',  role: ROLE.sentinel, rating: 1.14, kd: '1.13' },
        { nick: 'kangho', role: ROLE.flex,     rating: 0.99, kd: '0.96' }
      ],
      trend: [45, 49, 52, 50, 56, 54, 59, 57, 61, 56, 60, 58],
      pools: [
        { label: 'Lotus', value: 74 }, { label: 'Ascent', value: 68 },
        { label: 'Haven', value: 61 }, { label: 'Split', value: 55 }, { label: 'Bind', value: 47 }
      ],
      poolKey: 'team.mapPool',
      splitA: T('Attack', 'Атака', 'Атака'), splitB: T('Defence', 'Захист', 'Защита'),
      splitVals: [41, 59],
      form: [false, true, true, true, false, true, true, false, true, false],
      fixtures: [
        { d: 19, m: 8, time: '02:00', opp: 'Paper Rex', event: 'VCT PACIFIC' },
        { d: 22, m: 8, time: '13:00', opp: 'T1',        event: 'VCT PACIFIC' },
        { d: 26, m: 8, time: '11:00', opp: 'DRX',       event: 'VCT PACIFIC' }
      ],
      recent: [
        { d: 16, m: 8, opp: 'T1',             score: '1 : 2', win: false, event: 'VCT PACIFIC' },
        { d: 11, m: 8, opp: 'DRX',            score: '2 : 0', win: true,  event: 'VCT PACIFIC' },
        { d: 8,  m: 8, opp: 'Paper Rex',      score: '2 : 0', win: true,  event: 'VCT PACIFIC' },
        { d: 4,  m: 8, opp: 'Global Esports', score: '2 : 1', win: true,  event: 'VCT PACIFIC' },
        { d: 1,  m: 8, opp: 'Team Secret',    score: '1 : 2', win: false, event: 'VCT PACIFIC' }
      ]
    },

    {
      slug: 'b8', alias: ['b8', 'б8'], name: 'B8', game: 'CS2', rank: 15, win: 54.2,
      mark: 'B8', tint: '#5cc8ff',
      region: T('Ukraine', 'Україна', 'Украина'), founded: 2019, earnings: '$1.4M', titles: 2,
      coach: 'Ostapenko', streak: 2, played: 47,
      blurb: T('The second Ukrainian flag in tier-1 brackets, and the loudest room at any LAN.',
               'Другий український прапор у сітках першого тіру — і найгучніша зала на будь-якому LAN.',
               'Второй украинский флаг в сетках первого тира — и самый громкий зал на любом LAN.'),
      about: T(['B8 exist in the gap between tier-2 and tier-1, and they have spent three years refusing to settle into either. The roster qualifies for events it is not seeded for, then beats at least one team it has no business beating.',
                'This season is the first where that stopped looking like variance. They came through the EWC group stage without dropping a series, and drew Team Spirit for their trouble.'],
               ['B8 існують у проміжку між другим і першим тіром і три роки поспіль відмовляються осісти в будь-якому з них. Склад проходить кваліфікації на турніри, де його не сіють, а потім обіграє щонайменше одну команду, яку обігравати не мав би.',
                'Цей сезон — перший, коли це перестало виглядати як випадковість. Вони пройшли груповий етап EWC без жодної програної серії — і отримали за це Team Spirit у суперники.'],
               ['B8 существуют в промежутке между вторым и первым тиром и три года подряд отказываются осесть в любом из них. Состав проходит квалификации на турниры, где его не сеют, а потом обыгрывает как минимум одну команду, которую обыгрывать не должен.',
                'Этот сезон — первый, когда это перестало выглядеть случайностью. Они прошли групповой этап EWC без единой проигранной серии — и получили за это Team Spirit в соперники.']),
      roster: [
        { nick: 'kalyna',  role: ROLE.igl,     rating: 1.04, kd: '0.99' },
        { nick: 'zoryan',  role: ROLE.awp,     rating: 1.19, kd: '1.24' },
        { nick: 'hrim',    role: ROLE.rifle,   rating: 1.13, kd: '1.15' },
        { nick: 'vitr',    role: ROLE.entry,   rating: 1.08, kd: '1.03' },
        { nick: 'berest',  role: ROLE.support, rating: 0.97, kd: '0.92' }
      ],
      trend: [38, 42, 45, 44, 49, 47, 52, 50, 55, 53, 56, 54],
      pools: [
        { label: 'Ancient', value: 71 }, { label: 'Anubis', value: 64 },
        { label: 'Mirage', value: 57 }, { label: 'Inferno', value: 51 }, { label: 'Nuke', value: 43 }
      ],
      poolKey: 'team.mapPool',
      splitA: T('Attack', 'Атака', 'Атака'), splitB: T('Defence', 'Захист', 'Защита'),
      splitVals: [56, 44],
      form: [true, true, false, true, false, true, false, false, true, true],
      fixtures: [
        { d: 19, m: 7, time: '16:00', opp: 'Team Spirit',   event: 'EWC 2026' },
        { d: 3,  m: 8, time: '13:00', opp: 'Inner Circle',  event: 'WARSAW LAN' },
        { d: 6,  m: 8, time: '18:00', opp: 'MOUZ',          event: 'WARSAW LAN' }
      ],
      recent: [
        { d: 16, m: 7, opp: 'Legacy',        score: '2 : 0', win: true,  event: 'EWC 2026' },
        { d: 15, m: 7, opp: 'Inner Circle',  score: '2 : 1', win: true,  event: 'EWC 2026' },
        { d: 12, m: 7, opp: 'FaZe Clan',     score: '0 : 2', win: false, event: 'BLAST PREMIER' },
        { d: 9,  m: 7, opp: 'Astralis',      score: '2 : 1', win: true,  event: 'BLAST PREMIER' },
        { d: 5,  m: 7, opp: 'G2 Esports',    score: '1 : 2', win: false, event: 'BLAST PREMIER' }
      ]
    },

    /* ------------------------------------------------------ LEAGUE OF LEGENDS
       LoL has one map, so the pool chart reports sides and series formats
       instead, and the split bar reports blue/red rather than attack/defence. */
    {
      slug: 'hanwha-life', alias: ['hle', 'hanwha', 'ханва'], name: 'Hanwha Life Esports', game: 'LOL', rank: 3, win: 71.8,
      mark: 'HLE', tint: '#ff8a3d',
      region: T('South Korea', 'Південна Корея', 'Южная Корея'), founded: 2018, earnings: '$3.9M', titles: 3,
      coach: 'Choi', streak: 5, played: 62,
      splitKey: 'team.sideSplitLol',
      blurb: T('The most disciplined draft in the LCK, and the hardest team in the league to surprise.',
               'Найдисциплінованіший драфт у LCK і команда, яку найважче здивувати.',
               'Самый дисциплинированный драфт в LCK и команда, которую труднее всего удивить.'),
      about: T(['Hanwha spent years as the league\'s most expensive disappointment before the current staff rebuilt the roster around information rather than firepower. They win the draft, then win the map by never being where the enemy expects.',
                'Their trademark is the twenty-minute stall: no team in the LCK gives up fewer objectives while behind, and none is better at turning a neutral mid-game into a won one.'],
               ['Hanwha роками були найдорожчим розчаруванням ліги, доки нинішній штаб не перебудував склад навколо інформації, а не вогневої потужності. Вони виграють драфт, а потім виграють карту, ніколи не опиняючись там, де їх чекають.',
                'Їхня візитівка — двадцятихвилинне затягування: жодна команда LCK не віддає менше об’єктів, програючи, і жодна не переводить нейтральну середню стадію у виграну краще за них.'],
               ['Hanwha годами были самым дорогим разочарованием лиги, пока нынешний штаб не перестроил состав вокруг информации, а не огневой мощи. Они выигрывают драфт, а потом выигрывают карту, никогда не оказываясь там, где их ждут.',
                'Их визитная карточка — двадцатиминутное затягивание: ни одна команда LCK не отдаёт меньше объектов, проигрывая, и ни одна не переводит нейтральную среднюю стадию в выигранную лучше них.']),
      roster: [
        { nick: 'seowon',  role: ROLE.top,     rating: 1.14, kd: '3.9' },
        { nick: 'garam',   role: ROLE.jungle,  rating: 1.22, kd: '4.4' },
        { nick: 'haruel',  role: ROLE.mid,     rating: 1.27, kd: '5.1' },
        { nick: 'jiwoo',   role: ROLE.adc,     rating: 1.19, kd: '6.2' },
        { nick: 'baeksan', role: ROLE.support, rating: 1.03, kd: '2.1' }
      ],
      trend: [54, 58, 61, 59, 64, 67, 63, 69, 72, 68, 74, 72],
      pools: [
        { label: 'Blue', value: 78 }, { label: 'Red', value: 66 },
        { label: 'BO1', value: 70 }, { label: 'BO3', value: 74 }, { label: 'BO5', value: 81 }
      ],
      poolKey: 'team.sidePool',
      splitA: T('Blue side', 'Синя сторона', 'Синяя сторона'), splitB: T('Red side', 'Червона сторона', 'Красная сторона'),
      splitVals: [78, 66],
      form: [true, true, true, true, false, true, true, false, true, true],
      fixtures: [
        { d: 19, m: 7, time: '11:00', opp: 'T1',          event: 'LCK SUMMER' },
        { d: 23, m: 7, time: '13:00', opp: 'Dplus KIA',   event: 'LCK SUMMER' },
        { d: 27, m: 7, time: '11:00', opp: 'KT Rolster',  event: 'LCK SUMMER' }
      ],
      recent: [
        { d: 16, m: 7, opp: 'Gen.G',        score: '2 : 0', win: true,  event: 'LCK SUMMER' },
        { d: 13, m: 7, opp: 'Dplus KIA',    score: '2 : 1', win: true,  event: 'LCK SUMMER' },
        { d: 10, m: 7, opp: 'T1',           score: '1 : 2', win: false, event: 'LCK SUMMER' },
        { d: 6,  m: 7, opp: 'KT Rolster',   score: '2 : 0', win: true,  event: 'LCK SUMMER' },
        { d: 2,  m: 7, opp: 'Bilibili Gaming', score: '2 : 1', win: true, event: 'MSI' }
      ]
    },

    {
      slug: 'bilibili-gaming', alias: ['blg', 'bilibili', 'білібілі', 'билибили'], name: 'Bilibili Gaming', game: 'LOL', rank: 5, win: 67.4,
      mark: 'BLG', tint: '#00a1d6',
      region: T('China', 'Китай', 'Китай'), founded: 2017, earnings: '$5.2M', titles: 4,
      coach: 'Wen', streak: 3, played: 71,
      splitKey: 'team.sideSplitLol',
      blurb: T('The fastest team in the LPL, and the one most willing to lose a game to win a series.',
               'Найшвидша команда LPL — і та, що охочіше за всіх програє гру, аби виграти серію.',
               'Самая быстрая команда LPL — и та, что охотнее всех проигрывает игру, чтобы выиграть серию.'),
      about: T(['BLG play the highest-tempo League in the world. Their average game is four minutes shorter than the LPL median, and they hold the league record for earliest first tower.',
                'The cost is a first-game loss rate that would sink most rosters. They treat game one as reconnaissance, adjust the draft, and take the next two — which works often enough that opponents now ban against a draft BLG have not shown yet.'],
               ['BLG грають найтемповіший League у світі. Їхня середня гра на чотири хвилини коротша за медіану LPL, і їм належить рекорд ліги за найранішою першою вежею.',
                'Плата — відсоток поразок у першій грі, який потопив би більшість складів. Вони сприймають першу гру як розвідку, коригують драфт і забирають дві наступні — і це спрацьовує так часто, що суперники тепер банять проти драфту, який BLG ще не показували.'],
               ['BLG играют самый темповый League в мире. Их средняя игра на четыре минуты короче медианы LPL, и им принадлежит рекорд лиги по самой ранней первой башне.',
                'Плата — процент поражений в первой игре, который потопил бы большинство составов. Они воспринимают первую игру как разведку, корректируют драфт и забирают две следующие — и это срабатывает так часто, что соперники теперь банят против драфта, который BLG ещё не показывали.']),
      roster: [
        { nick: 'yulan',  role: ROLE.top,     rating: 1.09, kd: '3.4' },
        { nick: 'shuang', role: ROLE.jungle,  rating: 1.24, kd: '4.8' },
        { nick: 'qixia',  role: ROLE.mid,     rating: 1.21, kd: '4.6' },
        { nick: 'linhai', role: ROLE.adc,     rating: 1.26, kd: '6.8' },
        { nick: 'bofan',  role: ROLE.support, rating: 1.01, kd: '2.0' }
      ],
      trend: [49, 55, 58, 56, 62, 60, 66, 63, 69, 65, 68, 67],
      pools: [
        { label: 'Blue', value: 72 }, { label: 'Red', value: 63 },
        { label: 'BO1', value: 58 }, { label: 'BO3', value: 71 }, { label: 'BO5', value: 76 }
      ],
      poolKey: 'team.sidePool',
      splitA: T('Blue side', 'Синя сторона', 'Синяя сторона'), splitB: T('Red side', 'Червона сторона', 'Красная сторона'),
      splitVals: [72, 63],
      form: [true, false, true, true, true, false, true, true, false, true],
      fixtures: [
        { d: 20, m: 7, time: '14:00', opp: 'Top Esports',  event: 'LPL SUMMER' },
        { d: 24, m: 7, time: '12:00', opp: 'JD Gaming',    event: 'LPL SUMMER' },
        { d: 28, m: 7, time: '14:00', opp: 'Weibo Gaming', event: 'LPL SUMMER' }
      ],
      recent: [
        { d: 17, m: 7, opp: 'Weibo Gaming',  score: '2 : 0', win: true,  event: 'LPL SUMMER' },
        { d: 14, m: 7, opp: 'JD Gaming',     score: '2 : 1', win: true,  event: 'LPL SUMMER' },
        { d: 11, m: 7, opp: 'Top Esports',   score: '1 : 2', win: false, event: 'LPL SUMMER' },
        { d: 7,  m: 7, opp: 'LNG Esports',   score: '2 : 0', win: true,  event: 'LPL SUMMER' },
        { d: 2,  m: 7, opp: 'Hanwha Life Esports', score: '1 : 2', win: false, event: 'MSI' }
      ]
    },

    {
      slug: 'dplus-kia', alias: ['dk', 'dplus', 'damwon', 'дплюс'], name: 'Dplus KIA', game: 'LOL', rank: 10, win: 60.6,
      mark: 'DK', tint: '#4d7cff',
      region: T('South Korea', 'Південна Корея', 'Южная Корея'), founded: 2017, earnings: '$4.4M', titles: 3,
      coach: 'Ryu', streak: 1, played: 60,
      splitKey: 'team.sideSplitLol',
      blurb: T('A former world champion rebuilding in public, one split at a time.',
               'Колишній чемпіон світу, що перебудовується публічно — по одному спліту за раз.',
               'Бывший чемпион мира, перестраивающийся публично — по одному сплиту за раз.'),
      about: T(['Dplus won a World Championship with a roster that no longer exists. What remains is an academy system that keeps producing starters and a coaching staff willing to play them before they are ready.',
                'This split is the first where that patience has looked like a plan rather than a shortage. Three of the five starters came through the academy, and the team has beaten every side above it at least once.'],
               ['Dplus вигравали чемпіонат світу складом, якого більше не існує. Лишилася академія, що стабільно постачає стартерів, і тренерський штаб, готовий випускати їх до того, як вони готові.',
                'Цей спліт — перший, де таке терпіння виглядає планом, а не браком. Троє з п’яти стартерів прийшли з академії, і команда обіграла кожного суперника вище себе щонайменше раз.'],
               ['Dplus выигрывали чемпионат мира составом, которого больше не существует. Осталась академия, стабильно поставляющая стартеров, и тренерский штаб, готовый выпускать их до того, как они готовы.',
                'Этот сплит — первый, где такое терпение выглядит планом, а не нехваткой. Трое из пяти стартеров пришли из академии, и команда обыграла каждого соперника выше себя как минимум раз.']),
      roster: [
        { nick: 'daehyun', role: ROLE.top,     rating: 1.06, kd: '3.1' },
        { nick: 'noeul',   role: ROLE.jungle,  rating: 1.11, kd: '3.8' },
        { nick: 'sihyun',  role: ROLE.mid,     rating: 1.17, kd: '4.3' },
        { nick: 'yyul',    role: ROLE.adc,     rating: 1.13, kd: '5.4' },
        { nick: 'moran',   role: ROLE.support, rating: 0.98, kd: '1.9' }
      ],
      trend: [44, 48, 52, 50, 55, 53, 58, 56, 61, 58, 62, 61],
      pools: [
        { label: 'Blue', value: 66 }, { label: 'Red', value: 57 },
        { label: 'BO1', value: 61 }, { label: 'BO3', value: 63 }, { label: 'BO5', value: 55 }
      ],
      poolKey: 'team.sidePool',
      splitA: T('Blue side', 'Синя сторона', 'Синяя сторона'), splitB: T('Red side', 'Червона сторона', 'Красная сторона'),
      splitVals: [66, 57],
      form: [false, true, true, false, true, true, false, true, false, true],
      fixtures: [
        { d: 21, m: 7, time: '11:00', opp: 'Gen.G',              event: 'LCK SUMMER' },
        { d: 23, m: 7, time: '13:00', opp: 'Hanwha Life Esports', event: 'LCK SUMMER' },
        { d: 29, m: 7, time: '11:00', opp: 'T1',                 event: 'LCK SUMMER' }
      ],
      recent: [
        { d: 15, m: 7, opp: 'KT Rolster',          score: '2 : 1', win: true,  event: 'LCK SUMMER' },
        { d: 13, m: 7, opp: 'Hanwha Life Esports', score: '1 : 2', win: false, event: 'LCK SUMMER' },
        { d: 9,  m: 7, opp: 'Kwangdong Freecs',    score: '2 : 0', win: true,  event: 'LCK SUMMER' },
        { d: 5,  m: 7, opp: 'T1',                  score: '0 : 2', win: false, event: 'LCK SUMMER' },
        { d: 1,  m: 7, opp: 'Nongshim RedForce',   score: '2 : 0', win: true,  event: 'LCK SUMMER' }
      ]
    },

    {
      slug: 'fnatic', alias: ['fnc', 'fnatic', 'фнатік', 'фнатик'], name: 'FNATIC', game: 'LOL', rank: 14, win: 56.2,
      mark: 'FNC', tint: '#ff5900',
      region: T('Europe', 'Європа', 'Европа'), founded: 2004, earnings: '$8.1M', titles: 7,
      coach: 'Nielsen', streak: 2, played: 58,
      splitKey: 'team.sideSplitLol',
      blurb: T('The oldest brand in the game, still refusing to play a safe draft.',
               'Найстаріший бренд у дисципліні, який досі відмовляється грати безпечний драфт.',
               'Самый старый бренд в дисциплине, до сих пор отказывающийся играть безопасный драфт.'),
      about: T(['FNATIC have been in League since the first World Championship, which they won. Two decades later the roster changes constantly and the identity does not: they draft for the fight they want, not the one the patch offers.',
                'It makes them the most watchable team in the LEC and the least predictable in a bracket. They are also the only European side with a winning record against the LCK this year, on a sample of four.'],
               ['FNATIC у League від першого чемпіонату світу, який вони й виграли. Через два десятиліття склад змінюється постійно, а ідентичність — ні: вони драфтять під бій, який хочуть, а не під той, що пропонує патч.',
                'Це робить їх найвидовищнішою командою LEC і найменш передбачуваною в сітці. Вони ж єдина європейська команда з позитивним балансом проти LCK цього року — на вибірці з чотирьох матчів.'],
               ['FNATIC в League с первого чемпионата мира, который они и выиграли. Через два десятилетия состав меняется постоянно, а идентичность — нет: они драфтят под бой, который хотят, а не под тот, что предлагает патч.',
                'Это делает их самой зрелищной командой LEC и наименее предсказуемой в сетке. Они же единственная европейская команда с положительным балансом против LCK в этом году — на выборке из четырёх матчей.']),
      roster: [
        { nick: 'arvid',  role: ROLE.top,     rating: 1.04, kd: '2.9' },
        { nick: 'kasper', role: ROLE.jungle,  rating: 1.12, kd: '3.7' },
        { nick: 'milos',  role: ROLE.mid,     rating: 1.18, kd: '4.5' },
        { nick: 'teodor', role: ROLE.adc,     rating: 1.15, kd: '5.6' },
        { nick: 'ruben',  role: ROLE.support, rating: 0.99, kd: '1.8' }
      ],
      trend: [41, 45, 49, 47, 52, 50, 55, 52, 58, 54, 57, 56],
      pools: [
        { label: 'Blue', value: 62 }, { label: 'Red', value: 55 },
        { label: 'BO1', value: 57 }, { label: 'BO3', value: 59 }, { label: 'BO5', value: 64 }
      ],
      poolKey: 'team.sidePool',
      splitA: T('Blue side', 'Синя сторона', 'Синяя сторона'), splitB: T('Red side', 'Червона сторона', 'Красная сторона'),
      splitVals: [62, 55],
      form: [true, true, false, false, true, false, true, true, false, true],
      fixtures: [
        { d: 20, m: 7, time: '18:00', opp: 'G2 Esports',   event: 'LEC SUMMER' },
        { d: 24, m: 7, time: '20:00', opp: 'KOI',          event: 'LEC SUMMER' },
        { d: 27, m: 7, time: '18:00', opp: 'Team Vitality', event: 'LEC SUMMER' }
      ],
      recent: [
        { d: 16, m: 7, opp: 'Team Heretics', score: '2 : 0', win: true,  event: 'LEC SUMMER' },
        { d: 13, m: 7, opp: 'KOI',           score: '2 : 1', win: true,  event: 'LEC SUMMER' },
        { d: 10, m: 7, opp: 'G2 Esports',    score: '0 : 2', win: false, event: 'LEC SUMMER' },
        { d: 6,  m: 7, opp: 'SK Gaming',     score: '2 : 0', win: true,  event: 'LEC SUMMER' },
        { d: 3,  m: 7, opp: 'Team BDS',      score: '1 : 2', win: false, event: 'LEC SUMMER' }
      ]
    },

    /* ------------------------------------------------------------------ PUBG
       Battle royale has no head-to-head series: the pool chart reports map win
       rate, and the split bar reports where the points came from. */
    {
      slug: 'twisted-minds', alias: ['tm', 'twisted', 'твістед', 'твистед'], name: 'Twisted Minds', game: 'PUBG', rank: 7, win: 64.9,
      mark: 'TM', tint: '#00d4a0',
      region: T('MENA', 'MENA', 'MENA'), founded: 2017, earnings: '$2.8M', titles: 5,
      coach: 'Faisal', streak: 4, played: 88,
      splitKey: 'team.sideSplitPubg',
      blurb: T('The most aggressive rotation in the circuit, and the highest kill share of any top-ten squad.',
               'Найагресивніші ротації в турі й найбільша частка фрагів серед усього топ-10.',
               'Самые агрессивные ротации в туре и самая большая доля фрагов среди всего топ-10.'),
      about: T(['Twisted Minds do not play for placement. They take contested drops, rotate early into the circle they want, and accept the games where that ends at fourteenth place.',
                'Across a full tournament it works: they lead the circuit in kill points by a wide margin, and their average placement is only marginally worse than teams that play twice as passively.'],
               ['Twisted Minds не грають на розміщення. Вони висаджуються в спірних точках, рано ротуються в потрібне коло і приймають ігри, де це закінчується чотирнадцятим місцем.',
                'На дистанції турніру це працює: вони з великим відривом лідирують у турі за очками за фраги, а їхнє середнє розміщення лише трохи гірше, ніж у команд, що грають удвічі пасивніше.'],
               ['Twisted Minds не играют на размещение. Они высаживаются в спорных точках, рано ротируются в нужный круг и принимают игры, где это заканчивается четырнадцатым местом.',
                'На дистанции турнира это работает: они с большим отрывом лидируют в туре по очкам за фраги, а их среднее размещение лишь немного хуже, чем у команд, играющих вдвое пассивнее.']),
      roster: [
        { nick: 'rakan',  role: ROLE.igl,     rating: 1.08, kd: '2.4' },
        { nick: 'shadad', role: ROLE.fragger, rating: 1.31, kd: '3.6' },
        { nick: 'wadi',   role: ROLE.sniper,  rating: 1.19, kd: '2.9' },
        { nick: 'tamim',  role: ROLE.support, rating: 1.02, kd: '2.0' }
      ],
      trend: [51, 55, 58, 56, 61, 64, 60, 66, 63, 68, 66, 65],
      pools: [
        { label: 'Erangel', value: 74 }, { label: 'Miramar', value: 69 },
        { label: 'Taego', value: 63 }, { label: 'Vikendi', value: 58 }, { label: 'Sanhok', value: 52 }
      ],
      poolKey: 'team.mapPool',
      splitA: T('Kill points', 'Очки за фраги', 'Очки за фраги'), splitB: T('Placement', 'За розміщення', 'За размещение'),
      splitVals: [61, 39],
      form: [true, true, true, false, true, true, true, false, true, false],
      fixtures: [
        { d: 22, m: 7, time: '16:00', opp: 'Four Angry Men', event: 'PGS 5' },
        { d: 26, m: 7, time: '16:00', opp: 'Soniqs',         event: 'PGS 5' },
        { d: 30, m: 7, time: '18:00', opp: 'Danawa e-sports', event: 'PGS 5' }
      ],
      recent: [
        { d: 18, m: 7, opp: 'Petrichor Road',  score: '1st', win: true,  event: 'EWC 2026' },
        { d: 15, m: 7, opp: '17Gaming',        score: '3rd', win: true,  event: 'EWC 2026' },
        { d: 12, m: 7, opp: 'Four Angry Men',  score: '9th', win: false, event: 'EWC 2026' },
        { d: 8,  m: 7, opp: 'Soniqs',          score: '2nd', win: true,  event: 'PGS 4' },
        { d: 4,  m: 7, opp: 'Danawa e-sports', score: '1st', win: true,  event: 'PGS 4' }
      ]
    },

    {
      slug: 'four-angry-men', alias: ['4am', 'fam', '4 angry men', 'фор енгрі'], name: 'Four Angry Men', game: 'PUBG', rank: 13, win: 57.3,
      mark: '4AM', tint: '#e03b3b',
      region: T('China', 'Китай', 'Китай'), founded: 2018, earnings: '$3.6M', titles: 6,
      coach: 'Liang', streak: 2, played: 92,
      splitKey: 'team.sideSplitPubg',
      blurb: T('The most decorated PUBG roster in China, built entirely around surviving the last circle.',
               'Найтитулованіший склад PUBG у Китаї, побудований цілком навколо виживання в останньому колі.',
               'Самый титулованный состав PUBG в Китае, построенный целиком вокруг выживания в последнем круге.'),
      about: T(['4AM are the mirror image of the aggressive teams above them: they take uncontested drops, rotate late, and arrive at the final circle with full utility more often than anyone in the circuit.',
                'It produces the highest top-five rate in the game and a kill count that looks unimpressive until you notice how many of those kills decide a match.'],
               ['4AM — дзеркальне відображення агресивних команд вище: вони висаджуються без боротьби, ротуються пізно і виходять у фінальне коло з повним набором розхідників частіше за будь-кого в турі.',
                'Це дає найвищий відсоток топ-5 у дисципліні й кількість фрагів, що виглядає непоказно, доки не помітиш, скільки з них вирішують матч.'],
               ['4AM — зеркальное отражение агрессивных команд выше: они высаживаются без борьбы, ротируются поздно и выходят в финальный круг с полным набором расходников чаще, чем кто-либо в туре.',
                'Это даёт самый высокий процент топ-5 в дисциплине и количество фрагов, которое выглядит непоказательно, пока не заметишь, сколько из них решают матч.']),
      roster: [
        { nick: 'yuhang', role: ROLE.igl,     rating: 1.05, kd: '2.2' },
        { nick: 'zicheng', role: ROLE.fragger, rating: 1.21, kd: '3.1' },
        { nick: 'weilin', role: ROLE.sniper,  rating: 1.16, kd: '2.8' },
        { nick: 'haoran', role: ROLE.support, rating: 1.00, kd: '1.9' }
      ],
      trend: [46, 49, 53, 51, 56, 54, 59, 55, 60, 57, 59, 57],
      pools: [
        { label: 'Miramar', value: 71 }, { label: 'Erangel', value: 64 },
        { label: 'Vikendi', value: 59 }, { label: 'Taego', value: 54 }, { label: 'Sanhok', value: 47 }
      ],
      poolKey: 'team.mapPool',
      splitA: T('Kill points', 'Очки за фраги', 'Очки за фраги'), splitB: T('Placement', 'За розміщення', 'За размещение'),
      splitVals: [34, 66],
      form: [true, false, true, true, false, true, false, true, true, false],
      fixtures: [
        { d: 22, m: 7, time: '16:00', opp: 'Twisted Minds', event: 'PGS 5' },
        { d: 25, m: 7, time: '14:00', opp: 'Petrichor Road', event: 'PGS 5' },
        { d: 29, m: 7, time: '16:00', opp: '17Gaming',      event: 'PGS 5' }
      ],
      recent: [
        { d: 17, m: 7, opp: 'Tianba',         score: '2nd',  win: true,  event: 'EWC 2026' },
        { d: 12, m: 7, opp: 'Twisted Minds',  score: '1st',  win: true,  event: 'EWC 2026' },
        { d: 9,  m: 7, opp: '17Gaming',       score: '11th', win: false, event: 'EWC 2026' },
        { d: 5,  m: 7, opp: 'Petrichor Road', score: '4th',  win: true,  event: 'PGS 4' },
        { d: 1,  m: 7, opp: 'Soniqs',         score: '8th',  win: false, event: 'PGS 4' }
      ]
    },

    {
      slug: 'soniqs', alias: ['sq', 'soniqs', 'соніks', 'соникс'], name: 'Soniqs', game: 'PUBG', rank: 16, win: 53.4,
      mark: 'SQ', tint: '#35c8e8',
      region: T('North America', 'Північна Америка', 'Северная Америка'), founded: 2019, earnings: '$1.9M', titles: 3,
      coach: 'Harper', streak: 1, played: 84,
      splitKey: 'team.sideSplitPubg',
      blurb: T('The last North American roster still competing at the top of a circuit its region abandoned.',
               'Останній північноамериканський склад, що досі бореться на вершині туру, який його регіон покинув.',
               'Последний североамериканский состав, до сих пор борющийся на вершине тура, который его регион покинул.'),
      about: T(['North American PUBG shrank from twelve organisations to three in four years. Soniqs are the one that kept a full-time roster through it, and they are still qualifying for global events.',
                'Playing a thin region has a cost: they arrive at international tournaments with less scrim time against top opposition than anyone in the field, and the first day usually shows it. The second rarely does.'],
               ['Північноамериканський PUBG за чотири роки скоротився з дванадцяти організацій до трьох. Soniqs — та, що зберегла склад на повній ставці, і вони досі кваліфікуються на світові турніри.',
                'Гра в тонкому регіоні має ціну: на міжнародні турніри вони приїжджають із меншою кількістю скримів проти топ-суперників, ніж будь-хто в сітці, і перший день це зазвичай показує. Другий — рідко.'],
               ['Североамериканский PUBG за четыре года сократился с двенадцати организаций до трёх. Soniqs — та, что сохранила состав на полной ставке, и они до сих пор квалифицируются на мировые турниры.',
                'Игра в тонком регионе имеет цену: на международные турниры они приезжают с меньшим количеством скримов против топ-соперников, чем кто-либо в сетке, и первый день это обычно показывает. Второй — редко.']),
      roster: [
        { nick: 'colton', role: ROLE.igl,     rating: 1.02, kd: '2.1' },
        { nick: 'brixx',  role: ROLE.fragger, rating: 1.17, kd: '2.9' },
        { nick: 'dallas', role: ROLE.sniper,  rating: 1.11, kd: '2.6' },
        { nick: 'nyko',   role: ROLE.support, rating: 0.97, kd: '1.7' }
      ],
      trend: [39, 43, 46, 44, 49, 47, 52, 49, 54, 51, 55, 53],
      pools: [
        { label: 'Erangel', value: 66 }, { label: 'Taego', value: 60 },
        { label: 'Miramar', value: 55 }, { label: 'Sanhok', value: 50 }, { label: 'Vikendi', value: 44 }
      ],
      poolKey: 'team.mapPool',
      splitA: T('Kill points', 'Очки за фраги', 'Очки за фраги'), splitB: T('Placement', 'За розміщення', 'За размещение'),
      splitVals: [52, 48],
      form: [false, true, true, false, true, false, false, true, true, false],
      fixtures: [
        { d: 26, m: 7, time: '16:00', opp: 'Twisted Minds', event: 'PGS 5' },
        { d: 28, m: 7, time: '18:00', opp: 'Danawa e-sports', event: 'PGS 5' },
        { d: 31, m: 7, time: '16:00', opp: 'Virtus.pro',    event: 'PGS 5' }
      ],
      recent: [
        { d: 16, m: 7, opp: 'Virtus.pro',     score: '5th',  win: true,  event: 'EWC 2026' },
        { d: 11, m: 7, opp: 'Danawa e-sports', score: '13th', win: false, event: 'EWC 2026' },
        { d: 8,  m: 7, opp: 'Twisted Minds',  score: '6th',  win: false, event: 'PGS 4' },
        { d: 4,  m: 7, opp: '17Gaming',       score: '3rd',  win: true,  event: 'PGS 4' },
        { d: 1,  m: 7, opp: 'Four Angry Men', score: '2nd',  win: true,  event: 'PGS 4' }
      ]
    },

    {
      slug: 'danawa', alias: ['dnw', 'danawa', 'данава'], name: 'Danawa e-sports', game: 'PUBG', rank: 17, win: 51.8,
      mark: 'DNW', tint: '#57c96a',
      region: T('South Korea', 'Південна Корея', 'Южная Корея'), founded: 2018, earnings: '$2.1M', titles: 2,
      coach: 'Park', streak: 1, played: 90,
      splitKey: 'team.sideSplitPubg',
      blurb: T('A world champion roster that never rebuilt, and is still dangerous on the maps it knows.',
               'Склад-чемпіон світу, що так і не перебудувався — і досі небезпечний на картах, які знає.',
               'Состав-чемпион мира, так и не перестроившийся — и до сих пор опасный на картах, которые знает.'),
      about: T(['Danawa won a world championship with four players who are still on the roster. That continuity is rare enough in PUBG to be a strategy in itself: their rotations are wordless, and they read a circle faster than teams with better individual aim.',
                'The flip side is a map pool that has narrowed as the game changed around them. On Erangel they still beat anyone; on the newer maps they are a mid-table team.'],
               ['Danawa виграли чемпіонат світу вчотирьох гравцями, які досі у складі. Така спадкоємність у PUBG настільки рідкісна, що сама по собі є стратегією: їхні ротації безсловесні, а коло вони читають швидше за команди з кращим індивідуальним аїмом.',
                'Зворотний бік — пул карт, що звузився, поки гра змінювалася довкола них. На Erangel вони досі обіграють будь-кого; на новіших картах це команда середини таблиці.'],
               ['Danawa выиграли чемпионат мира вчетвером игроками, которые до сих пор в составе. Такая преемственность в PUBG настолько редка, что сама по себе является стратегией: их ротации бессловесны, а круг они читают быстрее команд с лучшим индивидуальным аимом.',
                'Обратная сторона — пул карт, сузившийся, пока игра менялась вокруг них. На Erangel они до сих пор обыгрывают кого угодно; на новых картах это команда середины таблицы.']),
      roster: [
        { nick: 'jaehun', role: ROLE.igl,     rating: 1.03, kd: '2.0' },
        { nick: 'seungmin', role: ROLE.fragger, rating: 1.14, kd: '2.7' },
        { nick: 'doyoon', role: ROLE.sniper,  rating: 1.09, kd: '2.5' },
        { nick: 'hanbin', role: ROLE.support, rating: 0.96, kd: '1.6' }
      ],
      trend: [37, 41, 44, 42, 47, 45, 50, 47, 52, 49, 53, 52],
      pools: [
        { label: 'Erangel', value: 78 }, { label: 'Miramar', value: 57 },
        { label: 'Taego', value: 48 }, { label: 'Vikendi', value: 45 }, { label: 'Sanhok', value: 41 }
      ],
      poolKey: 'team.mapPool',
      splitA: T('Kill points', 'Очки за фраги', 'Очки за фраги'), splitB: T('Placement', 'За розміщення', 'За размещение'),
      splitVals: [41, 59],
      form: [true, false, false, true, true, false, true, false, false, true],
      fixtures: [
        { d: 28, m: 7, time: '18:00', opp: 'Soniqs',        event: 'PGS 5' },
        { d: 30, m: 7, time: '18:00', opp: 'Twisted Minds', event: 'PGS 5' },
        { d: 2,  m: 8, time: '14:00', opp: 'Petrichor Road', event: 'PGS 5' }
      ],
      recent: [
        { d: 14, m: 7, opp: 'Tianba',         score: '7th',  win: false, event: 'EWC 2026' },
        { d: 11, m: 7, opp: 'Soniqs',         score: '4th',  win: true,  event: 'EWC 2026' },
        { d: 7,  m: 7, opp: '17Gaming',       score: '10th', win: false, event: 'PGS 4' },
        { d: 4,  m: 7, opp: 'Twisted Minds',  score: '5th',  win: true,  event: 'PGS 4' },
        { d: 1,  m: 7, opp: 'Virtus.pro',     score: '12th', win: false, event: 'PGS 4' }
      ]
    }
  ],

  /* ---------------------------------------------------------------- news */
  /* News follows the house style of a Ukrainian sports desk: a punchy headline
     (often built around a quote), a one-line standfirst, then a short body.
     Topics track the real August 2026 agenda — EWC 2026, the Passion UA
     collapse, r1nkle's move to G2 — but every line here is written for this
     prototype rather than lifted from anyone's newsroom. */
  news: [
    {
      id: 'hle-lck-streak',
      cat: 'LOL', tone: 'primary', read: 3, image: 'assets/img/crowd-screen.jpg',
      age: T('6 HOURS AGO', '6 ГОДИН ТОМУ', '6 ЧАСОВ НАЗАД'),
      title: T('Hanwha Life take a fifth straight series and the LCK top seed',
               'Hanwha Life беруть п’яту серію поспіль і перше місце LCK',
               'Hanwha Life берут пятую серию подряд и первое место LCK'),
      excerpt: T('Five series without a loss, and the best blue-side record in the league.',
                 'П’ять серій без поразок і найкращий показник на синій стороні в лізі.',
                 'Пять серий без поражений и лучший показатель на синей стороне в лиге.'),
      body: T([
        'Hanwha closed out their fifth consecutive series win on Sunday, taking the top seed into the LCK playoffs with a game to spare.',
        'The run has been built on the draft. They have not lost a blue-side game in six weeks, and their win rate on that side now stands at 78 percent — the highest in the league by nine points.',
        'The coaching staff credited the mid-jungle pairing, which has led the league in early-game gold difference across the entire split.'
      ], [
        'Hanwha в неділю оформили п’яту поспіль перемогу в серії й забезпечили собі перше місце в плейоф LCK за гру до кінця.',
        'Серія побудована на драфті. Вони не програли жодної гри на синій стороні за шість тижнів, і їхній відсоток перемог там сягнув 78 — найкращий у лізі з відривом у дев’ять пунктів.',
        'Тренерський штаб віддав належне зв’язці мід — ліс, яка весь спліт лідирує в лізі за різницею золота в ранній грі.'
      ], [
        'Hanwha в воскресенье оформили пятую подряд победу в серии и обеспечили себе первое место в плей-офф LCK за игру до конца.',
        'Серия построена на драфте. Они не проиграли ни одной игры на синей стороне за шесть недель, и их процент побед там достиг 78 — лучший в лиге с отрывом в девять пунктов.',
        'Тренерский штаб отдал должное связке мид — лес, которая весь сплит лидирует в лиге по разнице золота в ранней игре.'
      ])
    },
    {
      id: 'twisted-minds-pgs',
      cat: 'PUBG', tone: 'tertiary', read: 3, image: 'assets/img/lan-event.jpg',
      age: T('10 HOURS AGO', '10 ГОДИН ТОМУ', '10 ЧАСОВ НАЗАД'),
      title: T('Twisted Minds lead PGS 5 on kill points alone',
               'Twisted Minds лідирують на PGS 5 самими лише очками за фраги',
               'Twisted Minds лидируют на PGS 5 одними лишь очками за фраги'),
      excerpt: T('Sixty-one percent of their total comes from kills — the highest share in the top ten.',
                 'Шістдесят один відсоток їхніх очок — за фраги. Найбільша частка в топ-10.',
                 'Шестьдесят один процент их очков — за фраги. Самая большая доля в топ-10.'),
      body: T([
        'The MENA roster finished day two on top of the standings without a single first place, which says everything about how they get there.',
        'Sixty-one percent of their points came from kills, the highest share of any team in the top ten. The circuit average is thirty-eight.',
        'Their coach has been asked about the risk at every event this year and gives the same answer: over sixteen games, aggression compounds and caution does not.'
      ], [
        'Склад із MENA завершив другий день на вершині таблиці, не взявши жодного першого місця, — і це вичерпно пояснює, як саме вони туди потрапляють.',
        'Шістдесят один відсоток їхніх очок прийшов із фрагів — найбільша частка серед усіх команд топ-10. Середнє по туру — тридцять вісім.',
        'Тренера питали про ризики на кожному турнірі цього року, і він дає ту саму відповідь: на дистанції в шістнадцять ігор агресія накопичується, а обережність — ні.'
      ], [
        'Состав из MENA завершил второй день на вершине таблицы, не взяв ни одного первого места, — и это исчерпывающе объясняет, как именно они туда попадают.',
        'Шестьдесят один процент их очков пришёл с фрагов — самая большая доля среди всех команд топ-10. Среднее по туру — тридцать восемь.',
        'Тренера спрашивали о рисках на каждом турнире в этом году, и он даёт тот же ответ: на дистанции в шестнадцать игр агрессия накапливается, а осторожность — нет.'
      ])
    },
    {
      id: 'r1nkle-g2',
      cat: 'CS2', tone: 'primary', read: 2, image: 'assets/img/player-station.jpg',
      age: T('2 HOURS AGO', '2 ГОДИНИ ТОМУ', '2 ЧАСА НАЗАД'),
      title: T('«We lacked aggression»: G2 coach explains the r1nkle transfer',
               '«Нам бракувало агресії»: тренер G2 пояснив трансфер українця r1nkle',
               '«Нам не хватало агрессии»: тренер G2 объяснил трансфер украинца r1nkle'),
      excerpt: T('The coach commented on how the Ukrainian sniper is settling into the new roster.',
                 'Наставник команди прокоментував адаптацію українського снайпера в новому ростері.',
                 'Наставник команды прокомментировал адаптацию украинского снайпера в новом ростере.'),
      body: T([
        'G2 have explained the reasoning behind signing the Ukrainian AWPer. According to the coaching staff, the previous roster had grown too passive on the opening rounds and needed a player willing to take the first duel.',
        'The sniper joined the roster in July and has since played eleven official maps. His opening-duel win rate over that stretch is the highest on the team.',
        'G2 open their EWC 2026 campaign this week. The coach confirmed the Ukrainian starts.'
      ], [
        'У G2 пояснили логіку підписання українського AWP-ера. За словами тренерського штабу, попередній склад став надто пасивним на перших раундах і потребував гравця, готового брати першу дуель.',
        'Снайпер приєднався до ростера в липні й відтоді зіграв одинадцять офіційних карт. Його відсоток перемог у перших дуелях за цей відрізок — найкращий у команді.',
        'G2 стартують на EWC 2026 цього тижня. Тренер підтвердив, що українець вийде в старті.'
      ], [
        'В G2 объяснили логику подписания украинского AWP-ера. По словам тренерского штаба, прежний состав стал слишком пассивным на первых раундах и нуждался в игроке, готовом брать первую дуэль.',
        'Снайпер присоединился к ростеру в июле и с тех пор сыграл одиннадцать официальных карт. Его процент побед в первых дуэлях за этот отрезок — лучший в команде.',
        'G2 стартуют на EWC 2026 на этой неделе. Тренер подтвердил, что украинец выйдет в старте.'
      ]),
      quote: T('We were not short on skill. We were short on someone taking the first fight.',
               'Нам бракувало не скілу. Нам бракувало того, хто візьме перший бій.',
               'Нам не хватало не скилла. Нам не хватало того, кто возьмёт первый бой.')
    },
    {
      id: 'passion-ua-debt',
      cat: 'CS2', tone: 'secondary', read: 3, image: 'assets/img/stage-truss.jpg',
      age: T('5 HOURS AGO', '5 ГОДИН ТОМУ', '5 ЧАСОВ НАЗАД'),
      title: T('Passion UA on the brink: debt to the CS roster reaches $600K',
               'Passion UA на межі ліквідації: борг перед CS-складом сягає $600K',
               'Passion UA на грани ликвидации: долг перед CS-составом достиг $600K'),
      excerpt: T('Players have not been paid for four months. The organisation has not commented.',
                 'Гравці не отримували зарплату чотири місяці. Організація коментарів не давала.',
                 'Игроки не получали зарплату четыре месяца. Организация комментариев не давала.'),
      body: T([
        'The organisation owes its Counter-Strike roster roughly $600,000 in unpaid salaries and prize money, according to two people familiar with the situation.',
        'The arrears began in April. Three of the five players have already notified the organisation that they consider their contracts void, and the coaching staff ended its cooperation last week.',
        'Passion UA have not responded to requests for comment. Their remaining tournament slots are now in question.'
      ], [
        'Організація заборгувала своєму складу з Counter-Strike близько $600 тисяч невиплаченої зарплати та призових — про це повідомляють двоє людей, обізнаних із ситуацією.',
        'Заборгованість почалася у квітні. Троє з п’яти гравців уже повідомили організацію, що вважають свої контракти недійсними, а тренерський штаб припинив співпрацю минулого тижня.',
        'У Passion UA на запити про коментар не відповіли. Їхні турнірні слоти тепер під питанням.'
      ], [
        'Организация задолжала своему составу по Counter-Strike около $600 тысяч невыплаченной зарплаты и призовых — об этом сообщают двое человек, осведомлённых о ситуации.',
        'Задолженность началась в апреле. Трое из пяти игроков уже уведомили организацию, что считают свои контракты недействительными, а тренерский штаб прекратил сотрудничество на прошлой неделе.',
        'В Passion UA на запросы о комментарии не ответили. Их турнирные слоты теперь под вопросом.'
      ])
    },
    {
      id: 'ewc-playoff-pairs',
      cat: 'CS2', tone: 'tertiary', read: 2, image: 'assets/img/stage-arena-main.jpg',
      age: T('7 HOURS AGO', '7 ГОДИН ТОМУ', '7 ЧАСОВ НАЗАД'),
      title: T('EWC 2026 playoff pairs set: who NAVI and B8 face',
               'Визначилися пари 1/8 фіналу EWC 2026 з CS2: з ким зіграють NAVI та B8',
               'Определились пары 1/8 финала EWC 2026 по CS2: с кем сыграют NAVI и B8'),
      excerpt: T('The first matches take place on 19 August. Two Ukrainian rosters are in the bracket.',
                 'Перші поєдинки пройдуть 19 серпня. У сітці — два українські склади.',
                 'Первые поединки пройдут 19 августа. В сетке — два украинских состава.'),
      body: T([
        'The Esports World Cup has confirmed its round-of-16 bracket. NAVI meet Legacy, while B8 drew the toughest possible opener against Team Spirit.',
        'Both Ukrainian rosters came through the group stage without dropping a series, though B8 needed three maps in two of their four matches.',
        'The first matches begin on 19 August. All series are best-of-three.'
      ], [
        'Esports World Cup підтвердив сітку 1/8 фіналу. NAVI зіграють із Legacy, а B8 дістався найважчий можливий стартовий суперник — Team Spirit.',
        'Обидва українські склади пройшли груповий етап без жодної програної серії, хоча B8 у двох матчах із чотирьох знадобилися три карти.',
        'Перші поєдинки стартують 19 серпня. Усі серії — до двох перемог.'
      ], [
        'Esports World Cup подтвердил сетку 1/8 финала. NAVI сыграют с Legacy, а B8 достался самый тяжёлый возможный стартовый соперник — Team Spirit.',
        'Оба украинских состава прошли групповой этап без единой проигранной серии, хотя B8 в двух матчах из четырёх понадобились три карты.',
        'Первые поединки стартуют 19 августа. Все серии — до двух побед.'
      ])
    },
    {
      id: 'kassad-favourites',
      cat: 'CS2', tone: 'primary', read: 2, image: 'assets/img/player-headset.jpg',
      age: T('9 HOURS AGO', '9 ГОДИН ТОМУ', '9 ЧАСОВ НАЗАД'),
      title: T('Analyst names his EWC 2026 favourites: «Falcons are number one»',
               'Аналітик назвав головних фаворитів EWC 2026 з CS2: «Falcons — номер один»',
               'Аналитик назвал главных фаворитов EWC 2026 по CS2: «Falcons — номер один»'),
      excerpt: T('He also rated NAVI\'s chances and explained why he does not back Spirit this time.',
                 'Він також оцінив шанси NAVI та пояснив, чому цього разу не ставить на Spirit.',
                 'Он также оценил шансы NAVI и объяснил, почему в этот раз не ставит на Spirit.'),
      body: T([
        'The analyst put Falcons at the top of his list, citing their form on the maps that dominate the current pool and the depth of their bench.',
        'NAVI, in his view, are a clear second tier — capable of beating anyone in a best-of-three but vulnerable in longer series where preparation matters more than firepower.',
        'He declined to back Spirit, pointing to their schedule: three tournaments in six weeks with almost no practice time between them.'
      ], [
        'Аналітик поставив Falcons на вершину свого списку, посилаючись на їхню форму на картах, що домінують у нинішньому пулі, та глибину лави запасних.',
        'NAVI, на його думку, — впевнений другий ешелон: здатні обіграти будь-кого в серії до двох перемог, але вразливі в довгих серіях, де підготовка важить більше за вогневу міць.',
        'Ставити на Spirit він відмовився, вказавши на їхній календар: три турніри за шість тижнів майже без часу на тренування між ними.'
      ], [
        'Аналитик поставил Falcons на вершину своего списка, ссылаясь на их форму на картах, доминирующих в нынешнем пуле, и глубину скамейки.',
        'NAVI, по его мнению, — уверенный второй эшелон: способны обыграть кого угодно в серии до двух побед, но уязвимы в длинных сериях, где подготовка весит больше огневой мощи.',
        'Ставить на Spirit он отказался, указав на их календарь: три турнира за шесть недель почти без времени на тренировки между ними.'
      ]),
      quote: T('Falcons are number one. Everyone else is playing for second.',
               'Falcons — номер один. Решта грають за друге місце.',
               'Falcons — номер один. Остальные играют за второе место.')
    },
    {
      id: 'furia-fe-valorant',
      cat: 'VALORANT', tone: 'primary', read: 3, image: 'assets/img/lan-event.jpg',
      age: T('12 HOURS AGO', '12 ГОДИН ТОМУ', '12 ЧАСОВ НАЗАД'),
      title: T('FURIA fe move to VALORANT: women\'s CS2 in deep crisis',
               'FURIA fe переходить у VALORANT: жіночий CS2 у глибокій кризі',
               'FURIA fe переходит в VALORANT: женский CS2 в глубоком кризисе'),
      excerpt: T('The fourth women\'s roster to leave Counter-Strike this year. The circuit is down to nine teams.',
                 'Четвертий жіночий склад, що залишає Counter-Strike цього року. У турі лишилося дев’ять команд.',
                 'Четвёртый женский состав, покидающий Counter-Strike в этом году. В туре осталось девять команд.'),
      body: T([
        'The organisation has moved its women\'s roster from Counter-Strike to VALORANT, becoming the fourth to do so in 2026.',
        'The reasoning is money. The women\'s VALORANT circuit runs a full season with guaranteed slots and a prize pool roughly four times larger than its Counter-Strike equivalent.',
        'Nine teams now remain in the women\'s CS2 circuit, down from seventeen at the start of last year. Two of the remaining nine have publicly said they are considering the same move.'
      ], [
        'Організація перевела свій жіночий склад із Counter-Strike у VALORANT, ставши четвертою, хто зробив це у 2026 році.',
        'Причина — гроші. Жіночий тур VALORANT проводить повноцінний сезон із гарантованими слотами та призовим фондом приблизно вчетверо більшим, ніж у Counter-Strike.',
        'У жіночому турі CS2 лишилося дев’ять команд проти сімнадцяти на початку минулого року. Дві з цих дев’яти публічно заявили, що розглядають такий самий крок.'
      ], [
        'Организация перевела свой женский состав из Counter-Strike в VALORANT, став четвёртой, кто сделал это в 2026 году.',
        'Причина — деньги. Женский тур VALORANT проводит полноценный сезон с гарантированными слотами и призовым фондом примерно вчетверо большим, чем в Counter-Strike.',
        'В женском туре CS2 осталось девять команд против семнадцати в начале прошлого года. Две из этих девяти публично заявили, что рассматривают такой же шаг.'
      ])
    },
    {
      id: 'ti-2026-playoff',
      cat: 'DOTA 2', tone: 'tertiary', read: 2, image: 'assets/img/stage-arena-packed.jpg',
      age: T('1 DAY AGO', '1 ДЕНЬ ТОМУ', '1 ДЕНЬ НАЗАД'),
      title: T('The International 2026 has its full playoff field',
               'The International 2026 визначив усі команди плей-оф',
               'The International 2026 определил все команды плей-офф'),
      excerpt: T('Falcons, BB, Spirit and Iron Wing took the last slots. The bracket starts on Friday.',
                 'Falcons, BB, Spirit та Iron Wing вибороли останні путівки. Сітка стартує в п’ятницю.',
                 'Falcons, BB, Spirit и Iron Wing выиграли последние путёвки. Сетка стартует в пятницу.'),
      body: T([
        'The group stage has finished and the sixteen playoff teams are confirmed. Four of the last slots went to Falcons, BB, Spirit and Iron Wing.',
        'Spirit topped their group without dropping a series, which puts the defending champions in the upper bracket for a third consecutive year.',
        'Playoff matches begin on Friday. The grand final is scheduled for 30 August.'
      ], [
        'Груповий етап завершився, шістнадцять команд плей-оф визначено. Чотири останні путівки дісталися Falcons, BB, Spirit та Iron Wing.',
        'Spirit очолили свою групу, не програвши жодної серії, — чинні чемпіони потрапляють у верхню сітку третій рік поспіль.',
        'Матчі плей-оф стартують у п’ятницю. Великий фінал заплановано на 30 серпня.'
      ], [
        'Групповой этап завершился, шестнадцать команд плей-офф определены. Четыре последние путёвки достались Falcons, BB, Spirit и Iron Wing.',
        'Spirit возглавили свою группу, не проиграв ни одной серии, — действующие чемпионы попадают в верхнюю сетку третий год подряд.',
        'Матчи плей-офф стартуют в пятницу. Большой финал запланирован на 30 августа.'
      ])
    },
    {
      id: 'mobile-legends-worlds',
      cat: 'ІНШЕ', tone: 'secondary', read: 2, image: 'assets/img/crowd-screen.jpg',
      age: T('1 DAY AGO', '1 ДЕНЬ ТОМУ', '1 ДЕНЬ НАЗАД'),
      title: T('Ukraine qualify for the 2026 Mobile Legends World Championship',
               'Україна пробилася на чемпіонат світу 2026 з Mobile Legends',
               'Украина пробилась на чемпионат мира 2026 по Mobile Legends'),
      excerpt: T('The national team beat Poland 3:1 in the lower bracket final.',
                 'Збірна перемогла Польщу у фіналі нижньої сітки з рахунком 3:1.',
                 'Сборная победила Польшу в финале нижней сетки со счётом 3:1.'),
      body: T([
        'Ukraine have qualified for the world championship for the first time, beating Poland 3:1 in the decisive lower-bracket final.',
        'After losing the opening game the team took three in a row, closing the series with a comeback from a 12,000 gold deficit in the fourth.',
        'The world championship takes place in December. Ukraine enter as the lowest seed from the European region.'
      ], [
        'Україна вперше кваліфікувалася на чемпіонат світу, обігравши Польщу 3:1 у вирішальному фіналі нижньої сітки.',
        'Програвши стартову гру, збірна взяла три поспіль і завершила серію камбеком із дефіциту в 12 тисяч золота в четвертій карті.',
        'Чемпіонат світу відбудеться в грудні. Україна заходить туди як найнижчий сід європейського регіону.'
      ], [
        'Украина впервые квалифицировалась на чемпионат мира, обыграв Польшу 3:1 в решающем финале нижней сетки.',
        'Проиграв стартовую игру, сборная взяла три подряд и завершила серию камбэком из дефицита в 12 тысяч золота в четвёртой карте.',
        'Чемпионат мира состоится в декабре. Украина заходит туда как самый низкий сид европейского региона.'
      ])
    },
    {
      id: 'nations-cup-2027',
      cat: 'ІНШЕ', tone: 'secondary', read: 2, image: 'assets/img/stage-truss.jpg',
      age: T('2 DAYS AGO', '2 ДНІ ТОМУ', '2 ДНЯ НАЗАД'),
      title: T('The debut Esports Nations Cup pushed from 2026 to 2027',
               'Дебютний Esports Nations Cup перенесли з 2026 на 2027 рік',
               'Дебютный Esports Nations Cup перенесли с 2026 на 2027 год'),
      excerpt: T('Organisers cite a calendar clash. National federations were told a week ago.',
                 'Організатори посилаються на накладку в календарі. Національні федерації повідомили тиждень тому.',
                 'Организаторы ссылаются на накладку в календаре. Национальные федерации уведомили неделю назад.'),
      body: T([
        'The first Esports Nations Cup will not take place this year. Organisers have moved it to 2027, citing an unresolvable clash with two existing international events.',
        'National federations were informed a week before the public announcement. At least three had already begun their qualification cycles.',
        'No new dates have been given beyond the year.'
      ], [
        'Перший Esports Nations Cup цьогоріч не відбудеться. Організатори перенесли його на 2027 рік, посилаючись на нерозв’язну накладку з двома наявними міжнародними турнірами.',
        'Національні федерації повідомили за тиждень до публічної заяви. Щонайменше три з них уже розпочали свої кваліфікаційні цикли.',
        'Конкретніших дат, окрім року, не назвали.'
      ], [
        'Первый Esports Nations Cup в этом году не состоится. Организаторы перенесли его на 2027 год, ссылаясь на неразрешимую накладку с двумя существующими международными турнирами.',
        'Национальные федерации уведомили за неделю до публичного заявления. Как минимум три из них уже начали свои квалификационные циклы.',
        'Более конкретных дат, кроме года, не назвали.'
      ])
    },
    {
      id: 'b8-warsaw-lan',
      cat: 'CS2', tone: 'tertiary', read: 2, image: 'assets/img/setup-neon.jpg',
      age: T('2 DAYS AGO', '2 ДНІ ТОМУ', '2 ДНЯ НАЗАД'),
      title: T('B8 and Inner Circle to play a Warsaw LAN',
               'B8 та Inner Circle зіграють на LAN-турнірі з CS2 у Варшаві',
               'B8 и Inner Circle сыграют на LAN-турнире по CS2 в Варшаве'),
      excerpt: T('Eight teams, a $150,000 prize pool and a full crowd. Ukrainian rosters are in different groups.',
                 'Вісім команд, призовий фонд $150 000 і повна зала. Українські склади — у різних групах.',
                 'Восемь команд, призовой фонд $150 000 и полный зал. Украинские составы — в разных группах.'),
      body: T([
        'Both Ukrainian organisations have accepted invitations to the Warsaw LAN, an eight-team event with a $150,000 prize pool.',
        'They have been drawn into different groups, meaning the earliest they could meet is the semi-final.',
        'The tournament runs from 3 to 7 September in front of a live audience.'
      ], [
        'Обидві українські організації прийняли запрошення на LAN у Варшаві — турнір на вісім команд із призовим фондом $150 000.',
        'Їх розвели в різні групи, тож найраніше вони можуть зустрітися у півфіналі.',
        'Турнір триватиме з 3 до 7 вересня перед живою аудиторією.'
      ], [
        'Обе украинские организации приняли приглашения на LAN в Варшаве — турнир на восемь команд с призовым фондом $150 000.',
        'Их развели в разные группы, так что раньше полуфинала они встретиться не могут.',
        'Турнир пройдёт с 3 по 7 сентября перед живой аудиторией.'
      ])
    },
    {
      id: 'dota-salaries',
      cat: 'DOTA 2', tone: 'primary', read: 4, image: 'assets/img/setup-purple.jpg',
      age: T('3 DAYS AGO', '3 ДНІ ТОМУ', '3 ДНЯ НАЗАД'),
      title: T('How Dota 2 salaries have changed: a veteran\'s assessment',
               'Як змінилися зарплати у Dota 2: оцінка від ветерана сцени',
               'Как изменились зарплаты в Dota 2: оценка от ветерана сцены'),
      excerpt: T('Tier-1 pay has roughly doubled in five years. Tier-2 has gone the other way.',
                 'Зарплати першого тіру за п’ять років зросли приблизно вдвічі. У другому тірі — навпаки.',
                 'Зарплаты первого тира за пять лет выросли примерно вдвое. Во втором тире — наоборот.'),
      body: T([
        'A veteran of the scene has published his read on how player compensation has shifted over the last five years, and the picture splits sharply by tier.',
        'At the top, monthly salaries have roughly doubled. Organisations backed by outside investment are now competing for a pool of maybe forty players, and the bidding shows it.',
        'Below that the trend reverses. Tier-2 salaries have fallen in real terms, and several rosters now play for prize money alone with no base pay at all.',
        'The gap, he argues, is the real story: the distance between a tier-1 and a tier-2 contract is now wider than at any point in the game\'s history.'
      ], [
        'Ветеран сцени оприлюднив свій погляд на те, як за останні п’ять років змінилася оплата гравців, і картина різко розділяється за тірами.',
        'На вершині місячні зарплати зросли приблизно вдвічі. Організації з зовнішніми інвестиціями змагаються за пул із приблизно сорока гравців — і торги це показують.',
        'Нижче тенденція обертається. Зарплати другого тіру в реальному вимірі впали, а кілька складів тепер грають лише за призові, взагалі без базової ставки.',
        'Справжня історія, стверджує він, саме в розриві: відстань між контрактом першого й другого тіру зараз більша, ніж будь-коли в історії гри.'
      ], [
        'Ветеран сцены опубликовал свой взгляд на то, как за последние пять лет изменилась оплата игроков, и картина резко разделяется по тирам.',
        'На вершине месячные зарплаты выросли примерно вдвое. Организации с внешними инвестициями борются за пул примерно из сорока игроков — и торги это показывают.',
        'Ниже тенденция оборачивается. Зарплаты второго тира в реальном выражении упали, а несколько составов теперь играют только за призовые, вообще без базовой ставки.',
        'Настоящая история, утверждает он, именно в разрыве: расстояние между контрактом первого и второго тира сейчас больше, чем когда-либо в истории игры.'
      ]),
      quote: T('There is no middle class left. You are either paid very well or you are not paid.',
               'Середнього класу більше немає. Тобі або платять дуже добре, або не платять.',
               'Среднего класса больше нет. Тебе либо платят очень хорошо, либо не платят.')
    },
    {
      id: 'bestia-nacho',
      cat: 'CS2', tone: 'primary', read: 2, image: 'assets/img/gear-keyboard.jpg',
      age: T('3 DAYS AGO', '3 ДНІ ТОМУ', '3 ДНЯ НАЗАД'),
      title: T('BESTIA bench nacho over «a change of roles in the team»',
               'BESTIA перевела nacho в запас через «зміну ролей у команді»',
               'BESTIA перевела nacho в запас из-за «смены ролей в команде»'),
      excerpt: T('The player had been with the roster for two years. A replacement has not been named.',
                 'Гравець виступав за склад два роки. Заміну поки не назвали.',
                 'Игрок выступал за состав два года. Замену пока не назвали.'),
      body: T([
        'The organisation has moved the player to the bench, describing the decision as a change of roles rather than a performance issue.',
        'He had been with the roster for two years and played every official match in that time. His rating over the last six months sat slightly below the team average.',
        'No replacement has been announced. The team\'s next official match is in eleven days.'
      ], [
        'Організація перевела гравця в запас, описавши рішення як зміну ролей, а не як питання результативності.',
        'Він виступав за склад два роки й за цей час зіграв усі офіційні матчі. Його рейтинг за останні пів року був трохи нижчим за середній по команді.',
        'Заміну не оголосили. Наступний офіційний матч команди — за одинадцять днів.'
      ], [
        'Организация перевела игрока в запас, описав решение как смену ролей, а не как вопрос результативности.',
        'Он выступал за состав два года и за это время сыграл все официальные матчи. Его рейтинг за последние полгода был чуть ниже среднего по команде.',
        'Замену не объявили. Следующий официальный матч команды — через одиннадцать дней.'
      ])
    },
    {
      id: 's1mple-ten-years',
      cat: 'CS2', tone: 'tertiary', read: 5, image: 'assets/img/stage-beams.jpg',
      age: T('4 DAYS AGO', '4 ДНІ ТОМУ', '4 ДНЯ НАЗАД'),
      title: T('The transfer that changed CS: ten years since s1mple joined NAVI',
               'Трансфер, що змінив CS: 10 років з моменту переходу s1mple в NAVI',
               'Трансфер, изменивший CS: 10 лет с момента перехода s1mple в NAVI'),
      excerpt: T('A look back at the move that reshaped both the club and the region\'s standing in the game.',
                 'Згадуємо перехід, який змінив і клуб, і становище регіону в дисципліні.',
                 'Вспоминаем переход, который изменил и клуб, и положение региона в дисциплине.'),
      body: T([
        'Ten years ago a nineteen-year-old signed for NAVI, and both the organisation and the region\'s standing in Counter-Strike changed shape around him.',
        'The move was not universally popular at the time. He arrived with a reputation for volatility and had been through three rosters in eighteen months.',
        'What followed reset expectations for what an individual player could carry. Over the next six years NAVI reached eleven finals, and the region stopped being described as a talent exporter and started being described as a destination.',
        'The anniversary lands at an odd moment: the current roster is rebuilding again, and the comparison to that era is one every new signing gets measured against whether it is fair or not.'
      ], [
        'Десять років тому дев’ятнадцятирічний гравець підписав контракт із NAVI — і навколо нього змінилася форма і самої організації, і становища регіону в Counter-Strike.',
        'Тоді трансфер подобався не всім. Він приходив із репутацією нестабільного й за вісімнадцять місяців змінив три склади.',
        'Те, що сталося далі, переписало уявлення про те, скільки може витягнути окремий гравець. За наступні шість років NAVI дійшли до одинадцяти фіналів, а регіон перестали називати експортером талантів і почали називати місцем призначення.',
        'Річниця випадає на дивний момент: нинішній склад знову перебудовується, і порівняння з тією епохою отримує кожен новий гравець — справедливо це чи ні.'
      ], [
        'Десять лет назад девятнадцатилетний игрок подписал контракт с NAVI — и вокруг него изменилась форма и самой организации, и положения региона в Counter-Strike.',
        'Тогда трансфер нравился не всем. Он приходил с репутацией нестабильного и за восемнадцать месяцев сменил три состава.',
        'То, что случилось дальше, переписало представление о том, сколько может вытянуть отдельный игрок. За следующие шесть лет NAVI дошли до одиннадцати финалов, а регион перестали называть экспортёром талантов и начали называть местом назначения.',
        'Годовщина выпадает на странный момент: нынешний состав снова перестраивается, и сравнение с той эпохой получает каждый новый игрок — справедливо это или нет.'
      ]),
      quote: T('The region stopped exporting talent and started keeping it.',
               'Регіон перестав експортувати талант і почав його втримувати.',
               'Регион перестал экспортировать талант и начал его удерживать.')
    }
  ],

  breaking: {
    id: 'ewc-playoff-pairs',
    image: 'assets/img/stage-arena-main.jpg',
    age: T('7 HOURS AGO', '7 ГОДИН ТОМУ', '7 ЧАСОВ НАЗАД'),
    title: T('EWC 2026 playoff pairs set: NAVI draw Legacy, B8 get Spirit',
             'Визначилися пари 1/8 фіналу EWC 2026: NAVI зіграють з Legacy, B8 — зі Spirit',
             'Определились пары 1/8 финала EWC 2026: NAVI сыграют с Legacy, B8 — со Spirit'),
    comments: 342
  },

  /* -------------------------------------------------------------- ticker */
  tickerSeeds: [
    { label: T('LIVE VIEWERS', 'ГЛЯДАЧІВ', 'ЗРИТЕЛЕЙ'),        value: '245,091' },
    { label: T('TRENDING', 'У ТРЕНДІ', 'В ТРЕНДЕ'),            value: 'NAVI — Legacy (EWC 2026)' },
    { label: T('TRANSFER', 'ТРАНСФЕР', 'ТРАНСФЕР'),            value: 'r1nkle → G2 Esports' },
    { label: T('PRIZE POOL', 'ПРИЗОВИЙ ФОНД', 'ПРИЗОВОЙ ФОНД'), value: 'TI 2026 — $40,018,195' },
    { label: T('HOT PICK', 'ФАВОРИТ', 'ФАВОРИТ'),              value: '78% Team Falcons' },
    { label: T('ALERT', 'УВАГА', 'ВНИМАНИЕ'),                  value: 'Passion UA — $600K debt' }
  ],

  /* ---------------------------------------------------------- match chat */
  chatUsers: [
    { name: 'xX_Sniper_Xx', color: 'text-primary',            badge: 'star' },
    { name: 'FazeFan99',    color: 'text-secondary-fixed',    badge: null },
    { name: 'CS2_God',      color: 'text-tertiary-fixed',     badge: null },
    { name: 'kyiv_clutch',  color: 'text-primary-fixed-dim',  badge: 'star' },
    { name: 'awp_enjoyer',  color: 'text-secondary',          badge: null },
    { name: 'tacticalTim',  color: 'text-tertiary-fixed-dim', badge: null },
    { name: 'zeroPing',     color: 'text-primary',            badge: null }
  ],

  chatLines: T(
    ['WHAT A PLAY', 'no way he hit that', 'GGWP', 'that was a 200 IQ read',
     'sokil is on another level today', 'they threw that round so hard...',
     'KEKW that whiff though', 'clutch or kick', 'MIRAGE IS THEIR MAP',
     'economy is cooked', 'hold this angle please', 'best series of the year',
     'chat calm down it is only map 2', 'I have never been this stressed',
     'that awp shot was disgusting', 'FULL SEND', 'refrag refrag refrag',
     'W tribuna stream quality'],
    ['ОЦЕ ГРА', 'та не міг він це влучити', 'GGWP', 'от це прочитав',
     'sokil сьогодні на іншому рівні', 'ну як так злити раунд...',
     'KEKW оцей промах', 'клатч або в бан', 'MIRAGE ЇХНЯ КАРТА',
     'економіка вмерла', 'тримай цей кут будь ласка', 'краща серія року',
     'чат заспокойся це лише друга карта', 'мені ще ніколи не було так нервово',
     'цей постріл з авп це щось', 'ПОЇХАЛИ', 'рефраг рефраг рефраг',
     'W якість трансляції tribuna'],
    ['ВОТ ЭТО ИГРА', 'да не мог он это попасть', 'GGWP', 'вот это прочитал',
     'sokil сегодня на другом уровне', 'ну как так слить раунд...',
     'KEKW этот промах', 'клатч или в бан', 'MIRAGE ИХ КАРТА',
     'экономика умерла', 'держи этот угол пожалуйста', 'лучшая серия года',
     'чат успокойся это только вторая карта', 'мне ещё никогда не было так нервно',
     'этот выстрел с авп это что-то', 'ПОЕХАЛИ', 'рефраг рефраг рефраг',
     'W качество трансляции tribuna']
  ),

  /* ---------------------------------------------------------------- game */
  aimRanks: [
    { min: 0,    name: 'ROOKIE',     color: '#968e99', note: T('Everyone starts here. Run it back.', 'Усі починають звідси. Спробуйте ще.', 'Все начинают отсюда. Попробуйте ещё.') },
    { min: 1200, name: 'CHALLENGER', color: '#cdc3d0', note: T('Solid tracking. Work on the flicks.', 'Непогане ведення. Попрацюйте над флішками.', 'Неплохое ведение. Поработайте над флишками.') },
    { min: 2400, name: 'ELITE',      color: '#ddb7ff', note: T('You have clearly played a shooter before.', 'Ви вочевидь грали в шутери раніше.', 'Вы явно играли в шутеры раньше.') },
    { min: 3800, name: 'PRO',        color: '#a855f7', note: T('Tier-1 reflexes. Scouts are watching.', 'Реакція першого тіру. Скаути дивляться.', 'Реакция первого тира. Скауты смотрят.') },
    { min: 5400, name: 'APEX',       color: '#ff6b00', note: T('Genuinely absurd. Frame-perfect.', 'Це вже абсурд. Покадрово точно.', 'Это уже абсурд. Покадрово точно.') }
  ],

  proBenchmarks: [
    { name: T('a pro CS2 player', 'про-гравця CS2', 'про-игрока CS2'), ms: 150 },
    { name: T('the average gamer', 'середнього гравця', 'среднего игрока'), ms: 215 },
    { name: T('the average human', 'середню людину', 'среднего человека'), ms: 273 }
  ]
};
