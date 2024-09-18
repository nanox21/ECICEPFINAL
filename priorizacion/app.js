let totalPoints = 0;

// Calcular los puntos totales
function calculatePoints() {
    totalPoints = 0; // Reiniciar los puntos antes de calcular

    // Verificar si todos los ítems están seleccionados
    if (allItemsSelected()) {
        // Obtener todos los radios seleccionados
        const selectedOptions = document.querySelectorAll('input[type="radio"]:checked');
        selectedOptions.forEach(option => {
            totalPoints += parseInt(option.value); // Sumar los valores seleccionados
        });
        updateTotalPoints(); // Actualizar la visualización de puntos totales
    } else {
        document.getElementById('totalPoints').textContent = 'Seleccione todas las respuestas.';
    }
}

// Verificar si todos los ítems están seleccionados
function allItemsSelected() {
    const questions = document.querySelectorAll('input[type="radio"]');
    const groups = [...new Set([...questions].map(input => input.name))];

    let allSelected = true;

    // Verificar si cada grupo tiene una opción seleccionada
    for (const group of groups) {
        const groupLabel = document.querySelector(`input[name="${group}"]`).closest('label');
        const selected = document.querySelector(`input[name="${group}"]:checked`);
        if (!selected) {
            allSelected = false; // Si algún grupo no tiene seleccionada una opción, marcar como no completo
            groupLabel.classList.add('unanswered'); // Añadir clase para marcar en rojo
        } else {
            groupLabel.classList.remove('unanswered'); // Quitar clase si ya está respondido
        }
    }
    return allSelected; // Retornar true solo si todas las opciones están seleccionadas
}

// Mostrar el total de puntos en el documento
function updateTotalPoints() {
    document.getElementById('totalPoints').textContent = totalPoints;
}

// Función para limpiar el formulario y resetear los puntos
function clearForm() {
    // Restablecer los puntos a cero
    totalPoints = 0;
    updateTotalPoints();

    // Deseleccionar todas las opciones de radio
    const radios = document.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => radio.checked = false);

    // Quitar la clase 'unanswered' de todos los labels
    const labels = document.querySelectorAll('label');
    labels.forEach(label => label.classList.remove('unanswered'));
}