document.addEventListener("DOMContentLoaded", () => {

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

    // LOAD WAREHOUSE DARI STORAGE
    const savedWarehouse = localStorage.getItem("warehouse");
    if (savedWarehouse) {
        const w = JSON.parse(savedWarehouse);
        warehouseMarker = L.marker([w.lat, w.lng], { icon: warehouseIcon })
            .addTo(map)
            .bindPopup(`<b>Gudang</b><br>${w.name}`);

        map.setView([w.lat, w.lng], 14);
    }

    btnAddWarehouse.addEventListener("click", () => {
        const name = warehouseName.value.trim();
        const lat  = parseFloat(warehouseLat.value);
        const lng  = parseFloat(warehouseLng.value);

        if (!name || isNaN(lat) || isNaN(lng)) {
            alert("❌ Data gudang tidak valid");
            return;
        }

        // HAPUS MARKER LAMA
        if (warehouseMarker) {
            map.removeLayer(warehouseMarker);
        }

        // TAMBAH MARKER BARU
        warehouseMarker = L.marker([lat, lng], { icon: warehouseIcon })
            .addTo(map)
            .bindPopup(`<b>Gudang</b><br>${name}`)
            .openPopup();

        // SIMPAN KE STORAGE
        localStorage.setItem("warehouse", JSON.stringify({
            name, lat, lng
        }));

        map.setView([lat, lng], 14);
    });

    /* ================= FILE ================= */
    const fileInput     = document.getElementById("fileInput");
    const btnChooseFile = document.getElementById("btnChooseFile");
    const fileNameText  = document.getElementById("fileNameText");
    const btnUpload     = document.getElementById("btnUpload");
    const tableBody     = document.querySelector("#resultTable tbody");

    let selectedFile = null;

    const REQUIRED_COLUMNS = [
        "kode toko",
        "nama toko",
        "invoice no",
        "item produk",
        "qty",
        "value",
        "latitude",
        "longitude"
    ];

    btnChooseFile.addEventListener("click", () => {
        fileInput.click();
    });

    fileInput.addEventListener("change", () => {
        if (!fileInput.files.length) return;

        selectedFile = fileInput.files[0];
        fileNameText.textContent = `📄 ${selectedFile.name}`;
        btnUpload.disabled = false;
    });

    btnUpload.addEventListener("click", () => {
        if (!selectedFile) return;

        clearAll();

        const ext = selectedFile.name.split(".").pop().toLowerCase();

        if (ext === "csv") readCSV(selectedFile);
        else if (ext === "xlsx") readExcel(selectedFile);
        else alert("❌ Format file tidak didukung");
    });

    /* ================= CSV ================= */
    function readCSV(file) {
        const reader = new FileReader();
        reader.onload = e => {
            const rows = csvToJson(e.target.result);
            validateAndRender(rows);
        };
        reader.readAsText(file);
    }

    function csvToJson(text) {
        const lines = text.split(/\r?\n/).filter(l => l.trim());
        const delimiter = lines[0].includes(";") ? ";" : ",";
        const headers = lines[0].split(delimiter).map(h => h.toLowerCase());

        return lines.slice(1).map(line => {
            const cols = line.split(delimiter);
            const obj = {};
            headers.forEach((h, i) => obj[h] = cols[i]);
            return obj;
        });
    }

    /* ================= EXCEL ================= */
    function readExcel(file) {
        const reader = new FileReader();
        reader.onload = e => {
            const wb = XLSX.read(e.target.result, { type: "array" });
            const sheet = wb.Sheets[wb.SheetNames[0]];
            const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
            const rows = normalizeRows(rawRows);
            validateAndRender(rows);
        };
        reader.readAsArrayBuffer(file);
    }

    function normalizeRows(rows) {
        return rows.map(row => {
            const obj = {};
            Object.keys(row).forEach(k => {
                obj[k.toLowerCase()] = row[k];
            });
            return obj;
        });
    }

    /* ================= VALIDATION ================= */
    function validateAndRender(rows) {
        if (!rows.length) {
            alert("❌ Upload gagal: File kosong");
            return;
        }

        const columns = Object.keys(rows[0]);
        const missing = REQUIRED_COLUMNS.filter(c => !columns.includes(c));

        if (missing.length) {
            alert(
                "❌ Upload GAGAL!\n\nKolom berikut tidak ditemukan:\n" +
                missing.map(m => `- ${m}`).join("\n")
            );
            return;
        }

        render(rows);
        alert(`✅ Upload berhasil!\nFile: ${selectedFile.name}`);
    }

    /* ================= RENDER ================= */
    function render(rows) {
        tableBody.innerHTML = "";
        let no = 0;

        rows.forEach(r => {
            const kode = r["kode toko"];
            const nama = r["nama toko"];
            const inv  = r["invoice no"];
            const item = r["item produk"];
            const qty  = r["qty"];
            const val  = r["value"];
            const lat  = parseFloat(r["latitude"]);
            const lng  = parseFloat(r["longitude"]);

            if (!nama || isNaN(lat) || isNaN(lng)) return;

            no++;

            const marker = L.marker([lat, lng], { icon: outletIcon })
                .addTo(map)
                .bindPopup(`
    <b>${nama}</b><br>
    <small>Kode Toko: ${kode}</small>
`);


            markers.push(marker);

            tableBody.innerHTML += `
                <tr class="dark-row">
                    <td>${no}</td>
                    <td>${kode}</td>
                    <td>${nama}</td>
                    <td>${inv}</td>
                    <td>${item}</td>
                    <td>${qty}</td>
                    <td>${val}</td>
                    <td>${lat}</td>
                    <td>${lng}</td>
                </tr>
            `;
        });

        const allMarkers = [...markers];
        if (warehouseMarker) allMarkers.push(warehouseMarker);

        if (allMarkers.length) {
            map.fitBounds(L.featureGroup(allMarkers).getBounds(), {
                padding: [40, 40]
            });
        }
    }

    function clearAll() {
        markers.forEach(m => map.removeLayer(m));
        markers.length = 0;
        tableBody.innerHTML =
            `<tr class="empty-row"><td colspan="9">Belum ada data</td></tr>`;
    }

});
