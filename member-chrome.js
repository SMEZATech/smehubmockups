/*
 * Logged-in state for the PUBLIC header and mobile tab bar.
 *
 * Shows what a signed-in member sees on pages outside the community area
 * (insights, resources, funding, shop, glossary and so on): the same content
 * navigation, but "Sign in / Join Now" are replaced by a way back into the member
 * area (My Business button, notifications, avatar menu), and the mobile tab bar's
 * "Sign Up" tab becomes "My Business".
 *
 * Preview only. State lives in sessionStorage:
 *   ?as=member   switch this tab to the logged-in view (remembered while browsing)
 *   ?as=visitor  switch back
 * A small "Viewing as" switch is shown while reviewing (localhost, ?review=all, or
 * after ?as= has been used), so it never appears to normal visitors.
 *
 * Include after the page's own scripts:  <script src="member-chrome.js"></script>
 */
(function(){
  var KEY = 'smeViewAs';
  var USER = { name: 'Tshepho Joel', initials: 'TJ', role: 'Founder at Langa Holdings' };

  var mode = 'visitor';
  var explicit = false;
  try {
    var q = (location.search.match(/[?&]as=(member|visitor)\b/) || [])[1];
    if (q) { sessionStorage.setItem(KEY, q); explicit = true; }
    mode = sessionStorage.getItem(KEY) || 'visitor';
    if (sessionStorage.getItem('smeReviewAll') === '1') explicit = true;
  } catch (_) {}
  var host = location.hostname;
  var reviewing = explicit || mode === 'member' || location.protocol === 'file:' || host === 'localhost' || host === '127.0.0.1';

  /*
   * Signed-in members never use the public funding hub: its Apply buttons and the hub itself send them to the
   * same screens inside My Business (the live site does this with a 302 for logged-in visitors only).
   * Logged-out visitors and search engines keep the public page.
   */
  if (mode === 'member') {
    var _page = (location.pathname.split('/').pop() || '');
    if (_page === 'public-funding.html') {
      var _apply = /[?&]apply=1/.test(location.search) || location.hash === '#apply';
      location.replace('member-workspace.html#' + (_apply ? 'funding-new' : 'funding-options'));
      return;
    }
    document.addEventListener('click', function(e){
      var a = e.target.closest && e.target.closest('a[href]');
      if (!a) return;
      var h = a.getAttribute('href') || '';
      if (!/^public-funding\.html/.test(h)) return;
      e.preventDefault();
      location.href = 'member-workspace.html#' + (/[?&]apply=1|#apply/.test(h) ? 'funding-new' : 'funding-options');
    }, true);
  }

  function el(html){ var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }
  function icons(){ if (window.lucide && lucide.createIcons) lucide.createIcons(); }

  function setMode(next){
    try { sessionStorage.setItem(KEY, next); } catch (_) {}
    location.reload();
  }
  window.smeSetViewAs = setMode;

  /* ---------- preview switch (review only) ---------- */
  function mountSwitch(){
    var framed = false;
    try { framed = window.top !== window.self; } catch (_) { framed = true; }
    if (framed || !reviewing || document.getElementById('smeViewAsSwitch')) return;
    var on = mode === 'member';
    var sw = el(
      '<button type="button" id="smeViewAsSwitch" class="fixed left-3 bottom-[72px] lg:bottom-4 z-[55] bg-[#0C1F31]/90 text-white rounded-full shadow-lg pl-2.5 pr-3 h-7 flex items-center gap-1.5 text-[10.5px] font-bold hover:bg-[#0C1F31]" aria-label="Preview as ' + (on ? 'visitor' : 'member') + '" title="Tap to switch the preview">' +
        '<span class="w-1.5 h-1.5 rounded-full ' + (on ? 'bg-[#29A37A]' : 'bg-[#FF9900]') + '"></span>' +
        '<span class="text-white/55 uppercase tracking-widest text-[8.5px]">Viewing as</span>' + (on ? 'Member' : 'Visitor') +
      '</button>');
    sw.addEventListener('click', function(){ setMode(mode === 'member' ? 'visitor' : 'member'); });
    document.body.appendChild(sw);
  }

  if (mode !== 'member') { mountSwitch(); return; }

  /* a signed-in member's home is the community, not the marketing homepage */
  if (/public-home\.html$/.test(location.pathname)) { location.replace('member-hub.html'); return; }

  /* ---------- member header ---------- */
  var header = document.querySelector('header');
  if (!header) { mountSwitch(); return; }

  var avatar = function(size){
    return '<span class="rounded-full bg-gradient-to-br from-[#DC183C] to-[#FF9900] grid place-items-center font-jakarta font-extrabold text-white shrink-0" style="width:' + size + 'px;height:' + size + 'px;font-size:' + Math.round(size * 0.38) + 'px">' + USER.initials + '</span>';
  };

  var item = function(href, icon, label, hint){
    return '<a href="' + href + '" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#DC183C] transition">' +
      '<i data-lucide="' + icon + '" class="w-4 h-4 shrink-0 text-slate-400"></i><span class="flex-1">' + label + '</span>' + (hint ? '<span class="text-[11px] font-medium text-slate-400">' + hint + '</span>' : '') + '</a>';
  };

  var cluster = el(
    '<div id="smeMemberCluster" class="flex items-center gap-1 sm:gap-2">' +
      '<a href="member-workspace.html" class="hidden md:inline-flex items-center gap-2 px-4 h-9 rounded-full text-sm font-bold text-white bg-[#0C1F31] hover:bg-[#16314a] transition"><i data-lucide="layout-dashboard" class="w-4 h-4"></i>My Business</a>' +
      '<div class="relative">' +
        '<button type="button" id="smeBellBtn" aria-label="Notifications" aria-expanded="false" class="relative w-9 h-9 grid place-items-center rounded-full hover:bg-slate-100 text-slate-600"><i data-lucide="bell" class="w-[18px] h-[18px]"></i><span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#DC183C] ring-2 ring-white"></span></button>' +
        '<div id="smeBellMenu" class="hidden fixed left-3 right-3 top-[68px] sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-80 bg-white rounded-2xl border border-[#E7EBEF] shadow-xl z-40 overflow-hidden">' +
          '<div class="flex items-center justify-between px-4 py-3 border-b border-[#E7EBEF]"><p class="font-jakarta font-extrabold text-sm">Notifications</p><a href="member-hub.html" class="text-[11px] font-bold text-[#DC183C] hover:underline">Open Community</a></div>' +
          '<a href="member-hub.html" class="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition"><span class="w-9 h-9 rounded-xl bg-[#FDECEF] text-[#DC183C] grid place-items-center shrink-0"><i data-lucide="message-circle" class="w-4 h-4"></i></span><span><span class="block text-[13px] font-bold leading-tight">Sipho replied to your post</span><span class="block text-xs text-slate-500 mt-0.5">Invoice finance worked for us</span></span></a>' +
          '<a href="member-workspace.html" class="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition"><span class="w-9 h-9 rounded-xl bg-[#E4F5EE] text-[#29A37A] grid place-items-center shrink-0"><i data-lucide="trending-up" class="w-4 h-4"></i></span><span><span class="block text-[13px] font-bold leading-tight">Your Success Plan has a new action</span><span class="block text-xs text-slate-500 mt-0.5">Open My Business to see it</span></span></a>' +
          '<a href="events.html" class="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition"><span class="w-9 h-9 rounded-xl bg-[#FFF1E0] text-[#AE6B0A] grid place-items-center shrink-0"><i data-lucide="calendar-days" class="w-4 h-4"></i></span><span><span class="block text-[13px] font-bold leading-tight">Webinar starting soon</span><span class="block text-xs text-slate-500 mt-0.5">Cash flow for small teams</span></span></a>' +
        '</div>' +
      '</div>' +
      '<div class="relative">' +
        '<button type="button" id="smeAvatarBtn" aria-label="Account menu" aria-expanded="false" class="flex items-center gap-1.5 pl-0.5 pr-1.5 h-9 rounded-full hover:bg-slate-100 transition">' + avatar(32) + '<i data-lucide="chevron-down" class="w-3.5 h-3.5 text-slate-500 hidden sm:block"></i></button>' +
        '<div id="smeAvatarMenu" class="hidden fixed left-3 right-3 top-[68px] sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-64 bg-white rounded-2xl border border-[#E7EBEF] shadow-xl z-40 p-2">' +
          '<div class="flex items-center gap-3 px-3 py-3 border-b border-[#E7EBEF] mb-1">' + avatar(40) + '<div class="min-w-0"><p class="font-jakarta font-extrabold text-sm leading-tight truncate">' + USER.name + '</p><p class="text-xs text-slate-500 truncate">' + USER.role + '</p></div></div>' +
          item('member-workspace.html', 'layout-dashboard', 'My Business') +
          item('member-hub.html', 'users', 'Community') +
          item('members.html', 'user-round-search', 'Connect') +
          item('events.html', 'calendar-days', 'Events') +
          item('member-account.html', 'circle-user', 'Account settings') +
          item('public-help.html', 'life-buoy', 'Help Centre') +
          '<div class="border-t border-[#E7EBEF] mt-1 pt-1"><button type="button" onclick="smeSetViewAs(\'visitor\')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#DC183C] transition text-left"><i data-lucide="log-out" class="w-4 h-4 shrink-0 text-slate-400"></i>Sign out</button></div>' +
        '</div>' +
      '</div>' +
    '</div>');

  /* replace "Sign in" + "Join Now" in the header's right-hand cluster */
  var signIn = header.querySelector('a[href="public-auth.html"].hidden');
  var joinNow = header.querySelector('a[href="public-auth.html#join"]');
  if (joinNow) {
    joinNow.parentNode.insertBefore(cluster, joinNow);
    joinNow.remove();
    if (signIn) signIn.remove();
  } else if (signIn) {
    signIn.parentNode.insertBefore(cluster, signIn);
    signIn.remove();
  }

  /* burger panel: label the content links, swap the trailing "Sign in" row for member links */
  var panel = header.querySelector('#chromeBurgerPanel nav');
  var panelSignIn = header.querySelector('#chromeBurgerPanel a[href="public-auth.html"]');
  var lbl = function(t){ return '<p class="px-2 pt-4 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">' + t + '</p>'; };
  var mk = function(href, icon, label){ return '<a href="' + href + '" class="flex items-center gap-3 px-2 py-3 text-sm font-semibold text-slate-700 hover:text-[#DC183C] border-b border-slate-100"><i data-lucide="' + icon + '" class="w-4 h-4 text-slate-400"></i>' + label + '</a>'; };
  if (panel) {
    panel.insertBefore(el(lbl('Explore').replace('pt-4', 'pt-2')), panel.firstChild);
    var member = el('<div>' + lbl('Your space') + mk('member-hub.html', 'home', 'Home (Community)') + mk('members.html', 'user-round-search', 'Connect') + mk('events.html', 'calendar-days', 'Events') + mk('member-workspace.html', 'sparkles', 'My Business') + mk('member-account.html', 'circle-user', 'Account settings') + '<button type="button" onclick="smeSetViewAs(\'visitor\')" class="w-full flex items-center gap-3 px-2 py-3 text-sm font-semibold text-slate-700 hover:text-[#DC183C] text-left"><i data-lucide="log-out" class="w-4 h-4 text-slate-400"></i>Sign out</button></div>');
    if (panelSignIn) { panelSignIn.remove(); }
    while (member.firstChild) panel.appendChild(member.firstChild);
  }

  /* mobile bottom tab bar for members: Home (community), Connect, Events, My Business, Account */
  var tabBar = document.querySelector('nav[aria-label="Quick nav"]');
  if (tabBar) {
    var here = (location.pathname.split('/').pop() || '');
    var T = [
      ['member-hub.html', 'home', 'Home'],
      ['members.html', 'users', 'Connect'],
      ['events.html', 'calendar-days', 'Events'],
      ['member-workspace.html', 'sparkles', 'My Business'],
      ['member-account.html', 'circle-user', 'Account']
    ];
    tabBar.innerHTML = '<div class="grid grid-cols-5">' + T.map(function(t){
      var on = here === t[0];
      return '<a href="' + t[0] + '" class="relative flex flex-col items-center justify-center gap-1 py-2.5 transition ' + (on ? 'text-[#DC183C]' : 'text-slate-500 hover:text-[#121A21]') + '">' +
        (on ? '<span class="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[#DC183C]"></span>' : '') +
        '<i data-lucide="' + t[1] + '" class="w-5 h-5"></i><span class="font-jakarta text-[11px] font-bold">' + t[2] + '</span></a>';
    }).join('') + '</div>';
  }

  /* for a member the home page is the community: every Home link goes to the hub */
  document.querySelectorAll('a[href="public-home.html"]').forEach(function(a){ a.setAttribute('href', 'member-hub.html'); });

  /* menus */
  var pairs = [['smeBellBtn', 'smeBellMenu'], ['smeAvatarBtn', 'smeAvatarMenu']];
  function closeAll(except){
    pairs.forEach(function(p){
      if (p[1] === except) return;
      var m = document.getElementById(p[1]), b = document.getElementById(p[0]);
      if (m) m.classList.add('hidden');
      if (b) b.setAttribute('aria-expanded', 'false');
    });
  }
  pairs.forEach(function(p){
    var b = document.getElementById(p[0]), m = document.getElementById(p[1]);
    if (!b || !m) return;
    b.addEventListener('click', function(e){
      e.stopPropagation();
      closeAll(p[1]);
      var open = m.classList.toggle('hidden') === false;
      b.setAttribute('aria-expanded', String(open));
    });
  });
  document.addEventListener('click', function(e){ if (!e.target.closest('#smeMemberCluster')) closeAll(); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeAll(); });

  icons();
  mountSwitch();
})();
