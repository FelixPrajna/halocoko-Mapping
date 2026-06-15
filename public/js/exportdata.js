// exportdata.js (FINAL VERSION)

// pastikan global
window.exportRoutingToExcel = function () {

    try {

        const tbody = document.getElementById("routingTableBody");

        if (!tbody) {
            alert("❌ Tabel routing tidak ditemukan");
            return;
        }

        const rows = tbody.querySelectorAll("tr");

        if (!rows.length) {
            alert("❌ Data routing kosong. Klik Generate Route dulu.");
            return;
        }

        let data = [];

        // ================= HEADER =================
        data.push(["SURAT JALAN MOTORIS"]);
        data.push(["Tanggal", new Date().toLocaleString()]);
        data.push([]);

        data.push([
            "No",
            "Motorist",
            "Nama Toko",
            "Produk",
            "Qty",
            "Jarak (km)",
            "Waktu",
            "Bensin (L)"
        ]);

        // ================= DATA =================
        let no = 1;

        rows.forEach((row) => {

            const cells = row.querySelectorAll("td");

            if (cells.length < 8) return;

            let motorist = "";

            const select = cells[0].querySelector("select");
            if (select) {
                motorist = select.value;
            } else {
                motorist = cells[0].innerText.trim();
            }

            data.push([
                no++,
                motorist || "-",
                cells[2]?.innerText.trim() || "-",
                cells[3]?.innerText.trim() || "-",
                cells[4]?.innerText.trim() || "0",
                cells[5]?.innerText.trim() || "0",
                cells[6]?.innerText.trim() || "-",
                cells[7]?.innerText.trim() || "0"
            ]);

        });

        // ================= BUAT SHEET =================
        const ws = XLSX.utils.aoa_to_sheet(data);

        // AUTO WIDTH
        ws["!cols"] = [
            { wch: 5 },
            { wch: 15 },
            { wch: 25 },
            { wch: 30 },
            { wch: 10 },
            { wch: 12 },
            { wch: 18 },
            { wch: 12 }
        ];

        // ================= STYLE HEADER =================
        const range = XLSX.utils.decode_range(ws["!ref"]);

        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cell = ws[XLSX.utils.encode_cell({ r: 3, c: C })];
            if (cell) {
                cell.s = {
                    font: { bold: true }
                };
            }
        }

        // ================= WORKBOOK =================
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Routing");

        // ================= DOWNLOAD =================
        XLSX.writeFile(wb, "surat_jalan_motoris.xlsx");

    } catch (error) {
        console.error("EXPORT ERROR:", error);
        alert("❌ Terjadi error saat export. Cek console.");
    }
};