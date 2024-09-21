function calculateRisk() {
    // Seleccionar los checkboxes de las diferentes categorías
    const majorRisks = document.querySelectorAll('.risk-major:checked');
    const intermediateRisks = document.querySelectorAll('.risk-intermediate:checked');
    const minorRisks = document.querySelectorAll('.risk-minor:checked');

    // Contar la cantidad de factores seleccionados
    const majorRiskCount = majorRisks.length;
    const intermediateRiskCount = intermediateRisks.length;
    const minorRiskCount = minorRisks.length;

    let riskLevel = '';
    let recommendation = '';

    // Clasificación del riesgo según las condiciones
    if (majorRiskCount >= 2 || (majorRiskCount === 1 && intermediateRiskCount >= 3)) {
        riskLevel = 'RIESGO MAYOR';
        recommendation = `Estudio de familia y plan de intervención familiar consensuado.
        Terapia familiar.
        Derivación a nivel secundario según corresponda.`;
        setRiskStyle('high-risk');
    } else if ((majorRiskCount === 1 && intermediateRiskCount > 0) || minorRiskCount >= 4) {
        riskLevel = 'RIESGO INTERMEDIO';
        recommendation = `Estudio de familia y plan de intervención familiar consensuado.`;
        setRiskStyle('intermediate-risk');
    } else if (intermediateRiskCount === 1 || minorRiskCount <= 3) {
        riskLevel = 'RIESGO MENOR';
        recommendation = `Consejo breve.
        Consejería individual o familiar (con seguimiento).
        Guías anticipatorias.
        Otras intervenciones según necesidad.`;
        setRiskStyle('low-risk');
    }

    // Mostrar el resultado
    document.getElementById('risk-level').textContent = riskLevel;
    document.getElementById('recommendation').textContent = recommendation;
    document.getElementById('result').style.display = 'block';
}

function setRiskStyle(riskClass) {
    const resultDiv = document.getElementById('result');
    resultDiv.classList.remove('low-risk', 'intermediate-risk', 'high-risk');
    resultDiv.classList.add(riskClass);
}


function resetForm() {
    // Desmarcar todos los checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => checkbox.checked = false);

    // Ocultar el resultado
    document.getElementById('result').style.display = 'none';

    // Volver al inicio de la página
    window.scrollTo({ top: 0, behavior: 'smooth' });

}