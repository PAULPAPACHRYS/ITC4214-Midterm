
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
						<li class="nav-item"><a class="nav-link px-3" href="Workout.html">Workout</a></li>
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
const testimonials = [
	{
		stars: 5,
		quote: '"One of the best spots in town"',
		name: 'Marcus Rivera',
		role: 'customer',
		initials: 'MR',
		avatarColor: '#d9f99d'
	},
		{
		stars: 4,
		quote: '"Its goood"',
		name: 'Bob Marley',
		role: 'customer',
		initials: 'MR',
		avatarColor: '#dd1111'
	},
		{
		stars: 2,
		quote: '"Not my thing"',
		name: 'Rita Ming',
		role: 'customer',
		initials: 'MS',
		avatarColor: '#07d3e9'
	}
];

let current = 0;
const card = document.querySelector('.testimonial_card');
const stars = document.querySelector('#stars_row');
const test_quote = document.querySelector('#quoteText');
const test_avatar = document.querySelector('#author_avatar');
const test_name = document.querySelector('#author_name');
const test_role = document.querySelector('#author_role');
const dots = document.querySelector('.dots');

// Build dots
testimonials.forEach((_,i) => {
	const d = document.createElement('button');
	d.className = 'dot' + (i===0 ? ' active': '');
	d.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
	d.addEventListener('click', () => goTo(i));
	dots.appendChild(d);
});

function set_stars(count){
	stars.innerHTML = '';
	for (let i =1; i<=5; i++) {
		const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
		svg.setAttribute('viewBox', '0 0 24 24');
		svg.classList.add('star');
		const poly = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		poly.setAttribute('points', '12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2');
      	poly.setAttribute('fill', i <= count ? '#f59e0b' : '#e5e7eb');
		poly.setAttribute('stroke', i <= count ? '#f59e0b' : '#e5e7eb');
      	svg.appendChild(poly);
      	stars.appendChild(svg);
	}
}

function update_dots () {
	document.querySelectorAll('.dot').forEach((d,i) =>{
		d.classList.toggle('active',i===current);
	});
}

function showSlide(index, direction =1) {
	card.classList.add('fade-out');
	setTimeout(() => {
		const t = testimonials[index];
		set_stars(t.stars);
		test_quote.textContent = t.quote;
		test_avatar.textContent = t.initials;
		test_avatar.style.backgroundColor = t.avatarColor;
		test_name.textContent = t.name;
		test_role.textContent = t.role;
		card.style.transform = `translateX(${direction * -20}px)`;
		card.classList.remove('fade-out');
		
		card.getBoundingClientRect();
		card.style.transition = 'none';
		card.style.transform = `translateX(${direction * 20}px)`;
		card.getBoundingClientRect();
		card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
      	card.style.transform = 'translateX(0)';
		update_dots();
	}, 200);
}

function goTo(index) {
	const dir = index > current ? 1 : -1;
	current = (index + testimonials.length) % testimonials.length;
	showSlide(current,dir);
}

document.querySelector('#prev_button').addEventListener('click',() => goTo(current - 1));
document.querySelector('#next_button').addEventListener('click',() => goTo(current + 1));

 // Keyboard support
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  // Init
  showSlide(0);