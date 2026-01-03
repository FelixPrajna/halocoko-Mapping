// ==============================
// INIT MAP
// ==============================
const map = L.map('map', {
    zoomControl: false,
    scrollWheelZoom: false,
    zoomAnimation: false,
    fadeAnimation: false
}).setView([-6.2, 106.8], 11);

// ==============================
// ZOOM CONTROL KANAN BAWAH
// ==============================
L.control.zoom({
    position: 'bottomright'
}).addTo(map);

// ==============================
// TILE
// ==============================
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// ==============================
// MAP ZOOM AKTIF HANYA SAAT CURSOR DI MAP
// ==============================
const mapEl = document.getElementById('map');

mapEl.addEventListener('mouseenter', () => {
    map.scrollWheelZoom.enable();
});

mapEl.addEventListener('mouseleave', () => {
    map.scrollWheelZoom.disable();
});

// ==============================
// BLOK PINCH ZOOM DI UI (NAVBAR, PANEL, BUTTON)
// ==============================
const uiBlocks = document.querySelectorAll(
    '.navbar, .panel, .leaflet-control-zoom'
);

uiBlocks.forEach(el => {
    el.addEventListener('wheel', e => {
        if (e.ctrlKey) {
            e.preventDefault(); // BLOK PAGE ZOOM
        }
        e.stopPropagation();   // JANGAN TERUS KE MAP
    }, { passive: false });
});

// ==============================
// LAYER MARKER
// ==============================
const outletLayer = L.layerGroup().addTo(map);

// ==============================
// LOAD DATA OUTLET
// ==============================
fetch('/api/outlets')
    .then(res => res.json())
    .then(outlets => {

        if (!outlets.length) return;

        const bounds = [];

        outlets.forEach(o => {
            const lat = parseFloat(o.latitude);
            const lng = parseFloat(o.longitude);

            if (isNaN(lat) || isNaN(lng)) return;

            L.marker([lat, lng])
                .addTo(outletLayer)
                .bindPopup(`<strong>${o.name}</strong>`);

            bounds.push([lat, lng]);
        });

        map.fitBounds(bounds);
    });

// ==============================
// FUNGSI LAMA
// ==============================
const btnRoute = document.getElementById('btnRoute');
if (btnRoute) {
    btnRoute.addEventListener('click', () => {
        alert('Fitur rute belum diaktifkan');
    });
}
