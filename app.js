// Reemplaza esta URL con la URL de despliegue de tu Google Apps Script
const API_URL = "https://script.google.com/macros/s/TU_SCRIPT_ID/exec";

document.addEventListener("DOMContentLoaded", () => {
  cargarInsumos();
});

function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  event.target.classList.add('active');

  if (tabId === 'bebidas') cargarBebidas();
}

async function cargarInsumos() {
  const res = await fetch(`${API_URL}?action=getInsumos`);
  const data = await res.json();
  const tbody = document.querySelector("#tablaInsumos tbody");
  tbody.innerHTML = "";

  data.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.insumo}</td>
      <td>${new Date(item.fecha_compra).toLocaleDateString()}</td>
      <td>$${Number(item.precio).toFixed(2)}</td>
      <td>${item.um}</td>
      <td>${Number(item.cantidad).toLocaleString()}</td>
      <td>$${Number(item.costo_unidad).toFixed(4)}</td>
    `;
    tbody.appendChild(tr);
  });
}

document.getElementById("formInsumo").addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    action: "addInsumo",
    insumo: document.getElementById("insumoNombre").value,
    fecha_compra: document.getElementById("insumoFecha").value,
    precio: parseFloat(document.getElementById("insumoPrecio").value),
    um: document.getElementById("insumoUM").value,
    cantidad: parseFloat(document.getElementById("insumoCantidad").value)
  };

  await fetch(API_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  alert("Insumo guardado");
  document.getElementById("formInsumo").reset();
  setTimeout(cargarInsumos, 1500);
});

async function cargarBebidas() {
  const res = await fetch(`${API_URL}?action=getRecetas`);
  const { bebidas, recetas, insumos } = await res.json();
  const contenedor = document.getElementById("listaBebidas");
  contenedor.innerHTML = "";

  bebidas.forEach(bebida => {
    const recs = recetas.filter(r => r.id_bebida === bebida.id_bebida);
    let costoTotal = 0;

    let htmlReceta = `<ul>`;
    recs.forEach(r => {
      const ins = insumos.find(i => i.id === r.id_insumo);
      if (ins) {
        const costoIngrediente = r.cantidad_usada * ins.costo_unidad;
        costoTotal += costoIngrediente;
        htmlReceta += `<li>${ins.insumo}: ${r.cantidad_usada} ${ins.um} ($${costoIngrediente.toFixed(3)})</li>`;
      }
    });
    htmlReceta += `</ul>`;

    const div = document.createElement("div");
    div.style.border = "1px solid #ccc";
    div.style.padding = "10px";
    div.style.marginBottom = "10px";
    div.innerHTML = `
      <h3>${bebida.nombre} (${bebida.categoria})</h3>
      ${htmlReceta}
      <p><strong>Costo Directo Total:</strong> $${costoTotal.toFixed(2)} MXN</p>
    `;
    contenedor.appendChild(div);
  });
}

function calcularCosteoCafe() {
  const pVerde = parseFloat(document.getElementById("precioVerde").value) || 0;
  const merma = parseFloat(document.getElementById("merma").value) || 0;
  const empaque = parseFloat(document.getElementById("costoEmpaque").value) || 0;
  const etiqueta = parseFloat(document.getElementById("costoEtiqueta").value) || 0;
  const otros = parseFloat(document.getElementById("otrosCostos").value) || 0;
  const pesoKg = parseFloat(document.getElementById("pesoBolsa").value) || 0;

  // Costo kg tostado = Costo kg verde / (1 - merma)
  const costoKgTostado = pVerde / (1 - merma);
  const costoCafeEnBolsa = costoKgTostado * pesoKg;
  const costoFinal = costoCafeEnBolsa + empaque + etiqueta + otros;

  document.getElementById("resultadoCafe").innerText = 
    `Costo total por bolsa de ${pesoKg * 1000}g: $${costoFinal.toFixed(2)} MXN`;
}
