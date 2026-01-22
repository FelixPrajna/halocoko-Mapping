document.addEventListener('DOMContentLoaded', function () {

    const map = L.map('map').setView([-6.2, 106.8], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    let warehouseMarker = null;

    // ================= LOAD GUDANG =================
    fetch('/api/warehouses')
        .then(res => res.json())
        .then(data => {
            if (data.length > 0) {
                const w = data[0];
                setWarehouse(w.name, w.latitude, w.longitude);
            }
        });

    function setWarehouse(name, lat, lng) {
        if (warehouseMarker) {
            map.removeLayer(warehouseMarker);
        }

        warehouseMarker = L.marker([lat, lng])
            .addTo(map)
            .bindPopup(`<b>${name}</b><br>${lat}, ${lng}`)
            .openPopup();

        map.setView([lat, lng], 13);
    }

    // ================= ADD =================
    document.getElementById('btnAddWarehouse').addEventListener('click', () => {

        const name = warehouseName.value;
        const lat  = warehouseLat.value;
        const lng  = warehouseLng.value;

        fetch('/api/warehouses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document
                    .querySelector('meta[name="csrf-token"]').content
            },
            body: JSON.stringify({
                name: name,
                latitude: lat,
                longitude: lng
            })
        })
        .then(res => res.json())
        .then(data => {
            setWarehouse(data.name, data.latitude, data.longitude);
        });

    });

});
