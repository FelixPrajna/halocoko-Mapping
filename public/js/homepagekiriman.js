document.addEventListener("DOMContentLoaded", () => {

/* ================= GLOBAL ================= */

let currentRows = [];
let warehouse = null;
let warehouseMarker = null;
const uploadMarkers = [];
const routeMarkers = [];
const routePolylines = [];
let routingActive = false;

/* ================= WAKTU TAMBAHAN ================= */

const serviceTimePerOutlet = 15; // menit bongkar
const breakTimePerMotor = 60; // menit istirahat

/* ================= REQUIRED COLUMN ================= */

const REQUIRED_COLUMNS = [
"kode toko","nama toko","invoice no","item produk","qty","value","latitude","longitude"
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

const motoristColorNames=["blue","green","orange","violet","yellow","grey","gold","black"];
const motoristColorHex={
blue:"#2A81CB",
green:"#2CAD00",
orange:"#CB8427",
violet:"#9C27B0",
yellow:"#FFD326",
grey:"#777777",
gold:"#FFD700",
black:"#000000"
};

function createMotoristIcon(colorName){
return new L.Icon({
iconUrl:`https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${colorName}.png`,
shadowUrl:"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
iconSize:[25,41],
iconAnchor:[12,41]
});
}

function clearRouteLayers(){
routeMarkers.forEach(m=>map.removeLayer(m));
routeMarkers.length=0;
routePolylines.forEach(p=>map.removeLayer(p));
routePolylines.length=0;
}

function clearUploadMarkers(){
uploadMarkers.forEach(m=>map.removeLayer(m));
uploadMarkers.length=0;
}

function syncMapFromRoutingTable(){
const tbody=document.getElementById("routingTableBody");
if(!tbody||!warehouse) return;

clearRouteLayers();
clearUploadMarkers();

const outletMap={};
groupToko(currentRows).forEach(o=>{
outletMap[o.nama.toLowerCase()]=o;
});

const motorGroups={};

tbody.querySelectorAll("tr").forEach(row=>{
const cells=row.querySelectorAll("td");
if(cells.length<8) return;

const motorSelect=cells[0].querySelector("select");
const motorist=motorSelect?motorSelect.value:cells[0].innerText.trim();
const namaToko=cells[2].innerText.trim();

if(!motorGroups[motorist]) motorGroups[motorist]=[];
motorGroups[motorist].push(namaToko);
});

const addedOutlets=new Set();

Object.entries(motorGroups).forEach(([motorist,stops],idx)=>{
const colorName=motoristColorNames[idx%motoristColorNames.length];
const icon=createMotoristIcon(colorName);
const latlngs=[[warehouse.lat,warehouse.lng]];

stops.forEach(namaToko=>{
const outlet=outletMap[namaToko.toLowerCase()];
if(!outlet||isNaN(outlet.lat)||isNaN(outlet.lng)) return;

latlngs.push([outlet.lat,outlet.lng]);

const key=namaToko.toLowerCase();
if(!addedOutlets.has(key)){
addedOutlets.add(key);
routeMarkers.push(
L.marker([outlet.lat,outlet.lng],{icon})
.addTo(map)
.bindPopup(`<b>${outlet.nama}</b><br>${motorist}`)
);
}
});

latlngs.push([warehouse.lat,warehouse.lng]);

if(latlngs.length>2){
routePolylines.push(
L.polyline(latlngs,{
color:motoristColorHex[colorName]||"#2A81CB",
weight:3,
opacity:0.75
}).addTo(map)
);
}
});
}

/* ================= WAREHOUSE ================= */

document.getElementById("btnAddWarehouse")?.addEventListener("click",()=>{

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

warehouseMarker=L.marker([warehouse.lat,warehouse.lng],{icon:warehouseIcon})
.addTo(map)
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
line.split(",").forEach((v,i)=> obj[headers[i]]=v);
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
.map(r=>Object.fromEntries(Object.entries(r).map(([k,v])=>[k.toLowerCase(),v])));
validateAndRender(rows);
};
reader.readAsArrayBuffer(file);
}

/* ================= VALIDATE ================= */

function validateAndRender(rows){
if(!rows.length){ alert("❌ File kosong"); return; }

const cols=Object.keys(rows[0]);
const missing=REQUIRED_COLUMNS.filter(c=>!cols.includes(c));

if(missing.length){
alert("❌ Kolom kurang:\n"+missing.join("\n"));
return;
}

currentRows=rows;
renderTable(rows);
alert("✅ File berhasil diupload");
}

/* ================= TABLE ================= */

const tableBody=document.querySelector("#resultTable tbody");

function renderTable(rows){
routingActive=false;
clearRouteLayers();
clearUploadMarkers();
tableBody.innerHTML="";

rows.forEach((r,i)=>{

const lat=parseFloat(r["latitude"]);
const lng=parseFloat(r["longitude"]);

if(!isNaN(lat)&&!isNaN(lng)){
uploadMarkers.push(
L.marker([lat,lng],{icon:outletIcon})
.addTo(map)
.bindPopup(r["nama toko"])
);
}

/* ROW UTAMA */
const rowId = `row-${i}`;

tableBody.innerHTML += `
<tr class="main-row" data-target="${rowId}" style="cursor:pointer;">
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

/* DROPDOWN ROW */
<tr id="${rowId}" class="dropdown-row" style="display:none; background:#f9f9f9;">
<td colspan="9">
<b>Detail Pengiriman:</b><br>
Produk : ${r["item produk"]}<br>
Qty : ${r["qty"]}<br>
Value : ${r["value"]}<br>
Invoice : ${r["invoice no"]}
</td>
</tr>
`;
});

/* ================= DROPDOWN HASIL UPLOAD (HEADER) ================= */

const resultToggle = document.getElementById("resultToggle");
const resultContent = document.getElementById("resultContent");
const resultArrow = document.getElementById("resultArrow");

let isOpen = true;

resultToggle?.addEventListener("click", () => {

if(isOpen){
  resultContent.style.display = "none";
  resultArrow.style.transform = "rotate(180deg)";
}else{
  resultContent.style.display = "block";
  resultArrow.style.transform = "rotate(0deg)";
}

isOpen = !isOpen;

});

/* ================= EVENT DROPDOWN ================= */

document.querySelectorAll(".main-row").forEach(row=>{
row.addEventListener("click",()=>{

const targetId = row.getAttribute("data-target");
const dropdown = document.getElementById(targetId);

/* toggle */
if(dropdown.style.display === "none"){
dropdown.style.display = "table-row";
}else{
dropdown.style.display = "none";
}

});
});

}


/* ================= ROUTING ================= */

document.getElementById("btnGenerateRoute")
?.addEventListener("click",generateRoute);

function generateRoute(){
if(!warehouse){ alert("❌ Gudang belum diset"); return; }
if(!currentRows.length){ alert("❌ Data kosong"); return; }

const motorCount=Math.max(1,parseInt(document.getElementById("motoristCount").value||1));

const grouped=groupToko(currentRows);
const ordered=nearestNeighbour({lat:warehouse.lat,lng:warehouse.lng},grouped);

buatRouting(ordered,motorCount);
}

/* ================= GROUP TOKO ================= */

function groupToko(rows){
const map={};

rows.forEach(r=>{
const nama=r["nama toko"];

if(!map[nama]){
map[nama]={nama,lat:parseFloat(r["latitude"]),lng:parseFloat(r["longitude"]),items:[],qty:0};
}

map[nama].items.push(r["item produk"]);
map[nama].qty+=parseFloat(r["qty"])||0;
});

return Object.values(map);
}

function generateMotoristOptions(selected){
const count=parseInt(document.getElementById("motoristCount").value||1);
let options="";

for(let i=1;i<=count;i++){
options+=`
<option value="Motorist ${i}" ${i===selected?"selected":""}>
Motorist ${i}
</option>
`;
}

return options;
}

function recalculateRoutingFromTable(){
const tbody=document.getElementById("routingTableBody");
const summary=document.getElementById("routingSummary");

if(!tbody||!summary||!warehouse) return;

const outletMap={};
groupToko(currentRows).forEach(o=>{
outletMap[o.nama.toLowerCase()]=o;
});

const speed=30;
const fuelRate=0.04;
const motorCount=Math.max(1,parseInt(document.getElementById("motoristCount").value||1));

const motorGroups={};

tbody.querySelectorAll("tr").forEach(row=>{
const cells=row.querySelectorAll("td");
if(cells.length<8) return;

const motorSelect=cells[0].querySelector("select");
const motorist=motorSelect?motorSelect.value:cells[0].innerText.trim();
const namaToko=cells[2].innerText.trim();

if(!motorGroups[motorist]) motorGroups[motorist]=[];
motorGroups[motorist].push({cells,namaToko});
});

let totalDist=0;
let totalTime=0;
let totalFuel=0;

summary.innerHTML="";

Object.entries(motorGroups).forEach(([motorist,stops])=>{
let current={lat:warehouse.lat,lng:warehouse.lng};
let motorDist=0;
let motorTime=0;
let motorFuel=0;

stops.forEach(({cells,namaToko})=>{
const outlet=outletMap[namaToko.toLowerCase()];
let dist=0;
let time=0;
let fuel=0;

if(outlet){
dist=getDistance(current.lat,current.lng,outlet.lat,outlet.lng);
const travelTime=(dist/speed)*60;
time=travelTime+serviceTimePerOutlet;
fuel=dist*fuelRate;
current=outlet;
}

cells[5].innerText=dist.toFixed(2);
cells[6].innerText=formatTime(time);
cells[7].innerText=fuel.toFixed(2);

motorDist+=dist;
motorTime+=time;
motorFuel+=fuel;
});

const backDist=getDistance(current.lat,current.lng,warehouse.lat,warehouse.lng);
const backTime=(backDist/speed)*60;
const backFuel=backDist*fuelRate;

motorDist+=backDist;
motorTime+=backTime+breakTimePerMotor;
motorFuel+=backFuel;

summary.innerHTML+=`
<hr>
<b>${motorist}</b><br>
Jarak ${motorDist.toFixed(2)} km<br>
Waktu ${formatTime(motorTime)}<br>
Istirahat ${breakTimePerMotor} menit<br>
Bensin ${motorFuel.toFixed(2)} L
`;

totalDist+=motorDist;
totalTime+=motorTime;
totalFuel+=motorFuel;
});

const averageTime=motorCount>0?totalTime/motorCount:0;

summary.innerHTML+=`
<hr>
<b>TOTAL</b><br>
Jarak ${totalDist.toFixed(2)} km<br>
Waktu ${formatTime(totalTime)}<br>
Bensin ${totalFuel.toFixed(2)} L
<hr>
<b style="color:green;">AVERAGE PER MOTORIST</b><br>
Waktu Rata-rata ${formatTime(averageTime)}
`;

syncMapFromRoutingTable();
}

window.recalculateRoutingFromTable=recalculateRoutingFromTable;
window.generateMotoristOptions=generateMotoristOptions;

/* ================= ROUTING ================= */

function buatRouting(outlets, motorCount){

const tbody=document.getElementById("routingTableBody");
const summary=document.getElementById("routingSummary");

tbody.innerHTML="";
summary.innerHTML="";

const speed=30;
const fuelRate=0.04;

let totalDist=0;
let totalTime=0;
let totalFuel=0;

/* batching */
let batches=[];
let currentBatch=[];
let currentQty=0;

outlets.forEach(o=>{
if(currentBatch.length<2&&(currentQty+o.qty)<=25){
currentBatch.push(o);
currentQty+=o.qty;
}else{
batches.push(currentBatch);
currentBatch=[o];
currentQty=o.qty;
}
});
if(currentBatch.length) batches.push(currentBatch);

/* bagi motor */
const motorGroups=Array.from({length:motorCount},()=>[]);
batches.forEach((b,i)=>motorGroups[i%motorCount].push(b));

/* routing */
motorGroups.forEach((motorBatches,motorIndex)=>{

let motorDist=0;
let motorTime=0;
let motorFuel=0;

motorBatches.forEach((batch,batchIndex)=>{

let current={lat:warehouse.lat,lng:warehouse.lng};

batch.forEach((o,i)=>{

const dist=getDistance(current.lat,current.lng,o.lat,o.lng);
const travelTime=(dist/speed)*60;
const time=travelTime+serviceTimePerOutlet;
const fuel=dist*fuelRate;

tbody.insertAdjacentHTML("beforeend",`
<tr>
<td>
    <select class="motorist-select">
        ${generateMotoristOptions(motorIndex+1)}
    </select>
</td>
<td contenteditable="true">Batch ${batchIndex+1} - Stop ${i+1}</td>
<td contenteditable="true">${o.nama}</td>
<td contenteditable="true">${o.items.join(", ")}</td>
<td contenteditable="true">${o.qty}</td>
<td contenteditable="true">${dist.toFixed(2)}</td>
<td contenteditable="true">${formatTime(time)}</td>
<td contenteditable="true">${fuel.toFixed(2)}</td>
<td><button class="btnDelete">❌</button></td>
</tr>
`);

motorDist+=dist;
motorTime+=time;
motorFuel+=fuel;

current=o;

});

/* balik gudang */
const backDist=getDistance(current.lat,current.lng,warehouse.lat,warehouse.lng);
const backTime=(backDist/speed)*60;
const backFuel=backDist*fuelRate;

motorDist+=backDist;
motorTime+=backTime;
motorFuel+=backFuel;

});

/* ISTIRAHAT */
motorTime+=breakTimePerMotor;

/* summary per motor */
summary.innerHTML+=`
<hr>
<b>Motorist ${motorIndex+1}</b><br>
Jarak ${motorDist.toFixed(2)} km<br>
Waktu ${formatTime(motorTime)}<br>
Istirahat ${breakTimePerMotor} menit<br>
Bensin ${motorFuel.toFixed(2)} L
`;

totalDist+=motorDist;
totalTime+=motorTime;
totalFuel+=motorFuel;

});

/* ================= TOTAL ================= */

const averageTime = totalTime / motorCount;

summary.innerHTML+=`
<hr>
<b>TOTAL</b><br>
Jarak ${totalDist.toFixed(2)} km<br>
Waktu ${formatTime(totalTime)}<br>
Bensin ${totalFuel.toFixed(2)} L
<hr>
<b style="color:green;">AVERAGE PER MOTORIST</b><br>
Waktu Rata-rata ${formatTime(averageTime)}
`;

document.getElementById("routingResultWrapper").style.display="block";

routingActive=true;
syncMapFromRoutingTable();
}
/* ================= DISTANCE ================= */

function getDistance(lat1,lng1,lat2,lng2){
const R=6371;
const dLat=(lat2-lat1)*Math.PI/180;
const dLng=(lng2-lng1)*Math.PI/180;

const a=Math.sin(dLat/2)**2+
Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*
Math.sin(dLng/2)**2;

return R*(2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a)));
}

/* ================= NEAREST ================= */

function nearestNeighbour(start,outlets){
let visited=[];
let current=start;
let remaining=[...outlets];

while(remaining.length){
let shortest=Infinity;
let index=0;

remaining.forEach((o,i)=>{
const d=getDistance(current.lat,current.lng,o.lat,o.lng);
if(d<shortest){shortest=d;index=i;}
});

const next=remaining.splice(index,1)[0];
visited.push(next);
current=next;
}

return visited;
}

/* ================= FORMAT ================= */

function formatTime(total){
const jam=Math.floor(total/60);
const menit=Math.round(total%60);
return jam>0?`${jam} jam ${menit} menit`:`${menit} menit`;
}


});



