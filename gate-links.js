/*
 * Link gate — neutralises any anchor on a finalised page that points to a
 * not-yet-finalised mockup. Driven by window.MOCKUP_STATUS (set by status.js).
 * Include after status.js on any finalised public page. Re-runs via MutationObserver
 * so dynamically rendered cards/lists stay gated.
 */
(function(){
  var STATUS = window.MOCKUP_STATUS || {};
  var hasStatus = Object.keys(STATUS).length > 0;
  if (!hasStatus) return;

  function fileFromHref(href){
    if (!href) return null;
    if (/^(https?:|mailto:|tel:|javascript:)/i.test(href)) return null;
    if (href.charAt(0) === '#') return null;
    var clean = href.split('#')[0].split('?')[0];
    if (clean.indexOf('://') >= 0) return null;
    clean = clean.replace(/^\.\//, '').replace(/^\//, '');
    var parts = clean.split('/');
    var last = parts[parts.length - 1];
    if (!last || last.indexOf('.html') < 0) return null;
    return last;
  }

  function showToast(msg){
    if (typeof window.showToast === 'function'){
      try { window.showToast(msg); return; } catch(_){}
    }
    var t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#0C1F31;color:#fff;padding:10px 16px;border-radius:9999px;font:600 13px Inter,system-ui,sans-serif;box-shadow:0 8px 24px rgba(0,0,0,.2);z-index:99999;opacity:0;transition:opacity .2s;pointer-events:none';
    document.body.appendChild(t);
    requestAnimationFrame(function(){ t.style.opacity = '1'; });
    setTimeout(function(){ t.style.opacity = '0'; setTimeout(function(){ if (t.parentNode) t.parentNode.removeChild(t); }, 220); }, 2000);
  }

  function gateAnchor(a){
    if (!a || a.dataset.gated === '1' || a.dataset.gated === 'ok') return;
    var href = a.getAttribute('href');
    var file = fileFromHref(href);
    if (!file) return;
    if (!(file in STATUS)) return;
    if (STATUS[file] === 'finalised'){ a.dataset.gated = 'ok'; return; }
    a.dataset.gated = '1';
    a.setAttribute('aria-disabled', 'true');
    if (!a.getAttribute('title')) a.setAttribute('title', 'Coming soon — not yet finalised');
    a.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();
      showToast('Coming soon — this page is not yet finalised.');
    }, true);
  }

  function gateAll(root){
    var anchors = (root || document).querySelectorAll('a[href]');
    for (var i = 0; i < anchors.length; i++) gateAnchor(anchors[i]);
  }

  function start(){
    gateAll(document);
    if (typeof MutationObserver === 'function'){
      var obs = new MutationObserver(function(muts){
        for (var i = 0; i < muts.length; i++){
          var added = muts[i].addedNodes;
          for (var j = 0; j < added.length; j++){
            var n = added[j];
            if (!n || n.nodeType !== 1) continue;
            if (n.matches && n.matches('a[href]')) gateAnchor(n);
            if (n.querySelectorAll) gateAll(n);
          }
        }
      });
      obs.observe(document.body, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }

  // Expose for any page that renders cards/lists after page load
  window.applyLinkGates = gateAll;
})();
