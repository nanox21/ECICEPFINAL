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
    doc.text(' powered by mandrake:nanox21@gmail.com ', pageWidth/2, pageHeight - 5, {align: 'center'});
}

// Variable global para almacenar la imagen del genograma
let genogramaDataUrl = null;

// Nueva variable global para almacenar la imagen del ecomapa
let ecomapaDataUrl = null;

document.addEventListener("DOMContentLoaded", function() {
    console.log("Inicializando eventos...");
    
    // Inicializar elementos de genograma
    const genogramFile = document.getElementById("genogramFile");
    const previewGenogramBtn = document.getElementById("previewGenogramBtn");
    const clearGenogramBtn = document.getElementById("clearGenogramBtn");
    const previewContainer = document.getElementById("previewContainer");
    const imagePreview = document.getElementById("imagePreview");
    
    // Inicializar elementos de ecomapa (nuevo)
    const ecomapaFile = document.getElementById("ecomapaFile");
    const previewEcomapaBtn = document.getElementById("previewEcomapaBtn");
    const clearEcomapaBtn = document.getElementById("clearEcomapaBtn");
    const previewEcomapaContainer = document.getElementById("previewEcomapaContainer");
    const ecomapaPreview = document.getElementById("ecomapaPreview");
    
    // Evento para previsualizar el genograma
    if (previewGenogramBtn) {
        previewGenogramBtn.addEventListener("click", function() {
            const file = genogramFile.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    genogramaDataUrl = event.target.result;
                    imagePreview.src = genogramaDataUrl;
                    previewContainer.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                alert("Por favor, selecciona una imagen primero.");
            }
        });
    }
    
    // Evento para eliminar el genograma
    if (clearGenogramBtn) {
        clearGenogramBtn.addEventListener("click", function() {
            genogramaDataUrl = null;
            imagePreview.src = "";
            genogramFile.value = "";
            previewContainer.style.display = 'none';
        });
    }
    
    // Evento para previsualizar el ecomapa (nuevo)
    if (previewEcomapaBtn) {
        previewEcomapaBtn.addEventListener("click", function() {
            const file = ecomapaFile.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    ecomapaDataUrl = event.target.result;
                    ecomapaPreview.src = ecomapaDataUrl;
                    previewEcomapaContainer.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                alert("Por favor, selecciona una imagen primero.");
            }
        });
    }
    
    // Evento para eliminar el ecomapa (nuevo)
    if (clearEcomapaBtn) {
        clearEcomapaBtn.addEventListener("click", function() {
            ecomapaDataUrl = null;
            ecomapaPreview.src = "";
            ecomapaFile.value = "";
            previewEcomapaContainer.style.display = 'none';
        });
    }
    
    // También puedes reaccionar al cambio del archivo directamente
    if (genogramFile) {
        genogramFile.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    genogramaDataUrl = event.target.result;
                    imagePreview.src = genogramaDataUrl;
                    previewContainer.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Cambio de archivo del ecomapa (nuevo)
    if (ecomapaFile) {
        ecomapaFile.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    ecomapaDataUrl = event.target.result;
                    ecomapaPreview.src = ecomapaDataUrl;
                    previewEcomapaContainer.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Asociar el evento al botón de generar PDF
    const generarPDFBtn = document.getElementById('generarPDFBtn');
    if (generarPDFBtn) {
        generarPDFBtn.addEventListener('click', generarPDF);
        console.log('Evento de generar PDF asociado');
    } else {
        console.error('Botón de generar PDF no encontrado');
    }
});

