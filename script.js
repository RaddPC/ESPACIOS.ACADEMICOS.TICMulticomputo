/* ================================================================
   DATOS — EDITA AQUÍ TU INFORMACIÓN REAL
   ================================================================
   Estructura:
   {
     id:        "B1-101"          -> código único del aula (visible)
     nombre:    "Aula de Física"  -> nombre o uso del aula
     edificio:  "Bloque 1"        -> nombre del edificio
     piso:      "Piso 1"          -> nombre del piso (se agrupan por este texto)
     tipo:      "Aula"            -> Aula | Laboratorio | Auditorio | Sala de cómputo
     capacidad: 40                -> número de puestos
     estado:    "abierta"         -> "abierta" o "cerrada" (valor por defecto/inicial)
     horario: [                   -> opcional, se muestra en el panel de detalle
       { hora: "07:00 - 09:00", clase: "Cálculo I", docente: "J. Pérez" },
       { hora: "09:00 - 11:00", clase: "Física I",  docente: "M. Gómez" }
     ]
   }
   Puedes agregar tantos edificios, pisos y aulas como necesites.
   El mapa se construye automáticamente a partir de este arreglo.
================================================================= */

const SITE_TITLE = "Multicomputo / Multitech";
const LAST_UPDATED = "17 ago 2026, 7:35 p.m.";

/* ----------------------------------------------------------------
   Pisos en custodia por edificio (informativo, se muestra en el
   encabezado de cada bloque en el mapa). Edítalo si cambia.
---------------------------------------------------------------- */
const CUSTODIA = {
  "Bloque 1 — Guane":       "Custodia: piso 2 al 4",
  "Bloque 3 — Arhuaco":     "Custodia: piso 3 al 4",
  "Bloque 4 — Chibcha":     "Custodia: piso 3 al 6",
  "Bloque B — Yariguíes":   "Custodia: piso 1 al 5",
  "Bloque G — Yariguíes":   "Custodia: piso 2"
};

/* ----------------------------------------------------------------
   Generador de aulas numeradas consecutivas.
   Úsalo cuando un piso tiene un rango de códigos tipo 301-306.
   Cambia SOLO "inicio" y "fin" si el rango cambia.
---------------------------------------------------------------- */
function generarAulas({ edificio, piso, prefijo, inicio, fin, nombreBase, tipo, capacidad, estado }){
  const arr = [];
  for (let n = inicio; n <= fin; n++){
    arr.push({
      id: `${prefijo}-${n}`,
      nombre: `${nombreBase} ${n}`,
      edificio, piso, tipo, capacidad, estado,
      horario: []
    });
  }
  return arr;
}

