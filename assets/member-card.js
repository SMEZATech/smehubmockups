/*
 * SME South Africa: member preview card and the "people who reacted" list, shared by the hub and feed mockups.
 * Matches what is live (22 Oct 2026):
 *   - Member card (live: mu-plugin smesa-member-card, switch smesa_member_card): opens when you hover a member's name or photo
 *     on a laptop; on a phone a tap goes straight to the profile. Shows cover, photo, name, role · business, the first sentence
 *     of the bio (two lines at most), industry and province chips, "You both know" (up to two names), a Connected pill,
 *     Connect (not connected) or Message (connected), View profile. Your own card: a hint and Edit my profile.
 *     Never shows followers, a follow button, last active, the member tag or the joined date.
 *     "Verified business" is NOT built: it is Premium, later. In Dev Mode the card carries a dev note saying so.
 *     Spec page: member-hover-card.html.
 *   - Reactions list (live: mu-plugin smesa-reactions-list, switch smesa_reactions_list): each person shows "Role · Company"
 *     in place of the member badge, and a light "+ Connect" link for people you are not connected to.
 *
 * Use: <a href="single-member.html?view=member" data-mc="Sello Monare">Sello Monare</a> (name or photo).
 *      SMEPeople.reactions({ like: [...names], love: [...names] }) opens the list.
 * Unknown names still get a card (name, View profile, Connect).
 */
