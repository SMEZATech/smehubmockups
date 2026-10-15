/*
 * Member and visitor chrome for every mockup page.
 *
 * Member (signed in): ONE header on every signed-in page, drawn here (replaces whatever header the page shipped with).
 *   Desktop (LinkedIn order, block 2 below): logo + open search box | Hub, My Network, Inbox, Notifications, Me | Explore.
 *   Phones (below 768 px, live 13-14 Oct 2026): [back arrow on inner pages] logo, a search field, Inbox, bell with badge, avatar.
 *   Phone bottom bar: Hub, Network, + Post (round centre), Inbox, Profile. No My Business link anywhere (Joel, 2026-10-13).
 * Visitor (signed out): on phones the page header becomes the live 60 px visitor header (logo, Sign in, Sign up, menu button)
 *   with a full-width menu drawer (search, accordions, chips, sign-up card); bottom bar Home, Insights, Sign up (centre), Funding,
 *   Resources (live order, smesa_hub_visitor_tabbar). Desktop public headers are left as each page ships them.
 *
 * Preview only. State lives in sessionStorage:
 *   ?as=member   switch this tab to the logged-in view (remembered while browsing)
 *   ?as=visitor  switch back
 * Page flags (set before this script): window.SME_MEMBER_PAGE (community page, always member), window.SME_VISITOR_VIEW (a member page
 *   shown as a signed-out visitor sees it: the whole header becomes the public visitor header).
 * Demo switches: ?photo=none (member without a profile photo: + Post goes to the photo upload), ?orders=1 (member with an order).
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
  if (window.SME_VISITOR_VIEW) { mode = 'visitor'; }
  var host = location.hostname;
  var reviewing = explicit || mode === 'member' || location.protocol === 'file:' || host === 'localhost' || host === '127.0.0.1';
  var NOPHOTO = /[?&]photo=none\b/.test(location.search);

  function el(html){ var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }
  function icons(){ if (window.lucide && lucide.createIcons) lucide.createIcons(); }
  var here = (location.pathname.split('/').pop() || '');

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
      '<button type="button" id="smeViewAsSwitch" class="fixed left-3 bottom-[84px] md:bottom-4 z-[55] bg-[#0C1F31]/90 text-white rounded-full shadow-lg pl-2.5 pr-3 h-7 flex items-center gap-1.5 text-[10.5px] font-bold hover:bg-[#0C1F31]" aria-label="Preview as ' + (on ? 'visitor' : 'member') + '" title="Tap to switch the preview">' +
        '<span class="w-1.5 h-1.5 rounded-full ' + (on ? 'bg-[#29A37A]' : 'bg-[#FF9900]') + '"></span>' +
        '<span class="text-white/55 uppercase tracking-widest text-[8.5px]">Viewing as</span>' + (on ? 'Member' : 'Visitor') +
      '</button>');
    sw.addEventListener('click', function(){
      if (window.SME_VISITOR_VIEW) { location.href = location.pathname.split('/').pop() + location.search.replace(/([?&])view=visitor&?/, '$1').replace(/[?&]$/, ''); return; }
      setMode(mode === 'member' ? 'visitor' : 'member');
    });
    document.body.appendChild(sw);
  }

  /* =====================================================================================================================
   * VISITOR CHROME (phones): live smesa_hub_visitor_header() + smesa_hub_visitor_drawer() + smesa_hub_visitor_tabbar(),
   * drawn in the new brand. On SME_VISITOR_VIEW pages the desktop header is replaced too (a member page seen signed out).
   * ===================================================================================================================== */
  function visitorChrome(){
    var oldHeader = document.querySelector('body > header') || document.querySelector('header');
    if (!oldHeader || document.getElementById('smeVisitorHeader')) return;
    var full = !!window.SME_VISITOR_VIEW;

    var css = document.createElement('style');
    css.id = 'smeVhCss';
    css.textContent = [
      '#smeVisitorHeader, #smeVhDrawer, #smeVhBackdrop { display: none; }',
      '@media (max-width: 767px) {',
      ' header.sme-vh-old { display: none !important; }',
      ' #smeVisitorHeader { display: block; position: sticky; top: 0; z-index: 45; background: #fff; border-bottom: 1px solid #E7EBEF; transition: transform .22s ease, box-shadow .22s ease; }',
      ' #smeVisitorHeader.is-hidden { transform: translateY(-100%); }',
      ' #smeVisitorHeader.is-raised { box-shadow: 0 4px 16px rgba(12,31,49,.08); }',
      ' #smeVhBackdrop:not([hidden]) { display: block; }',
      ' #smeVhDrawer:not([hidden]) { display: flex; }',
      '}',
      '#smeVhBackdrop { position: fixed; inset: 0; z-index: 98; background: rgba(12,31,49,.45); opacity: 0; transition: opacity .22s ease; }',
      '#smeVhBackdrop.is-open { opacity: 1; }',
      '#smeVhDrawer { flex-direction: column; position: fixed; top: 0; right: 0; bottom: 0; width: 100%; max-width: 440px; z-index: 99; background: #fff; transform: translateX(100%); transition: transform .24s cubic-bezier(.2,.8,.2,1); }',
      '#smeVhDrawer.is-open { transform: translateX(0); }',
      '.vh-sub[hidden] { display: none; }',
      '.vh-top[aria-expanded="true"] .vh-chev { transform: rotate(180deg); }',
      '.vh-chev { transition: transform .2s; }',
      'body.vh-lock { overflow: hidden; }',
      full ? '@media (min-width: 768px) { header.sme-vh-old { display: none !important; } #smeVisitorDesk { display: block !important; } }' : '',
      '#smeVisitorDesk { display: none; }'
    ].join('\n');
    document.head.appendChild(css);
    oldHeader.classList.add('sme-vh-old');

    var signUp = 'public-auth.html#join', signIn = 'public-auth.html';
    var phoneHeader = el(
      '<header id="smeVisitorHeader" role="banner"><div class="h-[60px] px-4 flex items-center gap-2">' +
        '<a href="public-home.html" class="flex items-center shrink-0 h-11" aria-label="SME South Africa, home"><img src="assets/logo-v1-lockup.svg" alt="SME South Africa" class="h-[34px] w-auto"></a>' +
        '<div class="ml-auto flex items-center gap-1">' +
          '<a href="' + signIn + '" class="h-11 px-3 inline-flex items-center rounded-full font-jakarta font-bold text-[14px] text-[#121A21] hover:bg-slate-100">Sign in</a>' +
          '<a href="' + signUp + '" class="h-11 inline-flex items-center"><span class="h-9 px-4 inline-flex items-center rounded-full bg-[#DC183C] hover:bg-[#B0142F] text-white font-jakarta font-bold text-[14px]">Sign up</span></a>' +
          '<button type="button" id="smeVhBurger" aria-expanded="false" aria-controls="smeVhDrawer" aria-label="Open menu" class="w-11 h-11 grid place-items-center rounded-xl text-[#0C1F31] hover:bg-slate-100"><i data-lucide="menu" class="w-6 h-6"></i></button>' +
        '</div>' +
      '</div></header>');

    /* the site's signed-out menu (live: WordPress menu "signed-out-menu"), each with its one-line description */
    var MENU = [
      ['Start', 'Ideas, planning, compliance and first steps', 'public-category.html', [['Business ideas', 'public-subcategory.html'], ['Business planning', 'public-subcategory.html'], ['Registration and compliance', 'public-subcategory.html'], ['First steps', 'public-subcategory.html']]],
      ['Manage', 'Skills, people, legal, tax and operations', 'public-category.html', [['Skills', 'public-subcategory.html'], ['People and HR', 'public-subcategory.html'], ['Legal', 'public-subcategory.html'], ['Tax', 'public-subcategory.html'], ['Operations', 'public-subcategory.html']]],
      ['Grow', 'Sales, marketing, online selling and leadership', 'public-category.html', [['Sales', 'public-subcategory.html'], ['Marketing', 'public-subcategory.html'], ['Online selling', 'public-subcategory.html'], ['Leadership', 'public-subcategory.html']]],
      ['Funding', 'Loans and finance options, compared', 'public-funding.html', [['Invoice Finance', 'public-loan-option.html'], ['Inventory Finance', 'public-loan-option.html'], ['Unsecured Business Loan', 'public-loan-option.html'], ['Purchase Order Funding', 'public-loan-option.html'], ['Bridging Finance', 'public-loan-option.html'], ['Working Capital Loans', 'public-loan-option.html']]],
      ['Solutions', 'Business tools and services, reviewed', 'public-solutions.html', []],
      ['Resources', 'eBooks, templates, guides and reports', 'public-resources.html', [['Ebooks', 'public-resource-category.html?type=ebooks'], ['Templates', 'public-resource-category.html?type=templates'], ['Guides', 'public-resource-category.html?type=guides'], ['Reports', 'public-resource-category.html?type=reports']]]
    ];
    var nav = MENU.map(function(m, i){
      var label = '<span class="flex-1 min-w-0 text-left"><b class="block font-jakarta font-bold text-[16px] text-[#121A21]">' + m[0] + '</b><small class="block text-[13px] text-[#6A7581] mt-0.5">' + m[1] + '</small></span>';
      if (!m[3].length) return '<li class="border-b border-[#E7EBEF]"><a class="vh-top flex items-center gap-3 min-h-[60px] py-2.5" href="' + m[2] + '">' + label + '<i data-lucide="arrow-right" class="w-5 h-5 text-[#6A7581]"></i></a></li>';
      var sub = '<li><a class="vh-all flex items-center justify-between min-h-[44px] px-3 rounded-lg bg-[#FDECEF] font-bold text-[14px] text-[#DC183C]" href="' + m[2] + '">All ' + m[0].toLowerCase() + ' <i data-lucide="arrow-right" class="w-4 h-4"></i></a></li>' +
        m[3].map(function(k){ return '<li><a class="flex items-center min-h-[44px] px-3 rounded-lg text-[14px] font-semibold text-[#121A21] hover:bg-slate-50 hover:text-[#DC183C]" href="' + k[1] + '">' + k[0] + '</a></li>'; }).join('');
      return '<li class="border-b border-[#E7EBEF]"><button type="button" class="vh-top w-full flex items-center gap-3 min-h-[60px] py-2.5" aria-expanded="false" aria-controls="vh-sub-' + i + '">' + label + '<span class="vh-chev text-[#6A7581]"><i data-lucide="chevron-down" class="w-5 h-5"></i></span></button><ul class="vh-sub pb-3 space-y-0.5" id="vh-sub-' + i + '" hidden>' + sub + '</ul></li>';
    }).join('');
    var chips = [['Podcast', 'podcast.html'], ['Events', 'events.html'], ['Founder Focus', 'public-founder-focus-category.html'], ['Guides', 'public-guides.html'], ['Glossary', 'public-glossary.html'], ['Help centre', 'public-help.html']].map(function(c){
      return '<a href="' + c[1] + '" class="inline-flex items-center h-11 px-4 rounded-full border border-[#E7EBEF] text-[14px] font-semibold text-[#121A21] hover:border-[#DC183C] hover:text-[#DC183C]">' + c[0] + '</a>';
    }).join('');
    var foot = [['About', 'public-about.html'], ['Advertise', 'public-advertise.html'], ['Contact', 'public-contact.html'], ['Privacy', 'public-privacy.html'], ['Terms', 'public-terms.html']].map(function(c){
      return '<a href="' + c[1] + '" class="inline-flex items-center min-h-[44px] px-1 hover:text-[#DC183C]">' + c[0] + '</a>';
    }).join('');
    var backdrop = el('<div id="smeVhBackdrop" hidden></div>');
    var drawer = el(
      '<div id="smeVhDrawer" role="dialog" aria-modal="true" aria-label="Menu" hidden>' +
        '<div class="h-[60px] px-4 flex items-center justify-between border-b border-[#E7EBEF] shrink-0"><a href="public-home.html" class="h-11 flex items-center"><img src="assets/logo-v1-lockup.svg" alt="SME South Africa" class="h-[34px] w-auto"></a>' +
          '<button type="button" id="smeVhClose" aria-label="Close menu" class="w-11 h-11 grid place-items-center rounded-xl text-[#0C1F31] hover:bg-slate-100"><i data-lucide="x" class="w-6 h-6"></i></button></div>' +
        '<div class="flex-1 overflow-y-auto overscroll-contain px-4 pb-8">' +
          '<form action="public-search.html" role="search" class="relative mt-4"><i data-lucide="search" class="w-5 h-5 text-[#6A7581] absolute left-4 top-1/2 -translate-y-1/2"></i><input type="search" name="q" enterkeyhint="search" autocomplete="off" placeholder="Search articles, guides and funding" aria-label="Search articles, guides and funding" class="w-full h-12 pl-12 pr-4 rounded-full border border-[#E7EBEF] bg-[#F4F6F8] text-[16px] outline-none focus:border-[#DC183C] focus:bg-white"></form>' +
          '<ul class="mt-2">' + nav + '</ul>' +
          '<p class="mt-6 mb-2 text-[11px] font-bold uppercase tracking-widest text-[#6A7581]">More from SME South Africa</p><div class="flex flex-wrap gap-2">' + chips + '</div>' +
          '<div class="mt-6 rounded-2xl bg-[#0C1F31] text-white p-5 relative overflow-hidden"><div class="absolute inset-0 opacity-50 pointer-events-none" style="background:radial-gradient(circle at 90% 10%, #DC183C 0%, transparent 60%)"></div>' +
            '<b class="relative block font-jakarta font-extrabold text-[18px] leading-snug">Join South Africa&rsquo;s small-business community</b><p class="relative text-[14px] text-white/75 mt-1.5">Connect with founders, ask for advice and find funding that fits your business.</p>' +
            '<a href="' + signUp + '" class="relative mt-4 flex items-center justify-center h-12 rounded-full bg-[#DC183C] hover:bg-[#B0142F] font-jakarta font-bold">Sign up</a><a href="' + signIn + '" class="relative mt-2 flex items-center justify-center h-12 rounded-full border border-white/30 font-jakarta font-bold">Sign in</a></div>' +
          '<p class="mt-5 flex flex-wrap gap-x-4 text-[13px] font-semibold text-[#6A7581]">' + foot + '</p>' +
        '</div>' +
      '</div>');

    oldHeader.parentNode.insertBefore(phoneHeader, oldHeader);
    document.body.appendChild(backdrop);
    document.body.appendChild(drawer);

    if (full) {
      var desk = el(
        '<header id="smeVisitorDesk" class="bg-white border-b border-[#E7EBEF] sticky top-0 z-30"><div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">' +
          '<a href="public-home.html" class="flex items-center shrink-0"><img src="assets/logo-v1-lockup.svg" alt="SME South Africa" class="h-[42px] lg:h-[50px] w-auto"></a>' +
          '<nav aria-label="Main" class="hidden lg:flex items-center gap-1 ml-auto">' +
            [['Start', 'public-category.html'], ['Manage', 'public-category.html'], ['Grow', 'public-category.html'], ['Funding', 'public-funding.html'], ['Solutions', 'public-solutions.html'], ['Resources', 'public-resources.html']].map(function(x){ return '<a href="' + x[1] + '" class="px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-[#121A21] hover:bg-slate-100">' + x[0] + '</a>'; }).join('') +
          '</nav>' +
          '<div class="flex items-center gap-2 ml-auto lg:ml-3"><a href="' + signIn + '" class="inline-flex items-center px-3 h-10 rounded-full text-sm font-bold text-[#121A21] hover:bg-slate-100">Sign in</a><a href="' + signUp + '" class="inline-flex items-center px-4 h-10 rounded-full text-sm font-bold text-white bg-[#DC183C] hover:bg-[#B0142F]">Sign up</a></div>' +
        '</div></header>');
      phoneHeader.parentNode.insertBefore(desk, phoneHeader);
    }

    var burger = document.getElementById('smeVhBurger'), lastFocus = null;
    function openDrawer(on){
      if (on) {
        lastFocus = document.activeElement;
        drawer.hidden = false; backdrop.hidden = false;
        requestAnimationFrame(function(){ drawer.classList.add('is-open'); backdrop.classList.add('is-open'); });
        document.body.classList.add('vh-lock');
        burger.setAttribute('aria-expanded', 'true');
        setTimeout(function(){ var c = document.getElementById('smeVhClose'); if (c) c.focus(); }, 60);
      } else {
        drawer.classList.remove('is-open'); backdrop.classList.remove('is-open');
        document.body.classList.remove('vh-lock');
        burger.setAttribute('aria-expanded', 'false');
        setTimeout(function(){ drawer.hidden = true; backdrop.hidden = true; }, 240);
        if (lastFocus && lastFocus.focus) lastFocus.focus();
      }
    }
    burger.addEventListener('click', function(){ openDrawer(true); });
    document.getElementById('smeVhClose').addEventListener('click', function(){ openDrawer(false); });
    backdrop.addEventListener('click', function(){ openDrawer(false); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && !drawer.hidden) openDrawer(false); });
    [].forEach.call(drawer.querySelectorAll('button.vh-top'), function(b){
      b.addEventListener('click', function(){
        var sub = document.getElementById(b.getAttribute('aria-controls')), open = b.getAttribute('aria-expanded') !== 'true';
        b.setAttribute('aria-expanded', String(open)); sub.hidden = !open;
      });
    });
    /* the header slides away while scrolling down and returns on the way up (live) */
    var lastY = window.scrollY;
    window.addEventListener('scroll', function(){
      var y = window.scrollY;
      phoneHeader.classList.toggle('is-hidden', y > 120 && y > lastY && drawer.hidden);
      phoneHeader.classList.toggle('is-raised', y > 4);
      lastY = y;
    }, { passive: true });

    /* bottom bar: Home | Insights | Sign up (centre) | Funding | Resources */
    var tabBar = document.querySelector('nav[aria-label="Quick nav"]');
    if (!tabBar) { tabBar = el('<nav aria-label="Quick nav"></nav>'); document.body.appendChild(tabBar); }
    var cur = /public-home/.test(here) ? 'home'
      : /public-article|public-category|public-subcategory|public-founder-focus|public-author|public-tag/.test(here) ? 'insights'
      : /public-funding|public-loan-option/.test(here) ? 'funding'
      : /public-resource/.test(here) ? 'resources'
      : /public-auth/.test(here) && /join/.test(location.hash) ? 'join' : '';
    var T = [['home', 'public-home.html', 'house', 'Home'], ['insights', 'public-articles.html', 'newspaper', 'Insights'], ['join', signUp, 'plus', 'Sign up'], ['funding', 'public-funding.html', 'banknote', 'Funding'], ['resources', 'public-resources.html', 'folder-open', 'Resources']];
    tabBar.className = 'md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#E7EBEF] shadow-[0_-4px_16px_-4px_rgba(12,31,49,0.08)]';
    tabBar.style.paddingBottom = 'env(safe-area-inset-bottom)';
    tabBar.innerHTML = '<div class="grid grid-cols-5">' + T.map(function(t){
      var on = cur === t[0];
      if (t[0] === 'join') {
        return '<a href="' + t[1] + '" class="flex flex-col items-center justify-end gap-1 pb-2 min-h-[56px] ' + (on ? 'text-[#DC183C]' : 'text-[#121A21]') + '"' + (on ? ' aria-current="page"' : '') + '><span class="w-11 h-11 -mt-5 rounded-full bg-[#DC183C] text-white grid place-items-center border-[3px] border-white shadow-[0_4px_12px_rgba(220,24,60,.35)]"><i data-lucide="plus" class="w-5 h-5"></i></span><span class="font-jakarta text-[11px] font-bold leading-none">' + t[3] + '</span></a>';
      }
      return '<a href="' + t[1] + '" class="relative flex flex-col items-center justify-center gap-1 min-h-[56px] ' + (on ? 'text-[#DC183C]' : 'text-slate-500 hover:text-[#121A21]') + '"' + (on ? ' aria-current="page"' : '') + '>' +
        (on ? '<span class="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[#DC183C]"></span>' : '') +
        '<i data-lucide="' + t[2] + '" class="w-[22px] h-[22px]"></i><span class="font-jakarta text-[11px] font-bold leading-none">' + t[3] + '</span></a>';
    }).join('') + '</div>';
    icons();
  }

  if (mode !== 'member') { visitorChrome(); mountSwitch(); return; }

  /* a signed-in member's home is the community, not the marketing homepage */
  if (!window.SME_MEMBER_PAGE && /public-home\.html$/.test(location.pathname)) { location.replace('member-hub.html'); return; }

  /* =====================================================================================================================
   * MEMBER CHROME: one header on every signed-in page. Labels as live since 14 Oct: Hub, Network, Inbox, Notifications.
   * ===================================================================================================================== */
  var oldHeader = document.querySelector('header');
  if (!oldHeader) { mountSwitch(); return; }

  var unread = { messaging: 3, notifications: 4 };
  try { if (sessionStorage.getItem('smeInbox') === 'empty') unread.messaging = 0; var nfm = sessionStorage.getItem('smeNotifs'); if (nfm === 'empty' || nfm === 'few') unread.notifications = 0; } catch (_) {}
  var PROFILE_URL = 'single-member.html';
  var NAV = [
    ['home', 'member-hub.html', 'home', 'Hub'],
    ['connect', 'members.html', 'users', 'Network'],
    ['messaging', 'member-messages.html', 'message-square', 'Inbox'],
    ['notifications', 'member-notifications.html', 'bell', 'Notifications']
  ];
  var PAGE_KEY = {
    'member-hub.html': 'home', 'single-post.html': 'home',
    'members.html': 'connect', 'groups.html': 'connect', 'single-group.html': 'connect', 'single-member.html': 'connect',
    'forums.html': 'connect', 'single-discussion.html': 'connect', 'member-group-manage.html': 'connect',
    'member-messages.html': 'messaging', 'member-inbox.html': 'messaging', 'member-me.html': 'profile', 'member-funding.html': 'account', 'member-notifications.html': 'notifications',
    'member-account.html': 'account', 'member-finish-profile.html': 'account'
  };
  var ownProfile = here === 'single-member.html' && !/[?&]view=(member|visitor)\b/.test(location.search);
  var activeKey = PAGE_KEY[here] || '';
  if (ownProfile) activeKey = 'profile';
  /* LinkedIn style back arrow on inner pages: never on Hub, Network, Inbox or your own profile (live, CL-447) */
  var ROOTS = { 'member-hub.html': 1, 'members.html': 1, 'member-messages.html': 1, 'member-inbox.html': 1 };
  var inner = !ROOTS[here] && !ownProfile && here !== '' && here !== 'index.html';

  var avatar = function(size){
    return '<span class="rounded-full bg-gradient-to-br from-[#DC183C] to-[#FF9900] grid place-items-center font-jakarta font-extrabold text-white shrink-0" style="width:' + size + 'px;height:' + size + 'px;font-size:' + Math.round(size * 0.36) + 'px">' + USER.initials + '</span>';
  };
  var badge = function(n, cls){ return n ? '<span class="' + (cls || '') + ' min-w-[17px] h-[17px] px-1 rounded-full bg-[#DC183C] text-white text-[10px] font-bold leading-none grid place-items-center">' + n + '</span>' : ''; };
  var mItem = function(href, icon, label, extra){
    return '<a href="' + href + '" class="flex items-center gap-3 px-3 min-h-[44px] rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-[#DC183C] transition"><i data-lucide="' + icon + '" class="w-4 h-4 shrink-0 text-slate-400"></i><span class="flex-1">' + label + '</span>' + (extra || '') + '</a>';
  };
  var group = function(t){ return '<p class="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">' + t + '</p>'; };

  var desk = NAV.map(function(n){
    var on = activeKey === n[0];
    return '<a href="' + n[1] + '" class="relative px-3 h-full text-[14px] font-jakarta flex items-center gap-2 border-b-[3px] transition-colors ' + (on ? 'font-bold text-[#DC183C] border-[#DC183C]' : 'font-semibold text-[#6A7581] hover:text-[#DC183C] border-transparent') + '"' + (on ? ' aria-current="page"' : '') + '>' +
      '<i data-lucide="' + n[2] + '" class="w-4 h-4"></i>' + n[3] + badge(unread[n[0]], 'ml-0.5') + '</a>';
  }).join('');

  var phIcon = function(href, icon, label, n, on){
    return '<a href="' + href + '" class="md:hidden relative w-11 h-11 grid place-items-center rounded-full shrink-0 ' + (on ? 'text-[#DC183C]' : 'text-slate-600 hover:bg-slate-100') + '" aria-label="' + label + (n ? ' (' + n + ' unread)' : '') + '"' + (on ? ' aria-current="page"' : '') + '><span class="relative"><i data-lucide="' + icon + '" class="w-[22px] h-[22px]"></i>' + badge(n, 'absolute -top-2 -right-2.5 ring-2 ring-white') + '</span></a>';
  };

  var headerHTML =
    '<header id="smeMemberHeader" class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm relative">' +
      '<div class="max-w-7xl mx-auto px-3 sm:px-6 h-14 md:h-16 flex items-center justify-between gap-1.5 md:gap-3">' +
        (inner ? '<button type="button" id="smeBackBtn" aria-label="Back" class="md:hidden w-11 h-11 -ml-1.5 grid place-items-center rounded-full text-[#121A21] hover:bg-slate-100 shrink-0"><i data-lucide="arrow-left" class="w-[22px] h-[22px]"></i></button>' : '') +
        '<a href="member-hub.html" class="flex items-center justify-center shrink-0 min-w-[44px] min-h-[44px]" aria-label="SME South Africa, SME Hub">' +
          (inner ? '<img src="assets/logo-v1-icon.svg" alt="SME South Africa" class="md:hidden h-[34px] w-auto">' : '') +
          '<img src="assets/logo-v1-lockup.svg" alt="SME South Africa" class="' + (inner ? 'hidden md:block ' : '') + 'h-[34px] md:h-[42px] lg:h-[50px] w-auto"></a>' +
        '<nav aria-label="Main" class="hidden md:flex items-center justify-center gap-1 flex-1 h-full">' + desk + '</nav>' +
        /* phones: a search-everything field, then Inbox and the bell with their badges, then the avatar (live, Joel 2026-10-12) */
        '<button type="button" id="smePhSearch" class="md:hidden flex-1 min-w-0 h-11 px-3.5 rounded-full bg-[#EEF2F6] text-[#6A7581] flex items-center gap-2 text-[15px]" aria-label="Search members, articles, funding and more"><i data-lucide="search" class="w-4 h-4 shrink-0"></i><span class="truncate">Search</span></button>' +
        phIcon('member-inbox.html', 'message-square', 'Inbox', unread.messaging, activeKey === 'messaging') +
        phIcon('member-inbox.html#alerts', 'bell', 'Notifications', unread.notifications, activeKey === 'notifications') +
        '<div id="smeMemberCluster" class="flex items-center gap-1 sm:gap-2 shrink-0">' +
          '<button type="button" id="smeSearchBtn" aria-label="Search" class="hidden w-9 h-9 place-items-center rounded-full hover:bg-slate-100 text-slate-600"><i data-lucide="search" class="w-[18px] h-[18px]"></i></button>' +
          '<div class="relative">' +
            '<button type="button" id="smeAvatarBtn" aria-label="Account menu" aria-expanded="false" class="flex items-center justify-center gap-2 min-w-[44px] md:pl-0.5 md:pr-1.5 h-11 md:h-9 rounded-full hover:bg-slate-100 transition">' + avatar(32) + '<span class="hidden lg:block font-jakarta font-bold text-[14px]">' + USER.name.split(' ')[0] + '</span><i data-lucide="chevron-down" class="hidden md:block w-3.5 h-3.5 text-slate-400"></i></button>' +
            '<div id="smeAvatarMenu" class="hidden fixed left-3 right-3 top-[60px] sm:absolute sm:left-auto sm:right-0 sm:top-full sm:mt-2 sm:w-72 bg-white rounded-2xl border border-[#E7EBEF] shadow-xl z-50 p-2 max-h-[80vh] overflow-y-auto">' +
              '<a href="' + PROFILE_URL + '" class="flex items-center gap-3 px-3 py-3 border-b border-[#E7EBEF] mb-1 rounded-lg hover:bg-slate-50">' + avatar(40) + '<div class="min-w-0"><p class="font-jakarta font-extrabold text-sm leading-tight truncate">' + USER.name + '</p><p class="text-xs text-slate-500 truncate">' + USER.role + '</p></div></a>' +
              mItem(PROFILE_URL, 'user-round', 'My profile') +
              mItem('member-account.html', 'circle-user', 'My Account') +
              mItem('saved.html', 'bookmark', 'Saved') +
              (/[?&]orders=1/.test(location.search) ? mItem('member-account.html?orders=1#orders', 'receipt', 'Orders') : '') + // only for members with an order (Joel, 2026-10-13)
              group('Explore') +
              mItem('public-articles.html', 'newspaper', 'Insights') +
              mItem('member-funding.html', 'hand-coins', 'Funding') +
              mItem('member-account.html#guides', 'book-open', 'Guides') +
              mItem('member-account.html#library', 'folder-open', 'Library') +
              mItem('member-account.html#podcast', 'mic', 'Podcast') +
              mItem('member-account.html#stories', 'sparkles', 'Founder stories') +
              mItem('public-solutions.html', 'layout-grid', 'Solutions') +
              mItem('member-account.html#events', 'calendar-days', 'Events') +
              mItem('public-help.html', 'life-buoy', 'Help Centre') +
              '<div class="border-t border-[#E7EBEF] mt-2 pt-1">' +
                (typeof window.toggleDevMode === 'function' ? '<div class="flex items-center justify-between px-3 py-2.5"><span class="text-[10px] font-bold uppercase tracking-widest text-slate-500">Dev Mode</span><button id="devToggle" type="button" onclick="toggleDevMode()" class="w-8 h-4 rounded-full bg-slate-200 relative transition-colors focus:outline-none" aria-pressed="false"><span class="absolute left-0.5 top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200"></span></button></div>' : '') +
                '<button type="button" onclick="smeSetViewAs(\'visitor\')" class="w-full flex items-center gap-3 px-3 min-h-[44px] rounded-lg text-sm font-semibold text-[#DC183C] hover:bg-[#FDECEF] transition"><i data-lucide="log-out" class="w-4 h-4 shrink-0"></i> Sign out</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div id="smeSearchBar" class="hidden absolute inset-0 bg-white z-50 items-center px-3 sm:px-6"><form action="public-search.html" class="w-full max-w-3xl mx-auto flex items-center gap-2"><i data-lucide="search" class="w-5 h-5 text-slate-400 shrink-0 ml-1"></i><input id="smeSearchInput" name="q" type="search" enterkeyhint="search" placeholder="Search members, articles, funding..." class="flex-1 min-w-0 h-12 bg-transparent text-base outline-none"><button type="button" id="smeSearchClose" aria-label="Close search" class="w-11 h-11 grid place-items-center rounded-full hover:bg-slate-100 text-slate-500"><i data-lucide="x" class="w-5 h-5"></i></button></form></div>' +
    '</header>';
  var newHeader = el(headerHTML);
  oldHeader.parentNode.replaceChild(newHeader, oldHeader);

  /* phone bottom bar (live smesa_hub_tabbar): Hub | Network | + Post (centre) | Inbox | Profile.
     A member without a profile photo cannot post: + Post goes to the photo upload instead (live, 2026-10-14). */
  var tabBar = document.querySelector('nav[aria-label="Quick nav"]');
  if (!tabBar) {
    tabBar = el('<nav aria-label="Quick nav"></nav>');
    document.body.appendChild(tabBar);
  }
  var T = [
    ['home', 'member-hub.html', 'home', 'Hub'],
    ['connect', 'members.html', 'users', 'Network'],
    ['post', NOPHOTO ? 'member-account.html?photo=none#profile' : 'member-hub.html?post=1', 'plus', 'Post'],
    ['messaging', 'member-inbox.html', 'message-square', 'Inbox'],
    ['profile', PROFILE_URL, 'user-round', 'Profile']
  ];
  tabBar.className = 'md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-[#E7EBEF] shadow-[0_-4px_16px_-4px_rgba(12,31,49,0.08)]';
  tabBar.setAttribute('aria-label', 'Quick nav');
  tabBar.style.paddingBottom = 'env(safe-area-inset-bottom)';
  tabBar.innerHTML = '<div class="grid grid-cols-5">' + T.map(function(t){
    var on = activeKey === t[0];
    if (t[0] === 'post') {
      return '<a href="' + t[1] + '" id="smePostTab" class="flex flex-col items-center justify-end gap-1 pb-2 min-h-[56px] text-[#121A21]" aria-label="' + (NOPHOTO ? 'Add a profile photo to start posting' : 'Create a post') + '"><span class="w-11 h-11 -mt-5 rounded-full bg-[#DC183C] text-white grid place-items-center border-[3px] border-white shadow-[0_4px_12px_rgba(220,24,60,.35)]"><i data-lucide="plus" class="w-5 h-5"></i></span><span class="font-jakarta text-[11px] font-bold leading-none">Post</span></a>';
    }
    return '<a href="' + t[1] + '" class="relative flex flex-col items-center justify-center gap-1 min-h-[56px] min-w-0 transition ' + (on ? 'text-[#DC183C]' : 'text-slate-500 hover:text-[#121A21]') + '"' + (on ? ' aria-current="page"' : '') + '>' +
      (on ? '<span class="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[#DC183C]"></span>' : '') +
      '<span class="relative"><i data-lucide="' + t[2] + '" class="w-[22px] h-[22px]"></i>' + badge(unread[t[0]], 'absolute -top-1.5 -right-2.5 !min-w-[15px] !h-[15px] !text-[9px] ring-2 ring-white') + '</span>' +
      '<span class="font-jakarta text-[11px] font-bold tracking-tight leading-none whitespace-nowrap max-w-full truncate">' + t[3] + '</span></a>';
  }).join('') + '</div>';
  /* on the hub itself, + Post opens the composer in place (the page exposes window.smeOpenComposer) */
  var postTab = document.getElementById('smePostTab');
  if (postTab && here === 'member-hub.html' && !NOPHOTO && typeof window.smeOpenComposer === 'function') {
    postTab.addEventListener('click', function(e){ e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); window.smeOpenComposer(); });
  }

  /* for a member the home page is the community: every Home link goes to the hub */
  document.querySelectorAll('a[href="public-home.html"]').forEach(function(a){ a.setAttribute('href', 'member-hub.html'); });

  /* back arrow: the previous page, or the hub when there is none */
  var back = document.getElementById('smeBackBtn');
  if (back) back.addEventListener('click', function(){
    var ref = ''; try { ref = document.referrer ? new URL(document.referrer).host : ''; } catch (_) {}
    if (history.length > 1 && ref === location.host) history.back(); else location.href = 'member-hub.html';
  });

  /* menus + search */
  var menuBtn = document.getElementById('smeAvatarBtn'), menu = document.getElementById('smeAvatarMenu');
  menuBtn.addEventListener('click', function(e){ if (window.innerWidth < 768 && !/member-me\.html$/.test(location.pathname)) { e.preventDefault(); location.href = 'member-me.html'; return; } e.stopPropagation(); var open = menu.classList.toggle('hidden') === false; menuBtn.setAttribute('aria-expanded', String(open)); });
  document.addEventListener('click', function(e){ if (!e.target.closest('#smeAvatarMenu') && !e.target.closest('#smeAvatarBtn')) { menu.classList.add('hidden'); menuBtn.setAttribute('aria-expanded', 'false'); } });
  var bar = document.getElementById('smeSearchBar');
  function searchOpen(on){ bar.classList.toggle('hidden', !on); bar.classList.toggle('flex', on); if (on) setTimeout(function(){ document.getElementById('smeSearchInput').focus(); }, 60); }
  document.getElementById('smeSearchBtn').addEventListener('click', function(){ searchOpen(true); });
  document.getElementById('smePhSearch').addEventListener('click', function(){ searchOpen(true); });
  document.getElementById('smeSearchClose').addEventListener('click', function(){ searchOpen(false); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') { searchOpen(false); menu.classList.add('hidden'); } });

  icons();
  mountSwitch();
})();

