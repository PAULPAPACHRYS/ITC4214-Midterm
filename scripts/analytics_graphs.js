/* ─────────────────────────────────────────────────────────────────
   analytics.js  –  reads the shared `workouts` array from
   workout_table.js and re-renders all charts whenever the data
   changes.  We monkey-patch the functions that mutate `workouts`
   so the analytics always stay in sync without touching the
   original source files.
───────────────────────────────────────────────────────────────── */

(function () {

  /* ── Helpers ── */
  function fmt_time() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function pct(part, whole) {
    return whole === 0 ? 0 : Math.round((part / whole) * 100);
  }

  /* ── Main render function ── */
  function render_analytics() {
    if (typeof workouts === 'undefined') return;

    const total    = workouts.length;
    const done     = workouts.filter(w => w.status === 'Completed').length;
    const pending  = total - done;

    const high_total = workouts.filter(w => w.intensity === 'High Intensity').length;
    const high_done  = workouts.filter(w => w.intensity === 'High Intensity' && w.status === 'Completed').length;

    const mod_total  = workouts.filter(w => w.intensity === 'Moderate').length;
    const mod_done   = workouts.filter(w => w.intensity === 'Moderate'   && w.status === 'Completed').length;

    const rec_total  = workouts.filter(w => w.intensity === 'Recovery').length;
    const rec_done   = workouts.filter(w => w.intensity === 'Recovery'   && w.status === 'Completed').length;

    const completion_pct = pct(done, total);

    /* ── Summary cards ── */
    document.getElementById('an_total').textContent   = total;
    document.getElementById('an_done').textContent    = done;
    document.getElementById('an_pending').textContent = pending;
    document.getElementById('an_high').textContent    = high_total;

    document.getElementById('an_done_sub').textContent    = total > 0 ? `${completion_pct}% of plan` : '—';
    document.getElementById('an_pending_sub').textContent = total > 0 ? `${pct(pending, total)}% remaining` : '—';
    document.getElementById('an_high_sub').textContent    = total > 0 ? `${pct(high_total, total)}% of plan` : '—';

    /* ── Donut chart ── */
    // SVG circumference for r=15.9155 is ~100 units — convenient
    const arc = document.getElementById('donut_arc');
    arc.setAttribute('stroke-dasharray', `${completion_pct} ${100 - completion_pct}`);

    document.getElementById('donut_pct').textContent  = `${completion_pct}%`;
    document.getElementById('leg_done').textContent    = done;
    document.getElementById('leg_pending').textContent = pending;

    // completion badge
    const badge = document.getElementById('completion_badge');
    if (completion_pct >= 80) {
      badge.className = 'rate_badge good';
      badge.innerHTML = '<i class="bi bi-trophy-fill"></i> On fire!';
    } else if (completion_pct >= 40) {
      badge.className = 'rate_badge mid';
      badge.innerHTML = '<i class="bi bi-graph-up"></i> Making progress';
    } else {
      badge.className = 'rate_badge low';
      badge.innerHTML = '<i class="bi bi-arrow-up-right"></i> Getting started';
    }

    /* ── Bar chart ── */
    // bars scale to the largest total bucket so proportions are meaningful
    const max_total = Math.max(high_total, mod_total, rec_total, 1);

    function set_bar(bar_id, count_id, value, max) {
      document.getElementById(bar_id).style.width  = `${pct(value, max)}%`;
      document.getElementById(count_id).textContent = value;
    }

    set_bar('bar_high_total', 'cnt_high_total', high_total, max_total);
    set_bar('bar_high_done',  'cnt_high_done',  high_done,  max_total);

    set_bar('bar_mod_total',  'cnt_mod_total',  mod_total,  max_total);
    set_bar('bar_mod_done',   'cnt_mod_done',   mod_done,   max_total);

    set_bar('bar_rec_total',  'cnt_rec_total',  rec_total,  max_total);
    set_bar('bar_rec_done',   'cnt_rec_done',   rec_done,   max_total);

    /* ── Timestamp ── */
    document.getElementById('last_updated').innerHTML =
      `<i class="bi bi-clock" style="margin-right:4px"></i>Updated ${fmt_time()}`;
  }

  /* ─────────────────────────────────────────────────────────────
     Monkey-patch: wrap every function in workout_table.js that
     mutates `workouts` so we can call render_analytics() after
     each change — without editing the original file.
  ───────────────────────────────────────────────────────────── */
  function patch_after(fn_name) {
    const original = window[fn_name];
    if (typeof original !== 'function') return;
    window[fn_name] = function () {
      original.apply(this, arguments);
      render_analytics();
    };
  }

  /* Run patches once the DOM + workout_table.js are both ready */
  window.addEventListener('load', function () {
    // These are the functions in workout_table.js that change the data
    ['render_table', 'toggle_status', 'save_workout_changes', 'confirmDelete'].forEach(patch_after);

    const saved = localStorage.getItem('gym_workouts');
    if (saved) workouts = JSON.parse(saved);
    
    // Initial render
    render_analytics();
  });

})();

window.addEventListener('storage', function(e) {
  if (e.key === 'gym_workouts') {
    workouts = JSON.parse(e.newValue);
    render_analytics();
  }
});