const DATA = [].concat(

  /* ============ BLOQUE 1 — Edificio Guane ============ */
  generarAulas({ edificio:"Bloque 1 — Guane", piso:"Piso 2", prefijo:"GUA",
    inicio:201, fin:204, nombreBase:"Aula", tipo:"Aula", capacidad:70, estado:"cerrada" }),
  generarAulas({ edificio:"Bloque 1 — Guane", piso:"Piso 3", prefijo:"GUA",
    inicio:301, fin:306, nombreBase:"Aula", tipo:"Aula", capacidad:35, estado:"cerrada" }),
  generarAulas({ edificio:"Bloque 1 — Guane", piso:"Piso 4", prefijo:"GUA",
    inicio:401, fin:408, nombreBase:"Aula", tipo:"Aula", capacidad:35, estado:"cerrada" }),

  /* ============ BLOQUE 3 — Edificio Arhuaco ============ */
  generarAulas({ edificio:"Bloque 3 — Arhuaco", piso:"Piso 3", prefijo:"ARH-AV",
    inicio:1, fin:9, nombreBase:"Audiovisual", tipo:"Sala audiovisual", capacidad:24, estado:"cerrada" }),
  [
    { id:"ARH-AUD-MAYOR", nombre:"Auditorio Mayor", edificio:"Bloque 3 — Arhuaco", piso:"Piso 4",
      tipo:"Auditorio", capacidad:160, estado:"cerrada", horario:[] },
    { id:"ARH-AUD-MENOR", nombre:"Auditorio Menor", edificio:"Bloque 3 — Arhuaco", piso:"Piso 4",
      tipo:"Auditorio", capacidad:100, estado:"cerrada", horario:[] },
    { id:"ARH-SALA-CONSEJO", nombre:"Sala de Consejo", edificio:"Bloque 3 — Arhuaco", piso:"Piso 4",
      tipo:"Sala", capacidad:20, estado:"cerrada", horario:[] }
  ],

  /* ============ BLOQUE 4 — Edificio Chibcha ============ */
  generarAulas({ edificio:"Bloque 4 — Chibcha", piso:"Piso 3", prefijo:"CHI",
    inicio:301, fin:309, nombreBase:"Aula", tipo:"Aula", capacidad:35, estado:"cerrada" }),
  generarAulas({ edificio:"Bloque 4 — Chibcha", piso:"Piso 4", prefijo:"CHI",
    inicio:401, fin:410, nombreBase:"Aula", tipo:"Aula", capacidad:35, estado:"cerrada" }),
  generarAulas({ edificio:"Bloque 4 — Chibcha", piso:"Piso 5", prefijo:"CHI",
    inicio:501, fin:509, nombreBase:"Aula", tipo:"Aula", capacidad:35, estado:"cerrada" }),
  generarAulas({ edificio:"Bloque 4 — Chibcha", piso:"Piso 6", prefijo:"CHI",
    inicio:601, fin:610, nombreBase:"Aula", tipo:"Aula", capacidad:35, estado:"cerrada" }),

  /* ============ BLOQUE B — Edificio Yariguíes ============ */
  generarAulas({ edificio:"Bloque B — Yariguíes", piso:"Piso 1", prefijo:"YARB",
    inicio:101, fin:101, nombreBase:"Aula", tipo:"Aula", capacidad:35, estado:"cerrada" }),
  generarAulas({ edificio:"Bloque B — Yariguíes", piso:"Piso 2", prefijo:"YARB",
    inicio:201, fin:203, nombreBase:"Aula", tipo:"Aula", capacidad:35, estado:"cerrada" }),
  generarAulas({ edificio:"Bloque B — Yariguíes", piso:"Piso 3", prefijo:"YARB",
    inicio:301, fin:303, nombreBase:"Aula", tipo:"Aula", capacidad:35, estado:"cerrada" }),
  generarAulas({ edificio:"Bloque B — Yariguíes", piso:"Piso 4", prefijo:"YARB",
    inicio:401, fin:403, nombreBase:"Aula", tipo:"Aula", capacidad:35, estado:"cerrada" }),
  generarAulas({ edificio:"Bloque B — Yariguíes", piso:"Piso 5", prefijo:"YARB",
    inicio:501, fin:503, nombreBase:"Aula", tipo:"Aula", capacidad:35, estado:"cerrada" }),

  /* ============ BLOQUE G — Edificio Yariguíes ============ */
  [
    { id:"YARG-AUDITORIO", nombre:"Auditorio Yariguíes", edificio:"Bloque G — Yariguíes", piso:"Piso 2",
      tipo:"Auditorio", capacidad:100, estado:"cerrada", horario:[] }
  ]

);

/* ================================================================
   LÓGICA DE LA APLICACIÓN — normalmente no necesitas editar debajo
================================================================= */

/* ----------------------------------------------------------------
   CONFIGURACIÓN DEL REPORTE — edita esto con los datos reales
---------------------------------------------------------------- */
const REPORTE_CONFIG = {
  correoJefe: "logistica@udes.edu.co",           // destinatario del correo
  telefonoWhatsapp: "573156422898",        // con código de país, sin "+", sin espacios
  nombreResponsable: "Juan Tobon - Julian Torres"           // aparece al final del reporte
};

const STORAGE_KEY = "aulas_estado_v1";

function loadOverrides(){
  try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch(e){ return {}; }
}
function saveOverride(id, estado){
  const ov = loadOverrides();
  ov[id] = estado;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ov));
}

