function initDragAndDrop() {
  const table = document.getElementById("table-body");

  if (!table) return;

  new Sortable(table, {

    animation: 150,
    ghostClass: "opacity-150",
    chosenClass: "scale-101",

    async onEnd() {
      await updateTasksOrder();
    }
  });
}

async function updateTasksOrder() {
  const table = document.getElementById("table-body");

  const tableRows = [...table.children];

  const newOrder = tableRows.map((row, index) => ({
    id: Number(row.dataset.id),
    order: index + 1
  }));

  try {
    await saveTasksOrder(newOrder);
  }
  catch (error) {
    console.error("Erro ao atualizar ordem", error);
  }
}