// Modificar la función generarPDF para incluir el genograma y el ecomapa
function generarPDF() {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'letter'
        });

        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        let yPos = 50;

        function addHeaderAndFooter(doc, pageNumber, totalPages) {
            agregarEncabezado(doc, pageWidth, pageNumber);
            agregarPiePagina(doc, pageWidth, pageHeight, pageNumber, totalPages);
        }

        // Página 1: Información básica, factores protectores, riesgos y evaluación
        addHeaderAndFooter(doc, 1, 6); // Encabezado y pie de página para la página 1
        yPos = 50; // Reiniciar la posición Y después del encabezado
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
            'Observaciones': document.getElementById('observaciones')?.value || '',
            'VDI Realizada por': document.getElementById('instrumento')?.value || '',
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

        // Página 2: Factores de Riesgo y Evaluación
        doc.addPage('landscape'); // Añadir nueva página en horizontal
        addHeaderAndFooter(doc, 2, 6); // Encabezado y pie de página para la página 2
        yPos = 50; // Reiniciar la posición Y después del encabezado

        // Factores de Riesgo
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

        // Página 3: Integrantes de la familia
        doc.addPage('landscape'); // Añadir nueva página en horizontal
        addHeaderAndFooter(doc, 3, 6); // Encabezado y pie de página para la página 3
        yPos = 50; // Reiniciar la posición Y después del encabezado
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('5. INTEGRANTES DE LA FAMILIA', 15, yPos);

        /**
         * Extracts data from a table, handling input elements.
         * @param {string} tableId The ID of the table.
         * @returns {{headers: string[], body: string[][]}} An object containing the table headers and data.
         */
        function getTableData(tableId) {
            const table = document.getElementById(tableId);
            if (!table) {
                console.error(`Table ${tableId} not found`);
                return { headers: [], body: [] };
            }

            const headers = Array.from(table.querySelectorAll('th')).map(th => th.textContent.trim());
            const body = [];

            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const rowData = [];
                const cells = row.querySelectorAll('td');
                cells.forEach(cell => {
                    // Omitir la celda que contiene el botón eliminar
                    if (cell.querySelector('button')) return;
                    let cellValue = '';
                    // Buscar input o textarea para extraer el valor
                    const input = cell.querySelector('input, textarea');
                    if (input) {
                        cellValue = input.value.trim(); // Extraer valor del input o textarea
                    } else {
                        cellValue = cell.textContent.trim(); // Extraer contenido de texto
                    }
                    rowData.push(cellValue);
                });
                body.push(rowData);
            });

            return { headers, body };
        }

        const familiaTableData = getTableData('familiaTable');
        if (familiaTableData.body.length > 0) {
            doc.autoTable({
                head: [familiaTableData.headers],
                body: familiaTableData.body,
                startY: yPos + 40,
                theme: 'grid',
                headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: 255,
                    fontSize: 10,
                    fontStyle: 'bold'
                },
                styles: { fontSize: 8, textColor: [0, 0, 0] }  // Se agrega textColor para asegurar que el texto se imprima en negro
            });
        } else {
            console.error('No data found in familiaTable');
        }

        // Página 4: Plan de trabajo
        doc.addPage('landscape'); // Añadir nueva página en horizontal
        addHeaderAndFooter(doc, 4, 6); // Encabezado y pie de página para la página 4
        yPos = 50; // Reiniciar la posición Y después del encabezado
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text('6. PLAN DE TRABAJO', 15, 20);

        const planTrabajoData = getTableData('planTrabajo');
        if (planTrabajoData.body.length > 0) {
            doc.autoTable({
                head: [planTrabajoData.headers],
                body: planTrabajoData.body,
                startY: 60,
                theme: 'grid',
                headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: 255,
                    fontSize: 10,
                    fontStyle: 'bold'
                },
                styles: { fontSize: 9, textColor: [0, 0, 0] }  // Se agrega textColor para asegurar que el texto se imprima en negro
            });
        } else {
            console.error('No data found in planTrabajo');
        }

        // Página 5: Genograma
        doc.addPage('landscape'); // Añadir nueva página en horizontal
        addHeaderAndFooter(doc, 5, 6); // Encabezado y pie de página para la página 5
        yPos = 50; // Reiniciar la posición Y después del encabezado
        // Título "GENOGRAMA" al inicio de la página, bajado 30 mm (es decir, en y = 50)
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('GENOGRAMA', pageWidth/2, 50, { align: 'center' });

        // Agregar la imagen del genograma si existe
        if (genogramaDataUrl) {
            try {
                // Calcular dimensiones para que la imagen se ajuste a la página
                const maxWidth = pageWidth - 40; // Margen de 20mm a cada lado
                const maxHeight = pageHeight - 80; // Espacio para título y pie de página
                
                doc.addImage(
                    genogramaDataUrl, 
                    'JPEG', 
                    20, // X position
                    60, // Y position (debajo del título)
                    maxWidth, 
                    maxHeight, 
                    undefined, 
                    'FAST'
                );
            } catch (error) {
                console.error('Error al añadir imagen del genograma al PDF:', error);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(12);
                doc.text('Error al cargar la imagen del genograma', pageWidth/2, 100, { align: 'center' });
            }
        } else {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(12);
            doc.text('No se ha cargado ninguna imagen de genograma', pageWidth/2, 100, { align: 'center' });
        }

        // Página 6: Ecomapa
        doc.addPage('landscape'); // Añadir nueva página en horizontal
        addHeaderAndFooter(doc, 6, 6); // Encabezado y pie de página para la página 6
        yPos = 50; // Reiniciar la posición Y después del encabezado
        // Título "ECOMAPA" al inicio de la página, bajado 30 mm (es decir, en y = 50)
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('ECOMAPA', pageWidth/2, 50, { align: 'center' });

        // Agregar la imagen del ecomapa si existe
        if (ecomapaDataUrl) {
            try {
                // Calcular dimensiones para que la imagen se ajuste a la página
                const maxWidth = pageWidth - 40; // Margen de 20mm a cada lado
                const maxHeight = pageHeight - 80; // Espacio para título y pie de página
                
                doc.addImage(
                    ecomapaDataUrl, 
                    'JPEG', 
                    20, // X position
                    60, // Y position (debajo del título)
                    maxWidth, 
                    maxHeight, 
                    undefined, 
                    'FAST'
                );
            } catch (error) {
                console.error('Error al añadir imagen del ecomapa al PDF:', error);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(12);
                doc.text('Error al cargar la imagen del ecomapa', pageWidth/2, 100, { align: 'center' });
            }
        } else {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(12);
            doc.text('No se ha cargado ninguna imagen de ecomapa', pageWidth/2, 100, { align: 'center' });
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
