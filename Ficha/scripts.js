console.log('jsPDF disponible:', typeof window.jspdf !== 'undefined');
console.log('jsPDF.jsPDF disponible:', typeof window.jspdf?.jsPDF !== 'undefined');

document.addEventListener("DOMContentLoaded", function() {
    console.log("Inicializando eventos...");
    
    // Inicializar botones
    const botones = {
        calcular: document.getElementById("calcularRiesgoBtn"),
        limpiar: document.getElementById("limpiarFormularioBtn"),
        generarPDF: document.getElementById("generarPDFBtn")
    };

    // Asignar eventos a los botones
    if (botones.calcular) {
        botones.calcular.addEventListener("click", function(e) {
            e.preventDefault();
            console.log("Calculando riesgo...");
            calcularRiesgo();
        });
    }

    if (botones.limpiar) {
        botones.limpiar.addEventListener("click", function(e) {
            e.preventDefault();
            console.log("Limpiando formulario...");
            limpiarFormulario();
        });
    }

    if (botones.generarPDF) {
        botones.generarPDF.addEventListener("click", function(e) {
            e.preventDefault();
            console.log("Generando PDF...");
            generarPDF();
        });
    }

    // Inicializar botones de agregar fila
    document.querySelectorAll(".agregarFilaBtn").forEach(btn => {
        btn.addEventListener("click", function(e) {
            e.preventDefault();
            const tabla = this.getAttribute("data-tabla");
            const columnas = parseInt(this.getAttribute("data-columnas"), 10);
            console.log(`Agregando fila a tabla: ${tabla}`);
            agregarFila(tabla, columnas);
        });
    });
});

// Función para calcular riesgo
function calcularRiesgo() {
    try {
        let totalPuntos = Array.from(document.querySelectorAll('.risk:checked'))
            .reduce((sum, checkbox) => sum + parseInt(checkbox.value, 10), 0);

        const resultadoDiv = document.getElementById("resultado");
        if (!resultadoDiv) throw new Error("Elemento resultado no encontrado");

        resultadoDiv.style.display = "block";
        resultadoDiv.className = "result";

        let nivelesRiesgo = [
            { limite: 3, mensaje: "Sin Riesgo (0-3 puntos)", clase: "low-risk" },
            { limite: 6, mensaje: "Riesgo Leve (4-6 puntos)", clase: "intermediate-risk" },
            { limite: 11, mensaje: "Riesgo Moderado (7-11 puntos)", clase: "moderate-risk" },
            { limite: Infinity, mensaje: "Riesgo Grave (>11 puntos)", clase: "high-risk" }
        ];

        let nivel = nivelesRiesgo.find(n => totalPuntos <= n.limite);
        resultadoDiv.innerHTML = nivel.mensaje;
        resultadoDiv.classList.add(nivel.clase);
        
        console.log("Riesgo calculado:", nivel.mensaje);
    } catch (error) {
        console.error("Error al calcular riesgo:", error);
        alert("Error al calcular el riesgo");
    }
}

// Función para limpiar formulario
function limpiarFormulario() {
    try {
        // Limpiar todos los inputs
        document.querySelectorAll('input, textarea, select').forEach(elemento => {
            if (elemento.type === 'checkbox' || elemento.type === 'radio') {
                elemento.checked = false;
            } else {
                elemento.value = '';
            }
        });

        // Limpiar tablas
        ['familiaTable', 'planTrabajo'].forEach(tablaId => {
            const tabla = document.getElementById(tablaId);
            if (tabla && tabla.querySelector('tbody')) {
                tabla.querySelector('tbody').innerHTML = '';
            }
        });

        // Limpiar resultado
        const resultado = document.getElementById('resultado');
        if (resultado) {
            resultado.innerHTML = '';
            resultado.className = 'result';
            resultado.style.display = 'none';
        }

        console.log("Formulario limpiado correctamente");
    } catch (error) {
        console.error("Error al limpiar formulario:", error);
        alert("Error al limpiar el formulario");
    }
}

