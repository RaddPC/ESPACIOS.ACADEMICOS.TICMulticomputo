/* ================================================================
   DATOS — EDITA AQUÍ TU INFORMACIÓN REAL
   ================================================================
   Estructura de cada salón:
   {
     id:        "MC-101"         -> código único del salón (visible)
     nombre:    "Aula 101"       -> nombre o uso del salón
     sede:      "Multicomputo"   -> sede (Multicomputo, Multitech, ...)
     piso:      "Piso 1"         -> nombre del piso (se agrupan por este texto)
     tipo:      "Aula"           -> Aula | Laboratorio | Auditorio | Sala de cómputo
     capacidad: 35                -> número de puestos
     estado:    "cerrada"        -> "abierta" | "cerrada" | "cancelada" (valor inicial)
     horario: [                   -> opcional, cronograma oficial fijo (Galileo, etc.)
       { hora: "07:00 - 09:00", clase: "Cálculo I", docente: "J. Pérez" }
     ]
   }
   El detalle del día a día (docente actual, horario, programa o la nota
   de una novedad) NO se edita aquí: se registra desde la página, en el
   panel de cada salón, y queda guardado en el navegador.

   Puedes agregar tantas sedes, pisos y salones como necesites.
   El mapa se construye automáticamente a partir de este arreglo.
================================================================= */

const SITE_TITLE = "Multicomputo - Multitech";
const LAST_UPDATED = "17 sep 2026";

/* ----------------------------------------------------------------
   Generador de salones numerados consecutivos.
   Úsalo cuando un piso tiene un rango de códigos tipo 301-305.
   Cambia SOLO "inicio" y "fin" si el rango cambia.
---------------------------------------------------------------- */
function generarAulas({ sede, piso, prefijo, inicio, fin, nombreBase, tipo, capacidad, estado }){
  const arr = [];
  for (let n = inicio; n <= fin; n++){
    arr.push({
      id: `${prefijo}-${n}`,
      nombre: `${nombreBase} ${n}`,
      sede, piso, tipo, capacidad, estado,
      horario: []
    });
  }
  return arr;
}

const DATA = [].concat(

  /* ============ SEDE MULTICOMPUTO ============
     Salones actuales: 101, 102, 201, 202, 203, 301, 302, 303, 304, 305.
     Ajusta "capacidad" o "tipo" por piso si alguno es distinto. */
  generarAulas({ sede:"Multicomputo", piso:"Piso 1", prefijo:"MC",
    inicio:101, fin:102, nombreBase:"Aula", tipo:"Aula", capacidad:35, estado:"cerrada" }),
  generarAulas({ sede:"Multicomputo", piso:"Piso 2", prefijo:"MC",
    inicio:201, fin:203, nombreBase:"Aula", tipo:"Aula", capacidad:35, estado:"cerrada" }),
  generarAulas({ sede:"Multicomputo", piso:"Piso 3", prefijo:"MC",
    inicio:301, fin:305, nombreBase:"Aula", tipo:"Aula", capacidad:35, estado:"cerrada" })

  /* ============ SEDE MULTITECH ============
     Cuando tengas los salones de esta sede, agrégalos aquí con el
     mismo patrón, por ejemplo:

     , ...generarAulas({ sede:"Multitech", piso:"Piso 1", prefijo:"MT",
         inicio:101, fin:104, nombreBase:"Aula", tipo:"Aula", capacidad:35, estado:"cerrada" })
     , ...generarAulas({ sede:"Multitech", piso:"Piso 2", prefijo:"MT",
         inicio:201, fin:205, nombreBase:"Aula", tipo:"Aula", capacidad:35, estado:"cerrada" })

     También puedes agregar salones sueltos (auditorios, salas) así:

     , { id:"MT-AUD-1", nombre:"Auditorio", sede:"Multitech", piso:"Piso 1",
         tipo:"Auditorio", capacidad:100, estado:"cerrada", horario:[] }
  */

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

/* Texto fijo de agradecimiento al creador del código — SOLO aparece en el
   pie del PDF, no se usa para nada más, así que puedes cambiar el texto
   con total libertad (siempre entre comillas) sin que nada se rompa. */
const CREDITO_CODIGO = "Código y diseño: Juan G. Tobon";

const STORAGE_KEY = "aulas_estado_v2";

/* Cada entrada guardada tiene la forma:
   { estado, docente, horario, programa, nota, actualizado } */
function loadOverrides(){
  try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch(e){ return {}; }
}
function saveOverride(id, datos){
  const ov = loadOverrides();
  ov[id] = { ...(ov[id] || {}), ...datos, actualizado: fechaHoraActual() };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ov));
}

