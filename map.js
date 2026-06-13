(function () {
    // The Basement coordinates
    var LAT = 38.05507813976317, LNG = 23.792604983440807;
 
    var map = L.map('office_map', {
      center: [LAT, LNG],
      zoom: 15,
      zoomControl: true,
      scrollWheelZoom: true,   // mouse-wheel zoom
      dragging: true,          // click-drag panning
      doubleClickZoom: true,
    });
 
    // OpenStreetMap tiles, free with no API key needed
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);
 
    // Custom marker icon
    var icon = L.divIcon({
      className: '',
      html: `
        <div style="
          width:36px; height:36px;
          background:#5B52E8;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          border:3px solid #fff;
          box-shadow:0 3px 10px rgba(91,82,232,0.45);
        "></div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -38],
    });
 
    var marker = L.marker([LAT, LNG], { icon: icon }).addTo(map);
 
    marker.bindPopup(`
      <div class="map-popup">
        <strong>The Basement</strong>
        <span>Chrisostomou Smirnis 47<br>Pefki, 151 21</span>
        <a href="https://www.openstreetmap.org/?mlat=${LAT}&mlon=${LNG}#map=16/${LAT}/${LNG}" target="_blank" rel="noopener">
          Open in Maps ↗
        </a>
      </div>
    `).openPopup();
  })();