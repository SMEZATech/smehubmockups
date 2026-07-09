/*
 * SME South Africa — Dev-link bridge.
 * Opens an "Add dev link" modal so Sandile can attach a staging URL to
 * any mockup without routing through GitHub or Slack.
 *
 * On submit the entry is stored locally under `smeDevLinkOutbox` and shown
 * as a success confirmation. Production will replace the outbox step with
 * a private webhook (e.g. Formspree / Netlify Forms) that emails
 * adops@adclickafrica.com; Mission Control fetches from that endpoint.
 *
 * IMPORTANT: never redirect to github.com — Tshepho keeps the repo
 * private from the dev.
 */
(function(global){
  'use strict';
  var OUTBOX_KEY = 'smeDevLinkOutbox';
  var MAIL_TO = 'adops@adclickafrica.com'; // Tshepho — interim delivery until an auto endpoint is chosen
  var STYLE_ID = 'sme-devlink-style';
  var MODAL_ID = 'sme-devlink-modal';

  function getPageFile(){
    var p = (location.pathname.split('/').pop() || '').trim();
    if(!p || p === '') return 'index.html';
    return p;
  }

  function injectStyles(){
    if(document.getElementById(STYLE_ID)) return;
    var css = ''
      + '#'+MODAL_ID+'{position:fixed;inset:0;z-index:2147483602;display:none;align-items:center;justify-content:center;padding:16px;font-family:Inter,system-ui,sans-serif}'
      + '#'+MODAL_ID+'.open{display:flex}'
      + '#'+MODAL_ID+' .bg{position:absolute;inset:0;background:rgba(12,31,49,.55);backdrop-filter:blur(3px)}'
      + '#'+MODAL_ID+' .card{position:relative;background:#fff;border-radius:16px;max-width:520px;width:100%;max-height:92vh;overflow-y:auto;padding:24px;box-shadow:0 24px 60px -12px rgba(0,0,0,.4)}'
      + '#'+MODAL_ID+' .head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:8px}'
      + '#'+MODAL_ID+' .head p.eyebrow{font:800 10px/1 "Plus Jakarta Sans",sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#29A37A;margin:0 0 4px}'
      + '#'+MODAL_ID+' h3{margin:0;font:800 18px/1.25 "Plus Jakarta Sans",system-ui,sans-serif;color:#121A21}'
      + '#'+MODAL_ID+' .sub{color:#6A7581;font-size:13px;margin:6px 0 14px;line-height:1.5}'
      + '#'+MODAL_ID+' label{display:block;font:800 10px/1 "Plus Jakarta Sans",sans-serif;text-transform:uppercase;letter-spacing:.12em;color:#6A7581;margin:14px 0 6px}'
      + '#'+MODAL_ID+' input,#'+MODAL_ID+' textarea{width:100%;padding:10px 12px;border:1px solid #E7EBEF;border-radius:8px;font:14px Inter,system-ui,sans-serif;color:#121A21;outline:none;box-sizing:border-box}'
      + '#'+MODAL_ID+' textarea{resize:vertical;min-height:80px;line-height:1.5}'
      + '#'+MODAL_ID+' input:focus,#'+MODAL_ID+' textarea:focus{border-color:#29A37A;box-shadow:0 0 0 3px rgba(41,163,122,.15)}'
      + '#'+MODAL_ID+' .btns{display:flex;gap:8px;margin-top:18px}'
      + '#'+MODAL_ID+' .btns button{flex:1;padding:12px 16px;border-radius:8px;font:800 12px/1 "Plus Jakarta Sans",sans-serif;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;border:0;transition:filter .15s ease}'
      + '#'+MODAL_ID+' .btns button:hover{filter:brightness(.94)}'
      + '#'+MODAL_ID+' .btns .cancel{background:#F0F2F5;color:#121A21}'
      + '#'+MODAL_ID+' .btns .submit{background:#29A37A;color:#fff}'
      + '#'+MODAL_ID+' .x{background:transparent;border:0;color:#6A7581;cursor:pointer;padding:4px;font-size:20px;line-height:1}'
      + '#'+MODAL_ID+' .x:hover{color:#121A21}';
    var st = document.createElement('style'); st.id = STYLE_ID; st.textContent = css;
    document.head.appendChild(st);
  }

  function ensureModal(){
    var m = document.getElementById(MODAL_ID);
    if(m) return m;
    injectStyles();
    m = document.createElement('div');
    m.id = MODAL_ID;
    m.innerHTML = ''
      + '<div class="bg"></div>'
      + '<div class="card">'
      +   '<div class="head">'
      +     '<div><p class="eyebrow">Dev link</p><h3>Add dev / staging URL</h3></div>'
      +     '<button class="x" type="button" aria-label="Close">&#10005;</button>'
      +   '</div>'
      +   '<p class="sub">Attach your staging URL to this mockup so Tshepho can wire it in. Nothing goes live until it&rsquo;s accepted.</p>'
      +   '<div id="sme-dl-form">'
      +     '<label>Mockup / page</label>'
      +     '<input id="sme-dl-file" />'
      +     '<label>Dev / staging URL</label>'
      +     '<input id="sme-dl-url" placeholder="https://staging.smesouthafrica.co.za/…" />'
      +     '<label>Notes <span style="text-transform:none;letter-spacing:0;font-weight:400;color:#9aa3ac">(optional)</span></label>'
      +     '<textarea id="sme-dl-notes" placeholder="Anything worth flagging — auth, known issues, deploy branch, etc."></textarea>'
      +     '<input type="hidden" id="sme-dl-name" value="Sandile" />'
      +     '<div class="btns"><button class="cancel" type="button">Cancel</button><button class="submit" type="button">Continue &rarr;</button></div>'
      +   '</div>'
      +   '<div id="sme-dl-success" style="display:none;padding:4px 2px 2px">'
      +     '<div style="text-align:center;margin-bottom:14px">'
      +       '<div style="width:52px;height:52px;border-radius:50%;background:#29A37A1a;color:#29A37A;display:grid;place-items:center;margin:0 auto 10px"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></div>'
      +       '<p style="font:800 17px/1.3 \'Plus Jakarta Sans\',sans-serif;color:#121A21;margin:0 0 6px">Ready to send to Tshepho</p>'
      +       '<p style="color:#6A7581;font-size:13px;margin:0;line-height:1.5">Copy this or email it &mdash; she wires the dev link into the hub from Mission Control.</p>'
      +     '</div>'
      +     '<textarea id="sme-dl-payload" readonly style="width:100%;min-height:118px;font:12px/1.5 ui-monospace,Menlo,monospace;background:#F7F9FB;color:#121A21;border:1px solid #E7EBEF;border-radius:8px;padding:10px 12px;resize:vertical;box-sizing:border-box"></textarea>'
      +     '<div class="btns"><button class="cancel" id="sme-dl-copy" type="button">Copy</button><button class="submit" id="sme-dl-email" type="button">Email to Tshepho</button></div>'
      +     '<div style="text-align:center;margin-top:10px"><button id="sme-dl-close-ok" type="button" style="background:transparent;border:0;color:#9aa3ac;font-size:12px;cursor:pointer;text-decoration:underline">Close</button></div>'
      +   '</div>'
      + '</div>';
    document.body.appendChild(m);
    m.querySelector('.bg').addEventListener('click', close);
    m.querySelector('.x').addEventListener('click', close);
    m.querySelector('#sme-dl-form .cancel').addEventListener('click', close);
    m.querySelector('#sme-dl-form .submit').addEventListener('click', submit);
    m.querySelector('#sme-dl-close-ok').addEventListener('click', close);
    m.querySelector('#sme-dl-copy').addEventListener('click', copyPayload);
    m.querySelector('#sme-dl-email').addEventListener('click', emailPayload);
    return m;
  }

  function resetView(){
    var f = document.getElementById('sme-dl-form');
    var s = document.getElementById('sme-dl-success');
    if(f) f.style.display = '';
    if(s) s.style.display = 'none';
  }

  function open(prefillFile, prefillUrl){
    var m = ensureModal();
    resetView();
    document.getElementById('sme-dl-file').value = prefillFile || getPageFile();
    document.getElementById('sme-dl-url').value = prefillUrl || '';
    document.getElementById('sme-dl-notes').value = '';
    m.classList.add('open');
    setTimeout(function(){ document.getElementById('sme-dl-url').focus(); }, 80);
  }
  function close(){
    var m = document.getElementById(MODAL_ID);
    if(m) m.classList.remove('open');
  }
  var _payload = '';
  function submit(){
    var name = (document.getElementById('sme-dl-name').value || 'Sandile').trim() || 'Sandile';
    var file = (document.getElementById('sme-dl-file').value || '').trim();
    var url = (document.getElementById('sme-dl-url').value || '').trim();
    var notes = (document.getElementById('sme-dl-notes').value || '').trim();
    if(!file){ alert('Please add the mockup filename.'); return; }
    if(!url){ alert('Please add the dev URL.'); return; }
    if(!/^https?:\/\//i.test(url)){ alert('Dev URL must start with http:// or https://'); return; }

    // Compose a plain-text record the dev copies or emails to Tshepho. No fake
    // "sent" — delivery is an explicit copy/email action, honest and infra-free.
    // (Upgrade path: a Cloudflare Worker or form endpoint can auto-deliver later.)
    _payload = 'Dev link — ' + file
      + '\nStaging URL: ' + url
      + '\nFrom: ' + name
      + (notes ? '\nNotes: ' + notes : '');

    // Keep a personal log on the dev's own device (not a delivery channel).
    try {
      var outbox = JSON.parse(localStorage.getItem(OUTBOX_KEY) || '[]');
      outbox.push({ file:file, url:url, notes:notes, from:name });
      localStorage.setItem(OUTBOX_KEY, JSON.stringify(outbox));
    } catch(_){}

    var ta = document.getElementById('sme-dl-payload');
    if(ta) ta.value = _payload;
    document.getElementById('sme-dl-form').style.display = 'none';
    document.getElementById('sme-dl-success').style.display = '';
  }

  function copyPayload(){
    var ta = document.getElementById('sme-dl-payload');
    var btn = document.getElementById('sme-dl-copy');
    function done(ok){ if(btn){ btn.textContent = ok ? 'Copied ✓' : 'Press Ctrl+C'; setTimeout(function(){ if(btn) btn.textContent='Copy'; }, 1800); } }
    try {
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(_payload).then(function(){ done(true); }, function(){ if(ta){ ta.focus(); ta.select(); } done(false); });
        return;
      }
    } catch(_){}
    if(ta){ ta.focus(); ta.select(); try { document.execCommand('copy'); done(true); } catch(_){ done(false); } }
  }

  function emailPayload(){
    var file = (document.getElementById('sme-dl-file') && document.getElementById('sme-dl-file').value) || '';
    var subject = 'Dev link — ' + file;
    var href = 'mailto:' + MAIL_TO + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(_payload);
    window.location.href = href;
  }

  function readOutbox(){
    try { return JSON.parse(localStorage.getItem(OUTBOX_KEY) || '[]'); } catch(_){ return []; }
  }
  function clearOutbox(){
    try { localStorage.removeItem(OUTBOX_KEY); } catch(_){}
  }

  global.SmeDevLink = {
    open: open,
    close: close,
    getPageFile: getPageFile,
    readOutbox: readOutbox,
    clearOutbox: clearOutbox
  };
})(typeof window !== 'undefined' ? window : this);
