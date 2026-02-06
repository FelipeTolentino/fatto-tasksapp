let tasks = [];
let taskInEditing = null;

function formatCurrency(value) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("pt-BR");
}

async function load() {
  tasks = await listTasks();
  render();
}

function render() {
  const container = document.getElementById("tasks-list");
  container.innerHTML = "";

  let total = 0;

  tasks.forEach(task => {
    total += task.cost;

    container.appendChild(renderTask(task));
  });

  document.getElementById("total").innerText = 
    "Total: " + formatCurrency(total);

  initDragAndDrop();
}

function renderTask(task) {
  const card = document.createElement("div");

  card.dataset.id = task.id;
  let cardClasses = `
    task-card
    px-5
    py-2
    bg-white
    rounded-4xl
    grid
    grid-cols-[2fr_1fr_1fr_1fr]
    items-center
    gap-4
    cursor-grab
  `

  if (task.cost >= 1000) {
    cardClasses += " bg-yellow-100 hover:bg-yellow-200"
  }
  else {
    cardClasses += " hover:bg-gray-300"
  }

  card.className = cardClasses;

  card.innerHTML = `
    <span class="truncate">ID: ${task.id} - ${task.name}</span>
    <span class="">${formatCurrency(task.cost)}</span>
    <span class="">${formatDate(task.deadline)}</span>

  <div class="flex gap-3 justify-end">
    <button onclick="openEditingModal(${task.id})"
      class="bg-orange-300 px-3 py-1 rounded-2xl hover:bg-orange-400 transition">
      Editar
    </button>
    <button onclick="openConfirmModal(${task.id})"
      class="bg-red-400 text-white px-3 py-0 rounded-2xl hover:bg-red-500 transition">
      Excluir
    </button>
  </div>
  `

  return card;
}

function openCreationModal() {
  taskInEditing = null;
  document.getElementById("task-modal-title").innerText = "Nova Tarefa";
  openTaskModal();
}

function openEditingModal(id) {
  taskInEditing = tasks.find(task => task.id === id);

  document.getElementById("task-name").value = taskInEditing.name;
  document.getElementById("task-cost").value = formatCurrency(taskInEditing.cost);
  document.getElementById("task-deadline").value = taskInEditing.deadline.split("T")[0];

  document.getElementById("task-modal-title").innerText = "Editar Tarefa";
  openTaskModal();
}

function openTaskModal() {
  document.getElementById("task-modal").classList.remove("hidden");
}

function closeTaskModal() {
  document.getElementById("task-name").value = "";
  document.getElementById("task-cost").value = "";
  document.getElementById("task-deadline").value = "";

  document.getElementById("task-modal-error").classList.add("hidden");

  document.getElementById("task-modal").classList.add("hidden");
}

async function save() {
  try {
      let inputcost = document.getElementById("task-cost").value;
      let costFormatted = inputcost.replace("R$", "").replace(/\./g, "").replace(",", ".");
      const data = {
      name: document.getElementById("task-name").value,
      cost: Number(costFormatted),
      deadline: document.getElementById("task-deadline").value
    };

    let response;
    if (taskInEditing) {
      response = await editTask(taskInEditing.id, data);
    }
    else {
      response = await createTask(data);
    }

    if (!response.ok) {
      const error = await response.json();
      showModalError(error.error);
      return;
    }

    closeTaskModal();
    await load();
  }
  catch (error) {
    console.log(error);
    alert("Erro invesperado");
  }
}

async function deleteT(id) {
  await deleteTask(id);
  await load();
}

function showModalError(msg) {
  const elem = document.getElementById("task-modal-error");
  console.log(elem);
  elem.innerText = msg;
  elem.classList.remove("hidden");
}

function openConfirmModal(id) {
  document.getElementById("confirm-button").setAttribute("onclick", `modalConfirm(${id})`);
  document.getElementById("confirm-modal").classList.remove("hidden");
}

async function modalConfirm(id) {
  await deleteT(id);
  closeConfirmModal();
}

async function closeConfirmModal() {
  document.getElementById("confirm-modal").classList.add("hidden");
}

load();