function getRooms(){
  const ov = loadOverrides();
  return DATA.map(r => ({ ...r, estado: ov[r.id] || r.estado }));
}

let filters = { edificio: "", piso: "", estado: "", texto: "" };

function uniqueInOrder(arr){
  return [...new Set(arr)];
}

function populateFilterOptions(rooms){
  const bSel = document.getElementById("fBuilding");
  const fSel = document.getElementById("fFloor");

  const buildings = uniqueInOrder(DATA.map(r => r.edificio));
  bSel.innerHTML = '<option value="">Todos</option>' +
    buildings.map(b => `<option value="${escapeAttr(b)}">${escapeHtml(b)}</option>`).join("");

  const floorsSource = filters.edificio
    ? DATA.filter(r => r.edificio === filters.edificio)
    : DATA;
  const floors = uniqueInOrder(floorsSource.map(r => r.piso));
  fSel.innerHTML = '<option value="">Todos</option>' +
    floors.map(f => `<option value="${escapeAttr(f)}">${escapeHtml(f)}</option>`).join("");

  bSel.value = filters.edificio;
  fSel.value = filters.piso;
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
}
function escapeAttr(s){ return escapeHtml(s); }

function renderStats(rooms){
  const total = rooms.length;
  const open = rooms.filter(r => r.estado === "abierta").length;
  const closed = total - open;
  const pct = total ? Math.round((open/total)*100) : 0;

  document.getElementById("statTotal").textContent = total;
  document.getElementById("statOpen").textContent = open;
  document.getElementById("statClosed").textContent = closed;
  document.getElementById("statPct").textContent = pct + "%";
}

function applyFilters(rooms){
  return rooms.filter(r => {
    if (filters.edificio && r.edificio !== filters.edificio) return false;
    if (filters.piso && r.piso !== filters.piso) return false;
    if (filters.estado && r.estado !== filters.estado) return false;
    if (filters.texto){
      const t = filters.texto.toLowerCase();
      if (!r.id.toLowerCase().includes(t) && !r.nombre.toLowerCase().includes(t)) return false;
    }
    return true;
  });
}

function groupBy(rooms, keyFn){
  const map = new Map();
  rooms.forEach(r => {
    const k = keyFn(r);
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(r);
  });
  return map;
}

function renderMap(){
  const all = getRooms();
  renderStats(all);
  populateFilterOptions(all);

  const filtered = applyFilters(all);
  const mapEl = document.getElementById("map");
  mapEl.innerHTML = "";

  if (filtered.length === 0){
    mapEl.innerHTML = '<div class="empty-msg">No hay aulas que coincidan con estos filtros.</div>';
    return;
  }

  // Mantener el orden de aparición de edificios/pisos según DATA
  const buildingOrder = uniqueInOrder(DATA.map(r => r.edificio));
  const byBuilding = groupBy(filtered, r => r.edificio);

  buildingOrder.forEach(bName => {
    const roomsInBuilding = byBuilding.get(bName);
    if (!roomsInBuilding) return;

    const bTotal = roomsInBuilding.length;
    const bOpen = roomsInBuilding.filter(r => r.estado === "abierta").length;

    const custodia = CUSTODIA[bName] || "";

    const bDiv = document.createElement("div");
    bDiv.className = "building";
    bDiv.innerHTML = `
      <div class="building-head">
        <span class="tag">${escapeHtml(bName.split("—")[0].trim())}</span>
        <h2>${escapeHtml(bName)}</h2>
        <span class="sub">${custodia ? escapeHtml(custodia) + " · " : ""}${bOpen}/${bTotal} abiertas</span>
      </div>
    `;

    const floorOrder = uniqueInOrder(DATA.filter(r => r.edificio === bName).map(r => r.piso));
    const byFloor = groupBy(roomsInBuilding, r => r.piso);

    floorOrder.forEach(fName => {
      const roomsInFloor = byFloor.get(fName);
      if (!roomsInFloor) return;

      const floorDiv = document.createElement("div");
      floorDiv.className = "floor";
      floorDiv.innerHTML = `<div class="floor-label">${escapeHtml(fName)}</div>`;

      const grid = document.createElement("div");
      grid.className = "room-grid";

      roomsInFloor.forEach(r => {
        const btn = document.createElement("button");
        btn.className = `room is-${r.estado === "abierta" ? "open" : "closed"}`;
        btn.setAttribute("data-id", r.id);
        btn.innerHTML = `
          <span class="state-bar"></span>
          <span class="pip"></span>
          <span class="code">${escapeHtml(r.id)}</span>
          <span class="name">${escapeHtml(r.nombre)}</span>
          <span class="meta">${escapeHtml(r.tipo)} · ${r.capacidad} pers.</span>
        `;
        btn.addEventListener("click", () => openPanel(r.id));
        grid.appendChild(btn);
      });

      floorDiv.appendChild(grid);
      bDiv.appendChild(floorDiv);
    });

    mapEl.appendChild(bDiv);
  });
}

