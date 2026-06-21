// Carousel in About Page
const images = [
	{src: 'images/Basement_Images/interior_1.jpg', alt:'interior_1'},
	{src: 'images/Basement_Images/interior_2.jpg', alt:'interior_2'},
	{src: 'images/Basement_Images/interior_3.jpg', alt:'interior_3'},
	{src: 'images/Basement_Images/interior_4.jpg', alt:'interior_4'},
	{src: 'images/Basement_Images/interior_5.jpg', alt:'interior_5'},
	{src: 'images/Basement_Images/interior_6.jpg', alt:'interior_6'}
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