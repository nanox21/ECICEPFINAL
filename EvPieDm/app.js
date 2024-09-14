

document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
 });
document.addEventListener('copy', function(e) {
    e.preventDefault();
 });





window.onload = function () {
    var mensaje = "Esta calculadora no reemplaza el criterio clínico y su uso es de responsabilidad del operador. Si está de acuerdo, presione 'Continuar'.";
    if (confirm(mensaje)) {
        alert("Has aceptado. Puedes continuar.");
    } else {
        alert("Has cancelado. No puedes continuar.");
        window.location.href = "https://www.google.com";
    }}

function evaluarRiesgo() {
    const ulceraPieOAmputacion = document.querySelector('input[name="ulceraPieOAmputacion"]:checked').value === 'si';
    const sensibilidadProtectora = document.querySelector('input[name="sensibilidadProtectora"]:checked').value === 'si';
    const EAP = document.querySelector('input[name="EAP"]:checked').value === 'si';
    const DEF = document.querySelector('input[name="DEF"]:checked').value === 'si';

    let resultado = "";
    let claseResultado = "";
    let proximaEvaluacion = new Date();

    if (ulceraPieOAmputacion) {
        resultado = 'Riesgo Máximo: Educación: 🥾 especial, 🚨 derivar a especialista.';
        claseResultado = 'maximo';
        proximaEvaluacion.setMonth(proximaEvaluacion.getMonth() + 1);
    } else if (!sensibilidadProtectora && !EAP && !DEF) {
        resultado = 'Riesgo Bajo: Educación sobre 🥾';
        claseResultado = 'bajo';
        proximaEvaluacion.setFullYear(proximaEvaluacion.getFullYear() + 1);
    } else if (!sensibilidadProtectora && !EAP && DEF) {
        resultado = 'Riesgo Bajo: Educación sobre 🥾';
        claseResultado = 'bajo';
        proximaEvaluacion.setFullYear(proximaEvaluacion.getFullYear() + 1);
    } else if (sensibilidadProtectora && !EAP && !DEF) {
        resultado = 'Riesgo Moderado: Educación Autocuidado y 🥾';
        claseResultado = 'moderado';
        proximaEvaluacion.setMonth(proximaEvaluacion.getMonth() + 6);
    } else if (EAP || (sensibilidadProtectora && (EAP || DEF))) {
        resultado = 'Riesgo Alto: Educación Uso 🥾 especial. 👀 Evaluar derivación a especialista';
        claseResultado = 'alto';
        proximaEvaluacion.setMonth(proximaEvaluacion.getMonth() + 3);
    }

    resultado += " Fecha de próxima evaluación: " + proximaEvaluacion.toLocaleDateString();

    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.textContent = resultado;
    resultadoDiv.className = claseResultado;
}

function limpiarFormulario() {
    document.getElementById("evaluacionForm").reset();
    const resultadoDiv = document.getElementById("resultado");
    resultadoDiv.textContent = "";
    resultadoDiv.className = "";
}
