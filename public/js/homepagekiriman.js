document.addEventListener("DOMContentLoaded", () => {

    /* ================= GLOBAL DATA ================= */
    let currentRows = [];

    /* ================= MAP ================= */
    const map = L.map("map").setView([-6.2, 106.8], 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    const markers = [];

    /* ================= ICON ================= */
    const warehouseIcon = new L.Icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    const outletIcon = new L.Icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    /* ================= WAREHOUSE ================= */
    const warehouseName = document.getElementById("warehouseName");
    const warehouseLat  = document.getElementById("warehouseLat");
    const warehouseLng  = document.getElementById("warehouseLng");
    const btnAddWarehouse = document.getElementById("btnAddWarehouse");

    let warehouseMarker = null;

    const savedWarehouse = localStorage.getItem("warehouse");
    if (savedWarehouse) {
        const w = JSON.parse(savedWarehouse);
        warehouseMarker = L.marker([w.lat, w.lng], { icon: warehouseIcon })
            .addTo(map)
            .bindPopup(`<b>Gudang</b><br>${w.name}`);
    }

    btnAddWarehouse.addEventListener("click", () => {
        const name = warehouseName.value.trim();
        const lat  = parseFloat(warehouseLat.value);
        const lng  = parseFloat(warehouseLng.value);

        if (!name || isNaN(lat) || isNaN(lng)) return alert("❌ Data gudang tidak valid");

        if (warehouseMarker) map.removeLayer(warehouseMarker);

        warehouseMarker = L.marker([lat, lng], { icon: warehouseIcon })
            .addTo(map)
            .bindPopup(`<b>Gudang</b><br>${name}`)
            .openPopup();

        localStorage.setItem("warehouse", JSON.stringify({ name, lat, lng }));
    });

    /* ================= FILE ================= */
    const fileInput = document.getElementById("fileInput");
    const btnChooseFile = document.getElementById("btnChooseFile");
    const fileNameText = document.getElementById("fileNameText");
    const btnUpload = document.getElementById("btnUpload");
    const tableBody = document.querySelector("#resultTable tbody");
    const btnSaveEdit = document.getElementById("btnSaveEdit");

    let selectedFile = null;

    const REQUIRED_COLUMNS = [
        "kode toko","nama toko","invoice no",
        "item produk","qty","value","latitude","longitude"
    ];

    btnChooseFile.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", () => {
        selectedFile = fileInput.files[0];
        if (!selectedFile) return;
        fileNameText.textContent = selectedFile.name;
        btnUpload.disabled = false;
    });

    btnUpload.addEventListener("click", () => {
        if (!selectedFile) return;
        clearAll();
        const ext = selectedFile.name.split(".").pop().toLowerCase();
        ext === "csv" ? readCSV(selectedFile) :
        ext === "xlsx" ? readExcel(selectedFile) :
        alert("❌ Format tidak didukung");
    });

    function readCSV(file) {
        const reader = new FileReader();
        reader.onload = e => validateAndRender(csvToJson(e.target.result));
        reader.readAsText(file);
    }

    function csvToJson(text) {
        const lines = text.split(/\r?\n/).filter(l => l.trim());
        const delimiter = lines[0].includes(";") ? ";" : ",";
        const headers = lines[0].split(delimiter).map(h => h.toLowerCase());

        return lines.slice(1).map(line => {
            const obj = {};
            line.split(delimiter).forEach((v, i) => obj[headers[i]] = v);
            return obj;
        });
    }

    function readExcel(file) {
        const reader = new FileReader();
        reader.onload = e => {
            const wb = XLSX.read(e.target.result, { type: "array" });
            const sheet = wb.Sheets[wb.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" })
                .map(r => Object.fromEntries(
                    Object.entries(r).map(([k,v]) => [k.toLowerCase(), v])
                ));
            validateAndRender(rows);
        };
        reader.readAsArrayBuffer(file);
    }

    function validateAndRender(rows) {
        const cols = Object.keys(rows[0] || {});
        const missing = REQUIRED_COLUMNS.filter(c => !cols.includes(c));
        if (missing.length) return alert("❌ Kolom kurang:\n" + missing.join("\n"));

        currentRows = rows;
        saveToStorage();
        render(currentRows);
    }

    function render(rows) {
        clearAll();

        rows.forEach((r, i) => {
            const lat = parseFloat(r["latitude"]);
            const lng = parseFloat(r["longitude"]);

            if (!isNaN(lat) && !isNaN(lng)) {
                markers.push(
                    L.marker([lat, lng], { icon: outletIcon })
                        .addTo(map)
                        .bindPopup(`<b>${r["nama toko"]}</b>`)
                );
            }

            tableBody.innerHTML += `
                <tr>
                    <td>${i + 1}</td>
                    <td contenteditable>${r["kode toko"]}</td>
                    <td contenteditable>${r["nama toko"]}</td>
                    <td contenteditable>${r["invoice no"]}</td>
                    <td contenteditable>${r["item produk"]}</td>
                    <td contenteditable>${r["qty"]}</td>
                    <td contenteditable>${r["value"]}</td>
                    <td contenteditable>${r["latitude"]}</td>
                    <td contenteditable>${r["longitude"]}</td>
                </tr>`;
        });

        if (markers.length) map.fitBounds(L.featureGroup(markers).getBounds());
    }

    btnSaveEdit.addEventListener("click", () => {
        const trs = tableBody.querySelectorAll("tr");
        currentRows = [...trs].map(tr => {
            const td = tr.querySelectorAll("td");
            return {
                "kode toko": td[1].innerText.trim(),
                "nama toko": td[2].innerText.trim(),
                "invoice no": td[3].innerText.trim(),
                "item produk": td[4].innerText.trim(),
                "qty": td[5].innerText.trim(),
                "value": td[6].innerText.trim(),
                "latitude": td[7].innerText.trim(),
                "longitude": td[8].innerText.trim()
            };
        });

        saveToStorage();
        render(currentRows);
        alert("✅ Perubahan berhasil disimpan");
    });

    function saveToStorage() {
        localStorage.setItem("lastUploadRows", JSON.stringify(currentRows));
    }

    function loadFromStorage() {
        const saved = localStorage.getItem("lastUploadRows");
        if (saved) {
            currentRows = JSON.parse(saved);
            render(currentRows);
        }
    }

    function clearAll() {
        markers.forEach(m => map.removeLayer(m));
        markers.length = 0;
        tableBody.innerHTML = "";
    }

    loadFromStorage();

    /* =====================================================
       🚀 ROUTING MULTI MOTORIST + ANTI DUPLIKAT WARUNG
    ===================================================== */

    const btnGenerateRoute = document.getElementById("btnGenerateRoute");

    if (btnGenerateRoute) {
        btnGenerateRoute.addEventListener("click", () => {

            const warehouseData = localStorage.getItem("warehouse");
            if (!warehouseData) return alert("❌ Gudang belum diset");

            const warehouse = JSON.parse(warehouseData);
            const outlets = getOutletFromTable();
            if (!outlets.length) return alert("❌ Data toko belum valid");

            const motorInput = document.getElementById("motoristCount");
            const motorCount = Math.max(1, parseInt(motorInput?.value || 1));

            const ordered = nearestNeighbour(
                { lat: warehouse.lat, lng: warehouse.lng },
                outlets
            );

            updateOrderToTable(ordered);
            tampilkanHasilRouting(ordered, warehouse, motorCount);

            alert("✅ Routing berhasil dibuat");
        });
    }

    function tampilkanHasilRouting(ordered, warehouse, motorCount) {
        const wrapper = document.getElementById("routingResultWrapper");
        const tbody = document.getElementById("routingTableBody");
        const summary = document.getElementById("routingSummary");

        if (!wrapper || !tbody || !summary) return;

        tbody.innerHTML = "";

        const rowsEl = document.querySelectorAll("#resultTable tbody tr");

        const enriched = ordered.map(o => {
            const rowEl = rowsEl[o.rowIndex];
            const namaToko = rowEl?.cells[2]?.innerText?.trim() || "-";
            return { ...o, namaToko };
        });

        // 🔥 REMOVE DUPLIKAT
        const uniqueOrdered = removeDuplicateOutlets(enriched, warehouse);

        const groups = Array.from({ length: motorCount }, () => []);
        uniqueOrdered.forEach((o, i) => groups[i % motorCount].push(o));

        let totalJarak = 0;
        let totalWaktu = 0;
        const speed = 30;
        const bensinPerKm = 0.04;

        groups.forEach((group, idx) => {
            let current = { lat: warehouse.lat, lng: warehouse.lng };

            group.forEach((o, urutan) => {
                const jarak = getDistance(current.lat, current.lng, o.lat, o.lng);
                const waktu = (jarak / speed) * 60;

                totalJarak += jarak;
                totalWaktu += waktu;

                tbody.insertAdjacentHTML("beforeend", `
                    <tr>
                        <td>Motorist ${idx + 1}</td>
                        <td>${urutan + 1}</td>
                        <td>${o.namaToko}</td>
                        <td>${jarak.toFixed(2)}</td>
                        <td>${formatMenit(waktu)}</td>
                    </tr>
                `);

                current = o;
            });
        });

        const totalBensin = totalJarak * bensinPerKm;

        summary.innerHTML = `
            <b>Total Estimasi:</b><br>
            Jarak: <b>${totalJarak.toFixed(2)} km</b> |
            Waktu: <b>${formatMenit(totalWaktu)}</b> |
            Bensin: <b>${totalBensin.toFixed(2)} liter</b>
        `;

        wrapper.style.display = "block";
    }

    function formatMenit(totalMenit) {
        const jam = Math.floor(totalMenit / 60);
        const menit = Math.round(totalMenit % 60);
        return jam > 0 ? `${jam} jam ${menit} menit` : `${menit} menit`;
    }

});

