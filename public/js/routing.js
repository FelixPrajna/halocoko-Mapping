window.allRouteMarkers = [];

const DAY_ORDER = {
    Senin: 1,
    Selasa: 2,
    Rabu: 3,
    Kamis: 4,
    Jumat: 5,
    Sabtu: 6
};

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
    window.allRouteMarkers = []; // 🔥 RESET SEARCH DATA

    const filtered = window.generatedRoutes.filter(r => r.day === day);
    if (!filtered.length) return;

    const colors = ["#1E90FF", "#27AE60", "#E67E22", "#8E44AD", "#C0392B"];

    filtered.forEach((route, idx) => {

        const color = colors[idx % colors.length];

        route.outlets.forEach((o, i) => {

            const marker = L.marker(
                [o.latitude, o.longitude],
                { icon: createPinIcon(color) }
            )
            .addTo(window.routingLayer)
            .bindPopup(`
                <b>${o.name}</b><br>
                ${route.sales}<br>
                ${route.day}<br>
                Urutan: ${i + 1}
            `);

            // 🔥 SIMPAN MARKER UNTUK SEARCH
            window.allRouteMarkers.push({
                name: o.name.toLowerCase(),
                marker
            });
        });
    });
}


function renderRoutingTable(routes) {
    const container = document.getElementById("routingResult");
    container.innerHTML = "";

    routes.forEach((route, routeIndex) => {

        let rows = "";
        route.outlets.forEach((o, i) => {

            rows += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${o.name}</td>

                    <td>
                        <select class="edit-day day-dropdown"
                            data-route-index="${routeIndex}"
                            data-outlet-index="${i}">
                            ${Object.keys(DAY_ORDER).map(d =>
                                `<option value="${d}" ${d === route.day ? "selected" : ""}>${d}</option>`
                            ).join("")}
                        </select>
                    </td>

                    <td>
                        <select class="edit-sales sales-dropdown"
                            data-route-index="${routeIndex}"
                            data-outlet-index="${i}">
                            ${getSalesList().map(s =>
                                `<option value="${s}" ${s === route.sales ? 'selected' : ''}>${s}</option>`
                            ).join("")}
                        </select>
                    </td>

                    <td>${o.latitude}</td>
                    <td>${o.longitude}</td>
                    <td>${o.distance.toFixed(2)} km</td>
                </tr>
            `;
        });

        container.innerHTML += `
            <div style="margin-bottom:30px;">
                <h3>📅 ${route.day} — 👤 ${route.sales} (${route.outlets.length})</h3>

                <table class="data-table">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Outlet</th>
                            <th>Hari</th>
                            <th>Sales</th>
                            <th>Lat</th>
                            <th>Lng</th>
                            <th>Jarak</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </div>
        `;
    });
}
document.addEventListener("change", function (e) {
    if (!e.target.classList.contains("edit-day")) return;

    const routeIndex = e.target.dataset.routeIndex;
    const outletIndex = e.target.dataset.outletIndex;
    const newDay = e.target.value;

    moveOutletToNewDay(routeIndex, outletIndex, newDay);
});

document.addEventListener("change", function (e) {

    if (e.target.classList.contains("edit-sales")) {

        const routeIndex = e.target.dataset.routeIndex;
        const outletIndex = e.target.dataset.outletIndex;
        const newSales = e.target.value;

        moveOutletToNewSales(routeIndex, outletIndex, newSales);
    }
});

function moveOutletToNewSales(routeIndex, outletIndex, newSales) {

    const route = window.generatedRoutes[routeIndex];
    const outlet = route.outlets[outletIndex];

    // Hapus outlet dari route lama
    route.outlets.splice(outletIndex, 1);

    // Cari route target (hari sama, sales beda)
    let targetRoute = window.generatedRoutes.find(r =>
        r.day === route.day && r.sales === newSales
    );

    if (!targetRoute) {
        targetRoute = {
            day: route.day,
            sales: newSales,
            outlets: []
        };
        window.generatedRoutes.push(targetRoute);
    }

    targetRoute.outlets.push(outlet);

    // Bersihkan route kosong
    window.generatedRoutes = window.generatedRoutes.filter(r => r.outlets.length);

    sortGeneratedRoutes();

    renderRoutingTable(window.generatedRoutes);
    renderMapByDay(route.day);
}

function moveOutletToNewDay(routeIndex, outletIndex, newDay) {

    const route = window.generatedRoutes[routeIndex];
    const outlet = route.outlets[outletIndex];

    // Hapus outlet dari route lama
    route.outlets.splice(outletIndex, 1);

    // Cari route tujuan (hari + sales sama)
    let targetRoute = window.generatedRoutes.find(r =>
        r.day === newDay && r.sales === route.sales
    );

    if (!targetRoute) {
        targetRoute = {
            day: newDay,
            sales: route.sales,
            outlets: []
        };
        window.generatedRoutes.push(targetRoute);
    }

    targetRoute.outlets.push(outlet);

    // Bersihkan route kosong
    window.generatedRoutes = window.generatedRoutes.filter(r => r.outlets.length);

    sortGeneratedRoutes();

    // RENDER ULANG
    renderRoutingTable(window.generatedRoutes);
    renderMapByDay(newDay);
}
function sortGeneratedRoutes() {
    window.generatedRoutes.sort((a, b) => {

        if (a.sales !== b.sales) {
            return a.sales.localeCompare(b.sales);
        }

        return DAY_ORDER[a.day] - DAY_ORDER[b.day];
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

/* =====================================================
   EXPORT CSV
===================================================== */
document.addEventListener("DOMContentLoaded", () => {
    const exportBtn = document.getElementById("exportCsvBtn");
    if (!exportBtn) return;

    exportBtn.onclick = () => exportGeneratedRoutesToCSV();
});

function exportGeneratedRoutesToCSV() {

    if (!window.generatedRoutes.length) {
        alert("Belum ada data routing");
        return;
    }

    let csv = [];
    csv.push(["No", "Outlet", "Hari", "Sales", "Lat", "Lng", "Jarak (km)"]);

    let no = 1;

    window.generatedRoutes.forEach(route => {
        route.outlets.forEach(o => {
            csv.push([
                no++,
                o.name,
                route.day,
                route.sales,
                o.latitude,
                o.longitude,
                o.distance.toFixed(2)
            ]);
        });
    });

    const csvContent = csv
        .map(row => row.map(val => `"${val}"`).join(","))
        .join("\n");

    downloadCSV(csvContent, "hasil_routing.csv");
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function collectEditedRoutingData() {
    const rows = document.querySelectorAll(".routing-row");
    const data = [];

    rows.forEach(row => {
        data.push({
            outlet: row.querySelector(".col-outlet").innerText,
            day: row.querySelector(".col-day").innerText,
            sales: row.querySelector(".col-sales").innerText,
            lat: row.querySelector(".col-lat").innerText,
            lng: row.querySelector(".col-lng").innerText,
            distance: row.querySelector(".col-distance").innerText
        });
    });

    return data;
}

fetch('/routing/save', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document
            .querySelector('meta[name="csrf-token"]').content
    },
    body: JSON.stringify({
        routes: collectEditedRoutingData()
    })
});

let isEditMode = false;

document.getElementById("editRoutingBtn").onclick = () => {
    isEditMode = true;
    document.getElementById("saveRoutingBtn").style.display = "inline-block";

    document.querySelectorAll("#routingResult td[data-editable]")
        .forEach(td => td.contentEditable = true);
};

document.getElementById("saveRoutingBtn").onclick = () => {
    isEditMode = false;

    document.querySelectorAll("#routingResult td")
        .forEach(td => td.contentEditable = false);

    saveEditedTable();
};

function getSalesList() {
    return [...new Set(
        window.generatedRoutes.map(r => r.sales)
    )].sort((a, b) => {
        const na = parseInt(a.replace(/\D/g, '')) || 0;
        const nb = parseInt(b.replace(/\D/g, '')) || 0;
        return na - nb;
    });
}