function getRooms(){
  const ov = loadOverrides();
  return DATA.map(r => {
    const o = ov[r.id];
    if (!o) return { ...r, docente:"", horarioClase:"", programa:"", nota:"", actualizado:"" };
    return {
      ...r,
      estado: o.estado || r.estado,
      docente: o.docente || "",
      horarioClase: o.horario || "",
      programa: o.programa || "",
      nota: o.nota || "",
      actualizado: o.actualizado || ""
    };
  });
}

let filters = { sede: "", piso: "", estado: "", texto: "" };

function uniqueInOrder(arr){
  return [...new Set(arr)];
}

function populateFilterOptions(rooms){
  const sSel = document.getElementById("fSede");
  const fSel = document.getElementById("fFloor");

  const sedes = uniqueInOrder(DATA.map(r => r.sede));
  sSel.innerHTML = '<option value="">Todas</option>' +
    sedes.map(s => `<option value="${escapeAttr(s)}">${escapeHtml(s)}</option>`).join("");

  const floorsSource = filters.sede
    ? DATA.filter(r => r.sede === filters.sede)
    : DATA;
  const floors = uniqueInOrder(floorsSource.map(r => r.piso));
  fSel.innerHTML = '<option value="">Todos</option>' +
    floors.map(f => `<option value="${escapeAttr(f)}">${escapeHtml(f)}</option>`).join("");

  sSel.value = filters.sede;
  fSel.value = filters.piso;
}

function escapeHtml(s){
  return String(s ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));
}
function escapeAttr(s){ return escapeHtml(s); }

function estadoLabel(estado){
  if (estado === "abierta") return "Abierta / con clase";
  if (estado === "cancelada") return "Clase cancelada";
  return "Cerrada / apagada";
}
function estadoClaseCss(estado){
  if (estado === "abierta") return "open";
  if (estado === "cancelada") return "cancelled";
  return "closed";
}

function renderStats(rooms){
  const total = rooms.length;
  const open = rooms.filter(r => r.estado === "abierta").length;
  const cancelled = rooms.filter(r => r.estado === "cancelada").length;
  const closed = total - open - cancelled;
  const pct = total ? Math.round((open/total)*100) : 0;

  document.getElementById("statTotal").textContent = total;
  document.getElementById("statOpen").textContent = open;
  document.getElementById("statClosed").textContent = closed;
  document.getElementById("statCancelled").textContent = cancelled;
  document.getElementById("statPct").textContent = pct + "%";
}

