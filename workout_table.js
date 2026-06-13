 /* ─── DATA ─── */
  let workouts = [
    {
      id: 1,
      name: "Upper Body Power",
      muscle: "Chest & Triceps",
      intensity: "High Intensity",
      status: "Done",
      desc: "Bench Press — 4 sets × 8 reps\nIncline DB Press — 3 sets × 10 reps\nCable Flyes — 3 sets × 12 reps\nTricep Pushdowns — 3 sets × 15 reps\nOverhead Tricep Extension — 2 sets × 12 reps\n\n⏱ Duration: ~70 min"
    },
    {
      id: 2,
      name: "Pull Day",
      muscle: "Back & Biceps",
      intensity: "High Intensity",
      status: "Done",
      desc: "Deadlifts — 4 sets × 5 reps\nPull-Ups — 4 sets × 8 reps\nBarbell Row — 3 sets × 8 reps\nFace Pulls — 3 sets × 15 reps\nHammer Curls — 3 sets × 12 reps\nPreacher Curls — 2 sets × 10 reps\n\n⏱ Duration: ~65 min"
    },
    {
      id: 3,
      name: "Leg Day Strength",
      muscle: "Quads & Hamstrings",
      intensity: "High Intensity",
      status: "Pending",
      desc: "Back Squat — 5 sets × 5 reps\nRomanian Deadlift — 4 sets × 8 reps\nLeg Press — 3 sets × 12 reps\nLeg Curl — 3 sets × 12 reps\nCalf Raises — 4 sets × 20 reps\n\n⏱ Duration: ~75 min"
    },
    {
      id: 4,
      name: "Core & Stability",
      muscle: "Abs & Core",
      intensity: "Moderate",
      status: "Pending",
      desc: "Plank — 3 sets × 60 sec\nHanging Leg Raises — 3 sets × 15 reps\nCable Crunches — 3 sets × 15 reps\nRussian Twists — 3 sets × 20 reps\nDead Bug — 3 sets × 10 reps per side\n\n⏱ Duration: ~40 min"
    },
    {
      id: 5,
      name: "Shoulder Hypertrophy",
      muscle: "Shoulders & Traps",
      intensity: "Moderate",
      status: "Pending",
      desc: "Overhead Press — 4 sets × 8 reps\nDB Lateral Raises — 4 sets × 15 reps\nFront Raises — 3 sets × 12 reps\nFace Pulls — 3 sets × 20 reps\nShrugs — 3 sets × 15 reps\n\n⏱ Duration: ~55 min"
    },
    {
      id: 6,
      name: "HIIT Cardio Blast",
      muscle: "Full Body / Cardio",
      intensity: "High Intensity",
      status: "Pending",
      desc: "Warm-Up — 5 min light jog\nBurpees — 4 rounds × 30 sec on / 15 sec off\nBox Jumps — 4 rounds × 10 reps\nKettlebell Swings — 4 rounds × 20 reps\nBattle Ropes — 4 rounds × 30 sec\nCool Down — 5 min stretch\n\n⏱ Duration: ~45 min"
    },
    {
      id: 7,
      name: "Active Recovery",
      muscle: "Full Body / Mobility",
      intensity: "Recovery",
      status: "Pending",
      desc: "Foam Rolling — 10 min\nHip Flexor Stretch — 2 × 60 sec per side\nHamstring Stretch — 2 × 60 sec\nThoracic Mobility Drills — 10 reps\nYoga Flow — 20 min\nLight Walking — 15 min\n\n⏱ Duration: ~60 min"
    },
    {
      id: 8,
      name: "Arm Isolation",
      muscle: "Biceps & Triceps",
      intensity: "Recovery",
      status: "Done",
      desc: "Barbell Bicep Curl — 4 sets × 10 reps\nAlternating DB Curl — 3 sets × 12 reps\nConcentration Curl — 3 sets × 12 reps\nTriangle Push-Ups — 3 sets × 15 reps\nKickbacks — 3 sets × 15 reps\nSkull Crushers — 3 sets × 10 reps\n\n⏱ Duration: ~50 min"
    }
  ];
 
  let nextId = 9;
  let editingId = null;
  let deletingId = null;
  let expandedId = null;
  let sortKey = 'name';
  let sortAsc = true;
 
  /* ─── STATS ─── */
  function updateStats() {
    document.querySelector('#stat_total_value').textContent   = workouts.length;
    document.querySelector('#stat_pending_value').textContent = workouts.filter(w => w.status === 'Pending').length;
    document.querySelector('#stat_done_value').textContent    = workouts.filter(w => w.status === 'Done').length;
    document.querySelector('#stat_intense_value').textContent    = workouts.filter(w => w.intensity === 'High Intensity').length;
  }
 
  /* ─── SORT ─── */
  function sortBy(key) {
    if (sortKey === key) sortAsc = !sortAsc;
    else { sortKey = key; sortAsc = true; }
    document.querySelectorAll('.sort_arrow').forEach(el => el.parentElement.classList.remove('sorted'));
    const el = document.querySelector('#sort_name' + key);
    if (el) {
      el.textContent = sortAsc ? '▲' : '▼';
      el.parentElement.classList.add('sorted');
    }
    render_table();
  }
 
  /* ─── RENDER ─── */
  function render_table() {
    const search  = document.querySelector('#search_input').value.toLowerCase();
    const fStatus = document.querySelector('#filter_status').value;
    const fDiff   = document.querySelector('#filter_intensity').value;
 
    let filtered = workouts.filter(w => {
      const matchSearch = w.name.toLowerCase().includes(search) || w.muscle.toLowerCase().includes(search);
      const matchStatus = !fStatus || w.status === fStatus;
      const matchDiff   = !fDiff   || w.intensity === fDiff;
      return matchSearch && matchStatus && matchDiff;
    });
 
    const diffOrder = { High_Intensity: 0, Moderate: 1, Recovery: 2 };
    filtered.sort((a, b) => {
      let va = a[sortKey] ?? ''; let vb = b[sortKey] ?? '';
      if (sortKey === 'intensity') { va = diffOrder[a.intensity]; vb = diffOrder[b.intensity]; }
      if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
      return sortAsc ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
 
    const tbody = document.querySelector('#workout_body');
    tbody.innerHTML = '';
 
    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><i class="bi bi-search"></i><p>No workouts match your filters.<br>Try adjusting your search or add a new workout.</p></div></td></tr>`;
    } else {
      filtered.forEach(w => {
        const isDone   = w.status === 'Done';
        const isExpanded = expandedId === w.id;
 
        // main row
        const tr = document.createElement('tr');
        tr.className = (isDone ? 'workout-done ' : '') + (isExpanded ? 'expanded' : '');
        tr.dataset.id = w.id;
 
        tr.innerHTML = `
          <td>
            <div class="workout-name" onclick="toggleExpand(${w.id})">
              <i class="bi bi-chevron-right expand-icon"></i>
              <div>
                <div>${escHtml(w.name)}</div>
                <div class="workout-sub">${escHtml(w.muscle)}</div>
              </div>
            </div>
          </td>
          <td><span class="muscle-tag">${escHtml(w.muscle)}</span></td>
          <td>
            <span class="badge-diff diff-${w.intensity.toLowerCase()}">
              <span class="diff-dot"></span>${w.intensity}
            </span>
          </td>
          <td>
            <span class="badge-status ${isDone ? 'status-done' : 'status-pending'}">
              <i class="bi ${isDone ? 'bi-check-circle-fill' : 'bi-circle'}"></i>
              ${isDone ? 'Done' : 'Pending'}
            </span>
          </td>
          <td>
            <div class="action-btns">
              <button class="action-btn complete" title="${isDone ? 'Mark Pending' : 'Mark Done'}" onclick="toggleStatus(${w.id})">
                <i class="bi ${isDone ? 'bi-arrow-counterclockwise' : 'bi-check-circle'}"></i>
              </button>
              <button class="action-btn edit" title="Edit" onclick="openEditModal(${w.id})">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="action-btn delete" title="Delete" onclick="openDeleteModal(${w.id})">
                <i class="bi bi-trash3"></i>
              </button>
            </div>
          </td>
        `;
        tbody.appendChild(tr);
 
        // description row
        const dtr = document.createElement('tr');
        dtr.className = 'desc-row';
        dtr.dataset.descFor = w.id;
        dtr.style.display = isExpanded ? '' : 'none';
        dtr.innerHTML = `<td colspan="5"><div class="desc-content">${escHtml(w.desc)}</div></td>`;
        tbody.appendChild(dtr);
      });
    }
 
    document.querySelector('#table_footer').textContent =
      `Showing ${filtered.length} of ${workouts.length} workout${workouts.length !== 1 ? 's' : ''}`;
 
    updateStats();
  }
 
  /* ─── EXPAND ─── */
  function toggleExpand(id) {
    expandedId = (expandedId === id) ? null : id;
    render_table();
  }
 
  /* ─── STATUS TOGGLE ─── */
  function toggleStatus(id) {
    const w = workouts.find(x => x.id === id);
    if (w) { w.status = (w.status === 'Done') ? 'Pending' : 'Done'; }
    render_table();
  }
 
  /* ─── ADD / EDIT MODAL ─── */
  function openAddModal() {
    editingId = null;
    document.querySelector('#option_title').textContent = 'Add Workout';
    document.querySelector('#inp_name').value   = '';
    document.querySelector('#inp_musclee').value = '';
    document.querySelector('#inp_intensity').value   = 'Moderate';
    document.querySelector('#inp_status').value = 'Pending';
    document.querySelector('#inp_description').value   = '';
    document.querySelector('.table_overlay').classList.add('active');
  }
 
  function openEditModal(id) {
    const w = workouts.find(x => x.id === id);
    if (!w) return;
    editingId = id;
    document.querySelector('#option_title').textContent = 'Edit Workout';
    document.querySelector('#inp_name').value   = w.name;
    document.querySelector('#inp_muscle').value = w.muscle;
    document.querySelector('#inp_intensity').value   = w.intensity;
    document.querySelector('#inp_status').value = w.status;
    document.querySelector('#inp_description').value   = w.desc;
    document.querySelector('.table_overlay').classList.add('active');
  }
 
  function closeModal() {
    document.querySelector('.table_overlay').classList.remove('active');
  }
 
  function handleOverlayClick(e) {
    if (e.target === document.querySelector('.table_overlay')) closeModal();
  }
 
  function saveWorkout() {
    const name   = document.querySelector('#inp_name').value.trim();
    const muscle = document.querySelector('#inp_muscle').value.trim();
    const diff   = document.querySelector('#inp_intensity').value;
    const status = document.querySelector('#inp_status').value;
    const desc   = document.querySelector('#inp_description').value.trim();
 
    if (!name)   { alert('Please enter a workout name.'); return; }
    if (!muscle) { alert('Please enter a muscle group.'); return; }
 
    if (editingId !== null) {
      const w = workouts.find(x => x.id === editingId);
      if (w) { w.name = name; w.muscle = muscle; w.intensity = diff; w.status = status; w.desc = desc; }
    } else {
      workouts.push({ id: nextId++, name, muscle, intensity: diff, status, desc });
    }
 
    closeModal();
    render_table();
  }
 
  /* ─── DELETE MODAL ─── */
  function openDeleteModal(id) {
    deletingId = id;
    const w = workouts.find(x => x.id === id);
    document.querySelector('#delete_message').textContent =
      `"${w ? w.name : 'This workout'}" will be permanently removed.`;
    document.querySelector('#delete_overlay').classList.add('active');
  }
 
  function closeDeleteModal() {
    document.querySelector('#delete_overlay').classList.remove('active');
    deletingId = null;
  }
 
  function handleDeleteOverlayClick(e) {
    if (e.target === document.querySelector('#delete_overlay')) closeDeleteModal();
  }
 
  function confirmDelete() {
    if (deletingId !== null) {
      workouts = workouts.filter(w => w.id !== deletingId);
      if (expandedId === deletingId) expandedId = null;
    }
    closeDeleteModal();
    render_table();
  }
 
  /* ─── UTILS ─── */
  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
 
  // close modals with Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeModal(); closeDeleteModal(); }
  });
 
  // init
  render_table();