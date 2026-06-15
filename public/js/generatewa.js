function generateWAPerMotorist() {
    const table = document.getElementById("routingTableBody");

    if (!table || table.rows.length === 0) {
        alert("❌ Data routing kosong");
        return;
    }

    let motoristData = {};

    // LOOP TABLE
    for (let row of table.rows) {
        const cols = row.cells;

        const motorist = cols[0]?.innerText.trim();
        const urutan = cols[1]?.innerText.trim();
        const toko = cols[2]?.innerText.trim();
        const item = cols[3]?.innerText.trim();
        const qty = cols[4]?.innerText.trim();

        if (!motorist) continue;

        if (!motoristData[motorist]) {
            motoristData[motorist] = [];
        }

        motoristData[motorist].push(
            `${urutan}. ${toko} (${item} - ${qty})`
        );
    }

    // GENERATE MESSAGE PER MOTORIST
    for (let motorist in motoristData) {

        let message = `Halo ${motorist}, berikut rute kiriman kamu:\n\n`;

        message += motoristData[motorist].join("\n");

        message += `\n\nMohon dijalankan sesuai urutan ya 🙏`;

        // encode ke URL
        let encoded = encodeURIComponent(message);

        // buka whatsapp
        let url = `https://wa.me/?text=${encoded}`;

        window.open(url, "_blank");
    }
}