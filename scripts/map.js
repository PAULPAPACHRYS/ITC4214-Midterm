(function () {
  // The Basement coordinates
  var LAT = 38.05507813976317, LNG = 23.792604983440807;

  // Map settings: 
  // starting zoom level
  //  zoom control with buttons/ mouse wheel/ double click
  //   dragging by holding down left click
  var map = L.map('basement_map', {
    center: [LAT, LNG],
    zoom: 15,
    zoomControl: true,
    scrollWheelZoom: true,
    dragging: true,
    doubleClickZoom: true,
  });

  // OpenStreetMap tiles, free with no API key needed
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', // credit to the map data source
    maxZoom: 19,
  }).addTo(map);

  // custom marker icon
  var icon = L.icon({
  iconUrl: '/images/location-pin.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
  });

  // add the marker to the map
  var marker = L.marker([LAT, LNG], { icon: icon }).addTo(map);

  // create a popup when the user presses the marker to give the address and open to maps
  marker.bindPopup(`
    <div class="map_popup">
      <strong>The Basement</strong>
      <span>Chrisostomou Smirnis 47<br>Pefki, 151 21</span>
      <a href="https://www.openstreetmap.org/?mlat=${LAT}&mlon=${LNG}#map=16/${LAT}/${LNG}" target="_blank" rel="noopener">
        Open in Maps ↗
      </a>
    </div>
  `).openPopup();
  
})();

// checks if the form has beed field then clears the fields
function submit_form () {
  
  //some() stops when it finds at least one empty field and return true 
  const check_fields = message_form.some(f => f.value.trim() === '');
  
  //if any field remains empty, inform the user
  if (check_fields) {
    alert("Please fill out all the fields of the form.");
    return;
  }
  
  // clear out the form
  message_form.forEach(f => {
    f.value = '';
  });
  
  message_counters.forEach(c => {
    c.textContent = '0';
  });
  
  alert("Thank you for your feedback!");
}

// lists with the id of the fields and their contents for counting 
const message_form = [
  document.querySelector('#name'),
  document.querySelector('#email'),
  document.querySelector('#subject'),
  document.querySelector('#message')
];

const message_counters = [
  document.querySelector('#name_count'),
  document.querySelector('#email_count'),
  document.querySelector('#subject_count'),
  document.querySelector('#message_count')
];

/* 
 * Event Listeners Section
 */
document.querySelector('#button_send').addEventListener('click',() => {
  submit_form();
});

// the following 4 EventListeners update the character count of each field
message_form[0].addEventListener('input', () => {
    message_counters[0].textContent = message_form[0].value.length;
});

message_form[1].addEventListener('input', () => {
    message_counters[1].textContent = message_form[1].value.length;
});

message_form[2].addEventListener('input', () => {
    message_counters[2].textContent = message_form[2].value.length;
});

message_form[3].addEventListener('input', () => {
    message_counters[3].textContent = message_form[3].value.length;
});

