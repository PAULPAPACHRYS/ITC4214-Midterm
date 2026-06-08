// Navigation Bar, Left side, Button, Navigation Links
document.querySelector('#navbar-placeholder').innerHTML=`
<nav class="navbar navbar-expand-lg bg-light">
			<div class="container-fluid" id="navbar_background">

				<a class="navbar-brand d-flex align-items-center">
					<img src="logo.jpg" alt="Company Logo" width="50" height="50">
					<span class="company_name"> My Company</span>
				</a>
				
				<button class="navbar-toggler ms-auto" 
						type="button" 
						data-bs-toggle="collapse"
						data-bs-target="#navbarNav"
						aria-controls="navbarNav"
						aria-expanded="false"
						aria-label="Togle navigation">
					<span class="navbar-toggler-icon"></span>
				</button>
				
				<div class="collapse navbar-collapse" id="navbarNav">
					<ul class="navbar-nav mx-auto">
						<li class="nav-item"><a class="nav-link px-3" href="Home.html">Home</a></li>
						<li class="nav-item"><a class="nav-link px-3" href="Tasks.html">Tasks</a></li>
						<li class="nav-item"><a class="nav-link px-3" href="About.html">About</a></li>
						<li class="nav-item"><a class="nav-link px-3" href="Contact.html">Contact</a></li>
					</ul>
				</div>
			</div>
		</nav>
`;