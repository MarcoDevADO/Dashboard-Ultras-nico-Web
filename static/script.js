const tableBody = document.querySelector("#data-table tbody");

const ctxEMG = document.getElementById('chartEMG').getContext('2d');

function createLineChart(ctx, label, color){
    return new Chart(ctx, {
        type: 'line',
        data: { labels: [], datasets: [{ label: label, data: [], borderColor: color, fill: false }] },
        options: {
            animation: false,
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            elements: { point: { radius: 0 } },
            scales: { x: { display: false } }
        }
    });
}

const chartEMG = createLineChart(ctxEMG, 'EMG', 'purple');

function addData(chart, value) {
    chart.data.labels.push('');
    chart.data.datasets[0].data.push(value);

    if (chart.data.labels.length > 50) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }

    chart.update('none');
}

function descargarPDF() {
    window.open('/download-pdf', '_blank');
}

async function borrarDatos() {
    if (confirm('¿Estás seguro de que quieres borrar todos los datos?')) {
        try {
            const response = await fetch('/clear-data', { method: 'POST' });
            const result = await response.json();
            if (result.status === 'ok') {
                tableBody.innerHTML = "";
                alert('Datos borrados exitosamente');
            }
        } catch (error) {
            console.error('Error al borrar datos:', error);
            alert('Error al borrar datos');
        }
    }
}

async function updateData() {
    try {
        const response = await fetch('/data');
        const historial = await response.json();

        tableBody.innerHTML = "";

        historial.forEach(dato => {
            const row = tableBody.insertRow();
            row.insertCell(0).innerText = dato.emg || "-";
            addData(chartEMG, dato.emg);
        });

    } catch (error) {
        console.log("Esperando datos...");
    }
}

setInterval(updateData, 500);