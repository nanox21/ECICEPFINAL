window.onload = function () {
    // Comprobar si la alerta ya se mostró anteriormente
    if (!localStorage.getItem('alertaMostrada')) {
        var mensaje = "Esta calculadora no reemplaza el criterio clínico y su uso es de responsabilidad del operador. Si está de acuerdo, presione 'Continuar'.";
        
        if (confirm(mensaje)) {
            alert("Has aceptado. Puedes continuar.");
            // Guardar en localStorage que la alerta ya se mostró
            localStorage.setItem('alertaMostrada', 'true');
        } else {
            alert("Has cancelado. No puedes continuar.");
            window.location.href = "https://www.google.com";
        }
    }
};

document.addEventListener('DOMContentLoaded', function () {
    const checkboxes = [
        { checkbox: 'anemia', options: 'anemia-options' },
        { checkbox: 'arritmia', options: 'arritmia-options' },
        { checkbox: 'artritis', options: 'artritis-options' },
        { checkbox: 'artrosis', options: 'artrosis-options' },
        { checkbox: 'catarata', options: 'catarata-options' },
        { checkbox: 'ceguera', options: 'ceguera-options' },
        { checkbox: 'alcohol', options: 'alcohol-options' },
        { checkbox: 'drogas', options: 'drogas-options' },
        { checkbox: 'demencia', options: 'demencia-options' },
        { checkbox: 'depresion', options: 'depresion-options' },
        { checkbox: 'depresion-psicosis', options: 'depresion-psicosis-options' },
        { checkbox: 'depresion-leve', options: 'depresion-leve-options' },
        { checkbox: 'diabetes', options: 'diabetes-options' },
        { checkbox: 'socioeconomicas', options: 'socioeconomicas-options' },
        { checkbox: 'dislipidemias', options: 'dislipidemias-options' },
        { checkbox: 'dolor-neuropatico', options: 'dolor-neuropatico-options' },
        { checkbox: 'cerebrovascular', options: 'cerebrovascular-options' },
        { checkbox: 'enfermedad-hepatica-checkbox', options: 'enfermedad-hepatica-options' },
        { checkbox: 'enfermedad-renal-checkbox', options: 'enfermedad-renal-options' },
        { checkbox: 'enfermedad-renal-avanzada-checkbox', options: 'enfermedad-renal-avanzada-options' },
        { checkbox: 'epoc-checkbox', options: 'epoc-options' },
        { checkbox: 'enfermedades-cardiovasculares-checkbox', options: 'enfermedades-cardiovasculares-options' },
        { checkbox: 'enteritis-checkbox', options: 'enteritis-options' },
        { checkbox: 'epilepsia-checkbox', options: 'epilepsia-options' },
        { checkbox: 'esclerosis-multiple-checkbox', options: 'esclerosis-multiple-options' },
        { checkbox: 'esquizofrenia-checkbox', options: 'esquizofrenia-options' },
        { checkbox: 'fibrilacion-checkbox', options: 'fibrilacion-options' },
        { checkbox: 'funcion-limitada-checkbox', options: 'funcion-limitada-options' },
        { checkbox: 'glaucoma-checkbox', options: 'glaucoma-options' },
        { checkbox: 'hipertension-checkbox', options: 'hipertension-options' },
        { checkbox: 'hipertrofia-prostatica-checkbox', options: 'hipertrofia-prostatica-options' },
        { checkbox: 'hiperuricemia-checkbox', options: 'hiperuricemia-options' },
        { checkbox: 'vih-sida-checkbox', options: 'vih-sida-options' },
        { checkbox: 'insuficiencia-cardiaca-checkbox', options: 'insuficiencia-cardiaca-options' },
        { checkbox: 'isquemia-cerebral-checkbox', options: 'isquemia-cerebral-options' },
        { checkbox: 'lupus-checkbox', options: 'lupus-options' },
        { checkbox: 'malignidad-checkbox', options: 'malignidad-options' },
        { checkbox: 'maltrato-checkbox', options: 'maltrato-options' },
        { checkbox: 'obesidad-checkbox', options: 'obesidad-options' },
        { checkbox: 'otros-trastornos-checkbox', options: 'otros-trastornos-options' },
        { checkbox: 'parkinsonismo-checkbox', options: 'parkinsonismo-options' },
        { checkbox: 'retraso-mental-checkbox', options: 'retraso-mental-options' },
        { checkbox: 'tabaquismo-checkbox', options: 'tabaquismo-options' },
        { checkbox: 'trastorno-personalidad-checkbox', options: 'trastorno-personalidad-options' },
        { checkbox: 'trastornos-alimentarios-checkbox', options: 'trastornos-alimentarios-options' },
        { checkbox: 'otros-defectos-de-la-coagulacion-checkbox', options: 'otros-defectos-de-la-coagulacion-options' },
        { checkbox: 'trastornos-sueño-checkbox', options: 'trastornos-sueño-options' },
        { checkbox: 'trastornos-tiroideos-checkbox', options: 'trastornos-tiroideos-options' },
        { checkbox: 'tuberculosis-checkbox', options: 'tuberculosis-options' },
        { checkbox: 'ulcera-cronica-checkbox', options: 'ulcera-cronica-options' },
        { checkbox: 'asma', options: 'asma-options' },
        { checkbox: 'hipoacusia-checkbox', options: 'hipoacusia-options' },
        { checkbox: 'ansiedad-checkbox', options: 'ansiedad-options' }
    ];

    // Función para manejar la visibilidad de las opciones desplegables
    function manejarVisibilidadOpciones(checkboxElement, optionsElement) {
        if (checkboxElement.checked) {
            optionsElement.classList.remove('hidden');
        } else {
            optionsElement.classList.add('hidden');
        }
    }

    // Función para actualizar el total de puntos y mostrar el resultado
    function actualizarTotal() {
        let total = 0;

        checkboxes.forEach(function (item) {
            const checkboxElement = document.getElementById(item.checkbox);
            const selectElement = document.getElementById(item.options).querySelector('select');

            // Verificar si el checkbox está seleccionado y una opción del desplegable está seleccionada
            if (checkboxElement && checkboxElement.checked && selectElement && selectElement.value !== "") {
                if (['diabetes', 'demencia','depresion-psicosis','depresion','cerebrovascular', 'enfermedades-cardiovasculares-checkbox', 'enfermedad-renal-avanzada-checkbox', 'funcion-limitada-checkbox'].includes(item.checkbox)) {
                    total += 2; // Estos checkboxes valen 2 puntos
                } else {
                    total += 1; // Los demás valen 1 punto
                }
            }
        });

        // Mostrar el total
        document.getElementById('total').textContent = total;

        // Mostrar el resultado del riesgo
        const resultadoElement = document.getElementById('resultado');
        if (total === 0) {
            resultadoElement.textContent = "G0 Sin Riesgo";
            resultadoElement.style.color = "green";
            resultadoElement.style.backgroundColor = "black";
        } else if (total === 1) {
            resultadoElement.textContent = "G1 Riesgo Leve";
            resultadoElement.style.color = "yellow";
            resultadoElement.style.backgroundColor = "black";
        } else if (total >= 2 && total <= 4) {
            resultadoElement.textContent = "G2 Riesgo Moderado";
            resultadoElement.style.color = "orange";
            resultadoElement.style.backgroundColor = "black";
        } else if (total >= 5) {
            resultadoElement.textContent = "G3 Riesgo Alto";
            resultadoElement.style.color = "red";
            resultadoElement.style.backgroundColor = "black";
        }
    }

    // Asignar eventos para manejar la visibilidad y actualizar el total
    checkboxes.forEach(function (item) {
        const checkboxElement = document.getElementById(item.checkbox);
        const optionsElement = document.getElementById(item.options);
        const selectElement = optionsElement.querySelector('select');

        if (checkboxElement && optionsElement) {
            checkboxElement.addEventListener('change', function () {
                manejarVisibilidadOpciones(checkboxElement, optionsElement);
                actualizarTotal();
            });

            if (selectElement) {
                selectElement.addEventListener('change', function () {
                    actualizarTotal();
                });
            }
        }
    });

    // Función para limpiar todos los checkboxes y selects
    function limpiarFormulario() {
        checkboxes.forEach(function (item) {
            const checkboxElement = document.getElementById(item.checkbox);
            const optionsElement = document.getElementById(item.options);
            const selectElement = optionsElement.querySelector('select');

            if (checkboxElement) {
                checkboxElement.checked = false;
            }

            if (selectElement) {
                selectElement.value = ""; // Restablece el valor del select
            }

            if (optionsElement) {
                optionsElement.classList.add('hidden'); // Ocultar las opciones adicionales
            }
        });

        // Restablecer el total y el resultado
        document.getElementById('total').textContent = 0;
        const resultadoElement = document.getElementById('resultado');
        resultadoElement.textContent = "G0 Sin Riesgo";
        resultadoElement.style.color = "green";
        resultadoElement.style.backgroundColor = "black";
    }

    // Asignar el evento de clic al botón "LIMPIAR"
    document.getElementById('limpiar').addEventListener('click', function () {
        limpiarFormulario();
    });

    // Inicializar el total al cargar la página
    actualizarTotal();
});