/* ---------- Panel de detalle ---------- */
const overlay = document.getElementById("overlay");
const panel = document.getElementById("panel");
let currentRoomId = null;

function openPanel(id){
  const room = getRooms().find(r => r.id === id);
  if (!room) return;
  currentRoomId = id;

  document.getElementById("pCode").textContent = room.id;
  document.getElementById("pName").textContent = room.nombre;
  document.getElementById("pBuilding").textContent = room.edificio;
  document.getElementById("pFloor").textContent = room.piso;
  document.getElementById("pType").textContent = room.tipo;
  document.getElementById("pCapacity").textContent = room.capacidad + " personas";

  const badge = document.getElementById("pBadge");
  const isOpen = room.estado === "abierta";
  badge.textContent = isOpen ? "Abierta / encendida" : "Cerrada / apagada";
  badge.className = "badge " + (isOpen ? "open" : "closed");

  const schedWrap = document.getElementById("pScheduleWrap");
  const schedEl = document.getElementById("pSchedule");
  if (room.horario && room.horario.length){
    schedWrap.style.display = "block";
    schedEl.innerHTML = room.horario.map(h => `
      <div class="schedule-item"><b>${escapeHtml(h.hora)}</b> — ${escapeHtml(h.clase)} (${escapeHtml(h.docente)})</div>
    `).join("");
  } else {
    schedWrap.style.display = "none";
  }

  const toggleBtn = document.getElementById("pToggle");
  toggleBtn.textContent = isOpen ? "Marcar como cerrada" : "Marcar como abierta";
  toggleBtn.className = "toggle-btn " + (isOpen ? "to-close" : "to-open");

  overlay.classList.add("show");
  panel.classList.add("show");
  panel.setAttribute("aria-hidden", "false");
}

function closePanel(){
  overlay.classList.remove("show");
  panel.classList.remove("show");
  panel.setAttribute("aria-hidden", "true");
  currentRoomId = null;
}

document.getElementById("panelClose").addEventListener("click", closePanel);
overlay.addEventListener("click", closePanel);
document.addEventListener("keydown", e => { if (e.key === "Escape") closePanel(); });

document.getElementById("pToggle").addEventListener("click", () => {
  if (!currentRoomId) return;
  const current = getRooms().find(r => r.id === currentRoomId);
  const next = current.estado === "abierta" ? "cerrada" : "abierta";
  saveOverride(currentRoomId, next);
  renderMap();
  openPanel(currentRoomId);
});

/* ---------- Controles de filtro ---------- */
document.getElementById("fBuilding").addEventListener("change", e => {
  filters.edificio = e.target.value;
  filters.piso = ""; // reset piso al cambiar de edificio
  renderMap();
});
document.getElementById("fFloor").addEventListener("change", e => {
  filters.piso = e.target.value;
  renderMap();
});
document.getElementById("fSearch").addEventListener("input", e => {
  filters.texto = e.target.value;
  renderMap();
});
document.querySelectorAll(".status-toggle button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".status-toggle button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filters.estado = btn.getAttribute("data-status");
    renderMap();
  });
});