function applyFilters(rooms){
  return rooms.filter(r => {
    if (filters.sede && r.sede !== filters.sede) return false;
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
    mapEl.innerHTML = '<div class="empty-msg">No hay salones que coincidan con estos filtros.</div>';
    return;
  }

  // Mantener el orden de aparición de sedes/pisos según DATA
  const sedeOrder = uniqueInOrder(DATA.map(r => r.sede));
  const bySede = groupBy(filtered, r => r.sede);

  sedeOrder.forEach(sName => {
    const roomsInSede = bySede.get(sName);
    if (!roomsInSede) return;

    const sTotal = roomsInSede.length;
    const sOpen = roomsInSede.filter(r => r.estado === "abierta").length;

    const bDiv = document.createElement("div");
    bDiv.className = "building";
    bDiv.innerHTML = `
      <div class="building-head">
        <h2>${escapeHtml(sName)}</h2>
        <span class="sub">${sOpen}/${sTotal} abiertos</span>
      </div>
    `;

    const floorOrder = uniqueInOrder(DATA.filter(r => r.sede === sName).map(r => r.piso));
    const byFloor = groupBy(roomsInSede, r => r.piso);

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
        btn.className = `room is-${estadoClaseCss(r.estado)}`;
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
let estadoSeleccionado = null;

function mostrarCamposPorEstado(estado){
  document.getElementById("fieldsAbierta").classList.toggle("show", estado === "abierta");
  document.getElementById("fieldsNota").classList.toggle("show", estado === "cerrada" || estado === "cancelada");
  document.getElementById("notaLabel").textContent = estado === "cancelada"
    ? "Motivo de la cancelación (opcional)"
    : "Nota / novedad";
}

function seleccionarEstado(estado){
  estadoSeleccionado = estado;
  document.querySelectorAll(".state-opt").forEach(b => b.classList.toggle("active", b.getAttribute("data-estado") === estado));
  mostrarCamposPorEstado(estado);
  document.getElementById("stateError").textContent = "";
}

function openPanel(id){
  const room = getRooms().find(r => r.id === id);
  if (!room) return;
  currentRoomId = id;

  document.getElementById("pCode").textContent = room.id;
  document.getElementById("pName").textContent = room.nombre;
  document.getElementById("pSede").textContent = room.sede;
  document.getElementById("pFloor").textContent = room.piso;
  document.getElementById("pType").textContent = room.tipo;
  document.getElementById("pCapacity").textContent = room.capacidad + " personas";

  const badge = document.getElementById("pBadge");
  badge.textContent = estadoLabel(room.estado);
  badge.className = "badge " + estadoClaseCss(room.estado);

  // Cronograma oficial fijo (si lo hay en DATA)
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

  // Detalle registrado desde la página (docente actual / nota)
  const detalleWrap = document.getElementById("pDetalleActualWrap");
  const detalleEl = document.getElementById("pDetalleActual");
  if (room.estado === "abierta" && (room.docente || room.horarioClase || room.programa)){
    detalleWrap.style.display = "block";
    detalleEl.innerHTML = `
      <div class="current-info">
        <div><span>Docente</span><b>${escapeHtml(room.docente || "—")}</b></div>
        <div><span>Horario</span><b>${escapeHtml(room.horarioClase || "—")}</b></div>
        <div><span>Programa</span><b>${escapeHtml(room.programa || "—")}</b></div>
        ${room.actualizado ? `<div><span>Actualizado</span><b>${escapeHtml(room.actualizado)}</b></div>` : ""}
      </div>`;
  } else if ((room.estado === "cerrada" || room.estado === "cancelada") && room.nota){
    detalleWrap.style.display = "block";
    detalleEl.innerHTML = `
      <div class="current-info">
        <div><span>Nota</span><b>${escapeHtml(room.nota)}</b></div>
        ${room.actualizado ? `<div><span>Actualizado</span><b>${escapeHtml(room.actualizado)}</b></div>` : ""}
      </div>`;
  } else {
    detalleWrap.style.display = "none";
  }

  // Formulario: preseleccionar el estado actual y precargar sus campos
  document.getElementById("inDocente").value = room.docente || "";
  document.getElementById("inHorarioClase").value = room.horarioClase || "";
  document.getElementById("inPrograma").value = room.programa || "";
  document.getElementById("inNota").value = room.nota || "";
  seleccionarEstado(room.estado);

  overlay.classList.add("show");
  panel.classList.add("show");
  panel.setAttribute("aria-hidden", "false");
}

function closePanel(){
  overlay.classList.remove("show");
  panel.classList.remove("show");
  panel.setAttribute("aria-hidden", "true");
  currentRoomId = null;
  estadoSeleccionado = null;
}

document.getElementById("panelClose").addEventListener("click", closePanel);
overlay.addEventListener("click", closePanel);
document.addEventListener("keydown", e => { if (e.key === "Escape") closePanel(); });

document.querySelectorAll(".state-opt").forEach(btn => {
  btn.addEventListener("click", () => seleccionarEstado(btn.getAttribute("data-estado")));
});

document.getElementById("pGuardar").addEventListener("click", () => {
  if (!currentRoomId || !estadoSeleccionado) return;
  const errorEl = document.getElementById("stateError");

  const datos = { estado: estadoSeleccionado };

  if (estadoSeleccionado === "abierta"){
    const docente = document.getElementById("inDocente").value.trim();
    if (!docente){
      errorEl.textContent = "Indica al menos el nombre del docente.";
      return;
    }
    datos.docente = docente;
    datos.horario = document.getElementById("inHorarioClase").value.trim();
    datos.programa = document.getElementById("inPrograma").value.trim();
    datos.nota = "";
  } else {
    datos.nota = document.getElementById("inNota").value.trim();
    if (estadoSeleccionado === "cerrada" && !datos.nota){
      errorEl.textContent = "Escribe una nota describiendo la novedad (o \"Sin novedad\" si no hay nada que reportar).";
      return;
    }
    datos.docente = "";
    datos.horario = "";
    datos.programa = "";
  }

  errorEl.textContent = "";
  saveOverride(currentRoomId, datos);
  renderMap();
  openPanel(currentRoomId);
});

/* ---------- Controles de filtro ---------- */
document.getElementById("fSede").addEventListener("change", e => {
  filters.sede = e.target.value;
  filters.piso = ""; // reset piso al cambiar de sede
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
  const canceladas = rooms.filter(r => r.estado === "cancelada").length;
  const cerradas = total - abiertas - canceladas;

  let out = "";
  out += "REPORTE DE ESPACIOS ACADEMICOS\n";
  out += SITE_TITLE + "\n";
  out += "Generado: " + fechaHoraActual() + "\n";
  out += "----------------------------------------\n\n";
  out += "RESUMEN GENERAL\n";
  out += `Total de espacios:  ${total}\n`;
  out += `Abiertos:           ${abiertas}\n`;
  out += `Cerrados:           ${cerradas}\n`;
  out += `Clases canceladas:  ${canceladas}\n\n`;

  const sedeOrder = uniqueInOrder(DATA.map(r => r.sede));

  sedeOrder.forEach(sName => {
    const roomsInSede = rooms.filter(r => r.sede === sName);
    if (!roomsInSede.length) return;

    const sAbiertas = roomsInSede.filter(r => r.estado === "abierta").length;
    const sCanceladas = roomsInSede.filter(r => r.estado === "cancelada").length;
    const sCerradas = roomsInSede.length - sAbiertas - sCanceladas;

    out += "SEDE: " + sName.toUpperCase() + "\n";

    const floorOrder = uniqueInOrder(DATA.filter(r => r.sede === sName).map(r => r.piso));
    floorOrder.forEach(fName => {
      const roomsInFloor = roomsInSede.filter(r => r.piso === fName);
      if (!roomsInFloor.length) return;
      const fAbiertas = roomsInFloor.filter(r => r.estado === "abierta").length;
      out += `  ${fName}: ${roomsInFloor.length} espacios — ${fAbiertas} abiertos / ${roomsInFloor.length - fAbiertas} no disponibles\n`;
    });

    out += `  (${sAbiertas} abiertos / ${sCerradas} cerrados / ${sCanceladas} cancelados en total)\n\n`;
  });

  const enUso = rooms.filter(r => r.estado === "abierta" && r.docente);
  out += `AULAS EN USO (${enUso.length})\n`;
  if (!enUso.length){
    out += "  Ninguna.\n";
  } else {
    enUso.forEach(r => {
      out += `  - ${r.id} (${r.sede}, ${r.piso}): ${r.docente}`
        + (r.programa ? ` — ${r.programa}` : "")
        + (r.horarioClase ? ` — ${r.horarioClase}` : "")
        + "\n";
    });
  }
  out += "\n";

  const canceladasList = rooms.filter(r => r.estado === "cancelada");
  out += `CLASES CANCELADAS (${canceladasList.length})\n`;
  if (!canceladasList.length){
    out += "  Ninguna.\n";
  } else {
    canceladasList.forEach(r => {
      out += `  - ${r.id} (${r.sede}, ${r.piso})` + (r.nota ? `: ${r.nota}` : "") + "\n";
    });
  }
  out += "\n";

  const conNovedad = rooms.filter(r => r.estado === "cerrada" && r.nota);
  out += `CERRADAS CON NOVEDAD (${conNovedad.length})\n`;
  if (!conNovedad.length){
    out += "  Ninguna.\n";
  } else {
    conNovedad.forEach(r => {
      out += `  - ${r.id} (${r.sede}, ${r.piso}): ${r.nota}\n`;
    });
  }

  out += "\n----------------------------------------\n";
  out += "Reporte generado automáticamente desde el mapa de salones.\n";
  out += "Responsable: " + REPORTE_CONFIG.nombreResponsable + "\n";

  return out;
}

function abrirModalReporte(){
  const texto = construirTextoReporte();
  document.getElementById("reportText").value = texto;

  const asunto = `Reporte de salones — ${new Date().toLocaleDateString("es-CO")}`;
  const mailtoUrl = `mailto:${encodeURIComponent(REPORTE_CONFIG.correoJefe)}`
    + `?subject=${encodeURIComponent(asunto)}`
    + `&body=${encodeURIComponent(texto)}`;
  document.getElementById("btnMailto").href = mailtoUrl;

  const waTexto = `Buen día, adjunto el reporte de estado de salones del ${new Date().toLocaleDateString("es-CO")}.`;
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
  a.download = `reporte-salones-${fecha}.txt`;
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
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 44;
  const contentWidth = pageWidth - marginX * 2;

  // Paleta impresa (basada en los colores del sitio)
  const C_DEEP   = [10, 31, 48];     // fondo del encabezado
  const C_INK    = [20, 35, 48];     // texto principal
  const C_ACCENT = [42, 124, 138];   // acento (barras de sección)
  const C_PAPER  = [234, 242, 244];  // texto claro sobre el encabezado
  const C_DIM    = [120, 138, 148];  // texto secundario
  const C_LINE   = [214, 223, 227];  // líneas / bordes finos
  const C_CARDBG = [247, 249, 250];
  const C_OPEN   = [64, 130, 96];
  const C_CLOSED = [176, 73, 63];
  const C_AMBER  = [175, 128, 30];

  let y = 0;

  function nuevaPagina(){
    doc.addPage();
    y = 46;
  }
  function salto(alto){
    if (y + alto > pageHeight - 56) nuevaPagina();
  }
  function linea(texto, opts={}){
    const { size=10, style="normal", color=C_INK, alto=14, x=marginX, font="helvetica" } = opts;
    salto(alto);
    doc.setFont(font, style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
    doc.text(texto, x, y);
    y += alto;
  }
  function tituloSeccion(texto){
    salto(28);
    doc.setFillColor(...C_ACCENT);
    doc.rect(marginX, y - 10, 3, 13, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11.5);
    doc.setTextColor(...C_INK);
    doc.text(texto.toUpperCase(), marginX + 10, y);
    y += 14;
  }
  function punto(texto, color, opts={}){
    salto(13);
    doc.setFillColor(...color);
    doc.circle(marginX + 2.5, y - 3.2, 2, "F");
    const wrapped = doc.splitTextToSize(texto, contentWidth - 14);
    wrapped.forEach((w, i) => {
      if (i > 0) salto(12);
      linea(w, { size: 9.5, alto: 12, x: marginX + 12, color: opts.color || C_INK });
    });
  }

  const rooms = getRooms();
  const total = rooms.length;
  const abiertas = rooms.filter(r => r.estado === "abierta").length;
  const canceladas = rooms.filter(r => r.estado === "cancelada").length;
  const cerradas = total - abiertas - canceladas;

  /* ---- Encabezado con banda de color ---- */
  const headerH = 90;
  doc.setFillColor(...C_DEEP);
  doc.rect(0, 0, pageWidth, headerH, "F");
  doc.setFillColor(127, 216, 224);
  doc.rect(0, headerH - 3, pageWidth, 3, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(...C_PAPER);
  doc.text("Reporte de espacios académicos", marginX, 40);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(190, 210, 215);
  doc.text(SITE_TITLE, marginX, 58);

  doc.setFontSize(9);
  doc.setTextColor(150, 185, 190);
  doc.text("Generado: " + fechaHoraActual(), marginX, 74);

  y = headerH + 28;

  /* ---- Resumen general como tarjetas ---- */
  const cards = [
    { label: "TOTAL",      value: total,      color: C_INK   },
    { label: "ABIERTOS",   value: abiertas,   color: C_OPEN  },
    { label: "CERRADOS",   value: cerradas,   color: C_CLOSED},
    { label: "CANCELADOS", value: canceladas, color: C_AMBER }
  ];
  const gap = 10;
  const cardW = (contentWidth - gap * 3) / 4;
  const cardH = 50;
  cards.forEach((c, i) => {
    const cx = marginX + i * (cardW + gap);
    doc.setFillColor(...C_CARDBG);
    doc.setDrawColor(...C_LINE);
    doc.roundedRect(cx, y, cardW, cardH, 3, 3, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(19);
    doc.setTextColor(...c.color);
    doc.text(String(c.value), cx + 12, y + 27);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...C_DIM);
    doc.text(c.label, cx + 12, y + 40);
  });
  y += cardH + 26;

  /* ---- Inventario por sede / piso ---- */
  tituloSeccion("Inventario por sede");
  const sedeOrder = uniqueInOrder(DATA.map(r => r.sede));
  sedeOrder.forEach(sName => {
    const roomsInSede = rooms.filter(r => r.sede === sName);
    if (!roomsInSede.length) return;

    salto(16);
    linea(sName, { size: 10.5, style: "bold", alto: 15 });

    const floorOrder = uniqueInOrder(DATA.filter(r => r.sede === sName).map(r => r.piso));
    floorOrder.forEach(fName => {
      const roomsInFloor = roomsInSede.filter(r => r.piso === fName);
      if (!roomsInFloor.length) return;
      const fAbiertas = roomsInFloor.filter(r => r.estado === "abierta").length;
      linea(`${fName}: ${roomsInFloor.length} espacios · ${fAbiertas} abiertos / ${roomsInFloor.length - fAbiertas} no disponibles`,
        { size: 9, color: C_DIM, alto: 13, x: marginX + 12 });
    });
    y += 4;
  });

  /* ---- Aulas en uso ---- */
  const enUso = rooms.filter(r => r.estado === "abierta" && r.docente);
  tituloSeccion(`Aulas en uso (${enUso.length})`);
  if (!enUso.length){
    linea("Ninguna.", { size: 9.5, color: C_DIM, alto: 13 });
  } else {
    enUso.forEach(r => {
      const texto = `${r.id}  (${r.sede}, ${r.piso}) — ${r.docente}`
        + (r.programa ? `  ·  ${r.programa}` : "")
        + (r.horarioClase ? `  ·  ${r.horarioClase}` : "");
      punto(texto, C_OPEN);
    });
  }
  y += 6;

  /* ---- Clases canceladas ---- */
  const canceladasList = rooms.filter(r => r.estado === "cancelada");
  tituloSeccion(`Clases canceladas (${canceladasList.length})`);
  if (!canceladasList.length){
    linea("Ninguna.", { size: 9.5, color: C_DIM, alto: 13 });
  } else {
    canceladasList.forEach(r => {
      const texto = `${r.id}  (${r.sede}, ${r.piso})` + (r.nota ? ` — ${r.nota}` : "");
      punto(texto, C_AMBER, { color: C_AMBER });
    });
  }
  y += 6;

  /* ---- Cerradas con novedad ---- */
  const conNovedad = rooms.filter(r => r.estado === "cerrada" && r.nota);
  tituloSeccion(`Cerradas con novedad (${conNovedad.length})`);
  if (!conNovedad.length){
    linea("Ninguna.", { size: 9.5, color: C_DIM, alto: 13 });
  } else {
    conNovedad.forEach(r => {
      const texto = `${r.id}  (${r.sede}, ${r.piso}) — ${r.nota}`;
      punto(texto, C_CLOSED, { color: C_CLOSED });
    });
  }

  /* ---- Pie de página en todas las páginas ---- */
  const totalPaginas = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPaginas; p++){
    doc.setPage(p);
    doc.setDrawColor(...C_LINE);
    doc.line(marginX, pageHeight - 34, pageWidth - marginX, pageHeight - 34);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...C_DIM);
    doc.text("Responsable: " + REPORTE_CONFIG.nombreResponsable, marginX, pageHeight - 20);
    doc.text(`Página ${p} de ${totalPaginas}`, pageWidth - marginX, pageHeight - 20, { align: "right" });
    doc.setFontSize(7.5);
    doc.setTextColor(160, 175, 182);
    doc.text(CREDITO_CODIGO, marginX, pageHeight - 9);
  }

  return doc;
}

document.getElementById("btnDescargarPDF").addEventListener("click", () => {
  const doc = generarPDF();
  if (!doc) return;
  const fecha = new Date().toISOString().slice(0,10);
  doc.save(`reporte-salones-${fecha}.pdf`);
});

/* ---------- Init ---------- */
document.getElementById("siteTitle").textContent = SITE_TITLE;
document.getElementById("lastUpdated").textContent = LAST_UPDATED;
renderMap();
