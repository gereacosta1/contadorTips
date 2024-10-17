document.getElementById('registroForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    const fecha = document.getElementById('fecha').value;
    const horas = parseFloat(document.getElementById('horas').value);
    const tips = parseFloat(document.getElementById('tips').value);

    // Crear una nueva fila para el historial
    const fila = document.createElement('tr');
    fila.innerHTML = `
        <td>${fecha}</td>
        <td>${horas}</td>
        <td>$${tips.toFixed(2)}</td>
    `;

    // Agregar la fila a la tabla de historial
    document.querySelector('#historial tbody').appendChild(fila);

    // Actualizar los totales
    const totalHoras = document.getElementById('totalHoras');
    const totalTips = document.getElementById('totalTips');

    totalHoras.textContent = (parseFloat(totalHoras.textContent) + horas).toFixed(2);
    totalTips.textContent = (parseFloat(totalTips.textContent) + tips).toFixed(2);

    // Limpiar el formulario
    document.getElementById('registroForm').reset();
});