/* ---------- Generación del reporte ---------- */
function fechaHoraActual(){
  const d = new Date();
  return d.toLocaleString("es-CO", { dateStyle: "long", timeStyle: "short" });
}

function construirTextoReporte(){
  const rooms = getRooms();
  const total = rooms.length;
  const abiertas = rooms.filter(r => r.estado === "abierta").length;
  const cerradas = total - abiertas;

  let out = "";
  out += "REPORTE DE ESPACIOS ACADEMICOS\n";
  out += SITE_TITLE + "\n";
  out += "Generado: " + fechaHoraActual() + "\n";
  out += "----------------------------------------\n\n";
  out += "RESUMEN GENERAL\n";
  out += `Total de espacios:  ${total}\n`;
  out += `Abiertos:           ${abiertas}\n`;
  out += `Cerrados:           ${cerradas}\n\n`;

  const buildingOrder = uniqueInOrder(DATA.map(r => r.edificio));

  buildingOrder.forEach(bName => {
    const roomsInBuilding = rooms.filter(r => r.edificio === bName);
    if (!roomsInBuilding.length) return;

    const bAbiertas = roomsInBuilding.filter(r => r.estado === "abierta").length;
    const bCerradas = roomsInBuilding.length - bAbiertas;

    out += bName.toUpperCase() + "\n";
    if (CUSTODIA[bName]) out += "(" + CUSTODIA[bName] + ")\n";

    const floorOrder = uniqueInOrder(DATA.filter(r => r.edificio === bName).map(r => r.piso));
    floorOrder.forEach(fName => {
      const roomsInFloor = roomsInBuilding.filter(r => r.piso === fName);
      if (!roomsInFloor.length) return;
      const fAbiertas = roomsInFloor.filter(r => r.estado === "abierta").length;
      out += `  ${fName}: ${roomsInFloor.length} espacios — ${fAbiertas} abiertos / ${roomsInFloor.length - fAbiertas} cerrados\n`;
    });

    const cerradasIds = roomsInBuilding.filter(r => r.estado === "cerrada").map(r => r.id);
    if (cerradasIds.length){
      out += `  Cerrados: ${cerradasIds.join(", ")}\n`;
    }
    out += `  (${bAbiertas} abiertos / ${bCerradas} cerrados en total)\n\n`;
  });

  out += "----------------------------------------\n";
  out += "Reporte generado automáticamente desde el mapa de aulas.\n";
  out += "Responsable: " + REPORTE_CONFIG.nombreResponsable + "\n";

  return out;
}

function abrirModalReporte(){
  const texto = construirTextoReporte();
  document.getElementById("reportText").value = texto;

  const asunto = `Reporte de aulas — ${new Date().toLocaleDateString("es-CO")}`;
  const mailtoUrl = `mailto:${encodeURIComponent(REPORTE_CONFIG.correoJefe)}`
    + `?subject=${encodeURIComponent(asunto)}`
    + `&body=${encodeURIComponent(texto)}`;
  document.getElementById("btnMailto").href = mailtoUrl;

  const waTexto = `Buen día, adjunto el reporte de estado de aulas del ${new Date().toLocaleDateString("es-CO")}.`;
  const waUrl = `https://wa.me/${REPORTE_CONFIG.telefonoWhatsapp}?text=${encodeURIComponent(waTexto)}`;
  document.getElementById("btnWhatsapp").href = waUrl;

  document.getElementById("reportOverlay").classList.add("show");
}

function cerrarModalReporte(){
  document.getElementById("reportOverlay").classList.remove("show");
}

document.getElementById("btnReporte").addEventListener("click", abrirModalReporte);
document.getElementById("reportClose").addEventListener("click", cerrarModalReporte);
document.getElementById("reportOverlay").addEventListener("click", e => {
  if (e.target.id === "reportOverlay") cerrarModalReporte();
});

