// ===============================
// INIT MAP GUDANG
// ===============================
const warehouseMap = L.map('warehouse-map').setView([-6.175110, 106.865036], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(warehouseMap);

// ===============================
// GLOBAL MAP STATE (WAJIB ADA)
// ===============================
window.warehouseMap = warehouseMap;
window.routingLayer = L.layerGroup().addTo(warehouseMap);

let warehouseMarker = null;

// ===============================
// LOAD GUDANG DARI LOCAL STORAGE
// ===============================
document.addEventListener("DOMContentLoaded", () => {

    const saved = localStorage.getItem("warehouse_location");

    if (saved) {
        const w = JSON.parse(saved);

        document.getElementById("warehouse-name").value = w.name;
        document.getElementById("warehouse-lat").value = w.lat;
        document.getElementById("warehouse-lng").value = w.lng;

        warehouseMarker = L.marker([w.lat, w.lng])
            .addTo(warehouseMap)
            .bindPopup(`🏭 Gudang Aktif<br><b>${w.name}</b>`)
            .openPopup();

        warehouseMap.setView([w.lat, w.lng], 13);
    }
});

// ===============================
// SIMPAN GUDANG BARU
// ===============================
document.getElementById('addWarehouseBtn').addEventListener('click', () => {

    const name = document.getElementById('warehouse-name').value.trim();
    const lat = parseFloat(document.getElementById('warehouse-lat').value);
    const lng = parseFloat(document.getElementById('warehouse-lng').value);

    if (!name || isNaN(lat) || isNaN(lng)) {
        alert('Harap isi nama, latitude, dan longitude dengan benar!');
        return;
    }

    localStorage.setItem("warehouse_location", JSON.stringify({
        name, lat, lng
    }));

    if (warehouseMarker) {
        warehouseMap.removeLayer(warehouseMarker);
    }

    warehouseMarker = L.marker([lat, lng])
        .addTo(warehouseMap)
        .bindPopup(`🏭 Gudang Aktif<br><b>${name}</b>`)
        .openPopup();

    warehouseMap.setView([lat, lng], 13);

    alert("Lokasi gudang berhasil disimpan ✔");
});

// ===============================
// FILE UPLOAD LABEL
// ===============================
const fileInput = document.getElementById('fileInput');
if (fileInput) {
    fileInput.addEventListener('change', () => {
        const fileName = fileInput.files[0]?.name;
        if (fileName) {
            document.querySelector('.upload-label span').innerHTML =
                `File terpilih:<br><strong>${fileName}</strong>`;
        }
    });
}

// ===============================
// DROPDOWN DATA OUTLET
// ===============================
const toggle = document.getElementById('toggleData');
const wrapper = document.querySelector('.data-wrapper');

if (toggle && wrapper) {
    toggle.addEventListener('click', () => {
        wrapper.classList.toggle('open');
    });
}
