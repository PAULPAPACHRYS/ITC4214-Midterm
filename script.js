
// Navigation Bar, Left side, Button, Navigation Links
document.querySelector('#navbar-placeholder').innerHTML=`
<nav class="navbar navbar-expand-lg bg-light">
			<div class="container-fluid" id="navbar_container">

				<div class="d-flex align-items-center">
					<img src="images/logo.jpg" alt="Company Logo" width="50" height="50">
					<span class="company_name"> My Company</span>
				</div>
				
				<div class="collapse navbar-collapse" id="navbarNav">
					<ul class="navbar-nav mx-auto">
						<li class="nav-item"><a class="nav-link px-3" href="Home.html">Home</a></li>
						<li class="nav-item"><a class="nav-link px-3" href="Tasks.html">Workout</a></li>
						<li class="nav-item"><a class="nav-link px-3" href="Analytics.html">Analytics</a></li>
						<li class="nav-item"><a class="nav-link px-3" href="About.html">About</a></li>
						<li class="nav-item"><a class="nav-link px-3" href="Contact.html">Contact</a></li>
					</ul>
					
				</div>
				
				<div class="d-flex align-items-center gap-2 ms-auto">
					<button class="navbar-toggler ms-auto" 
							type="button" 
							data-bs-toggle="collapse"
							data-bs-target="#navbarNav"
							aria-controls="navbarNav"
							aria-expanded="false"
							aria-label="Togle navigation">
						<span class="navbar-toggler-icon"></span>
					</button>
				
					<button id="dark_mode_toggle" class="btn btn-outline-secondary btn-sm ms-auto"></button>
				</div>
				
			</div>
		</nav>
`;

// Footer
document.querySelector('#footer-placeholder').innerHTML=`
		<div class="container-fluid d-flex align-items-center py-3 border-top" id="footer_container">

            <div class="d-flex align-items-center ms-5 gap-3">
                <img src="images/logo.jpg" alt="Company Logo" width="50" height="50">
                <span class="company_name">My Company © 2026. All rights reserved.</span>
            </div>
	
			<div class="ms-auto d-flex me-5 gap-4" id="footer_links">
				<a href="About.html">About</a>
				<a href="Contact.html">Contact</a>
			</div>
		</div>
`;

// Dark and Light mode initialization
const savedTheme = localStorage.getItem('theme') || 'light'; // checks if a theme was previously saved in local storage, if nothing is stored then light mode by default
document.documentElement.setAttribute('data-theme', savedTheme); // applies the theme to the root html element

const toggle = document.querySelector('#dark_mode_toggle'); // saves the button dark_mode_toggle
// changes the button text with an emoji related to the theme it will apply if clicked
if(savedTheme === 'dark'){
    toggle.textContent = '☀️';
}else{
    toggle.textContent = '🌙';
}

// Dark and Light Mode swapping, runs this function each time the button is clicked
toggle.addEventListener('click', () => {
    const page = document.querySelector('html'); // selects the entire page
    var next_mode = '';
	
	if (page.getAttribute('data-theme') === 'dark'){ // checks what the current mode is and saves the opposite one
		next_mode = 'light';
	}else{
		next_mode= 'dark';
	}
	
    page.setAttribute('data-theme', next_mode); // applies the opposite theme
    localStorage.setItem('theme', next_mode); // also saves it to local storage for the other pages
    if (next_mode === 'dark') {   // updates the button emoji with the opposite theme
    	toggle.textContent = '☀️';
	} else {
    	toggle.textContent = '🌙';
	}
});

// Carousel in About Page
const images = [
	{src: 'images/Basement Images/interior_1.jpg', alt:'interior_1'},
	{src: 'images/Basement Images/interior_2.jpg', alt:'interior_2'},
	{src: 'images/Basement Images/interior_3.jpg', alt:'interior_3'},
	{src: 'images/Basement Images/interior_4.jpg', alt:'interior_4'},
	{src: 'images/Basement Images/interior_5.jpg', alt:'interior_5'},
	{src: 'images/Basement Images/interior_6.jpg', alt:'interior_6'}
];

let current = 0; // tracks which image is currently on display
const carousel_image = document.querySelector('#carousel_image');
const card = document.querySelector('#carousel_card');
const dots = document.querySelector('#dots');

// initialize dots using aloop forEach('_' ignores the image object itself, we only care for how many images we have)
images.forEach((_,i) => {
	const d = document.createElement('button');
	d.className = 'dot' + (i===0 ? ' active': ''); // the first dot also gets the "active" status
	d.addEventListener('click', () => image_navigation(i)); // changes the image when user clicks on another dot
	dots.appendChild(d);  // add the dot to the page
});

// changes the active dot
function update_dots () {
	document.querySelectorAll('.dot').forEach((d,i) =>{
		d.classList.toggle('active',i===current);
	});
}

// image transistion function
function show_image(index) {
	const img = images[index];
	carousel_image.src = img.src;
	carousel_image.alt = img.alt;
	update_dots();

}

// images circular navigation, if index is too high then wrap to start if negativce wrap to end
function image_navigation(index) {
	const dir = index > current ? 1 : -1;
	current = (index + images.length) % images.length;
	show_image(current,dir);
}

// event listeners for the two arrow buttons
document.querySelector('#prev_button').addEventListener('click',() => image_navigation(current - 1));
document.querySelector('#next_button').addEventListener('click',() => image_navigation(current + 1));

// keyboard support for changing images
document.addEventListener('keydown', key_input => {
if (key_input.key === 'ArrowLeft') image_navigation(current - 1);
if (key_input.key === 'ArrowRight') image_navigation(current + 1);
});

// Initialize
show_image(0);