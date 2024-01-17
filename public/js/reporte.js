window.addEventListener('DOMContentLoaded', async () => {
    const { publishableKey } = await fetch("/config").then(r => r.json());
    const stripe = Stripe(publishableKey);

    // Cuando se realice consultar se muestra el reporte.
    const form = document.getElementById("reporte-form");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        // Guardamos el id de la operacion ingresada.
        const transactionId = document.getElementById("transaction-id-input").value;
        // Hacemos la llamada a la ruta para consultar de la base de datos.
        const response = await fetch("/transactions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ transactionId: transactionId })
        });

        if (response.ok) {
            const transactions = await response.json();
            // Obtén la referencia al elemento contenido-reporte
            const contenidoReporte = document.getElementById("contenido-reporte");

            // Crear una tabla y su encabezado
            const table = document.createElement("table");
            table.style.borderSpacing = "40px";  // Ajusta este valor según tus preferencias
            const headerRow = table.insertRow(0);

            // Crear encabezados de la tabla basados en las claves del primer objeto
            for (const key in transactions[0]) {
                const headerCell = document.createElement("th");
                headerCell.textContent = key.charAt(0).toUpperCase() + key.slice(1);
                headerRow.appendChild(headerCell);
            }

            // Agregar filas de datos a la tabla
            transactions.forEach(transaction => {
                const row = table.insertRow();
                for (const key in transaction) {
                    const cell = row.insertCell();
                    if (key === "hora") {
                        const fecha = new Date(transaction[key]);
                        cell.textContent = fecha.toLocaleString('es-PE', { timeZone: 'America/Lima' });
                    }
                    else {
                        cell.textContent = transaction[key];
                    }
                }
            });

            // Limpiar contenido anterior y agregar la nueva tabla
            contenidoReporte.innerHTML = "";
            contenidoReporte.appendChild(table);
        } else {
            document.getElementById("contenido-reporte").innerText = "No se encontró la operación";
        }
    });
});