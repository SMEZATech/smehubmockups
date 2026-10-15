/*
 * SME South Africa: Save module (shared by every mockup that shows saveable content).  Approved 15 Oct 2026.
 * Include after the page's own scripts:
 *   <link rel="stylesheet" href="assets/save-module.css">   (in <head>)
 *   <script src="assets/save-module.js"></script>            (before </body>)
 * It finds the cards / titles / post action rows listed in CARDS, PAGES and POSTS below and adds the Save button,
 * so cards drawn later by the page's own JS are picked up too. One handler, one toast, one sign in prompt.
 * View: window.SME_VISITOR_VIEW / SME_MEMBER_PAGE flags, else the page's "Viewing as" state (?as=member|visitor, sessionStorage smeViewAs),
 * default visitor. Saved state is remembered in localStorage (smeSavedDemo) for the demo only.
 * Types: article, guide, resource, event, podcast, discussion, post. Nothing about how many people saved an item is ever shown.
 */
(function(){
  if (window.SMESave) return;
  var BM = '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>';
  var ICON = '<svg viewBox="0 0 24 24" aria-hidden="true">' + BM + '</svg>';
  var ICON_OK = '<svg viewBox="0 0 24 24" aria-hidden="true">' + BM + '<path d="m9 10 2 2 4-4"/></svg>';
  var ICON_MINUS = '<svg viewBox="0 0 24 24" aria-hidden="true">' + BM + '<line x1="15" x2="9" y1="10" y2="10"/></svg>';
  var STORE = 'smeSavedDemo';
  var here = (location.pathname.split('/').pop() || '');

  /* ---- where the button goes ---- */
  // List cards: round button at the card corner (quiet and inline for the podcast card, which has no free corner).
  var CARDS = [
    { sel: 'a.group[href="public-article.html"], a.result[data-type="article"]', type: 'article', pad: 'result' },
    { sel: 'a.group[href="public-guide.html"], a.result[data-type="guide"]', type: 'guide', pad: 'result' },
    { sel: 'a.group[href="public-resource.html"], a.result[data-type="resource"]', type: 'resource', pad: 'result' },
    { sel: 'article.reveal[class*="rounded-2xl"]', type: 'event', file: 'events.html' },
    { sel: 'a.episode-card', type: 'podcast', inline: '.play-btn' },
    { sel: 'a.card-lift[href="single-discussion.html"]', type: 'discussion', pad: 'always' }
  ];
  // Single pages: the pill under the title.
  var PAGES = {
    'public-article.html': { type: 'article', mt: 16, mb: 0 },
    'public-guide.html': { type: 'guide', mt: 16, mb: 0 },
    'public-resource.html': { type: 'resource', mt: 12, mb: 0 },
    'public-podcast-episode.html': { type: 'podcast', mt: 14, mb: 0, dark: true },
    'event-single-online.html': { type: 'event', mt: 20, mb: 0, dark: true },
    'event-single-in-person.html': { type: 'event', mt: 20, mb: 0, dark: true },
    'single-discussion.html': { type: 'discussion', mt: -8, mb: 24 }
  };
  // Community posts: quiet Save in the action row, and the "..." menu item adopted.
  var POSTS = [
    { art: 'article[class*="stripe-"], article.reveal', bar: 'button[onclick^="toggleLike("], button[onclick^="like("], #like-btn', menu: '[id^="pm-"] button[onclick*="\'save\'"]' }
  ];

  function view(){
    if (window.SME_VISITOR_VIEW) return 'visitor';
    if (window.SME_MEMBER_PAGE) return 'member';
    if (window.SMESave && window.SMESave.forceView) return window.SMESave.forceView;
    try {
      var q = (location.search.match(/[?&]as=(member|visitor)\b/) || [])[1];
      if (q) return q;
      return sessionStorage.getItem('smeViewAs') || 'visitor';
    } catch (_) { return 'visitor'; }
  }
  function load(){ try { return JSON.parse(localStorage.getItem(STORE) || '{}') || {}; } catch (_) { return {}; } }
  function store(o){ try { localStorage.setItem(STORE, JSON.stringify(o)); } catch (_) {} }
  function slug(s){ return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60); }
  function txt(el){ return el ? (el.firstChild && el.firstChild.nodeType === 3 ? el.firstChild.textContent : el.textContent).replace(/\s+/g, ' ').trim() : ''; }

  function btn(kind, extra){
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('data-sv', '');
    b.setAttribute('aria-pressed', 'false');
    if (kind === 'round') { b.className = 'sv sv-round' + (extra || ''); b.setAttribute('data-round', ''); b.setAttribute('aria-label', 'Save'); b.innerHTML = ICON; }
    else if (kind === 'bar') { b.className = 'sv sv-ghost sv-bar'; b.setAttribute('data-round', ''); b.setAttribute('aria-label', 'Save'); b.innerHTML = ICON + '<span class="lbl">Save</span>'; }
    else { b.className = 'sv' + (extra || ''); b.innerHTML = ICON + '<span class="lbl">Save</span>'; }
    return b;
  }

  function cardKey(card, type){
    var t = card.querySelector('h3') || card.querySelector('p.truncate') || card.querySelector('h2');
    return type + '|' + slug(txt(t) || card.getAttribute('href') || '');
  }
  function postKey(art){
    var m = art.querySelector('[id^="pm-"]');
    if (m) return 'post|' + m.id;
    var p = art.querySelector('p[class*="leading-relaxed"]') || art.querySelector('p');
    return 'post|' + slug(txt(p)).slice(0, 40);
  }

  function decorate(){
    // cards
    CARDS.forEach(function(r){
      if (r.file && r.file !== here) return;
      var list; try { list = document.querySelectorAll(r.sel); } catch (_) { return; }
      list.forEach(function(card){
        if (card.__sv) return; card.__sv = 1;
        var b;
        if (r.inline) {
          var tgt = card.querySelector(r.inline);
          if (!tgt || !tgt.parentNode) return;
          var g = document.createElement('span'); g.className = 'sv-grp';
          tgt.parentNode.insertBefore(g, tgt); b = btn('round', ' sv-flat'); g.appendChild(b); g.appendChild(tgt);
        } else {
          var f = card.firstElementChild, host = card;
          if (f && f.querySelector && f.querySelector('img') && /relative/.test(f.className)) host = f;
          host.classList.add('sv-rel');
          if (r.pad === 'always' || (r.pad === 'result' && card.classList.contains('result'))) card.classList.add('sv-pad');
          var slot = document.createElement('div'); slot.className = 'sv-slot';
          b = btn('round'); slot.appendChild(b); host.appendChild(slot);
        }
        b.setAttribute('data-sv-type', r.type);
        b.__card = card; b.__rule = r;
      });
    });
    // single page pill
    var P = PAGES[here];
    if (P) {
      var h = document.querySelector('h1');
      if (h && !h.__sv) {
        h.__sv = 1;
        var row = document.createElement('div'); row.className = 'sv-row';
        row.style.margin = P.mt + 'px 0 ' + P.mb + 'px';
        var pb = btn('pill', P.dark ? ' sv-dark' : '');
        pb.setAttribute('data-sv-type', P.type); pb.__h1 = h; pb.__page = P;
        row.appendChild(pb); h.parentNode.insertBefore(row, h.nextSibling);
      }
    }
    // community posts
    POSTS.forEach(function(r){
      var arts; try { arts = document.querySelectorAll(r.art); } catch (_) { return; }
      arts.forEach(function(art){
        if (art.__sv) return;
        var like = art.querySelector(r.bar); if (!like || !like.parentNode) return;
        art.__sv = 1;
        var bb = btn('bar'); bb.setAttribute('data-sv-type', 'post'); bb.__post = art;
        like.parentNode.appendChild(bb);
      });
      var items; try { items = document.querySelectorAll(r.menu); } catch (_) { items = []; }
      items.forEach(function(it){
        if (it.__svm) return;
        var art = it.closest('article'); if (!art) return;
        it.__svm = 1;
        it.removeAttribute('onclick'); it.setAttribute('data-sv-menu', ''); it.setAttribute('data-sv-type', 'post'); it.setAttribute('role', 'menuitem');
        it.className = 'sv-menu'; it.setAttribute('aria-pressed', 'false');
        it.innerHTML = ICON + '<span class="lbl">Save post</span>';
        it.__post = art;
      });
    });
    sync();
  }

  function keyOf(b){
    if (b.__card) return cardKey(b.__card, b.__rule.type);
    if (b.__h1) return b.__page.type + '|' + slug(txt(b.__h1));
    if (b.__post) return postKey(b.__post);
    return null;
  }
  function label(b, on){
    var l = b.querySelector('.lbl');
    var isMenu = b.hasAttribute('data-sv-menu');
    if (l) l.textContent = isMenu ? (on ? 'Remove from Saved' : 'Save post') : (on ? 'Saved' : 'Save');
    if (b.hasAttribute('data-round')) b.setAttribute('aria-label', on ? 'Remove from Saved' : 'Save');
  }
  function sync(){
    var st = load();
    document.querySelectorAll('[data-sv],[data-sv-menu]').forEach(function(b){
      var k = keyOf(b); if (!k) return;
      var on = !!st[k];
      if ((b.getAttribute('aria-pressed') === 'true') !== on) b.setAttribute('aria-pressed', on ? 'true' : 'false');
      label(b, on);
    });
  }

  /* ---- toast + sign in prompt ---- */
  var TT = null, LAST = null;
  function toastEl(){
    var h = document.getElementById('sv-toast');
    if (!h) { h = document.createElement('div'); h.id = 'sv-toast'; h.className = 'sv-toast'; h.hidden = true; h.setAttribute('role', 'status'); h.setAttribute('aria-live', 'polite'); document.body.appendChild(h); }
    return h;
  }
  function toast(kind){
    var h = toastEl(); clearTimeout(TT);
    h.hidden = false; h.classList.remove('in'); void h.offsetWidth; h.classList.add('in');
    if (kind === 'saved') h.innerHTML = '<div class="sv-toast-box"><span style="color:#FF9900;display:inline-flex">' + ICON_OK + '</span><span class="t">Saved.</span><a class="sv-toast-act" href="saved.html">View your saved items</a></div>';
    else h.innerHTML = '<div class="sv-toast-box">' + ICON_MINUS + '<span class="t">Removed.</span><button type="button" class="sv-toast-act" data-sv-undo>Undo</button></div>';
    var u = h.querySelector('[data-sv-undo]');
    if (u) u.onclick = function(){ if (LAST) setState(LAST, true); h.hidden = true; };
    TT = setTimeout(function(){ h.hidden = true; }, 6000);
  }
  var AUTH = 'public-auth.html?redirect_to=' + encodeURIComponent(here || 'index.html');
  var JOIN = 'public-auth.html?join=1&redirect_to=' + encodeURIComponent(here || 'index.html');
  function closeSignin(){
    var s = document.getElementById('sv-sheet'), p = document.getElementById('sv-pop');
    if (s) s.hidden = true;
    if (p) p.hidden = true;
  }
  function openSignin(b){
    if (window.innerWidth < 640) {
      var s = document.getElementById('sv-sheet');
      if (!s) {
        s = document.createElement('div'); s.id = 'sv-sheet'; s.className = 'sv-sheet'; s.setAttribute('role', 'dialog'); s.setAttribute('aria-modal', 'true'); s.setAttribute('aria-labelledby', 'sv-sheet-t');
        s.innerHTML = '<div class="bg"></div><div class="sv-panel"><div class="sv-grab"></div><div class="sv-ico">' + ICON + '</div><h2 id="sv-sheet-t" class="sv-h">Sign in to save</h2><p class="sv-p">Keep this for later. Your saved items follow you to every device.</p><a class="sv-cta" href="' + AUTH + '">Sign in</a><a class="sv-cta2" href="' + JOIN + '">Join SME South Africa</a><button type="button" class="sv-later">Not now</button></div>';
        s.querySelector('.bg').onclick = closeSignin; s.querySelector('.sv-later').onclick = closeSignin;
        document.body.appendChild(s);
      }
      s.hidden = false; var f = s.querySelector('.sv-cta'); if (f) f.focus();
      return;
    }
    var p = document.getElementById('sv-pop');
    if (!p) {
      p = document.createElement('div'); p.id = 'sv-pop'; p.className = 'sv-pop'; p.setAttribute('role', 'dialog'); p.setAttribute('aria-labelledby', 'sv-pop-t');
      p.innerHTML = '<p id="sv-pop-t" class="sv-h">Sign in to save</p><p class="sv-p">Keep this for later, on any device.</p><a class="sv-cta" href="' + AUTH + '">Sign in</a><a class="sv-cta2" href="' + JOIN + '">Join SME South Africa</a><button type="button" class="sv-later">Not now</button>';
      p.querySelector('.sv-later').onclick = closeSignin;
      document.body.appendChild(p);
    }
    p.hidden = false;
    var r = b.getBoundingClientRect();
    var left = Math.max(12, Math.min(window.scrollX + r.left, window.scrollX + window.innerWidth - p.offsetWidth - 12));
    p.style.left = left + 'px'; p.style.top = (window.scrollY + r.bottom + 8) + 'px';
  }

  function setState(key, on){
    var st = load(); if (on) st[key] = 1; else delete st[key]; store(st); sync();
  }

  document.addEventListener('click', function(e){
    var b = e.target.closest && e.target.closest('[data-sv],[data-sv-menu]');
    if (b) {
      e.preventDefault(); e.stopPropagation();
      if (b.disabled) return;
      var isMenu = b.hasAttribute('data-sv-menu');
      if (isMenu) { var m = b.closest('[role="menu"]'); if (m) m.classList.add('hidden'); }
      if (view() === 'visitor') { closeSignin(); openSignin(isMenu ? (b.closest('article') || b) : b); return; }
      var key = keyOf(b); if (!key) return;
      var on = b.getAttribute('aria-pressed') !== 'true';
      LAST = on ? null : key;
      b.classList.add('is-busy');
      setTimeout(function(){ b.classList.remove('is-busy'); setState(key, on); toast(on ? 'saved' : 'removed'); }, 250);
      return;
    }
    var p = document.getElementById('sv-pop');
    if (p && !p.hidden && !e.target.closest('#sv-pop')) p.hidden = true;
  }, true);
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeSignin(); });

  var timer = null;
  function schedule(){ clearTimeout(timer); timer = setTimeout(decorate, 60); }
  window.SMESave = { decorate: decorate, sync: sync, view: view, toast: toast };
  decorate();
  try { new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true }); } catch (_) {}
  window.addEventListener('load', decorate);
})();