/* ---------- LinkedIn order on desktop (Joel, 2026-10-13; live on production since 14 Oct, Kago's kago-li-header) ----------
 * Logo + an open search box on the left; on the right Hub | My Network | Inbox | Notifications | Me, a divider, then Explore
 * (LinkedIn's "For Business" place: the Explore links move out of the avatar menu into it; Help Centre stays in the Me menu).
 * Icon above the label. No My Business (Joel removed it from this release). Phones (below 768 px) keep the header above. */
(function(){
  var h = document.getElementById('smeMemberHeader');
  if (!h || h.getAttribute('data-li')) return;
  h.setAttribute('data-li', '1');
  var row = h.firstElementChild, logo = row && row.querySelector('a[href="member-hub.html"]'), nav = row && row.querySelector('nav[aria-label="Main"]');
  var cluster = document.getElementById('smeMemberCluster'), btn = document.getElementById('smeAvatarBtn'), menu = document.getElementById('smeAvatarMenu');
  if (!row || !logo || !nav || !cluster || !btn) return;

  var css = document.createElement('style');
  css.textContent = [
    '.li-find, .li-ex, .li-div { display: none; }',
    '@media (min-width: 768px) {',
    ' #smeMemberHeader[data-li] > div { justify-content: flex-start; gap: 0; }',
    ' #smeMemberHeader[data-li] #smeSearchBtn { display: none !important; }',
    ' .li-find { display: flex; align-items: center; gap: 8px; flex: 0 1 280px; min-width: 120px; height: 38px; margin-left: 10px; padding: 0 14px; border: 1px solid transparent; border-radius: 999px; background: #EEF2F6; color: #6A7581; transition: flex-basis .2s, background .15s, border-color .15s; }',
    ' .li-find:focus-within { flex-basis: 380px; background: #fff; border-color: #DC183C; box-shadow: 0 0 0 3px rgba(220,24,60,.12); }',
    ' .li-find input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; font-size: 14px; color: #121A21; }',
    ' .li-find input::placeholder { color: #6A7581; }',
    ' #smeMemberHeader[data-li] nav[aria-label="Main"] { flex: none; margin-left: auto; justify-content: flex-end; gap: 0; }',
    ' #smeMemberHeader[data-li] nav[aria-label="Main"] > a { flex-direction: column; justify-content: center; gap: 4px; min-width: 92px; padding: 0 14px; font-size: 12px; font-weight: 500; white-space: nowrap; }',
    ' #smeMemberHeader[data-li] nav[aria-label="Main"] > a svg { width: 22px; height: 22px; }',
    ' .li-ico { position: relative; display: inline-flex; }',
    ' .li-ico > span { position: absolute; top: -7px; right: -11px; margin: 0 !important; }',
    ' #smeMemberHeader[data-li] #smeMemberCluster { align-self: stretch; gap: 0; }',
    ' #smeMemberHeader[data-li] #smeMemberCluster > .relative { display: flex; }',
    ' #smeMemberHeader[data-li] #smeAvatarBtn { display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 4px; height: 100%; min-width: 84px; padding: 0 14px; border-radius: 0; background: transparent; color: #6A7581; }',
    ' #smeMemberHeader[data-li] #smeAvatarBtn:hover, #smeMemberHeader[data-li] #smeAvatarBtn[aria-expanded="true"] { color: #DC183C; background: transparent; }',
    ' #smeMemberHeader[data-li] #smeAvatarBtn > span:first-child { width: 22px !important; height: 22px !important; font-size: 9px !important; }',
    ' .li-me { display: inline-flex; align-items: center; gap: 2px; font-size: 12px; font-weight: 500; }',
    ' #smeMemberHeader[data-li] #smeAvatarMenu { top: calc(100% + 1px); margin-top: 0; }',
    ' #smeMemberHeader[data-li] #smeAvatarMenu .li-in-ex { display: none !important; }',
    ' .li-div { display: block; flex: none; width: 1px; height: 40px; align-self: center; margin: 0 10px; background: #E7EBEF; }',
    ' .li-ex { display: flex; position: relative; }',
    ' .li-ex-btn { display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 4px; min-width: 88px; height: 100%; padding: 0 14px; color: #6A7581; font-size: 12px; font-weight: 500; white-space: nowrap; }',
    ' .li-ex-btn:hover, .li-ex-btn[aria-expanded="true"] { color: #DC183C; }',
    ' .li-ex-btn > span { display: inline-flex; align-items: center; gap: 2px; }',
    ' .li-ex-panel { position: absolute; right: 0; top: calc(100% + 1px); width: 372px; padding: 16px; background: #fff; border: 1px solid #E7EBEF; border-radius: 16px; box-shadow: 0 18px 40px rgba(12,31,49,.16); z-index: 60; }',
    ' .li-ex-panel[hidden] { display: none; }',
    ' .li-ex-h { margin: 0 0 10px 4px; font-size: 11px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; color: #121A21; }',
    ' .li-ex-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 4px; }',
    ' .li-ex-grid a { display: flex !important; flex-direction: column; align-items: center; gap: 6px; padding: 12px 6px !important; border-radius: 12px; text-align: center; font-size: 12.5px !important; }',
    ' .li-ex-grid a span { flex: none !important; }',
    ' .li-ex-grid a svg { width: 24px !important; height: 24px !important; color: #DC183C !important; }',
    ' .li-ex-grid a:hover { background: #F1F4F7 !important; }',
    '}',
    '@media (min-width: 1024px) and (max-width: 1239px) {',
    ' #smeMemberHeader[data-li] nav[aria-label="Main"] > a, #smeMemberHeader[data-li] #smeAvatarBtn, .li-ex-btn { min-width: 76px; padding: 0 8px; }',
    '}',
    '@media (min-width: 768px) and (max-width: 1023px) {',
    ' #smeMemberHeader[data-li] nav[aria-label="Main"] > a, #smeMemberHeader[data-li] #smeAvatarBtn, .li-ex-btn { min-width: 52px; padding: 0 6px; }',
    ' .li-lbl, .li-me, .li-ex-btn > span { position: absolute !important; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }',
    ' .li-find { flex-basis: 200px; }',
    '}'
  ].join('\n');
  document.head.appendChild(css);

  // the open search box, next to the logo
  var f = document.createElement('form');
  f.className = 'li-find';
  f.setAttribute('role', 'search');
  f.action = 'public-search.html';
  f.innerHTML = '<i data-lucide="search" class="w-4 h-4 shrink-0"></i><input name="q" type="search" placeholder="Search" aria-label="Search people, groups, discussions, articles and funding" autocomplete="off">';
  logo.insertAdjacentElement('afterend', f);

  // each item: icon (with its badge) above the label; LinkedIn's labels and order
  [].slice.call(nav.children).forEach(function(a){
    var icon = a.querySelector('svg, i'), badge = a.querySelector('span'), text = '';
    [].forEach.call(a.childNodes, function(n){ if (n.nodeType === 3) text += n.textContent; });
    text = text.trim();
    if (text === 'Network' || text === 'Connect') text = 'My Network';
    var ico = document.createElement('span'); ico.className = 'li-ico';
    if (icon) ico.appendChild(icon);
    if (badge) ico.appendChild(badge);
    var lbl = document.createElement('span'); lbl.className = 'li-lbl'; lbl.textContent = text;
    while (a.firstChild) a.removeChild(a.firstChild);
    a.appendChild(ico); a.appendChild(lbl);
  });

  // Me: the photo above "Me ▾"
  var first = btn.querySelector('span.hidden'), chev = btn.lastElementChild;
  if (first) first.remove();
  var me = document.createElement('span'); me.className = 'li-me'; me.textContent = 'Me';
  if (chev && chev !== btn.firstElementChild) { chev.classList.remove('hidden', 'md:block'); me.appendChild(chev); }
  me.classList.add('hidden', 'md:inline-flex');
  btn.appendChild(me);

  // Explore: the avatar menu's Explore links, as tiles (Help Centre stays in the Me menu)
  var exH = [].slice.call(menu ? menu.querySelectorAll('p') : []).filter(function(p){ return p.textContent.trim() === 'Explore'; })[0];
  if (exH) {
    var exLinks = [], n = exH.nextElementSibling;
    while (n && n.tagName === 'A') { if (!/help/i.test(n.textContent)) exLinks.push(n); n = n.nextElementSibling; }
    exH.classList.add('li-in-ex'); exLinks.forEach(function(a){ a.classList.add('li-in-ex'); });
    var div = document.createElement('span'); div.className = 'li-div'; div.setAttribute('aria-hidden', 'true');
    var ex = document.createElement('div'); ex.className = 'li-ex';
    ex.innerHTML = '<button type="button" class="li-ex-btn" aria-haspopup="true" aria-expanded="false"><i data-lucide="layout-grid" class="w-[22px] h-[22px]"></i><span>Explore <i data-lucide="chevron-down" class="w-3 h-3"></i></span></button><div class="li-ex-panel" hidden><p class="li-ex-h">Explore SME South Africa</p><div class="li-ex-grid"></div></div>';
    var grid = ex.querySelector('.li-ex-grid');
    exLinks.forEach(function(a){ var c = a.cloneNode(true); c.classList.remove('li-in-ex'); grid.appendChild(c); });
    cluster.appendChild(div); cluster.appendChild(ex);
    var eb = ex.querySelector('.li-ex-btn'), ep = ex.querySelector('.li-ex-panel');
    eb.addEventListener('click', function(e){ e.stopPropagation(); ep.hidden = !ep.hidden; eb.setAttribute('aria-expanded', String(!ep.hidden)); });
    document.addEventListener('click', function(e){ if (!e.target.closest('.li-ex')) { ep.hidden = true; eb.setAttribute('aria-expanded', 'false'); } });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape') { ep.hidden = true; eb.setAttribute('aria-expanded', 'false'); } });
  }
  if (window.lucide && lucide.createIcons) lucide.createIcons();
})();

