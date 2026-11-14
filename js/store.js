/* SmartBrand KZ — local data store.
 * All data lives in localStorage under one key. If storage is blocked (private mode,
 * strict cookie settings) the app keeps working in memory and shows a banner.
 */
(function () {
  'use strict';
  var KEY = 'sbkz.data.v1';
  var available = true;
  try {
    var probe = '__sbkz_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
  } catch (e) { available = false; }

  function blank() {
    return {
      version: 1,
      profile: null,
      posts: [],
      metrics: { firstOpenAt: Date.now(), firstPostAt: null },
      settings: { simulateOutage: false }
    };
  }

  function load() {
    if (!available) return blank();
    try {
      var raw = window.localStorage.getItem(KEY);
      if (!raw) return blank();
      var d = JSON.parse(raw);
      if (!d || d.version !== 1 || !Array.isArray(d.posts)) return blank(); // corrupted or old format: start clean
      d.metrics = d.metrics || { firstOpenAt: Date.now(), firstPostAt: null };
      d.settings = d.settings || { simulateOutage: false };
      return d;
    } catch (e) {
      return blank();
    }
  }

  var data = load();

  function save() {
    if (!available) return false;
    try { window.localStorage.setItem(KEY, JSON.stringify(data)); return true; }
    catch (e) { return false; } // quota exceeded: keep working in memory
  }

  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  window.SBStore = {
    get available() { return available; },
    get data() { return data; },
    save: save,
    setProfile: function (p) { data.profile = p; save(); },
    addPost: function (post) {
      post.id = uid();
      post.createdAt = Date.now();
      data.posts.unshift(post);
      if (!data.metrics.firstPostAt) data.metrics.firstPostAt = Date.now();
      save();
      return post;
    },
    updatePost: function (id, patch) {
      var p = data.posts.filter(function (x) { return x.id === id; })[0];
      if (!p) return null;
      Object.keys(patch).forEach(function (k) { p[k] = patch[k]; });
      save();
      return p;
    },
    deletePost: function (id) {
      data.posts = data.posts.filter(function (x) { return x.id !== id; });
      save();
    },
    setSetting: function (k, v) { data.settings[k] = v; save(); },
    wipe: function () {
      data = blank();
      if (available) { try { window.localStorage.removeItem(KEY); } catch (e) { /* ignore */ } }
    },
    exportJSON: function () { return JSON.stringify(data, null, 2); }
  };
})();
