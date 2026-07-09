/*
 * SME South Africa — In-mockup review widget.
 * Injected by the launcher (index.html) into the iframe contentDocument on load,
 * OR included directly in a mockup for standalone-page reviewing.
 *
 * Requires: Feedback (feedback.js) — auto-loads if absent.
 * Adds: floating "Review" button (bottom-right), per-section notes panel.
 * Persistence: shares Feedback's localStorage with the launcher (same origin).
 */
(function(){
  'use strict';

  // Gate to localhost / GitHub Pages preview only — never ship in prod.
  var host = location.hostname;
  var isLocal = host === 'localhost' || host === '127.0.0.1' || /\.github\.io$/.test(host) || host === '';
  if(!isLocal) return;
  if(document.getElementById('sme-notes-widget')) return; // idempotent

  function loadScript(src){
    return new Promise(function(res){
      var s = document.createElement('script');
      s.src = src;
      s.onload = function(){ res(true); };
      s.onerror = function(){ res(false); };
      document.head.appendChild(s);
    });
  }
  function load(cb){
    var needFeedback = !window.Feedback;
    var needShared = !window.SHARED_NOTES;
    Promise.resolve()
      .then(function(){ return needShared ? loadScript('shared-notes.js') : null; })
      .then(function(){ return needFeedback ? loadScript('feedback.js') : null; })
      .then(cb);
  }

  function file(){
    var p = location.pathname.split('/').pop() || 'index.html';
    return p;
  }

  function pageLabel(){
    return document.title.replace(/\s+—.*$/, '').replace(/\s+\|.*$/, '').trim() || file();
  }

  function parsePageSections(){
    if(window.Feedback && window.Feedback.parseSections){
      var secs = window.Feedback.parseSections(document);
      if(secs.length) return secs;
    }
    return [{ id:'general', label:'General feedback' }];
  }

  function injectStyles(){
    if(document.getElementById('sme-notes-style')) return;
    var css = `
      #sme-notes-fab{position:fixed;right:18px;bottom:18px;z-index:2147483600;display:inline-flex;align-items:center;gap:8px;padding:10px 16px;border:0;border-radius:999px;background:#DC183C;color:#fff;font:700 12px/1 'Plus Jakarta Sans',system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;box-shadow:0 8px 24px -6px rgba(220,24,60,.55),0 2px 6px rgba(0,0,0,.15);cursor:pointer;transition:transform .15s ease,box-shadow .15s ease}
      #sme-notes-fab:hover{transform:translateY(-1px);box-shadow:0 12px 30px -6px rgba(220,24,60,.65)}
      #sme-notes-fab .dot{width:8px;height:8px;border-radius:50%;background:#fff;box-shadow:0 0 0 3px rgba(255,255,255,.25)}
      #sme-notes-fab .count{background:rgba(255,255,255,.22);color:#fff;font-size:11px;padding:2px 7px;border-radius:999px;min-width:18px;text-align:center}
      #sme-suggest-fab{position:fixed;right:18px;bottom:70px;z-index:2147483600;display:inline-flex;align-items:center;gap:8px;padding:10px 16px;border:0;border-radius:999px;background:#3B82F6;color:#fff;font:700 12px/1 'Plus Jakarta Sans',system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;box-shadow:0 8px 24px -6px rgba(59,130,246,.55),0 2px 6px rgba(0,0,0,.15);cursor:pointer;transition:transform .15s ease,box-shadow .15s ease}
      #sme-suggest-fab:hover{transform:translateY(-1px);box-shadow:0 12px 30px -6px rgba(59,130,246,.65)}
      #sme-suggest-fab svg{width:14px;height:14px;stroke:currentColor;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round}
      #sme-devlink-fab{position:fixed;right:18px;bottom:122px;z-index:2147483600;display:inline-flex;align-items:center;gap:8px;padding:10px 16px;border:0;border-radius:999px;background:#29A37A;color:#fff;font:700 12px/1 'Plus Jakarta Sans',system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;box-shadow:0 8px 24px -6px rgba(41,163,122,.55),0 2px 6px rgba(0,0,0,.15);cursor:pointer;transition:transform .15s ease,box-shadow .15s ease}
      #sme-devlink-fab:hover{transform:translateY(-1px);box-shadow:0 12px 30px -6px rgba(41,163,122,.65)}
      #sme-devlink-fab svg{width:14px;height:14px;stroke:currentColor;stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round}
      #sme-notes-panel{position:fixed;top:0;right:0;height:100vh;width:min(440px,100vw);z-index:2147483601;background:#fff;color:#121A21;box-shadow:-12px 0 40px rgba(12,31,49,.25);transform:translateX(105%);transition:transform .25s cubic-bezier(.2,.7,.2,1);display:flex;flex-direction:column;font:14px/1.5 Inter,system-ui,sans-serif}
      #sme-notes-panel.open{transform:translateX(0)}
      #sme-notes-backdrop{position:fixed;inset:0;z-index:2147483599;background:rgba(12,31,49,.45);opacity:0;pointer-events:none;transition:opacity .2s ease}
      #sme-notes-backdrop.open{opacity:1;pointer-events:auto}
      .smn-h{padding:18px 22px;background:#0C1F31;color:#fff;display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
      .smn-h h2{margin:0;font:800 16px/1.25 'Plus Jakarta Sans',system-ui,sans-serif}
      .smn-h .sub{font-size:11px;color:rgba(255,255,255,.6);margin-top:4px;letter-spacing:.06em;text-transform:uppercase;font-weight:700}
      .smn-h button{background:transparent;border:0;color:rgba(255,255,255,.7);cursor:pointer;padding:4px}
      .smn-h button:hover{color:#fff}
      .smn-b{flex:1;overflow-y:auto;padding:6px 0}
      .smn-sec{padding:14px 22px;border-bottom:1px solid #F0F2F5}
      .smn-sec:last-child{border-bottom:0}
      .smn-sec .lab{font:700 11px/1 'Plus Jakarta Sans',system-ui,sans-serif;text-transform:uppercase;letter-spacing:.1em;color:#6A7581;margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;gap:8px}
      .smn-sec .lab a{color:#6A7581;text-decoration:none;font-size:10px;font-weight:600}
      .smn-sec .lab a:hover{color:#DC183C}
      .smn-sec textarea{width:100%;min-height:64px;padding:10px 12px;border:1px solid #E7EBEF;border-radius:8px;font:14px/1.5 Inter,system-ui,sans-serif;color:#121A21;background:#FCFCFC;resize:vertical;outline:none;transition:border-color .15s ease,box-shadow .15s ease}
      .smn-sec textarea:focus{border-color:#DC183C;box-shadow:0 0 0 3px rgba(220,24,60,.12);background:#fff}
      .smn-sec textarea.has{border-color:#DC183C;background:#fff}
      .smn-sec .meta{display:flex;align-items:center;justify-content:space-between;margin-top:6px;font-size:11px;color:#9aa3ac}
      .smn-sec .meta button{background:transparent;border:0;color:#9aa3ac;cursor:pointer;font-size:11px;text-decoration:underline}
      .smn-sec .meta button:hover{color:#DC183C}
      .smn-shared{padding:14px 22px;border-bottom:1px solid #F0F2F5;background:#FFF8E1;border-left:4px solid #AE6B0A}
      .smn-shared .head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}
      .smn-shared .lab{font:700 11px/1 'Plus Jakarta Sans',system-ui,sans-serif;text-transform:uppercase;letter-spacing:.1em;color:#5C3A00}
      .smn-shared .chip{font:800 9px/1 'Plus Jakarta Sans',system-ui,sans-serif;text-transform:uppercase;letter-spacing:.08em;background:#AE6B0A;color:#fff;padding:3px 7px;border-radius:999px;display:inline-flex;align-items:center;gap:4px}
      .smn-shared .chip .d{width:5px;height:5px;border-radius:50%;background:#FF9900;box-shadow:0 0 0 2px rgba(255,255,255,.3)}
      .smn-shared .body{font:14px/1.55 Inter,system-ui,sans-serif;color:#5C3A00;white-space:pre-wrap;word-wrap:break-word}
      .smn-shared .body code{background:rgba(174,107,10,.15);padding:1px 5px;border-radius:4px;font:12.5px/1.3 ui-monospace,SFMono-Regular,Menlo,monospace;color:#5C3A00}
      .smn-shared .body strong{color:#3E2600;font-weight:800}
      .smn-shared .ts{font-size:11px;color:#AE6B0A;margin-top:8px;font-weight:600}
      .smn-f{padding:14px 22px;border-top:1px solid #E7EBEF;background:#FCFCFC;display:flex;gap:8px;flex-wrap:wrap}
      .smn-f button{flex:1;min-width:140px;padding:10px 14px;border-radius:8px;font:700 12px/1 'Plus Jakarta Sans',system-ui,sans-serif;letter-spacing:.04em;text-transform:uppercase;cursor:pointer;border:1px solid #E7EBEF;background:#fff;color:#121A21;transition:background .15s ease,border-color .15s ease}
      .smn-f button:hover{background:#F4F6F8}
      .smn-f button.primary{background:#0C1F31;color:#fff;border-color:#0C1F31}
      .smn-f button.primary:hover{background:#16314a}
      .smn-f button.danger{color:#DC183C;border-color:#FDECEF}
      .smn-f button.danger:hover{background:#FDECEF}
      @media (max-width:600px){#sme-notes-fab{right:12px;bottom:12px;padding:9px 13px;font-size:11px}#sme-suggest-fab{right:12px;bottom:60px;padding:9px 13px;font-size:11px}#sme-devlink-fab{right:12px;bottom:108px;padding:9px 13px;font-size:11px}}
    `;
    var st = document.createElement('style');
    st.id = 'sme-notes-style';
    st.textContent = css;
    document.head.appendChild(st);
  }

  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }

  function debounce(fn, ms){
    var t; return function(){ var a=arguments, c=this; clearTimeout(t); t=setTimeout(function(){ fn.apply(c,a); }, ms); };
  }

  var SECTIONS = [];
  var FILE = '';

  function renderBody(text){
    if(!text) return '';
    var html = esc(text);
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    return html;
  }
  function renderPanel(){
    var rec = window.Feedback.get(FILE);
    var secs = rec.sections || {};
    var shared = window.Feedback.getShared ? window.Feedback.getShared(FILE) : {};
    var sharedKeys = Object.keys(shared);
    // Shared block — read-only, ships with repo
    var sharedHtml = sharedKeys.map(function(k){
      var s = shared[k];
      var ts = s.ts ? new Date(s.ts).toLocaleDateString('en-ZA',{day:'numeric',month:'short',year:'numeric'}) : '';
      return '<div class="smn-shared">'
           +   '<div class="head"><span class="lab">' + esc(s.label||k) + '</span>'
           +     '<span class="chip"><span class="d"></span>Shared · ' + esc(s.author||'team') + '</span></div>'
           +   '<div class="body">' + renderBody(s.text) + '</div>'
           +   (ts?'<p class="ts">'+ts+'</p>':'')
           + '</div>';
    }).join('');
    // Local block — editable, browser-local
    var rows = SECTIONS.map(function(s){
      var v = secs[s.id];
      var text = v ? v.text : '';
      var ts = v ? new Date(v.ts).toLocaleString('en-ZA') : '';
      var anchor = document.getElementById(s.id) ? '<a href="#' + esc(s.id) + '" onclick="document.getElementById(\'sme-notes-panel\').classList.remove(\'open\');document.getElementById(\'sme-notes-backdrop\').classList.remove(\'open\');">Jump to section →</a>' : '';
      return '<div class="smn-sec" data-sid="' + esc(s.id) + '" data-label="' + esc(s.label) + '">'
           +   '<div class="lab"><span>' + esc(s.label) + '</span>' + anchor + '</div>'
           +   '<textarea placeholder="Note for this section…" class="' + (text?'has':'') + '">' + esc(text) + '</textarea>'
           +   '<div class="meta"><span class="ts">' + (ts?'Saved '+ts:'') + '</span>' + (text?'<button class="clr">Clear</button>':'<span></span>') + '</div>'
           + '</div>';
    }).join('');
    document.querySelector('#sme-notes-panel .smn-b').innerHTML = sharedHtml + rows;
    var localTotal = Object.keys(secs).length;
    var grand = localTotal + sharedKeys.length;
    var parts = [];
    if(sharedKeys.length) parts.push(sharedKeys.length + ' shared');
    if(localTotal) parts.push(localTotal + ' yours');
    if(!parts.length) parts.push('0 notes');
    document.querySelector('#sme-notes-panel .smn-h .sub').textContent = grand + ' note' + (grand===1?'':'s') + ' (' + parts.join(' · ') + ') · ' + SECTIONS.length + ' section' + (SECTIONS.length===1?'':'s');
    wireRows();
    updateFab();
  }

  function wireRows(){
    document.querySelectorAll('#sme-notes-panel .smn-sec').forEach(function(row){
      var sid = row.getAttribute('data-sid');
      var label = row.getAttribute('data-label');
      var ta = row.querySelector('textarea');
      var clr = row.querySelector('.clr');
      var save = debounce(function(){
        window.Feedback.set(FILE, sid, label, ta.value);
        var ts = ta.value.trim() ? 'Saved ' + new Date().toLocaleString('en-ZA') : '';
        row.querySelector('.ts').textContent = ts;
        ta.classList.toggle('has', !!ta.value.trim());
        updateFab();
        try { window.parent && window.parent !== window && window.parent.postMessage({ type:'sme-feedback-changed', file: FILE }, '*'); } catch(_){}
      }, 400);
      ta.addEventListener('input', save);
      ta.addEventListener('blur', save);
      if(clr) clr.addEventListener('click', function(){
        ta.value = '';
        window.Feedback.clear(FILE, sid);
        renderPanel();
        try { window.parent && window.parent !== window && window.parent.postMessage({ type:'sme-feedback-changed', file: FILE }, '*'); } catch(_){}
      });
    });
  }

  function updateFab(){
    var fab = document.getElementById('sme-notes-fab');
    if(!fab) return;
    var counts = window.Feedback.countTotalByFile ? window.Feedback.countTotalByFile() : window.Feedback.countByFile();
    var n = counts[FILE] || 0;
    var c = fab.querySelector('.count');
    if(n){ c.textContent = n; c.style.display=''; }
    else { c.style.display='none'; }
  }

  function copyMarkdown(){
    var md = window.Feedback.exportMarkdown(FILE, pageLabel());
    try {
      navigator.clipboard.writeText(md).then(function(){
        toast('Copied as Markdown');
      });
    } catch(e){
      // fallback
      var ta = document.createElement('textarea');
      ta.value = md; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); toast('Copied as Markdown'); } catch(_) { toast('Copy failed — select manually'); }
      ta.remove();
    }
  }

  function clearAll(){
    if(!confirm('Clear all notes for this mockup?')) return;
    window.Feedback.clearFile(FILE);
    renderPanel();
    try { window.parent && window.parent !== window && window.parent.postMessage({ type:'sme-feedback-changed', file: FILE }, '*'); } catch(_){}
  }

  function toast(msg){
    var t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:80px;right:18px;z-index:2147483602;background:#0C1F31;color:#fff;padding:10px 18px;border-radius:999px;font:700 12px/1 \'Plus Jakarta Sans\',sans-serif;box-shadow:0 8px 20px rgba(0,0,0,.25);opacity:0;transition:opacity .2s';
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function(){ t.style.opacity='1'; });
    setTimeout(function(){ t.style.opacity='0'; setTimeout(function(){ t.remove(); }, 250); }, 1800);
  }

  function openPanel(){
    document.getElementById('sme-notes-panel').classList.add('open');
    document.getElementById('sme-notes-backdrop').classList.add('open');
    renderPanel();
  }
  function closePanel(){
    document.getElementById('sme-notes-panel').classList.remove('open');
    document.getElementById('sme-notes-backdrop').classList.remove('open');
  }

  function build(){
    injectStyles();
    FILE = file();
    SECTIONS = parsePageSections();

    var fab = document.createElement('button');
    fab.id = 'sme-notes-fab';
    fab.title = 'Add review notes';
    fab.innerHTML = '<span class="dot"></span>Review<span class="count" style="display:none">0</span>';
    fab.addEventListener('click', openPanel);
    document.body.appendChild(fab);

    // Suggest button — only shown when SmeSuggest is available.
    // Sits stacked above the Review button so it's discoverable without competing.
    if(window.SmeSuggest){
      var sug = document.createElement('button');
      sug.id = 'sme-suggest-fab';
      sug.title = 'Suggest a change on this mockup — becomes a GitHub Issue for Tshepho to review';
      sug.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/></svg>Suggest';
      sug.addEventListener('click', function(){ window.SmeSuggest.open(FILE); });
      document.body.appendChild(sug);
    }

    // Dev-link button — only shown when SmeDevLink is available.
    // Stacks above Suggest. Green to signal dev/staging as opposed to review chatter.
    if(window.SmeDevLink){
      var dl = document.createElement('button');
      dl.id = 'sme-devlink-fab';
      dl.title = 'Attach a dev / staging URL for this mockup — becomes a GitHub Issue for Tshepho to accept';
      dl.innerHTML = '<svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>Dev link';
      dl.addEventListener('click', function(){ window.SmeDevLink.open(FILE); });
      document.body.appendChild(dl);
    }

    var bd = document.createElement('div');
    bd.id = 'sme-notes-backdrop';
    bd.addEventListener('click', closePanel);
    document.body.appendChild(bd);

    var panel = document.createElement('aside');
    panel.id = 'sme-notes-panel';
    panel.innerHTML = ''
      + '<div class="smn-h">'
      +   '<div><h2>Review notes</h2><div class="sub">0 notes</div></div>'
      +   '<button class="x" title="Close" aria-label="Close">✕</button>'
      + '</div>'
      + '<div class="smn-b"></div>'
      + '<div class="smn-f">'
      +   '<button class="primary copy">Copy as Markdown</button>'
      +   '<button class="danger clearall">Clear all</button>'
      + '</div>';
    document.body.appendChild(panel);

    panel.querySelector('.x').addEventListener('click', closePanel);
    panel.querySelector('.copy').addEventListener('click', copyMarkdown);
    panel.querySelector('.clearall').addEventListener('click', clearAll);

    // Marker — keeps widget idempotent if iframe reloads
    var marker = document.createElement('meta');
    marker.id = 'sme-notes-widget';
    marker.name = 'sme-notes-widget';
    marker.content = 'on';
    document.head.appendChild(marker);

    window.addEventListener('sme-feedback-changed', updateFab);
    updateFab();
  }

  load(build);
})();
