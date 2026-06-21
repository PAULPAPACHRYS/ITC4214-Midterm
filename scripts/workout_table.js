//initialize workouts
function load_workouts() {
  //loads the workouts from local storage
  const stored = localStorage.getItem('gym_workouts');
  
  if (stored)
    return JSON.parse(stored);
  
  // if the workouts do no exit then create the default list
  const default_workouts = [
      {
        id: 1,
        name: "Upper Body Power",
        muscle: "Chest & Triceps",
        intensity: "High Intensity",
        status: "Completed",
        description: "Band Concentration Curl — 4 sets × 8 reps\nBarbell Biceps Curl — 3 sets × 10 reps\nBarbell Decline Bench Press — 3 sets × 12 reps\nCable Middle Fly — 3 sets × 15 reps\nPush up — 2 sets × 12 reps\n\nDuration: ~70 min"
    },
    {
      id: 2,
      name: "Pull Day",
      muscle: "Back & Biceps",
      intensity: "High Intensity",
      status: "Completed",
      description: "Assisted Pull-up — 4 sets × 5 reps\nArcher Pull Up — 4 sets × 8 reps\nBand Fixed Back Underhand Pulldown — 3 sets × 8 reps\nBarbell Bent Over Row — 3 sets × 15 reps\nBand Underhand Pulldown — 3 sets × 12 reps\n\nDuration: ~65 min"
    },
    {
      id: 3,
      name: "Leg Day Strength",
      muscle: "Quads & Hamstrings",
      intensity: "High Intensity",
      status: "Pending",
      description: "Band Bent-over Hip Extension — 5 sets × 5 reps\nBarbell Full Squat — 4 sets × 8 reps\nBarbell Lunge — 3 sets × 12 reps\nBarbell Clean-grip Front Squat — 3 sets × 12 reps\nBarbell Straight Leg Deadlift — 4 sets × 20 reps\n\nDuration: ~75 min"
    },
    {
      id: 4,
      name: "Core & Stability",
      muscle: "Abs & Core",
      intensity: "Moderate",
      status: "Pending",
      description: "Sit-up — 3 sets × 60 sec\nKneeling Plank Tap Shoulder — 3 sets × 15 reps\nBand Jack Knife Sit-up — 3 sets × 15 reps\nBridge - Mountain Climber — 3 sets × 20 reps\nJump Rope — 3 sets × 3 min each\n\nDuration: ~40 min"
    },
    {
      id: 5,
      name: "Shoulder Hypertrophy",
      muscle: "Shoulders & Traps",
      intensity: "Moderate",
      status: "Pending",
      description: "Band Shoulder Press — 4 sets × 8 reps\nBarbell Front Raise — 4 sets × 15 reps\nBarbell Rear Delt Row — 3 sets × 12 reps\nCable Rear Delt Row — 3 sets × 20 reps\nAstride Jumps — 3 sets × 15 reps\n\nDuration: ~55 min"
    },
    {
      id: 6,
      name: "HIIT Cardio Blast",
      muscle: "Full Body / Cardio",
      intensity: "High Intensity",
      status: "Pending",
      description: "Run — 5 min light jog\nJump Rope — 2 rounds × 5 min each\nSit-up — 4 rounds × 10 reps\nRun — 2 rounds × 5 min each\nAlternate Heel Touchers — 4 rounds × 12 reps\nStationary Bike Run — 10 min in the end\n\nDuration: ~45 min"
    },
    {
      id: 7,
      name: "Active Recovery",
      muscle: "Full Body / Mobility",
      intensity: "Recovery",
      status: "Pending",
      description: "Jump Rope — 10 min\nSit-up — 2 × 20 reps\nStationary Bike Run — 2 × 5 min\nPush up — 3 x 10 reps\n\nDuration: ~30 min"
    },
    {
      id: 8,
      name: "Arm Isolation",
      muscle: "Biceps & Triceps",
      intensity: "Recovery",
      status: "Completed",
      description: "Band Concentration Curl — 4 sets × 10 reps\nBarbell Drag Curl — 3 sets × 12 reps\nDumbbell Over Bench Wrist Curl — 3 sets × 12 reps\nKettlebell Alternating Hang Clean — 3 sets × 15 reps\n\nDuration: ~50 min"
    }
  ];
  
  // saves the workout list to local storage so other pages can find the use the data
  localStorage.setItem('gym_workouts', JSON.stringify(default_workouts));
  return default_workouts;
}

