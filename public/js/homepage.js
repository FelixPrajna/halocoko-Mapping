// INIT MAP
const map = L.map('map').setView([-6.2, 106.8], 11);

// TILE
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// LAYER MARKER
const outletLayer = L.layerGroup().addTo(map);

// FETCH DATA OUTLET
fetch('/api/outlets')
    .then(res => res.json())
    .then(data => {

        if (data.length === 0) {
            console.log('Tidak ada data outlet');
            return;
        }

        data.forEach(outlet => {
            if (!outlet.latitude || !outlet.longitude) return;

            L.marker([outlet.latitude, outlet.longitude])
                .addTo(outletLayer)
                .bindPopup(`<b>${outlet.name}</b>`);
        });

        // auto center ke data
        const first = data[0];
        map.setView([first.latitude, first.longitude], 11);
    })
    .catch(err => console.error(err));

// ROUTE BUTTON (dummy)
document.getElementById('btnRoute').addEventListener('click', () => {
    alert('Fitur rute belum aktif');
});
