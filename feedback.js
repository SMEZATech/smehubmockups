/*
 * SME South Africa — Shared review notes reader (launcher only).
 *
 * READ-ONLY. Notes are authored by Tshepho in Mission Control (control.html)
 * and committed to shared-notes.js, so they persist and everyone sees them.
 *
 * The old browser-local note fields (per-section textareas in the launcher and
 * the in-mockup Review widget) were removed: they wrote to localStorage only,
 * so anything typed there vanished on the next push. Nothing on the public hub
 * writes notes any more.
 *
 * Notes flagged `pending: true` stay in Mission Control for operator review and
 * do NOT surface here until that flag is stripped on PUBLISH LIVE.
 */
(function(global){
  'use strict';

  var Feedback = {
    // All non-pending shared notes for one mockup file.
    getShared: function(file){
      var s = (global.SHARED_NOTES || {})[file] || {};
      var out = {};
      Object.keys(s).forEach(function(k){
        if(!s[k] || !s[k].pending) out[k] = s[k];
      });
      return out;
    },

    // { [file]: count } of non-pending shared notes — drives the nav pills.
    countSharedByFile: function(){
      var s = global.SHARED_NOTES || {}, out = {};
      Object.keys(s).forEach(function(f){
        var secs = s[f] || {};
        var n = 0;
        Object.keys(secs).forEach(function(k){ if(!secs[k] || !secs[k].pending) n++; });
        if(n) out[f] = n;
      });
      return out;
    },

    exportMarkdown: function(file, fileLabel){
      var shared = Feedback.getShared(file);
      var keys = Object.keys(shared);
      if(!keys.length) return '# ' + (fileLabel || file) + ' — no notes\n';
      var lines = ['# ' + (fileLabel || file) + ' — ' + keys.length + ' note' + (keys.length===1?'':'s'), ''];
      keys.forEach(function(k){
        var s = shared[k];
        lines.push('## ' + (s.label || k) + '  _(' + (s.author || 'team') + ')_');
        lines.push(s.text || '');
        lines.push('');
      });
      return lines.join('\n');
    }
  };

  global.Feedback = Feedback;
})(typeof window !== 'undefined' ? window : this);
