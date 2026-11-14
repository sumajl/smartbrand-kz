/* SmartBrand KZ — post generation engine (MVP).
 * Rule-based template engine that runs fully in the browser.
 * This is the "Wizard of Oz" stage from Assignment 5: the owner gets a ready post
 * without writing prompts; an LLM API can replace compose() later behind the same interface.
 * No user data leaves the browser.
 */
(function () {
  'use strict';

  // ---------- Business types ----------
  var TYPES = {
    coffee:     { en: 'coffee shop',      ru: 'кофейня',            kk: 'кофехана',             tags: { en: ['coffee', 'coffeetime'], ru: ['кофе', 'кофейня'], kk: ['кофе', 'кофехана'] } },
    cafe:       { en: 'café',             ru: 'кафе',               kk: 'кафе',                 tags: { en: ['cafe', 'foodie'], ru: ['кафе', 'вкусно'], kk: ['кафе', 'дәмді'] } },
    bakery:     { en: 'bakery',           ru: 'пекарня',            kk: 'наубайхана',           tags: { en: ['bakery', 'freshbread'], ru: ['пекарня', 'выпечка'], kk: ['наубайхана', 'нан'] } },
    fastfood:   { en: 'fast food',        ru: 'фастфуд',            kk: 'фастфуд',              tags: { en: ['burgers', 'streetfood'], ru: ['бургеры', 'фастфуд'], kk: ['бургер', 'фастфуд'] } },
    flowers:    { en: 'flower shop',      ru: 'цветочный магазин',  kk: 'гүл дүкені',           tags: { en: ['flowers', 'bouquet'], ru: ['цветы', 'букеты'], kk: ['гүлдер', 'гүлшоқ'] } },
    clothing:   { en: 'clothing store',   ru: 'магазин одежды',     kk: 'киім дүкені',          tags: { en: ['fashion', 'outfit'], ru: ['одежда', 'стиль'], kk: ['киім', 'стиль'] } },
    grocery:    { en: 'grocery store',    ru: 'продуктовый магазин', kk: 'азық-түлік дүкені',   tags: { en: ['grocery', 'shoplocal'], ru: ['продукты', 'магазинудома'], kk: ['азықтүлік', 'дүкен'] } }
  };

  var CITIES = {
    astana:    { en: 'Astana',    ru: 'Астана',    kk: 'Астана',    tag: { en: 'astana', ru: 'астана', kk: 'астана' } },
    almaty:    { en: 'Almaty',    ru: 'Алматы',    kk: 'Алматы',    tag: { en: 'almaty', ru: 'алматы', kk: 'алматы' } },
    shymkent:  { en: 'Shymkent',  ru: 'Шымкент',   kk: 'Шымкент',   tag: { en: 'shymkent', ru: 'шымкент', kk: 'шымкент' } },
    karaganda: { en: 'Karaganda', ru: 'Караганда', kk: 'Қарағанды', tag: { en: 'karaganda', ru: 'караганда', kk: 'қарағанды' } },
    other:     { en: '',          ru: '',          kk: '',          tag: { en: 'kazakhstan', ru: 'казахстан', kk: 'қазақстан' } }
  };

  // ---------- Holidays (Kazakhstan) ----------
  // m: month 1-12, d: day. Fixed-date holidays only; moving dates (Kurban Ait) are out of MVP scope.
  var HOLIDAYS = [
    { id: 'newyear',  m: 1,  d: 1,  en: 'New Year',                  ru: 'Новый год',                     kk: 'Жаңа жыл',
      greet: { en: 'Happy New Year!', ru: 'С Новым годом!', kk: 'Жаңа жылыңызбен!' } },
    { id: 'valentine', m: 2, d: 14, en: "Valentine's Day",           ru: 'День всех влюблённых',          kk: 'Ғашықтар күні',
      greet: { en: "Happy Valentine's Day!", ru: 'С Днём всех влюблённых!', kk: 'Ғашықтар күні құтты болсын!' } },
    { id: 'march8',   m: 3,  d: 8,  en: "International Women's Day",  ru: 'Международный женский день',    kk: 'Халықаралық әйелдер күні',
      greet: { en: "Happy International Women's Day!", ru: 'С 8 Марта!', kk: '8 Наурыз мерекесі құтты болсын!' } },
    { id: 'nauryz',   m: 3,  d: 21, en: 'Nauryz',                    ru: 'Наурыз',                        kk: 'Наурыз',
      greet: { en: 'Happy Nauryz!', ru: 'С праздником Наурыз!', kk: 'Наурыз мейрамы құтты болсын!' } },
    { id: 'unity',    m: 5,  d: 1,  en: 'Unity Day',                 ru: 'День единства народа Казахстана', kk: 'Қазақстан халқының бірлігі мерекесі',
      greet: { en: 'Happy Unity Day of the People of Kazakhstan!', ru: 'С Днём единства народа Казахстана!', kk: 'Бірлік мерекесі құтты болсын!' } },
    { id: 'victory',  m: 5,  d: 9,  en: 'Victory Day',               ru: 'День Победы',                   kk: 'Жеңіс күні',
      greet: { en: 'Happy Victory Day!', ru: 'С Днём Победы!', kk: 'Жеңіс күні құтты болсын!' } },
    { id: 'capital',  m: 7,  d: 6,  en: 'Capital Day',               ru: 'День столицы',                  kk: 'Астана күні',
      greet: { en: 'Happy Capital Day!', ru: 'С Днём столицы!', kk: 'Астана күні құтты болсын!' } },
    { id: 'constitution', m: 8, d: 30, en: 'Constitution Day',       ru: 'День Конституции',              kk: 'Конституция күні',
      greet: { en: 'Happy Constitution Day!', ru: 'С Днём Конституции!', kk: 'Конституция күні құтты болсын!' } },
    { id: 'knowledge', m: 9, d: 1,  en: 'Knowledge Day',             ru: 'День знаний',                   kk: 'Білім күні',
      greet: { en: 'Happy Knowledge Day!', ru: 'С Днём знаний!', kk: 'Білім күні құтты болсын!' } },
    { id: 'republic', m: 10, d: 25, en: 'Republic Day',              ru: 'День Республики',               kk: 'Республика күні',
      greet: { en: 'Happy Republic Day!', ru: 'С Днём Республики!', kk: 'Республика күні құтты болсын!' } },
    { id: 'independence', m: 12, d: 16, en: 'Independence Day',      ru: 'День Независимости',            kk: 'Тәуелсіздік күні',
      greet: { en: 'Happy Independence Day!', ru: 'С Днём Независимости!', kk: 'Тәуелсіздік күні құтты болсын!' } }
  ];

  function holidayDate(h, year) { return new Date(year, h.m - 1, h.d); }

  /** Returns upcoming holidays sorted by date, starting from `from` (inclusive). */
  function upcomingHolidays(from, count) {
    var base = new Date(from.getFullYear(), from.getMonth(), from.getDate());
    var list = HOLIDAYS.map(function (h) {
      var dt = holidayDate(h, base.getFullYear());
      if (dt < base) dt = holidayDate(h, base.getFullYear() + 1);
      return { holiday: h, date: dt, days: Math.round((dt - base) / 86400000) };
    });
    list.sort(function (a, b) { return a.date - b.date; });
    return list.slice(0, count || 3);
  }

  // ---------- Date formatting without relying on Intl locale data ----------
  var MONTHS = {
    en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    ru: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'],
    kk: ['қаңтар', 'ақпан', 'наурыз', 'сәуір', 'мамыр', 'маусым', 'шілде', 'тамыз', 'қыркүйек', 'қазан', 'қараша', 'желтоқсан']
  };
  function fmtDate(iso, lang) {
    if (!iso) return '';
    var p = String(iso).split('-');
    var d = parseInt(p[2], 10), m = parseInt(p[1], 10) - 1;
    if (lang === 'en') return d + ' ' + MONTHS.en[m];
    return d + ' ' + MONTHS[lang][m];
  }
  function fmtUntil(iso, lang) {
    if (!iso) return '';
    if (lang === 'en') return 'until ' + fmtDate(iso, 'en');
    if (lang === 'ru') return 'до ' + fmtDate(iso, 'ru');
    // Kazakh needs the dative case of the month: "30 қарашаға дейін"
    var KK_DAT = ['қаңтарға', 'ақпанға', 'наурызға', 'сәуірге', 'мамырға', 'маусымға', 'шілдеге', 'тамызға', 'қыркүйекке', 'қазанға', 'қарашаға', 'желтоқсанға'];
    var p = String(iso).split('-');
    return parseInt(p[2], 10) + ' ' + KK_DAT[parseInt(p[1], 10) - 1] + ' дейін';
  }

  // ---------- Text banks ----------
  // Placeholders: {name} {type} {product} {detail} {discount} {until} {greet} {offer} {event} {date} {city}
  // Lines whose placeholders are empty are dropped automatically.
  var BANK = {
    en: {
      new_item: {
        open: {
          friendly: ['New on our menu: {product}! ✨', 'Say hello to something new — {product} 💛'],
          formal:   ['We are pleased to introduce a new item: {product}.', '{name} presents a new addition: {product}.'],
          playful:  ['Drumroll please… {product} has arrived! 🥁✨', 'Plot twist: {product} is now on the menu 😍']
        },
        body: ['{detail}', 'We made it for those who love trying new things — come and taste it first.', 'Ask our team about it on your next visit.']
      },
      promo: {
        open: {
          friendly: ['Good news: {product} is now −{discount}% 🎉', '{product} at −{discount}% — treat yourself today!'],
          formal:   ['Dear guests, we offer a {discount}% discount on {product}.', '{name} announces a special price: {product} with −{discount}%.'],
          playful:  ['Stop scrolling ✋ {product} is −{discount}%! 🔥', 'Your wallet will thank you: {product} −{discount}% 😉']
        },
        body: ['The offer is valid {until}.', 'Bring a friend — there is enough for everyone.', 'Limited time only.']
      },
      daily: {
        open: {
          friendly: ['Fresh today: {product} 🥐', "Today's special at {name}: {product}"],
          formal:   ["Today's special: {product}.", 'Freshly prepared today: {product}.'],
          playful:  ['Today only 👀 {product} is waiting for you!', 'Breaking news from our kitchen: {product} 🍽️']
        },
        body: ['{detail}', 'Quantities are limited, so drop by early.', 'Perfect for a quick break in your day.']
      },
      holiday: {
        open: {
          friendly: ['{greet} 🌷', '{greet} Warm wishes from all of us 💛'],
          formal:   ['Dear guests! {greet}', 'On behalf of {name}: {greet}'],
          playful:  ['{greet} 🎉🎉', 'It is a celebration! {greet} 🥳']
        },
        body: ['The {name} team wishes you peace, joy and prosperity.', 'Holiday treat: {offer}.']
      },
      event: {
        open: {
          friendly: ['Save the date: {event} on {date}! 📅', 'Join us for {event} on {date} 💛'],
          formal:   ['We invite you to {event} on {date}.', '{name} is hosting {event} on {date}.'],
          playful:  ['Mark your calendar 🗓️ {event} — {date}!', 'Something fun is coming: {event} on {date} 🎈']
        },
        body: ['{detail}', 'Bring your friends and family.', 'Tell us in the comments if you are coming.']
      },
      review: {
        open: {
          friendly: ['Your opinion matters to us 💛', 'How was your last visit to {name}?'],
          formal:   ['We value the feedback of every guest.', 'Dear guests, please share your impressions of {name}.'],
          playful:  ['Be honest with us 😄 How was it?', 'Rate us from 1 to 10 in the comments 👇']
        },
        body: ['Leave a review on 2GIS or in the comments — we read every one.', 'As a thank-you: {offer}.']
      }
    },
    ru: {
      new_item: {
        open: {
          friendly: ['Новинка в меню: {product}! ✨', 'Встречайте новинку — {product} 💛'],
          formal:   ['Рады представить новую позицию: {product}.', '{name} представляет новинку: {product}.'],
          playful:  ['Барабанная дробь… {product} уже здесь! 🥁✨', 'Сюжетный поворот: в меню появился {product} 😍']
        },
        body: ['{detail}', 'Приходите попробовать одними из первых.', 'Спросите о новинке у нашей команды при следующем визите.']
      },
      promo: {
        open: {
          friendly: ['Хорошая новость: {product} со скидкой −{discount}% 🎉', '{product} −{discount}% — порадуйте себя сегодня!'],
          formal:   ['Уважаемые гости, на {product} действует скидка {discount}%.', '{name} объявляет специальную цену: {product} −{discount}%.'],
          playful:  ['Стоп ✋ {product} со скидкой −{discount}%! 🔥', 'Кошелёк скажет спасибо: {product} −{discount}% 😉']
        },
        body: ['Предложение действует {until}.', 'Приходите с друзьями — хватит на всех.', 'Количество ограничено.']
      },
      daily: {
        open: {
          friendly: ['Сегодня свежее: {product} 🥐', 'Предложение дня в {name}: {product}'],
          formal:   ['Предложение дня: {product}.', 'Сегодня приготовили для вас: {product}.'],
          playful:  ['Только сегодня 👀 {product} ждёт вас!', 'Срочная новость с кухни: {product} 🍽️']
        },
        body: ['{detail}', 'Количество ограничено — заходите пораньше.', 'Идеально для небольшого перерыва.']
      },
      holiday: {
        open: {
          friendly: ['{greet} 🌷', '{greet} Тёплые пожелания от всей команды 💛'],
          formal:   ['Уважаемые гости! {greet}', 'От имени {name}: {greet}'],
          playful:  ['{greet} 🎉🎉', 'У нас праздник! {greet} 🥳']
        },
        body: ['Команда {name} желает вам мира, радости и благополучия.', 'Праздничное предложение: {offer}.']
      },
      event: {
        open: {
          friendly: ['Сохраните дату: {event} — {date}! 📅', 'Ждём вас на событии «{event}» {date} 💛'],
          formal:   ['Приглашаем вас на «{event}» {date}.', '{name} проводит «{event}» {date}.'],
          playful:  ['Отметьте в календаре 🗓️ {event} — {date}!', 'Будет весело: {event}, {date} 🎈']
        },
        body: ['{detail}', 'Приходите с друзьями и семьёй.', 'Напишите в комментариях, если придёте.']
      },
      review: {
        open: {
          friendly: ['Нам важно ваше мнение 💛', 'Как прошёл ваш последний визит в {name}?'],
          formal:   ['Мы ценим отзыв каждого гостя.', 'Уважаемые гости, поделитесь впечатлениями о {name}.'],
          playful:  ['Только честно 😄 Как вам у нас?', 'Оцените нас от 1 до 10 в комментариях 👇']
        },
        body: ['Оставьте отзыв в 2GIS или в комментариях — мы читаем каждый.', 'В благодарность: {offer}.']
      }
    },
    kk: {
      new_item: {
        open: {
          friendly: ['Мәзірімізде жаңалық: {product}! ✨', 'Жаңа ұсынысымызбен танысыңыз — {product} 💛'],
          formal:   ['Жаңа ұсынысымызды назарларыңызға ұсынамыз: {product}.', '«{name}» жаңалығы: {product}.'],
          playful:  ['Назар аударыңыз… {product} келді! 🥁✨', 'Күтпеген жаңалық: мәзірде {product} пайда болды 😍']
        },
        body: ['{detail}', 'Алғашқылардың бірі болып дәмін татып көріңіз.', 'Келесі келгеніңізде командамыздан сұраңыз.']
      },
      promo: {
        open: {
          friendly: ['Жақсы жаңалық: {product} −{discount}% жеңілдікпен 🎉', '{product} −{discount}% — бүгін өзіңізді қуантыңыз!'],
          formal:   ['Құрметті қонақтар, {product} үшін {discount}% жеңілдік ұсынамыз.', '«{name}» арнайы баға ұсынады: {product} −{discount}%.'],
          playful:  ['Тоқтаңыз ✋ {product} −{discount}%! 🔥', 'Әмияныңыз риза болады: {product} −{discount}% 😉']
        },
        body: ['Ұсыныс {until} жарамды.', 'Достарыңызды ертіп келіңіз — бәріне жетеді.', 'Саны шектеулі.']
      },
      daily: {
        open: {
          friendly: ['Бүгін жаңа піскен: {product} 🥐', 'Күннің ұсынысы: {product}'],
          formal:   ['Бүгінгі ұсыныс: {product}.', 'Бүгін сіздер үшін дайындадық: {product}.'],
          playful:  ['Тек бүгін 👀 {product} сізді күтіп тұр!', 'Асханадан шұғыл жаңалық: {product} 🍽️']
        },
        body: ['{detail}', 'Саны шектеулі — ертерек келіңіз.', 'Қысқа үзіліс үшін тамаша таңдау.']
      },
      holiday: {
        open: {
          friendly: ['{greet} 🌷', '{greet} Бүкіл командамыздан жылы лебіз 💛'],
          formal:   ['Құрметті қонақтар! {greet}', '«{name}» атынан: {greet}'],
          playful:  ['{greet} 🎉🎉', 'Бізде мереке! {greet} 🥳']
        },
        body: ['«{name}» ұжымы сіздерге бейбітшілік, қуаныш пен береке тілейді.', 'Мерекелік ұсыныс: {offer}.']
      },
      event: {
        open: {
          friendly: ['Күнді белгілеп қойыңыз: {event} — {date}! 📅', '{date} «{event}» іс-шарасына шақырамыз 💛'],
          formal:   ['Сіздерді {date} «{event}» іс-шарасына шақырамыз.', '«{name}» {date} «{event}» өткізеді.'],
          playful:  ['Күнтізбеге жазып қойыңыз 🗓️ {event} — {date}!', 'Қызықты болады: {event}, {date} 🎈']
        },
        body: ['{detail}', 'Достарыңыз бен отбасыңызды ертіп келіңіз.', 'Келетін болсаңыз, пікірге жазыңыз.']
      },
      review: {
        open: {
          friendly: ['Сіздің пікіріңіз біз үшін маңызды 💛', '«{name}»-ға соңғы келуіңіз қалай өтті?'],
          formal:   ['Әр қонақтың пікірін бағалаймыз.', 'Құрметті қонақтар, «{name}» туралы әсеріңізбен бөлісіңіз.'],
          playful:  ['Шыныңызды айтыңыз 😄 Бізде ұнады ма?', 'Пікірлерде бізді 1-ден 10-ға дейін бағалаңыз 👇']
        },
        body: ['2GIS-те немесе пікірлерде жазыңыз — әрқайсысын оқимыз.', 'Алғыс ретінде: {offer}.']
      }
    }
  };

  var CTA = {
    en: {
      friendly: ['See you soon! 💛', 'Share this with a friend and come together!'],
      formal:   ['Our address and opening hours are in the profile.', 'We look forward to welcoming you.'],
      playful:  ['Save this post and tag a friend 👇', "Run, don't walk! 🏃"]
    },
    ru: {
      friendly: ['Ждём вас! 💛', 'Отправьте другу и приходите вместе!'],
      formal:   ['Адрес и часы работы — в профиле.', 'Будем рады видеть вас.'],
      playful:  ['Сохраняйте пост и отмечайте друга 👇', 'Бегом к нам! 🏃']
    },
    kk: {
      friendly: ['Келіңіз, сізді күтеміз! 💛', 'Досыңызға жіберіп, бірге келіңіздер!'],
      formal:   ['Мекенжайымыз бен жұмыс уақытымыз — профильде.', 'Сіздерді күтеміз.'],
      playful:  ['Постты сақтап, досыңызды белгілеңіз 👇', 'Тезірек келіңіз! 🏃']
    }
  };

  var TEMPLATE_TAGS = {
    new_item: { en: ['newonthemenu'], ru: ['новинка'], kk: ['жаңалық'] },
    promo:    { en: ['sale', 'specialoffer'], ru: ['акция', 'скидка'], kk: ['жеңілдік', 'акция'] },
    daily:    { en: ['dailyspecial'], ru: ['предложениедня'], kk: ['күнніңұсынысы'] },
    holiday:  { en: ['holiday'], ru: ['праздник'], kk: ['мереке'] },
    event:    { en: ['event'], ru: ['событие'], kk: ['ісшара'] },
    review:   { en: ['feedback'], ru: ['отзывы'], kk: ['пікір'] }
  };

  // ---------- Helpers ----------
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function pick(arr, r) { return arr[Math.floor(r() * arr.length) % arr.length]; }

  function fill(line, vars) {
    var missing = false;
    var out = line.replace(/\{(\w+)\}/g, function (_, k) {
      var v = vars[k];
      if (v === undefined || v === null || String(v).trim() === '') { missing = true; return ''; }
      return String(v).trim();
    });
    return missing ? null : out;
  }

  function tagify(s) {
    return String(s || '').toLowerCase().replace(/[^0-9a-zа-яёәғқңөұүһі]+/gi, '');
  }

  // ---------- Public API ----------
  /**
   * @param {object} o
   *   o.profile {name, type, city}
   *   o.template one of new_item|promo|daily|holiday|event|review
   *   o.fields  template inputs
   *   o.tone    friendly|formal|playful
   *   o.lang    en|ru|kk
   *   o.seed    integer — change to get a different variant
   * @returns {{text:string, hashtags:string[]}}
   */
  function compose(o) {
    var lang = BANK[o.lang] ? o.lang : 'en';
    var tone = ['friendly', 'formal', 'playful'].indexOf(o.tone) >= 0 ? o.tone : 'friendly';
    var bank = BANK[lang][o.template];
    if (!bank) throw new Error('Unknown template: ' + o.template);
    var r = mulberry32((o.seed || 1) * 7919 + o.template.length * 31 + tone.length);
    var f = o.fields || {};
    var p = o.profile || {};
    var type = TYPES[p.type] || TYPES.cafe;
    var city = CITIES[p.city] || CITIES.other;

    var holiday = null;
    if (o.template === 'holiday') {
      holiday = HOLIDAYS.filter(function (h) { return h.id === f.holiday; })[0] || upcomingHolidays(new Date(), 1)[0].holiday;
    }

    var vars = {
      name: p.name,
      type: type[lang],
      city: city[lang],
      product: f.product,
      detail: f.detail,
      discount: f.discount,
      until: f.until ? fmtUntil(f.until, lang) : '',
      greet: holiday ? holiday.greet[lang] : '',
      offer: f.offer,
      event: f.event,
      date: f.date ? fmtDate(f.date, lang) : ''
    };

    // Opening: pick a line whose placeholders can all be filled
    var opens = bank.open[tone].slice();
    var openLine = null, guard = 0;
    while (!openLine && guard++ < 6) openLine = fill(pick(opens, r), vars);
    if (!openLine) openLine = fill(opens[0], vars) || '';

    // Body: keep every line that can be filled (user detail first), then cap at 2
    var userLines = [], genericLines = [];
    bank.body.forEach(function (tpl) {
      var line = fill(tpl, vars);
      if (!line) return;
      if (/\{(detail|offer|until)\}/.test(tpl)) userLines.push(line); else genericLines.push(line);
    });
    var body = userLines.slice();
    if (genericLines.length) body.push(pick(genericLines, r));
    body = body.slice(0, 3);

    var cta = pick(CTA[lang][tone], r);

    var text = [openLine, '', body.join('\n'), '', cta].join('\n').replace(/\n{3,}/g, '\n\n').trim();

    // Hashtags
    var tags = [];
    tags.push(city.tag[lang]);
    type.tags[lang].forEach(function (t) { tags.push(t); });
    (TEMPLATE_TAGS[o.template][lang] || []).forEach(function (t) { tags.push(t); });
    if (holiday) tags.push(tagify(holiday[lang]));
    if (p.name) tags.push(tagify(p.name));
    tags = tags.filter(Boolean).filter(function (t, i, a) { return a.indexOf(t) === i; }).slice(0, 8);

    return { text: text, hashtags: tags.map(function (t) { return '#' + t; }) };
  }

  window.SBGen = {
    TYPES: TYPES,
    CITIES: CITIES,
    HOLIDAYS: HOLIDAYS,
    TEMPLATES: ['new_item', 'promo', 'daily', 'holiday', 'event', 'review'],
    upcomingHolidays: upcomingHolidays,
    fmtDate: fmtDate,
    compose: compose,
    INSTAGRAM_LIMIT: 2200
  };
})();
