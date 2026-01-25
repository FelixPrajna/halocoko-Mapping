document.addEventListener("DOMContentLoaded", () => {

    /* ================= MAP INIT ================= */
    const map = L.map("map", {
        scrollWheelZoom: true
    }).setView([-6.2, 106.8], 11);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    /* ================= WAREHOUSE ================= */
    let warehouseMarker = null;

    const nameInput = document.getElementById("warehouseName");
    const latInput  = document.getElementById("warehouseLat");
    const lngInput  = document.getElementById("warehouseLng");
    const addBtn    = document.getElementById("btnAddWarehouse");

    function setWarehouse(name, lat, lng) {

        if (isNaN(lat) || isNaN(lng)) {
            alert("Latitude / Longitude tidak valid");
            return;
        }

        if (warehouseMarker) {
            map.removeLayer(warehouseMarker);
        }

        warehouseMarker = L.marker([lat, lng])
            .addTo(map)
            .bindPopup(`<b>${name}</b><br>${lat}, ${lng}`)
            .openPopup();

        map.setView([lat, lng], 14);
    }

    addBtn.addEventListener("click", () => {

        const name = nameInput.value.trim();
        const lat  = parseFloat(latInput.value);
        const lng  = parseFloat(lngInput.value);

        if (!name || isNaN(lat) || isNaN(lng)) {
            alert("Nama, Latitude, atau Longitude tidak valid");
            return;
        }

        setWarehouse(name, lat, lng);
    });

    /* ================= CSV UPLOAD ================= */
    const csvInput = document.getElementById("csvFile");
    const outletMarkers = [];

    csvInput.addEventListener("change", function (e) {

        const file = e.target.files[0];
        if (!file) return;

        // bersihkan marker lama
        outletMarkers.forEach(m => map.removeLayer(m));
        outletMarkers.length = 0;

        const reader = new FileReader();

        reader.onload = function (event) {

            const text = event.target.result;
            const rows = text.split("\n");

            rows.forEach((row, index) => {

                if (index === 0 || row.trim() === "") return;

                const cols = row.split(",");

                if (cols.length < 3) return;

                const name = cols[0].trim();
                const lat  = parseFloat(cols[1]);
                const lng  = parseFloat(cols[2]);

                if (isNaN(lat) || isNaN(lng)) return;

                const marker = L.marker([lat, lng])
                    .addTo(map)
                    .bindPopup(`<b>${name}</b><br>${lat}, ${lng}`);

                outletMarkers.push(marker);
            });

            if (outletMarkers.length > 0) {
                const group = L.featureGroup(outletMarkers);
                map.fitBounds(group.getBounds(), {
                    padding: [50, 50]
                });
            }
        };

        reader.readAsText(file);
    });

});
