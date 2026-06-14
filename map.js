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