/* Localisation: Ukrainian (default), Russian, English.
   Two mechanisms, one source of truth:
     • static markup  -> data-i18n="key" / data-i18n-ph="key" (placeholders)
     • rendered data  -> T(en, uk, ru) objects in data.js, read via I18N.pick()
   Team names, player nicknames, tournament names and scores are never
   translated — they are proper nouns. */

window.I18N = (function () {
  'use strict';

  const STORE_KEY = 'tribuna.lang';
  const SUPPORTED = ['uk', 'ru', 'en'];
  const DEFAULT = 'uk';

  const DICT = {

    /* ------------------------------------------------------------- nav */
    'nav.home':   { uk: 'ГОЛОВНА',  ru: 'ГЛАВНАЯ',  en: 'HOME' },
    'nav.live':   { uk: 'ЛАЙВ',     ru: 'ЛАЙВ',     en: 'LIVE' },
    'nav.teams':  { uk: 'КОМАНДИ',  ru: 'КОМАНДЫ',  en: 'TEAMS' },
    'nav.news':   { uk: 'НОВИНИ',   ru: 'НОВОСТИ',  en: 'NEWS' },
    'nav.arena':  { uk: 'АРЕНА',    ru: 'АРЕНА',    en: 'ARENA' },

    /* ---------------------------------------------------------- common */
    'common.search':      { uk: 'Пошук команд…', ru: 'Поиск команд…',  en: 'Search teams…' },
    'common.viewAll':     { uk: 'ВСІ',           ru: 'ВСЕ',            en: 'VIEW ALL' },
    'common.share':       { uk: 'ПОДІЛИТИСЬ',    ru: 'ПОДЕЛИТЬСЯ',     en: 'SHARE' },
    'common.shared':      { uk: 'НАДІСЛАНО',     ru: 'ОТПРАВЛЕНО',     en: 'SHARED' },
    'common.linkCopied':  { uk: 'Посилання скопійовано', ru: 'Ссылка скопирована', en: 'Link copied' },
    'common.comments':    { uk: 'КОМЕНТАРІВ',    ru: 'КОММЕНТАРИЕВ',   en: 'COMMENTS' },
    'common.remind':      { uk: 'Нагадати',      ru: 'Напомнить',      en: 'Remind me' },
    'common.reminderSet': { uk: 'Нагадаємо перед матчем', ru: 'Напомним перед матчем', en: 'We\'ll remind you before the match' },
    'common.reminderOff': { uk: 'Нагадування вимкнено', ru: 'Напоминание отключено', en: 'Reminder cancelled' },
    'common.save':        { uk: 'Зберегти',      ru: 'Сохранить',      en: 'Save' },
    'common.saved':       { uk: 'Збережено в закладки', ru: 'Сохранено в закладки', en: 'Saved to bookmarks' },
    'common.unsaved':     { uk: 'Прибрано із закладок', ru: 'Убрано из закладок', en: 'Removed from bookmarks' },
    'common.back':        { uk: 'НАЗАД',         ru: 'НАЗАД',          en: 'BACK' },
    'common.noResults':   { uk: 'Нічого не знайдено', ru: 'Ничего не найдено', en: 'Nothing found' },
    'common.vs':          { uk: 'ПРОТИ',         ru: 'ПРОТИВ',         en: 'VS' },

    /* ------------------------------------------------------------ home */
    'home.liveNow':       { uk: 'ЗАРАЗ У ЕФІРІ',   ru: 'СЕЙЧАС В ЭФИРЕ',  en: 'LIVE NOW' },
    'home.watching':      { uk: 'ДИВЛЯТЬСЯ ЗАРАЗ', ru: 'СМОТРЯТ СЕЙЧАС',  en: 'WATCHING NOW' },
    'home.matches':       { uk: 'МАТЧІВ У БАЗІ',   ru: 'МАТЧЕЙ В БАЗЕ',   en: 'MATCHES TRACKED' },
    'home.teamsRanked':   { uk: 'КОМАНД У РЕЙТИНГУ', ru: 'КОМАНД В РЕЙТИНГЕ', en: 'TEAMS RANKED' },
    'home.coverage':      { uk: 'ПОКРИТТЯ',        ru: 'ПОКРЫТИЕ',        en: 'COVERAGE' },
    'home.viewership':    { uk: 'АУДИТОРІЯ ЗА ТИЖДЕНЬ', ru: 'АУДИТОРИЯ ЗА НЕДЕЛЮ', en: 'VIEWERSHIP THIS WEEK' },
    'home.viewershipSub': { uk: 'Пікові одночасні глядачі, тис.', ru: 'Пиковые одновременные зрители, тыс.', en: 'Peak concurrent viewers, thousands' },
    'home.prizeSplit':    { uk: 'ПРИЗОВІ ЗА ДИСЦИПЛІНАМИ', ru: 'ПРИЗОВЫЕ ПО ДИСЦИПЛИНАМ', en: 'PRIZE POOL BY DISCIPLINE' },
    'home.topRanked':     { uk: 'ТОП РЕЙТИНГУ',    ru: 'ТОП РЕЙТИНГА',    en: 'TOP RANKED' },
    'home.schedule':      { uk: 'РОЗКЛАД',         ru: 'РАСПИСАНИЕ',      en: 'SCHEDULE' },
    'home.trending':      { uk: 'У ЦЕНТРІ УВАГИ',  ru: 'В ЦЕНТРЕ ВНИМАНИЯ', en: 'TRENDING' },
    'home.peak':          { uk: 'ПІК',             ru: 'ПИК',             en: 'PEAK' },
    'home.avg':           { uk: 'СЕРЕДНЄ',         ru: 'СРЕДНЕЕ',         en: 'AVG' },
    'home.growth':        { uk: 'ПРИРІСТ',         ru: 'ПРИРОСТ',         en: 'GROWTH' },
    'home.totalPrize':    { uk: 'ЗАГАЛЬНИЙ ФОНД',  ru: 'ОБЩИЙ ФОНД',      en: 'TOTAL POOL' },

    /* ------------------------------------------------------------ live */
    'live.odds':          { uk: 'КОЕФІЦІЄНТИ',   ru: 'КОЭФФИЦИЕНТЫ',  en: 'LIVE ODDS' },
    'live.upcoming':      { uk: 'НАЙБЛИЖЧІ',     ru: 'БЛИЖАЙШИЕ',     en: 'UPCOMING' },
    'live.matchStats':    { uk: 'СТАТИСТИКА',    ru: 'СТАТИСТИКА',    en: 'MATCH STATS' },
    'live.chat':          { uk: 'ЧАТ ТРАНСЛЯЦІЇ', ru: 'ЧАТ ТРАНСЛЯЦИИ', en: 'STREAM CHAT' },
    'live.sendMessage':   { uk: 'Написати повідомлення…', ru: 'Написать сообщение…', en: 'Send a message…' },
    'live.whoWins':       { uk: 'ХТО ВІЗЬМЕ СЕРІЮ?', ru: 'КТО ВОЗЬМЁТ СЕРИЮ?', en: 'WHO TAKES THE SERIES?' },
    'live.votes':         { uk: 'ГОЛОСІВ',       ru: 'ГОЛОСОВ',       en: 'VOTES' },
    'live.pollHint':      { uk: 'Проголосуйте — результати відкриються після вибору.', ru: 'Проголосуйте — результаты откроются после выбора.', en: 'Cast your vote — results unlock once you pick.' },
    'live.pollLocked':    { uk: 'Ваш голос зараховано. Спільнота продовжує голосувати.', ru: 'Ваш голос засчитан. Сообщество продолжает голосовать.', en: 'Your pick is locked in. The community is still voting.' },
    'live.bo3':           { uk: 'СЕРІЯ BO3',      ru: 'СЕРИЯ BO3',     en: 'BO3 SERIES' },

    /* ----------------------------------------------------------- teams */
    'teams.teamOfMonth':  { uk: 'КОМАНДА МІСЯЦЯ', ru: 'КОМАНДА МЕСЯЦА', en: 'TEAM OF THE MONTH' },
    'teams.rankings':     { uk: 'СВІТОВИЙ РЕЙТИНГ', ru: 'МИРОВОЙ РЕЙТИНГ', en: 'GLOBAL RANKINGS' },
    'teams.allGames':     { uk: 'УСІ ДИСЦИПЛІНИ', ru: 'ВСЕ ДИСЦИПЛИНЫ', en: 'ALL GAMES' },
    'teams.rank':         { uk: 'МІСЦЕ',          ru: 'МЕСТО',          en: 'RANK' },
    'teams.worldRank':    { uk: 'У СВІТІ',        ru: 'В МИРЕ',         en: 'WORLD RANK' },
    'teams.winRate':      { uk: 'ВІДСОТОК ПЕРЕМОГ', ru: 'ПРОЦЕНТ ПОБЕД', en: 'WIN RATE' },
    'teams.form':         { uk: 'ФОРМА',          ru: 'ФОРМА',          en: 'FORM' },
    'teams.roster':       { uk: 'СКЛАД',          ru: 'СОСТАВ',         en: 'ROSTER' },
    'teams.viewTeam':     { uk: 'ПРОФІЛЬ КОМАНДИ', ru: 'ПРОФИЛЬ КОМАНДЫ', en: 'TEAM PROFILE' },
    'teams.loadMore':     { uk: 'ЩЕ КОМАНДИ',     ru: 'ЕЩЁ КОМАНДЫ',    en: 'LOAD MORE TEAMS' },
    'teams.lastTitle':    { uk: 'ОСТАННІЙ ТИТУЛ', ru: 'ПОСЛЕДНИЙ ТИТУЛ', en: 'LAST TITLE' },

    /* ------------------------------------------------------- team page */
    'team.back':          { uk: 'ДО ВСІХ КОМАНД', ru: 'КО ВСЕМ КОМАНДАМ', en: 'ALL TEAMS' },
    'team.about':         { uk: 'ПРО КОМАНДУ',    ru: 'О КОМАНДЕ',       en: 'ABOUT' },
    'team.region':        { uk: 'РЕГІОН',         ru: 'РЕГИОН',          en: 'REGION' },
    'team.founded':       { uk: 'ЗАСНОВАНА',      ru: 'ОСНОВАНА',        en: 'FOUNDED' },
    'team.earnings':      { uk: 'ПРИЗОВІ',        ru: 'ПРИЗОВЫЕ',        en: 'EARNINGS' },
    'team.titles':        { uk: 'ТИТУЛІВ',        ru: 'ТИТУЛОВ',         en: 'TITLES' },
    'team.coach':         { uk: 'ТРЕНЕР',         ru: 'ТРЕНЕР',          en: 'COACH' },
    'team.streak':        { uk: 'СЕРІЯ',          ru: 'СЕРИЯ',           en: 'STREAK' },
    'team.matches':       { uk: 'МАТЧІВ ЗА СЕЗОН', ru: 'МАТЧЕЙ ЗА СЕЗОН', en: 'MATCHES THIS SEASON' },
    'team.analytics':     { uk: 'АНАЛІТИКА',      ru: 'АНАЛИТИКА',       en: 'ANALYTICS' },
    'team.winTrend':      { uk: 'ДИНАМІКА ПЕРЕМОГ', ru: 'ДИНАМИКА ПОБЕД', en: 'WIN RATE TREND' },
    'team.winTrendSub':   { uk: 'Відсоток перемог помісячно', ru: 'Процент побед помесячно', en: 'Win percentage by month' },
    'team.mapPool':       { uk: 'ПУЛ КАРТ',       ru: 'ПУЛ КАРТ',        en: 'MAP POOL' },
    'team.sidePool':      { uk: 'СТОРОНИ ТА ФОРМАТИ', ru: 'СТОРОНЫ И ФОРМАТЫ', en: 'SIDES & FORMATS' },
    'team.mapPoolSub':    { uk: 'Відсоток перемог на карті', ru: 'Процент побед на карте', en: 'Win rate per map' },
    'team.sidePoolSub':   { uk: 'Відсоток перемог за стороною та форматом', ru: 'Процент побед по стороне и формату', en: 'Win rate by side and series format' },
    'team.sideSplit':     { uk: 'РОЗПОДІЛ РАУНДІВ', ru: 'РАСПРЕДЕЛЕНИЕ РАУНДОВ', en: 'ROUND SPLIT' },
    /* A round split means nothing in LoL or PUBG — each discipline names its
       own two-sided metric. */
    'team.sideSplitLol':  { uk: 'РОЗПОДІЛ ЗА СТОРОНОЮ', ru: 'РАСПРЕДЕЛЕНИЕ ПО СТОРОНЕ', en: 'SIDE SPLIT' },
    'team.sideSplitPubg': { uk: 'СТРУКТУРА ОЧОК', ru: 'СТРУКТУРА ОЧКОВ', en: 'POINTS BREAKDOWN' },
    'team.recentForm':    { uk: 'ОСТАННІ 10 МАТЧІВ', ru: 'ПОСЛЕДНИЕ 10 МАТЧЕЙ', en: 'LAST 10 MATCHES' },
    'team.upcoming':      { uk: 'МАЙБУТНІ МАТЧІ', ru: 'БУДУЩИЕ МАТЧИ',   en: 'UPCOMING MATCHES' },
    'team.results':       { uk: 'ОСТАННІ РЕЗУЛЬТАТИ', ru: 'ПОСЛЕДНИЕ РЕЗУЛЬТАТЫ', en: 'RECENT RESULTS' },
    'team.player':        { uk: 'ГРАВЕЦЬ',        ru: 'ИГРОК',           en: 'PLAYER' },
    'team.role':          { uk: 'РОЛЬ',           ru: 'РОЛЬ',            en: 'ROLE' },
    'team.rating':        { uk: 'РЕЙТИНГ',        ru: 'РЕЙТИНГ',         en: 'RATING' },
    'team.kd':            { uk: 'В/С',            ru: 'У/С',             en: 'K/D' },
    /* В/П (виграш/програш, выигрыш/проигрыш) — П alone would collide with
       'перемога'/'поражение' and read identically for a win and a loss. */
    'team.win':           { uk: 'В',              ru: 'В',               en: 'W' },
    'team.loss':          { uk: 'П',              ru: 'П',               en: 'L' },
    'team.attack':        { uk: 'АТАКА',          ru: 'АТАКА',           en: 'ATTACK' },
    'team.defence':       { uk: 'ЗАХИСТ',         ru: 'ЗАЩИТА',          en: 'DEFENCE' },
    'team.notFound':      { uk: 'Команду не знайдено', ru: 'Команда не найдена', en: 'Team not found' },

    /* ------------------------------------------------------------ news */
    'news.latest':        { uk: 'ОСТАННІ ОНОВЛЕННЯ', ru: 'ПОСЛЕДНИЕ ОБНОВЛЕНИЯ', en: 'LATEST UPDATES' },
    'news.all':           { uk: 'УСІ',            ru: 'ВСЕ',             en: 'ALL' },
    'news.breaking':      { uk: 'ІНСАЙД ДНЯ',     ru: 'ИНСАЙД ДНЯ',      en: 'INSIGHT OF THE DAY' },
    'news.readMore':      { uk: 'ЧИТАТИ ДАЛІ',    ru: 'ЧИТАТЬ ДАЛЬШЕ',   en: 'READ MORE' },
    'news.back':          { uk: 'ДО ВСІХ НОВИН',  ru: 'КО ВСЕМ НОВОСТЯМ', en: 'ALL NEWS' },
    'news.related':       { uk: 'ЧИТАЙТЕ ТАКОЖ',  ru: 'ЧИТАЙТЕ ТАКЖЕ',   en: 'RELATED' },
    'news.loadMore':      { uk: 'ЩЕ НОВИНИ',      ru: 'ЕЩЁ НОВОСТИ',     en: 'LOAD MORE NEWS' },
    'news.minRead':       { uk: 'хв читання',     ru: 'мин чтения',      en: 'min read' },
    'news.notFound':      { uk: 'Новину не знайдено', ru: 'Новость не найдена', en: 'Article not found' },

    /* --------------------------------------------------------- comments */
    'comments.title':       { uk: 'КОМЕНТАРІ',           ru: 'КОММЕНТАРИИ',          en: 'COMMENTS' },
    'comments.placeholder': { uk: 'Ваш коментар…',       ru: 'Ваш комментарий…',     en: 'Your comment…' },
    'comments.you':         { uk: 'ви',                  ru: 'вы',                   en: 'you' },
    'comments.posted':      { uk: 'Коментар опубліковано', ru: 'Комментарий опубликован', en: 'Comment posted' },
    'comments.justNow':     { uk: 'щойно',                ru: 'только что',           en: 'just now' },
    'comments.send':         { uk: 'Надіслати',           ru: 'Отправить',            en: 'Send' },
    /* Categories are disciplines, the way a sports desk actually files esports
       copy — a reader looks for "CS2", not for "transfers". */
    'cat.CS2':            { uk: 'CS2',            ru: 'CS2',             en: 'CS2' },
    'cat.DOTA 2':         { uk: 'DOTA 2',         ru: 'DOTA 2',          en: 'DOTA 2' },
    'cat.VALORANT':       { uk: 'VALORANT',       ru: 'VALORANT',        en: 'VALORANT' },
    'cat.LOL':            { uk: 'LOL',            ru: 'LOL',             en: 'LOL' },
    'cat.PUBG':           { uk: 'PUBG',           ru: 'PUBG',            en: 'PUBG' },
    'cat.ІНШЕ':           { uk: 'ІНШЕ',           ru: 'ДРУГОЕ',          en: 'OTHER' },

    /* ----------------------------------------------------------- arena */
    'arena.kicker':       { uk: 'ІНТЕРАКТИВ // ТРЕНУВАЛЬНИЙ МАЙДАНЧИК', ru: 'ИНТЕРАКТИВ // ТРЕНИРОВОЧНАЯ ПЛОЩАДКА', en: 'INTERACTIVE // TRAINING GROUND' },
    'arena.lead':         { uk: 'Тридцять секунд на таймері. Цілі рухаються і зникають. Помаранчеве ядро — це хедшот, подвійні очки. Промах або пропущена ціль обнуляють комбо.', ru: 'Тридцать секунд на таймере. Цели движутся и исчезают. Оранжевое ядро — это хедшот, двойные очки. Промах или пропущенная цель обнуляют комбо.', en: 'Thirty seconds on the clock. Targets drift and expire. The orange core is a headshot — double points. Miss, or let a target time out, and your combo resets.' },
    'arena.teaserKicker': { uk: 'ІНТЕРАКТИВ // AIM ARENA', ru: 'ИНТЕРАКТИВ // AIM ARENA', en: 'INTERACTIVE // AIM ARENA' },
    'arena.teaserTitle':  { uk: 'Думаєте, у вас реакція про?', ru: 'Думаете, у вас реакция про?', en: 'Think you have pro reflexes?' },
    'arena.teaserLead':   { uk: 'Тридцять секунд. Рухомі цілі. Хедшот коштує вдвічі більше. Виберіть ранг і дізнайтесь, як ваша реакція виглядає поруч з гравцем першого тіру.', ru: 'Тридцать секунд. Движущиеся цели. Хедшот стоит вдвое больше. Возьмите ранг и узнайте, как ваша реакция выглядит рядом с игроком первого тира.', en: 'Thirty seconds. Drifting targets. A headshot core worth double. Hit your rank, then find out how your reaction time compares to a tier-1 player.' },
    'arena.enter':        { uk: 'НА АРЕНУ',       ru: 'НА АРЕНУ',        en: 'ENTER THE ARENA' },
    'arena.watchInstead': { uk: 'КРАЩЕ ПОДИВЛЮСЬ', ru: 'ЛУЧШЕ ПОСМОТРЮ', en: 'WATCH INSTEAD' },
    'arena.testAim':      { uk: 'ПЕРЕВІРИТИ АЇМ', ru: 'ПРОВЕРИТЬ АИМ',   en: 'TEST YOUR AIM' },
    'arena.avgHuman':     { uk: 'СЕРЕДНЯ ЛЮДИНА', ru: 'СРЕДНИЙ ЧЕЛОВЕК', en: 'AVG HUMAN REACTION' },
    'arena.tier1':        { uk: 'ГРАВЕЦЬ ПЕРШОГО ТІРУ', ru: 'ИГРОК ПЕРВОГО ТИРА', en: 'TIER-1 CS2 PLAYER' },
    'arena.runLength':    { uk: 'ТРИВАЛІСТЬ',     ru: 'ДЛИТЕЛЬНОСТЬ',    en: 'RUN LENGTH' },
    'arena.ranksToClimb': { uk: 'РАНГІВ',         ru: 'РАНГОВ',          en: 'RANKS TO CLIMB' },
    'arena.difficulty':   { uk: 'СКЛАДНІСТЬ',     ru: 'СЛОЖНОСТЬ',       en: 'DIFFICULTY' },
    'arena.personalBest': { uk: 'ОСОБИСТИЙ РЕКОРД', ru: 'ЛИЧНЫЙ РЕКОРД', en: 'PERSONAL BEST' },
    'arena.score':        { uk: 'ОЧКИ',           ru: 'ОЧКИ',            en: 'SCORE' },
    'arena.time':         { uk: 'ЧАС',            ru: 'ВРЕМЯ',           en: 'TIME' },
    'arena.hits':         { uk: 'ВЛУЧАНЬ',        ru: 'ПОПАДАНИЙ',       en: 'HITS' },
    'arena.accuracy':     { uk: 'ТОЧНІСТЬ',       ru: 'ТОЧНОСТЬ',        en: 'ACCURACY' },
    'arena.headshot':     { uk: 'ХЕДШОТИ',        ru: 'ХЕДШОТЫ',         en: 'HEADSHOT' },
    'arena.combo':        { uk: 'КОМБО',          ru: 'КОМБО',           en: 'COMBO' },
    'arena.readyUp':      { uk: 'ГОТУЙТЕСЬ',      ru: 'ПРИГОТОВЬТЕСЬ',   en: 'READY UP' },
    'arena.readyLead':    { uk: 'Ваш курсор — це приціл. Клікайте по цілях, поки вони не зникли: помаранчеве ядро дає подвійні очки.', ru: 'Ваш курсор — это прицел. Кликайте по целям, пока они не исчезли: оранжевое ядро даёт двойные очки.', en: 'Your cursor is the crosshair. Click targets before they expire — the orange core scores double.' },
    'arena.start':        { uk: 'ПОЧАТИ',         ru: 'НАЧАТЬ',          en: 'START RUN' },
    'arena.again':        { uk: 'ЩЕ РАЗ',         ru: 'ЕЩЁ РАЗ',         en: 'RUN IT BACK' },
    'arena.close':        { uk: 'ЗАКРИТИ',        ru: 'ЗАКРЫТЬ',         en: 'CLOSE' },
    'arena.newBest':      { uk: 'НОВИЙ РЕКОРД',   ru: 'НОВЫЙ РЕКОРД',    en: 'NEW PERSONAL BEST' },
    'arena.runComplete':  { uk: 'СПРОБУ ЗАВЕРШЕНО', ru: 'ПОПЫТКА ЗАВЕРШЕНА', en: 'RUN COMPLETE' },
    'arena.bestCombo':    { uk: 'КРАЩЕ КОМБО',    ru: 'ЛУЧШЕЕ КОМБО',    en: 'BEST COMBO' },
    'arena.reaction':     { uk: 'ТЕСТ РЕАКЦІЇ',   ru: 'ТЕСТ РЕАКЦИИ',    en: 'REACTION TEST' },
    'arena.reactionLead': { uk: 'Клік, щоб зарядити. Другий клік — щойно панель стане фіолетовою.', ru: 'Клик, чтобы зарядить. Второй клик — как только панель станет фиолетовой.', en: 'One click to arm it, one click when the pad turns purple.' },
    'arena.clickToStart': { uk: 'КЛІК, ЩОБ ПОЧАТИ', ru: 'КЛИК, ЧТОБЫ НАЧАТЬ', en: 'CLICK TO START' },
    'arena.waitPurple':   { uk: 'ЧЕКАЙТЕ ФІОЛЕТОВИЙ', ru: 'ЖДИТЕ ФИОЛЕТОВЫЙ', en: 'WAIT FOR PURPLE' },
    'arena.waitSub':      { uk: 'Клікніть у ту ж мить, як колір зміниться.', ru: 'Кликните в тот же миг, как цвет изменится.', en: 'Click the instant it changes.' },
    'arena.clickNow':     { uk: 'КЛІК',           ru: 'КЛИК',            en: 'CLICK' },
    'arena.tooEarly':     { uk: 'ЗАРАНО',         ru: 'СЛИШКОМ РАНО',    en: 'TOO EARLY' },
    'arena.foulSub':      { uk: 'Фальстарт. Клікніть, щоб спробувати ще.', ru: 'Фальстарт. Кликните, чтобы попробовать ещё.', en: 'That is a foul start. Click to try again.' },
    'arena.yourBest':     { uk: 'ВАШ РЕКОРД',     ru: 'ВАШ РЕКОРД',      en: 'YOUR BEST' },
    'arena.proCs2':       { uk: 'ПРО CS2',        ru: 'ПРО CS2',         en: 'PRO CS2' },
    'arena.avgGamer':     { uk: 'СЕРЕДНІЙ ГРАВЕЦЬ', ru: 'СРЕДНИЙ ИГРОК', en: 'AVG GAMER' },
    'arena.avgHumanShort':{ uk: 'СЕРЕДНЯ ЛЮДИНА', ru: 'СРЕДНИЙ ЧЕЛОВЕК', en: 'AVG HUMAN' },
    'arena.fasterThan':   { uk: 'Швидше ніж:',    ru: 'Быстрее чем:',    en: 'Faster than:' },
    'arena.slowerThan':   { uk: 'Повільніше за середню людину (273 мс).', ru: 'Медленнее среднего человека (273 мс).', en: 'Slower than the average human (273 ms).' },
    'arena.retry':        { uk: 'Клік, щоб спробувати ще.', ru: 'Клик, чтобы попробовать ещё.', en: 'Click to retry.' },
    'arena.rankLadder':   { uk: 'ТАБЛИЦЯ РАНГІВ', ru: 'ТАБЛИЦА РАНГОВ',  en: 'RANK LADDER' },
    'arena.scaleNote':    { uk: 'Очки залежать від складності: INSANE дає ×1.4, ROOKIE — ×0.7 від PRO.', ru: 'Очки зависят от сложности: INSANE даёт ×1.4, ROOKIE — ×0.7 от PRO.', en: 'Scores scale with difficulty — INSANE is worth 1.4×, ROOKIE 0.7× of PRO.' },
    'arena.ms':           { uk: 'мс',             ru: 'мс',              en: 'ms' },
    'arena.sec':          { uk: 'с',              ru: 'с',               en: 's' },

    /* ---------------------------------------------------------- footer */
    'footer.terms':     { uk: 'УМОВИ',            ru: 'УСЛОВИЯ',         en: 'TERMS' },
    'footer.privacy':   { uk: 'ПРИВАТНІСТЬ',      ru: 'ПРИВАТНОСТЬ',     en: 'PRIVACY' },
    'footer.rights':    { uk: '© 2024 TRIBUNA ESPORTS. УСІ ПРАВА ЗАХИЩЕНО.', ru: '© 2024 TRIBUNA ESPORTS. ВСЕ ПРАВА ЗАЩИЩЕНЫ.', en: '© 2024 TRIBUNA ESPORTS. ALL RIGHTS RESERVED.' }
  };

  /* Short month names for fixture/result dates. */
  const MONTHS = {
    uk: ['СІЧ', 'ЛЮТ', 'БЕР', 'КВІ', 'ТРА', 'ЧЕР', 'ЛИП', 'СЕР', 'ВЕР', 'ЖОВ', 'ЛИС', 'ГРУ'],
    ru: ['ЯНВ', 'ФЕВ', 'МАР', 'АПР', 'МАЙ', 'ИЮН', 'ИЮЛ', 'АВГ', 'СЕН', 'ОКТ', 'НОЯ', 'ДЕК'],
    en: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  };

  let lang = DEFAULT;
  const listeners = [];

  function read() {
    try {
      const stored = localStorage.getItem(STORE_KEY);
      if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;
    } catch (e) { /* private mode */ }
    return DEFAULT;
  }

  function t(key) {
    const entry = DICT[key];
    if (!entry) return key;
    return entry[lang] || entry.en || key;
  }

  /* Reads a T(en, uk, ru) object produced by data.js. */
  function pick(value) {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    return value[lang] != null ? value[lang] : (value.en != null ? value.en : '');
  }

  /* Applies translations to every static node carrying a data-i18n attribute. */
  function apply(root) {
    const scope = root || document;
    scope.querySelectorAll('[data-i18n]').forEach(el => {
      el.textContent = t(el.dataset.i18n);
    });
    scope.querySelectorAll('[data-i18n-ph]').forEach(el => {
      el.setAttribute('placeholder', t(el.dataset.i18nPh));
    });
    scope.querySelectorAll('[data-i18n-aria]').forEach(el => {
      el.setAttribute('aria-label', t(el.dataset.i18nAria));
    });
  }

  function set(next) {
    if (SUPPORTED.indexOf(next) === -1 || next === lang) return;
    lang = next;
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) { /* private mode */ }
    document.documentElement.setAttribute('lang', lang);
    apply();
    listeners.forEach(fn => fn(lang));
  }

  function onChange(fn) { listeners.push(fn); }

  lang = read();
  document.documentElement.setAttribute('lang', lang);

  /* d = day of month, m = zero-based month index. */
  function date(d, m) {
    return d + ' ' + (MONTHS[lang] || MONTHS.en)[m];
  }

  return {
    get lang() { return lang; },
    supported: SUPPORTED,
    t, pick, apply, set, onChange, date
  };
})();

/* Shorthand used throughout data.js. */
function T(en, uk, ru) { return { en: en, uk: uk, ru: ru }; }
