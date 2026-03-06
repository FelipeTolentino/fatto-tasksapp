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
  const tableBody = document.getElementById("table-body");
  tableBody.innerHTML = "";

  let total = 0;

  tasks.forEach(task => {
    total += task.cost;
    
    tableBody.appendChild(renderTask(task));
  });

  document.getElementById("total").innerText = 
    "Total: " + formatCurrency(total);

  initDragAndDrop();
}

function renderTask(task) {
  const tableRow = document.createElement("tr");

  tableRow.dataset.id = task.id;

  if (task.cost >= 1000) {
   tableRow.classList.add("expensive")
   tableRow.classList.add("cursor-grab")
  }

  tableRow.innerHTML = `
    <td class=" items-center">
      <button onclick="moveUp(${task.id})" class="">⬆️</button>
       <button onclick="moveDown(${task.id})" class="">⬇️</button>
    </td>
    <td class="text-center">${task.id}</td>
    <td class="whitespace-nowrap">${task.name}</td>
    <td class="whitespace-nowrap">${formatCurrency(task.cost)}</td>
    <td class="text-center">${formatDate(task.deadline)}</td>
    <td class="gap-3 justify-center flex items-center">
      <button onclick="openEditingModal(${task.id})"
        class="bg-orange-300 px-3 py-1 rounded-2xl hover:bg-orange-400 transition">
        Editar
      </button>
      <button onclick="openConfirmModal(${task.id})"
        class="bg-red-400 text-white px-3 py-1 rounded-2xl hover:bg-red-500 transition">
        Excluir
      </button>
    </td>
  `

  return tableRow;
}

function openCreationModal() {
  taskInEditing = null;
  document.getElementById("task-modal-title").innerText = "Nova Tarefa";
  
  requestAnimationFrame(() => {
    document.getElementById("task-name").focus();
  });
  
  openTaskModal();
}

function openEditingModal(id) {
  taskInEditing = tasks.find(task => task.id === id);

  document.getElementById("task-name").value = taskInEditing.name;
  document.getElementById("task-cost").value = formatCurrency(taskInEditing.cost);
  document.getElementById("task-deadline").value = taskInEditing.deadline.split("T")[0];

  document.getElementById("task-modal-title").innerText = "Editar Tarefa";

  requestAnimationFrame(() => {
    document.getElementById("task-name").focus();
  });

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

  elem.innerText = msg;
  elem.classList.remove("hidden");
}

function openConfirmModal(id) {
  const confirmBtn = document.getElementById("confirm-button").setAttribute("onclick", `modalConfirm(${id})`);
  document.getElementById("confirm-modal").classList.remove("hidden");

 requestAnimationFrame(() => {
    document.getElementById("cancel-button").focus();
  });
}

async function modalConfirm(id) {
  await deleteT(id);
  closeConfirmModal();
}

async function closeConfirmModal() {
  document.getElementById("confirm-modal").classList.add("hidden");
}

async function moveUp(id) {
  const table = document.getElementById("table-body");
  const tableRow = table.querySelector(`[data-id='${id}']`);

  if (!tableRow) return;

  const prev = tableRow.previousElementSibling;
  if (prev) {
    table.insertBefore(tableRow, prev);
    updateTasksOrder();
  }
}

async function moveDown(id) {
  const table = document.getElementById("table-body");
  const tableRow = tasks.querySelector(`[data-id='${id}']`);

  if (!tableRow) return;

  const next = tableRow.nextElementSibling;
  if (next) {
    table.insertBefore(next, card);
    updateTasksOrder();
  }
}

load();