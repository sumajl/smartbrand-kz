/* SmartBrand KZ — MVP app (vanilla JS, hash routing, no build step).
 * Security note: user input is only ever inserted with textContent / value, never innerHTML.
 */
(function () {
  'use strict';
  var t = SBi18n.t;
  var G = SBGen;
  var store = SBStore;
  var main = document.getElementById('main');

  // ---------- Small DOM helper ----------
  function h(tag, props) {
    var el = document.createElement(tag);
    props = props || {};
    Object.keys(props).forEach(function (k) {
      var v = props[k];
      if (v === undefined || v === null || v === false) return;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k === 'html') el.innerHTML = v; // only used with static, trusted SVG strings
      else if (k.indexOf('on') === 0) el.addEventListener(k.slice(2), v);
      else if (k === 'value') el.value = v;
      else if (k === 'checked') el.checked = !!v;
      else el.setAttribute(k, v === true ? '' : v);
    });
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  }
  function append(el, c) {
    if (c === null || c === undefined || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { append(el, x); }); return; }
    el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  }

  var ICON_LOCK = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M6 11h12v10H6zM8.5 11V7.5a3.5 3.5 0 0 1 7 0V11"/></svg>';
  var ICON_INFO = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" style="flex:0 0 20px"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 11v6M12 7.5v.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  var ORNAMENT = '<svg class="ornament" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 31V21C20 15 14.5 12.5 11.2 15.4 8.4 17.9 10 22.2 13.3 21.4 15.4 20.9 15.3 18.2 13.6 17.8M20 21C20 15 25.5 12.5 28.8 15.4 31.6 17.9 30 22.2 26.7 21.4 24.6 20.9 24.7 18.2 26.4 17.8" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>';
  var SUNBURST = '<svg class="sunburst" viewBox="0 0 200 200" aria-hidden="true"><g fill="#fff">' +
    Array.apply(null, Array(16)).map(function (_, i) { return '<path transform="rotate(' + (i * 22.5) + ' 100 100)" d="M100 100 L96 0 L104 0 Z"/>'; }).join('') +
    '<circle cx="100" cy="100" r="34"/></g></svg>';
  var TPL_ICON = { new_item: '✨', promo: '％', daily: '🥐', holiday: '🌷', event: '📅', review: '💬' };

  // ---------- Toasts ----------
  var toastBox = document.getElementById('toasts');
  function toast(msg, isError) {
    var close = h('button', { type: 'button', text: t('toast.close') });
    var el = h('div', { class: 'toast' + (isError ? ' is-error' : ''), role: isError ? 'alert' : null }, h('span', { text: msg }), close);
    close.addEventListener('click', function () { el.remove(); });
    toastBox.appendChild(el);
    setTimeout(function () { el.remove(); }, isError ? 8000 : 4000);
  }

  // ---------- Date helpers ----------
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function todayISO() { var d = new Date(); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function plusDaysISO(n) { var d = new Date(); d.setDate(d.getDate() + n); return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function uiDate(iso) { return G.fmtDate(iso, SBi18n.lang === 'kk' ? 'kk' : 'en'); }
  function fmtDuration(ms) {
    var s = Math.max(1, Math.round(ms / 1000));
    if (s < 60) return t('time.sec', { n: s });
    return t('time.min', { m: Math.floor(s / 60), s: s % 60 });
  }

  // ---------- Form helpers ----------
  function field(opts) {
    var id = 'f-' + opts.key;
    var errId = id + '-err';
    var hintId = opts.hint ? id + '-hint' : null;
    var input;
    var describedBy = [hintId, errId].filter(Boolean).join(' ');
    if (opts.type === 'select') {
      input = h('select', { id: id, name: opts.key, class: 'input', 'aria-describedby': describedBy, required: opts.required });
      if (opts.placeholder) input.appendChild(h('option', { value: '', text: opts.placeholder }));
      opts.options.forEach(function (o) {
        var opt = h('option', { value: o.value, text: o.label });
        if (String(o.value) === String(opts.value)) opt.selected = true;
        input.appendChild(opt);
      });
    } else {
      input = h('input', {
        id: id, name: opts.key, class: 'input', type: opts.type || 'text', value: opts.value,
        'aria-describedby': describedBy, required: opts.required, min: opts.min, max: opts.maxValue,
        inputmode: opts.inputmode, autocomplete: opts.autocomplete || 'off', placeholder: opts.placeholderText
      });
    }
    if (opts.onInput) input.addEventListener('input', function () { opts.onInput(input.value); });
    if (opts.onInput && opts.type === 'select') input.addEventListener('change', function () { opts.onInput(input.value); });
    var wrap = h('div', { class: 'field', 'data-key': opts.key },
      h('label', { for: id, text: opts.label }),
      input,
      opts.hint ? h('span', { class: 'hint', id: hintId, text: opts.hint }) : null,
      h('span', { class: 'error', id: errId })
    );
    // Clear this field's error as soon as the user changes it (found while recording the demo:
    // corrected fields stayed red until the next submit).
    function clearError() {
      if (!wrap.classList.contains('has-error')) return;
      wrap.classList.remove('has-error');
      input.removeAttribute('aria-invalid');
      wrap.querySelector('.error').textContent = '';
    }
    input.addEventListener('input', clearError);
    input.addEventListener('change', clearError);
    return wrap;
  }

  function chipGroup(name, legend, options, value, onChange) {
    var fs = h('fieldset', { class: 'field', style: 'border:0;padding:0;margin:0 0 18px' }, h('legend', { class: 'label', text: legend, style: 'font-weight:600;margin-bottom:6px;padding:0' }));
    var chips = h('div', { class: 'chips' });
    options.forEach(function (o) {
      var input = h('input', { type: 'radio', name: name, value: o.value, checked: o.value === value });
      input.addEventListener('change', function () { if (input.checked) onChange(o.value); });
      chips.appendChild(h('label', { class: 'chip' }, input, h('span', { text: o.label })));
    });
    fs.appendChild(chips);
    return fs;
  }

  /** Shows field errors + a summary at the top of the form. errors = {key: message}. */
  function showErrors(form, errors) {
    form.querySelectorAll('.field').forEach(function (f) {
      f.classList.remove('has-error');
      var inp = f.querySelector('.input'); if (inp) inp.removeAttribute('aria-invalid');
      var e = f.querySelector('.error'); if (e) e.textContent = '';
    });
    var old = form.querySelector('.error-summary'); if (old) old.remove();
    var keys = Object.keys(errors);
    if (!keys.length) return true;
    var list = h('ul');
    keys.forEach(function (k) {
      var f = form.querySelector('.field[data-key="' + k + '"]');
      if (!f) return;
      f.classList.add('has-error');
      var inp = f.querySelector('.input'); if (inp) inp.setAttribute('aria-invalid', 'true');
      f.querySelector('.error').textContent = errors[k];
      var label = f.querySelector('label').textContent;
      list.appendChild(h('li', {}, h('a', { href: '#', onclick: function (ev) { ev.preventDefault(); inp && inp.focus(); }, text: label + ': ' + errors[k] })));
    });
    var summary = h('div', { class: 'error-summary', role: 'alert', tabindex: '-1' }, h('strong', { text: t('err.formIntro') }), list);
    form.insertBefore(summary, form.firstChild);
    summary.focus();
    return false;
  }

  // ---------- Profile form (onboarding + settings) ----------
  var SAMPLE = { name: 'Dala Coffee', type: 'coffee', city: 'astana', postLang: 'kk' };

  function profileForm(initial, submitLabel, onSave, withSample) {
    var state = Object.assign({ name: '', type: '', city: '', postLang: 'kk' }, initial || {});
    var form = h('form', { novalidate: true });
    function build() {
      form.textContent = '';
      form.appendChild(field({ key: 'name', label: t('ob.name'), hint: t('ob.nameHint'), value: state.name, required: true, autocomplete: 'organization', onInput: function (v) { state.name = v; } }));
      form.appendChild(field({ key: 'type', type: 'select', label: t('ob.type'), value: state.type, required: true, placeholder: '—',
        options: Object.keys(G.TYPES).map(function (k) { return { value: k, label: t('type.' + k) }; }), onInput: function (v) { state.type = v; } }));
      form.appendChild(field({ key: 'city', type: 'select', label: t('ob.city'), value: state.city, required: true, placeholder: '—',
        options: Object.keys(G.CITIES).map(function (k) { return { value: k, label: t('city.' + k) }; }), onInput: function (v) { state.city = v; } }));
      var langs = chipGroup('postLang', t('ob.postLang'), ['kk', 'ru', 'en'].map(function (l) { return { value: l, label: t('plang.' + l) }; }), state.postLang, function (v) { state.postLang = v; });
      langs.appendChild(h('span', { class: 'hint', text: t('ob.postLangHint') }));
      form.appendChild(langs);
      var actions = h('div', { class: 'actions' }, h('button', { type: 'submit', class: 'btn btn-primary', text: submitLabel }));
      if (withSample) {
        actions.appendChild(h('button', { type: 'button', class: 'btn btn-ghost', text: t('ob.sample'), onclick: function () { state = Object.assign({}, SAMPLE); build(); } }));
      }
      form.appendChild(actions);
    }
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var errors = {};
      var name = state.name.trim();
      if (!name) errors.name = t('err.required');
      else if (name.length < 2) errors.name = t('err.nameShort');
      else if (name.length > 40) errors.name = t('err.tooLong', { max: 40 });
      if (!G.TYPES[state.type]) errors.type = t('err.select');
      if (!G.CITIES[state.city]) errors.city = t('err.select');
      if (!showErrors(form, errors)) return;
      onSave({ name: name, type: state.type, city: state.city, postLang: state.postLang });
    });
    build();
    form._rebuild = build;
    return form;
  }

  // ---------- Template field definitions ----------
  function templateFields(tpl) {
    var product = { key: 'product', label: t('cr.product'), placeholderText: t('cr.productHint'), required: true, max: 60 };
    var detail = { key: 'detail', label: t('cr.detail'), placeholderText: t('cr.detailHint'), max: 120 };
    var offer = { key: 'offer', label: t('cr.offer'), placeholderText: t('cr.offerHint'), max: 80 };
    switch (tpl) {
      case 'new_item': return [product, detail];
      case 'daily': return [product, detail];
      case 'promo': return [product,
        { key: 'discount', label: t('cr.discount'), type: 'number', required: true, min: 1, maxValue: 90, inputmode: 'numeric', isDiscount: true },
        { key: 'until', label: t('cr.until'), type: 'date', min: todayISO(), future: true }];
      case 'holiday': return [
        { key: 'holiday', label: t('cr.holiday'), type: 'select', required: true,
          options: G.upcomingHolidays(new Date(), G.HOLIDAYS.length).map(function (u) {
            var l = SBi18n.lang === 'kk' ? 'kk' : 'en';
            return { value: u.holiday.id, label: u.holiday[l] + ' — ' + uiDate(u.date.getFullYear() + '-' + pad(u.date.getMonth() + 1) + '-' + pad(u.date.getDate())) };
          }) },
        offer];
      case 'event': return [
        { key: 'event', label: t('cr.event'), placeholderText: t('cr.eventHint'), required: true, max: 60 },
        { key: 'date', label: t('cr.date'), type: 'date', required: true, min: todayISO(), future: true },
        detail];
      case 'review': return [offer];
    }
    return [];
  }

  function validateFields(defs, values) {
    var errors = {};
    defs.forEach(function (d) {
      var v = values[d.key] === undefined || values[d.key] === null ? '' : String(values[d.key]).trim();
      if (d.required && !v) { errors[d.key] = d.type === 'select' ? t('err.select') : t('err.required'); return; }
      if (!v) return;
      if (d.max && v.length > d.max) errors[d.key] = t('err.tooLong', { max: d.max });
      if (d.isDiscount && (!/^\d+$/.test(v) || +v < 1 || +v > 90)) errors[d.key] = t('err.discount');
      if (d.future && v < todayISO()) errors[d.key] = t('err.pastDate');
    });
    return errors;
  }

  // ---------- Draft (the post currently open in the editor) ----------
  var draft = null;       // {id?, template, fields, tone, lang, seed, text, hashtags, edited}
  var createState = {};   // remembers inputs per template so a failed attempt or language switch keeps them

  function compose(d) {
    var out = G.compose({ profile: store.data.profile, template: d.template, fields: d.fields, tone: d.tone, lang: d.lang, seed: d.seed });
    d.text = out.text;
    d.hashtags = out.hashtags;
    d.edited = false;
  }
  function fullText(d) { return d.text.trim() + (d.hashtags && d.hashtags.length ? '\n\n' + d.hashtags.join(' ') : ''); }

  /** Simulated network call so the UI handles latency and failure the way a real AI API would. */
  function generate(d) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        if (store.data.settings.simulateOutage) { reject(new Error('outage')); return; }
        try { compose(d); resolve(d); } catch (e) { reject(e); }
      }, 650);
    });
  }

  function persistDraft(patch) {
    var record = {
      template: draft.template, fields: draft.fields, tone: draft.tone, lang: draft.lang, seed: draft.seed,
      text: draft.text, hashtags: draft.hashtags
    };
    Object.assign(record, patch || {});
    if (draft.id && store.data.posts.some(function (p) { return p.id === draft.id; })) {
      store.updatePost(draft.id, record);
    } else {
      record.status = record.status || 'draft';
      record.scheduledAt = record.scheduledAt || null;
      var saved = store.addPost(record);
      draft.id = saved.id;
    }
  }

  // ---------- Screens ----------
  function screenOnboarding() {
    var wrap = h('section', { class: 'onboard' },
      h('h1', { class: 'screen-title', tabindex: '-1', text: t('ob.title') }),
      h('p', { class: 'lead', text: t('ob.lead') })
    );
    wrap.appendChild(profileForm(null, t('ob.submit'), function (p) {
      store.setProfile(p);
      toast(t('ob.saved'));
      go('#/home');
    }, true));
    wrap.appendChild(h('p', { class: 'privacy-note', html: ICON_LOCK }, h('span', { text: t('ob.privacy') })));
    return wrap;
  }

  function statCount(status) { return store.data.posts.filter(function (p) { return p.status === status; }).length; }

  function screenHome() {
    var p = store.data.profile;
    var next = G.upcomingHolidays(new Date(), 1)[0];
    var l = SBi18n.lang === 'kk' ? 'kk' : 'en';
    var hint = next.days === 0 ? t('home.oneClickToday', { holiday: next.holiday[l] }) : t('home.oneClickHint', { holiday: next.holiday[l], days: next.days });

    var magic = h('button', { type: 'button', class: 'btn btn-magic', text: t('home.oneClick') });
    magic.addEventListener('click', function () {
      magic.disabled = true;
      draft = { template: 'holiday', fields: { holiday: next.holiday.id }, tone: 'friendly', lang: p.postLang, seed: 1 };
      magic.textContent = t('cr.generating');
      generate(draft).then(function () { go('#/result'); }).catch(function () {
        magic.disabled = false; magic.textContent = t('home.oneClick');
        toast(t('cr.fail'), true);
      });
    });

    var grid = h('div', { class: 'tpl-grid' });
    G.TEMPLATES.forEach(function (tpl) {
      grid.appendChild(h('button', { type: 'button', class: 'tpl-card', onclick: function () { go('#/create/' + tpl); } },
        h('span', { class: 'ico', 'aria-hidden': 'true', text: TPL_ICON[tpl] }),
        h('strong', { text: t('tpl.' + tpl) }),
        h('small', { text: t('tpl.' + tpl + '.d') })));
    });

    var recent = store.data.posts.slice(0, 3);
    var recentBox = recent.length ? postList(recent) : h('p', { class: 'hint', text: t('home.emptyRecent') });

    return h('section', {},
      h('h1', { class: 'screen-title', tabindex: '-1', text: t('home.hello', { name: p.name }) }),
      h('p', { class: 'lead', text: t('home.lead') }),
      h('div', { class: 'oneclick', html: ORNAMENT },
        h('div', {}, h('h2', { text: t('tpl.holiday') }), h('p', { text: hint })),
        magic),
      h('h2', { style: 'font-size:22px', text: t('home.pick') }),
      grid,
      h('div', { class: 'layout-2', style: 'margin-top:40px' },
        h('div', {}, h('h2', { style: 'font-size:22px', text: t('home.recent') }), recentBox),
        h('div', { class: 'panel panel-mist' },
          h('h3', { text: t('home.week') }),
          h('div', { class: 'stats' },
            h('div', { class: 'stat' }, h('b', { text: String(store.data.posts.length) }), h('span', { text: t('home.statCreated') })),
            h('div', { class: 'stat' }, h('b', { text: String(statCount('planned')) }), h('span', { text: t('home.statPlanned') })),
            h('div', { class: 'stat' }, h('b', { text: String(statCount('published')) }), h('span', { text: t('home.statPublished') }))))
      )
    );
  }

  function screenCreate(tpl) {
    if (G.TEMPLATES.indexOf(tpl) < 0) { go('#/home'); return h('div'); }
    var p = store.data.profile;
    var st = createState[tpl] = createState[tpl] || { fields: {}, tone: 'friendly', lang: p.postLang };
    if (tpl === 'holiday' && !st.fields.holiday) st.fields.holiday = G.upcomingHolidays(new Date(), 1)[0].holiday.id;
    var defs = templateFields(tpl);
    var form = h('form', { novalidate: true });
    defs.forEach(function (d) {
      var opts = Object.assign({}, d, { value: st.fields[d.key] || '', onInput: function (v) { st.fields[d.key] = v; } });
      form.appendChild(field(opts));
    });
    form.appendChild(chipGroup('tone', t('cr.tone'), ['friendly', 'formal', 'playful'].map(function (x) { return { value: x, label: t('tone.' + x) }; }), st.tone, function (v) { st.tone = v; }));
    form.appendChild(chipGroup('plang', t('cr.postLang'), ['kk', 'ru', 'en'].map(function (x) { return { value: x, label: t('plang.' + x) }; }), st.lang, function (v) { st.lang = v; }));

    var submit = h('button', { type: 'submit', class: 'btn btn-magic', text: t('cr.generate') });
    var status = h('div', { 'aria-live': 'polite' });
    form.appendChild(submit);
    form.appendChild(status);

    function run() {
      var errors = validateFields(defs, st.fields);
      if (!showErrors(form, errors)) return;
      submit.disabled = true;
      status.textContent = '';
      status.appendChild(h('div', { class: 'loading' }, h('span', { class: 'spinner', 'aria-hidden': 'true' }), h('span', { text: t('cr.generating') })));
      var fields = {};
      defs.forEach(function (d) { var v = st.fields[d.key]; if (v !== undefined && String(v).trim() !== '') fields[d.key] = String(v).trim(); });
      draft = { template: tpl, fields: fields, tone: st.tone, lang: st.lang, seed: 1 };
      generate(draft).then(function () {
        go('#/result');
      }).catch(function () {
        submit.disabled = false;
        status.textContent = '';
        var retry = h('button', { type: 'button', class: 'btn btn-primary btn-small', text: t('cr.retry'), onclick: run });
        status.appendChild(h('div', { class: 'fail', role: 'alert' }, h('p', { text: t('cr.fail') }), retry));
        retry.focus();
      });
    }
    form.addEventListener('submit', function (ev) { ev.preventDefault(); run(); });

    return h('section', { style: 'max-width:620px' },
      h('button', { type: 'button', class: 'back', text: '← ' + t('cr.back'), onclick: function () { go('#/home'); } }),
      h('h1', { class: 'screen-title', tabindex: '-1', text: t('tpl.' + tpl) }),
      h('p', { class: 'lead', text: t('tpl.' + tpl + '.d') }),
      form);
  }

  function previewHeadline(d) {
    var f = d.fields || {};
    if (d.template === 'holiday') {
      var hol = G.HOLIDAYS.filter(function (x) { return x.id === f.holiday; })[0];
      return hol ? hol[d.lang] : '';
    }
    if (d.template === 'promo') return '−' + f.discount + '% ' + (f.product || '');
    if (d.template === 'event') return f.event || '';
    if (d.template === 'review') return '★★★★★';
    return f.product || '';
  }

  function phonePreview(d) {
    var p = store.data.profile;
    var initials = p.name.split(/\s+/).map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase();
    var handle = p.name.toLowerCase().replace(/[^0-9a-zа-яёәғқңөұүһі]+/gi, '').slice(0, 24) || 'business';
    var cap = h('div', { class: 'ig-caption' }, h('b', { text: handle + ' ' }), h('span', { class: 'cap-text', text: d.text }), '\n\n', h('span', { class: 'ig-tags', text: (d.hashtags || []).join(' ') }));
    return h('div', { class: 'phone', 'aria-label': 'Instagram preview', role: 'img' },
      h('div', { class: 'ig-head' }, h('div', { class: 'avatar', text: initials }), h('div', {}, h('div', { class: 'ig-name', text: handle }), h('div', { class: 'ig-sub', text: t('city.' + p.city) }))),
      h('div', { class: 'ig-img', html: SUNBURST }, h('div', { class: 'big', text: previewHeadline(d) })),
      cap);
  }

  function screenResult() {
    if (!draft) { go('#/home'); return h('div'); }
    var limit = G.INSTAGRAM_LIMIT;
    var phoneCol = h('div', { class: 'phone-col' }, phonePreview(draft));
    var ta = h('textarea', { id: 'post-text', class: 'input post-text', 'aria-describedby': 'post-count post-limit' });
    ta.value = draft.text;
    var counter = h('div', { id: 'post-count', class: 'counter', 'aria-live': 'polite' });
    var limitErr = h('div', { id: 'post-limit', class: 'error', style: 'color:var(--error);font-weight:500', role: 'alert' });
    var tagsEl = h('p', { class: 'ig-tags', style: 'margin:8px 0 0;font-size:15px;word-break:break-word' });

    var copyBtn = h('button', { type: 'button', class: 'btn btn-primary', text: t('rs.copy') });
    var planBtn = h('button', { type: 'button', class: 'btn btn-ghost', text: t('rs.plan'), 'aria-expanded': 'false', 'aria-controls': 'plan-box' });
    var draftBtn = h('button', { type: 'button', class: 'btn btn-ghost', text: t('rs.saveDraft') });
    var regenBtn = h('button', { type: 'button', class: 'btn btn-ghost', text: t('rs.regen') });

    function refresh() {
      var len = fullText(draft).length;
      counter.textContent = t('rs.chars', { n: len, max: limit });
      var over = len > limit;
      counter.classList.toggle('over', over);
      limitErr.textContent = over ? t('rs.tooLong', { max: limit }) : '';
      ta.setAttribute('aria-invalid', over ? 'true' : 'false');
      [copyBtn, planBtn, draftBtn].forEach(function (b) { b.disabled = over; });
      tagsEl.textContent = (draft.hashtags || []).join(' ');
      var cap = phoneCol.querySelector('.cap-text'); if (cap) cap.textContent = draft.text;
    }
    ta.addEventListener('input', function () { draft.text = ta.value; draft.edited = true; refresh(); });

    function recompose(change) {
      if (draft.edited && !window.confirm(t('rs.regenConfirm'))) return false;
      change();
      if (store.data.settings.simulateOutage) { toast(t('cr.fail'), true); return false; }
      compose(draft);
      ta.value = draft.text;
      phoneCol.textContent = '';
      phoneCol.appendChild(phonePreview(draft));
      refresh();
      return true;
    }
    regenBtn.addEventListener('click', function () { recompose(function () { draft.seed = (draft.seed || 1) + 1; }); });

    var toneChips = chipGroup('rtone', t('cr.tone'), ['friendly', 'formal', 'playful'].map(function (x) { return { value: x, label: t('tone.' + x) }; }), draft.tone, function (v) {
      var prev = draft.tone;
      if (!recompose(function () { draft.tone = v; })) { draft.tone = prev; toneChips.querySelector('input[value="' + prev + '"]').checked = true; }
    });
    var langChips = chipGroup('rlang', t('cr.postLang'), ['kk', 'ru', 'en'].map(function (x) { return { value: x, label: t('plang.' + x) }; }), draft.lang, function (v) {
      var prev = draft.lang;
      if (!recompose(function () { draft.lang = v; })) { draft.lang = prev; langChips.querySelector('input[value="' + prev + '"]').checked = true; }
    });

    copyBtn.addEventListener('click', function () {
      var text = fullText(draft);
      function fallback() {
        ta.focus(); ta.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
        if (ok) { done(); } else { toast(t('rs.copyFail'), true); }
      }
      function done() {
        persistDraft(draft.id ? {} : { status: 'draft' });
        toast(t('rs.copied'));
      }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else { fallback(); }
    });

    draftBtn.addEventListener('click', function () { persistDraft(); toast(t('rs.draftSaved')); });

    // Plan box
    var planBox = h('div', { id: 'plan-box', class: 'plan-box', hidden: true });
    var planForm = h('form', { novalidate: true });
    var planState = { pdate: plusDaysISO(1), ptime: '12:00' };
    var existing = draft.id && store.data.posts.filter(function (x) { return x.id === draft.id; })[0];
    if (existing && existing.scheduledAt) { planState.pdate = existing.scheduledAt.slice(0, 10); planState.ptime = existing.scheduledAt.slice(11, 16); }
    planForm.appendChild(h('div', { class: 'form-row' },
      field({ key: 'pdate', type: 'date', label: t('rs.planDate'), value: planState.pdate, min: todayISO(), required: true, onInput: function (v) { planState.pdate = v; } }),
      field({ key: 'ptime', type: 'time', label: t('rs.planTime'), value: planState.ptime, required: true, onInput: function (v) { planState.ptime = v; } })));
    planForm.appendChild(h('button', { type: 'submit', class: 'btn btn-primary', text: t('rs.planSave') }));
    planForm.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var errors = validateFields([{ key: 'pdate', required: true, future: true }, { key: 'ptime', required: true }], planState);
      if (!showErrors(planForm, errors)) return;
      persistDraft({ status: 'planned', scheduledAt: planState.pdate + 'T' + planState.ptime });
      toast(t('rs.planned', { date: uiDate(planState.pdate) + ', ' + planState.ptime }));
      go('#/plan');
    });
    planBox.appendChild(planForm);
    planBtn.addEventListener('click', function () {
      var open = planBox.hidden;
      planBox.hidden = !open;
      planBtn.setAttribute('aria-expanded', String(open));
      if (open) planBox.querySelector('input').focus();
    });

    var left = h('div', {},
      h('div', { class: 'field' }, h('label', { for: 'post-text', text: t('rs.textLabel') }), ta, counter, limitErr),
      h('div', {}, h('span', { class: 'label', style: 'font-weight:600', text: t('rs.hashtags') }), tagsEl),
      h('div', { style: 'margin-top:18px' }, toneChips, langChips),
      h('div', { class: 'result-actions' }, copyBtn, planBtn, draftBtn, regenBtn),
      planBox,
      h('p', { class: 'review-note', html: ICON_INFO }, h('span', { text: t('rs.review') })),
      h('button', { type: 'button', class: 'back', style: 'margin-top:12px', text: '+ ' + t('rs.new'), onclick: function () { draft = null; go('#/home'); } })
    );

    var section = h('section', {},
      h('h1', { class: 'screen-title', tabindex: '-1', text: t('rs.title') }),
      h('p', { class: 'lead', text: t('rs.lead') }),
      h('div', { class: 'layout-2' }, left, phoneCol));
    refresh();
    return section;
  }

  function postList(posts, opts) {
    opts = opts || {};
    var ul = h('ul', { class: 'post-list' });
    posts.forEach(function (p) {
      var meta = [t('tpl.' + p.template), t('plang.' + p.lang)];
      if (p.scheduledAt) meta.unshift(uiDate(p.scheduledAt.slice(0, 10)) + ', ' + p.scheduledAt.slice(11, 16));
      var badge = null;
      if (p.status === 'published') badge = h('span', { class: 'badge ok', text: t('home.statPublished') });
      else if (p.status === 'planned' && p.scheduledAt.slice(0, 10) < todayISO()) badge = h('span', { class: 'badge warn', text: t('pl.overdue') });
      var acts = h('div', { class: 'acts' });
      acts.appendChild(h('button', { type: 'button', class: 'btn btn-ghost btn-small', text: t('pl.copy'), onclick: function () { openPost(p); } }));
      if (opts.manage) {
        if (p.status !== 'published') acts.appendChild(h('button', { type: 'button', class: 'btn btn-ghost btn-small', text: t('pl.markPublished'), onclick: function () { store.updatePost(p.id, { status: 'published' }); render(); } }));
        acts.appendChild(h('button', { type: 'button', class: 'btn btn-danger btn-small', text: t('pl.delete'), onclick: function () {
          if (!window.confirm(t('pl.deleteConfirm'))) return;
          store.deletePost(p.id); toast(t('pl.deleted')); render();
        } }));
      }
      ul.appendChild(h('li', { class: 'post-item' },
        h('div', {}, h('div', { class: 'meta' }, meta.join(' · '), badge ? ' ' : '', badge), h('div', { class: 'preview', text: p.text })),
        acts));
    });
    return ul;
  }

  function openPost(p) {
    draft = { id: p.id, template: p.template, fields: p.fields, tone: p.tone, lang: p.lang, seed: p.seed, text: p.text, hashtags: p.hashtags, edited: false };
    go('#/result');
  }

  function screenPlan() {
    var posts = store.data.posts;
    var planned = posts.filter(function (p) { return p.status === 'planned'; }).sort(function (a, b) { return a.scheduledAt < b.scheduledAt ? -1 : 1; });
    var drafts = posts.filter(function (p) { return p.status === 'draft'; });
    var published = posts.filter(function (p) { return p.status === 'published'; });
    var section = h('section', {},
      h('h1', { class: 'screen-title', tabindex: '-1', text: t('pl.title') }),
      h('p', { class: 'lead', text: t('pl.lead') }));

    if (!planned.length) {
      section.appendChild(h('div', { class: 'empty' }, h('p', { text: t('pl.empty') }), h('a', { class: 'btn btn-primary', href: '#/home', text: t('pl.emptyCta') })));
    } else {
      var groups = {};
      planned.forEach(function (p) { var d = p.scheduledAt.slice(0, 10); (groups[d] = groups[d] || []).push(p); });
      Object.keys(groups).sort().forEach(function (d) {
        var label = d === todayISO() ? t('pl.today') + ', ' + uiDate(d) : uiDate(d);
        section.appendChild(h('div', { class: 'day-group' }, h('h3', { text: label }), postList(groups[d], { manage: true })));
      });
    }
    if (drafts.length) section.appendChild(h('div', { class: 'day-group' }, h('h2', { style: 'font-size:22px', text: t('pl.drafts') }), postList(drafts, { manage: true })));
    if (published.length) section.appendChild(h('div', { class: 'day-group' }, h('h2', { style: 'font-size:22px', text: t('pl.published') }), postList(published, { manage: true })));
    return section;
  }

  function screenSettings() {
    var d = store.data;
    var section = h('section', { style: 'max-width:640px' }, h('h1', { class: 'screen-title', tabindex: '-1', text: t('st.title') }));

    // Interface language
    section.appendChild(h('div', { class: 'panel' }, h('h2', { style: 'font-size:20px', text: t('st.uiLang') }),
      chipGroup('uilang', t('st.uiLang'), [{ value: 'en', label: 'English' }, { value: 'kk', label: 'Қазақша' }], SBi18n.lang, function (v) { SBi18n.setLang(v); })));

    if (d.profile) {
      var pf = profileForm(d.profile, t('st.save'), function (p) { store.setProfile(p); toast(t('st.saved')); }, false);
      section.appendChild(h('div', { class: 'panel' }, h('h2', { style: 'font-size:20px', text: t('st.profile') }), pf));
    }

    // Metrics for user testing
    var m = d.metrics;
    section.appendChild(h('div', { class: 'panel' }, h('h2', { style: 'font-size:20px', text: t('st.metrics') }),
      h('p', { text: m.firstPostAt ? t('st.firstPost', { t: fmtDuration(m.firstPostAt - m.firstOpenAt) }) : t('st.noFirstPost') })));

    // Demo tools
    var outage = h('input', { type: 'checkbox', id: 'outage', checked: d.settings.simulateOutage });
    outage.addEventListener('change', function () { store.setSetting('simulateOutage', outage.checked); });
    section.appendChild(h('div', { class: 'panel' }, h('h2', { style: 'font-size:20px', text: t('st.demo') }),
      h('div', { class: 'switch' }, outage, h('label', { for: 'outage' }, h('strong', { text: t('st.outage') }), h('span', { class: 'hint', style: 'display:block;color:var(--ink-2);font-size:14px', text: t('st.outageHint') })))));

    // Data
    var exportBtn = h('button', { type: 'button', class: 'btn btn-ghost', text: t('st.export') });
    exportBtn.addEventListener('click', function () {
      var blob = new Blob([store.exportJSON()], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = h('a', { href: url, download: 'smartbrand-kz-data.json' });
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    });
    var wipeBtn = h('button', { type: 'button', class: 'btn btn-danger', text: t('st.wipe') });
    wipeBtn.addEventListener('click', function () {
      if (!window.confirm(t('st.wipeConfirm'))) return;
      store.wipe(); draft = null; createState = {};
      toast(t('st.wiped'));
      go('#/welcome');
    });
    section.appendChild(h('div', { class: 'panel' }, h('h2', { style: 'font-size:20px', text: t('st.data') }), h('p', { class: 'hint', text: t('st.dataLead') }),
      h('div', { class: 'result-actions' }, exportBtn, wipeBtn)));

    section.appendChild(h('div', { class: 'panel panel-mist' }, h('h2', { style: 'font-size:20px', text: t('st.about') }), h('p', { style: 'margin:0', text: t('st.aboutText') })));
    return section;
  }

  // ---------- Router ----------
  function go(hash) {
    if (location.hash === hash) render(); else location.hash = hash;
  }

  function render() {
    var hash = location.hash || '#/home';
    var parts = hash.replace(/^#\/?/, '').split('/');
    var route = parts[0] || 'home';
    var hasProfile = !!store.data.profile;
    if (!hasProfile && route !== 'settings') route = 'welcome';
    if (hasProfile && route === 'welcome') route = 'home';

    var view;
    switch (route) {
      case 'welcome': view = screenOnboarding(); break;
      case 'create': view = screenCreate(parts[1]); break;
      case 'result': view = screenResult(); break;
      case 'plan': view = screenPlan(); break;
      case 'settings': view = screenSettings(); break;
      default: route = 'home'; view = screenHome();
    }
    main.textContent = '';
    main.appendChild(view);

    var nav = document.getElementById('app-nav');
    nav.hidden = !hasProfile;
    nav.querySelectorAll('a').forEach(function (a) {
      if (a.getAttribute('data-route') === route) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    document.title = (view.querySelector('h1') ? view.querySelector('h1').textContent + ' — ' : '') + 'SmartBrand KZ';
    var h1 = view.querySelector('h1');
    if (h1 && renderCount++ > 0) h1.focus({ preventScroll: false });
    window.scrollTo(0, 0);
  }
  var renderCount = 0;

  // ---------- Boot ----------
  document.getElementById('lang-toggle').addEventListener('click', function () { SBi18n.toggle(); });
  SBi18n.onChange(function () { render(); });
  window.addEventListener('hashchange', render);
  if (!store.available) document.getElementById('storage-banner').hidden = false;
  SBi18n.apply();
  render();
})();
