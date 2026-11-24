/* ziadelfeky.com visit counter: no cookies, no personal data. A random code per browser tab. */
(function () {
  if (!/(^|\.)ziadelfeky\.com$/.test(location.hostname) && !window.ZE_TRACK_TEST) return;
  var URL_ = "https://gndbfxwjcumkftbultkt.supabase.co/rest/v1/ze_events", KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImduZGJmeHdqY3Vta2Z0YnVsdGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwMzc5NTAsImV4cCI6MjA5NzYxMzk1MH0.LLk6yk3kgyH5INPE60hU1tyAaKNCWF6Sdkoywg3kRjo";
  var sid;
  try { sid = sessionStorage.getItem('zeSid'); if (!sid) { sid = Math.random().toString(36).slice(2, 10) + Date.now().toString(36); sessionStorage.setItem('zeSid', sid); } }
  catch (e) { sid = 'x' + Math.random().toString(36).slice(2, 12); }
  var page = location.pathname.replace(/^\/+|\/+$/g, '').split('/')[0] || 'home';
  var w = Math.min(screen.width || 9999, window.innerWidth || 9999);
  var device = w < 700 ? 'phone' : (w < 1100 ? 'tablet' : 'desktop');
  var ref = '';
  try {
    var q = new URLSearchParams(location.search).get('utm_source');
    if (q) ref = q.toLowerCase();
    else if (document.referrer) { var h = new URL(document.referrer).hostname.replace(/^www\./, ''); if (h !== location.hostname) ref = h; }
    if (!ref && /Instagram/i.test(navigator.userAgent)) ref = 'instagram app';
    if (!ref && /FBAN|FBAV/i.test(navigator.userAgent)) ref = 'facebook app';
  } catch (e) {}
  if (/(^|\.)instagram\.com$|^l\.instagram\.com$/.test(ref)) ref = 'instagram';
  var sent = {};
  function send(ev, label, once) {
    var key = ev + '|' + (label || '');
    if (once && sent[key]) return; sent[key] = 1;
    try {
      fetch(URL_, {
        method: 'POST', keepalive: true,
        headers: { 'apikey': KEY, 'Authorization': 'Bearer ' + KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ sid: sid, page: page.slice(0, 40), ev: ev, label: label ? String(label).slice(0, 60) : null, ref: ref ? ref.slice(0, 80) : null, device: device })
      }).catch(function () {});
    } catch (e) {}
  }
  window.zeTrack = send;
  send('view', null, true);
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('[data-track]');
    if (t) send(t.getAttribute('data-track'), t.getAttribute('data-track-label'));
  }, true);
  /* forms: first answer = started, success screen = sent */
  function formWatch() {
    var form = document.getElementById('view-form') || document.getElementById('form');
    if (!form) return;
    var start = function () { send('form_start', null, true); };
    form.addEventListener('input', start, true);
    form.addEventListener('change', start, true);
    form.addEventListener('click', function (e) { if (e.target.closest('.pill,.plan,.star,.pick,.gchip,[role=radio]')) start(); }, true);
    var done = document.getElementById('view-success') || document.getElementById('done');
    if (done && window.MutationObserver) {
      new MutationObserver(function () {
        if (done.style.display && done.style.display !== 'none') send('form_submit', null, true);
      }).observe(done, { attributes: true, attributeFilter: ['style'] });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', formWatch); else formWatch();
})();