document.getElementById("btnCopiar").addEventListener("click", async () => {
  const texto = document.getElementById("reportText").value;
  try{
    await navigator.clipboard.writeText(texto);
    const btn = document.getElementById("btnCopiar");
    const original = btn.textContent;
    btn.textContent = "✅ Copiado";
    setTimeout(() => { btn.textContent = original; }, 1600);
  }catch(e){
    // Respaldo si el navegador bloquea el portapapeles
    const ta = document.getElementById("reportText");
    ta.select();
    document.execCommand("copy");
  }
});

document.getElementById("btnDescargar").addEventListener("click", () => {
  const texto = document.getElementById("reportText").value;
  const blob = new Blob([texto], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const fecha = new Date().toISOString().slice(0,10);
  a.href = url;
  a.download = `reporte-aulas-${fecha}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

/* ---------- Generación del PDF ---------- */
function generarPDF(){
  if (!window.jspdf){
    alert("No se pudo cargar el generador de PDF. Verifica tu conexión a internet e intenta de nuevo.");
    return null;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const marginX = 44;
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxWidth = pageWidth - marginX * 2;
  let y = 54;

  function salto(alto){
    if (y + alto > pageHeight - 40){
      doc.addPage();
      y = 54;
    }
  }
  function linea(texto, opts={}){
    const { size=10, style="normal", color=[20,20,20], alto=14 } = opts;
    salto(alto);
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
    doc.text(texto, marginX, y);
    y += alto;
  }

  const rooms = getRooms();
  const total = rooms.length;
  const abiertas = rooms.filter(r => r.estado === "abierta").length;
  const cerradas = total - abiertas;

  linea("Reporte de espacios academicos", { size: 17, style: "bold", alto: 22 });
  linea(SITE_TITLE, { size: 10, color: [90,90,90], alto: 14 });
  linea("Generado: " + fechaHoraActual(), { size: 10, color: [90,90,90], alto: 20 });

  linea("Resumen general", { size: 12, style: "bold", alto: 16 });
  linea(`Total de espacios: ${total}    Abiertos: ${abiertas}    Cerrados: ${cerradas}`, { size: 10, alto: 20 });

  const buildingOrder = uniqueInOrder(DATA.map(r => r.edificio));

  buildingOrder.forEach(bName => {
    const roomsInBuilding = rooms.filter(r => r.edificio === bName);
    if (!roomsInBuilding.length) return;

    salto(20);
    linea(bName, { size: 11.5, style: "bold", alto: 15 });
    if (CUSTODIA[bName]) linea(CUSTODIA[bName], { size: 9, style: "italic", color: [110,110,110], alto: 13 });

    const floorOrder = uniqueInOrder(DATA.filter(r => r.edificio === bName).map(r => r.piso));
    floorOrder.forEach(fName => {
      const roomsInFloor = roomsInBuilding.filter(r => r.piso === fName);
      if (!roomsInFloor.length) return;
      const fAbiertas = roomsInFloor.filter(r => r.estado === "abierta").length;
      linea(`   ${fName}: ${roomsInFloor.length} espacios — ${fAbiertas} abiertos / ${roomsInFloor.length - fAbiertas} cerrados`, { size: 9.5, alto: 13 });
    });

    const cerradasIds = roomsInBuilding.filter(r => r.estado === "cerrada").map(r => r.id);
    if (cerradasIds.length){
      const wrapped = doc.splitTextToSize("Cerrados: " + cerradasIds.join(", "), maxWidth - 14);
      wrapped.forEach(w => linea("   " + w, { size: 9.5, color: [150,60,55], alto: 12 }));
    }
    y += 8;
  });

  salto(20);
  linea("Responsable: " + REPORTE_CONFIG.nombreResponsable, { size: 9, color: [110,110,110], alto: 13 });

  return doc;
}

let ultimoPdfBlobUrl = null;

document.getElementById("btnDescargarPDF").addEventListener("click", () => {
  const doc = generarPDF();
  if (!doc) return;
  const fecha = new Date().toISOString().slice(0,10);
  doc.save(`reporte-aulas-${fecha}.pdf`);
});

/* ---------- Init ---------- */
document.getElementById("siteTitle").textContent = SITE_TITLE;
document.getElementById("lastUpdated").textContent = LAST_UPDATED;
renderMap();
