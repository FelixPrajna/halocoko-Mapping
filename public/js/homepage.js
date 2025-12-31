// Inisialisasi Map
const map = L.map('map', {
    zoomControl: false // matikan zoom default
}).setView([-6.200000, 106.816666], 12);

// Tile OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// Marker Start & End
const start = [-6.200000, 106.816666]; // Jakarta
const end = [-6.170000, 106.824000];   // Monas

L.marker(start).addTo(map).bindPopup('Titik Awal');
L.marker(end).addTo(map).bindPopup('Tujuan');

// Button Rute
document.getElementById('btnRoute').addEventListener('click', function () {
    const route = L.polyline([start, end], {
        color: 'blue',
        weight: 4
    }).addTo(map);

    map.fitBounds(route.getBounds());
});

// ===== ZOOM CONTROL CUSTOM =====
L.Control.ZoomCustom = L.Control.extend({
    onAdd: function(map) {
        const container = L.DomUtil.create('div', 'leaflet-control-zoom-custom');
        
        const btnIn = L.DomUtil.create('button', '', container);
        btnIn.innerHTML = '+';
        btnIn.title = 'Zoom In';
        btnIn.onclick = function() { map.zoomIn(); };

        const btnOut = L.DomUtil.create('button', '', container);
        btnOut.innerHTML = '−';
        btnOut.title = 'Zoom Out';
        btnOut.onclick = function() { map.zoomOut(); };

        return container;
    }
});

map.addControl(new L.Control.ZoomCustom({ position: 'bottomright' }));
