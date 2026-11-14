/* SmartBrand KZ — landing page: language switch + live demo using the real MVP engine. */
(function () {
  'use strict';
  var t = SBi18n.t;

  var DEMO = {
    coffee:   { name: 'Dala Coffee',   product: { en: 'Pistachio latte', ru: 'Фисташковый латте', kk: 'Пісте латтесі' }, tpl: 'daily' },
    bakery:   { name: 'Taba Bakery',   product: { en: 'Honey baursaks', ru: 'Баурсаки с мёдом', kk: 'Балды бауырсақ' }, tpl: 'daily' },
    cafe:     { name: 'Qazan Café',    product: { en: 'Homemade beshbarmak', ru: 'Домашний бешбармак', kk: 'Үй бешбармағы' }, tpl: 'promo', discount: 15 },
    fastfood: { name: 'Burger Batyr',  product: { en: 'Double cheeseburger', ru: 'Двойной чизбургер', kk: 'Қос чизбургер' }, tpl: 'promo', discount: 20 },
    flowers:  { name: 'Gulder Studio', product: null, tpl: 'holiday' },
    clothing: { name: 'Kiim Store',    product: { en: 'Wool coats', ru: 'Шерстяные пальто', kk: 'Жүн пальтолар' }, tpl: 'new_item' },
    grocery:  { name: 'Bereke Market', product: { en: 'Fresh kurt', ru: 'Свежий курт', kk: 'Жаңа құрт' }, tpl: 'daily' }
  };

  var sel = document.getElementById('demo-type');
  var btn = document.getElementById('demo-btn');
  var langBox = document.getElementById('demo-lang');
  var caption = document.getElementById('demo-caption');
  var tagsEl = document.getElementById('demo-tags');
  var big = document.getElementById('demo-big');
  var postLang = SBi18n.lang === 'kk' ? 'kk' : 'ru';
  var seed = 1;
  var timer = null;

  function fillTypes() {
    var v = sel.value || 'coffee';
    sel.textContent = '';
    Object.keys(DEMO).forEach(function (k) {
      var o = document.createElement('option');
      o.value = k; o.textContent = t('type.' + k);
      if (k === v) o.selected = true;
      sel.appendChild(o);
    });
  }

  function fillLangs() {
    langBox.textContent = '';
    ['kk', 'ru', 'en'].forEach(function (l) {
      var lab = document.createElement('label'); lab.className = 'chip';
      var inp = document.createElement('input'); inp.type = 'radio'; inp.name = 'demo-lang'; inp.value = l; inp.checked = l === postLang;
      inp.addEventListener('change', function () { postLang = l; run(); });
      var sp = document.createElement('span'); sp.textContent = t('plang.' + l);
      lab.appendChild(inp); lab.appendChild(sp); langBox.appendChild(lab);
    });
  }

  function run() {
    var type = sel.value;
    var d = DEMO[type];
    var fields = {};
    if (d.product) fields.product = d.product[postLang];
    if (d.discount) fields.discount = d.discount;
    var out = SBGen.compose({ profile: { name: d.name, type: type, city: 'astana' }, template: d.tpl, fields: fields, tone: 'friendly', lang: postLang, seed: seed++ });

    var handle = d.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    document.getElementById('demo-handle').textContent = handle;
    document.getElementById('demo-handle2').textContent = handle;
    document.getElementById('demo-avatar').textContent = d.name.split(' ').map(function (w) { return w[0]; }).join('').slice(0, 2);
    if (d.tpl === 'holiday') {
      var next = SBGen.upcomingHolidays(new Date(), 1)[0].holiday;
      big.textContent = next[postLang];
    } else {
      big.textContent = (d.discount ? '−' + d.discount + '% ' : '') + d.product[postLang];
    }

    // Type the caption out — the one animated moment on the page.
    clearInterval(timer);
    tagsEl.textContent = '';
    var full = out.text;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { caption.textContent = full; tagsEl.textContent = out.hashtags.join(' '); return; }
    var i = 0;
    caption.classList.add('typing');
    caption.textContent = '';
    timer = setInterval(function () {
      i += 3;
      caption.textContent = full.slice(0, i);
      if (i >= full.length) {
        clearInterval(timer);
        caption.classList.remove('typing');
        tagsEl.textContent = out.hashtags.join(' ');
      }
    }, 18);
  }

  btn.addEventListener('click', run);
  sel.addEventListener('change', run);
  document.getElementById('lang-toggle').addEventListener('click', function () { SBi18n.toggle(); });
  SBi18n.onChange(function () { fillTypes(); fillLangs(); });

  SBi18n.apply();
  fillTypes();
  fillLangs();
  run();
})();
