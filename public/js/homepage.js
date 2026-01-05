/* ===============================
   INIT MAP
=============================== */
const map = L.map('map', {
    zoomControl: false,
    scrollWheelZoom: false
}).setView([-6.2, 106.8], 11);

setTimeout(() => {
    map.invalidateSize(true);
}, 300);

/* ===============================
   ZOOM CONTROL
=============================== */
L.control.zoom({ position: 'bottomright' }).addTo(map);

/* ===============================
   TILE
=============================== */
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

/* ===============================
   ENABLE SCROLL ZOOM ONLY ON MAP
=============================== */
const mapEl = document.getElementById('map');
mapEl.addEventListener('mouseenter', () => map.scrollWheelZoom.enable());
mapEl.addEventListener('mouseleave', () => map.scrollWheelZoom.disable());

/* ===============================
   ROUTING LAYER
=============================== */
const routingLayer = L.layerGroup().addTo(map);

/* ===============================
   COLOR BY DAY
=============================== */
const dayColors = {
    "Senin":   "#ffffff",
    "Selasa": "#1e90ff",
    "Rabu":   "#ff3333",
    "Kamis":  "#2ecc71",
    "Jumat":  "#8e44ad",
    "Sabtu":  "#e67e22"
};

/* ===============================
   PIN ICON (SVG GPS)
=============================== */
function createPinIcon(color) {
    return L.divIcon({
        className: "custom-pin",
        html: `
            <svg width="28" height="28" viewBox="0 0 24 24" fill="${color}" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
            </svg>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -26]
    });
}

/* ===============================
   LOAD ROUTING DATA
=============================== */
const stored = sessionStorage.getItem("generated_routes");
let routes = stored ? JSON.parse(stored) : [];

/* ===============================
   FILL SALES FILTER
=============================== */
const salesSelect = document.getElementById("filterSales");
const salesSet = new Set();

routes.forEach(r => salesSet.add(r.sales));

salesSet.forEach(sales => {
    const opt = document.createElement("option");
    opt.value = sales;
    opt.textContent = sales;
    salesSelect.appendChild(opt);
});

/* ===============================
   RENDER MAP
=============================== */
function renderMap() {

    routingLayer.clearLayers();

    const dayFilter = document.getElementById("filterDay").value;
    const salesFilter = document.getElementById("filterSales").value;

    let bounds = [];

    routes.forEach(route => {

        if (dayFilter && route.day !== dayFilter) return;
        if (salesFilter && route.sales !== salesFilter) return;

        const color = dayColors[route.day] || "#ff6a00";

        route.outlets.forEach((o, i) => {

            if (!o.latitude || !o.longitude) return;

            const marker = L.marker(
                [o.latitude, o.longitude],
                { icon: createPinIcon(color) }
            ).bindPopup(`
                <b>${o.name}</b><br>
                ${route.sales}<br>
                ${route.day}<br>
                Urutan: ${i + 1}
            `);

            routingLayer.addLayer(marker);
            bounds.push([o.latitude, o.longitude]);
        });
    });

    if (bounds.length) {
        map.fitBounds(bounds, { padding: [40, 40] });
    }
}

/* ===============================
   FILTER EVENTS
=============================== */
document.getElementById("filterDay").addEventListener("change", renderMap);
document.getElementById("filterSales").addEventListener("change", renderMap);

/* ===============================
   INITIAL RENDER
=============================== */
renderMap();