/* ================= REMOVE DUPLIKAT WARUNG ================= */
function removeDuplicateOutlets(outlets, warehouse) {
    const map = {};

    outlets.forEach(o => {
        const key = o.namaToko.toLowerCase().trim();

        const distFromWarehouse = getDistance(
            warehouse.lat,
            warehouse.lng,
            o.lat,
            o.lng
        );

        if (!map[key]) {
            map[key] = { ...o, distFromWarehouse };
        } else {
            if (distFromWarehouse < map[key].distFromWarehouse) {
                map[key] = { ...o, distFromWarehouse };
            }
        }
    });

    return Object.values(map);
}

/* ================= RESULT DROPDOWN ================= */
const resultToggle = document.getElementById("resultToggle");
const resultContent = document.getElementById("resultContent");
const resultArrow = document.getElementById("resultArrow");

if (resultContent) resultContent.style.maxHeight = "0px";
let isOpen = false;

if (resultToggle) {
    resultToggle.addEventListener("click", () => {
        isOpen = !isOpen;
        resultContent.style.maxHeight = isOpen ? resultContent.scrollHeight + "px" : "0px";
        resultArrow.textContent = isOpen ? "▲" : "▼";
    });
}

/* ================= NEAREST NEIGHBOUR ================= */

function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function getOutletFromTable() {
    const rows = document.querySelectorAll("#resultTable tbody tr");
    const outlets = [];

    rows.forEach((tr, i) => {
        const tds = tr.querySelectorAll("td");
        if (tds.length < 9) return;

        const lat = parseFloat(tds[7].innerText);
        const lng = parseFloat(tds[8].innerText);

        if (!isNaN(lat) && !isNaN(lng)) {
            outlets.push({
                rowIndex: i,
                lat,
                lng
            });
        }
    });

    return outlets;
}

function nearestNeighbour(start, outlets) {
    const visited = [];
    let current = start;
    let remaining = [...outlets];

    while (remaining.length) {
        let nearestIdx = 0;
        let shortest = Infinity;

        remaining.forEach((o, i) => {
            const d = getDistance(
                current.lat, current.lng,
                o.lat, o.lng
            );
            if (d < shortest) {
                shortest = d;
                nearestIdx = i;
            }
        });

        const next = remaining.splice(nearestIdx, 1)[0];
        visited.push(next);
        current = next;
    }

    return visited;
}

function updateOrderToTable(ordered) {
    const rows = document.querySelectorAll("#resultTable tbody tr");

    ordered.forEach((o, i) => {
        const row = rows[o.rowIndex];
        if (row) row.cells[0].innerText = i + 1;
    });
}
