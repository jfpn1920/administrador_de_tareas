document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formTarea");
    const idInput = document.getElementById("idTarea");
    const titulo = document.getElementById("titulo");
    const descripcion = document.getElementById("descripcion");
    const asignadoA = document.getElementById("asignadoA");
    const estado = document.getElementById("estado");
    const tbody = document.getElementById("tablaTareas");
    const filtroEstado = document.getElementById("filtroEstado");
    const listaLogs = document.getElementById("listaLogs");
    // Estado en memoria (recuperado de localStorage)
    let tareas = JSON.parse(localStorage.getItem("tareas")) || [];
    let logs = JSON.parse(localStorage.getItem("logs")) || [];
    let editingId = null;
    // Guardar en localStorage
    function guardarTareas() {
        localStorage.setItem("tareas", JSON.stringify(tareas));
    }
    function guardarLogs() {
        localStorage.setItem("logs", JSON.stringify(logs));
    }
    // Crear y Actualizar tarea
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const data = {
            titulo: titulo.value.trim(),
            descripcion: descripcion.value.trim(),
            asignadoA: asignadoA.value.trim(),
            estado: estado.value,
        };
        if (!data.titulo || !data.descripcion) {
            alert("Por favor, complete título y descripción.");
            return;
        }
        if (editingId) {
            // Actualizar
            const idx = tareas.findIndex((t) => t.id === editingId);
            if (idx > -1) {
                tareas[idx] = { ...tareas[idx], ...data };
                registrarLog(`Tarea actualizada: ${data.titulo} (ID ${editingId})`, editingId, data.asignadoA || "Desconocido");
            }
        } else {
            // Crear
            const nueva = { id: Date.now(), ...data };
            tareas.push(nueva);
            registrarLog(`Tarea creada: ${nueva.titulo} (ID ${nueva.id})`, nueva.id, data.asignadoA || "Desconocido");
        }
        // Guardar y actualizar
        guardarTareas();
        form.reset();
        editingId = null;
        idInput.value = "";
        form.querySelector('button[type="submit"]').textContent = "Guardar Tarea";
        render();
    });
    // Renderizar tabla con filtro
    function render() {
        tbody.innerHTML = "";
        const filtro = filtroEstado.value;
        const lista = filtro === "todas" ? tareas : tareas.filter((t) => t.estado === filtro);
        lista.forEach((t) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${t.titulo}</td>
                <td>${t.descripcion}</td>
                <td>${t.asignadoA || "Nadie"}</td>
                <td>${capitalizar(t.estado)}</td>
                <td class="acciones">
                    <button class="editar">Editar</button>
                    <button class="eliminar">Eliminar</button>
                </td>
            `;
            // Eventos de editar y eliminar
            tr.querySelector(".editar").addEventListener("click", () => {
                editingId = t.id;
                idInput.value = t.id;
                titulo.value = t.titulo;
                descripcion.value = t.descripcion;
                asignadoA.value = t.asignadoA;
                estado.value = t.estado;
                form.querySelector('button[type="submit"]').textContent = "Actualizar Tarea";
            });
            tr.querySelector(".eliminar").addEventListener("click", () => {
                tareas = tareas.filter((x) => x.id !== t.id);
                guardarTareas();
                registrarLog(`Tarea eliminada: ${t.titulo} (ID ${t.id})`, t.id, t.asignadoA || "Desconocido");
                render();
            });
            tbody.appendChild(tr);
        });
        renderLogs();
    }
    function registrarLog(mensaje, tareaId, usuario) {
        const fecha = new Date().toLocaleString();
        const log = `[${fecha}] ${mensaje}`;
        logs.unshift(log);
        guardarLogs();
        renderLogs();
        // Enviar al servidor por AJAX
        fetch('../php/administrador_de_tareas.php', { // <-- ruta correcta
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `idTarea=${tareaId}&accion=${encodeURIComponent(mensaje)}&usuario=${encodeURIComponent(usuario)}`
        })
        .then(res => {
            if (!res.ok) throw new Error("HTTP error " + res.status);
            return res.json();
        })
        .then(data => {
            if (!data.success) {
                console.error("Error guardando historial:", data.message);
            }
        })
        .catch(err => console.error("Error AJAX:", err));
    }
    function renderLogs() {
        listaLogs.innerHTML = "";
        logs.forEach(log => {
            const li = document.createElement("li");
            li.textContent = log;
            listaLogs.appendChild(li);
        });
    }
    filtroEstado.addEventListener("change", render);
    function capitalizar(s) {
        return s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
    }
    render();
});
