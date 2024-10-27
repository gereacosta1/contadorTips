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
                    console.log("Texto extraído:", text);
                    processText(text); // Llama a processText para extraer horas y propinas
                });
            };
        };
    
        reader.readAsDataURL(file);
    }
});

function processText(text) {
    const hoursWorked = text.match(/(\d+)\s*hours/); // Extrae "hours" del texto
    const tipsGenerated = text.match(/\$(\d+)/); // Extrae monto en dólares del texto

    const hours = hoursWorked ? parseFloat(hoursWorked[1]) : 0;
    const tips = tipsGenerated ? parseFloat(tipsGenerated[1]) : 0;

    // Llama a saveData y updateView cada vez que se sube un nuevo recibo
    saveData(hours, tips);
    updateView();
}











function saveData(hours, tips) {
    // Recupera el historial de datos almacenado
    let existingData = JSON.parse(localStorage.getItem('workData')) || [];

    // Agrega los nuevos datos junto con la fecha
    const today = new Date().toISOString().split('T')[0];
    existingData.push({ date: today, hours: hours, tips: tips });

    // Actualiza el LocalStorage
    localStorage.setItem('workData', JSON.stringify(existingData));
}

// Calcula totales para un período de dos semanas
function calculateBiweeklyTotals() {
    const data = JSON.parse(localStorage.getItem('workData')) || [];
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const biweeklyData = data.filter(entry => new Date(entry.date) >= twoWeeksAgo);

    const totalHours = biweeklyData.reduce((sum, entry) => sum + entry.hours, 0);
    const totalTips = biweeklyData.reduce((sum, entry) => sum + entry.tips, 0);

    return { totalHours, totalTips };
}










function updateView() {
    const { totalHours, totalTips } = calculateBiweeklyTotals();

    document.getElementById('totalHoursDisplay').textContent = totalHours.toFixed(2);
    document.getElementById('totalTipsDisplay').textContent = `$${totalTips.toFixed(2)}`;
}

// Llama a updateView cada vez que se carga la página para que muestre datos actualizados
document.addEventListener('DOMContentLoaded', updateView);













function resetDataBiweekly() {
    const lastReset = localStorage.getItem('lastResetDate');
    const now = new Date();

    if (!lastReset || new Date(lastReset).getTime() <= now.getTime() - 12096e5) { // 12096e5 ms = 14 días
        localStorage.setItem('workData', JSON.stringify([])); // Reinicia el historial
        localStorage.setItem('lastResetDate', now.toISOString());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    resetDataBiweekly(); // Llama a la función al cargar la página
    updateView();
});