let next_id = 9; // stores the next id for the next workout added
let editing_id = null; // tracks the id of the workout being edited
let deleting_id = null; // stores the id before deletion confirmation
let expanded_id = null; // tracks which workout is expanded to show the description
let sort_key = 'name'; // stores which filed is used for sorting, default is the name field
let sort_asc = true; // stores sorting direction ( ascending or descending)

// matches the names of intensity levels to the class names
const intensity_class = {
  "High Intensity": "high_intensity",
  "Moderate": "moderate",
  "Recovery": "recovery"
};
 
// updates the dashboard statistics at the top of the page
function update_stats() {
  document.querySelector('#stat_total_value').textContent = workouts.length;
  document.querySelector('#stat_pending_value').textContent = workouts.filter(w => w.status === 'Pending').length;
  document.querySelector('#stat_completed_value').textContent = workouts.filter(w => w.status === 'Completed').length;
  document.querySelector('#stat_intense_value').textContent = workouts.filter(w => w.intensity === 'High Intensity').length;
}
 
// sort function, called when the user clicks on a table header
function sort_by(key) {
  if (sort_key === key) // checks if the user clicked the same header again for different sorting direction
    sort_asc = !sort_asc;
  else { 
    sort_key = key; 
    sort_asc = true; 
  }
    
  // removes highlight from columns and resets all sorting arrows
  document.querySelectorAll('.sort_arrow').forEach(arrow => {
    arrow.parentElement.classList.remove('sorted');
    arrow.textContent = '▲';
  });

  // changes the clicked column's arrow as needed then renders the table 
  const sorting_header = document.querySelector('#sort_' + key);
  if (sorting_header) {
    sorting_header.textContent = sort_asc ? '▲' : '▼';
    sorting_header.parentElement.classList.add('sorted');
  }
  render_table();
}
 
