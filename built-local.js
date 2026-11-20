/*
 * Built in-house: live, not for the developer to build or change; they count as ready.
 * Source of truth is window.MOCKUP_BUILT_LOCAL in status.js, set from Mission Control (the Built toggle on each row).
 * This file only supplies a fallback for an older status.js that has no list yet.
 */
window.MOCKUP_BUILT_LOCAL = window.MOCKUP_BUILT_LOCAL || ['member-workspace.html', 'public-workspace.html', 'public-health-check.html'];
window.MOCKUP_BUILT_LOCAL_LABEL = 'Live';
