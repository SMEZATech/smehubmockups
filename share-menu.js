/*
 * Share menu (mockup, 2026-10-09). Shared by single-discussion.html ("Share Topic") and member-hub.html (the Share button on a post).
 * Any element with data-mock-share (and optional data-title, data-public="0" for members-only content) opens the menu.
 *
 * Design: Repost (one tap, with Undo, like X), Share to my timeline (optional comment), Send to connections (search, up to 10, optional message),
 * Copy link, and the outside channels (WhatsApp, LinkedIn, X, Facebook, Email). Members-only content (a group, a private forum) offers only
 * Send and Copy. Implementation notes for the developer:
 *   - every share is counted per channel on the item (post meta / activity meta `smec_shares`) and sent to GA4 as the recommended "share" event
 *     (method = channel, content_type = topic|post, item_id); outside links carry utm_source=sme_community&utm_medium=share&utm_campaign=<channel>;
 *   - a repost / timeline share is a normal feed post with the link, a link card and a marker (`smec_repost_of` = "topic:ID" or "post:ID");
 *   - "Send" delivers a private message with the link to connections only, ten at most; the same item can be reposted once per ten minutes.
 */
(function () {
  'use strict';
  var PEOPLE = ['Aisha Patel', 'Thabo Nkosi', 'Lerato Dlamini', 'Sipho Mokoena', 'Nomsa Khumalo', 'Pieter van Wyk', 'Zanele Mthembu', 'Kagiso Sithole'];
  var BRAND = {
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-[#25D366]"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-[#0A66C2]"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-slate-700"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-[#1877F2]"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/></svg>'
  };
  var lu = function (n) { return '<i data-lucide="' + n + '" class="w-4 h-4 text-slate-500"></i>'; };
  var toast = function (m, k) { if (typeof showToast === 'function') showToast(m, k); };
  var icons = function () { if (window.lucide && lucide.createIcons) lucide.createIcons(); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var menu = null;

  function close() { if (menu) { menu.remove(); menu = null; } }
  function sheet(html) {
    var old = document.getElementById('mock-share-sheet'); if (old) old.remove();
    var m = document.createElement('div');
    m.id = 'mock-share-sheet';
    m.style.cssText = 'position:fixed;inset:0;z-index:9998;background:rgba(12,31,49,.45);display:flex;align-items:flex-end;justify-content:center;padding:0';
    m.innerHTML = '<div style="background:#fff;width:100%;max-width:448px;border-radius:16px 16px 0 0;box-shadow:0 20px 60px rgba(0,0,0,.3);max-height:88vh;display:flex;flex-direction:column" class="sm:rounded-2xl">' + html + '</div>';
    m.addEventListener('click', function (e) { if (e.target === m || e.target.closest('[data-x]')) m.remove(); });
    if (window.innerWidth >= 640) { m.style.alignItems = 'center'; m.style.padding = '16px'; m.firstChild.style.borderRadius = '16px'; }
    document.body.appendChild(m); icons(); return m;
  }
  var head = function (t) { return '<div class="flex items-center justify-between px-5 pt-5 pb-3"><h3 class="font-jakarta font-extrabold text-lg text-[#0C1F31]">' + t + '</h3><button type="button" data-x class="w-8 h-8 grid place-items-center rounded-full text-slate-500 hover:bg-slate-100" aria-label="Close"><i data-lucide="x" class="w-4 h-4"></i></button></div>'; };
  var preview = function (title) { return '<div class="mx-5 mb-3 rounded-xl border border-[#E7EBEF] bg-slate-50 px-4 py-3"><p class="text-[10px] font-bold uppercase tracking-widest text-slate-400">Shared item</p><p class="font-jakarta font-bold text-[14px] text-[#0C1F31] leading-snug mt-0.5">' + esc(title) + '</p></div>'; };

  function timeline(title) {
    var m = sheet(head('Share to your timeline') + '<div class="px-5"><textarea rows="3" placeholder="Add your thoughts (optional)" class="w-full rounded-xl border border-[#E7EBEF] p-3 text-[14.5px] outline-none focus:border-[#DC183C] resize-none"></textarea></div><div class="pt-3">' + preview(title) + '</div>' +
      '<div class="px-5 pb-5 flex justify-end gap-2"><button type="button" data-x class="h-10 px-4 rounded-lg font-bold text-sm text-slate-500 hover:bg-slate-100">Cancel</button><button type="button" id="mk-go" class="h-10 px-5 rounded-lg bg-[#DC183C] hover:bg-[#B0142F] text-white font-bold text-sm">Post to my timeline</button></div>');
    m.querySelector('#mk-go').onclick = function () { m.remove(); toast('Shared to your timeline.', 'win'); };
  }
  function send(title) {
    var sel = {};
    var m = sheet(head('Send to your connections') + preview(title) +
      '<div class="px-5 pb-2"><input type="search" id="mk-q" placeholder="Search your connections" class="w-full h-10 rounded-full border border-[#E7EBEF] px-4 text-sm outline-none focus:border-[#DC183C]"></div><div id="mk-list" class="overflow-y-auto" style="max-height:34vh"></div>' +
      '<div class="px-5 pt-3"><input placeholder="Add a message (optional)" class="w-full h-10 rounded-lg border border-[#E7EBEF] px-3 text-sm outline-none focus:border-[#DC183C]"></div>' +
      '<div class="px-5 py-4 flex justify-end gap-2"><button type="button" data-x class="h-10 px-4 rounded-lg font-bold text-sm text-slate-500 hover:bg-slate-100">Cancel</button><button type="button" id="mk-go" disabled class="h-10 px-5 rounded-lg bg-[#DC183C] hover:bg-[#B0142F] text-white font-bold text-sm" style="opacity:.4">Send</button></div>');
    function paint() {
      var q = m.querySelector('#mk-q').value.toLowerCase();
      m.querySelector('#mk-list').innerHTML = PEOPLE.filter(function (n) { return n.toLowerCase().indexOf(q) > -1; }).map(function (n) {
        var on = !!sel[n], ini = n.split(' ').map(function (w) { return w[0]; }).join('');
        return '<button type="button" data-p="' + esc(n) + '" class="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-slate-50 text-left"><span class="w-9 h-9 rounded-full bg-gradient-to-br from-[#DC183C] to-[#FF9900] grid place-items-center font-jakarta font-bold text-white text-[13px]">' + ini + '</span><span class="flex-1 font-jakarta font-bold text-[14px] text-[#0C1F31]">' + esc(n) + '</span><span class="w-5 h-5 rounded-full border-2 grid place-items-center ' + (on ? 'bg-[#DC183C] border-[#DC183C] text-white' : 'border-slate-300') + '">' + (on ? '<i data-lucide="check" class="w-3 h-3"></i>' : '') + '</span></button>';
      }).join('');
      var n = Object.keys(sel).length, go = m.querySelector('#mk-go');
      go.disabled = !n; go.style.opacity = n ? '1' : '.4'; go.textContent = n ? 'Send to ' + n + (n === 1 ? ' connection' : ' connections') : 'Send';
      icons();
    }
    paint();
    m.querySelector('#mk-q').oninput = paint;
    m.addEventListener('click', function (e) { var b = e.target.closest('[data-p]'); if (!b) return; var n = b.getAttribute('data-p'); if (sel[n]) delete sel[n]; else if (Object.keys(sel).length < 10) sel[n] = 1; paint(); });
    m.querySelector('#mk-go').onclick = function () { var c = Object.keys(sel).length; m.remove(); toast('Sent to ' + c + (c === 1 ? ' connection.' : ' connections.'), 'win'); };
  }
  function undoBar(msg) {
    var el = document.createElement('div');
    el.style.cssText = 'position:fixed;left:50%;bottom:26px;transform:translateX(-50%);z-index:99999;background:#0C1F31;color:#fff;font:600 13px Inter,system-ui,sans-serif;padding:11px 14px 11px 18px;border-radius:10px;box-shadow:0 8px 28px rgba(12,31,49,.22);display:flex;gap:14px;align-items:center';
    el.innerHTML = '<span>' + msg + '</span><button type="button" style="background:none;border:0;color:#FF9900;font:700 13px Inter,system-ui,sans-serif;cursor:pointer">Undo</button>';
    el.querySelector('button').onclick = function () { el.remove(); toast('Repost removed.'); };
    document.body.appendChild(el); setTimeout(function () { el.remove(); }, 7000);
  }

  function open(btn) {
    close();
    var title = btn.getAttribute('data-title') || 'Business advise';
    var pub = btn.getAttribute('data-public') !== '0';
    var row = function (a, ic, l) { return '<button type="button" data-a="' + a + '" class="w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 flex items-center gap-2.5 text-[#121A21]">' + ic + '<span>' + l + '</span></button>'; };
    var html = (pub ? row('repost', lu('repeat-2'), 'Repost') + row('timeline', lu('pen-line'), 'Share to my timeline&hellip;') : '') + row('send', lu('send'), 'Send to connections&hellip;') +
      '<div class="border-t border-slate-100 my-1"></div>' + row('copy', lu('link'), 'Copy link') +
      (pub ? row('whatsapp', BRAND.whatsapp, 'WhatsApp') + row('linkedin', BRAND.linkedin, 'LinkedIn') + row('x', BRAND.x, 'X') + row('facebook', BRAND.facebook, 'Facebook') + row('email', lu('mail'), 'Email') : '');
    menu = document.createElement('div');
    menu.id = 'mock-share-menu';
    menu.className = 'bg-white border border-slate-100 rounded-xl shadow-xl py-1.5';
    menu.style.cssText = 'position:absolute;z-index:60;width:240px';
    menu.innerHTML = html;
    var r = btn.getBoundingClientRect();
    menu.style.left = Math.max(8, Math.min(window.innerWidth - 248, r.right + window.scrollX - 240)) + 'px';
    menu.style.top = (r.top + window.scrollY - 8) + 'px';
    menu.style.transform = 'translateY(-100%)';
    document.body.appendChild(menu); icons();
    menu.addEventListener('click', function (e) {
      var b = e.target.closest('[data-a]'); if (!b) return;
      var a = b.getAttribute('data-a'); close();
      if (a === 'timeline') return timeline(title);
      if (a === 'send') return send(title);
      if (a === 'repost') return undoBar('Reposted to your timeline.');
      if (a === 'copy') return toast('Link copied to clipboard', 'win');
      toast('Opens ' + { whatsapp: 'WhatsApp', linkedin: 'LinkedIn', x: 'X', facebook: 'Facebook', email: 'your email app' }[a] + ' with the link', null);
    });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-mock-share]');
    if (b) { e.preventDefault(); e.stopPropagation(); open(b); return; }
    if (menu && !e.target.closest('#mock-share-menu')) close();
  });
})();