// Función para agregar fila
function agregarFila(tablaId, numColumnas) {
    try {
        const tabla = document.getElementById(tablaId);
        if (!tabla) throw new Error(`Tabla ${tablaId} no encontrada`);

        const tbody = tabla.querySelector("tbody");
        if (!tbody) throw new Error("Tbody no encontrado");

        const fila = tbody.insertRow();
        
        for (let i = 0; i < numColumnas; i++) {
            const celda = fila.insertCell();
            const input = document.createElement("input");
            input.type = "text";
            input.className = "form-control";
            celda.appendChild(input);
        }

        // Agregar botón eliminar
        const celdaEliminar = fila.insertCell();
        const btnEliminar = document.createElement("button");
        btnEliminar.innerHTML = "❌";
        btnEliminar.className = "btn btn-danger btn-sm";
        btnEliminar.onclick = () => fila.remove();
        celdaEliminar.appendChild(btnEliminar);

        console.log(`Fila agregada a tabla: ${tablaId}`);
    } catch (error) {
        console.error("Error al agregar fila:", error);
        alert("Error al agregar fila a la tabla");
    }
}

window.jsPDF = window.jspdf.jsPDF;

// Función para agregar encabezado
function agregarEncabezado(doc, pageWidth, pageNumber) {
    // Se mantiene sin modificar el encabezado
    const offset = 5; // Encabezado "subido" 5 mm
    doc.setFillColor(255, 255, 255);
    doc.rect(15, offset, pageWidth - 30, 40, 'F');
    
    const yPos = 15 + offset;
    
    try {
        doc.addImage('logo.png', 'PNG', 15, yPos, 25, 25);
        doc.addImage('logocesfam.png', 'PNG', pageWidth - 40, yPos, 25, 25);
        
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('CESFAM LOS ÁLAMOS', pageWidth/2, yPos + 25, {align: 'center'});
        
        doc.setFontSize(12);
        doc.text('FICHA DE SALUD FAMILIAR', pageWidth/2, yPos + 35, {align: 'center'});
    } catch (error) {
        console.warn('Error al cargar logos:', error);
    }

    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(0.5);
    doc.line(15, yPos + 40, pageWidth - 15, yPos + 40);
}

// Función para agregar pie de página
function agregarPiePagina(doc, pageWidth, pageHeight, pageNumber, totalPages) {
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(0.5);
    doc.line(15, pageHeight - 20, pageWidth - 15, pageHeight - 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    
    doc.text(`Página ${pageNumber} de ${totalPages}`, pageWidth - 15, pageHeight - 10, { align: 'right' });
    
    doc.text('CESFAM Los Álamos - Documento Confidencial', pageWidth/2, pageHeight - 10, {align: 'center'});
    
    doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 15, pageHeight - 10);
    
    doc.setFontSize(6);
    doc.text('mandrake', pageWidth/2, pageHeight - 5, {align: 'center'});
}

