// REEMPLAZA ESTA URL CON LA QUE COPIASTE DE APPS SCRIPT
const API_URL = 'https://script.google.com/macros/s/AKfycbxa4JMS_Zihxgja9rPxq1_Za_XWL84SJOyQQafoqDPkJdIl7AuIBgP-wHd0-vrCmb8Z/exec';

document.addEventListener("DOMContentLoaded", () => {
    cargarCostos();
});

async function cargarCostos() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        renderizarTabla(data);

    } catch (error) {
        console.error("Error al cargar los datos:", error);
        document.getElementById('loader').innerHTML = `
            <div class="alert alert-danger" role="alert">
                Hubo un error al sincronizar con Google Sheets. Verifica la consola para más detalles.
            </div>`;
    }
}

function renderizarTabla(datos) {
    const tbody = document.getElementById('tablaCostos');
    let htmlContent = '';

    datos.forEach(item => {
        // Asegurarse de que el costo es un número para formatearlo
        const costo = parseFloat(item['Costo Bebida']);
        
        if (!isNaN(costo)) {
            htmlContent += `
                <tr>
                    <td class="fw-bold">${item['Producto']}</td>
                    <td class="text-end text-success fw-bold">
                        $${costo.toFixed(2)}
                    </td>
                </tr>
            `;
        }
    });

    // Inyectar el HTML en la tabla
    tbody.innerHTML = htmlContent;

    // Ocultar el loader y mostrar la tabla
    document.getElementById('loader').classList.add('d-none');
    document.getElementById('tableWrapper').classList.remove('d-none');
}
