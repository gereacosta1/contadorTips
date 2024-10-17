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


document.getElementById('imageForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];
    
        if (file) {
        const reader = new FileReader();
    
        reader.onload = function(event) {
            const img = new Image();
            img.src = event.target.result;
    
            img.onload = function() {
            Tesseract.recognize(
                img, 
                'eng', 
                {
                logger: (m) => console.log(m) // Te muestra el progreso en la consola
                }
            ).then(({ data: { text } }) => {
                console.log(text);
                processText(text);
            });
            };
        };
    
        reader.readAsDataURL(file);
        }
    });
    
    function processText(text) {
        // Aquí puedes procesar el texto para extraer los datos de horas trabajadas, tips, etc.
        // Por ejemplo, puedes buscar números o palabras clave en el texto extraído.
        console.log('Texto extraído:', text);
    
        // Extraer datos específicos como horas y tips con expresiones regulares o búsqueda de palabras clave
        const hoursWorked = text.match(/(\d+)\s*hours/);  // Ejemplo para extraer "hours"
        const tipsGenerated = text.match(/\$(\d+)/);      // Ejemplo para extraer montos en dólares
    
        console.log('Horas trabajadas:', hoursWorked ? hoursWorked[1] : 'No encontrado');
        console.log('Tips generados:', tipsGenerated ? tipsGenerated[1] : 'No encontrado');
    
        // Aquí podrías almacenar los datos en LocalStorage o mostrarlos en la página
    }
    







    function saveData(hours, tips) {
        // Obtener datos anteriores de LocalStorage
        let existingData = JSON.parse(localStorage.getItem('workData')) || [];
        
        // Agregar los nuevos datos
        existingData.push({ hours: parseFloat(hours), tips: parseFloat(tips) });
        
            // Guardar de nuevo en LocalStorage
            localStorage.setItem('workData', JSON.stringify(existingData));
        }
        
        function calculateTotals() {
            let data = JSON.parse(localStorage.getItem('workData')) || [];
            let totalHours = data.reduce((sum, entry) => sum + entry.hours, 0);
            let totalTips = data.reduce((sum, entry) => sum + entry.tips, 0);
        
            console.log(`Total de horas trabajadas: ${totalHours}`);
            console.log(`Total de tips generados: $${totalTips}`);
        }
        
        // Ejemplo de uso después de extraer los datos:
        const hours = 8; // Extraído del texto con OCR
        const tips = 150; // Extraído del texto con OCR
        
        saveData(hours, tips);
        calculateTotals();
        