(function () {
  if (window.SMEPeople) return;
  var ME = 'Tshepho Joel';
  var PEOPLE = {
    'Tshepho Joel': { role: 'Founder', company: 'Langa Holdings', self: true },
    'Sello Monare': { role: 'MD', company: 'TechSolve RSA', about: 'Managed IT and cloud support for small firms in Gauteng.', industry: 'Technology', province: 'Gauteng', mutual: ['Naledi M.', 'Sipho N.'] },
    'Karabo Kgophane': { role: 'E-comm Lead', company: 'Mzansi Cart', about: 'An online store for local homeware makers, shipping countrywide.', industry: 'Retail', province: 'Gauteng', friend: true },
    'Naledi Mokoena': { role: 'Founder', company: 'GreenTrace', about: 'Carbon and waste tracking software for South African manufacturers.', industry: 'Clean technology', province: 'Western Cape', friend: true },
    'Naledi M.': { alias: 'Naledi Mokoena' },
    'Lerato Phakathi': { role: 'Founder', company: 'Inkundla AI', about: 'AI tools that help small teams answer customer questions faster.', industry: 'Technology', province: 'Gauteng', mutual: ['Sello M.'] },
    'Refiloe Sithole': { role: 'Founder', company: 'Skhokho', about: 'Simple business admin software for owner-run firms.', industry: 'Software', province: 'Gauteng', mutual: ['Naledi M.'] },
    'Sipho Ngubane': { role: 'Founder', company: 'TapWallet', about: 'Card and QR payments for spaza shops and market traders.', industry: 'Fintech', province: 'KwaZulu-Natal' },
    'Sipho Monare': { role: 'Owner', company: 'Monare Logistics', about: 'Same-day courier runs between Johannesburg and Pretoria.', industry: 'Logistics', province: 'Gauteng', friend: true },
    'Thandeka Zulu': { role: 'Bookkeeper', company: 'Zulu Ledger Services', about: 'Monthly bookkeeping, payroll and VAT returns for owner-run businesses.', industry: 'Finance', province: 'KwaZulu-Natal', mutual: ['Sipho N.'] },
    'Brent Fisher': { role: 'Owner', company: 'Africa IT Professionals Pty Ltd', about: 'IT support contracts for schools and small offices.', industry: 'Technology', province: 'Western Cape' },
    'Nobom Nini': { role: 'Owner', company: 'SIPHETHUBOMI PTY LTD', industry: 'Health and wellness', province: 'Eastern Cape' },
    'Marvin Mafa': { role: 'Manager', company: 'African cooperative desk', about: 'Helps co-operatives register, comply and find buyers.', province: 'Limpopo' },
    'Nndivhe Godfrey Marema': { role: 'Co-Founder', company: 'Arem Enterprises Pty (Ltd)', industry: 'Construction', province: 'Limpopo', mutual: ['Marvin M.'] },
    'Aadil Khan': { role: 'Partner', company: 'Core Claim Holdings (Pty) Ltd', about: 'Insurance claims support for small fleets.', industry: 'Insurance', province: 'Gauteng' },
    'Lindiwe Dube': { role: 'Owner', company: 'Dube Catering Co.', industry: 'Hospitality', province: 'Gauteng' },
    'Musa Khumalo': { role: 'Director', company: 'Khumalo Build Supplies', industry: 'Construction', province: 'KwaZulu-Natal', friend: true },
    'Ayanda Nkosi': { role: 'Founder', company: 'Nkosi Print Studio', industry: 'Printing', province: 'Gauteng' }
  };
  function person(name) {
    var p = PEOPLE[name] || {};
    if (p.alias) { name = p.alias; p = PEOPLE[name] || {}; }
    return { name: name, role: p.role || '', company: p.company || '', about: p.about || '', industry: p.industry || '', province: p.province || '', mutual: p.mutual || [], friend: !!p.friend, self: !!p.self || name === ME };
  }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function initials(n) { return String(n).split(/\s+/).filter(Boolean).slice(0, 2).map(function (w) { return w.charAt(0).toUpperCase(); }).join(''); }
  function line(p) { return p.role && p.company ? esc(p.role) + ' · <b>' + esc(p.company) + '</b>' : (p.company ? '<b>' + esc(p.company) + '</b>' : esc(p.role)); }
  var sent = {};

  var css = document.createElement('style');
  css.textContent =
    '[data-mc]{cursor:pointer}' +
    '#sme-mc{position:absolute;z-index:70;width:340px;max-width:calc(100vw - 24px);background:#fff;border:1px solid #E6EAEF;border-radius:18px;overflow:hidden;box-shadow:0 18px 50px rgba(10,44,61,.16),0 2px 6px rgba(10,44,61,.06);font-family:Inter,system-ui,sans-serif;color:#121A21;opacity:0;transform:translateY(4px);transition:opacity .15s,transform .15s}' +
    '#sme-mc.on{opacity:1;transform:none}' +
    '#sme-mc .mc-cover{height:56px;background:radial-gradient(circle at 85% 0%,rgba(220,24,60,.22),transparent 55%),linear-gradient(120deg,#0C1F31 0%,#16324a 100%)}' +
    '#sme-mc .mc-body{padding:0 18px;position:relative}' +
    '#sme-mc .mc-av{width:68px;height:68px;margin-top:-34px;border-radius:999px;border:4px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,.08);background:linear-gradient(135deg,#DC183C,#FF9900);display:grid;place-items:center;color:#fff;font:800 22px "Plus Jakarta Sans",sans-serif;position:relative;z-index:1}' +
    '#sme-mc .mc-pill{position:absolute;right:18px;top:8px;font-size:12px;font-weight:600;color:#1a7f37;background:#E8F5EF;border-radius:999px;padding:3px 10px}' +
    '#sme-mc .mc-name{font:800 20px/1.2 "Plus Jakarta Sans",sans-serif;color:#121A21;margin:8px 0 0}' +
    '#sme-mc .mc-line{margin:2px 0 0;font-size:14px;color:#334155;line-height:1.35}#sme-mc .mc-line b{font-weight:600}' +
    '#sme-mc .mc-about{margin:8px 0 0;font-size:13px;color:#64748B;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}' +
    '#sme-mc .mc-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}#sme-mc .mc-chips span{font-size:12px;color:#3B4754;background:#F3F5F9;border-radius:999px;padding:4px 10px}' +
    '#sme-mc .mc-mut{display:flex;align-items:center;gap:8px;margin:12px 18px 0;padding-top:10px;border-top:1px solid #F0F3F6;font-size:12.5px;color:#64748B}#sme-mc .mc-mut b{color:#121A21;font-weight:600}' +
    '#sme-mc .mc-mut i{width:22px;height:22px;border-radius:999px;border:2px solid #fff;margin-left:-6px;background:#CBD5E1;display:inline-grid;place-items:center;font:700 8px Inter,sans-serif;color:#fff;font-style:normal}#sme-mc .mc-mut i:first-child{margin-left:0}' +
    '#sme-mc .mc-self{margin:12px 18px 0;padding:10px 12px;border-radius:12px;background:#FDECEF;border:1px solid #F6C9D2;font-size:12.5px;color:#7A1022;line-height:1.45}' +
    '#sme-mc .mc-foot{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:14px 18px 18px}#sme-mc .mc-foot.solo{grid-template-columns:1fr}' +
    '#sme-mc .mc-btn{display:flex;align-items:center;justify-content:center;gap:6px;height:38px;border-radius:999px;font:700 14px Inter,sans-serif;padding:0 12px;text-decoration:none;cursor:pointer}' +
    '#sme-mc .mc-red{background:#DC183C;border:1px solid #DC183C;color:#fff}#sme-mc .mc-red:hover{background:#B0142F}' +
    '#sme-mc .mc-red.sent{background:#fff;color:#64748B;border-color:#CBD5E1;cursor:default}' +
    '#sme-mc .mc-line-btn{background:#fff;border:1.5px solid #CBD5E1;color:#121A21}#sme-mc .mc-line-btn:hover{border-color:#121A21}' +
    '#sme-mc .mc-dev{display:none;margin:0 18px 16px;padding:8px 10px;border:1px dashed #F59E0B;border-radius:10px;background:#FFFBEB;font-size:11.5px;color:#92400E;line-height:1.45}' +
    'body.dev-on #sme-mc .mc-dev{display:block}#sme-mc .mc-dev a{color:#92400E;text-decoration:underline}' +
    '#sme-rx{position:fixed;inset:0;z-index:80;display:flex;align-items:center;justify-content:center;padding:16px}' +
    '#sme-rx .rx-bg{position:absolute;inset:0;background:rgba(12,31,49,.45)}' +
    '#sme-rx .rx-box{position:relative;width:100%;max-width:560px;max-height:80vh;overflow:auto;background:#fff;border-radius:18px;box-shadow:0 24px 60px rgba(12,31,49,.3);padding:24px 28px}' +
    '#sme-rx h3{font:800 20px "Plus Jakarta Sans",sans-serif;margin:0}' +
    '#sme-rx .rx-x{position:absolute;right:14px;top:14px;width:36px;height:36px;border-radius:999px;display:grid;place-items:center;color:#64748B}#sme-rx .rx-x:hover{background:#F1F5F9;color:#121A21}' +
    '#sme-rx .rx-tabs{display:flex;gap:4px;margin-top:16px;border-bottom:1px solid #E7EBEF}' +
    '#sme-rx .rx-tab{height:40px;padding:0 16px;display:inline-flex;align-items:center;gap:6px;font-size:14px;font-weight:600;color:#64748B;border-bottom:2px solid transparent;margin-bottom:-1px}#sme-rx .rx-tab.on{color:#121A21;border-color:#DC183C}' +
    '#sme-rx .rx-row{display:flex;align-items:center;gap:14px;padding:12px 0}#sme-rx .rx-row+.rx-row{border-top:1px solid #F1F5F9}' +
    '#sme-rx .rx-av{position:relative;width:44px;height:44px;border-radius:999px;background:linear-gradient(135deg,#DC183C,#FF9900);display:grid;place-items:center;color:#fff;font:700 14px "Plus Jakarta Sans",sans-serif;flex:none}' +
    '#sme-rx .rx-badge{position:absolute;right:-3px;bottom:-3px;width:20px;height:20px;border-radius:999px;border:2px solid #fff;display:grid;place-items:center;color:#fff}' +
    '#sme-rx .rx-name{font-size:15px;font-weight:600;color:#121A21}#sme-rx .rx-sub{font-size:13px;color:#64748B;margin-top:2px}' +
    '#sme-rx .rx-con{margin-left:auto;font-size:14px;font-weight:700;color:#DC183C;white-space:nowrap}#sme-rx .rx-con:hover{text-decoration:underline}#sme-rx .rx-con.sent{color:#94A3B8;text-decoration:none;cursor:default}' +
    '@media (max-width:640px){#sme-rx{align-items:flex-end;padding:0}#sme-rx .rx-box{border-radius:18px 18px 0 0;max-height:85vh;padding:20px}}';
  document.head.appendChild(css);

  /* ---------- member card ---------- */
  var canHover = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var card = null, openT = 0, closeT = 0, current = null;
  function cardHTML(p) {
    var foot;
    if (p.self) foot = '<div class="mc-foot solo"><a class="mc-btn mc-line-btn" href="member-account.html#profile">Edit my profile</a></div>';
    else if (p.friend) foot = '<div class="mc-foot"><a class="mc-btn mc-red" href="member-messages.html">Message</a><a class="mc-btn mc-line-btn" href="single-member.html?view=member">View profile</a></div>';
    else foot = '<div class="mc-foot"><button type="button" class="mc-btn mc-red' + (sent[p.name] ? ' sent' : '') + '" data-mc-connect="' + esc(p.name) + '">' + (sent[p.name] ? 'Request sent' : '<i data-lucide="user-plus" style="width:16px;height:16px"></i> Connect') + '</button><a class="mc-btn mc-line-btn" href="single-member.html?view=member">View profile</a></div>';
    var chips = !p.self && (p.industry || p.province) ? '<div class="mc-chips">' + (p.industry ? '<span>' + esc(p.industry) + '</span>' : '') + (p.province ? '<span>' + esc(p.province) + '</span>' : '') + '</div>' : '';
    var mut = !p.self && p.mutual.length ? '<div class="mc-mut"><span style="display:flex">' + p.mutual.slice(0, 2).map(function (m) { return '<i>' + esc(initials(m)) + '</i>'; }).join('') + '</span><span>You both know ' + p.mutual.slice(0, 2).map(function (m) { return '<b>' + esc(m) + '</b>'; }).join(' and ') + '</span></div>' : '';
    return '<div class="mc-cover" aria-hidden="true"></div><div class="mc-body"><div class="mc-av">' + esc(initials(p.name)) + '</div>' +
      (p.friend ? '<span class="mc-pill">Connected</span>' : '') +
      '<p class="mc-name">' + esc(p.self ? p.name : p.name) + '</p>' +
      (p.role || p.company ? '<p class="mc-line">' + line(p) + '</p>' : '') +
      (!p.self && p.about ? '<p class="mc-about">' + esc(p.about) + '</p>' : '') + chips + '</div>' + mut +
      (p.self ? '<div class="mc-self">This is how other members see you. A one-line description of your business helps people know how to work with you.</div>' : '') +
      foot + '<div class="mc-dev"><b>Dev note:</b> no "Verified business" badge. It is part of Premium, later, and is not built. No followers, last active, member tag or joined date. Spec: <a href="member-hover-card.html">member-hover-card.html</a>.</div>';
  }
  function place(trigger) {
    var r = trigger.getBoundingClientRect(), w = card.offsetWidth, h = card.offsetHeight;
    var left = Math.max(12, Math.min(r.left, window.innerWidth - w - 12));
    var below = window.innerHeight - r.bottom, top = (below < h + 16 && r.top > h + 16) ? r.top - h - 8 : r.bottom + 8;
    card.style.left = (left + window.scrollX) + 'px'; card.style.top = (top + window.scrollY) + 'px';
  }
  function show(trigger) {
    var p = person(trigger.getAttribute('data-mc'));
    if (!card) {
      card = document.createElement('div'); card.id = 'sme-mc'; card.setAttribute('role', 'dialog'); card.setAttribute('aria-label', 'Member preview');
      card.addEventListener('mouseenter', function () { clearTimeout(closeT); });
      card.addEventListener('mouseleave', hideSoon);
      card.addEventListener('click', function (e) {
        var b = e.target.closest('[data-mc-connect]'); if (!b || b.classList.contains('sent')) return;
        e.preventDefault(); sent[b.getAttribute('data-mc-connect')] = 1; b.classList.add('sent'); b.textContent = 'Request sent';
      });
      document.body.appendChild(card);
    }
    current = trigger; card.innerHTML = cardHTML(p);
    if (window.lucide && lucide.createIcons) lucide.createIcons();
    card.classList.remove('on'); card.style.display = 'block'; place(trigger);
    requestAnimationFrame(function () { card.classList.add('on'); });
  }
  function hide() { if (card) { card.classList.remove('on'); card.style.display = 'none'; } current = null; }
  function hideSoon() { clearTimeout(openT); clearTimeout(closeT); closeT = setTimeout(hide, 220); }
  if (canHover) {
    document.addEventListener('mouseover', function (e) {
      var t = e.target.closest && e.target.closest('[data-mc]'); if (!t) return;
      clearTimeout(closeT); if (t === current) return;
      clearTimeout(openT); openT = setTimeout(function () { show(t); }, 350);
    });
    document.addEventListener('mouseout', function (e) {
      var t = e.target.closest && e.target.closest('[data-mc]'); if (!t) return;
      if (e.relatedTarget && t.contains(e.relatedTarget)) return;
      hideSoon();
    });
    window.addEventListener('scroll', function () { if (current) hide(); }, { passive: true });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(); });
  }

  /* ---------- reactions list ---------- */
  var BADGE = { like: ['#DC183C', '<svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="M2 21h4V9H2v12zm20-11a2 2 0 0 0-2-2h-6.3l1-4.6v-.3c0-.4-.2-.8-.4-1.1L13.2 1 6.6 7.6C6.2 8 6 8.5 6 9v10a2 2 0 0 0 2 2h9c.8 0 1.5-.5 1.8-1.2l3-7.1c.1-.2.2-.5.2-.7v-2z"/></svg>'],
    love: ['#E11D48', '<svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.5 2.9 4.5 6.6 4.5c2.1 0 3.5 1.1 4.4 2.4.9-1.3 2.3-2.4 4.4-2.4 3.7 0 5.7 4 4.2 7.3C19.5 16.4 12 21 12 21z"/></svg>'] };
  function rxRows(list) {
    return list.map(function (x) {
      var p = person(x.name), b = BADGE[x.kind] || BADGE.like;
      var sub = p.role && p.company ? esc(p.role) + ' · ' + esc(p.company) : esc(p.company || p.role);
      var con = p.self || p.friend ? '' : '<button type="button" class="rx-con' + (sent[p.name] ? ' sent' : '') + '" data-rx-connect="' + esc(p.name) + '">' + (sent[p.name] ? 'Request sent' : '+ Connect') + '</button>';
      return '<div class="rx-row"><a href="single-member.html?view=member" class="rx-av" data-mc="' + esc(p.name) + '">' + esc(initials(p.name)) + '<span class="rx-badge" style="background:' + b[0] + '">' + b[1] + '</span></a>' +
        '<div class="min-w-0"><a href="single-member.html?view=member" class="rx-name" data-mc="' + esc(p.name) + '">' + esc(p.name) + '</a>' + (sub ? '<p class="rx-sub">' + sub + '</p>' : '') + '</div>' + con + '</div>';
    }).join('');
  }
  function reactions(data) {
    var all = [].concat((data.like || []).map(function (n) { return { name: n, kind: 'like' }; }), (data.love || []).map(function (n) { return { name: n, kind: 'love' }; }));
    var old = document.getElementById('sme-rx'); if (old) old.remove();
    var o = document.createElement('div'); o.id = 'sme-rx';
    var tab = function (id, label, on) { return '<button type="button" class="rx-tab' + (on ? ' on' : '') + '" data-rx-tab="' + id + '">' + label + '</button>'; };
    o.innerHTML = '<div class="rx-bg" data-rx-close></div><div class="rx-box" role="dialog" aria-modal="true" aria-label="Reactions"><button type="button" class="rx-x" data-rx-close aria-label="Close"><i data-lucide="x" style="width:20px;height:20px"></i></button><h3>Reactions</h3>' +
      '<div class="rx-tabs">' + tab('all', 'All', true) + (data.like && data.like.length ? tab('like', '<span class="rx-badge" style="position:static;border:0;background:' + BADGE.like[0] + '">' + BADGE.like[1] + '</span> ' + data.like.length) : '') + (data.love && data.love.length ? tab('love', '<span class="rx-badge" style="position:static;border:0;background:' + BADGE.love[0] + '">' + BADGE.love[1] + '</span> ' + data.love.length) : '') + '</div>' +
      '<div class="rx-list">' + rxRows(all) + '</div></div>';
    document.body.appendChild(o);
    o.addEventListener('click', function (e) {
      if (e.target.closest('[data-rx-close]')) { o.remove(); return; }
      var t = e.target.closest('[data-rx-tab]');
      if (t) { o.querySelectorAll('.rx-tab').forEach(function (x) { x.classList.toggle('on', x === t); }); var k = t.getAttribute('data-rx-tab'); o.querySelector('.rx-list').innerHTML = rxRows(k === 'all' ? all : all.filter(function (x) { return x.kind === k; })); return; }
      var c = e.target.closest('[data-rx-connect]');
      if (c && !c.classList.contains('sent')) { sent[c.getAttribute('data-rx-connect')] = 1; c.classList.add('sent'); c.textContent = 'Request sent'; }
    });
    document.addEventListener('keydown', function esc2(e) { if (e.key === 'Escape') { o.remove(); document.removeEventListener('keydown', esc2); } });
    if (window.lucide && lucide.createIcons) lucide.createIcons();
  }

  /* Auto-bind: any link to a member profile whose text is a known name gets the card (so pages need no extra markup). */
  function bindNames(root) {
    (root || document).querySelectorAll('a[href^="single-member.html"]:not([data-mc])').forEach(function (a) {
      var n = (a.textContent || '').replace(/\s+/g, ' ').trim();
      if (PEOPLE[n] || (n && PEOPLE[n.replace(/\w/g, function (c) { return c.toUpperCase(); })])) a.setAttribute('data-mc', PEOPLE[n] ? n : n.replace(/\w/g, function (c) { return c.toUpperCase(); }));
    });
  }
  function startBind() { bindNames(document); if (window.MutationObserver) new MutationObserver(function () { bindNames(document); }).observe(document.body, { childList: true, subtree: true }); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', startBind); else startBind();

  window.SMEPeople = { person: person, reactions: reactions, people: PEOPLE };
})();
