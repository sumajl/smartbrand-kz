/* SmartBrand KZ — interface strings in English and Kazakh.
 * Kazakh strings were drafted with AI assistance and must be reviewed by a native speaker
 * (see docs/AI-use declaration). Keys are shared by the landing page and the app.
 */
(function () {
  'use strict';
  var S = {
    en: {
      'lang.name': 'English',
      'lang.switch': 'Қазақша',
      'lang.switchLabel': 'Switch interface to Kazakh',
      'skip': 'Skip to content',
      'nav.home': 'Home',
      'nav.plan': 'Plan',
      'nav.settings': 'Settings',
      'nav.site': 'About SmartBrand',

      // Onboarding
      'ob.title': 'Tell us about your business',
      'ob.lead': 'Four fields, once. After that every post takes one click.',
      'ob.name': 'Business name',
      'ob.nameHint': 'As customers know it, e.g. Dala Coffee',
      'ob.type': 'Type of business',
      'ob.city': 'City',
      'ob.postLang': 'Language of your posts',
      'ob.postLangHint': 'You can change it for any post later.',
      'ob.submit': 'Save and continue',
      'ob.sample': 'Fill with a sample café',
      'ob.privacy': 'Your data stays in this browser. Nothing is sent to a server.',
      'ob.saved': 'Profile saved',

      'type.coffee': 'Coffee shop', 'type.cafe': 'Café or restaurant', 'type.bakery': 'Bakery',
      'type.fastfood': 'Fast food', 'type.flowers': 'Flower shop', 'type.clothing': 'Clothing store', 'type.grocery': 'Grocery store',
      'city.astana': 'Astana', 'city.almaty': 'Almaty', 'city.shymkent': 'Shymkent', 'city.karaganda': 'Karaganda', 'city.other': 'Other city',
      'plang.kk': 'Kazakh', 'plang.ru': 'Russian', 'plang.en': 'English',

      // Validation
      'err.required': 'Fill in this field.',
      'err.nameShort': 'Use at least 2 characters.',
      'err.tooLong': 'Shorten this to {max} characters or fewer.',
      'err.select': 'Choose an option.',
      'err.discount': 'Enter a whole number from 1 to 90.',
      'err.pastDate': 'Pick today or a later date.',
      'err.formIntro': 'Check the highlighted fields:',
      'err.storage': 'Your browser blocks local storage, so posts will disappear when you close this tab.',

      // Home
      'home.hello': 'Hello, {name}',
      'home.lead': 'What do you want to tell your customers today?',
      'home.oneClick': 'Make a holiday post',
      'home.oneClickHint': '{holiday} is in {days} days. No typing needed.',
      'home.oneClickToday': '{holiday} is today. No typing needed.',
      'home.pick': 'Or choose what the post is about',
      'home.week': 'This week',
      'home.statCreated': 'posts created',
      'home.statPlanned': 'planned',
      'home.statPublished': 'published',
      'home.recent': 'Recent posts',
      'home.emptyRecent': 'Your posts will appear here.',

      // Templates
      'tpl.new_item': 'New menu item or product', 'tpl.new_item.d': 'Announce something new',
      'tpl.promo': 'Discount', 'tpl.promo.d': 'A price offer with an end date',
      'tpl.daily': 'Special of the day', 'tpl.daily.d': 'Fresh today, limited stock',
      'tpl.holiday': 'Holiday greeting', 'tpl.holiday.d': 'Kazakhstan holidays, ready to post',
      'tpl.event': 'Event', 'tpl.event.d': 'Live music, tasting, opening',
      'tpl.review': 'Ask for reviews', 'tpl.review.d': 'Get feedback on 2GIS and Instagram',

      // Create
      'cr.back': 'Back',
      'cr.title': '{template}',
      'cr.product': 'What is it?',
      'cr.productHint': 'e.g. Pistachio croissant',
      'cr.detail': 'One detail customers should know (optional)',
      'cr.detailHint': 'e.g. Baked every morning at 8:00',
      'cr.discount': 'Discount, %',
      'cr.until': 'Offer ends (optional)',
      'cr.holiday': 'Holiday',
      'cr.offer': 'Special offer (optional)',
      'cr.offerHint': 'e.g. free tea with any dessert',
      'cr.event': 'Event name',
      'cr.eventHint': 'e.g. Live jazz evening',
      'cr.date': 'Event date',
      'cr.tone': 'Tone',
      'tone.friendly': 'Friendly', 'tone.formal': 'Polite', 'tone.playful': 'Playful',
      'cr.postLang': 'Post language',
      'cr.generate': 'Create post',
      'cr.generating': 'Writing your post…',
      'cr.fail': 'The post service did not respond. Your inputs are kept — try again.',
      'cr.retry': 'Try again',

      // Result
      'rs.title': 'Your post is ready',
      'rs.lead': 'Read it, edit anything, then copy it to Instagram or plan it for later.',
      'rs.textLabel': 'Post text',
      'rs.hashtags': 'Hashtags',
      'rs.chars': '{n} / {max} characters',
      'rs.tooLong': 'Instagram allows up to {max} characters. Shorten the text to copy or plan it.',
      'rs.regen': 'Write another version',
      'rs.regenConfirm': 'Replace your edited text with a new version?',
      'rs.copy': 'Copy text',
      'rs.copied': 'Copied. Paste it into Instagram.',
      'rs.copyFail': 'Copying was blocked by the browser. The text is selected — press Ctrl+C (or long-press on phone).',
      'rs.plan': 'Plan for a date',
      'rs.planDate': 'Date',
      'rs.planTime': 'Time',
      'rs.planSave': 'Add to plan',
      'rs.planned': 'Added to your plan for {date}.',
      'rs.saveDraft': 'Save as draft',
      'rs.draftSaved': 'Saved to drafts.',
      'rs.review': 'Check names, prices and dates before posting. You are responsible for what you publish.',
      'rs.new': 'Create another post',

      // Plan
      'pl.title': 'Your content plan',
      'pl.lead': 'Your planned posts by date. On the day, copy the post, publish it on Instagram and mark it as published.',
      'pl.empty': 'Nothing planned yet. Create a post and pick a date.',
      'pl.emptyCta': 'Create a post',
      'pl.drafts': 'Drafts',
      'pl.published': 'Published',
      'pl.markPublished': 'Mark as published',
      'pl.delete': 'Delete',
      'pl.deleteConfirm': 'Delete this post? This cannot be undone.',
      'pl.deleted': 'Post deleted.',
      'pl.today': 'Today',
      'pl.overdue': 'Missed',
      'pl.copy': 'Open',

      // Settings
      'st.title': 'Settings',
      'st.profile': 'Business profile',
      'st.save': 'Save changes',
      'st.saved': 'Changes saved.',
      'st.uiLang': 'Interface language',
      'st.data': 'Your data',
      'st.dataLead': 'Everything is stored only in this browser on this device.',
      'st.export': 'Download my data (JSON)',
      'st.wipe': 'Delete all data',
      'st.wipeConfirm': 'Delete your profile and all posts from this browser? This cannot be undone.',
      'st.wiped': 'All data deleted.',
      'st.demo': 'Demo tools',
      'st.outage': 'Simulate post service outage',
      'st.outageHint': 'Used in the defence to show what happens when generation fails.',
      'st.metrics': 'Test metrics',
      'st.firstPost': 'Time from opening the app to first post: {t}',
      'st.noFirstPost': 'No post created yet.',
      'st.about': 'About this MVP',
      'st.aboutText': 'MVP v1.0. Posts are composed in your browser from templates written by the team (no external AI calls yet). Instagram publishing is manual: copy the text and paste it into the app.',

      'toast.close': 'Close',
      'time.sec': '{n} s', 'time.min': '{m} min {s} s',

      // Landing
      'ld.title': 'SmartBrand KZ — Instagram posts for cafés and shops in one click',
      'ld.nav.how': 'How it works', 'ld.nav.why': 'Why us', 'ld.nav.price': 'Pricing', 'ld.nav.team': 'Team',
      'ld.open': 'Open the app',
      'ld.h1': 'Your café posts every day. You don’t write a word.',
      'ld.lead': 'SmartBrand KZ writes ready Instagram posts in Kazakh, Russian or English for small cafés and shops. Pick what you want to say, press one button, copy.',
      'ld.try': 'Try it right here',
      'ld.demoType': 'Your business',
      'ld.demoBtn': 'Make a post',
      'ld.demoNote': 'Real output from the MVP engine. Change the business and press again.',
      'ld.cta': 'Start free — no sign-up',
      'ld.problemH': 'What owners told us',
      'ld.problemLead': 'We interviewed 8 owners of cafés and shops in Astana. Three problems came up again and again.',
      'ld.p1h': 'No time', 'ld.p1': 'Owners write posts at night or on weekends, so the page goes quiet for weeks.',
      'ld.p2h': 'Agencies are too expensive', 'ld.p2': 'An SMM agency costs from 300,000 ₸ a month. Freelancers and students are cheaper but disappear.',
      'ld.p3h': 'ChatGPT sounds like a robot', 'ld.p3': 'Writing prompts takes time and the result still does not sound like a local café.',
      'ld.quoteSrc': 'Burger shop owner, Astana — customer interview, 2026',
      'ld.quote': '“AI is cool, but I spend an hour making the text sound like an Astana burger joint, not a robot.”',
      'ld.cofounder': 'Co-founder',
      'ld.howH': 'How it works',
      'ld.s1h': 'Describe your business once', 'ld.s1': 'Name, type, city and post language. Four fields, under a minute.',
      'ld.s2h': 'Choose what to say', 'ld.s2': 'New item, discount, special of the day, holiday, event or review request.',
      'ld.s3h': 'Get a ready post', 'ld.s3': 'Text and hashtags in Kazakh, Russian or English. Edit, copy, or plan it for a date.',
      'ld.whyH': 'Between an agency and doing it yourself',
      'ld.col.us': 'SmartBrand KZ', 'ld.col.agency': 'SMM agency', 'ld.col.gpt': 'ChatGPT', 'ld.col.diy': 'Do it yourself',
      'ld.row.price': 'Monthly cost', 'ld.row.prompts': 'Needs prompt writing', 'ld.row.kk': 'Kazakh and local holidays', 'ld.row.time': 'Owner’s time per post',
      'ld.v.usPrice': 'from 14,900 ₸', 'ld.v.agPrice': '300,000+ ₸', 'ld.v.gptPrice': 'free / ~$20', 'ld.v.diyPrice': '0 ₸',
      'ld.v.no': 'No', 'ld.v.yes': 'Yes', 'ld.v.built': 'Built in', 'ld.v.manual': 'Manual', 'ld.v.partial': 'Partial',
      'ld.v.usTime': '~1 min', 'ld.v.agTime': 'Briefs and approvals', 'ld.v.gptTime': '20–60 min', 'ld.v.diyTime': '30–60 min',
      'ld.whyNote': 'Agency price and time estimates come from our customer interviews (n = 8, Astana, 2026); they are not market averages.',
      'ld.priceH': 'Pilot pricing',
      'ld.priceLead': 'Pilot prices for Astana: about 5% of the 300,000 ₸ agency fee owners quoted in our interviews. We are testing them with owners now.',
      'ld.pl.trial': 'Trial', 'ld.pl.trialP': '0 ₸', 'ld.pl.trialD': '14 days, all features',
      'ld.pl.basic': 'Basic', 'ld.pl.basicP': '14,900 ₸ / month', 'ld.pl.basicD': '1 location, 30 posts a month, content plan',
      'ld.pl.pro': 'Pro', 'ld.pl.proP': '24,900 ₸ / month', 'ld.pl.proD': 'Up to 3 locations, unlimited posts, holiday calendar',
      'ld.teamH': 'Team',
      'ld.teamLead': 'Students of Astana IT University, Technological Entrepreneurship course, 2026.',
      'ld.footer': 'SmartBrand KZ is a student startup project. The MVP stores data only in your browser.',
      'ld.endH': 'Your next post is one click away',
      'ld.endLead': 'No account, no card. Works on your phone.'
    },

    kk: {
      'lang.name': 'Қазақша',
      'lang.switch': 'English',
      'lang.switchLabel': 'Интерфейсті ағылшын тіліне ауыстыру',
      'skip': 'Мазмұнға өту',
      'nav.home': 'Басты бет',
      'nav.plan': 'Жоспар',
      'nav.settings': 'Баптаулар',
      'nav.site': 'SmartBrand туралы',

      'ob.title': 'Бизнесіңіз туралы айтыңыз',
      'ob.lead': 'Төрт өріс, бір рет қана. Кейін әр пост бір басумен жасалады.',
      'ob.name': 'Бизнес атауы',
      'ob.nameHint': 'Клиенттер білетін атау, мысалы Dala Coffee',
      'ob.type': 'Бизнес түрі',
      'ob.city': 'Қала',
      'ob.postLang': 'Посттарыңыздың тілі',
      'ob.postLangHint': 'Кейін кез келген пост үшін өзгертуге болады.',
      'ob.submit': 'Сақтап, жалғастыру',
      'ob.sample': 'Үлгі кафемен толтыру',
      'ob.privacy': 'Деректеріңіз осы браузерде ғана сақталады. Серверге ештеңе жіберілмейді.',
      'ob.saved': 'Профиль сақталды',

      'type.coffee': 'Кофехана', 'type.cafe': 'Кафе немесе мейрамхана', 'type.bakery': 'Наубайхана',
      'type.fastfood': 'Фастфуд', 'type.flowers': 'Гүл дүкені', 'type.clothing': 'Киім дүкені', 'type.grocery': 'Азық-түлік дүкені',
      'city.astana': 'Астана', 'city.almaty': 'Алматы', 'city.shymkent': 'Шымкент', 'city.karaganda': 'Қарағанды', 'city.other': 'Басқа қала',
      'plang.kk': 'Қазақша', 'plang.ru': 'Орысша', 'plang.en': 'Ағылшынша',

      'err.required': 'Бұл өрісті толтырыңыз.',
      'err.nameShort': 'Кемінде 2 таңба жазыңыз.',
      'err.tooLong': 'Мәтінді {max} таңбаға дейін қысқартыңыз.',
      'err.select': 'Бір нұсқаны таңдаңыз.',
      'err.discount': '1-ден 90-ға дейінгі бүтін сан енгізіңіз.',
      'err.pastDate': 'Бүгінгі немесе кейінгі күнді таңдаңыз.',
      'err.formIntro': 'Белгіленген өрістерді тексеріңіз:',
      'err.storage': 'Браузеріңіз жергілікті сақтауды бұғаттайды, сондықтан бетті жапқанда посттар жойылады.',

      'home.hello': 'Сәлеметсіз бе, {name}',
      'home.lead': 'Бүгін клиенттеріңізге не айтқыңыз келеді?',
      'home.oneClick': 'Мерекелік пост жасау',
      'home.oneClickHint': '{holiday} — {days} күннен кейін. Ештеңе жазудың қажеті жоқ.',
      'home.oneClickToday': '{holiday} — бүгін. Ештеңе жазудың қажеті жоқ.',
      'home.pick': 'Немесе пост тақырыбын таңдаңыз',
      'home.week': 'Осы апта',
      'home.statCreated': 'пост жасалды',
      'home.statPlanned': 'жоспарда',
      'home.statPublished': 'жарияланды',
      'home.recent': 'Соңғы посттар',
      'home.emptyRecent': 'Посттарыңыз осында көрінеді.',

      'tpl.new_item': 'Жаңа тағам немесе тауар', 'tpl.new_item.d': 'Жаңалық туралы хабарлау',
      'tpl.promo': 'Жеңілдік', 'tpl.promo.d': 'Аяқталу күні бар баға ұсынысы',
      'tpl.daily': 'Күннің ұсынысы', 'tpl.daily.d': 'Бүгін ғана, саны шектеулі',
      'tpl.holiday': 'Мерекелік құттықтау', 'tpl.holiday.d': 'Қазақстан мерекелері, дайын пост',
      'tpl.event': 'Іс-шара', 'tpl.event.d': 'Жанды музыка, дегустация, ашылу',
      'tpl.review': 'Пікір сұрау', 'tpl.review.d': '2GIS пен Instagram-да пікір жинау',

      'cr.back': 'Артқа',
      'cr.title': '{template}',
      'cr.product': 'Бұл не?',
      'cr.productHint': 'мысалы, Пісте круассаны',
      'cr.detail': 'Клиент білуі керек бір деталь (міндетті емес)',
      'cr.detailHint': 'мысалы, Күн сайын таңғы 8:00-де пісіреміз',
      'cr.discount': 'Жеңілдік, %',
      'cr.until': 'Ұсыныстың аяқталу күні (міндетті емес)',
      'cr.holiday': 'Мереке',
      'cr.offer': 'Арнайы ұсыныс (міндетті емес)',
      'cr.offerHint': 'мысалы, кез келген десертке тегін шай',
      'cr.event': 'Іс-шара атауы',
      'cr.eventHint': 'мысалы, Джаз кеші',
      'cr.date': 'Іс-шара күні',
      'cr.tone': 'Стиль',
      'tone.friendly': 'Достық', 'tone.formal': 'Сыпайы', 'tone.playful': 'Көңілді',
      'cr.postLang': 'Пост тілі',
      'cr.generate': 'Пост жасау',
      'cr.generating': 'Пост жазылып жатыр…',
      'cr.fail': 'Пост қызметі жауап бермеді. Енгізген деректеріңіз сақталды — қайта көріңіз.',
      'cr.retry': 'Қайта көру',

      'rs.title': 'Постыңыз дайын',
      'rs.lead': 'Оқып шығыңыз, қажетін түзетіңіз, содан кейін Instagram-ға көшіріңіз немесе жоспарлаңыз.',
      'rs.textLabel': 'Пост мәтіні',
      'rs.hashtags': 'Хэштегтер',
      'rs.chars': '{n} / {max} таңба',
      'rs.tooLong': 'Instagram-да ең көбі {max} таңба. Көшіру не жоспарлау үшін мәтінді қысқартыңыз.',
      'rs.regen': 'Басқа нұсқасын жазу',
      'rs.regenConfirm': 'Түзетілген мәтінді жаңа нұсқамен ауыстырасыз ба?',
      'rs.copy': 'Мәтінді көшіру',
      'rs.copied': 'Көшірілді. Instagram-ға қойыңыз.',
      'rs.copyFail': 'Браузер көшіруге рұқсат бермеді. Мәтін белгіленді — Ctrl+C басыңыз (телефонда ұзақ басыңыз).',
      'rs.plan': 'Күнге жоспарлау',
      'rs.planDate': 'Күні',
      'rs.planTime': 'Уақыты',
      'rs.planSave': 'Жоспарға қосу',
      'rs.planned': '{date} күнгі жоспарға қосылды.',
      'rs.saveDraft': 'Жоба ретінде сақтау',
      'rs.draftSaved': 'Жобаларға сақталды.',
      'rs.review': 'Жарияламас бұрын атауларды, бағаларды және күндерді тексеріңіз. Жарияланған мазмұнға өзіңіз жауаптысыз.',
      'rs.new': 'Тағы бір пост жасау',

      'pl.title': 'Контент-жоспарыңыз',
      'pl.lead': 'Жоспарланған посттар күн бойынша. Сол күні постты көшіріп, Instagram-ға жариялаңыз және «жарияланды» деп белгілеңіз.',
      'pl.empty': 'Әзірге ештеңе жоспарланбаған. Пост жасап, күнін таңдаңыз.',
      'pl.emptyCta': 'Пост жасау',
      'pl.drafts': 'Жобалар',
      'pl.published': 'Жарияланғандар',
      'pl.markPublished': 'Жарияланды деп белгілеу',
      'pl.delete': 'Жою',
      'pl.deleteConfirm': 'Бұл постты жоясыз ба? Қайтару мүмкін емес.',
      'pl.deleted': 'Пост жойылды.',
      'pl.today': 'Бүгін',
      'pl.overdue': 'Өткізіп алынды',
      'pl.copy': 'Ашу',

      'st.title': 'Баптаулар',
      'st.profile': 'Бизнес профилі',
      'st.save': 'Өзгерістерді сақтау',
      'st.saved': 'Өзгерістер сақталды.',
      'st.uiLang': 'Интерфейс тілі',
      'st.data': 'Деректеріңіз',
      'st.dataLead': 'Барлығы тек осы құрылғыдағы браузерде сақталады.',
      'st.export': 'Деректерімді жүктеп алу (JSON)',
      'st.wipe': 'Барлық деректерді жою',
      'st.wipeConfirm': 'Профиль мен барлық посттарды осы браузерден жоясыз ба? Қайтару мүмкін емес.',
      'st.wiped': 'Барлық деректер жойылды.',
      'st.demo': 'Демо құралдары',
      'st.outage': 'Пост қызметінің істен шығуын модельдеу',
      'st.outageHint': 'Қорғауда генерация сәтсіз болғанда не болатынын көрсету үшін.',
      'st.metrics': 'Тест көрсеткіштері',
      'st.firstPost': 'Қосымшаны ашқаннан бірінші постқа дейінгі уақыт: {t}',
      'st.noFirstPost': 'Әлі пост жасалмаған.',
      'st.about': 'Осы MVP туралы',
      'st.aboutText': 'MVP v1.0. Посттар команда жазған үлгілер негізінде браузеріңізде құрастырылады (әзірге сыртқы AI шақырулары жоқ). Instagram-ға жариялау қолмен: мәтінді көшіріп, қосымшаға қойыңыз.',

      'toast.close': 'Жабу',
      'time.sec': '{n} с', 'time.min': '{m} мин {s} с',

      'ld.title': 'SmartBrand KZ — кафелер мен дүкендерге Instagram посттары бір басумен',
      'ld.nav.how': 'Қалай жұмыс істейді', 'ld.nav.why': 'Неге біз', 'ld.nav.price': 'Бағалар', 'ld.nav.team': 'Команда',
      'ld.open': 'Қосымшаны ашу',
      'ld.h1': 'Кафеңіз күн сайын пост жариялайды. Сіз бір сөз де жазбайсыз.',
      'ld.lead': 'SmartBrand KZ шағын кафелер мен дүкендерге қазақ, орыс немесе ағылшын тілінде дайын Instagram посттарын жазады. Не айтқыңыз келетінін таңдаңыз, бір батырманы басыңыз, көшіріңіз.',
      'ld.try': 'Осы жерде байқап көріңіз',
      'ld.demoType': 'Бизнесіңіз',
      'ld.demoBtn': 'Пост жасау',
      'ld.demoNote': 'MVP жүйесінің нақты нәтижесі. Бизнесті өзгертіп, қайта басыңыз.',
      'ld.cta': 'Тегін бастау — тіркелусіз',
      'ld.problemH': 'Иелер бізге не айтты',
      'ld.problemLead': 'Астанадағы 8 кафе мен дүкен иесімен сұхбат жүргіздік. Үш мәселе қайта-қайта айтылды.',
      'ld.p1h': 'Уақыт жоқ', 'ld.p1': 'Иелер посттарды түнде немесе демалыста жазады, сондықтан парақша апталап үнсіз тұрады.',
      'ld.p2h': 'Агенттіктер тым қымбат', 'ld.p2': 'SMM агенттігі айына 300 000 ₸-ден басталады. Фрилансерлер мен студенттер арзанырақ, бірақ жоғалып кетеді.',
      'ld.p3h': 'ChatGPT робот сияқты жазады', 'ld.p3': 'Промпт жазу уақыт алады, ал нәтиже бәрібір жергілікті кафенің үні сияқты емес.',
      'ld.quoteSrc': 'Бургерхана иесі, Астана — клиенттік сұхбат, 2026',
      'ld.quote': '«AI керемет, бірақ мәтінді робот емес, Астанадағы бургерхана сияқты естілетіндей ету үшін бір сағат жұмсаймын.»',
      'ld.cofounder': 'Негізін қалаушы',
      'ld.howH': 'Қалай жұмыс істейді',
      'ld.s1h': 'Бизнесіңізді бір рет сипаттаңыз', 'ld.s1': 'Атауы, түрі, қаласы және пост тілі. Төрт өріс, бір минуттан аз.',
      'ld.s2h': 'Не айтатыныңызды таңдаңыз', 'ld.s2': 'Жаңа тағам, жеңілдік, күннің ұсынысы, мереке, іс-шара немесе пікір сұрау.',
      'ld.s3h': 'Дайын пост алыңыз', 'ld.s3': 'Қазақ, орыс немесе ағылшын тіліндегі мәтін мен хэштегтер. Түзетіңіз, көшіріңіз немесе күнге жоспарлаңыз.',
      'ld.whyH': 'Агенттік пен өзіңіз жасаудың ортасы',
      'ld.col.us': 'SmartBrand KZ', 'ld.col.agency': 'SMM агенттігі', 'ld.col.gpt': 'ChatGPT', 'ld.col.diy': 'Өзіңіз жасау',
      'ld.row.price': 'Айлық құны', 'ld.row.prompts': 'Промпт жазу керек', 'ld.row.kk': 'Қазақ тілі мен жергілікті мерекелер', 'ld.row.time': 'Бір постқа иесінің уақыты',
      'ld.v.usPrice': '14 900 ₸-ден', 'ld.v.agPrice': '300 000+ ₸', 'ld.v.gptPrice': 'тегін / ~$20', 'ld.v.diyPrice': '0 ₸',
      'ld.v.no': 'Жоқ', 'ld.v.yes': 'Иә', 'ld.v.built': 'Кіріктірілген', 'ld.v.manual': 'Қолмен', 'ld.v.partial': 'Ішінара',
      'ld.v.usTime': '~1 мин', 'ld.v.agTime': 'Бриф пен келісу', 'ld.v.gptTime': '20–60 мин', 'ld.v.diyTime': '30–60 мин',
      'ld.whyNote': 'Агенттік бағасы мен уақыт бағалары біздің клиенттік сұхбаттарымыздан алынды (n = 8, Астана, 2026); бұл нарықтық орташа көрсеткіш емес.',
      'ld.priceH': 'Пилоттық бағалар',
      'ld.priceLead': 'Астанаға арналған пилоттық бағалар: сұхбаттарда аталған 300 000 ₸ агенттік бағасының шамамен 5%-ы. Қазір оларды иелермен тексеріп жатырмыз.',
      'ld.pl.trial': 'Сынақ', 'ld.pl.trialP': '0 ₸', 'ld.pl.trialD': '14 күн, барлық мүмкіндіктер',
      'ld.pl.basic': 'Basic', 'ld.pl.basicP': '14 900 ₸ / ай', 'ld.pl.basicD': '1 нүкте, айына 30 пост, контент-жоспар',
      'ld.pl.pro': 'Pro', 'ld.pl.proP': '24 900 ₸ / ай', 'ld.pl.proD': '3 нүктеге дейін, шексіз пост, мерекелер күнтізбесі',
      'ld.teamH': 'Команда',
      'ld.teamLead': 'Astana IT University студенттері, «Технологиялық кәсіпкерлік» курсы, 2026.',
      'ld.footer': 'SmartBrand KZ — студенттік стартап жобасы. MVP деректерді тек браузеріңізде сақтайды.',
      'ld.endH': 'Келесі постыңызға бір-ақ басу қалды',
      'ld.endLead': 'Тіркелгі де, карта да қажет емес. Телефонда жұмыс істейді.'
    }
  };

  var KEY = 'sbkz.uiLang';
  function safeGet(k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } }
  function safeSet(k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* storage blocked: keep in memory */ } }

  var current = safeGet(KEY);
  if (!S[current]) {
    var nav = (navigator.language || 'en').toLowerCase();
    current = nav.indexOf('kk') === 0 ? 'kk' : 'en';
  }

  function t(key, vars) {
    var s = (S[current] && S[current][key]);
    if (s === undefined) s = S.en[key];
    if (s === undefined) return key;
    if (vars) s = s.replace(/\{(\w+)\}/g, function (_, k) { return vars[k] !== undefined ? vars[k] : ''; });
    return s;
  }

  function apply(root) {
    root = root || document;
    document.documentElement.lang = current === 'kk' ? 'kk' : 'en';
    root.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    root.querySelectorAll('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))); });
    root.querySelectorAll('[data-i18n-title]').forEach(function (el) { document.title = t(el.getAttribute('data-i18n-title')); });
  }

  var listeners = [];
  function setLang(lang) {
    if (!S[lang]) return;
    current = lang;
    safeSet(KEY, lang);
    apply();
    listeners.forEach(function (fn) { fn(lang); });
  }

  window.SBi18n = {
    t: t,
    apply: apply,
    get lang() { return current; },
    setLang: setLang,
    toggle: function () { setLang(current === 'en' ? 'kk' : 'en'); },
    onChange: function (fn) { listeners.push(fn); },
    strings: S
  };
})();
