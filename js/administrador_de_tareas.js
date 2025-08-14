document.addEventListener("DOMContentLoaded", () => {
    const taskForm = document.getElementById("taskForm");
    const taskTableBody = document.querySelector("#taskTable tbody");
    const filterStatus = document.getElementById("filterStatus");
    const logList = document.getElementById("logList");
    // Rutas corregidas para apuntar a la carpeta php
    const API = {
        registrarAccion: "../php/registrar_accion.php",
        obtenerHistorial: "../php/obtener_historial.php"
    };
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let logs = [];
    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    // Helper fetch con control de errores y parseo seguro
    async function fetchJSON(url, options = {}) {
        const res = await fetch(url, {
            ...options,
            headers: {
                "Accept": "application/json",
                ...(options.headers || {})
            }
        });
        const text = await res.text();
        if (!res.ok) {
            console.error(`HTTP ${res.status} en ${url}:`, text);
            throw new Error(`HTTP ${res.status} ${res.statusText}`);
        }
        try {
            return JSON.parse(text);
        } catch {
            console.error(`Respuesta no JSON desde ${url}:`, text);
            throw new Error("Respuesta no JSON");
        }
    }
    function renderLogs() {
        logList.innerHTML = "";
        logs.forEach(entry => {
            const li = document.createElement("li");
            li.textContent = entry;
            logList.appendChild(li);
        });
    }
    // Ahora también recibimos "estado"
    async function logAction(usuario, accion, estado) {
        const entry = `${new Date().toLocaleString()} - ${accion} [${estado}]`;
        logs.unshift(entry);
        renderLogs();
        try {
            const body = new URLSearchParams({ usuario, accion, estado }).toString();
            const data = await fetchJSON(API.registrarAccion, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body
            });
            if (data.status !== "ok") {
                console.error("Error guardando en BD:", data);
            }
        } catch (err) {
            console.error("Error de conexión al guardar log:", err);
        }
    }
    async function loadLogs() {
        try {
            const data = await fetchJSON(API.obtenerHistorial);
            logs = data.map(l => `${l.fecha} - ${l.usuario}: ${l.accion} [${l.estado}]`);
            renderLogs();
        } catch (err) {
            console.error("Error cargando historial:", err);
        }
    }
    function renderTasks() {
        taskTableBody.innerHTML = "";
        const filter = filterStatus.value;
        tasks
            .filter(task => filter === "Todos" || task.status === filter)
            .forEach((task, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${task.title}</td>
                    <td>${task.user}</td>
                    <td>${task.status}</td>
                    <td>
                        <button onclick="editTask(${index})">Editar</button>
                        <button onclick="deleteTask(${index})">Eliminar</button>
                    </td>
                `;
                taskTableBody.appendChild(row);
            });
    }
    taskForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = document.getElementById("taskId").value;
        const title = document.getElementById("taskTitle").value;
        const user = document.getElementById("taskUser").value;
        const status = document.getElementById("taskStatus").value;
        if (id) {
            tasks[id] = { title, user, status };
            await logAction(user, `Tarea actualizada: "${title}"`, status);
        } else {
            tasks.push({ title, user, status });
            await logAction(user, `Tarea creada: "${title}"`, status);
        }
        saveTasks();
        renderTasks();
        taskForm.reset();
        document.getElementById("taskId").value = "";
    });
    filterStatus.addEventListener("change", renderTasks);
    window.editTask = function(index) {
        const task = tasks[index];
        document.getElementById("taskId").value = index;
        document.getElementById("taskTitle").value = task.title;
        document.getElementById("taskUser").value = task.user;
        document.getElementById("taskStatus").value = task.status;
    };
    window.deleteTask = async function(index) {
        const t = tasks[index];
        await logAction(t.user, `Tarea eliminada: "${t.title}"`, t.status);
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    };
    // Inicializar
    renderTasks();
    loadLogs();
});