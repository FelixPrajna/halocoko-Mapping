// Inisialisasi map
const warehouseMap = L.map('warehouse-map').setView([-6.175110, 106.865036], 13);

// Tile OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
}).addTo(warehouseMap);

// Tombol Tambah Gudang
document.getElementById('addWarehouseBtn').addEventListener('click', function() {
    const name = document.getElementById('warehouse-name').value;
    const lat = parseFloat(document.getElementById('warehouse-lat').value);
    const lng = parseFloat(document.getElementById('warehouse-lng').value);

    if (!name || isNaN(lat) || isNaN(lng)) {
        alert('Harap isi nama, latitude, dan longitude dengan benar!');
        return;
    }

    // Tambahkan marker
    L.marker([lat, lng])
        .addTo(warehouseMap)
        .bindPopup(`<b>${name}</b><br>Lat: ${lat}, Lng: ${lng}`)
        .openPopup();

    // Center map ke lokasi baru
    warehouseMap.setView([lat, lng], 13);

    // Reset form
    document.getElementById('warehouse-name').value = '';
    document.getElementById('warehouse-lat').value = '';
    document.getElementById('warehouse-lng').value = '';
});

const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', () => {
    const fileName = fileInput.files[0]?.name || '';
    if(fileName) {
        document.querySelector('.upload-label').innerText = fileName;
    }
});
