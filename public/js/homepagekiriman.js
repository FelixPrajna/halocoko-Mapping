document.addEventListener("DOMContentLoaded", () => {

/* ================= GLOBAL ================= */

let currentRows = [];
let warehouse = null;
let warehouseMarker = null;

const markers = [];

/* ================= REQUIRED COLUMN ================= */

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

/* ================= MAP ================= */

const map = L.map("map").setView([-6.2,106.8],11);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
attribution:"© OpenStreetMap"
}).addTo(map);

/* ================= ICON ================= */

const warehouseIcon = new L.Icon({
iconUrl:"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
shadowUrl:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
iconSize:[25,41],
iconAnchor:[12,41]
});

const outletIcon = new L.Icon({
iconUrl:"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
shadowUrl:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
iconSize:[25,41],
iconAnchor:[12,41]
});

/* ================= WAREHOUSE ================= */

const btnAddWarehouse = document.getElementById("btnAddWarehouse");

btnAddWarehouse?.addEventListener("click",()=>{

const name=document.getElementById("warehouseName").value.trim();
const lat=parseFloat(document.getElementById("warehouseLat").value);
const lng=parseFloat(document.getElementById("warehouseLng").value);

if(!name||isNaN(lat)||isNaN(lng)){
alert("❌ Data gudang tidak valid");
return;
}

warehouse={name,lat,lng};

localStorage.setItem("warehouse",JSON.stringify(warehouse));

if(warehouseMarker) map.removeLayer(warehouseMarker);

warehouseMarker=L.marker([lat,lng],{icon:warehouseIcon})
.addTo(map)
.bindPopup(`<b>Gudang</b><br>${name}`)
.openPopup();

});

/* ================= LOAD WAREHOUSE ================= */

const savedWarehouse=localStorage.getItem("warehouse");

if(savedWarehouse){

warehouse=JSON.parse(savedWarehouse);

warehouseMarker=L.marker(
[warehouse.lat,warehouse.lng],
{icon:warehouseIcon}
).addTo(map)
.bindPopup(`<b>Gudang</b><br>${warehouse.name}`);

}

/* ================= FILE ================= */

const fileInput=document.getElementById("fileInput");
const btnChooseFile=document.getElementById("btnChooseFile");
const btnUpload=document.getElementById("btnUpload");
const fileNameText=document.getElementById("fileNameText");

btnChooseFile?.addEventListener("click",()=>fileInput.click());

fileInput?.addEventListener("change",()=>{

if(!fileInput.files.length) return;

fileNameText.textContent=fileInput.files[0].name;
btnUpload.disabled=false;

});

/* ================= UPLOAD ================= */

btnUpload?.addEventListener("click",()=>{

const file=fileInput.files[0];

if(!file) return;

const ext=file.name.split(".").pop().toLowerCase();

if(ext==="csv") readCSV(file);
else if(ext==="xlsx") readExcel(file);
else alert("❌ Format file tidak didukung");

});

/* ================= CSV ================= */

function readCSV(file){

const reader=new FileReader();

reader.onload=e=>{

const rows=csvToJson(e.target.result);

validateAndRender(rows);

};

reader.readAsText(file);

}

function csvToJson(text){

const lines=text.split(/\r?\n/).filter(l=>l.trim());
const headers=lines[0].split(",").map(h=>h.toLowerCase());

return lines.slice(1).map(line=>{

const obj={};

line.split(",").forEach((v,i)=>{
obj[headers[i]]=v;
});

return obj;

});

}

/* ================= EXCEL ================= */

function readExcel(file){

const reader=new FileReader();

reader.onload=e=>{

const wb=XLSX.read(e.target.result,{type:"array"});
const sheet=wb.Sheets[wb.SheetNames[0]];

const rows=XLSX.utils.sheet_to_json(sheet,{defval:""})
.map(r=>Object.fromEntries(
Object.entries(r).map(([k,v])=>[k.toLowerCase(),v])
));

validateAndRender(rows);

};

reader.readAsArrayBuffer(file);

}

/* ================= VALIDATE ================= */

function validateAndRender(rows){

if(!rows.length){
alert("❌ File kosong");
return;
}

const cols=Object.keys(rows[0]);

const missing=REQUIRED_COLUMNS.filter(c=>!cols.includes(c));

if(missing.length){

alert(
"❌ File tidak memiliki kolom berikut:\n\n"+
missing.join("\n")
);

return;

}

currentRows=rows;

renderTable(rows);

alert("✅ File berhasil diupload");

}

/* ================= TABLE ================= */

const tableBody=document.querySelector("#resultTable tbody");

function renderTable(rows){

markers.forEach(m=>map.removeLayer(m));
markers.length=0;

tableBody.innerHTML="";

rows.forEach((r,i)=>{

const lat=parseFloat(r["latitude"]);
const lng=parseFloat(r["longitude"]);

if(!isNaN(lat)&&!isNaN(lng)){

markers.push(
L.marker([lat,lng],{icon:outletIcon})
.addTo(map)
.bindPopup(r["nama toko"])
);

}

tableBody.innerHTML+=`
<tr>
<td>${i+1}</td>
<td>${r["kode toko"]}</td>
<td>${r["nama toko"]}</td>
<td>${r["invoice no"]}</td>
<td>${r["item produk"]}</td>
<td>${r["qty"]}</td>
<td>${r["value"]}</td>
<td>${r["latitude"]}</td>
<td>${r["longitude"]}</td>
</tr>
`;

});

}

