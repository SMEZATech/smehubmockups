/* SME Mission Control, owner console mockup runtime. Shell, components, Dev Mode briefs. No build step. */
(function () {
  var MC = (window.MC = { briefs: {}, _t: {}, _dr: {}, _n: 0 });

  /* ---------- navigation map (single source for sidebar + command palette) ---------- */
  MC.NAV = [
    { h: 'Overview', items: [
      { k: 'home', label: 'Command centre', file: 'mc-home.html', icon: 'layout-dashboard' },
      { k: 'spine', label: 'Platform spine', file: 'mc-spine.html', icon: 'activity' } ] },
    { h: 'Workspaces', items: [
      { k: 'funding', label: 'Funding', file: 'mc-funding.html', icon: 'banknote', n: 73, hot: 1 },
      { k: 'community', label: 'Community', file: 'mc-community.html', icon: 'users', n: 6 },
      { k: 'solutions', label: 'Solutions', file: 'mc-solutions.html', icon: 'star' },
      { k: 'resources', label: 'Resources', file: 'mc-resources.html', icon: 'folder-open' },
      { k: 'tracking', label: 'Solutions tracking', file: 'mc-tracking.html', icon: 'radar' } ] },
    { h: 'Platform', items: [
      { k: 'switchboard', label: 'Design switchboard', file: 'mc-switchboard.html', icon: 'toggle-right' },
      { k: 'access', label: 'Access & security', file: 'mc-access.html', icon: 'shield-check' } ] }
  ];
  MC.WS_TABS = {
    funding: [['desk', 'Funding Desk'], ['ledger', 'Applications & Outcomes'], ['chase', 'Weekly Outcome Review'], ['declines', 'Declines'], ['frontdoor', 'Front Door'], ['lula', 'Lula Pre-Qual'], ['docreq', 'Request Docs'], ['share', 'Statement Share'], ['vault', 'Statement Vault'], ['affiliate', 'Affiliate Tracking'], ['nudge', 'Complete-app Nudge'], ['money', 'Commission'], ['recurring', 'Recurring Funding']],
    community: [['members', 'Member Report'], ['rescue', 'Connection Rescue'], ['lifecycle', 'Lifecycle Engine'], ['engagement', 'Member Engagement'], ['reply', 'Reply-Rate'], ['feedback', 'Feedback Hub'], ['funnel', 'Funnel Health'], ['stats', 'Community Stats'], ['nameguard', 'Name Guard'], ['promoguard', 'Promo Guard'], ['avatars', 'Avatar Review'], ['profilepush', 'Profile Campaign']],
    solutions: [['health', 'Health'], ['brands', 'Brand catalogue'], ['roundups', 'Roundups'], ['earnings', 'Earnings'], ['deals', 'Tracked partners']],
    resources: [['library', 'Library'], ['leads', 'Leads'], ['revival', 'Revival engine']],
    tracking: [['ads', 'Ad Manager'], ['money', 'Money Links'], ['conversion', 'Conversion Tracking'], ['capi', 'Meta CAPI'], ['lula', 'Lula API'], ['gotyme', 'GoTyme Web-to-Lead'], ['dripcel', 'Dripcel SMS']]
  };

  /* ---------- tiny helpers ---------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  MC.$ = $; MC.$$ = $$;
  MC.esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  MC.icon = function (n, cls) { return '<i data-lucide="' + n + '"' + (cls ? ' class="' + cls + '"' : '') + '></i>'; };
  MC.refreshIcons = function () { if (window.lucide) { window.lucide.createIcons(); } };
  MC.chip = function (t, tone, dot) { return '<span class="chip ' + (tone || '') + '">' + (dot ? '<i></i>' : '') + MC.esc(t) + '</span>'; };
  var PAL = ['#DC183C', '#0C1F31', '#29A37A', '#FF9900', '#2F6FED', '#7A5AF8', '#B0142F', '#1a3350'];
  MC.av = function (name, size) {
    var h = 0, i; for (i = 0; i < name.length; i++) { h = (h * 31 + name.charCodeAt(i)) >>> 0; }
    var ini = name.split(/\s+/).slice(0, 2).map(function (w) { return w[0]; }).join('').toUpperCase();
    return '<span class="av" style="background:' + PAL[h % PAL.length] + (size ? ';width:' + size + 'px;height:' + size + 'px;border-radius:' + Math.round(size * .27) + 'px;font-size:' + Math.round(size * .34) + 'px' : '') + '">' + MC.esc(ini) + '</span>';
  };
  MC.person = function (name, sub) { return '<div class="cell-p">' + MC.av(name) + '<div><b>' + MC.esc(name) + '</b>' + (sub ? '<small>' + MC.esc(sub) + '</small>' : '') + '</div></div>'; };
  MC.R = function (n) { return 'R' + Math.round(n).toLocaleString('en-ZA').replace(/,/g, ' '); };

  MC.toast = function (msg, ico) {
    var t = $('#mc-toast'); if (!t) { t = document.createElement('div'); t.id = 'mc-toast'; t.className = 'toast'; document.body.appendChild(t); }
    t.innerHTML = MC.icon(ico || 'check-circle-2') + '<span>' + MC.esc(msg) + '</span>'; MC.refreshIcons();
    t.classList.add('on'); clearTimeout(MC._tt); MC._tt = setTimeout(function () { t.classList.remove('on'); }, 2600);
  };

  /* ---------- svg bits ---------- */
  MC.spark = function (a, color) {
    var w = 96, h = 34, mx = Math.max.apply(null, a), mn = Math.min.apply(null, a), d = mx - mn || 1;
    var pts = a.map(function (v, i) { return [(i / (a.length - 1)) * w, h - 4 - ((v - mn) / d) * (h - 8)]; });
    var line = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
    var id = 'g' + (++MC._n);
    return '<svg class="spark" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + color + '" stop-opacity=".28"/><stop offset="1" stop-color="' + color + '" stop-opacity="0"/></linearGradient></defs><path d="' + line + ' L' + w + ' ' + h + ' L0 ' + h + ' Z" fill="url(#' + id + ')"/><path d="' + line + '" fill="none" stroke="' + color + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  };
  MC.donut = function (parts, size, label, sub) {
    size = size || 150; var r = 54, c = 2 * Math.PI * r, off = 0, tot = parts.reduce(function (s, p) { return s + p.v; }, 0), segs = '';
    parts.forEach(function (p) { var len = (p.v / tot) * c; segs += '<circle r="' + r + '" cx="70" cy="70" fill="none" stroke="' + p.c + '" stroke-width="16" stroke-dasharray="' + len + ' ' + (c - len) + '" stroke-dashoffset="' + (-off) + '" transform="rotate(-90 70 70)"/>'; off += len; });
    return '<svg viewBox="0 0 140 140" width="' + size + '" height="' + size + '"><circle r="' + r + '" cx="70" cy="70" fill="none" stroke="#EEF2F6" stroke-width="16"/>' + segs + '<text x="70" y="68" text-anchor="middle" font-family="Plus Jakarta Sans" font-weight="800" font-size="22" fill="#0C1F31">' + MC.esc(label) + '</text><text x="70" y="86" text-anchor="middle" font-size="9.5" font-weight="700" fill="#6A7581">' + MC.esc(sub || '') + '</text></svg>';
  };
  MC.bars = function (vals, labels, hl) {
    var mx = Math.max.apply(null, vals);
    return '<div class="bars" style="margin-bottom:24px">' + vals.map(function (v, i) { return '<div class="b' + (i === hl ? ' hl' : '') + '" style="height:' + Math.max(4, (v / mx) * 100) + '%" title="' + v + '"><span>' + MC.esc(labels[i]) + '</span></div>'; }).join('') + '</div>';
  };
  MC.line = function (series, labels, h) {
    h = h || 170; var w = 600, all = [].concat.apply([], series.map(function (s) { return s.v; })), mx = Math.max.apply(null, all) * 1.1, out = '';
    for (var g = 0; g <= 4; g++) { var y = 10 + (g / 4) * (h - 30); out += '<line x1="0" x2="' + w + '" y1="' + y + '" y2="' + y + '" stroke="#EEF2F6"/>'; }
    series.forEach(function (s) {
      var pts = s.v.map(function (v, i) { return [(i / (s.v.length - 1)) * w, 10 + (1 - v / mx) * (h - 30)]; });
      var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
      out += '<path d="' + d + '" fill="none" stroke="' + s.c + '" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>';
      var l = pts[pts.length - 1]; out += '<circle cx="' + l[0] + '" cy="' + l[1] + '" r="4.5" fill="#fff" stroke="' + s.c + '" stroke-width="2.6"/>';
    });
    var lab = labels.map(function (t, i) { return '<text x="' + ((i / (labels.length - 1)) * w) + '" y="' + (h - 2) + '" text-anchor="' + (i === 0 ? 'start' : i === labels.length - 1 ? 'end' : 'middle') + '" font-size="10.5" fill="#8B95A1" font-weight="600">' + MC.esc(t) + '</text>'; }).join('');
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" preserveAspectRatio="none" style="height:' + h + 'px">' + out + lab + '</svg>';
  };
  MC.funnel = function (steps) {
    var mx = steps[0].v;
    return '<div class="funnel">' + steps.map(function (s) { return '<div class="fl"><span>' + MC.esc(s.l) + '</span><div class="bar" style="width:' + Math.max(12, (s.v / mx) * 100) + '%;background:' + (s.c || '#0C1F31') + '">' + s.v.toLocaleString('en-ZA') + '</div></div>'; }).join('') + '</div>';
  };

  /* ---------- building blocks ---------- */
  MC.kpi = function (o) {
    var tag = o.href ? 'a' : 'div', col = { red: '#DC183C', amber: '#FF9900', green: '#29A37A', blue: '#2F6FED', violet: '#7A5AF8', navy: '#0C1F31' }[o.tone || 'navy'] || '#0C1F31';
    return '<' + tag + (o.href ? ' href="' + o.href + '"' : '') + ' class="card kpi ' + (o.tone || '') + '"><div class="kpi-l">' + (o.icon ? MC.icon(o.icon) : '') + MC.esc(o.label) + (o.dev ? MC.dev(o.dev) : '') + '</div><div class="kpi-v">' + o.value + '</div><div class="kpi-f"><span class="delta ' + (o.dir || 'flat') + '">' + (o.dir === 'up' ? MC.icon('trending-up') : o.dir === 'down' ? MC.icon('trending-down') : '') + (o.delta || '') + (o.sub ? ' <small>' + MC.esc(o.sub) + '</small>' : '') + '</span>' + (o.spark ? MC.spark(o.spark, col) : '') + '</div></' + tag + '>';
  };
  MC.card = function (o, body) {
    return '<section class="card ' + (o.cls || '') + '"><div class="card-h"><div><h3>' + o.title + '</h3>' + (o.sub ? '<small>' + o.sub + '</small>' : '') + '</div><div class="r">' + (o.right || '') + (o.dev ? MC.dev(o.dev) : '') + '</div></div><div class="card-b">' + body + '</div></section>';
  };
  MC.callout = function (tone, icon, title, text) { return '<div class="callout ' + tone + '"><div class="ic">' + MC.icon(icon) + '</div><div><b>' + title + '</b><p>' + text + '</p></div></div>'; };
  MC.li = function (tone, icon, title, sub, time) { return '<li class="li"><div class="ic ' + tone + '">' + MC.icon(icon) + '</div><div class="tx"><b>' + title + '</b><small>' + sub + '</small></div>' + (time ? '<time>' + time + '</time>' : '') + '</li>'; };
  MC.prog = function (parts) { return '<div class="prog">' + parts.map(function (p) { return '<i style="width:' + p.v + '%;background:' + p.c + '"></i>'; }).join('') + '</div>'; };

  /* Dev Mode badge + brief */
  MC.dev = function (key) { return '<button type="button" class="dev-badge" data-brief="' + key + '" aria-label="Implementation brief" title="Implementation brief">i</button>'; };
  MC.openBrief = function (key) {
    var b = MC.briefs[key]; if (!b) { return; }
    var sec = function (h, v) { if (!v) { return ''; } return '<h4>' + h + '</h4>' + (Array.isArray(v) ? '<ul>' + v.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' : '<p>' + v + '</p>'); };
    MC.drawer(b.title || 'Brief', 'Implementation brief', '<div class="brief">' + sec('Purpose', b.purpose) + sec('Data model', b.data) + sec('Logic', b.logic) + sec('Components', b.components) + sec('API', b.api) + sec('Rules', b.rules) + '</div>');
  };

  /* tabs */
  MC.tabs = function (id, items, active) {
    return '<div class="tabs" role="tablist" data-tabs="' + id + '">' + items.map(function (t) { return '<button type="button" role="tab" class="tab' + (t.k === active ? ' on' : '') + '" data-k="' + t.k + '">' + (t.icon ? MC.icon(t.icon) : '') + MC.esc(t.label) + (t.n ? '<span class="n">' + t.n + '</span>' : '') + '</button>'; }).join('') + '</div>';
  };

  /* interactive table */
  MC.table = function (c) {
    var id = 't' + (++MC._n); MC._t[id] = { c: c, q: '', f: {}, sort: null, dir: 1, page: 1 };
    var head = '<div class="tbar">' + (c.search === false ? '' : '<label class="search">' + MC.icon('search') + '<input type="search" placeholder="' + (c.placeholder || 'Search') + '" data-q="' + id + '" aria-label="Search"></label>') +
      (c.filters || []).map(function (f) { return '<select class="sel" data-f="' + id + '" data-k="' + f.k + '" aria-label="' + f.label + '"><option value="">' + f.label + '</option>' + f.opts.map(function (o) { return '<option>' + MC.esc(o) + '</option>'; }).join('') + '</select>'; }).join('') +
      (c.right ? '<div style="margin-left:auto;display:flex;gap:8px">' + c.right + '</div>' : '') + '</div>';
    return '<div data-table="' + id + '">' + head + '<div class="twrap"><table class="t"><thead><tr>' + c.cols.map(function (col) { return '<th class="' + (col.sort === false ? '' : 's') + (col.cls ? ' ' + col.cls : '') + '"' + (col.sort === false ? '' : ' data-s="' + col.k + '"') + '>' + col.label + '</th>'; }).join('') + '</tr></thead><tbody></tbody></table></div><div class="tfoot"></div></div>';
  };
  function paintTable(id) {
    var T = MC._t[id], c = T.c, host = $('[data-table="' + id + '"]'); if (!host) { return; }
    var rows = c.rows.filter(function (r) {
      if (T.q && JSON.stringify(r).toLowerCase().indexOf(T.q) < 0) { return false; }
      for (var k in T.f) { if (T.f[k] && String(r[k]) !== T.f[k]) { return false; } }
      return true;
    });
    if (T.sort) { rows = rows.slice().sort(function (a, b) { var x = a[T.sort], y = b[T.sort]; return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y))) * T.dir; }); }
    var per = c.perPage || 8, pages = Math.max(1, Math.ceil(rows.length / per)); T.page = Math.min(T.page, pages);
    var slice = rows.slice((T.page - 1) * per, T.page * per);
    $('tbody', host).innerHTML = slice.length ? slice.map(function (r) { var i = c.rows.indexOf(r); return '<tr data-i="' + i + '">' + c.cols.map(function (col) { return '<td class="' + (col.cls || '') + '">' + (col.render ? col.render(r) : MC.esc(r[col.k])) + '</td>'; }).join('') + '</tr>'; }).join('') : '<tr><td colspan="' + c.cols.length + '"><div class="empty">Nothing matches those filters.</div></td></tr>';
    var pg = ''; for (var p = 1; p <= pages; p++) { pg += '<button type="button" class="' + (p === T.page ? 'on' : '') + '" data-p="' + p + '">' + p + '</button>'; }
    $('.tfoot', host).innerHTML = '<span>Showing ' + (rows.length ? (T.page - 1) * per + 1 : 0) + '-' + Math.min(T.page * per, rows.length) + ' of ' + rows.length + '</span><div class="pager">' + (pages > 1 ? pg : '') + '</div>';
    MC.refreshIcons();
  }
  MC.paintTables = function (root) { $$('[data-table]', root).forEach(function (h) { paintTable(h.getAttribute('data-table')); }); };

  /* overlays */
  MC.drawer = function (title, sub, html) {
    var o = $('#mc-ov'); if (!o) { o = document.createElement('div'); o.id = 'mc-ov'; o.className = 'ov'; document.body.appendChild(o); }
    o.innerHTML = '<div class="ov-bg" data-close></div><aside class="drawer" role="dialog" aria-modal="true" aria-label="' + MC.esc(title) + '"><div class="dr-h"><div><h3>' + title + '</h3><small>' + (sub || '') + '</small></div><button class="ico-btn dr-x" data-close aria-label="Close">' + MC.icon('x') + '</button></div><div class="dr-b">' + html + '</div></aside>';
    o.classList.add('open'); MC.refreshIcons();
  };
  MC.closeOv = function () { var o = $('#mc-ov'); if (o) { o.classList.remove('open'); } var p = $('#mc-pal'); if (p) { p.classList.remove('open'); } };

  /* command palette */
  MC.palette = function () {
    var p = $('#mc-pal'); if (!p) { p = document.createElement('div'); p.id = 'mc-pal'; p.className = 'ov'; document.body.appendChild(p); }
    var items = [];
    MC.NAV.forEach(function (g) { g.items.forEach(function (i) { items.push({ g: 'Pages', t: i.label, s: g.h, h: i.file, i: i.icon }); }); });
    Object.keys(MC.WS_TABS).forEach(function (w) { var wf = MC.NAV[1].items.filter(function (x) { return x.k === w; })[0]; MC.WS_TABS[w].forEach(function (t) { items.push({ g: 'Tabs', t: t[1], s: wf.label, h: wf.file + '?tab=' + t[0], i: 'corner-down-right' }); }); });
    items.push({ g: 'Actions', t: 'Work the funding queue', s: 'Funding Desk', h: 'mc-funding.html?tab=desk', i: 'zap' }, { g: 'Actions', t: 'Preview a design as owner', s: 'Design switchboard', h: 'mc-switchboard.html', i: 'eye' }, { g: 'Actions', t: 'Sign-in screen', s: 'Owner sign-in', h: 'mc-login.html', i: 'log-in' });
    p.innerHTML = '<div class="ov-bg" data-close></div><div class="cmd" role="dialog" aria-label="Command palette"><input id="mc-pal-q" placeholder="Jump to a page, a tab or an action..." autocomplete="off"><div class="cmd-l" id="mc-pal-l"></div></div>';
    var paint = function (q) {
      q = (q || '').toLowerCase(); var last = '', out = '';
      items.filter(function (x) { return !q || (x.t + ' ' + x.s).toLowerCase().indexOf(q) >= 0; }).slice(0, 30).forEach(function (x) { if (x.g !== last) { out += '<div class="cmd-g">' + x.g + '</div>'; last = x.g; } out += '<a href="' + x.h + '">' + MC.icon(x.i) + MC.esc(x.t) + '<small>' + MC.esc(x.s) + '</small></a>'; });
      $('#mc-pal-l').innerHTML = out || '<div class="empty">No match.</div>'; MC.refreshIcons();
    };
    paint(''); p.classList.add('open'); var inp = $('#mc-pal-q'); inp.focus(); inp.oninput = function () { paint(inp.value); };
    inp.onkeydown = function (e) { if (e.key === 'Enter') { var a = $('#mc-pal-l a'); if (a) { location.href = a.getAttribute('href'); } } };
  };


  /* ---------- theme: Brand 2026 (default) or Live-site colours. Swapping is one attribute plus a recolour of generated inline colours. ---------- */
  var MAP = { '#DC183C': '#9C1C1F', '#B0142F': '#7D1618', '#FDECEF': '#FBEAEA', '#FF9900': '#C98A00', '#AE6B0A': '#7A5A06', '#FFF1E0': '#FDF3DD', '#29A37A': '#1A7F37', '#1F8462': '#136228', '#E4F5EE': '#E6F4EA', '#0C1F31': '#0A2C3D', '#12263B': '#0D3A50', '#1A3350': '#14485F', '#2F6FED': '#2271B1', '#7A5AF8': '#6B4FBB', '#5FE0B4': '#7FD69A', '#FFBE5C': '#FFD27A', '#FF8DA1': '#F4B9BA' };
  var REV = {}; Object.keys(MAP).forEach(function (k) { REV[MAP[k]] = k; });
  var RX = function (m) { return new RegExp(Object.keys(m).join('|'), 'gi'); };
  var RXF = RX(MAP), RXR = RX(REV);
  var curTheme = 'brand', obs = null, busy = false;
  var swap = function (root) {
    var rx = curTheme === 'live' ? RXF : RXR, mp = curTheme === 'live' ? MAP : REV;
    var els = root.nodeType === 1 ? [root].concat(Array.prototype.slice.call(root.querySelectorAll('[style],[fill],[stroke],[stop-color]'))) : [];
    els.forEach(function (el) { ['style', 'fill', 'stroke', 'stop-color'].forEach(function (a) { var v = el.getAttribute && el.getAttribute(a); if (v && v.charAt(0) !== undefined) { var n = v.replace(rx, function (h) { return mp[h.toUpperCase()] || h; }); if (n !== v) { el.setAttribute(a, n); } } }); });
  };
  MC.theme = function (name, quiet) {
    if (name === curTheme && quiet) { return; }
    curTheme = name === 'live' ? 'live' : 'brand';
    document.documentElement.setAttribute('data-theme', curTheme);
    busy = true; swap(document.body); busy = false;
    if (!obs) { obs = new MutationObserver(function (list) { if (busy || curTheme !== 'live') { return; } busy = true; list.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1) { swap(n); } }); }); busy = false; }); obs.observe(document.body, { childList: true, subtree: true }); }
    var b = $('#mc-theme'); if (b) { b.querySelector('span').textContent = curTheme === 'live' ? 'Live colours' : 'Brand 2026'; b.classList.toggle('on', curTheme === 'live'); }
    try { sessionStorage.setItem('mcTheme', curTheme); } catch (e) {}
    if (!quiet) { MC.toast(curTheme === 'live' ? 'Showing the live site’s existing colours' : 'Showing the Brand 2026 colours', 'palette'); }
  };

  /* ---------- shell ---------- */
  MC.page = function (o) {
    var nav = MC.NAV.map(function (g) {
      return '<div class="nav-h">' + g.h + '</div>' + g.items.map(function (i) { return '<a href="' + i.file + '" class="' + (i.k === o.active ? 'on' : '') + '">' + MC.icon(i.icon) + '<span>' + i.label + '</span>' + (i.n ? '<span class="n' + (i.hot ? ' hot' : '') + '">' + i.n + '</span>' : '') + '</a>'; }).join('');
    }).join('');
    var crumbs = '<span class="hide-s">Mission Control</span>' + MC.icon('chevron-right') + (o.crumbs || []).map(function (c, i, a) { return (i === a.length - 1 ? '<b>' + c + '</b>' : '<span class="hide-s">' + c + '</span>' + MC.icon('chevron-right')); }).join('');
    document.body.innerHTML = '<div class="app"><aside class="side"><div class="brand"><img src="../assets/logo-v1-lockup-reversed.svg" alt="SME South Africa"><span class="tag">Owner</span></div>' +
      '<button class="s-search" data-pal>' + MC.icon('search') + 'Search or jump to...<kbd>Ctrl K</kbd></button><nav class="nav" aria-label="Mission Control">' + nav + '</nav>' +
      '<div class="owner"><div class="av">TJ</div><div><b>Joel</b><small>Owner &middot; Production</small></div><span class="lock" title="Owner-only access">' + MC.icon('lock-keyhole') + '</span></div></aside>' +
      '<div class="main"><header class="top"><button class="ico-btn menu-btn" data-menu aria-label="Menu">' + MC.icon('menu') + '</button><div class="crumbs">' + crumbs + '</div><div class="sp"></div>' +
      '<span class="pill-ok" title="Production health"><i></i><span>All systems normal</span></span>' +
      '<button class="ico-btn" data-toast="3 things need you today" aria-label="Notifications">' + MC.icon('bell') + '<span class="dot"></span></button>' +
      '<button class="dev-t" id="mc-theme" title="Swap between the new brand colours and the live site\'s colours">' + MC.icon('palette') + '<span>Brand 2026</span></button><button class="dev-t" id="mc-dev" aria-pressed="false">' + MC.icon('code-2') + '<span>Dev Mode</span></button></header>' +
      '<main class="view" id="mc-view"></main></div></div>';
    $('#mc-view').innerHTML = o.html;
    if (o.after) { o.after(); }
    MC.paintTables(document);
    var tabId = null;
    if (o.workspace) { wireTabs(o.workspace); }
    MC.refreshIcons();
    try { if (sessionStorage.getItem('mcDev') === '1') { setDev(true); } } catch (e) {}
    var q = (location.search.match(/[?&]theme=(live|brand)/) || [])[1], saved = null; try { saved = sessionStorage.getItem('mcTheme'); } catch (e) {}
    MC.theme(q || saved || 'brand', true);
  };
  function setDev(on) { document.body.classList.toggle('dev-on', on); var b = $('#mc-dev'); if (b) { b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); } try { sessionStorage.setItem('mcDev', on ? '1' : '0'); } catch (e) {} }
  function wireTabs(ws) {
    var keys = ws.map(function (t) { return t.k; }), want = (location.search.match(/[?&]tab=([a-z0-9_-]+)/) || [])[1];
    var cur = keys.indexOf(want) >= 0 ? want : keys[0];
    var show = function (k) { $$('[data-tabs] .tab').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-k') === k); }); $$('.panel').forEach(function (p) { p.classList.toggle('on', p.getAttribute('data-k') === k); }); var on = $('.tab.on'); if (on && on.scrollIntoView) { on.scrollIntoView({ block: 'nearest', inline: 'center' }); } try { history.replaceState(null, '', '?tab=' + k); } catch (e) {} };
    show(cur); MC._showTab = show;
  }

  /* ---------- events ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target;
    var cl = t.closest('[data-close]'); if (cl) { MC.closeOv(); return; }
    var br = t.closest('[data-brief]'); if (br) { e.preventDefault(); e.stopPropagation(); MC.openBrief(br.getAttribute('data-brief')); return; }
    if (t.closest('[data-pal]')) { MC.palette(); return; }
    if (t.closest('[data-menu]')) { document.body.classList.toggle('nav-open'); return; }
    if (document.body.classList.contains('nav-open') && !t.closest('.side')) { document.body.classList.remove('nav-open'); }
    var th2 = t.closest('#mc-theme'); if (th2) { MC.theme(curTheme === 'live' ? 'brand' : 'live'); return; }
    var d = t.closest('#mc-dev'); if (d) { var on = !document.body.classList.contains('dev-on'); setDev(on); if (on) { MC.toast('Dev Mode on: tap any red i for the implementation brief', 'code-2'); } return; }
    var tg = t.closest('[data-toast]'); if (tg) { MC.toast(tg.getAttribute('data-toast'), tg.getAttribute('data-ico') || 'info'); return; }
    var tb = t.closest('[data-tabs] .tab'); if (tb && MC._showTab) { MC._showTab(tb.getAttribute('data-k')); return; }
    var th = t.closest('th[data-s]'); if (th) { var h = th.closest('[data-table]'), T = MC._t[h.getAttribute('data-table')], k = th.getAttribute('data-s'); T.dir = T.sort === k ? -T.dir : 1; T.sort = k; paintTable(h.getAttribute('data-table')); return; }
    var pg = t.closest('.pager button'); if (pg) { var h2 = pg.closest('[data-table]'); MC._t[h2.getAttribute('data-table')].page = +pg.getAttribute('data-p'); paintTable(h2.getAttribute('data-table')); return; }
    var tr = t.closest('[data-table] tbody tr[data-i]'); if (tr && !t.closest('a,button')) { var h3 = tr.closest('[data-table]'), c = MC._t[h3.getAttribute('data-table')].c; if (c.onRow) { var r = c.rows[+tr.getAttribute('data-i')], v = c.onRow(r); MC.drawer(v.title, v.sub, v.html); } return; }
    var dr = t.closest('[data-dr]'); if (dr && !t.closest('a,button') && MC._dr && MC._dr[dr.getAttribute('data-dr')]) { var dv = MC._dr[dr.getAttribute('data-dr')](); MC.drawer(dv.title, dv.sub, dv.html); return; }
    var sg = t.closest('.seg button'); if (sg && !sg.closest('[data-own]')) { $$('button', sg.parentNode).forEach(function (b) { b.classList.remove('on'); }); sg.classList.add('on'); }
    var tt = t.closest('.toggle'); if (tt) { tt.classList.toggle('on'); MC.toast(tt.getAttribute('data-msg') || (tt.classList.contains('on') ? 'Switched on' : 'Switched off')); }
    var ac = t.closest('[data-act]'); if (ac) { MC.toast(ac.getAttribute('data-act'), ac.getAttribute('data-ico') || 'check-circle-2'); }
  });
  document.addEventListener('input', function (e) {
    var q = e.target.getAttribute && e.target.getAttribute('data-q'); if (q) { MC._t[q].q = e.target.value.toLowerCase(); MC._t[q].page = 1; paintTable(q); }
  });
  document.addEventListener('change', function (e) {
    var f = e.target.getAttribute && e.target.getAttribute('data-f'); if (f) { MC._t[f].f[e.target.getAttribute('data-k')] = e.target.value; MC._t[f].page = 1; paintTable(f); }
  });
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); MC.palette(); }
    if (e.key === 'Escape') { MC.closeOv(); }
  });
})();
