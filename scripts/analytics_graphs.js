(function () {

 // gets the time and returns a string like "07:52"
  function fmt_time() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // prevents zero division, rounds number to nearest int and computes precentage
  function pct(part, whole) {
    return whole === 0 ? 0 : Math.round((part / whole) * 100);
  }

 // main function
  function render_analytics() {
    if (typeof workouts === 'undefined') return;

    // basic stats
    const total = workouts.length;
    const completed = workouts.filter(w => w.status === 'Completed').length;
    const pending = total - completed;

    const high_total = workouts.filter(w => w.intensity === 'High Intensity').length;
    const high_completed = workouts.filter(w => w.intensity === 'High Intensity' && w.status === 'Completed').length;

    const mod_total = workouts.filter(w => w.intensity === 'Moderate').length;
    const mod_completed = workouts.filter(w => w.intensity === 'Moderate'   && w.status === 'Completed').length;

    const rec_total = workouts.filter(w => w.intensity === 'Recovery').length;
    const rec_completed = workouts.filter(w => w.intensity === 'Recovery'   && w.status === 'Completed').length;

    //overall progress of the plan
    const completion_pct = pct(completed, total);

    // update summary cards at the top
    document.querySelector('#an_total').textContent = total;
    document.querySelector('#an_completed').textContent = completed;
    document.querySelector('#an_pending').textContent = pending;
    document.querySelector('#an_high').textContent = high_total;

    document.querySelector('#an_completed_sub').textContent = total > 0 ? `${completion_pct}% of plan` : '—';
    document.querySelector('#an_pending_sub').textContent = total > 0 ? `${pct(pending, total)}% remaining` : '—';
    document.querySelector('#an_high_sub').textContent = total > 0 ? `${pct(high_total, total)}% of plan` : '—';

    // donut chart
    // shows overall progress of how many workouts have beed completed
    const arc = document.querySelector('#donut_arc');
    arc.setAttribute('stroke-dasharray', `${completion_pct} ${100 - completion_pct}`);

    document.querySelector('#donut_pct').textContent = `${completion_pct}%`;
    document.querySelector('#leg_completed').textContent = completed;
    document.querySelector('#leg_pending').textContent = pending;

    //bar chart
    // shows how many workouts opf each intensity level have been completed
    const max_total = Math.max(high_total, mod_total, rec_total, 1); //makes it so bars scale relative to largest category

    function set_bar(bar_id, count_id, value, max) {
      document.querySelector(bar_id).style.width = `${pct(value, max)}%`; //set bar width as percentage of max
      document.querySelector(count_id).textContent = value; //update number label
    }

    set_bar('#bar_high_total', '#cnt_high_total', high_total, max_total);
    set_bar('#bar_high_completed', '#cnt_high_completed',  high_completed,  max_total);

    set_bar('#bar_mod_total', '#cnt_mod_total',  mod_total,  max_total);
    set_bar('#bar_mod_completed', '#cnt_mod_completed',   mod_completed,   max_total);

    set_bar('#bar_rec_total', '#cnt_rec_total',  rec_total,  max_total);
    set_bar('#bar_rec_completed', '#cnt_rec_completed',   rec_completed,   max_total);

    //adds the time of latest update
    document.querySelector('#last_updated').innerHTML =
      `<i class="bi bi-clock"></i>Latest Update: ${fmt_time()}`;
  }

  // calls render_analytics after every change in the workout table
  function patch_after(fn_name) {
    const original = window[fn_name];
    if (typeof original !== 'function') return;
    window[fn_name] = function () {
      original.apply(this, arguments);
      render_analytics();
    };
  }

 // event lister for functions that could change workout table
  window.addEventListener('load', function () {
    // These are the functions in workout_table.js that change the data
    ['render_table', 'toggle_status', 'save_workout_changes', 'confirmDelete'].forEach(patch_after);

    const saved = localStorage.getItem('gym_workouts');
    if (saved) workouts = JSON.parse(saved);
    
    // Initial render
    render_analytics();
  });

})();

//This listens for changes in localStorage made from other tabs
window.addEventListener('storage', function(e) {
  if (e.key === 'gym_workouts') {
    workouts = JSON.parse(e.newValue);
    render_analytics();
  }
});