/* ================= ROUTING ================= */

document.getElementById("btnGenerateRoute")
?.addEventListener("click",generateRoute);

function generateRoute(){

if(!warehouse){
alert("❌ Gudang belum diset");
return;
}

if(!currentRows.length){
alert("❌ Data toko belum ada");
return;
}

const motorInput=document.getElementById("motoristCount");
const motorCount=Math.max(1,parseInt(motorInput?.value||1));

const grouped=groupToko(currentRows);

const ordered=nearestNeighbour(
{lat:warehouse.lat,lng:warehouse.lng},
grouped
);

buatRouting(ordered,motorCount);

}

/* ================= GROUP TOKO ================= */

function groupToko(rows){

const map={};

rows.forEach(r=>{

const nama=r["nama toko"];

if(!map[nama]){

map[nama]={
nama,
lat:parseFloat(r["latitude"]),
lng:parseFloat(r["longitude"]),
items:[],
qty:0
};

}

map[nama].items.push(r["item produk"]);
map[nama].qty+=parseFloat(r["qty"])||0;

});

return Object.values(map);

}

/* ================= ROUTING ================= */

function buatRouting(outlets,motorCount){

const tbody=document.getElementById("routingTableBody");
const summary=document.getElementById("routingSummary");

tbody.innerHTML="";
summary.innerHTML="";

const speed=30;
const fuelRate=0.04;

let totalDist=0;
let totalTime=0;
let totalFuel=0;

const groups=Array.from({length:motorCount},()=>[]);

outlets.forEach((o,i)=>{
groups[i%motorCount].push(o);
});

groups.forEach((group,index)=>{

let current={lat:warehouse.lat,lng:warehouse.lng};

let distSum=0;
let timeSum=0;
let fuelSum=0;

group.forEach((o,urutan)=>{

const dist=getDistance(current.lat,current.lng,o.lat,o.lng);
const time=(dist/speed)*60;
const fuel=dist*fuelRate;

tbody.insertAdjacentHTML("beforeend",`
<tr>
<td>Motorist ${index+1}</td>
<td>${urutan+1}</td>
<td>${o.nama}</td>
<td>${o.items.join(", ")}</td>
<td>${o.qty}</td>
<td>${dist.toFixed(2)}</td>
<td>${formatTime(time)}</td>
<td>${fuel.toFixed(2)}</td>
</tr>
`);

distSum+=dist;
timeSum+=time;
fuelSum+=fuel;

current=o;

});

summary.innerHTML+=`
<hr>
<b>Motorist ${index+1}</b><br>
Jarak ${distSum.toFixed(2)} km<br>
Waktu ${formatTime(timeSum)}<br>
Bensin ${fuelSum.toFixed(2)} L
`;

totalDist+=distSum;
totalTime+=timeSum;
totalFuel+=fuelSum;

});

summary.innerHTML+=`
<hr>
<b>TOTAL SEMUA MOTORIST</b><br>
Jarak ${totalDist.toFixed(2)} km<br>
Waktu ${formatTime(totalTime)}<br>
Bensin ${totalFuel.toFixed(2)} L
`;

document.getElementById("routingResultWrapper").style.display="block";

}

/* ================= DISTANCE ================= */

function getDistance(lat1,lng1,lat2,lng2){

const R=6371;

const dLat=(lat2-lat1)*Math.PI/180;
const dLng=(lng2-lng1)*Math.PI/180;

const a=
Math.sin(dLat/2)**2+
Math.cos(lat1*Math.PI/180)*
Math.cos(lat2*Math.PI/180)*
Math.sin(dLng/2)**2;

return R*(2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a)));

}

/* ================= NEAREST ================= */

function nearestNeighbour(start,outlets){

const visited=[];
let current=start;
let remaining=[...outlets];

while(remaining.length){

let shortest=Infinity;
let index=0;

remaining.forEach((o,i)=>{

const d=getDistance(current.lat,current.lng,o.lat,o.lng);

if(d<shortest){
shortest=d;
index=i;
}

});

const next=remaining.splice(index,1)[0];

visited.push(next);

current=next;

}

return visited;

}

/* ================= TIME FORMAT ================= */

function formatTime(total){

const jam=Math.floor(total/60);
const menit=Math.round(total%60);

return jam>0
?`${jam} jam ${menit} menit`
:`${menit} menit`;

}

});

function formatProdukDetail(items){
    let map = {}

    items.forEach(p=>{
        if(!map[p.nama]){
            map[p.nama] = 0
        }
        map[p.nama] += Number(p.qty)
    })

    let teks = []
    let total = 0

    for(let nama in map){
        teks.push(`${nama} (${map[nama]})`)
        total += map[nama]
    }

    return {
        text: teks.join("<br>"),
        qty: total
    }
}