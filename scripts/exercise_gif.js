const WORKOUTX_API_KEY = 'wx_7710d41f0b0952e382d7c69405e1e17c8559ca8bd4f20e878e126ef9';
const WORKOUTX_BASE    = 'https://api.workoutxapp.com/v1';

// main function, takes an exercise name (ex push ups) and fetches a gif for that exercise in a popup
async function open_gif_overlay(exercise_name) {
  // UI elements
  const overlay = document.querySelector('#gif_overlay');
  const loading = document.querySelector('#gif_loading');
  const result  = document.querySelector('#gif_result');
  const error   = document.querySelector('#gif_error');

  // show overlay in loading state
  loading.style.display = 'flex';
  result.style.display  = 'none';
  error.style.display   = 'none';
  overlay.classList.add('active');

  //API request, using try catch for any errors
  try {
    // clean the name from lowercase, remove special characters, trim whitespace
    const cleaned_name = exercise_name
      .replace(/[^\w\s\-]/g, '')  // strip anything that isn't a letter, number or space
      .trim();

    const encoded  = encodeURIComponent(cleaned_name); //convert string into URL safe format
    // wait for responce
    const response = await fetch(`${WORKOUTX_BASE}/exercises/name/${encoded}`, {
      headers: { 'X-WorkoutX-Key': WORKOUTX_API_KEY }
    });

    const data = await response.json();
    
    // check if the responce was successful
    if (!response.ok) 
      throw new Error('API error ' + response.status);
    
    // if API returns an array use it, else try data.data or data.exercrises or an empty array
    const exercises = Array.isArray(data) ? data : data.data || data.exercises || [];
    if (exercises.length === 0) // throw error if the array is empty
      throw new Error('not_found');

    //take the closest match (first result)
    const ex = exercises[0];

    // get the gif from the API
    const gif_response = await fetch(ex.gifUrl, {
    headers: { 'X-WorkoutX-Key': WORKOUTX_API_KEY }
    });
    const gif_blob = await gif_response.blob(); //turn the responce to a blob
    const gif_object_url = URL.createObjectURL(gif_blob); //turn the blob into a temporary local URL
    document.querySelector('#gif_image').src = gif_object_url;
    document.querySelector('#gif_exercise_name').textContent = ex.name;

    // build tags from available fields
    const tag_values = [ex.bodyPart, ex.target, ex.equipment].filter(Boolean);
    document.querySelector('#gif_tags').innerHTML = tag_values
      .map(t => `<span class="gif_tag">${t}</span>`)
      .join('');

    loading.style.display = 'none';
    result.style.display  = 'block';

  } catch (err) {
    loading.style.display = 'none';
    error.style.display   = 'block';
    document.querySelector('#gif_error_msg').textContent =
      err.message === 'not_found' ? `No GIF found for "${exercise_name}".` : 'Could not load exercise. Check your API key or connection.';
  }
}

function close_gif_overlay() {
  const overlay = document.querySelector('#gif_overlay');
  overlay.classList.remove('active');
  // clear image to stop the GIF from playing in background
  document.querySelector('#gif_image').src = '';
}

// close with Escape key — extends the existing keydown listener
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') close_gif_overlay();
});