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

// ================= TOGGLE DROPDOWN =================
const toggle = document.getElementById('toggleData');
const wrapper = document.querySelector('.data-wrapper');

toggle.addEventListener('click', () => {
    wrapper.classList.toggle('open');
});

// ================= LOAD DATA OUTLET =================
fetch('/api/outlets')
    .then(res => res.json())
    .then(data => {
        const tbody = document.getElementById('outletTableBody');
        tbody.innerHTML = '';

        data.forEach((o, i) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${i + 1}</td>
                <td>${o.name}</td>
                <td>${o.latitude}</td>
                <td>${o.longitude}</td>
            `;
            tbody.appendChild(tr);
        });
    })
    .catch(err => console.error('Gagal load data outlet:', err));

    