//main function 
// renders the workouttable, depending on sorting, filtering, adding/removing workouts or mark as completed or pending
function render_table() {
  const search  = document.querySelector('#search_input').value.toLowerCase(); // stores the user's search text
  const filter_status = document.querySelector('#filter_status').value; // status drop down menu
  const filter_intensity = document.querySelector('#filter_intensity').value; // intensity drop down menu

  // filtering, creates a new array with only matching workouts
  let filtered = workouts.filter(w => {
    const match_search = w.name.toLowerCase().includes(search) || w.muscle.toLowerCase().includes(search); //checks if it contains workout name or muscule group
    const match_status = !filter_status || w.status === filter_status; //checks if the user has used a status filter option
    const match_intensity = !filter_intensity || w.intensity === filter_intensity; //same as above but for intensity
    return match_search && match_status && match_intensity; // workout is added if all conditions are true
  });

  //custome sorting order so that intensity is not sorted alphabetically
  const intensity_order = { "High Intensity": 0, "Moderate": 1, "Recovery": 2 };
  
  //sorts filtered array by either ascending or descending order
  filtered.sort((i, j) => {
    // empty spots are replaced with an empty string instead of being null
    let sorting_value_i = i[sort_key];
    if (sorting_value_i === null)
      sorting_value_i = '';
    
    let sorting_value_j = j[sort_key];
    if (sorting_value_j === null)
      sorting_value_j = '';
    
    //using numeric order instead of text as stated in the intensity_order dictionary
    if (sort_key === 'intensity') { 
      sorting_value_i = intensity_order[i.intensity]; 
      sorting_value_j = intensity_order[j.intensity]; 
    }
    
    // convert strings to lowercase to avoid mismatches
    if (typeof sorting_value_i === 'string') { 
      sorting_value_i = sorting_value_i.toLowerCase(); 
      sorting_value_j = sorting_value_j.toLowerCase(); 
    }
    
    // if sort_asc = true (ascending order), then return 1 if i goes AFTER j or -1 if i goes BEFORE j
    if (sort_asc) {
      return sorting_value_i > sorting_value_j ? 1 : -1;
    } else {
      return sorting_value_i < sorting_value_j ? 1 : -1; // similarly for sort_asc = false (descending order)
    }
  });

  //obtain table body and replace all contents with an empty string
  const table_body = document.querySelector('#workout_body');
  table_body.innerHTML = '';

  // if nothing is found then inform the user with a message instead of rows
  if (filtered.length === 0) {
    table_body.innerHTML = `
      <tr>
        <td colspan="5">
          <div class="empty-state">
            <i class="bi bi-search"></i>
            <p>No workouts match your filters.<br>Try adjusting your search or add a new workout.</p>
          </div>
        </td>
      </tr>
    `;
  } else {
    // loop through every workout in the filtered
    filtered.forEach(w => {
      const completed_state = w.status === 'Completed'; // stores true/false if the workout is marked as completed or not
      const expanded_state = expanded_id === w.id; // stores true/fase if workout description is open or not

      // creates a new table row
      const tr = document.createElement('tr');

      // adds the workout_completed class and the expanded class to the new table row
      tr.className = (completed_state ? 'workout_completed ' : '') + (expanded_state ? 'expanded' : '');

      // add the workout id to the new table row
      tr.dataset.id = w.id;

      //build all visible cells
      tr.innerHTML = `
        <td>
          <div class="workout_name" data-action="expand" data-id="${w.id}">
            <i class="bi bi-chevron-right expand_icon"></i>
            <div>
              <div>${convert_html_entity(w.name)}</div>
              <div class="workout_sub">${convert_html_entity(w.muscle)}</div>
            </div>
          </div>
        </td>
        <td><span class="muscle_tag">${convert_html_entity(w.muscle)}</span></td>
        <td>
          <span class="badge_intensity intensity_${intensity_class[w.intensity]}">
            <span class="intensity_dot"></span>${w.intensity}
          </span>
        </td>
        <td>
          <span class="badge_status ${completed_state ? 'status_done' : 'status_pending'}">
            <i class="bi ${completed_state ? 'bi-check-circle-fill' : 'bi-circle'}"></i>
            ${completed_state ? 'Completed' : 'Pending'}
          </span>
        </td>
        <td>
          <div class="action_buttons">
            <button class="action_button complete" title="${completed_state ? 'Mark Pending' : 'Mark Completed'}" data-action="toggle" data-id="${w.id}">
              <i class="bi ${completed_state ? 'bi-arrow-counterclockwise' : 'bi-check-circle'}"></i>
            </button>
            <button class="action_button edit" title="Edit" data-action="edit" data-id="${w.id}">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="action_button delete" title="Delete" data-action="delete" data-id="${w.id}">
              <i class="bi bi-trash3"></i>
            </button>
          </div>
        </td>
      `;
      table_body.appendChild(tr);

      // description row, creates another row but hidden
      const dtr = document.createElement('tr');
      dtr.className = 'description_row';
      dtr.dataset.descFor = w.id; // has the id of a workout
      dtr.style.display = expanded_state ? '' : 'none'; // becomes visible only if the user clicks on it
      
      //detecting which lines are the exercise instructions and turn them into buttons to display relative gifs 
      const lines = w.description.split('\n'); // splits the line break character from the description
      const formatted = lines.map(line => {    // .map() turns each element of lines into html string
        const trimmed = line.trim(); // trim removes spaces 
        // isolate exercise names, example: Push up - 4 sets × 8 reps turns into Push up
        if (trimmed.includes('—') && /×|\d+\s*(sets|reps|sec|min)/i.test(trimmed)) {
          const exercise_name = trimmed.split(/\s*[—–-]\s*/)[0].trim();
          return `<span class="exercise_link" data-action="gif" data-exercise="${convert_html_entity(exercise_name)}">${convert_html_entity(trimmed)}</span>`;
        }
        return `<span>${convert_html_entity(trimmed)}</span>`;
      }).join('\n');

      dtr.innerHTML = `
        <td colspan="5">
          <div class="description_content">${formatted}</div>
        </td>
      `;
      table_body.appendChild(dtr);
    });
  }
  
  // updates the footer of the workout table with how many are shown out of all
  document.querySelector('#table_footer').textContent = `
  Showing ${filtered.length} of ${workouts.length} workout${workouts.length !== 1 ? 's' : ''}
  `;

  //refresh and update the stats
  update_stats();
  localStorage.setItem('gym_workouts', JSON.stringify(workouts)); //savechanges to localstorage
}
 