/* ---------- Continue listening: podcast mini player docked above the phone bar (live 12 Oct, close fixed) ----------
 * The episode page remembers what is playing (sessionStorage smePodcastNow). On the episode page the mini player appears once the main
 * player scrolls out of view while audio plays; on every other page it offers "Continue listening". Close forgets the episode.
 * Demo on any page with ?mini=1. */
(function(){
  var KEY = 'smePodcastNow', now = null;
  try {
    if (/[?&]mini=1/.test(location.search) && !sessionStorage.getItem(KEY)) sessionStorage.setItem(KEY, JSON.stringify({ n: 11, title: 'How Data Helps Funders Gauge SME Visibility', image: '', t: 754, clock: '35:12' }));
    now = JSON.parse(sessionStorage.getItem(KEY) || 'null');
  } catch (_) {}
  var ep = window.SME_EPISODE_PAGE;
  if (!now && !ep) return;
  var css = document.createElement('style');
  css.textContent = '#smeMini{position:fixed;z-index:44;left:8px;right:8px;bottom:calc(64px + env(safe-area-inset-bottom));transition:transform .2s ease,opacity .2s ease}' +
    '#smeMini[hidden]{display:none}@media (min-width:768px){#smeMini{left:auto;right:16px;bottom:16px;width:380px}}';
  document.head.appendChild(css);
  function mmss(s){ s = Math.max(0, Math.floor(s || 0)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
  var bar = document.createElement('div');
  bar.id = 'smeMini'; bar.setAttribute('role', 'region'); bar.setAttribute('aria-label', 'Continue listening');
  var title = ep ? ep.cur.title : now.title, href = 'public-podcast-episode.html?ep=' + (ep ? ep.cur.n : now.n);
  bar.innerHTML = '<div class="flex items-center gap-2 bg-[#0C1F31] text-white rounded-2xl shadow-[0_10px_30px_rgba(12,31,49,.35)] pl-2 pr-1 py-1.5">' +
    '<span class="w-11 h-11 rounded-xl bg-gradient-to-br from-[#DC183C] to-[#FF9900] grid place-items-center shrink-0"><i data-lucide="mic" class="w-5 h-5"></i></span>' +
    '<a href="' + href + '" class="min-w-0 flex-1 py-1"><span class="block text-[10px] font-bold uppercase tracking-widest text-white/60">' + (ep ? 'Now playing' : 'Continue listening') + '</span><span class="block text-[13px] font-semibold truncate">' + String(title).replace(/</g, '&lt;') + '</span><span id="smeMiniT" class="block text-[11px] text-white/60">' + (ep ? '' : mmss(now.t) + ' of ' + now.clock) + '</span></a>' +
    '<button type="button" id="smeMiniPlay" class="w-11 h-11 rounded-full bg-[#DC183C] grid place-items-center shrink-0" aria-label="' + (ep ? 'Pause' : 'Resume') + '"><i data-lucide="' + (ep ? 'pause' : 'play') + '" class="w-5 h-5 fill-current"></i></button>' +
    '<button type="button" id="smeMiniClose" class="w-11 h-11 grid place-items-center shrink-0 text-white/70 hover:text-white" aria-label="Close player"><i data-lucide="x" class="w-5 h-5"></i></button></div>';
  document.body.appendChild(bar);
  var playBtn = bar.querySelector('#smeMiniPlay');
  function icon(on){ playBtn.innerHTML = '<i data-lucide="' + (on ? 'pause' : 'play') + '" class="w-5 h-5 fill-current"></i>'; playBtn.setAttribute('aria-label', on ? 'Pause' : 'Play'); if (window.lucide) lucide.createIcons(); }
  bar.querySelector('#smeMiniClose').addEventListener('click', function(){
    try { sessionStorage.removeItem(KEY); } catch (_) {}
    if (ep) { ep.audio.pause(); bar.dataset.closed = '1'; }
    bar.hidden = true;
  });
  if (ep) {
    var hero = document.getElementById('pPlay');
    var sync = function(){
      var off = hero ? hero.getBoundingClientRect().bottom < 60 : true;
      bar.hidden = bar.dataset.closed === '1' || ep.audio.paused && !ep.audio.currentTime || !off;
      var t = document.getElementById('smeMiniT'); if (t) t.textContent = mmss(ep.audio.currentTime) + ' of ' + ep.cur.clock;
    };
    playBtn.addEventListener('click', function(){ if (ep.audio.paused) ep.audio.play().catch(function(){}); else ep.audio.pause(); });
    ep.audio.addEventListener('play', function(){ bar.dataset.closed = ''; icon(true); sync(); });
    ep.audio.addEventListener('pause', function(){ icon(false); });
    ep.audio.addEventListener('timeupdate', sync);
    window.addEventListener('scroll', sync, { passive: true });
    sync();
  } else {
    playBtn.addEventListener('click', function(){ location.href = href + '&t=' + now.t; });
  }
  if (window.lucide && lucide.createIcons) lucide.createIcons();
})();
