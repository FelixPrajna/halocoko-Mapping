document.addEventListener("DOMContentLoaded", () => {

/* ================= ELEMENT ================= */

const tbody = document.getElementById("routingTableBody");
const btnAdd = document.getElementById("btnAddRow");
const btnSave = document.getElementById("btnSaveRouting");

/* ================= MAKE EXISTING ROW EDITABLE ================= */

function makeEditable() {
    const rows = tbody.querySelectorAll("tr");

    rows.forEach(row => {
        const cells = row.querySelectorAll("td");

        cells.forEach((cell, index) => {
            if(index < 8){ // hanya kolom data
                cell.setAttribute("contenteditable", "true");
            }
        });

        // tambah tombol delete kalau belum ada
        if(!row.querySelector(".btnDelete")){
            const actionCell = document.createElement("td");
            actionCell.innerHTML = `<button class="btnDelete">❌</button>`;
            row.appendChild(actionCell);
        }
    });
}

/* ================= DELETE ================= */

tbody?.addEventListener("click", (e)=>{
if(e.target.classList.contains("btnDelete")){
    e.target.closest("tr").remove();
}
});

/* ================= ADD ROW ================= */

btnAdd?.addEventListener("click", ()=>{

tbody.insertAdjacentHTML("beforeend",`
<tr>
<td contenteditable="true">Motorist</td>
<td contenteditable="true">Stop</td>
<td contenteditable="true">Nama Toko</td>
<td contenteditable="true">Item</td>
<td contenteditable="true">0</td>
<td contenteditable="true">0</td>
<td contenteditable="true">0 menit</td>
<td contenteditable="true">0</td>
<td><button class="btnDelete">❌</button></td>
</tr>
`);

});

/* ================= SAVE ================= */

btnSave?.addEventListener("click", ()=>{

const rows = tbody.querySelectorAll("tr");
let data = [];

rows.forEach(row=>{
const cells = row.querySelectorAll("td");

if(cells.length < 8) return;

data.push({
motorist: cells[0].innerText.trim(),
urutan: cells[1].innerText.trim(),
toko: cells[2].innerText.trim(),
item: cells[3].innerText.trim(),
qty: cells[4].innerText.trim(),
jarak: cells[5].innerText.trim(),
waktu: cells[6].innerText.trim(),
bensin: cells[7].innerText.trim()
});
});

localStorage.setItem("routingData", JSON.stringify(data));

alert("✅ Routing berhasil disimpan!");
console.log(data);

});

/* ================= LOAD ================= */

function loadData(){

const saved = localStorage.getItem("routingData");
if(!saved) return;

const data = JSON.parse(saved);

tbody.innerHTML = "";

data.forEach(d=>{
tbody.insertAdjacentHTML("beforeend",`
<tr>
<td contenteditable="true">${d.motorist}</td>
<td contenteditable="true">${d.urutan}</td>
<td contenteditable="true">${d.toko}</td>
<td contenteditable="true">${d.item}</td>
<td contenteditable="true">${d.qty}</td>
<td contenteditable="true">${d.jarak}</td>
<td contenteditable="true">${d.waktu}</td>
<td contenteditable="true">${d.bensin}</td>
<td><button class="btnDelete">❌</button></td>
</tr>
`);
});

}

/* ================= INIT ================= */

makeEditable(); // untuk hasil generate awal
loadData();

});

function enableTableEdit() {
    const rows = document.querySelectorAll("#routingTableBody tr");

    rows.forEach(row => {
        const cells = row.querySelectorAll("td");

        cells.forEach((cell, index) => {
            // semua kolom kecuali kolom terakhir (aksi)
            if(index < 8){
                cell.setAttribute("contenteditable", "true");
            }
        });

        // tambahkan tombol delete kalau belum ada
        if(!row.querySelector(".btnDelete")){
            const actionCell = document.createElement("td");
            actionCell.innerHTML = `<button class="btnDelete">❌</button>`;
            row.appendChild(actionCell);
        }
    });
}