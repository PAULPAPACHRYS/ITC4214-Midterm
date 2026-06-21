(function () {
    
    function render_activity() {
        const raw = localStorage.getItem('gym_workouts');
        if (!raw) 
            return;
        const workouts = JSON.parse(raw);
        
        const activity_list = document.querySelector('#activity_list');
        const activity_empty = document.querySelector('#activity_empty');
        const activity_footer_text = document.querySelector('#activity_footer_text');
        
        activity_list.innerHTML = '';
        
        if(workouts.length === 0) {
            activity_empty.style.display = 'block';
            activity_footer_text.textContent = 'No workouts yet!';
            return;
        }
        
        activity_empty.style.display = 'none';
        
        const ordered = [...workouts].sort((i,j)=> j.id - i.id);
        
        function intensity_info(raw) {
            const map = {
              'High Intensity': { cls: 'high',     label: 'High'     },
              'high_intensity': { cls: 'high',     label: 'High'     },
              'Moderate':       { cls: 'moderate', label: 'Moderate' },
              'moderate':       { cls: 'moderate', label: 'Moderate' },
              'Recovery':       { cls: 'recovery', label: 'Recovery' },
              'recovery':       { cls: 'recovery', label: 'Recovery' },
                };
            return map[raw] || { cls: 'moderate', label: raw };
        }
        
        ordered.forEach(w => {
            const completed = w.status === 'Completed';
            const intensity = intensity_info(w.intensity);
            const list = document.createElement('li');
            
            list.className = ('activity_list_item');
            list.innerHTML = `
                <div class="activity_status_icon ${completed ? 'completed' : 'pending'}">
                    <i class="bi ${completed ? 'bi-check2-circle' : 'bi-clock-fill'}"></i>
                </div>
                <div class="activity_info">
                    <div class="activity_name ${completed ? 'strikethrough' : ''}">${convert_html_entity(w.name)}</div>
                    <div class="activity_meta">
                        <span class="activity_muscle">${convert_html_entity(w.muscle)}</span>
                        <span class="sep">·</span>
                        <span class="badge ${intensity.cls}">${intensity.label}</span>
                    </div>
                </div>
                <span class="activity_status_pill ${completed ? 'completed' : 'pending'}">
                    ${completed ? 'Completed' : 'Pending'}
                </span>
            `;
            activity_list.appendChild(list);
        });
        
        const now = new Date();
        activity_footer_text.textContent = 'Updated ' + now.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    }
    
    //replaces the symbols: & < > " with safe HTML entities so that they won't be displayed as text instead of executing
    function convert_html_entity(str) {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }
    
    function patch_after(fn_name) {
        const original = window[fn_name];
        if (typeof original !== 'function') 
            return;
        window[fn_name] = function () {
          const result = original.apply(this, arguments);
          render_activity();
          return result;
        };
    }
    
    // updates the dashboard statistics at the top of the page
    function update_stats() {
      document.querySelector('#total_value').textContent = workouts.length;
      document.querySelector('#pending_value').textContent = workouts.filter(w => w.status === 'Pending').length;
      document.querySelector('#completed_value').textContent = workouts.filter(w => w.status === 'Completed').length;
    }
    
    window.addEventListener('load', function () {
        ['render_table', 'toggle_status', 'save_workout_changes', 'confirm_delete']
        .forEach(patch_after);
        
        const saved = localStorage.getItem('gym_workouts');
        if (saved) workouts = JSON.parse(saved);
        update_stats();

        render_activity();
    });
    
})();

/*
 * Event Listeners Section
 */

document.querySelector('#button_Workouts').addEventListener('click', () => {
    window.location.href = 'Tasks.html';
});

document.querySelector('#button_Analytics').addEventListener('click', () => {
    window.location.href = 'Analytics.html';
});