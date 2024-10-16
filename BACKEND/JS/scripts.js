document.addEventListener('DOMContentLoaded', () => {
    const formularioEncuesta = document.getElementById('formularioEncuesta');
    const preguntasContainer = document.getElementById('preguntasContainer');
    const agregarPreguntaBtn = document.getElementById('agregarPreguntaBtn');

    function agregarPregunta() {
        const preguntaDiv = document.createElement('div');
        preguntaDiv.classList.add('pregunta');
        preguntaDiv.innerHTML = `
            <label>Pregunta:</label>
            <input type="text" placeholder="Ingrese la pregunta" required>
            <label>Tipo de respuesta:</label>
            <select onchange="mostrarOpciones(this)">
                <option value="texto">Texto corto</option>
                <option value="parrafo">Parrafo largo</option>
                <option value="multiple">Opción múltiple</option>
                <option value="checkbox">Casillas de verificación</option>
                <option value="calificacion">Calificación</option>
                <option value="fecha">Fecha</option>
            </select>
            <div class="opciones" style="display: none;">
                <label>Opciones:</label>
                <input type="text" placeholder="Opción 1" required>
                <input type="text" placeholder="Opción 2" required>
                <button type="button" class="agregarOpcionBtn">Agregar otra opción</button>
            </div>
            <button type="button" class="eliminarPreguntaBtn">Eliminar pregunta</button>
        `;
        preguntasContainer.appendChild(preguntaDiv);

        const agregarOpcionBtn = preguntaDiv.querySelector('.agregarOpcionBtn');
        agregarOpcionBtn.addEventListener('click', function() {
            agregarOpcion(preguntaDiv);
        });

        const eliminarPreguntaBtn = preguntaDiv.querySelector('.eliminarPreguntaBtn');
        eliminarPreguntaBtn.addEventListener('click', function() {
            preguntasContainer.removeChild(preguntaDiv);
        });
    }

    function agregarOpcion(preguntaDiv) {
        const opcionesDiv = preguntaDiv.querySelector('.opciones');
        const nuevaOpcion = document.createElement('input');
        nuevaOpcion.type = 'text';
        nuevaOpcion.placeholder = `Opción ${opcionesDiv.children.length + 1}`;
        
        const eliminarOpcionBtn = document.createElement('button');
        eliminarOpcionBtn.type = 'button';
        eliminarOpcionBtn.textContent = 'Eliminar opción';
        
        eliminarOpcionBtn.addEventListener('click', function() {
            opcionesDiv.removeChild(nuevaOpcion);
            opcionesDiv.removeChild(eliminarOpcionBtn);
        });

        opcionesDiv.appendChild(nuevaOpcion);
        opcionesDiv.appendChild(eliminarOpcionBtn);
    }

    window.mostrarOpciones = function(selectElement) {
        const opcionesDiv = selectElement.parentElement.querySelector('.opciones');
        opcionesDiv.style.display = selectElement.value === 'multiple' ? 'block' : 'none';
    };

    agregarPreguntaBtn.addEventListener('click', agregarPregunta);

    formularioEncuesta.addEventListener('submit', async (e) => {
        e.preventDefault();

        const titulo = document.getElementById('titulo').value;
        const descripcion = document.getElementById('descripcion').value;
        const preguntas = Array.from(preguntasContainer.getElementsByClassName('pregunta')).map(preguntaDiv => {
            const tipoRespuesta = preguntaDiv.querySelector('select').value;
            const opciones = Array.from(preguntaDiv.querySelectorAll('.opciones input')).map(input => input.value).filter(value => value !== '');

            return {
                questionText: preguntaDiv.querySelector('input[type="text"]').value,
                questionType: tipoRespuesta,
                options: tipoRespuesta === 'multiple' ? opciones : [] // Solo incluir opciones si es "Opción múltiple"
            };
        });

        const encuesta = {
            title: titulo,
            description: descripcion,
            questions: preguntas
        };

        try {
            const response = await fetch('http://localhost:5000/api/forms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(encuesta)
            });

            if (response.ok) {
                alert('Encuesta guardada correctamente');
                formularioEncuesta.reset();
                preguntasContainer.innerHTML = '';
            } else {
                alert('Error al guardar la encuesta');
            }
        } catch (error) {
            console.error('Error al conectar con el servidor:', error);
            alert('No se pudo conectar con el servidor');
        }
    });
});
