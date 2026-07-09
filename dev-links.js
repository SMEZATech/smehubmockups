/*
 * SME South Africa — Dev-link bridge.
 * Mirrors suggestions.js: opens an "Add dev link" modal that submits the
 * staging URL as a pre-filled GitHub Issue (labelled `dev-link`). Tshepho
 * accepts it in Mission Control and it gets written into status.js
 * (window.MOCKUP_DEV) on the next publish.
 *
 * Author is Sandile by default (single dev).
 */
(function(global){
  'use strict';
  var REPO = 'SMEZATech/smehubmockups';
  var LABEL = 'dev-link';
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
      +   '<p class="sub">Attach your staging URL to this mockup so Tshepho can wire it into Mission Control. Nothing goes live until it&rsquo;s accepted.</p>'
      +   '<label>Mockup / page</label>'
      +   '<input id="sme-dl-file" />'
      +   '<label>Dev / staging URL</label>'
      +   '<input id="sme-dl-url" placeholder="https://staging.smesouthafrica.co.za/…" />'
      +   '<label>Notes <span style="text-transform:none;letter-spacing:0;font-weight:400;color:#9aa3ac">(optional)</span></label>'
      +   '<textarea id="sme-dl-notes" placeholder="Anything worth flagging — auth, known issues, deploy branch, etc."></textarea>'
      +   '<input type="hidden" id="sme-dl-name" value="Sandile" />'
      +   '<div class="btns"><button class="cancel" type="button">Cancel</button><button class="submit" type="button">Submit dev link</button></div>'
      + '</div>';
    document.body.appendChild(m);
    m.querySelector('.bg').addEventListener('click', close);
    m.querySelector('.x').addEventListener('click', close);
    m.querySelector('.cancel').addEventListener('click', close);
    m.querySelector('.submit').addEventListener('click', submit);
    return m;
  }

  function open(prefillFile, prefillUrl){
    var m = ensureModal();
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
  function submit(){
    var name = (document.getElementById('sme-dl-name').value || 'Sandile').trim() || 'Sandile';
    var file = (document.getElementById('sme-dl-file').value || '').trim();
    var url = (document.getElementById('sme-dl-url').value || '').trim();
    var notes = (document.getElementById('sme-dl-notes').value || '').trim();
    if(!file){ alert('Please add the mockup filename.'); return; }
    if(!url){ alert('Please add the dev URL.'); return; }
    if(!/^https?:\/\//i.test(url)){ alert('Dev URL must start with http:// or https://'); return; }
    var title = '[Dev link] ' + file + ' → ' + url;
    var body = '**Mockup:** ' + file
      + '\n**Dev URL:** ' + url
      + '\n**From:** ' + name
      + (notes ? '\n\n---\n\n' + notes : '');
    var issueUrl = 'https://github.com/' + REPO + '/issues/new'
      + '?title=' + encodeURIComponent(title)
      + '&body=' + encodeURIComponent(body)
      + '&labels=' + encodeURIComponent(LABEL);
    window.open(issueUrl, '_blank', 'noopener');
    close();
  }

  global.SmeDevLink = {
    REPO: REPO,
    LABEL: LABEL,
    open: open,
    close: close,
    getPageFile: getPageFile
  };
})(typeof window !== 'undefined' ? window : this);
