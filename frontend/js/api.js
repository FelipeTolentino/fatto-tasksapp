const API = "https://fatto-tasksapp-backend.onrender.com/tarefas";

async function listTasks() {
  return fetch(API).then(res => res.json());
}

async function createTask(data) {
  return fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

async function editTask(id, data) {
  return fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

async function deleteTask(id) {
  return fetch(`${API}/${id}`, { method: "DELETE" });
}

async function saveTasksOrder(tasks) {
  return fetch(`${API}/reorder`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tasks })
  });
}