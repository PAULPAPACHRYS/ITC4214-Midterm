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

    const total = workouts.length;
    const completed = workouts.filter(w => w.status === 'Completed').length;
    const pending = total - completed;

    const high_total = workouts.filter(w => w.intensity === 'High Intensity').length;
    const high_completed  = workouts.filter(w => w.intensity === 'High Intensity' && w.status === 'Completed').length;

    const mod_total  = workouts.filter(w => w.intensity === 'Moderate').length;
    const mod_completed   = workouts.filter(w => w.intensity === 'Moderate'   && w.status === 'Completed').length;

    const rec_total  = workouts.filter(w => w.intensity === 'Recovery').length;
    const rec_completed   = workouts.filter(w => w.intensity === 'Recovery'   && w.status === 'Completed').length;

    const completion_pct = pct(completed, total);

    /* ── Summary cards ── */
    document.querySelector('#an_total').textContent   = total;
    document.querySelector('#an_completed').textContent    = completed;
    document.querySelector('#an_pending').textContent = pending;
    document.querySelector('#an_high').textContent    = high_total;

    document.querySelector('#an_completed_sub').textContent    = total > 0 ? `${completion_pct}% of plan` : '—';
    document.querySelector('#an_pending_sub').textContent = total > 0 ? `${pct(pending, total)}% remaining` : '—';
    document.querySelector('#an_high_sub').textContent    = total > 0 ? `${pct(high_total, total)}% of plan` : '—';

    /* ── Donut chart ── */
    // SVG circumference for r=15.9155 is ~100 units — convenient
    const arc = document.querySelector('#donut_arc');
    arc.setAttribute('stroke-dasharray', `${completion_pct} ${100 - completion_pct}`);

    document.querySelector('#donut_pct').textContent  = `${completion_pct}%`;
    document.querySelector('#leg_completed').textContent    = completed;
    document.querySelector('#leg_pending').textContent = pending;

    /* ── Bar chart ── */
    // bars scale to the largest total bucket so proportions are meaningful
    const max_total = Math.max(high_total, mod_total, rec_total, 1);

    function set_bar(bar_id, count_id, value, max) {
      document.querySelector(bar_id).style.width  = `${pct(value, max)}%`;
      document.querySelector(count_id).textContent = value;
    }

    set_bar('#bar_high_total', '#cnt_high_total', high_total, max_total);
    set_bar('#bar_high_completed', '#cnt_high_completed',  high_completed,  max_total);

    set_bar('#bar_mod_total', '#cnt_mod_total',  mod_total,  max_total);
    set_bar('#bar_mod_completed', '#cnt_mod_completed',   mod_completed,   max_total);

    set_bar('#bar_rec_total', '#cnt_rec_total',  rec_total,  max_total);
    set_bar('#bar_rec_completed', '#cnt_rec_completed',   rec_completed,   max_total);

    /* ── Timestamp ── */
    document.querySelector('#last_updated').innerHTML =
      `<i class="bi bi-clock"></i>Latest Update: ${fmt_time()}`;
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