// updates the table UI when opening or closing workout description
function toggle_expand(id) {
  
  if (expanded_id === id)
    expanded_id = null; // close the description
  else
    expanded_id = id; // open the description of workout with that id
  
  render_table();
}
 
// update the status of a workout from pending to complete and the other way round
function toggle_status(id) {
  // find if the workout exists
  const w = workouts.find(x => x.id === id);
  
  // swap status
  if (w) {
    if (w.status === 'Completed')
      w.status = 'Pending';
    else
      w.status = 'Completed';
  }
  
  render_table();
}
 
// creates a new workout
function add_workout() {
  editing_id = null; // sets values of editing workout to null
  document.querySelector('#option_title').textContent = 'Add Workout';
  document.querySelector('#inp_name').value = '';
  document.querySelector('#inp_muscle').value = '';
  document.querySelector('#inp_intensity').value = 'Moderate';
  document.querySelector('#inp_status').value = 'Pending';
  document.querySelector('#inp_description').value = '';
  document.querySelector('.table_overlay').classList.add('active');
}
 
// edits the content of an existing workout
function edit_workout(id) {
  const w = workouts.find(x => x.id === id); //checks if workout exists
  if (!w) return;
  editing_id = id; // sets values of editing workout to the ones with that id
  document.querySelector('#option_title').textContent = 'Edit Workout';
  document.querySelector('#inp_name').value = w.name;
  document.querySelector('#inp_muscle').value = w.muscle;
  document.querySelector('#inp_intensity').value = w.intensity;
  document.querySelector('#inp_status').value = w.status;
  document.querySelector('#inp_description').value = w.description;
  document.querySelector('.table_overlay').classList.add('active');
}
 
// hides workout editing overlay
function close_workout() {
  document.querySelector('.table_overlay').classList.remove('active');
}

//makes it so it only close when user clicks outside the overlay
function edit_overlay_click(e) {
  if (e.target === document.querySelector('.table_overlay')) close_workout();
}
 
//save changes to the workout table
function save_workout_changes() {
  //reads values and uses trim to remove whitespace from the start and end of input
  const name = document.querySelector('#inp_name').value.trim();
  const muscle = document.querySelector('#inp_muscle').value.trim();
  const intensity = document.querySelector('#inp_intensity').value;
  const status = document.querySelector('#inp_status').value;
  const description = document.querySelector('#inp_description').value.trim();

  // check required fields
  if (!name)   { 
    alert('Please enter a workout name.'); 
    return; 
  }
  if (!muscle) { 
    alert('Please enter a muscle group.'); 
    return; 
  }

  // update values of workout
  if (editing_id !== null) { // will only be null if creating a new workout (does not have an id yet)
    const w = workouts.find(x => x.id === editing_id); //if editing an existing workout then locate it and update values
    if (w) { 
      w.name = name; 
      w.muscle = muscle; 
      w.intensity = intensity; 
      w.status = status; 
      w.description = description; 
    }
  } else { 
    //if adding a new workout then assign a new id and all the values
    workouts.push({ id: next_id++, name, muscle, intensity, status, description });
  }

  close_workout();
  render_table();
}
 
