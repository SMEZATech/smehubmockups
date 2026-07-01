/*
 * SME South Africa — Mockup review feedback store.
 * Shared between the launcher (index.html) and the in-mockup widget (notes-widget.js).
 * Same origin (localhost:5500 / GitHub Pages) → shared localStorage.
 * Storage shape:
 *   key   = "sme-feedback"
 *   value = { [file]: { [sectionId]: { label, text, ts } } }
 */
(function(global){
  'use strict';
  var KEY = 'sme-feedback';

  function read(){
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); }
    catch(e){ return {}; }
  }
  function write(data){
    try { localStorage.setItem(KEY, JSON.stringify(data)); }
    catch(e){}
    // same-window listeners (storage event only fires on OTHER windows)
    try { window.dispatchEvent(new CustomEvent('sme-feedback-changed')); } catch(e){}
  }
  function slug(s){
    return String(s||'').toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'') || 'section';
  }

  var Feedback = {
    KEY: KEY,

    // ---- read ----
    get: function(file){
      var data = read();
      return (data[file] && data[file].sections) ? data[file] : { sections:{} };
    },
    countByFile: function(){
      var data = read(), out = {};
      Object.keys(data).forEach(function(f){
        var n = 0;
        var secs = (data[f] && data[f].sections) || {};
        Object.keys(secs).forEach(function(s){
          if(secs[s] && secs[s].text && secs[s].text.trim()) n++;
        });
        if(n) out[f] = n;
      });
      return out;
    },

    // ---- write ----
    set: function(file, sectionId, label, text){
      var data = read();
      if(!data[file]) data[file] = { sections:{} };
      if(!data[file].sections) data[file].sections = {};
      var t = (text||'').trim();
      if(!t){
        delete data[file].sections[sectionId];
        if(!Object.keys(data[file].sections).length) delete data[file];
      } else {
        data[file].sections[sectionId] = { label: label || sectionId, text: t, ts: new Date().toISOString() };
      }
      write(data);
    },
    clear: function(file, sectionId){
      var data = read();
      if(data[file] && data[file].sections){
        delete data[file].sections[sectionId];
        if(!Object.keys(data[file].sections).length) delete data[file];
        write(data);
      }
    },
    clearFile: function(file){
      var data = read();
      if(data[file]){ delete data[file]; write(data); }
    },

    // ---- section parsing ----
    // Given a parsed Document, return [{id, label}, …] in source order, deduped.
    parseSections: function(doc){
      var out = [], seen = {};
      var nodes = doc.querySelectorAll('section, main > article, [data-section-label]');
      var i = 0;
      nodes.forEach(function(node){
        // skip the dev banner / placeholder / header / footer wrappers
        if(node.closest && (node.closest('header.bg-slate-100') || node.closest('footer.bg-slate-100'))) return;
        if(node.matches && node.matches('.bg-\\[\\#FFF8E1\\]')) return;
        var label = node.getAttribute('data-section-label')
                 || textOf(node.querySelector('h1, h2'))
                 || textOf(node.querySelector('h3'))
                 || node.id
                 || ('Section ' + (++i));
        var id = node.id || node.getAttribute('data-section-id') || slug(label);
        // dedupe by id
        if(seen[id]) id = id + '-' + (i+1);
        seen[id] = true;
        out.push({ id: id, label: label });
      });
      // de-noise: drop very short labels (< 2 chars)
      return out.filter(function(s){ return s.label && s.label.length > 1; });
    },
    loadSections: function(file){
      return fetch(file, { cache:'no-store' })
        .then(function(r){ return r.text(); })
        .then(function(html){
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var secs = Feedback.parseSections(doc);
          if(!secs.length) secs = [{ id:'general', label:'General feedback' }];
          return secs;
        })
        .catch(function(){ return [{ id:'general', label:'General feedback' }]; });
    },

    // ---- export ----
    exportMarkdown: function(file, fileLabel){
      var rec = Feedback.get(file);
      var secs = rec.sections || {};
      var keys = Object.keys(secs);
      if(!keys.length) return '# ' + (fileLabel||file) + ' — no notes\n';
      var lines = ['# ' + (fileLabel || file) + ' — ' + keys.length + ' note' + (keys.length===1?'':'s'), ''];
      keys.forEach(function(k){
        var s = secs[k];
        lines.push('## ' + s.label);
        lines.push(s.text);
        lines.push('');
        lines.push('_Last edited ' + new Date(s.ts).toLocaleString('en-ZA') + '_');
        lines.push('');
      });
      return lines.join('\n');
    },
    exportAllMarkdown: function(fileLabelLookup){
      var data = read();
      var files = Object.keys(data);
      if(!files.length) return '# No review notes yet\n';
      var out = ['# Review notes — ' + new Date().toLocaleString('en-ZA'), ''];
      files.forEach(function(f){
        out.push(Feedback.exportMarkdown(f, fileLabelLookup ? fileLabelLookup(f) : f));
        out.push('---');
        out.push('');
      });
      return out.join('\n');
    }
  };

  // Cross-window sync — storage event fires when ANOTHER window writes.
  try {
    window.addEventListener('storage', function(e){
      if(e.key === KEY){
        try { window.dispatchEvent(new CustomEvent('sme-feedback-changed')); } catch(_){}
      }
    });
  } catch(e){}

  global.Feedback = Feedback;
})(typeof window !== 'undefined' ? window : this);
