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
 *
 * Notes flagged `actioned: true` have been addressed by the dev — Mission Control
 * still holds them (for the archive/history), but they no longer count as an open
 * note here, so they drop off the nav pill and the notes panel. Once every live
 * note on a file is actioned, that file counts as "ready for live" (see
 * readyForLiveFiles below) — index.html surfaces it in its own top-level section.
 */
(function(global){
  'use strict';

  var Feedback = {
    // Open shared notes for one mockup file — excludes pending (not yet live)
    // and actioned (already addressed) notes.
    getShared: function(file){
      var s = (global.SHARED_NOTES || {})[file] || {};
      var out = {};
      Object.keys(s).forEach(function(k){
        if(s[k] && !s[k].pending && !s[k].actioned) out[k] = s[k];
      });
      return out;
    },

    // { [file]: count } of open (non-pending, non-actioned) shared notes — drives the nav pills.
    countSharedByFile: function(){
      var s = global.SHARED_NOTES || {}, out = {};
      Object.keys(s).forEach(function(f){
        var secs = s[f] || {};
        var n = 0;
        Object.keys(secs).forEach(function(k){ if(secs[k] && !secs[k].pending && !secs[k].actioned) n++; });
        if(n) out[f] = n;
      });
      return out;
    },

    // Files where every live note has been actioned by the dev — final-approved,
    // ready to ship. A file with zero notes at all is never "ready for live" here;
    // it just has no notes (see the "Completed development" bucket in index.html).
    readyForLiveFiles: function(){
      var s = global.SHARED_NOTES || {}, out = [];
      Object.keys(s).forEach(function(f){
        var secs = s[f] || {};
        var liveKeys = Object.keys(secs).filter(function(k){ return secs[k] && !secs[k].pending; });
        if(liveKeys.length && liveKeys.every(function(k){ return secs[k].actioned; })) out.push(f);
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
