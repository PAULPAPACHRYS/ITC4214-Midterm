
// Navigation Bar, Left side, Button, Navigation Links
document.querySelector('#navbar-placeholder').innerHTML=`
<nav class="navbar navbar-expand-lg">
			<div class="container-fluid py-3" id="navbar_container">

				<div class="d-flex align-items-center">
					<img src="images/Basement_Images/the_basement_logo.jpg" alt="Company Logo" width="50" height="50" class="rounded-circle">
					<h5 class="company_name ms-3">The Basement</h5>
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
		<div class="container-fluid d-flex align-items-center py-3" id="footer_container">

            <div class="d-flex align-items-center ms-5 gap-3">
                <img src="images/Basement_Images/the_basement_logo.jpg" alt="Company Logo" width="50" height="50" class="rounded-circle">
                <span class="company_name">The Basement © 2026. All rights reserved.</span>
            </div>
	
			<div class="ms-auto d-flex me-5 gap-4" id="footer_links">
				<a class="footer_link text-decoration-none btn" href="About.html">About</a>
				<a class="footer_link text-decoration-none btn" href="Contact.html">Contact</a>
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