// Función para generar el PDF
function generarPDF() {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'p',
            unit: 'mm',
            format: 'letter'
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        let yPos = 50; // Espacio para el encabezado

        // Página 1: Información básica, factores protectores, riesgos y evaluación
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('1. IDENTIFICACIÓN', 15, yPos);
        
        yPos += 10;
        doc.setFontSize(11);
        const datosBasicos = {
            'Sector': document.getElementById('sector')?.value || '',
            'Nombre': document.getElementById('nombre')?.value || '',
            'Edad': document.getElementById('edad')?.value || '',
            'Dirección': document.getElementById('direccion')?.value || '',
            'Teléfono': document.getElementById('telefono')?.value || '',
            'Fecha Aplicación': document.getElementById('fecha_aplicacion')?.value || '',
            'RSH': document.getElementById('registroSocial')?.value || '',
            'Tipo Familia': formatearTexto(document.getElementById('tiposDeFamilia')?.value || ''),
            'Ciclo Vital': formatearTexto(document.getElementById('cicloVitalFamiliar')?.value || '')
        };

        Object.entries(datosBasicos).forEach(([key, value]) => {
            doc.setFont('helvetica', 'bold');
            doc.text(`${key}:`, 20, yPos);
            doc.setFont('helvetica', 'normal');
            doc.text(value, 70, yPos);
            yPos += 7;
        });

        // Factores Protectores
        yPos += 10;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('2. FACTORES PROTECTORES', 15, yPos);
        
        yPos += 10;
        doc.setFontSize(11);
        const factoresProtectores = {
            'Trabajo Estable': document.querySelector('input[name="trabajo_estable"]:checked')?.value || 'No especificado',
            'Vivienda Adecuada': document.querySelector('input[name="vivienda_adecuada"]:checked')?.value || 'No especificado',
            'Necesidades Básicas Cubiertas': document.querySelector('input[name="necesidades_basicas"]:checked')?.value || 'No especificado',
            'Vivienda Propia': document.querySelector('input[name="vivienda_propia"]:checked')?.value || 'No especificado',
            'Participación Social': document.querySelector('input[name="participacion_social"]:checked')?.value || 'No especificado',
            'Comunicación Funcional': document.querySelector('input[name="comunicacion_funcional"]:checked')?.value || 'No especificado'
        };

        Object.entries(factoresProtectores).forEach(([key, value]) => {
            doc.setFont('helvetica', 'bold');
            doc.text(`${key}:`, 20, yPos);
            doc.setFont('helvetica', 'normal');
            doc.text(value, 100, yPos);
            yPos += 7;
        });

        // Factores de Riesgo
        yPos += 10;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('3. FACTORES DE RIESGO IDENTIFICADOS', 15, yPos);
        
        yPos += 10;
        doc.setFontSize(11);
        
        const riesgosSeleccionados = Array.from(document.querySelectorAll('.risk:checked')).map(
            checkbox => checkbox.parentElement.textContent.trim()
        );

        if (riesgosSeleccionados.length > 0) {
            riesgosSeleccionados.forEach(riesgo => {
                doc.text('•', 20, yPos);
                doc.setFont('helvetica', 'normal');
                doc.text(riesgo, 25, yPos);
                yPos += 7;
            });
        } else {
            doc.setFont('helvetica', 'normal');
            doc.text('No se identificaron factores de riesgo', 20, yPos);
        }

        // Resultado del Cálculo de Riesgo
        yPos += 10;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('4. EVALUACIÓN DE RIESGO', 15, yPos);
        
        yPos += 10;
        doc.setFontSize(11);
        const resultadoRiesgo = document.getElementById('resultado')?.textContent || 'No calculado';
        doc.setFont('helvetica', 'normal');
        doc.text(resultadoRiesgo, 20, yPos);

        // Página 2: Integrantes de la familia
        doc.addPage();
        yPos = 20;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('5. INTEGRANTES DE LA FAMILIA', 15, yPos);

        // Se baja la tabla 3 cm (30 mm) más: startY = yPos + 40
        doc.autoTable({
            html: '#familiaTable',
            startY: yPos + 40,
            theme: 'grid',
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: 255,
                fontSize: 10,
                fontStyle: 'bold'
            },
            styles: {fontSize: 8}
        });

        // Página 3: Plan de trabajo
        doc.addPage();
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('6. PLAN DE TRABAJO', 15, 20);

        // Se baja la tabla 3 cm (30 mm) más: startY = 60
        doc.autoTable({
            html: '#planTrabajo',
            startY: 60,
            theme: 'grid',
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: 255,
                fontSize: 10,
                fontStyle: 'bold'
            },
            styles: {fontSize: 9}
        });

        // Página 4: Genograma
        doc.addPage();
        // Título "GENOGRAMA" al inicio de la página, bajado 30 mm (es decir, en y = 50)
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('GENOGRAMA', pageWidth/2, 50, { align: 'center' });

        // Agregar encabezados y pies de página a todas las páginas
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            agregarEncabezado(doc, pageWidth, i);
            agregarPiePagina(doc, pageWidth, pageHeight, i, totalPages);
        }

        // Guardar PDF
        const fileName = `Ficha_Familiar_${new Date().toISOString().slice(0,10)}.pdf`;
        doc.save(fileName);
        console.log('PDF generado exitosamente');

    } catch (error) {
        console.error('Error al generar PDF:', error);
        alert('Error al generar el PDF: ' + error.message);
    }
}

// Asegurar que el evento está correctamente asociado
document.addEventListener('DOMContentLoaded', function() {
    const generarPDFBtn = document.getElementById('generarPDFBtn');
    if (generarPDFBtn) {
        generarPDFBtn.addEventListener('click', generarPDF);
        console.log('Evento de generar PDF asociado');
    } else {
        console.error('Botón de generar PDF no encontrado');
    }
});

function formatearTexto(texto) {
    const mapeo = {
        "nuclearSimple": "Nuclear Simple",
        "nuclearBiparental": "Nuclear Biparental",
        "familia": "Familia Extensa",
        "familiaCompuesta": "Familia Compuesta",
        "familiuaUnipersonal": "Familia Unipersonal",
        "nuclearReconstiuida": "Familiar Nuclear Reconstituida",
        "formacion": "Formación / Pareja",
        "crianzaInicial": "Crianza Inicial",
        "conPreescolares": "Con Hijos Preescolares",
        "conEscolares": "Con Hijos Escolares",
        "plataforma": "Plataforma de Lanzamiento",
        "edadMedia": "Edad Media",
        "edadAnciana": "Edad Anciana"
    };
    return mapeo[texto.trim()] || "No seleccionado";
}