//delete workout, opens the delete overlay and display confirmation message
function open_delete_workout_overlay(id) {
  deleting_id = id;
  const w = workouts.find(x => x.id === id);
  document.querySelector('#delete_message').textContent = `
    "${w ? w.name : 'This workout'}" will be permanently removed.
  `;
  document.querySelector('#delete_overlay').classList.add('active');
}
 
// closes the delete overlay and reset deleting_id back to null
function close_delete_workout_overlay() {
  document.querySelector('#delete_overlay').classList.remove('active');
  deleting_id = null;
}
 
//makes it so it only close when user clicks outside the overlay just like the previous overlay
function delete_overlay_click(e) {
  if (e.target === document.querySelector('#delete_overlay')) close_delete_workout_overlay();
}
 
//after user confirms the workout is deleted
function confirm_delete() {
  if (deleting_id !== null) {
    workouts = workouts.filter(w => w.id !== deleting_id); //filters out the workout from the table, keeps all workours with id != deleting_id
    if (expanded_id === deleting_id) // resets expanded_id if needed
      expanded_id = null;
  }
  close_delete_workout_overlay();
  render_table();
}

//replaces the symbols: & < > " with safe HTML entities so that they won't be displayed as text instead of executing
function convert_html_entity(str) {
  return String(str)
    .replace(/'/g, '&apos;')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* 
 * Event Listeners Section
 */
document.querySelector('#button_add').addEventListener('click',() => {
  add_workout();
});

document.querySelector('#button_sort_name').addEventListener('click',() => {
  sort_by('name');
});

document.querySelector('#button_sort_muscle').addEventListener('click',() => {
  sort_by('muscle');
});

document.querySelector('#button_sort_intensity').addEventListener('click',() => {
  sort_by('intensity');
});

document.querySelector('#button_sort_status').addEventListener('click',() => {
  sort_by('status');
});

document.querySelector('#button_add_edit').addEventListener('click', () => {
  edit_overlay_click(event);
});

document.querySelector('#button_cancel_edit').addEventListener('click', () => {
  close_workout();
});

document.querySelector('#button_save').addEventListener('click', () => {
  save_workout_changes();
});

document.querySelector('#delete_overlay').addEventListener('click', () => {
  delete_overlay_click(event);
});

document.querySelector('#button_delete_cancel').addEventListener('click', () => {
  close_delete_workout_overlay();
});

document.querySelector('#button_danger').addEventListener('click', () => {
  confirm_delete();
});

document.querySelector('#gif_overlay').addEventListener('click', () => {
  gif_overlay_click(event);
});

document.querySelector('#gif_close_btn').addEventListener('click', () => {
  close_gif_overlay();
});

document.querySelector('#filter_status').addEventListener('change', () => {
  render_table();
});

document.querySelector('#filter_intensity').addEventListener('change', () => {
  render_table();
});

//handles the buttons inside the html block of code that the script appends
document.querySelector('#workout_body').addEventListener('click', e => {
  const el = e.target.closest('[data-action]');
  if (!el) return;

  const action = el.dataset.action;
  const id = parseInt(el.dataset.id);

  if (action === 'expand') toggle_expand(id);
  if (action === 'toggle') toggle_status(id);
  if (action === 'edit')   edit_workout(id);
  if (action === 'delete') open_delete_workout_overlay(id);
  if (action === 'gif')    open_gif_overlay(el.dataset.exercise);
});

// close overlays with Escape key
document.addEventListener('keydown', esc => {
  if (esc.key === 'Escape') { 
    close_workout(); 
    close_delete_workout_overlay(); 
  }
});

// initialize
let workouts = load_workouts();
render_table();