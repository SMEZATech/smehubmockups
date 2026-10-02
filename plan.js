/*
 * Member plan for the mockup (Free "Standard" vs paid "Premium"). One source of truth for every member page.
 *   ?plan=premium | ?plan=standard   switch and remember for this browser tab
 *   Completing public-premium-checkout.html sets premium.
 * Sets window.SME_PLAN and body classes plan-standard / plan-premium, which drive every
 * .standard-only / .premium-only element. On the live site this comes from MemberPress.
 * A small "Plan" switch sits beside the "Viewing as" switch while reviewing.
 */
(function(){
  var KEY = 'smePlan';
  var plan = 'standard';
  try {
    var q = (location.search.match(/[?&]plan=(premium|standard)\b/) || [])[1];
    if (q) sessionStorage.setItem(KEY, q);
    plan = sessionStorage.getItem(KEY) || 'standard';
  } catch (_) {}
  window.SME_PLAN = plan;
  window.smeSetPlan = function(p){ try { sessionStorage.setItem(KEY, p); } catch (_) {} location.reload(); };

  var css = document.createElement('style');
  css.textContent =
    '.standard-only,.standard-only-flex,.standard-only-inline,.premium-only,.premium-only-flex,.premium-only-inline{display:none!important}' +
    'body.plan-standard .standard-only{display:block!important}body.plan-standard .standard-only-flex{display:flex!important}body.plan-standard .standard-only-inline{display:inline-flex!important}' +
    'body.plan-premium .premium-only{display:block!important}body.plan-premium .premium-only-flex{display:flex!important}body.plan-premium .premium-only-inline{display:inline-flex!important}';
  document.head.appendChild(css);

  function apply(){
    document.body.classList.remove('plan-standard', 'plan-premium');
    document.body.classList.add(plan === 'premium' ? 'plan-premium' : 'plan-standard');
    var framed = false; try { framed = window.top !== window.self; } catch (_) { framed = true; }
    if (framed || document.getElementById('smePlanSwitch')) return;
    var on = plan === 'premium';
    var b = document.createElement('button');
    b.type = 'button'; b.id = 'smePlanSwitch';
    b.title = 'Preview only: switch between a free and a paying member';
    b.className = 'fixed left-3 bottom-[104px] md:bottom-12 z-[55] bg-white text-[#0C1F31] border border-[#D8DEE5] rounded-full shadow-lg pl-2.5 pr-3 h-7 flex items-center gap-1.5 text-[10.5px] font-bold hover:border-[#0C1F31]';
    b.innerHTML = '<span class="w-1.5 h-1.5 rounded-full ' + (on ? 'bg-[#DC183C]' : 'bg-[#98A2AE]') + '"></span><span class="text-[#6A7581] uppercase tracking-widest text-[8.5px]">Plan</span>' + (on ? 'Premium' : 'Free');
    b.onclick = function(){ window.smeSetPlan(on ? 'standard' : 'premium'); };
    document.body.appendChild(b);
  }
  if (document.body) apply(); else document.addEventListener('DOMContentLoaded', apply);
})();
