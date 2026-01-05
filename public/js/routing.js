function createPinIcon(color) {
    return L.divIcon({
        className: "",
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

/* =====================================================
   GLOBAL STATE (JANGAN DITIMPA!)
===================================================== */
window.generatedRoutes = JSON.parse(
    sessionStorage.getItem("generated_routes") || "[]"
);
window.routingLayer = null;

/* =====================================================
   GENERATE ROUTE
===================================================== */
document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("generateRouteBtn");
    const dayFilter = document.getElementById("filterDay");

    if (!btn) return;

    btn.onclick = async () => {

        btn.disabled = true;
        btn.innerText = "⏳ Generating...";

        const salesCount = parseInt(document.getElementById("salesCount").value);
        const maxOutletPerDay = parseInt(document.getElementById("maxOutlet").value);

        if (!salesCount || !maxOutletPerDay) {
            showError("Input tidak valid");
            return resetBtn(btn);
        }

        const saved = localStorage.getItem("warehouse_location");
        if (!saved) {
            showError("Gudang belum disimpan");
            return resetBtn(btn);
        }

        const depot = JSON.parse(saved);

        try {
            const res = await fetch("/api/outlets");
            const outlets = await res.json();
            if (!outlets.length) throw new Error("Outlet kosong");

            outlets.forEach(o => {
                o.latitude = +o.latitude;
                o.longitude = +o.longitude;
                o.distance = distance(
                    depot.lat,
                    depot.lng,
                    o.latitude,
                    o.longitude
                );
            });

            outlets.sort((a, b) => b.distance - a.distance);

            const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
            const perSales = Math.floor(outlets.length / salesCount);
            let idx = 0;
            const routes = [];

            for (let s = 1; s <= salesCount; s++) {

                const slice = outlets.slice(idx, idx + perSales);
                idx += perSales;

                let base = Math.floor(slice.length / 6);
                let rem = slice.length % 6;
                let p = 0;

                for (let d = 0; d < 6; d++) {

                    let count = base + (rem-- > 0 ? 1 : 0);
                    if (count > maxOutletPerDay)
                        throw new Error("Max outlet per hari terlampaui");

                    const daySlice = slice.slice(p, p + count);
                    p += count;

                    if (!daySlice.length) continue;

                    routes.push({
                        day: days[d],
                        sales: `Sales ${s}`,
                        outlets: nearestNeighborRoute(depot, daySlice)
                    });
                }
            }

            /* SIMPAN STATE */
            window.generatedRoutes = routes;
            sessionStorage.setItem("generated_routes", JSON.stringify(routes));

            renderRoutingTable(routes);
            initRoutingLayer();
            renderMapByDay("Senin");

        } catch (e) {
            showError(e.message);
        }

        resetBtn(btn);
    };

    if (dayFilter) {
        dayFilter.onchange = () => renderMapByDay(dayFilter.value);
    }

    /* AUTO RENDER JIKA BALIK DARI BACK */
    if (window.generatedRoutes.length) {
        initRoutingLayer();
        renderMapByDay(dayFilter?.value || "Senin");
    }
});

/* =====================================================
   MAP
===================================================== */
function initRoutingLayer() {

    if (!window.warehouseMap) return;

    if (window.routingLayer) {
        window.routingLayer.clearLayers();
        warehouseMap.removeLayer(window.routingLayer);
    }

    window.routingLayer = L.layerGroup().addTo(warehouseMap);
}

function renderMapByDay(day) {

    if (!window.generatedRoutes.length) return;
    if (!window.routingLayer) initRoutingLayer();

    window.routingLayer.clearLayers();

    const filtered = window.generatedRoutes.filter(r => r.day === day);
    if (!filtered.length) return;

    const colors = ["#1E90FF", "#27AE60", "#E67E22", "#8E44AD", "#C0392B"];

    filtered.forEach((route, idx) => {

        const color = colors[idx % colors.length];

        route.outlets.forEach((o, i) => {

            L.marker([o.latitude, o.longitude],
                {icon:createPinIcon(color)
                })
            .addTo(window.routingLayer)
            .bindPopup(`
                <b>${o.name}</b><br>
                ${route.sales}<br>
                ${route.day}<br>
                Urutan: ${i + 1}
            `);
        });
    });
}

/* =====================================================
   TABLE
===================================================== */
function renderRoutingTable(routes) {
    const container = document.getElementById("routingResult");
    container.innerHTML = "";

    routes.forEach(route => {

        let rows = "";
        route.outlets.forEach((o, i) => {
            rows += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${o.name}</td>
                    <td>${o.latitude}</td>
                    <td>${o.longitude}</td>
                    <td>${o.distance.toFixed(2)} km</td>
                </tr>
            `;
        });

        container.innerHTML += `
            <h3>📅 ${route.day} — 👤 ${route.sales} (${route.outlets.length})</h3>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Outlet</th>
                        <th>Lat</th>
                        <th>Lng</th>
                        <th>Jarak</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        `;
    });
}

/* =====================================================
   UTIL
===================================================== */
function nearestNeighborRoute(start, points) {
    let cur = start;
    const res = [];
    const rem = [...points];

    while (rem.length) {
        rem.sort((a, b) =>
            distance(cur.lat, cur.lng, a.latitude, a.longitude) -
            distance(cur.lat, cur.lng, b.latitude, b.longitude)
        );
        const next = rem.shift();
        res.push(next);
        cur = { lat: next.latitude, lng: next.longitude };
    }
    return res;
}

function showError(msg) {
    document.getElementById("routingResult").innerHTML =
        `<p style="color:red;font-weight:bold;">${msg}</p>`;
}

function resetBtn(btn) {
    btn.disabled = false;
    btn.innerText = "🚀 Generate Route";
}

function distance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.asin(Math.sqrt(a));
}
