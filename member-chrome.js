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
  if (window.SME_MEMBER_PAGE) { mode = 'member'; }
  var host = location.hostname;
  var reviewing = explicit || mode === 'member' || location.protocol === 'file:' || host === 'localhost' || host === '127.0.0.1';

  /*
   * Signed-in members never use the public funding hub: its Apply buttons and the hub itself send them to the
   * same screens inside My Business (the live site does this with a 302 for logged-in visitors only).
   * Logged-out visitors and search engines keep the public page.
   */
  /* Pages that live inside My Business for a signed-in member: the hub page and every link to it go there instead
   * (single guides, stories and episodes stay on their own pages, with the member header). */
  var MB = { 'podcast.html': 'podcast', 'public-guides.html': 'guides', 'public-founder-focus-category.html': 'stories',
             'public-resources.html': 'resources', 'events.html': 'programmes', 'public-solutions.html': 'solutions',
             'public-solution-categories.html': 'solutions', 'public-workspace.html': 'overview' };
  if (mode === 'member') {
    var _p0 = (location.pathname.split('/').pop() || '');
    if (MB[_p0] && !window.SME_MEMBER_PAGE) { location.replace('member-workspace.html#' + MB[_p0]); return; }
  }
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
      var hf = h.split(/[?#]/)[0];
      if (MB[hf]) { e.preventDefault(); location.href = 'member-workspace.html#' + MB[hf]; return; }
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
  if (!window.SME_MEMBER_PAGE && /public-home\.html$/.test(location.pathname)) { location.replace('member-hub.html'); return; }

  /* ---------- ONE member header, same on every signed-in page (2026-10-02) ----------
   * Desktop and the mobile tab bar: Home, Connect, Messaging, Notifications, My Business. My Account is in the avatar menu.
   * Replaces whatever header the page shipped with, so community pages and public pages can never drift apart. */
  var oldHeader = document.querySelector('header');
  if (!oldHeader) { mountSwitch(); return; }

  var unread = { messaging: 3, notifications: 4 };
  try { if (sessionStorage.getItem('smeInbox') === 'empty') unread.messaging = 0; var nfm = sessionStorage.getItem('smeNotifs'); if (nfm === 'empty' || nfm === 'few') unread.notifications = 0; } catch (_) {}
  var NAV = [
    ['home', 'member-hub.html', 'home', 'Home'],
    ['connect', 'members.html', 'users', 'Connect'],
    ['messaging', 'member-messages.html', 'message-square', 'Messaging'],
    ['notifications', 'member-notifications.html', 'bell', 'Notifications'],
    ['business', 'member-workspace.html', 'sparkles', 'My Business']
  ];
  var ACCOUNT = ['account', 'member-account.html', 'circle-user', 'My Account'];
  var PAGE_KEY = {
    'member-hub.html': 'home', 'single-post.html': 'home',
    'members.html': 'connect', 'groups.html': 'connect', 'single-group.html': 'connect', 'single-member.html': 'connect',
    'forums.html': 'connect', 'single-discussion.html': 'connect', 'member-group-manage.html': 'connect',
    'member-messages.html': 'messaging', 'member-notifications.html': 'notifications',
    'member-workspace.html': 'business', 'member-account.html': 'account', 'member-finish-profile.html': 'account'
  };
  var here = (location.pathname.split('/').pop() || '');
  var activeKey = PAGE_KEY[here] || '';

  var avatar = function(size){
    return '<span class="rounded-full bg-gradient-to-br from-[#DC183C] to-[#FF9900] grid place-items-center font-jakarta font-extrabold text-white shrink-0" style="width:' + size + 'px;height:' + size + 'px;font-size:' + Math.round(size * 0.36) + 'px">' + USER.initials + '</span>';
  };
  var badge = function(n, cls){ return n ? '<span class="' + (cls || '') + ' min-w-[17px] h-[17px] px-1 rounded-full bg-[#DC183C] text-white text-[10px] font-bold leading-none grid place-items-center">' + n + '</span>' : ''; };
  var mItem = function(href, icon, label, extra){
    return '<a href="' + href + '" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#DC183C] transition"><i data-lucide="' + icon + '" class="w-4 h-4 shrink-0 text-slate-400"></i><span class="flex-1">' + label + '</span>' + (extra || '') + '</a>';
  };
  var group = function(t){ return '<p class="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">' + t + '</p>'; };

  var desk = NAV.map(function(n){
    var on = activeKey === n[0];
    return '<a href="' + n[1] + '" class="relative px-3 h-full text-[14px] font-jakarta flex items-center gap-2 border-b-[3px] transition-colors ' + (on ? 'font-bold text-[#DC183C] border-[#DC183C]' : 'font-semibold text-[#6A7581] hover:text-[#DC183C] border-transparent') + '"' + (on ? ' aria-current="page"' : '') + '>' +
      '<i data-lucide="' + n[2] + '" class="w-4 h-4"></i>' + n[3] + badge(unread[n[0]], 'ml-0.5') + '</a>';
  }).join('');

  var headerHTML =
    '<header id="smeMemberHeader" class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm relative">' +
      '<div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">' +
        '<a href="member-hub.html" class="flex items-center shrink-0 py-2"><img src="assets/logo-v1-lockup.svg" alt="SME South Africa" class="h-[42px] lg:h-[50px] w-auto"></a>' +
        '<nav aria-label="Main" class="hidden md:flex items-center justify-center gap-1 flex-1 h-full">' + desk + '</nav>' +
        '<div id="smeMemberCluster" class="flex items-center gap-1 sm:gap-2 shrink-0">' +
          '<button type="button" id="smeSearchBtn" aria-label="Search" class="w-9 h-9 grid place-items-center rounded-full hover:bg-slate-100 text-slate-600"><i data-lucide="search" class="w-[18px] h-[18px]"></i></button>' +
          '<div class="relative">' +
            '<button type="button" id="smeAvatarBtn" aria-label="Account menu" aria-expanded="false" class="flex items-center gap-2 pl-0.5 pr-1.5 h-9 rounded-full hover:bg-slate-100 transition">' + avatar(32) + '<span class="hidden lg:block font-jakarta font-bold text-[14px]">' + USER.name.split(' ')[0] + '</span><i data-lucide="chevron-down" class="w-3.5 h-3.5 text-slate-400"></i></button>' +
            '<div id="smeAvatarMenu" class="hidden fixed left-3 right-3 top-[68px] sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-72 bg-white rounded-2xl border border-[#E7EBEF] shadow-xl z-50 p-2 max-h-[80vh] overflow-y-auto">' +
              '<div class="flex items-center gap-3 px-3 py-3 border-b border-[#E7EBEF] mb-1">' + avatar(40) + '<div class="min-w-0"><p class="font-jakarta font-extrabold text-sm leading-tight truncate">' + USER.name + '</p><p class="text-xs text-slate-500 truncate">' + USER.role + '</p></div></div>' +
              mItem('member-account.html', 'circle-user', 'My Account') +
              mItem('member-account.html', 'receipt', 'Orders') +
              group('Explore') +
              mItem('public-articles.html', 'newspaper', 'Insights') +
              mItem('member-workspace.html#guides', 'book-open', 'Guides') +
              mItem('member-workspace.html#resources', 'folder-open', 'Library') +
              mItem('member-workspace.html#solutions', 'layout-grid', 'Solutions') +
              mItem('member-workspace.html#programmes', 'calendar-days', 'Events') +
              mItem('member-workspace.html#podcast', 'mic', 'Podcast') +
              mItem('public-help.html', 'life-buoy', 'Help Centre') +
              '<div class="border-t border-[#E7EBEF] mt-2 pt-1">' +
                (typeof window.toggleDevMode === 'function' ? '<div class="flex items-center justify-between px-3 py-2.5"><span class="text-[10px] font-bold uppercase tracking-widest text-slate-500">Dev Mode</span><button id="devToggle" type="button" onclick="toggleDevMode()" class="w-8 h-4 rounded-full bg-slate-200 relative transition-colors focus:outline-none" aria-pressed="false"><span class="absolute left-0.5 top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200"></span></button></div>' : '') +
                '<button type="button" onclick="smeSetViewAs(\'visitor\')" class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-[#DC183C] hover:bg-[#FDECEF] transition"><i data-lucide="log-out" class="w-4 h-4 shrink-0"></i> Sign out</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div id="smeSearchBar" class="hidden absolute inset-0 bg-white z-50 items-center px-4 sm:px-6"><form action="public-search.html" class="w-full max-w-3xl mx-auto flex items-center gap-3"><i data-lucide="search" class="w-5 h-5 text-slate-400 shrink-0"></i><input id="smeSearchInput" name="q" placeholder="Search members, groups, guides, solutions..." class="flex-1 h-12 bg-transparent text-base outline-none"><button type="button" id="smeSearchClose" aria-label="Close search" class="w-9 h-9 grid place-items-center rounded-full hover:bg-slate-100 text-slate-500"><i data-lucide="x" class="w-5 h-5"></i></button></form></div>' +
    '</header>';
  var newHeader = el(headerHTML);
  oldHeader.parentNode.replaceChild(newHeader, oldHeader);

  /* mobile bottom tab bar: the same five as the desktop nav */
  var tabBar = document.querySelector('nav[aria-label="Quick nav"]');
  if (!tabBar) {
    tabBar = el('<nav aria-label="Quick nav"></nav>');
    document.body.appendChild(tabBar);
  }
  var T = NAV;  /* five only: My Account lives in the avatar menu (Joel, 2026-10-02: six was too many) */
  tabBar.className = 'md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#E7EBEF] shadow-[0_-4px_16px_-4px_rgba(12,31,49,0.08)]';
  tabBar.style.paddingBottom = 'env(safe-area-inset-bottom)';
  tabBar.innerHTML = '<div class="grid grid-cols-5">' + T.map(function(t){
    var on = activeKey === t[0];
    return '<a href="' + t[1] + '" class="relative flex flex-col items-center justify-center gap-1 py-2.5 min-w-0 transition ' + (on ? 'text-[#DC183C]' : 'text-slate-500 hover:text-[#121A21]') + '">' +
      (on ? '<span class="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[#DC183C]"></span>' : '') +
      '<span class="relative"><i data-lucide="' + t[2] + '" class="w-5 h-5"></i>' + badge(unread[t[0]], 'absolute -top-1.5 -right-2.5 !min-w-[15px] !h-[15px] !text-[9px] ring-2 ring-white') + '</span>' +
      '<span class="font-jakarta text-[10.5px] font-bold tracking-tight leading-none whitespace-nowrap max-w-full truncate">' + t[3].replace('My Account', 'Account') + '</span></a>';
  }).join('') + '</div>';

  /* for a member the home page is the community: every Home link goes to the hub */
  document.querySelectorAll('a[href="public-home.html"]').forEach(function(a){ a.setAttribute('href', 'member-hub.html'); });

  /* menus + search */
  var menuBtn = document.getElementById('smeAvatarBtn'), menu = document.getElementById('smeAvatarMenu');
  menuBtn.addEventListener('click', function(e){ e.stopPropagation(); var open = menu.classList.toggle('hidden') === false; menuBtn.setAttribute('aria-expanded', String(open)); });
  document.addEventListener('click', function(e){ if (!e.target.closest('#smeAvatarMenu') && !e.target.closest('#smeAvatarBtn')) { menu.classList.add('hidden'); menuBtn.setAttribute('aria-expanded', 'false'); } });
  var bar = document.getElementById('smeSearchBar');
  function searchOpen(on){ bar.classList.toggle('hidden', !on); bar.classList.toggle('flex', on); if (on) setTimeout(function(){ document.getElementById('smeSearchInput').focus(); }, 60); }
  document.getElementById('smeSearchBtn').addEventListener('click', function(){ searchOpen(true); });
  document.getElementById('smeSearchClose').addEventListener('click', function(){ searchOpen(false); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') { searchOpen(false); menu.classList.add('hidden'); } });

  icons();
  mountSwitch();
})();
