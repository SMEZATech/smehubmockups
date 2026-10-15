/*
 * App (phone) mockup kit, lane E of the Mobile + PWA programme (14 Oct 2026).
 * Shared by app-install.html, app-iphone-guide.html, app-push-ask.html, app-offline.html and app-mini-player.html.
 *
 * Each page shows one phone state on a realistic page behind it. Phones (and the framed preview) get the phone screen with the
 * live member chrome from member-chrome.js; desktop gets an explainer beside a phone frame that shows the same page at 375 px.
 * States are plain links (?state=<id>), so each state has its own address Joel can open on his phone.
 *
 * Page order: <header></header> <div id="app-root"></div> <script src="app-mockup-kit.js"></script> <script> AppKit.init({...}) </script>
 *             <script>window.SME_MEMBER_PAGE=true;</script> <script src="member-chrome.js"></script>
 */
(function () {
  var qs = new URLSearchParams(location.search);
  var framed = qs.get('frame') === '1';
  try { if (window.top !== window.self) framed = true; } catch (_) { framed = true; }
  var here = location.pathname.split('/').pop();
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  var BACKDROPS = {
    articles: function () {
      var cards = [
        ['assets/article-2.jpg', 'The National Payment System in South Africa: What It Means for Small Businesses', '6 minutes read', 'Maryna Steyn', '30 Sep 2026'],
        ['assets/article-5.jpg', 'Cash Flow Forecasting for Your First Year in Business', '5 minutes read', 'Karabo Kgophane', '26 Sep 2026'],
        ['assets/article-7.jpg', 'Marketplaces Help Scale, But Only When Done Right', '7 minutes read', 'Lungile Msomi', '8 Oct 2026']
      ];
      return '<section class="bg-gradient-to-br from-[#FDF3F5] via-white to-[#F3F1FB] px-5 pt-8 pb-7"><h1 class="font-jakarta font-extrabold text-[34px] tracking-tight text-[#0C1F31]">Articles</h1></section>' +
        '<nav aria-label="Breadcrumb" class="px-4 py-2 bg-[#F6F7F9] text-[13px] text-slate-500 flex items-center gap-1"><i data-lucide="house" class="w-3.5 h-3.5 text-[#DC183C]"></i><a href="public-home.html" class="inline-flex items-center min-h-[44px] min-w-[44px] font-semibold text-[#121A21]">Home</a> / <a href="public-articles.html" class="inline-flex items-center min-h-[44px] font-semibold text-[#121A21]">SME Articles</a> / Articles</nav>' +
        '<div class="px-4 py-5 space-y-4">' + cards.map(function (c) {
          return '<a href="public-article.html" class="block bg-white rounded-2xl border border-[#E7EBEF] p-3 shadow-sm"><img src="' + c[0] + '" alt="" class="w-full h-40 object-cover rounded-xl"><p class="font-jakarta font-extrabold text-[16px] leading-snug mt-3">' + c[1] + '</p><p class="text-[12.5px] text-slate-500 mt-1">' + c[2] + '</p><div class="mt-3 pt-3 border-t border-[#EEF1F4] flex items-center justify-between text-[12.5px]"><span class="font-semibold">' + c[3] + '</span><span class="text-slate-500">' + c[4] + '</span></div></a>';
        }).join('') + '</div>';
    },
    hub: function (opts) {
      opts = opts || {};
      var post = function (ini, name, act, ago, body, type) {
        var col = { Ask: '#DC183C', Win: '#29A37A', Share: '#AE6B0A' }[type];
        return '<article class="bg-white rounded-2xl border border-[#E7EBEF] p-4" style="box-shadow:inset 4px 0 0 0 ' + col + '"><div class="flex items-center gap-3"><span class="w-11 h-11 rounded-full bg-gradient-to-br from-[#DC183C] to-[#FF9900] grid place-items-center text-white font-jakarta font-bold text-[13px]">' + ini + '</span><div class="min-w-0"><p class="text-[14px]"><b class="font-jakarta">' + name + '</b> <span class="text-slate-500">' + act + '</span></p><p class="text-[12px] text-slate-400">' + ago + ' · <span class="font-bold" style="color:' + col + '">' + type.toUpperCase() + '</span></p></div></div><p class="text-[14.5px] leading-relaxed mt-3">' + body + '</p><div class="mt-3 pt-2 border-t border-[#EEF1F4] grid grid-cols-3 text-[13px] font-semibold text-slate-500"><span class="h-11 grid place-items-center">Like</span><span class="h-11 grid place-items-center">Comment</span><span class="h-11 grid place-items-center">Share</span></div></article>';
      };
      return '<h1 class="sr-only">Hub</h1><div class="px-4 py-4 space-y-3">' +
        '<div class="bg-white rounded-2xl border border-[#E7EBEF] p-3 flex items-center gap-3"><span class="w-10 h-10 rounded-full bg-gradient-to-br from-[#DC183C] to-[#FF9900] grid place-items-center text-white font-jakarta font-bold text-[12px] shrink-0">TJ</span><span class="flex-1 h-11 rounded-full bg-[#EEF2F6] px-4 flex items-center text-[14px] text-slate-500 truncate">Share something with fellow SMEs</span><i data-lucide="image" class="w-5 h-5 text-slate-400 shrink-0"></i></div>' +
        (opts.mine ? post('TJ', 'Tshepho Joel', 'asked a question', 'Just now', 'Has anyone used invoice finance for a government contract? How long did the partner take to pay out?', 'Ask') : '') +
        post('SM', 'Sello Monare', 'asked a question', '2h ago', 'Does anyone have a reliable contact for CIPC annual returns? I have done it myself for three years but I am out of time this quarter.', 'Ask') +
        post('NM', 'Naledi Mokoena', 'shared a win', '5h ago', 'We signed our first corporate catering contract today. Three months of follow-ups, and it paid off. Thank you to everyone here who reviewed my proposal.', 'Win') +
        '</div>';
    },
    article: function (opts) {
      opts = opts || {};
      var saved = !!opts.saved;
      return '<nav aria-label="Breadcrumb" class="px-4 pt-3 text-[13px] text-slate-500 flex items-center gap-1 flex-wrap"><i data-lucide="house" class="w-3.5 h-3.5 text-[#DC183C]"></i><a href="public-home.html" class="inline-flex items-center min-h-[44px] min-w-[44px] font-semibold text-[#121A21]">Home</a> / <a href="public-articles.html" class="inline-flex items-center min-h-[44px] font-semibold text-[#121A21]">Articles</a> / eCommerce</nav>' +
        '<article class="px-4 pb-6"><h1 class="font-jakarta font-extrabold text-[27px] leading-tight tracking-tight text-[#0C1F31] mt-1">Marketplaces Help Scale, But Only When Done Right</h1>' +
        '<button type="button" id="saveBtn" aria-pressed="' + saved + '" class="mt-3 h-11 px-5 rounded-full border text-[14px] font-semibold inline-flex items-center gap-2 ' + (saved ? 'bg-[#E4F5EE] border-[#29A37A] text-[#1F7F5E]' : 'bg-white border-[#DC183C] text-[#DC183C]') + '"><i data-lucide="' + (saved ? 'check' : 'download') + '" class="w-4 h-4"></i>' + (saved ? 'Saved to read offline' : 'Save to read offline') + '</button>' +
        '<p class="text-[13.5px] text-slate-500 mt-3 flex items-center gap-2"><i data-lucide="calendar" class="w-4 h-4 text-[#DC183C]"></i>Updated on 8 October 2026 · 7 minutes</p>' +
        '<img src="assets/article-7.jpg" alt="" class="w-full h-48 object-cover rounded-2xl mt-4">' +
        '<p class="text-[16px] leading-relaxed mt-4">You shop online, spot the picture that looks exactly like what you want, and the price is good. The package arrives and it is not what you ordered. Marketplaces can grow a small business fast, but only when the basics are right.</p>' +
        '<p class="text-[16px] leading-relaxed mt-3">Here is what South African SMEs who sell well on marketplaces do differently, from honest photos to fast replies.</p></article>';
    }
  };

  function stage(cfg, state) {
    var st = cfg.states.filter(function (s) { return s.id === state; })[0] || cfg.states[0];
    return '<main class="max-w-6xl mx-auto px-6 lg:px-10 py-10 grid grid-cols-[minmax(0,1fr)_395px] gap-10 lg:gap-16 items-start">' +
      '<div>' +
        '<p class="text-[11px] font-extrabold uppercase tracking-widest text-[#DC183C]">App (phone) · ' + esc(cfg.kicker || 'Mobile + PWA') + '</p>' +
        '<h1 class="font-jakarta font-extrabold text-[34px] tracking-tight leading-tight mt-2">' + esc(cfg.title) + '</h1>' +
        '<p class="text-[16px] text-slate-600 leading-relaxed mt-3 max-w-xl">' + cfg.lead + '</p>' +
        '<h2 class="font-jakarta font-extrabold text-[15px] mt-8">Screens</h2>' +
        '<div class="mt-3 grid gap-2 max-w-xl">' + cfg.states.map(function (s) {
          var on = s.id === st.id;
          return '<a href="?state=' + s.id + '" class="flex items-start gap-3 rounded-2xl border p-4 transition ' + (on ? 'border-[#DC183C] bg-[#FFF6F7]' : 'border-[#E7EBEF] bg-white hover:border-[#0C1F31]') + '"' + (on ? ' aria-current="true"' : '') + '><span class="w-8 h-8 rounded-full grid place-items-center shrink-0 ' + (on ? 'bg-[#DC183C] text-white' : 'bg-slate-100 text-slate-500') + '"><i data-lucide="' + (s.icon || 'smartphone') + '" class="w-4 h-4"></i></span><span><span class="block font-jakarta font-bold text-[15px]">' + esc(s.label) + '</span><span class="block text-[13.5px] text-slate-500 mt-0.5">' + s.desc + '</span></span></a>';
        }).join('') + '</div>' +
        (cfg.rules ? '<h2 class="font-jakarta font-extrabold text-[15px] mt-8">Rules (as built and QC\'d on the copy)</h2><ul class="mt-3 space-y-2 max-w-xl text-[14px] text-slate-700">' + cfg.rules.map(function (r) { return '<li class="flex gap-2.5"><i data-lucide="check" class="w-4 h-4 mt-0.5 text-[#29A37A] shrink-0"></i><span>' + r + '</span></li>'; }).join('') + '</ul>' : '') +
        (cfg.source ? '<p class="mt-6 text-[12.5px] text-slate-500 max-w-xl">' + cfg.source + '</p>' : '') +
      '</div>' +
      '<div class="sticky top-24"><div class="rounded-[46px] bg-[#0C1F31] p-[10px] shadow-[0_30px_60px_-20px_rgba(12,31,49,.45)]"><iframe title="' + esc(cfg.title) + ' at 375 px" src="' + here + '?frame=1&state=' + st.id + '" class="block w-[375px] h-[740px] rounded-[36px] bg-white" loading="eager"></iframe></div>' +
      '<p class="text-center text-[12px] text-slate-500 mt-3">The page at 375 px. <a href="' + here + '?state=' + st.id + '" class="font-semibold text-[#DC183C]">Open on your phone</a></p></div>' +
      '</main>';
  }

  function previewStrip(cfg, state) {
    if (framed) return '';
    return '<div class="preview-switch flex flex-wrap items-center gap-1 text-[10px] font-bold px-4 pt-3"><span class="uppercase tracking-widest text-slate-400 mr-1">Preview</span>' +
      cfg.states.map(function (s) { return '<a href="?state=' + s.id + '" class="h-6 leading-6 px-2.5 rounded-full ' + (s.id === state ? 'bg-[#0C1F31] text-white' : 'bg-slate-100 text-slate-600') + '">' + esc(s.label) + '</a>'; }).join('') + '</div>';
  }

  window.AppKit = {
    esc: esc,
    framed: framed,
    backdrop: function (name, opts) { return BACKDROPS[name](opts); },
    init: function (cfg) {
      var state = qs.get('state') || (location.hash || '').replace('#', '') || cfg.states[0].id; /* #state works too, e.g. app-push-ask.html#prefs */
      if (!cfg.states.some(function (s) { return s.id === state; })) state = cfg.states[0].id;
      var phone = framed || window.matchMedia('(max-width: 767px)').matches;
      var root = document.getElementById('app-root');
      document.body.classList.add(phone ? 'app-phone' : 'app-desk');
      if (phone) {
        var noChrome = cfg.noChrome && cfg.noChrome(state);
        if (noChrome) { var h = document.querySelector('header'); if (h) h.remove(); document.body.classList.add('app-nochrome'); }
        root.innerHTML = (noChrome ? '' : previewStrip(cfg, state)) + cfg.render(state);
        if (noChrome && !framed) root.insertAdjacentHTML('beforeend', '<div class="fixed bottom-3 inset-x-2 z-[70] flex justify-center">' + previewStrip(cfg, state).replace('px-4 pt-3', 'px-2 py-1.5 bg-white/90 rounded-full shadow') + '</div>');
        if (!noChrome) root.insertAdjacentHTML('beforeend', '<div style="height:calc(72px + env(safe-area-inset-bottom))"></div>');
      } else {
        root.innerHTML = stage(cfg, state);
      }
      if (window.lucide) lucide.createIcons();
      if (phone && cfg.after) cfg.after(state);
      var mq = window.matchMedia('(max-width: 767px)');
      if (!framed && mq.addEventListener) mq.addEventListener('change', function () { location.reload(); });
      window.AppKit.state = state; window.AppKit.phone = phone;
    }
  };
})();
