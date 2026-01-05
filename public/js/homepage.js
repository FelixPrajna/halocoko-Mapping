// ==============================
// INIT MAP
// ==============================
const map = L.map('map', {
    zoomControl: false,
    scrollWheelZoom: false
}).setView([-6.2, 106.8], 11);

// ==============================
// ZOOM CONTROL
// ==============================
L.control.zoom({ position: 'bottomright' }).addTo(map);

// ==============================
// TILE
// ==============================
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(map);

// ==============================
// ENABLE SCROLL ZOOM ONLY ON MAP
// ==============================
const mapEl = document.getElementById('map');
mapEl.addEventListener('mouseenter', () => map.scrollWheelZoom.enable());
mapEl.addEventListener('mouseleave', () => map.scrollWheelZoom.disable());

// ==============================
// ROUTING LAYER
// ==============================
const routingLayer = L.layerGroup().addTo(map);

// ==============================
// COLOR BY DAY
// ==============================
const dayColors = {
    "Senin":   "#ffffff",
    "Selasa": "#1e90ff",
    "Rabu":   "#ff3333",
    "Kamis":  "#2ecc71",
    "Jumat":  "#8e44ad",
    "Sabtu":  "#e67e22"
};

// ==============================
// LOAD ROUTING DATA
// ==============================
const stored = sessionStorage.getItem("generated_routes");
let routes = stored ? JSON.parse(stored) : [];

// ==============================
// FILL SALES FILTER
// ==============================
const salesSelect = document.getElementById("filterSales");
const salesSet = new Set();

routes.forEach(r => salesSet.add(r.sales));
salesSet.forEach(sales => {
    const opt = document.createElement("option");
    opt.value = sales;
    opt.textContent = sales;
    salesSelect.appendChild(opt);
});

// ==============================
// RENDER MAP
// ==============================
function renderMap() {

    routingLayer.clearLayers();

    const dayFilter = document.getElementById("filterDay").value;
    const salesFilter = document.getElementById("filterSales").value;

    let bounds = [];

    routes.forEach(route => {

        if (dayFilter && route.day !== dayFilter) return;
        if (salesFilter && route.sales !== salesFilter) return;

        const color = dayColors[route.day] || "#3498db";

        route.outlets.forEach((o, i) => {

            if (!o.latitude || !o.longitude) return;

            const marker = L.marker(
                [o.latitude, o.longitude],
                {
                    icon: L.divIcon({
                        className: "custom-pin",
                        html: `<div style="
                            background:${color};
                            border:2px solid #333;
                            width:14px;
                            height:14px;
                            border-radius:50%;
                        "></div>`,
                        iconSize: [14,14],
                        iconAnchor: [7,7]
                    })
                }
            )
            .bindPopup(`
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

// ==============================
// FILTER EVENTS
// ==============================
document.getElementById("filterDay").addEventListener("change", renderMap);
document.getElementById("filterSales").addEventListener("change", renderMap);

// ==============================
// INITIAL RENDER
// ==============================
renderMap();
