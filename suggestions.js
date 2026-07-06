/*
 * SME South Africa — Dev suggestions bridge.
 * Opens a "Suggest a change" modal that submits the suggestion as a
 * pre-filled GitHub Issue (labelled `dev-suggestion`). Tshepho reviews
 * open issues in Mission Control's SUGGESTIONS panel.
 *
 * The dev needs a free GitHub account. Nothing is sent from this page —
 * the submit button opens the pre-filled issue form on github.com in
 * a new tab; the dev clicks Submit there.
 */
(function(global){
  'use strict';
  var REPO = 'SMEZATech/smehubmockups';
  var LABEL = 'dev-suggestion';
  var STYLE_ID = 'sme-suggest-style';
  var MODAL_ID = 'sme-suggest-modal';

  function getPageFile(){
    var p = (location.pathname.split('/').pop() || '').trim();
    if(!p || p === '') return 'index.html';
    return p;
  }
  function detectSection(){
    var candidates = document.querySelectorAll('section[data-section-label], section[id], main > article');
    if(!candidates.length) return { id:'general', label:'General feedback' };
    var y = window.scrollY + Math.min(200, window.innerHeight/3);
    var closest = null, closestDist = Infinity;
    candidates.forEach(function(s){
      var top = s.getBoundingClientRect().top + window.scrollY;
      var dist = Math.abs(top - y);
      if(dist < closestDist){ closest = s; closestDist = dist; }
    });
    if(!closest) return { id:'general', label:'General feedback' };
    var h = closest.querySelector('h1, h2');
    var label = closest.getAttribute('data-section-label')
             || (h && h.textContent && h.textContent.trim())
             || closest.id
             || 'General';
    return { id: closest.id || 'general', label: label };
  }

  function injectStyles(){
    if(document.getElementById(STYLE_ID)) return;
    var css = ''
      + '#'+MODAL_ID+'{position:fixed;inset:0;z-index:2147483602;display:none;align-items:center;justify-content:center;padding:16px;font-family:Inter,system-ui,sans-serif}'
      + '#'+MODAL_ID+'.open{display:flex}'
      + '#'+MODAL_ID+' .bg{position:absolute;inset:0;background:rgba(12,31,49,.55);backdrop-filter:blur(3px)}'
      + '#'+MODAL_ID+' .card{position:relative;background:#fff;border-radius:16px;max-width:520px;width:100%;max-height:92vh;overflow-y:auto;padding:24px;box-shadow:0 24px 60px -12px rgba(0,0,0,.4)}'
      + '#'+MODAL_ID+' .head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:8px}'
      + '#'+MODAL_ID+' .head p.eyebrow{font:800 10px/1 "Plus Jakarta Sans",sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#3B82F6;margin:0 0 4px}'
      + '#'+MODAL_ID+' h3{margin:0;font:800 18px/1.25 "Plus Jakarta Sans",system-ui,sans-serif;color:#121A21}'
      + '#'+MODAL_ID+' .sub{color:#6A7581;font-size:13px;margin:6px 0 14px;line-height:1.5}'
      + '#'+MODAL_ID+' label{display:block;font:800 10px/1 "Plus Jakarta Sans",sans-serif;text-transform:uppercase;letter-spacing:.12em;color:#6A7581;margin:14px 0 6px}'
      + '#'+MODAL_ID+' input,#'+MODAL_ID+' textarea{width:100%;padding:10px 12px;border:1px solid #E7EBEF;border-radius:8px;font:14px Inter,system-ui,sans-serif;color:#121A21;outline:none;box-sizing:border-box}'
      + '#'+MODAL_ID+' textarea{resize:vertical;min-height:110px;line-height:1.5}'
      + '#'+MODAL_ID+' input:focus,#'+MODAL_ID+' textarea:focus{border-color:#3B82F6;box-shadow:0 0 0 3px rgba(59,130,246,.15)}'
      + '#'+MODAL_ID+' .btns{display:flex;gap:8px;margin-top:18px}'
      + '#'+MODAL_ID+' .btns button{flex:1;padding:12px 16px;border-radius:8px;font:800 12px/1 "Plus Jakarta Sans",sans-serif;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;border:0;transition:filter .15s ease}'
      + '#'+MODAL_ID+' .btns button:hover{filter:brightness(.94)}'
      + '#'+MODAL_ID+' .btns .cancel{background:#F0F2F5;color:#121A21}'
      + '#'+MODAL_ID+' .btns .submit{background:#3B82F6;color:#fff}'
      + '#'+MODAL_ID+' .hint{margin-top:12px;padding:10px 12px;background:#EFF6FF;border-radius:8px;font-size:12px;color:#1E40AF;line-height:1.5;border-left:3px solid #3B82F6}'
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
      +     '<div><p class="eyebrow">Dev suggestion</p><h3>Suggest a change</h3></div>'
      +     '<button class="x" type="button" aria-label="Close">&#10005;</button>'
      +   '</div>'
      +   '<p class="sub">Your suggestion becomes a GitHub Issue that Tshepho reviews in Mission Control. Nothing goes public until it’s approved.</p>'
      +   '<label>Your name</label>'
      +   '<input id="sme-sug-name" placeholder="e.g. Andile" />'
      +   '<label>Mockup / page</label>'
      +   '<input id="sme-sug-file" />'
      +   '<label>Section</label>'
      +   '<input id="sme-sug-section" placeholder="e.g. First section" />'
      +   '<label>Suggestion</label>'
      +   '<textarea id="sme-sug-text" placeholder="What should change? Be specific &mdash; sizes, colours, copy, whatever."></textarea>'
      +   '<div class="hint">Clicking submit opens the pre-filled issue form on <b>github.com</b> in a new tab. You need a free GitHub account. Nothing is sent from this page.</div>'
      +   '<div class="btns"><button class="cancel" type="button">Cancel</button><button class="submit" type="button">Submit to GitHub →</button></div>'
      + '</div>';
    document.body.appendChild(m);
    m.querySelector('.bg').addEventListener('click', close);
    m.querySelector('.x').addEventListener('click', close);
    m.querySelector('.cancel').addEventListener('click', close);
    m.querySelector('.submit').addEventListener('click', submit);
    return m;
  }

  function open(prefillFile, prefillSection){
    var m = ensureModal();
    var section = prefillSection || detectSection().label;
    document.getElementById('sme-sug-file').value = prefillFile || getPageFile();
    document.getElementById('sme-sug-section').value = section;
    document.getElementById('sme-sug-name').value = localStorage.getItem('smeSuggestName') || '';
    document.getElementById('sme-sug-text').value = '';
    m.classList.add('open');
    setTimeout(function(){ document.getElementById('sme-sug-text').focus(); }, 80);
  }
  function close(){
    var m = document.getElementById(MODAL_ID);
    if(m) m.classList.remove('open');
  }
  function submit(){
    var name = (document.getElementById('sme-sug-name').value || '').trim();
    var file = (document.getElementById('sme-sug-file').value || '').trim();
    var section = (document.getElementById('sme-sug-section').value || '').trim();
    var text = (document.getElementById('sme-sug-text').value || '').trim();
    if(!name){ alert('Please add your name.'); return; }
    if(!section){ alert('Please add a section label.'); return; }
    if(!text){ alert('Please write your suggestion.'); return; }
    localStorage.setItem('smeSuggestName', name);
    var title = '[Dev suggestion] ' + file + ' · ' + section;
    var body = '**Mockup:** ' + file + '\n**Section:** ' + section + '\n**From:** ' + name + '\n\n---\n\n' + text;
    var url = 'https://github.com/' + REPO + '/issues/new'
      + '?title=' + encodeURIComponent(title)
      + '&body=' + encodeURIComponent(body)
      + '&labels=' + encodeURIComponent(LABEL);
    window.open(url, '_blank', 'noopener');
    close();
  }

  global.SmeSuggest = {
    REPO: REPO,
    LABEL: LABEL,
    open: open,
    close: close,
    detectSection: detectSection,
    getPageFile: getPageFile
  };
})(typeof window !== 'undefined' ? window : this);
